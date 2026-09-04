// Round-trips every value form the library can write through the engine's own parsers.
//
// Each parameter state class implements -initWithSerializedRepresentation:variableProvider:parameter:
// and -serializedRepresentation. Feeding it a value and reading it back tells whether Shortcuts can
// load what shortcutkit writes: a class that returns nil for a form does not read it (the editor
// then shows an empty placeholder). The result table is written to data/encoding-roundtrips.json,
// and the pipeline fails if a form the library emits for a value kind is rejected by the state
// class behind that kind. This is what catches a wrong encoding before it ships: the wrapped
// { Type: "Variable", Variable: … } form is accepted only by the If subject's state, never by a
// variable picker's, and a bare attachment is rejected by every text state.
//
//   cat tools/jxa-prelude.js tools/verify-encodings.js > /tmp/x.js
//   osascript -l JavaScript /tmp/x.js data/parameter-encodings.json data/encoding-table.json data/encoding-roundtrips.json
function attempt(fn) { try { return fn(); } catch (e) { return "threw: " + e.message.slice(0, 80); } }
function canonical(v) { return JSON.stringify(v, (k, x) => (x && typeof x === "object" && !Array.isArray(x)) ? Object.keys(x).sort().reduce((o, key) => (o[key] = x[key], o), {}) : x); }
// What Shortcut.action() writes for each value kind (after its own wrapping), and which forms the
// state class behind the kind must therefore accept.
const EXPECT = {
  picker:      { states: ["WFVariableParameterState"], forms: ["attachment(variable)", "attachment(output)"] },
  subject:     { states: ["WFVariableConditionalSubjectState", "WFConditionalSubjectParameterState"], forms: ["wrappedSubject"] },
  text:        { states: ["WFVariableStringParameterState", "WFURLStringParameterState", "WFDateFieldParameterState"], forms: ["string", "tokenString"] },
  string:      { states: ["WFStringSubstitutableState", "WFLinkEnumerationSubstitutableState"], forms: ["string", "attachment(variable)"] },
  bool:        { states: ["WFBooleanSubstitutableState"], forms: ["bool", "attachment(variable)"] },
  number:      { states: ["WFNumberSubstitutableState", "WFNumberStringSubstitutableState"], forms: ["number", "attachment(variable)"] },
  plainString: { states: ["WFStringParameterState"], forms: ["string"] },
  plainNumber: { states: ["WFNumberParameterState"], forms: ["number"] },
};
function run(argv) {
  if (argv.length < 3) throw new Error("usage: verify-encodings.js parameter-encodings.json encoding-table.json out.json");
  loadEngine();
  const enc = readJSON(argv[0]), table = readJSON(argv[1]);
  const names = new Set(Object.values(enc.parameterClasses).map((e) => e.stateClass).filter((s) => typeof s === "string" && !s.startsWith("_TtGC")));
  for (const e of Object.values(table.appIntentValueTypes || {})) if (e && typeof e === "object" && e.stateClass) names.add(e.stateClass);
  for (const e of Object.values(EXPECT)) for (const s of e.states) names.add(s);
  const attachmentV = { WFSerializationType: "WFTextTokenAttachment", Value: { Type: "Variable", VariableName: "MyVar" } };
  const attachmentO = { WFSerializationType: "WFTextTokenAttachment", Value: { Type: "ActionOutput", OutputUUID: "11111111-2222-3333-4444-555555555555", OutputName: "Stored Content" } };
  const forms = {
    string: "hello", number: 5, bool: true, "attachment(variable)": attachmentV, "attachment(output)": attachmentO,
    tokenString: { WFSerializationType: "WFTextTokenString", Value: { string: "Hello ￼", attachmentsByRange: { "{6, 1}": { Type: "Variable", VariableName: "MyVar" } } } },
    wrappedSubject: { Type: "Variable", Variable: attachmentV },
  };
  const results = {};
  for (const cn of [...names].sort()) {
    if (!hasClass(cn)) { results[cn] = "class not present"; continue; }
    const row = {};
    for (const [label, value] of Object.entries(forms)) {
      row[label] = attempt(() => {
        const st = make(cn, "initWithSerializedRepresentation:variableProvider:parameter:", $(value), null, null);
        if (isNil(st)) return "rejected";
        const back = plain(st.serializedRepresentation, 0);
        return canonical(back) === canonical(value) ? "roundtrip" : "accepted, reserialized as " + JSON.stringify(back).slice(0, 80);
      });
    }
    results[cn] = row;
  }
  const failures = [];
  for (const [kind, e] of Object.entries(EXPECT)) for (const st of e.states) for (const form of e.forms) {
    const r = results[st] && results[st][form];
    if (typeof r !== "string" || r === "rejected" || r.startsWith("threw")) failures.push(`${kind} (${st}) must accept ${form}: ${r}`);
  }
  // The two forms that must not be confused.
  const pick = results.WFVariableParameterState || {};
  if (pick.wrappedSubject !== "rejected") failures.push("WFVariableParameterState unexpectedly accepts the wrapped subject form; the picker rule changed");
  writeJSON(argv[2], { forms: Object.keys(forms), expectations: EXPECT, results });
  console.log(Object.keys(results).length + " state classes round-tripped -> " + argv[2] + (failures.length ? "\nFAILED:\n  " + failures.join("\n  ") : "; every form the library writes is accepted"));
  if (failures.length) throw new Error(failures.length + " encoding expectation(s) failed");
}
