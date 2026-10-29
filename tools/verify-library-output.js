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
// Find filters on built-in Find actions go through the engine's own action object like any other
// parameter. Find filters and property references on Apple's entity types are loaded through the
// entity's content item class: under tools/engine-host with linkd's archives served (SK_LINKD_DIR),
// the class the app builds, from linkd's metadata and the query linkd-properties.json chose; under
// osascript, the class WorkflowKit builds from apple-entities.json (entityContentClass() in the
// prelude), which lacks the properties only linkd's metadata carries, so a row on one of those is
// counted as unverifiable there, not failed. Each filter must come back with every row's property,
// operator and value keys, serialized as written; each property aggrandizement must parse and find
// its property on the class.
//
//   cat tools/jxa-prelude.js tools/verify-library-output.js > /tmp/x.js
//   osascript -l JavaScript /tmp/x.js fixture.json data/apple-app-intents.json data/parameter-encodings.json data/encoding-table.json data/encoding-roundtrips.json report.json [data/provenance.json] [data/apple-entities.json] [data/linkd-properties.json]
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
  // Under tools/engine-host the arguments arrive in SK_ARGS rather than as osascript's argv.
  if (!argv || !argv.length) { const a = $.NSProcessInfo.processInfo.environment.objectForKey("SK_ARGS"); argv = isNil(a) ? [] : JSON.parse(ObjC.unwrap(a)); }
  if (argv.length < 6) throw new Error("usage: verify-library-output.js fixture.json apple-app-intents.json parameter-encodings.json encoding-table.json encoding-roundtrips.json report.json [provenance.json] [apple-entities.json] [linkd-properties.json]");
  loadEngine(); console.log("engine loaded");
  // Serializations compared with keys sorted and an empty attachmentsByRange dropped: the engine omits it from a token
  // string without references, where the library writes {}.
  const normValue = (v) => { if (Array.isArray(v)) return v.map(normValue); if (v && typeof v === "object") { const o = {}; for (const k of Object.keys(v).sort()) { if (k === "attachmentsByRange" && v[k] && typeof v[k] === "object" && !Object.keys(v[k]).length) continue; o[k] = normValue(v[k]); } return o; } return v; };
  const sameValue = (a, b) => JSON.stringify(normValue(a)) === JSON.stringify(normValue(b));
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
        else {
          if (calls) console.log("  parameterStateForKey: " + c.key);
          const st = a.parameterStateForKey(c.key);
          if (isNil(st)) { why = whyNotRead(a, c.key); verdict = "not read (parameter state is nil; " + why + ")"; }
          // A dictionary must come back item for item as written (type codes, nesting, array forms); other kinds are checked by their state classes below.
          else if (c.kind === "dictionary" && !sameValue(plain(st.serializedRepresentation, -40), c.params[c.key])) verdict = "serialized back differently: " + JSON.stringify(plain(st.serializedRepresentation, -40)).slice(0, 300);
          else verdict = "ok";
        }
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
  // Coercions: each class coerce() offers must be one the engine lists (+[WFContentItem allSupportedItemClasses], the
  // editor's "Type" menu) and must parse as a coercion aggrandizement to that class; a class the engine lists that the
  // library lacks means the data is stale. On an older engine a class it lacks is a version gap.
  const engineClasses = new Set(); { const list = items(klass("WFContentItem").allSupportedItemClasses); for (let i = 0; i < count(list); i++) engineClasses.add($.class_getName(ObjC.castObjectToRef(list.objectAtIndex(i)))); }
  let coercions = 0;
  for (const c of fixture.coercionCases || []) {
    coercions++;
    const fail = (verdict) => failures.push({ identifier: c.class, key: "coerce()", form: "coercion", verdict, via: "variable state" });
    if (!engineClasses.has(c.class)) { if (olderEngine) versionGaps.push(c.class + " (coerce(): no such content item class in this engine)"); else fail("the engine does not list this content item class"); continue; }
    const st = make("WFVariableParameterState", "initWithSerializedRepresentation:variableProvider:parameter:", $(c.attachment), null, null);
    const vars = isNil(st) ? null : st.containedVariables;
    const ags = vars && count(vars) === 1 ? vars.objectAtIndex(0).aggrandizements : null;
    const ag = ags && count(ags) ? ags.objectAtIndex(count(ags) - 1) : null;
    if (!ag || cls(ag) !== "WFCoercionVariableAggrandizement" || $.class_getName(ObjC.castObjectToRef(ag.coercionItemClass)) !== c.class) { fail("the engine did not parse the coercion aggrandizement"); continue; }
    if (!sameValue(plain(st.serializedRepresentation, -40), c.attachment)) { fail("serialized back differently"); continue; }
    passed++;
  }
  if (fixture.coercionCases) for (const name of engineClasses) if (!fixture.coercionCases.some((c) => c.class === name)) failures.push({ identifier: name, key: "coerce()", form: "coercion", verdict: "the engine lists a content item class CONTENT_ITEM_CLASSES lacks; refresh the data", via: "variable state" });
  // Class properties: each name property() offers on a coerce()d reference must parse as a property aggrandizement
  // and resolve on that class (-processedContentClasses: names the class it yields; an unknown name yields nothing);
  // a property the engine lists (+allProperties) that CONTENT_ITEM_PROPERTIES lacks means the data is stale.
  let classProperties = 0;
  for (const c of fixture.classPropertyCases || []) {
    classProperties++;
    const fail = (verdict) => failures.push({ identifier: c.class, key: "property()", form: c.property, verdict, via: "variable state" });
    if (!engineClasses.has(c.class)) { if (olderEngine) versionGaps.push(c.class + "." + c.property + " (property(): no such content item class in this engine)"); else fail("the engine does not list this content item class"); continue; }
    const st = make("WFVariableParameterState", "initWithSerializedRepresentation:variableProvider:parameter:", $(c.attachment), null, null);
    const vars = isNil(st) ? null : st.containedVariables;
    const ags = vars && count(vars) === 1 ? vars.objectAtIndex(0).aggrandizements : null;
    const ag = ags && count(ags) ? ags.objectAtIndex(count(ags) - 1) : null;
    if (!ag || cls(ag) !== "WFPropertyVariableAggrandizement" || str(ag.propertyName) !== c.property) { fail("the engine did not parse the property aggrandizement"); continue; }
    const yields = propertyContentClasses(c.class, { Type: "WFPropertyVariableAggrandizement", PropertyName: c.property });
    if (!yields.length) { if (olderEngine && isNil(klass(c.class).propertyForName(c.property))) versionGaps.push(c.class + "." + c.property + " (property(): this engine's class has no such property)"); else fail("the class does not resolve this property"); continue; }
    if (!sameValue(plain(st.serializedRepresentation, -40), c.attachment)) { fail("serialized back differently"); continue; }
    passed++;
  }
  if (fixture.classPropertyCases) for (const name of engineClasses) {
    const all = items(klass(name).allProperties);
    for (let i = 0; i < count(all); i++) { const pn = str(all.objectAtIndex(i).name); if (!fixture.classPropertyCases.some((c) => c.class === name && c.property === pn)) failures.push({ identifier: name, key: "property()", form: pn, verdict: "the engine lists a property CONTENT_ITEM_PROPERTIES lacks; refresh the data", via: "variable state" }); }
  }
  // Find filters: built-in Find actions through their engine action, Apple's entity types through each
  // entity's content item class (linkd-built in the engine host, index-built under osascript).
  const entityChecks = { filters: 0, properties: 0, unverifiableProperties: 0, indexOnlyRows: 0 };
  const same = (a, b) => JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
  const checkFilter = (c, got, fail, indexBuilt) => {
    const written = c.filter.Value.WFActionParameterFilterTemplates;
    const bad = written.map((w, i) => {
      const r = got.rows[i];
      if (!r) return "row " + i + " dropped";
      if (r.property !== w.Property || r.operator !== table.filterOperators[w.Operator]) return "row " + i + " read as " + r.property + " " + r.operator;
      const lost = Object.keys(w.Values).filter((k) => !(k in r.values));
      return lost.length ? "row " + i + " lost " + lost.join(", ") : null;
    }).filter(Boolean);
    if (got.rows.length !== written.length) bad.push("read " + got.rows.length + " rows, wrote " + written.length);
    else if (!bad.length && !same(got.serialized, c.filter)) bad.push("serialized back differently: " + JSON.stringify(got.serialized).slice(0, 300));
    // The index-built class offers fewer properties and operators than the linkd-built one the app uses
    // (docs/extraction.md); what it does not read here is checked in the engine host, not failed.
    if (bad.length && indexBuilt && got.rows.length < written.length) { entityChecks.indexOnlyRows++; return; }
    if (bad.length) fail(bad.join("; ")); else passed++;
  };
  for (const c of fixture.filterCases || []) {
    const tpl = byId[c.identifier];
    if (!tpl || (only && !only.test(c.identifier))) continue;
    entityChecks.filters++;
    const a = tpl.copyWithSerializedParameters($({ UUID: "00000000-0000-4000-8000-000000000001", WFContentItemFilter: revive(c.filter) }));
    checkFilter(c, isNil(a) ? { rows: [], serialized: null } : filterState(a.parameterStateForKey("WFContentItemFilter")), (verdict) => failures.push({ identifier: c.identifier, key: "WFContentItemFilter", form: c.form, verdict, via: "engine action" }), false);
  }
  if (argv[7] && !only) {
    loadLinkMetadata();
    const entities = readJSON(argv[7]).entities, classes = {};
    // In the engine host with linkd's archives served, build each entity as the app does; otherwise from the index.
    const linkdDir = env("SK_LINKD_DIR"), chosen = linkdDir && argv[8] ? readJSON(argv[8]).entities : null;
    console.log("loading Find filters and property references through entity content item classes" + (chosen ? " built from linkd's metadata" : " built from the index"));
    const provider = chosen ? make("LNMetadataProvider", "init") : null;
    const classFor = (id) => {
      if (!(id in classes)) {
        const e = entities[id];
        if (chosen && chosen[id] && chosen[id].linkd) {
          const list = provider.entitiesForBundleIdentifierError(e.bundleIdentifier, null); let ent = null;
          for (let i = 0; i < count(list); i++) if (str(list.objectAtIndex(i).identifier) === e.typeName) ent = list.objectAtIndex(i);
          const q = chosen[id].query ? provider.queryForBundleIdentifierWithFullyQualifiedIdentifierError(e.bundleIdentifier, chosen[id].query, null) : null;
          const evt = make("LNEntityValueType", "initWithIdentifier:", e.typeName);
          const ref = ent ? sendObjects(ObjC.castObjectToRef(ent), "wf_contentItemClassWithEntityValueType:queryMetadata:appBundleIdentifier:displayedAppBundleIdentifier:", evt, q && !isNil(q) ? q : null, e.bundleIdentifier, e.bundleIdentifier) : null;
          const name = ref ? $.class_getName(ref) : "nil";
          classes[id] = name === "nil" ? null : name;
        } else {
          const props = {};
          for (const [pid, p] of Object.entries(e.properties)) props[pid] = { name: p.name, type: p.type, operators: p.filter && p.filter.operators };
          const built = entityContentClass(e, props);
          classes[id] = built && built.name;
        }
      }
      return classes[id];
    };
    // A property or row value key the class this engine builds does not have: on an older engine a version
    // gap, as for a parameter key it lacks (the data describes the extraction engine's classes); otherwise a failure.
    const lacks = (verdict) => verdict.split("; ").every((v) => /^row \d+ lost /.test(v) || v.startsWith("the entity's content item class has no property "));
    const entityFail = (identifier, key, form, verdict) => {
      if (olderEngine && lacks(verdict)) versionGaps.push(identifier + "." + key + " (" + verdict + ")");
      else failures.push({ identifier, key, form, verdict, via: "entity content item class" });
    };
    for (const c of fixture.filterCases || []) {
      if (byId[c.identifier]) continue; // built-in: checked above
      if (!(c.identifier in entities)) {
        // A built-in Find action this engine does not define (an older runner): a version gap, as for a key it lacks.
        if (olderEngine) versionGaps.push(c.identifier + ".WFContentItemFilter (no such action in this engine)");
        else failures.push({ identifier: c.identifier, key: "WFContentItemFilter", form: c.form, verdict: "no such action in this engine", via: "engine action" });
        continue;
      }
      entityChecks.filters++;
      const cn = classFor(c.identifier);
      const fail = (verdict) => entityFail(c.identifier, "WFContentItemFilter", c.form, verdict);
      if (!cn) { fail("no content item class for the entity"); continue; }
      checkFilter(c, loadFilter(cn, revive(c.filter)), fail, !chosen);
    }
    for (const c of fixture.propertyCases || []) {
      const p = entities[c.entity].properties[c.property];
      if (!p.contentClasses) { entityChecks.unverifiableProperties++; continue; }
      entityChecks.properties++;
      const fail = (verdict) => entityFail(c.entity, c.property, "property()", verdict);
      const st = make("WFVariableParameterState", "initWithSerializedRepresentation:variableProvider:parameter:", $(c.attachment), null, null);
      const vars = isNil(st) ? null : st.containedVariables;
      const ags = vars && count(vars) === 1 ? vars.objectAtIndex(0).aggrandizements : null;
      const ag = ags && count(ags) ? ags.objectAtIndex(count(ags) - 1) : null;
      if (!ag || cls(ag) !== "WFPropertyVariableAggrandizement" || str(ag.propertyName) !== c.property) { fail("the engine did not parse the property aggrandizement"); continue; }
      const cn = classFor(c.entity);
      const yields = cn ? items(ag.processedContentClasses($.NSOrderedSet.orderedSetWithObject(klass(cn)))) : null;
      // linkd's metadata names some properties by title (Notes), so the linkd-built class lacks what the index-built one has: counted, not failed (docs/extraction.md).
      if ((!yields || count(yields) === 0) && chosen && p.contentClasses) { entityChecks.unverifiableProperties++; continue; }
      if (!yields || count(yields) === 0) fail("the entity's content item class has no property " + c.property); else passed++;
    }
    console.log(`${entityChecks.filters} filters and ${entityChecks.properties} property references loaded (${entityChecks.unverifiableProperties} properties the class leaves out without linkd` + (entityChecks.indexOnlyRows ? `, ${entityChecks.indexOnlyRows} filters on rows only the linkd-built class reads` : "") + ")");
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
  const summary = { cases: fixture.cases.length, entityChecks, coercions, engineChecked, tableChecked, unverifiable, missingTemplates, missingActions: [...missingIds].sort(), rejectedConfirmed, deviceValidated, engineBuild, dataBuild, versionGaps, passed, failures: failures.length, shortcuts };
  if (versionGaps.length) {
    const byKey = {}; for (const g of versionGaps) byKey[g] = (byKey[g] || 0) + 1;
    console.log("version gaps (this engine is older than the data's; not failures):"); for (const [g, k] of Object.entries(byKey)) console.log("  " + k + " x " + g);
  }
  writeJSON(argv[5], { summary, failures: failures.slice(0, 500) });
  const line = `${fixture.cases.length} cases: ${engineChecked} loaded by engine actions, ${tableChecked} checked against state classes, ${unverifiable} unverifiable, ${missingTemplates} on actions the engine marks missing (${missingIds.size} such actions); ${coercions} coercions; ${classProperties} class properties; ${passed} passed (${rejectedConfirmed} of them forms the library refuses that the engine refuses too), ${deviceValidated.length} plain values the engine checks against this device (${deviceValidated.join(", ") || "none"}), ${versionGaps.length} version gaps on this older engine, ${failures.length} failed; shortcuts: ${JSON.stringify(shortcuts)}`;
  console.log(line);
  if (failures.length) throw new Error(failures.length + " case(s) the engine does not read; see " + argv[5]);
  return line; // tools/engine-host prints the script's return value
}
