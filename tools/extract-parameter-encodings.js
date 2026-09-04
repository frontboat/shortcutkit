// Maps every built-in action parameter to the class that defines how its value is
// serialized in a .shortcut file. Each WFParameter subclass names a "state" class via
// -singleStateClass; that class implements -serializedRepresentation and
// -initWithSerializedRepresentation:variableProvider:parameter:, which is the encoding.
// Also records each parameter's -defaultSerializedRepresentation as a worked example.
// See jxa-prelude.js for why this is JXA.
//
//   cat tools/jxa-prelude.js tools/extract-parameter-encodings.js > /tmp/x.js
//   osascript -l JavaScript /tmp/x.js data/parameter-encodings.json
//
// try/catch is used only at the boundary with private API: a few parameter classes
// throw "must implement -singleStateClass" (they are containers, not values).
// Every reference the library can write, by the variable type the engine names it. Each one is
// loaded through every parameter to record which the engine reads for that key.
const VARIABLE_FORMS = [
  ["ActionOutput", { Type: "ActionOutput", OutputUUID: "11111111-2222-3333-4444-555555555555", OutputName: "Output" }],
  ["ExtensionInput", { Type: "ExtensionInput" }], ["Variable", { Type: "Variable", VariableName: "MyVar" }],
  ["Clipboard", { Type: "Clipboard" }], ["CurrentDate", { Type: "CurrentDate" }], ["Ask", { Type: "Ask", Prompt: "Which?" }],
  ["DeviceDetails", { Type: "DeviceDetails" }], ["CurrentApp", { Type: "CurrentApp" }],
].map(([type, value]) => [type, { WFSerializationType: "WFTextTokenAttachment", Value: value }]);
// Text states never hold a bare attachment; a lone reference is a token string with one placeholder.
const TEXT_STATES = new Set(["WFVariableStringParameterState", "WFURLStringParameterState", "WFDateFieldParameterState"]);
const tokenString = (att) => ({ WFSerializationType: "WFTextTokenString", Value: { string: "\uFFFC", attachmentsByRange: { "{0, 1}": att.Value } } });
// A plain sample per state class, used when the parameter has no default of its own.
const PLAIN_SAMPLE = { WFBooleanSubstitutableState: true, WFNumberSubstitutableState: 5, WFNumberStringSubstitutableState: 5, WFNumberParameterState: 5,
  WFStringSubstitutableState: "hello", WFStringParameterState: "hello", WFVariableStringParameterState: "hello", WFURLStringParameterState: "https://example.com", WFDateFieldParameterState: "hello" };
const isPlain = (v) => typeof v === "string" || typeof v === "number" || typeof v === "boolean";

function run(argv) {
  if (argv.length < 1) { throw new Error("usage: extract-parameter-encodings.js out.json"); }
  loadEngine();
  const provider = klass("WFBundledActionProvider").alloc.init;
  let allActions;
  try { allActions = items(provider.createAllAvailableActionsIncludingMissingActions(true)); }
  catch (e) { throw new Error("createAll threw: " + e.message); }
  const intentActions = items(klass("WFIntentActionProvider").alloc.init.createAllAvailableActions);
  console.log("createAllAvailableActionsIncludingMissingActions: " + count(allActions) + " bundled + " + count(intentActions) + " intent-provider actions");
  // Walk in identifier order so usedBy/defaultExamples are deterministic across runs.
  const actions = [];
  for (let i = 0; i < count(allActions); i++) actions.push(allActions.objectAtIndex(i));
  for (let i = 0; i < count(intentActions); i++) {
    const a = intentActions.objectAtIndex(i);
    const def = a.definition; const app = isNil(def) ? null : def.valueForKey("_definition").objectForKey("AppDefinition");
    const bundle = isNil(app) ? null : app.objectForKey("BundleIdentifier");
    if (isSystemBundle(isNil(bundle) ? null : str(bundle))) actions.push(a);
  }
  actions.sort((a, b) => str(a.identifier).localeCompare(str(b.identifier)));
  const byParamClass = {}, actionParameters = {}, actionOutputNames = {}, actionDefaults = {}, unavailableActions = [];
  let created = 0, params = 0, failed = 0;
  for (const action of actions) {
    const ident = str(action.identifier);
    // Definitions whose action class the engine cannot load (retired integrations): the app shows
    // them as missing actions and reads none of their parameters.
    try { if (action.isMissing) unavailableActions.push(ident); } catch (e) { /* not an action */ }
    // The output name the editor shows ("Provided Input" for Ask for Input). ActionKit's actions
    // declare it in code, so it is missing from their definitions; the action object knows it.
    try { const n = action.outputName; if (!isNil(n)) actionOutputNames[ident] = str(n); } catch (e) { /* no output */ }
    let plist;
    try { plist = action.parameters; } catch (e) { failed++; continue; }
    created++;
    const keys = [];
    for (let j = 0; j < count(plist); j++) {
      const p = plist.objectAtIndex(j); params++;
      const pc = cls(p);
      const key = p.key;
      if (!key.isNil() && isA(key, "NSString")) {
        // Which variable kinds the parameter accepts (-supportedVariableTypes): the editor offers
        // only these, and a serialized reference of another kind is not read. Enumerations that
        // drive an action's shape (Filter's sort keys) accept none; some accept only Ask.
        let variableTypes = null;
        try { const sv = p.supportedVariableTypes; variableTypes = isNil(sv) ? [] : plain(sv.allObjects, 0).slice().sort(); } catch (e) { variableTypes = null; }
        keys.push(variableTypes === null ? { key: str(key), class: pc } : { key: str(key), class: pc, variableTypes });
      }
      let sc = null, dflt = null;
      try { sc = str($.NSStringFromClass(p.singleStateClass)); dflt = p.defaultSerializedRepresentation; } catch (e) { /* container parameter without a value state */ }
      // What the engine actually reads, which is what the types must say: load each reference form
      // through the action and keep the ones that produce a parameter state. The editor's picker list
      // above is narrower for many enumerations (it offers only Ask) yet the engine reads any reference.
      if (!isNil(key) && isA(key, "NSString") && !unavailableActions.includes(ident)) {
        const k = str(key), reads = [];
        for (const [type, att] of VARIABLE_FORMS) {
          const value = TEXT_STATES.has(sc) ? tokenString(att) : att;
          let ok = false;
          try { const a = action.copyWithSerializedParameters($({ UUID: "00000000-0000-4000-8000-000000000001", [k]: value })); ok = !isNil(a) && !isNil(a.parameterStateForKey(k)); } catch (e) { ok = false; }
          if (ok) reads.push(type);
        }
        keys[keys.length - 1].reads = reads;
        // Whether a plain value is read: the parameter's own default when it has one, else its first
        // choice, else a sample for its state class. Keys that read neither validate the value against the device (a locale, a
        // HomeKit home, a contacts group), which no fixture can satisfy everywhere.
        const pd = plain(dflt, 0);
        let choice;
        // Enumerations list their choices as state objects; the first one's serialized form is the exact value.
        try { if (p.respondsToSelector("possibleStates")) { const ps = p.possibleStates; if (!isNil(ps) && count(ps) > 0) { const v = plain(ps.objectAtIndex(0).serializedRepresentation, 0); if (isPlain(v)) choice = v; } } } catch (e) { /* dynamic lists load asynchronously or need the device */ }
        const sample = isPlain(pd) ? pd : choice !== undefined ? choice : PLAIN_SAMPLE[sc];
        if (sample !== undefined) {
          let ok = false;
          try { const a = action.copyWithSerializedParameters($({ UUID: "00000000-0000-4000-8000-000000000002", [k]: sample })); ok = !isNil(a) && !isNil(a.parameterStateForKey(k)); } catch (e) { ok = false; }
          keys[keys.length - 1].readsPlain = ok; keys[keys.length - 1].plainSample = sample;
        }
      }
      if (!isNil(dflt) && !isNil(key) && isA(key, "NSString")) (actionDefaults[ident] = actionDefaults[ident] || {})[str(key)] = plain(dflt, 0);
      const entry = byParamClass[pc] || (byParamClass[pc] = { defaultExamples: [], count: 0, usedBy: [] });
      entry.stateClass = sc;
      const pd = plain(dflt, 0);
      if (!isNil(dflt) && entry.defaultExamples.length < 3 && !entry.defaultExamples.some((e) => JSON.stringify(e) === JSON.stringify(pd))) entry.defaultExamples.push(pd);
      entry.count += 1;
      if (entry.usedBy.length < 5 && !entry.usedBy.includes(ident)) entry.usedBy.push(ident);
    }
    actionParameters[ident] = keys;
  }
  console.log("actions created: " + created + " failed: " + failed + " parameters: " + params + " parameter classes: " + Object.keys(byParamClass).length);
  // State classes: their serialization selectors.
  const stateClassSelectors = {};
  for (const pc of Object.keys(byParamClass)) {
    const scn = byParamClass[pc].stateClass;
    if (typeof scn !== "string" || stateClassSelectors[scn] || !hasClass(scn)) continue;
    stateClassSelectors[scn] = methodNames(scn).filter((s) => s.includes("erializ") || s.includes("init"));
  }
  console.log("actions the engine loads as missing: " + unavailableActions.length);
  writeJSON(argv[0], { parameterClasses: byParamClass, stateClassSelectors, actionParameters, actionOutputNames, actionDefaults, unavailableActions: unavailableActions.sort() });
}
