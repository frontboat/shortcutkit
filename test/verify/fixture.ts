// Drives the library over every catalogue action and every parameter key with every value form
// the types allow, plus whole shortcuts built through the block helpers, and writes what the
// library produced. tools/verify-library-output.js then loads all of it through the engine.
//   bun test/verify/fixture.ts out.json
import { Shortcut, actions, ACTIONS, PARAM_KINDS, PARAM_CHOICES, PARAM_VARIABLE_TYPES, FILTERS, FILTER_OPERATORS, CALENDAR_UNITS, BOUNDED_FILTERS, ENTITY_PROPERTIES, CONTENT_ITEM_CLASSES, CONTENT_ITEM_PROPERTIES, ref, text, variable, shortcutInput, clipboard, currentDate, ask, deviceDetails, currentApp, repeatItem, property, where, whereAny, coerce, appIntent } from "../../src/index";
import encodings from "../../data/parameter-encodings.json";

// expect: "read" (the library wrote it, the engine must read it) or "rejected" (the library refuses
// this form for the key, written raw here; the engine must not read it either).
// "deviceValidated": the engine read no plain sample for this key when the data was extracted (it checks the
// value against the device: a locale, a HomeKit home, a contacts group), so a plain value cannot be proven here.
type Case = { identifier: string; key: string; kind: string; form: string; params: Record<string, unknown>; expect: "read" | "rejected" | "deviceValidated" };
type RuntimeParam = { key: string; class: string; reads?: string[]; readsPlain?: boolean; plainSample?: string | number | boolean };
const runtime = (identifier: string, key: string): RuntimeParam | undefined => (encodings.actionParameters as Record<string, RuntimeParam[]>)[identifier]?.find((p) => p.key === key);
const defaults = encodings.actionDefaults as Record<string, Record<string, unknown>>;
const isPlain = (v: unknown): v is string | number | boolean => typeof v === "string" || typeof v === "number" || typeof v === "boolean";
const seed = new Shortcut("Seed");
const source = seed.action(actions.getstoredcontent, { WFStoredContentKey: "seed" });
const REF = ref(source);
// Every reference the library can write, by the variable type the engine names it.
const REFERENCES: Array<[string, unknown]> = [["ref", REF], ["shortcutInput", shortcutInput()], ["variable", variable("MyVar")], ["clipboard", clipboard()], ["currentDate", currentDate()], ["ask", ask("Which?")], ["deviceDetails", deviceDetails()], ["currentApp", currentApp()]];
const typeOf = (v: unknown): string => String((v as { Value: { Type: string } }).Value.Type);
// Every item form dictionary() writes: text, text with a reference, a bare reference, a nested dictionary, an array of
// each, a number, a boolean, and empty ones. action() encodes it for a dictionary key; the engine must write it back as is.
const DICTIONARY = { text: "hello", withReference: text("Hi ", REF), reference: REF, nested: { k: "v", n: 2 }, list: ["x", 7, false, text("hi ", REF), { k: "v" }, ["z"]], number: 5, boolean: true, empty: {}, none: [] };

function samples(identifier: string, key: string, kind: string): Array<[string, unknown]> {
  const choices = (PARAM_CHOICES as Record<string, Record<string, readonly string[]>>)[identifier]?.[key] ?? [];
  // The plain sample: the one the probe loaded (the key's default, else its first possible state), else the engine
  // default, else a choice, else a stand-in.
  const probed = runtime(identifier, key)?.plainSample, dflt = defaults[identifier]?.[key];
  const plain = (fallback: string | number | boolean) => (isPlain(probed) && typeof probed === typeof fallback ? probed : isPlain(dflt) && typeof dflt === typeof fallback ? dflt : fallback);
  switch (kind) {
    case "bool": return [["bool", plain(true)], ...REFERENCES];
    case "number": return [["number", plain(5)], ...REFERENCES];
    case "string": return [["string", plain(choices[0] ?? "hello")], ...REFERENCES];
    case "text": return [["string", plain("hello")], ["text+ref", text("Hi ", REF)], ...REFERENCES];
    case "picker": return REFERENCES.filter(([f]) => f !== "ask");
    case "subject": return [["ref", REF]];
    case "plainString": return [["string", "hello"]];
    case "plainNumber": return [["number", 5]];
    case "dictionary": return [["dictionary", DICTIONARY]];
    default: return []; // quantity, filter, any: no single form is promised by the type
  }
}

// Legacy keys the engine only reads as a set (If's WFInput/WFCondition/…, Choose from Menu's);
// they are exercised through the helpers in the whole shortcuts below, not one key at a time.
const LEGACY: Record<string, string[]> = {
  "is.workflow.actions.conditional": ["WFInput", "WFCondition", "WFConditionalActionString", "WFNumberValue", "WFConditionalLegacyComparisonBehavior", "WFEnumerationValue", "WFBooleanValue", "WFDate", "WFAnotherDate", "WFDuration"],
  "is.workflow.actions.choosefrommenu": ["WFMenuPrompt", "WFMenuItems", "WFMenuItemTitle", "WFMenuItemAttributedTitle"],
};
const cases: Case[] = [];
for (const identifier of Object.keys(ACTIONS)) {
  const kinds = (PARAM_KINDS as Record<string, Record<string, string>>)[identifier] ?? {};
  for (const [key, kind] of Object.entries(kinds)) {
    if ((LEGACY[identifier] ?? []).includes(key)) continue;
    const allowed = (PARAM_VARIABLE_TYPES as Record<string, Record<string, readonly string[]>>)[identifier]?.[key];
    for (const [form, value] of samples(identifier, key, kind)) {
      const isRef = typeof value === "object" && value !== null && (value as { WFSerializationType?: string }).WFSerializationType === "WFTextTokenAttachment";
      if (allowed && isRef && !allowed.includes(typeOf(value))) {
        // The library refuses this; write it raw so the verifier can confirm the engine refuses it too.
        cases.push({ identifier, key, kind, form, params: { [key]: value }, expect: "rejected" });
        continue;
      }
      if (allowed && form === "text+ref") continue; // a token string embedding a reference is refused for the same reason
      const s = new Shortcut("Case");
      const a = s.action(identifier, { [key]: value } as never);
      const params = { ...a.WFWorkflowActionParameters }; delete (params as Record<string, unknown>).UUID;
      cases.push({ identifier, key, kind, form, params, expect: isPlain(value) && runtime(identifier, key)?.readsPlain === false ? "deviceValidated" : "read" });
    }
  }
}

// Find filters: every property of every Find action with FILTERS, every operator it offers, and each value form
// (plain, and a reference where the row takes one), through where(); then one whereAny() row set per action.
type FilterCase = { identifier: string; form: string; filter: unknown };
const filterCases: FilterCase[] = [];
const DATE = new Date("2026-01-01T00:00:00Z");
const PLAIN: Record<string, unknown> = { text: "hello", email: "a@b.co", phone: "+15555550100", contactHandle: "+15555550100", number: 5, bool: true, date: DATE };
const operatorName = (code: number) => Object.keys(FILTER_OPERATORS).find((n) => FILTER_OPERATORS[n as keyof typeof FILTER_OPERATORS] === code)!;
function rowForms(prop: string, op: string, kind: string, units: readonly number[], choices: readonly string[]): Array<[string, unknown[]]> {
  if (op === "is_today") return [["none", [prop, op]]];
  if (op === "is_in_the_last" || op === "is_in_the_next") {
    const unit = Object.keys(CALENDAR_UNITS).find((u) => units.includes(CALENDAR_UNITS[u as keyof typeof CALENDAR_UNITS]))!;
    return [["number+unit", [prop, op, 5, unit]], ["ref+ref", [prop, op, REF, REF]]];
  }
  if (op === "is_between") return [["plain+plain", [prop, op, PLAIN[kind], PLAIN[kind]]], ["ref+ref", [prop, op, REF, REF]]];
  // Durations count calendar units, file sizes byte-count units; the unit may be a reference too.
  if (kind === "duration") return [["number+unit", [prop, op, 5, Object.keys(CALENDAR_UNITS).find((u) => !units.length || units.includes(CALENDAR_UNITS[u as keyof typeof CALENDAR_UNITS]))!]], ["ref+ref", [prop, op, REF, REF]]];
  if (kind === "fileSize") return [["number+unit", [prop, op, 5, "MB"]], ["ref+ref", [prop, op, REF, REF]]];
  // An enumeration takes one of its choices (any string when the engine lists none) or a reference.
  if (kind === "enumeration" || kind === "enumCase") return [["plain", [prop, op, choices[0] ?? "x"]], ["ref", [prop, op, REF]]];
  return [["plain", [prop, op, PLAIN[kind]]], ["ref", [prop, op, REF]], ...(["text", "email", "phone", "contactHandle"].includes(kind) ? [["text+ref", [prop, op, text("Hi ", REF)]] as [string, unknown[]]] : [])];
}
// A Find action that needs a bounded date row (BOUNDED_FILTERS) gets one added to every case that lacks it.
function withBounded(identifier: string, rows: unknown[][]): unknown[][] {
  const b = (BOUNDED_FILTERS as Record<string, { property: string; operators: readonly number[] }>)[identifier];
  if (!b || rows.some((r) => r[0] === b.property && b.operators.includes(FILTER_OPERATORS[r[1] as keyof typeof FILTER_OPERATORS]))) return rows;
  return [...rows, [b.property, "is_in_the_next", 7, "days"]];
}
for (const [identifier, props] of Object.entries(FILTERS as Record<string, Record<string, { operators: readonly number[]; values: string; units?: readonly number[]; choices?: readonly string[] }>>)) {
  const first: unknown[][] = [];
  for (const [prop, p] of Object.entries(props)) {
    for (const code of p.operators) {
      const forms = rowForms(prop, operatorName(code), p.values, p.units ?? [], p.choices ?? []);
      if (first.length < Object.keys(props).indexOf(prop) + 1) first.push(forms[0]![1]);
      for (const [form, row] of forms) {
        const a = new Shortcut("Case").action(identifier, { WFContentItemFilter: where(...(withBounded(identifier, [row]) as never[])) } as never);
        filterCases.push({ identifier, form: `${prop} ${operatorName(code)} ${form}`, filter: a.WFWorkflowActionParameters.WFContentItemFilter });
      }
    }
  }
  const a = new Shortcut("Case").action(identifier, { WFContentItemFilter: whereAny(...(withBounded(identifier, first) as never[])) } as never);
  filterCases.push({ identifier, form: "any of each property", filter: a.WFWorkflowActionParameters.WFContentItemFilter });
}
// Properties: every property of every entity type, through property() on an action that outputs it.
type PropertyCase = { entity: string; property: string; attachment: unknown };
const propertyCases: PropertyCase[] = [];
const producers = new Shortcut("Producers");
for (const [entity, props] of Object.entries(ENTITY_PROPERTIES as Record<string, readonly string[]>)) {
  const by = entity in ACTIONS ? entity : Object.keys(ACTIONS).find((id) => (ACTIONS as Record<string, { outputTypes: readonly string[] }>)[id]!.outputTypes.includes(entity));
  if (!by) continue;
  const a = producers.action(by, {} as never);
  for (const name of props) propertyCases.push({ entity, property: name, attachment: property(a as never, name) });
}

// Coercions: every content item class the engine lists, through coerce().
type CoercionCase = { class: string; attachment: unknown };
const coercionCases: CoercionCase[] = Object.keys(CONTENT_ITEM_CLASSES).map((cls) => ({ class: cls, attachment: coerce(REF, cls as keyof typeof CONTENT_ITEM_CLASSES) }));
// Class properties: every property of every content item class, through property() on a coerce()d reference.
type ClassPropertyCase = { class: string; property: string; attachment: unknown };
const classPropertyCases: ClassPropertyCase[] = [];
for (const [cls, names] of Object.entries(CONTENT_ITEM_PROPERTIES as Record<string, readonly string[]>)) for (const name of names) classPropertyCases.push({ class: cls, property: name, attachment: property(coerce(REF, cls as never) as never, name as never) });

// Whole shortcuts through the helpers: control flow, loop variables, share sheet, text wrapping.
const s = new Shortcut("Blocks", { color: "Teal", types: ["ActionExtension"], inputClasses: ["WFSafariWebPageContentItem", "WFURLContentItem"] });
const got = s.action(actions.getstoredcontent, { WFStoredContentKey: "k" });
const c = s.if(ref(got), "has_any_value");
const loop = s.repeatEach(ref(got));
s.action(actions.downloadurl, { WFURL: repeatItem() });
const results = s.endRepeatEach(loop);
s.action(actions.previewdocument, { WFInput: ref(results) });
s.otherwise(c);
const n = s.repeatCount(3);
s.action(actions.showresult, { Text: text("tick ", repeatItem()) });
s.endRepeatCount(n);
s.endIf(c);
// Every If form the helper can write.
const c2 = s.if(ref(got), "is", "hello"); s.action(actions.showresult, { Text: text("is") }); s.endIf(c2);
const c3 = s.if(ref(got), "less_than", 5); s.action(actions.showresult, { Text: text("lt") }); s.endIf(c3);
const c4 = s.if(shortcutInput(), "contains", "x"); s.action(actions.showresult, { Text: text("has") }); s.otherwise(c4); s.endIf(c4);
const m = s.chooseFromMenu("Pick", ["A", "B"]);
s.menuItem(m, "A"); s.action(actions.showresult, { Text: ref(got) });
s.menuItem(m, "B"); s.action(actions.showresult, { Text: shortcutInput() });
s.endMenu(m);
s.action(actions.notes_create_note, { name: "n", contents: text("c ", ref(got)) });
const found = s.action("com.apple.MobileSMS.MessageEntity", { WFContentItemFilter: where(["date", "is_in_the_last", 7, "days"], ["author", "is", ref(got)]) });
const each = s.repeatEach(ref(found));
s.action(actions.showresult, { Text: text(property(repeatItem(), "body"), " ", property(found, "date")) });
s.endRepeatEach(each);
// A dictionary given plain, a coerced If subject, and another app's action with its descriptor.
const dict = s.action(actions.dictionary, { WFItems: { greeting: text("Hi ", ref(got)), count: 1, tags: ["a", "b"] } });
s.action(actions.downloadurl, { WFURL: "https://example.com/api", WFHTTPMethod: "POST", WFHTTPHeaders: { Accept: "application/json" }, WFJSONValues: { body: ref(dict), ok: true } });
const c5 = s.if(coerce(ref(dict), "WFStringContentItem"), "contains", "a"); s.endIf(c5);
const other = s.action(appIntent({ BundleIdentifier: "com.example.app", Name: "Example", TeamIdentifier: "ABCDE12345" }, "CreateNoteIntent", "Note"), { title: text("Hello ", ref(got)) });
s.action(actions.showresult, { Text: coerce(other, "WFStringContentItem") });
const shortcuts = [{ name: "Blocks", plist: s.toPlist(), actionCount: s.actions.length }];

const out = process.argv[2];
if (!out) throw new Error("usage: bun test/verify/fixture.ts out.json");
// Dates cross JSON as { $date } (whole seconds, UTC), which fixture.py writes too and the verifier revives.
function dates(this: unknown, key: string, value: unknown) {
  const raw = (this as Record<string, unknown>)[key];
  return raw instanceof Date ? { $date: raw.toISOString().replace(/\.\d{3}Z$/, "Z") } : value;
}
await Bun.write(out, JSON.stringify({ cases, filterCases, propertyCases, coercionCases, classPropertyCases, shortcuts }, dates, 1));
console.log(cases.length, "parameter cases across", new Set(cases.map((x) => x.identifier)).size, "actions;", filterCases.length, "filters across", Object.keys(FILTERS).length, "Find actions;", propertyCases.length, "properties;", coercionCases.length, "coercions;", classPropertyCases.length, "class properties;", shortcuts.length, "whole shortcuts ->", out);
