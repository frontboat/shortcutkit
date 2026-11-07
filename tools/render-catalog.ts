// Render the shared canonical snapshot; joins and evidence classification belong in the generator.
//   bun run tools/render-catalog.ts [out-path]
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CatalogAction, CatalogModel, CatalogParameter, CatalogTypeInfo } from "../src/catalog.js";

// Shared generation passes a staged model explicitly, so it can repair missing generated files.
const readPreparedModel = (): CatalogModel => JSON.parse(readFileSync(join(import.meta.dir, "..", "src", "generated", "catalog.json"), "utf8"));

const VARIABLE_TYPES = ["ActionOutput", "ExtensionInput", "Variable", "Clipboard", "CurrentDate", "Ask", "DeviceDetails", "CurrentApp"];
const squash = (s: string) => s.replace(/\s+/g, " ").trim();
const literal = (v: unknown): string => typeof v === "string" && !/\s/.test(v) ? v : JSON.stringify(v);
const unique = (items: readonly string[]) => [...new Set(items)];
const compare = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;

function propertyType(info: CatalogTypeInfo | undefined, fallback: string): string {
  if (!info) return fallback;
  let type = fallback;
  if (info.kind === "array" && !Array.isArray(info.of)) type = propertyType(info.of, fallback.endsWith("[]") ? fallback.slice(0, -2) : "unknown") + "[]";
  else if (info.kind === "union" && Array.isArray(info.of)) type = `(${info.of.map((choice) => propertyType(choice, "unknown")).join(" | ")})`;
  else if ((info.kind === "entity" || info.kind === "enum") && typeof info.type === "string") type = info.type;
  else if (info.kind === "primitive" && typeof info.primitive === "string") type = info.primitive;
  return type + (info.optional === true ? "?" : "");
}

function references(p: CatalogParameter): string {
  if (p.refs.status === "not-probed") return "unknown (not probed per key)";
  const allowed = p.refs.allowed;
  if (!allowed) throw new Error("measured reference evidence has no allowed kinds");
  if (!allowed.length) return "none (measured reference kinds)";
  const missing = VARIABLE_TYPES.filter((t) => !allowed.includes(t));
  const kinds = !missing.length ? "any" : missing.length <= 2 ? `any except ${missing.join(", ")}` : allowed.join(", ");
  return `${kinds} (measured)`;
}

function outputTypes(action: CatalogAction): string[] {
  return unique([
    ...action.outputTypes,
    ...(action.outputClasses ?? []),
    ...Object.values(action.outputClassesBy ?? {}).flatMap((choices) => Object.values(choices).flat()),
  ]).filter((t) => t !== "none");
}

/** Declared type relationships only. No inference that every runtime coercion will succeed. */
function relationships(model: CatalogModel) {
  const accepts = new Map<string, string[]>();
  const produces = new Map<string, string[]>();
  const add = (index: Map<string, string[]>, type: string, value: string) => {
    const entries = index.get(type) ?? [];
    if (!entries.includes(value)) entries.push(value);
    index.set(type, entries);
  };
  for (const action of Object.values(model.actions)) {
    for (const type of action.inputTypes) add(accepts, type, `${action.identifier}(input:${action.inputKey ?? "WFInput"})`);
    for (const [key, parameter] of Object.entries(action.parameters)) {
      if (parameter.entityType) add(accepts, parameter.entityType, `${action.identifier}.${key}`);
    }
    for (const type of outputTypes(action)) add(produces, type, action.identifier);
  }
  return { accepts, produces };
}

function paramLine(action: CatalogAction, key: string): string {
  const p = action.parameters[key];
  if (!p) throw new Error(`${action.identifier}: missing parameter metadata for ${key}`);
  const choices = p.choices.map((id) => p.choiceTitles[id] ? `${p.choiceTitles[id]} (${id})` : id);
  const rules = action.requires[key]?.map((r) => `${r.key} ${r.relation} ${r.values.map(literal).join("|")}`.trim());
  return "  " + [
    key,
    p.kind + (p.label ? ` ${JSON.stringify(p.label)}` : ""),
    `kind source: ${p.kindSource}`,
    p.entityType ? `entity ${p.entityType}` : p.entityStatus === "unresolved" ? "entity: unresolved in extracted metadata" : undefined,
    choices.length ? `choices: ${choices.join(" | ")}` : undefined,
    Object.hasOwn(p, "default") ? `default=${literal(p.default)}` : undefined,
    `refs: ${references(p)}`,
    rules?.length ? `only when ${rules.join(" and ")}` : undefined,
    p.description ? `— ${squash(p.description)}` : undefined,
  ].filter(Boolean).join("  ");
}

function filterLines(model: CatalogModel, action: CatalogAction): string[] {
  if (action.filterStatus === "not-applicable") return [];
  if (action.filterStatus === "unresolved") return ["  filter: unresolved (no usable generated rows; source rules may be missing, unmeasured or unsupported; where() is unavailable here)"];
  const rows = model.filters[action.identifier];
  if (!rows) throw new Error(`${action.identifier}: available filter has no generated rows`);
  const operatorNames = new Map(Object.entries(model.filterOperators).map(([name, code]) => [code, name]));
  const out = ["  filter on: " + (action.filterClass || action.outputTypes.join(", ") || "input type not declared")];
  for (const [id, row] of Object.entries(rows)) {
    const entity = action.outputTypes.map((type) => model.entities[type]).find(Boolean);
    const name = entity?.properties[id]?.name;
    out.push(`      ${id}${name && name !== id ? ` ${JSON.stringify(name)}` : ""}  ${row.values}${row.choices?.length ? ` of ${row.choices.join(" | ")}` : ""}  ${row.operators.map((op) => operatorNames.get(op) ?? op).join(" | ")}${row.units?.length ? `  units: ${row.units.join(", ")}` : ""}`);
  }
  const bounded = model.boundedFilters[action.identifier];
  if (bounded) out.push(`  filter requires: ${bounded.property}  ${bounded.operators.map((op) => operatorNames.get(op) ?? op).join(" | ")}`);
  return out;
}

function actionRecord(model: CatalogModel, action: CatalogAction, accepts: Map<string, string[]>): string[] {
  const input = action.inputStatus === "named-parameters" ? "named parameters below (no incoming-content declaration)" : action.inputStatus === "not-declared" ? "not declared in definition" : `${action.inputTypes.join(", ") || "types not declared"}${action.inputKey ? ` as ${action.inputKey}` : ""}${action.inputRequired ? " (required)" : ""}`;
  const declared = action.outputTypes.filter((t) => t !== "none");
  const noneDeclared = !declared.length && action.outputTypes.includes("none");
  const output = noneDeclared ? "none (declared)" : action.output ? `${action.output} (${declared.join(", ") || "type not declared"})` : declared.length ? `unnamed (${declared.join(", ")})` : "not declared";
  const evidence = action.descriptionEvidence;
  const lines = [
    `## ${action.key} · ${squash(action.name)} · ${action.app.name || action.app.bundleIdentifier || "Shortcuts"}`,
    `in: ${input}   out: ${output}   kw: ${action.keywords.length ? action.keywords.join(", ") : `none in ${evidence.source}`}   id: ${action.identifier}`,
    `origin: ${action.origin}`,
    `description: ${evidence.summary === "present" ? squash(action.description) : `none in ${evidence.source}`}`,
  ];
  if (action.app.bundleIdentifier) lines.push(`app bundle: ${action.app.bundleIdentifier}`);
  if (noneDeclared && action.output) lines.push(`output label: ${action.output}`);
  if (evidence.note === "present") lines.push(`description note: ${squash(action.descriptionNote)}`);
  if (evidence.result === "present") lines.push(`description result: ${squash(action.descriptionResult)}`);
  lines.push(`output classes (default): ${action.outputEvidence.status === "not-probed" ? "unknown (not probed)" : action.outputClasses.join(", ") || "none (measured)"}`);
  for (const [key, choices] of Object.entries(action.outputClassesBy ?? {})) {
    for (const [choice, classes] of Object.entries(choices)) lines.push(`output when ${key} = ${literal(choice)}: ${classes.join(", ") || "none"}`);
  }
  const notes = [action.discontinued ? "DISCONTINUED" : undefined, action.unavailable ? "unavailable" : undefined, action.disabledOn.length ? `not on ${action.disabledOn.join(", ")}` : undefined, action.requiresUnlock ? "requires unlock" : undefined].filter(Boolean);
  if (notes.length) lines.push(`note: ${notes.join(" | ")}`);
  for (const key of action.params) lines.push(paramLine(action, key));
  lines.push(...filterLines(model, action));
  const accepted = unique(outputTypes(action).flatMap((type) => accepts.get(type) ?? []));
  if (accepted.length) lines.push(`→ accepted by: ${accepted.join(", ")}`);
  return lines;
}

export function renderCatalog(model: CatalogModel = readPreparedModel()): string {
  const { accepts, produces } = relationships(model);
  const actions = Object.values(model.actions).sort((a, b) => compare(a.origin, b.origin) || compare(a.app.name ?? a.app.bundleIdentifier ?? "", b.app.name ?? b.app.bundleIdentifier ?? "") || compare(a.name, b.name) || compare(a.identifier, b.identifier));
  const p = model.provenance;
  const header = [
    `# shortcutkit catalogue: ${actions.length} actions, ${Object.keys(model.entities).length} entity types; schema ${model.schemaVersion}; macOS ${p.macOS.version} (${p.macOS.build}), Shortcuts ${p.shortcutsApp.version} (${p.shortcutsApp.build}), extracted ${p.extractedAt}.`,
    "# Generated from the shared canonical catalogue snapshot. Do not edit; bun run generate refreshes both packages and this reference.",
    '# "## <key> · <Name> · <App>" starts an action; "## entity <full identifier> · …" starts an entity; "## content <class> · …" starts a content item class. Records are separated by one blank line.',
    '# "in:" is declared incoming content or named parameters; parameter rows carry value kinds, kind sources, defaults, reference evidence and visibility rules. "out:" is the declared output; output classes describe measured defaults and choice-dependent results.',
    '# Relationships use full identifiers and exact declared input/entity types and declared or measured output types, including generic types. Content coercion targets are extracted possibilities, not guarantees for a particular runtime value. Nothing is truncated; absent source metadata and unprobed references are explicit.',
  ];
  const entities = Object.entries(model.entities).sort(([a], [b]) => compare(a, b)).map(([id, entity]) => {
    const lines = [
      `## entity ${id} · ${squash(entity.name)} · ${entity.app || entity.bundleIdentifier || "unknown"}`,
      `id: ${id}${entity.find ? `   find: ${entity.find}` : ""}`,
      `properties: ${Object.entries(entity.properties).map(([key, prop]) => `${key}:${propertyType(prop.typeInfo, prop.type)}`).join(", ") || "none in extracted metadata"}`,
    ];
    const produced = produces.get(id);
    const accepted = accepts.get(id);
    if (produced?.length) lines.push(`← produced by: ${produced.join(", ")}`);
    if (accepted?.length) lines.push(`→ accepted by: ${accepted.join(", ")}`);
    return lines;
  });
  const content = Object.entries(model.contentItemClasses).sort(([a], [b]) => compare(a, b)).map(([id, cls]) => {
    const lines = [
      `## content ${id} · ${cls.name ? squash(cls.name) : "name absent from extracted metadata"} · Shortcuts`,
      `id: ${id}   superclass: ${cls.superclass || "none"}   coercible: ${cls.coercible}`,
      `owned types: ${cls.ownedTypes.map((type) => `${type.kind}:${type.name}`).join(", ") || "none in extracted metadata"}`,
      `coercion targets: ${cls.coercesTo.join(", ") || "none in extracted metadata"}`,
    ];
    for (const prop of cls.properties) lines.push(`  property ${JSON.stringify(prop.name)}: ${prop.valueClass || "value class unknown"}  yields: ${prop.yields.join(", ") || "not declared"}  gettable: ${prop.gettable}  filterable: ${prop.filterable}  sortable: ${prop.sortable}  multiple: ${prop.multiple}${prop.userInfo !== null ? `  userInfo: ${literal(prop.userInfo)}` : ""}`);
    if (!cls.properties.length) lines.push("properties: none in extracted metadata");
    const types = [id, ...Object.entries(model.contentItemTypes).filter(([, owner]) => owner === id).map(([type]) => type)];
    const produced = unique(types.flatMap((type) => produces.get(type) ?? []));
    const accepted = unique(types.flatMap((type) => accepts.get(type) ?? []));
    if (produced.length) lines.push(`← produced by: ${produced.join(", ")}`);
    if (accepted.length) lines.push(`→ accepted by: ${accepted.join(", ")}`);
    return lines;
  });
  return [header, ...actions.map((action) => actionRecord(model, action, accepts)), ...entities, ...content].map((lines) => lines.join("\n")).join("\n\n") + "\n";
}

export function writeCatalog(path: string, model: CatalogModel = readPreparedModel()): void {
  writeFileSync(path, renderCatalog(model));
}

if (import.meta.main) {
  const out = process.argv[2] ?? join(import.meta.dir, "..", "docs", "catalog.txt");
  writeCatalog(out);
  console.log(`wrote ${out}`);
}
