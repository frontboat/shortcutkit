import { describe, expect, test } from "bun:test";
import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { CATALOG, type CatalogAction, type CatalogModel } from "../src/catalog";
import { renderCatalog, writeCatalog } from "../tools/render-catalog";

const rendered = renderCatalog();
const record = (key: string, text = rendered) => {
  const found = text.split("\n\n").find((part) => part.startsWith(`## ${key} ·`));
  if (!found) throw new Error(`missing catalogue record: ${key}`);
  return found;
};
const action = (id: string): CatalogAction => {
  const found = CATALOG.actions[id];
  if (!found) throw new Error(`missing action: ${id}`);
  return found;
};

describe("shared catalogue", () => {
  test("saved text is the canonical model's current rendering", () => {
    expect(readFileSync(join(import.meta.dir, "..", "docs/catalog.txt"), "utf8")).toBe(rendered);
    const dir = mkdtempSync(join(tmpdir(), "shortcutkit-catalog-"));
    try {
      const path = join(dir, "catalog.txt");
      writeCatalog(path);
      expect(readFileSync(path, "utf8")).toBe(rendered);
    } finally {
      rmSync(dir, { recursive: true });
    }
  });

  test("generation can import the renderer without an existing generated model", () => {
    const dir = mkdtempSync(join(tmpdir(), "shortcutkit-render-bootstrap-"));
    try {
      const renderer = join(dir, "render-catalog.ts");
      copyFileSync(join(import.meta.dir, "..", "tools/render-catalog.ts"), renderer);
      const result = Bun.spawnSync([process.execPath, "-e", `const { renderCatalog } = await import(${JSON.stringify(renderer)}); if (typeof renderCatalog !== "function") process.exit(1);`]);
      expect(result.exitCode).toBe(0);
      expect(result.stderr.toString()).toBe("");
    } finally {
      rmSync(dir, { recursive: true });
    }
  });

  test("every action, entity and content item class has an unambiguous record", () => {
    const heads = rendered.split("\n").filter((line) => line.startsWith("## "));
    expect(new Set(heads).size).toBe(heads.length);
    expect(heads.length).toBe(Object.keys(CATALOG.actions).length + Object.keys(CATALOG.entities).length + Object.keys(CATALOG.contentItemClasses).length);
    for (const entry of Object.values(CATALOG.actions)) expect(record(entry.key)).toContain(`id: ${entry.identifier}`);
    for (const id of Object.keys(CATALOG.entities)) expect(record(`entity ${id}`)).toContain(`id: ${id}`);
    for (const id of Object.keys(CATALOG.contentItemClasses)) expect(record(`content ${id}`)).toContain(`id: ${id}`);
    expect(rendered).not.toMatch(/\(\+\d+ more\)/);
  });

  test("references retain measured, unprobed and measured-none distinctions", () => {
    const add = record("additemtolist");
    expect(add).toContain('default=End  refs: any (measured)');
    expect(add).toContain('refs: any except Ask (measured)');
    expect(add).toContain('only when WFInsertPosition = Index');
    expect(record("filter_files")).toContain('refs: none (measured reference kinds)');
    expect(record("reminders_create_reminder")).toContain('refs: unknown (not probed per key)');
    const base = action("is.workflow.actions.additemtolist");
    const key = "WFInsertPosition";
    const parameter = base.parameters[key]!;
    const changed: CatalogModel = { ...CATALOG, actions: { [base.identifier]: { ...base, parameters: { ...base.parameters, [key]: { ...parameter, refs: { status: "not-probed" } } } } } };
    expect(record(base.key, renderCatalog(changed))).toContain('default=End  refs: unknown (not probed per key)');
  });

  test("measurement statuses match the raw probe evidence for every action and parameter", () => {
    const raw = JSON.parse(readFileSync(join(import.meta.dir, "..", "data/parameter-encodings.json"), "utf8")) as {
      actionOutputClasses: Record<string, { classes?: string[] }>;
      actionParameters: Record<string, { key: string; reads?: string[] | null }[]>;
    };
    for (const entry of Object.values(CATALOG.actions)) {
      const output = raw.actionOutputClasses[entry.identifier];
      expect(entry.outputEvidence.status).toBe(output ? "measured" : "not-probed");
      expect(entry.outputClasses).toEqual(output?.classes ?? []);
      const parameters = new Map((raw.actionParameters[entry.identifier] ?? []).map((parameter) => [parameter.key, parameter]));
      for (const [key, parameter] of Object.entries(entry.parameters)) {
        const reads = entry.origin === "builtin" ? parameters.get(key)?.reads : undefined;
        expect(parameter.refs.status).toBe(Array.isArray(reads) ? "measured" : "not-probed");
        if (Array.isArray(reads)) expect(parameter.refs.allowed).toEqual(reads);
        else expect(parameter.refs.allowed).toBeUndefined();
      }
    }
  });

  test("builtin owners match source definitions and named outputs cannot hide an explicit none declaration", () => {
    const definitions = JSON.parse(readFileSync(join(import.meta.dir, "..", "data/builtin-actions.json"), "utf8")) as Record<string, {
      AppDefinition?: { Name?: string | { format?: string }; BundleIdentifier?: string };
    }>;
    for (const [identifier, definition] of Object.entries(definitions)) {
      const entry = action(identifier);
      const rawName = definition.AppDefinition?.Name;
      const name = typeof rawName === "string" ? rawName : rawName?.format ?? null;
      const bundle = definition.AppDefinition?.BundleIdentifier ?? null;
      expect(entry.app).toEqual({ name, bundleIdentifier: bundle });
      const text = record(entry.key);
      expect(text.split("\n")[0]).toBe(`## ${entry.key} · ${entry.name} · ${name || bundle || "Shortcuts"}`);
      if (bundle) expect(text).toContain(`app bundle: ${bundle}`);
    }
    for (const id of ["com.apple.AppKit.InsertIntelligenceText", "com.apple.VoiceMemos.WFAppSettingEntityUpdaterAction", "com.apple.news.WFAppSettingEntityUpdaterAction"]) {
      const entry = action(id);
      expect(entry.outputTypes).toEqual(["none"]);
      const text = record(entry.key);
      expect(text).toContain("out: none (declared)");
      expect(text).toContain(`output label: ${entry.output}`);
      expect(text).not.toContain("type not declared");
    }
  });

  test("missing descriptions do not hide result prose or unresolved metadata", () => {
    const notes = record("notes_find_notes");
    expect(notes).toContain("description: none in registry");
    expect(notes).toContain("description result: The note that match the criteria.");
    expect(record("filter_files")).toContain("description: none in definition");
    expect(rendered).toContain("entity: unresolved in extracted metadata");
    expect(rendered).toContain("filter: unresolved (no usable generated rows;");
    expect(rendered).not.toContain("no engine filter rules for this type");
  });

  test("inputs distinguish incoming content from named parameters; outputs show deciding choices", () => {
    expect(record("downloadurl")).toContain("in: WFURLContentItem as WFURL (required)");
    expect(record("additemtolist")).toContain("in: not declared in definition");
    expect(record("reminders_create_reminder")).toContain("in: named parameters below (no incoming-content declaration)");
    const ask = record("ask");
    expect(ask).toContain("output classes (default): WFStringContentItem");
    expect(ask).toContain("output when WFInputType = Number: WFNumberContentItem");
    expect(ask).toContain("output when WFInputType = Text: WFStringContentItem");
    expect(record("reminders_create_reminder")).toContain("output classes (default): unknown (not probed)");
    const base = action("is.workflow.actions.ask");
    const model: CatalogModel = { ...CATALOG, actions: { [base.identifier]: { ...base, outputClasses: [], outputEvidence: { status: "measured" } } } };
    expect(record("ask", renderCatalog(model))).toContain("output classes (default): none (measured)");
  });

  test("entities, content properties, filter rows and relationships are complete", () => {
    const reminder = record("entity com.apple.reminders.ReminderEntity");
    expect(reminder).toContain("earlyAlert:com.apple.reminders.EarlyAlertEntity?");
    expect(record("entity com.apple.MobileSMS.MessageEntity")).toContain("reaction:(com.apple.MobileSMS.Tapback | richText | string)?");
    for (const key of Object.keys(CATALOG.entities["com.apple.reminders.ReminderEntity"]!.properties)) expect(reminder).toContain(`${key}:`);
    const weather = record("content WFWeatherDataContentItem");
    for (const prop of CATALOG.contentItemClasses.WFWeatherDataContentItem!.properties) expect(weather).toContain(`property ${JSON.stringify(prop.name)}:`);
    expect(weather).toContain("coercion targets: WFDateContentItem, WFLocationContentItem, WFStringContentItem");
    const notes = record("notes_find_notes");
    for (const id of Object.keys(CATALOG.filters["is.workflow.actions.filter.notes"]!)) expect(notes).toContain(`      ${id} `);
    expect(record("reminders_create_reminder")).toContain("entity com.apple.reminders.ListEntity");
    expect(reminder).toContain("com.apple.reminders.TTRCreateReminderAppIntent");
    const base = action("is.workflow.actions.additemtolist");
    const consumers = Object.fromEntries(Array.from({ length: 25 }, (_, i) => {
      const id = `test.consumer${i}`;
      return [id, { ...base, key: `consumer${i}`, identifier: id, inputStatus: "declared" as const, inputTypes: ["WFContentItem"], inputKey: "WFInput" }];
    }));
    const model: CatalogModel = { ...CATALOG, actions: { [base.identifier]: base, ...consumers }, entities: { "test.Entity": { name: "Entity", app: "Test", bundleIdentifier: "test", properties: Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`field${i}`, { name: `Field ${i}`, type: "text" }])) } } };
    const text = renderCatalog(model);
    expect(record(base.key, text)).toContain("test.consumer24(input:WFInput)");
    expect(record("entity test.Entity", text)).toContain("field24:text");
  });
});
