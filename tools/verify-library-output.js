// Loads everything the library can write through the engine and reports what it did not read.
//
// Input: the fixture from test/verify/fixture.ts (or fixture.py): one case per action, key and
// value form, produced by Shortcut.action() itself, plus whole shortcuts built through the block
// helpers. For built-in actions the engine's own action object is asked to load the parameters
// (-copyWithSerializedParameters:) and each key is checked with -parameterStateForKey:; a nil
// state means Shortcuts does not read that value (the editor shows an empty placeholder). Legacy
// keys the action no longer models (If's WFInput) must survive the load untouched, which is how
// the app reads them. App Intents actions cannot be built without linkd, so their keys are
// checked against the state-class round-trip table (verify-encodings.js) via the parameter class
// the engine assigns to their value type. Whole shortcuts are loaded with
// -[WFWorkflowFile initWithDictionary:name:performMigration:], as the app imports a file.
//
//   cat tools/jxa-prelude.js tools/verify-library-output.js > /tmp/x.js
//   osascript -l JavaScript /tmp/x.js fixture.json data/apple-app-intents.json data/parameter-encodings.json data/encoding-table.json data/encoding-roundtrips.json report.json
const LEGACY_KEYS = { "is.workflow.actions.conditional": ["WFInput", "WFCondition", "WFConditionalActionString", "WFNumberValue", "WFConditionalLegacyComparisonBehavior", "WFEnumerationValue", "WFBooleanValue", "WFDate", "WFAnotherDate", "WFDuration"], "is.workflow.actions.choosefrommenu": ["WFMenuPrompt", "WFMenuItems", "WFMenuItemTitle", "WFMenuItemAttributedTitle"] };
function formOf(v) {
  if (typeof v === "string") return "string"; if (typeof v === "number") return "number"; if (typeof v === "boolean") return "bool";
  if (v && v.WFSerializationType === "WFTextTokenAttachment") return v.Value && v.Value.Type === "ActionOutput" ? "attachment(output)" : "attachment(variable)";
  if (v && v.WFSerializationType === "WFTextTokenString") return "tokenString";
  if (v && v.Type === "Variable" && v.Variable) return "wrappedSubject";
  return "other";
}
// What the engine's own action says about a key it did not read: whether this engine defines the
// parameter at all (an older engine lacks keys added since the data was extracted), and whether
// it is hidden or its required resources (Apple Intelligence, another parameter's value) are unmet.
function whyNotRead(action, key) {
  const p = action.parameterForKey(key);
  if (isNil(p)) return "no such parameter in this engine";
  const rm = p.resourceManager;
  return "parameter " + cls(p) + (p.isHidden ? ", hidden" : "") + (isNil(rm) ? "" : rm.resourcesAvailable ? ", resources available" : ", resources unavailable");
}
// Dotted build numbers (5037.0.17) compared numerically.
function compareBuilds(a, b) {
  const x = a.split(".").map(Number), y = b.split(".").map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d; }
  return 0;
}
function run(argv) {
  if (argv.length < 6) throw new Error("usage: verify-library-output.js fixture.json apple-app-intents.json parameter-encodings.json encoding-table.json encoding-roundtrips.json report.json [provenance.json]");
  loadEngine(); console.log("engine loaded");
  // An engine older than the one the data was extracted from (a CI runner a macOS behind) lacks keys
  // added since and hides some it later reads. There, a key this engine does not define or hides is
  // reported as a version gap, not failed; on the extraction engine or newer, every miss fails.
  const engineBuild = str($.NSDictionary.dictionaryWithContentsOfFile("/System/Applications/Shortcuts.app/Contents/Info.plist").objectForKey("CFBundleVersion"));
  const dataBuild = argv[6] ? readJSON(argv[6]).shortcutsApp.build : null;
  const olderEngine = dataBuild !== null && compareBuilds(engineBuild, dataBuild) < 0;
  console.log("Shortcuts build " + engineBuild + (dataBuild ? ", data from " + dataBuild + (olderEngine ? ": older engine, keys it does not define or hides are version gaps" : "") : ""));
  const fixture = readJSON(argv[0]), apple = readJSON(argv[1]).actions, enc = readJSON(argv[2]), table = readJSON(argv[3]), roundtrips = readJSON(argv[4]).results;
  const stateOf = {}; for (const [pc, e] of Object.entries(enc.parameterClasses)) if (typeof e.stateClass === "string") stateOf[pc] = e.stateClass;
  for (const e of Object.values(table.appIntentValueTypes || {})) if (e && typeof e === "object" && e.parameterClass && e.stateClass && !e.parameterClass.startsWith("(")) stateOf[e.parameterClass] = stateOf[e.parameterClass] || e.stateClass;
  // Engine action objects, one per built-in identifier, from both providers.
  const byId = {};
  for (const p of [klass("WFBundledActionProvider").alloc.init, klass("WFIntentActionProvider").alloc.init]) {
    const all = items(p === undefined ? $([]) : (p.respondsToSelector("createAllAvailableActionsIncludingMissingActions:") ? p.createAllAvailableActionsIncludingMissingActions(true) : p.createAllAvailableActions));
    for (let i = 0; i < count(all); i++) { const a = all.objectAtIndex(i); byId[str(a.identifier)] = a; }
    console.log(cls(p) + ": " + count(all) + " actions");
  }
  const failures = [], deviceValidated = [], versionGaps = []; let engineChecked = 0, tableChecked = 0, unverifiable = 0, passed = 0, missingTemplates = 0, rejectedConfirmed = 0;
  // Actions the engine itself creates as missing on this Mac (retired integrations such as CloudApp, Dropbox,
  // Slack): nothing about the parameters can be read from them, so they are counted, not failed.
  const missingIds = new Set(Object.keys(byId).filter((id) => byId[id].isMissing));
  // VERIFY_TRACE=1 names each engine action before its cases load, so a load that never returns
  // (as on the macOS 26 CI runner) shows which action it was; VERIFY_TRACE=calls also names each
  // engine call. VERIFY_ONLY=<regex> limits the cases to matching identifiers.
  const env = (k) => { const v = $.NSProcessInfo.processInfo.environment.objectForKey(k); return isNil(v) ? null : str(v); };
  const trace = env("VERIFY_TRACE"), calls = trace === "calls", only = env("VERIFY_ONLY") && new RegExp(env("VERIFY_ONLY"));
  if (only) console.log("only identifiers matching " + only);
  let n = 0, traced = null;
  for (const c of fixture.cases) {
    n++; if (n % 5000 === 0) console.log(n + " cases");
    if (only && !only.test(c.identifier)) continue;
    const tpl = byId[c.identifier];
    if (tpl && missingIds.has(c.identifier)) { missingTemplates++; continue; }
    if (tpl) {
      if (trace && traced !== c.identifier) { traced = c.identifier; console.log("case " + n + ": " + c.identifier); }
      engineChecked++;
      const params = Object.assign({ UUID: "00000000-0000-4000-8000-00000000" + String(n).padStart(4, "0") }, c.params);
      let verdict, why = null;
      try {
        if (calls) console.log("  copyWithSerializedParameters: " + c.key + " (" + c.form + ")");
        const a = tpl.copyWithSerializedParameters($(params));
        if (isNil(a) || a.isMissing) verdict = "action missing";
        else if ((LEGACY_KEYS[c.identifier] || []).includes(c.key)) { const sp = plain(a.serializedParameters, 0) || {}; verdict = c.key in sp ? "ok" : "legacy key discarded by the engine"; }
        else { if (calls) console.log("  parameterStateForKey: " + c.key); const st = a.parameterStateForKey(c.key); if (isNil(st)) { why = whyNotRead(a, c.key); verdict = "not read (parameter state is nil; " + why + ")"; } else verdict = "ok"; }
        if (calls) console.log("  -> " + verdict);
      } catch (e) { verdict = "threw: " + e.message.slice(0, 80); }
      if (c.expect === "deviceValidated") {
        // The engine checks this value against the device; read here means it happened to be valid, not read is not a library fault.
        if (verdict === "ok") passed++; else { deviceValidated.push(c.identifier + "." + c.key); }
      } else if (c.expect === "rejected") {
        // The library refuses this form for the key; the engine must not read it either, or the restriction is too tight.
        if (verdict !== "ok") { passed++; rejectedConfirmed++; } else failures.push({ identifier: c.identifier, key: c.key, kind: c.kind, form: c.form, verdict: "engine reads a form the library refuses", via: "engine action" });
      } else if (verdict === "ok") passed++;
      else if (olderEngine && why && (why === "no such parameter in this engine" || why.includes(", hidden"))) versionGaps.push(c.identifier + "." + c.key + " (" + why + ")");
      else failures.push({ identifier: c.identifier, key: c.key, kind: c.kind, form: c.form, verdict, via: "engine action" });
    } else {
      const t = apple[c.identifier]; const p = t && t.parameters.find((x) => x.key === c.key);
      const pc = p && p.parameterClass; const st = pc && stateOf[pc];
      if (!st || !roundtrips[st] || typeof roundtrips[st] === "string") { unverifiable++; continue; }
      tableChecked++;
      const r = roundtrips[st][formOf(c.params[c.key])];
      if (typeof r === "string" && (r === "roundtrip" || r.startsWith("accepted"))) passed++;
      else failures.push({ identifier: c.identifier, key: c.key, kind: c.kind, form: c.form, verdict: "state class " + st + " says " + r, via: "state class" });
    }
  }
  // Whole shortcuts through the file loader, as the app imports them.
  console.log("cases done; loading whole shortcuts");
  const shortcuts = [];
  for (const s of fixture.shortcuts) {
    ObjC.bindFunction("objc_msgSend", ["void *", ["void *", "void *", "void *", "void *", "bool"]]);
    const file = ObjC.castRefToObject($.objc_msgSend(allocRef("WFWorkflowFile"), $.sel_registerName("initWithDictionary:name:performMigration:"), toRef($(s.plist)), toRef(s.name), true));
    const entry = { name: s.name, loaded: !isNil(file) };
    if (!isNil(file)) {
      const acts = file.actions; entry.actionCount = count(acts); entry.expected = s.actionCount;
      let missing = 0, checked = 0;
      for (let i = 0; i < count(acts); i++) {
        const d = plain(acts.objectAtIndex(i), 0); const tpl = byId[d.WFWorkflowActionIdentifier]; if (!tpl) continue; checked++;
        const a = tpl.copyWithSerializedParameters($(d.WFWorkflowActionParameters)); if (isNil(a) || a.isMissing) { missing++; continue; }
        // Every key we wrote must survive the load (legacy keys) or be read as a parameter state.
        const sp = plain(a.serializedParameters, 0) || {};
        for (const key of Object.keys(d.WFWorkflowActionParameters)) {
          if (key === "UUID") continue;
          const legacy = (LEGACY_KEYS[d.WFWorkflowActionIdentifier] || []).includes(key) || key === "GroupingIdentifier" || key === "WFControlFlowMode";
          let ok; try { ok = legacy ? key in sp : !isNil(a.parameterStateForKey(key)); } catch (e) { ok = false; }
          if (!ok) failures.push({ shortcut: s.name, identifier: d.WFWorkflowActionIdentifier, key, verdict: legacy ? "legacy key discarded" : "not read" });
        }
      }
      entry.builtInsChecked = checked; entry.missing = missing;
      if (entry.actionCount !== s.actionCount) failures.push({ shortcut: s.name, verdict: `loaded ${entry.actionCount} actions, wrote ${s.actionCount}` });
      if (missing) failures.push({ shortcut: s.name, verdict: `${missing} action(s) load as missing` });
    } else failures.push({ shortcut: s.name, verdict: "file did not load" });
    shortcuts.push(entry);
  }
  const summary = { cases: fixture.cases.length, engineChecked, tableChecked, unverifiable, missingTemplates, missingActions: [...missingIds].sort(), rejectedConfirmed, deviceValidated, engineBuild, dataBuild, versionGaps, passed, failures: failures.length, shortcuts };
  if (versionGaps.length) {
    const byKey = {}; for (const g of versionGaps) byKey[g] = (byKey[g] || 0) + 1;
    console.log("version gaps (this engine is older than the data's; not failures):"); for (const [g, k] of Object.entries(byKey)) console.log("  " + k + " x " + g);
  }
  writeJSON(argv[5], { summary, failures: failures.slice(0, 500) });
  console.log(`${fixture.cases.length} cases: ${engineChecked} loaded by engine actions, ${tableChecked} checked against state classes, ${unverifiable} unverifiable, ${missingTemplates} on actions the engine marks missing (${missingIds.size} such actions); ${passed} passed (${rejectedConfirmed} of them forms the library refuses that the engine refuses too), ${deviceValidated.length} plain values the engine checks against this device (${deviceValidated.join(", ") || "none"}), ${versionGaps.length} version gaps on this older engine, ${failures.length} failed; shortcuts: ${JSON.stringify(shortcuts)}`);
  if (failures.length) throw new Error(failures.length + " case(s) the engine does not read; see " + argv[5]);
}
