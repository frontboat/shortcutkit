// Drives the library over every catalogue action and every parameter key with every value form
// the types allow, plus whole shortcuts built through the block helpers, and writes what the
// library produced. tools/verify-library-output.js then loads all of it through the engine.
//   bun test/verify/fixture.ts out.json
import { Shortcut, actions, ACTIONS, PARAM_KINDS, PARAM_CHOICES, PARAM_VARIABLE_TYPES, ref, text, variable, shortcutInput, clipboard, currentDate, ask, deviceDetails, currentApp, repeatItem } from "../../src/index";
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
    default: return []; // dictionary, quantity, filter, any: no single form is promised by the type
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
s.action(actions.notes_create_note, { name: "n", content: text("c ", ref(got)) });
const shortcuts = [{ name: "Blocks", plist: s.toPlist(), actionCount: s.actions.length }];

const out = process.argv[2];
if (!out) throw new Error("usage: bun test/verify/fixture.ts out.json");
await Bun.write(out, JSON.stringify({ cases, shortcuts }, null, 1));
console.log(cases.length, "parameter cases across", new Set(cases.map((x) => x.identifier)).size, "actions;", shortcuts.length, "whole shortcuts ->", out);
