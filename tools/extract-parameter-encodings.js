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
  const byParamClass = {}, actionParameters = {};
  let created = 0, params = 0, failed = 0;
  for (const action of actions) {
    const ident = str(action.identifier);
    let plist;
    try { plist = action.parameters; } catch (e) { failed++; continue; }
    created++;
    const keys = [];
    for (let j = 0; j < count(plist); j++) {
      const p = plist.objectAtIndex(j); params++;
      const pc = cls(p);
      const key = p.key;
      if (!key.isNil() && isA(key, "NSString")) keys.push({ key: str(key), class: pc });
      let sc = null, dflt = null;
      try { sc = str($.NSStringFromClass(p.singleStateClass)); dflt = p.defaultSerializedRepresentation; } catch (e) { /* container parameter without a value state */ }
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
  writeJSON(argv[0], { parameterClasses: byParamClass, stateClassSelectors, actionParameters });
}
