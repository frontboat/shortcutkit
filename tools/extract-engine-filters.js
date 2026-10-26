// The engine's own Find-filter rules, for every content item class a built-in Find/Filter action
// works on and for every Apple entity type. Runs in tools/engine-host (not osascript): the rules are
// WorkflowKit's private Swift, RowTemplateFindFilterParameterState's filterableProperties(for:),
// possibleOperators(contentItemClass:contentProperty:bounded:) and subjectType(contentProperty:),
// which the host exposes as sk_describe(). With linkd's archives served (SK_LINKD_DIR), the entity
// classes are built from Apple's real metadata, enum properties included.
//
//   tools/engine-host/run.sh <prelude+extract-entities+this> index builtin-actions.json entities.json encoding-table.json engine-filters.json
//   tools/engine-host/run.sh <prelude+extract-entities+this> linkd builtin-actions.json entities.json encoding-table.json linkd-properties.json
//
// Two modes, because the engine registers one content item class per name: "index" describes
// every content item class's subject type, the built-in Find/Filter classes, and the entities
// built from the index as extract-entities.js builds them (what where() types today); "linkd"
// builds the same entities from linkd's own LNEntityMetadata and query instead, as the Shortcuts
// app does, and also records what a property reference to each property yields. Built in one
// process, the second build would silently get the first's class.
//
// Output per property: subjectType (the value class's +tableTemplateSubjectType), operators (the
// code and the Swift operator type, whose generic argument names the row value type) and the
// operators left when the filter must be bounded (WFContentPredicateBoundedDate).
ObjC.bindFunction("sk_describe", ["string", ["string"]]);
ObjC.bindFunction("sk_linkd_calls", ["string", []]);
// OSAKit runs the top level, then run(); an exception at the top level is reported without its
// message, so the work is in main() and run() returns its summary or its error.
function run() { try { return main(); } catch (e) { return "error: " + e + (e.stack ? "\n" + e.stack : ""); } }
function main() {
  const ARGS = JSON.parse(ObjC.unwrap($.NSProcessInfo.processInfo.environment.objectForKey("SK_ARGS")));
  if (ARGS.length < 5 || !["index", "linkd"].includes(ARGS[0])) throw new Error("usage: extract-engine-filters.js index|linkd builtin-actions.json entities.json encoding-table.json out.json [pass]");
  loadEngine(); loadLinkMetadata();
  const mode = ARGS[0], definitions = readJSON(ARGS[1]), input = readJSON(ARGS[2]), table = readJSON(ARGS[3]), outPath = ARGS[4], pass = Number(ARGS[5] || 0);
  const codeOf = {}; for (const [code, name] of Object.entries(table.filterOperators)) codeOf[name] = Number(code);

  // Operator types read "WorkflowKit.IsEqualOperator<WorkflowKit.RowTemplateStringValueType>"; keep the
  // names without module prefixes.
  const shorten = (t) => t.replace(/WorkflowKit\.|RowTemplateFindFilterParameterState\.|__C\./g, "");
  function describe(className) {
    const raw = $.sk_describe(className);
    if (typeof raw !== "string") throw new Error("sk_describe returned " + typeof raw + " for " + className);
    const d = JSON.parse(raw);
    if (d === null) return null;
    for (const [name, p] of Object.entries(d)) {
      for (const key of ["operators", "bounded"]) p[key] = p[key].map((o) => ({ code: o.code, type: shorten(o.type) }));
      // The property's value class decides a string row's key (WFEmailAddress reads Email, WFPhoneNumber
      // Phone, everything else String; rowValues below) and a static enumeration's choices come from its
      // parameter definition's Items (Reminders' Priority); properties without Items take any string.
      const prop = klass(className).propertyForName(name);
      if (!isNil(prop)) {
        const pc = prop.propertyClasses;
        if (!isNil(pc) && count(pc)) p.valueClass = str($.NSStringFromClass(pc.objectAtIndex(0)));
        const def = prop.parameterDefinition;
        const items = isNil(def) ? null : def.objectForKey("Items");
        if (items && !isNil(items)) p.items = plain(items, 0);
        // The calendar units a Number+Unit row may use (durations, is in the last/next), an NSCalendarUnit mask.
        const mask = Number(prop.timeUnits);
        if (mask && p.operators.some((o) => /CompoundNumberCalendarUnit/.test(o.type))) p.timeUnits = [...Array(20).keys()].map((b) => 2 ** b).filter((u) => mask & u);
      }
    }
    return d;
  }

  const linkdServed = Object.keys(JSON.parse($.sk_linkd_calls())).length > 0 || !!ObjC.unwrap($.NSProcessInfo.processInfo.environment.objectForKey("SK_LINKD_DIR"));
  if (mode === "linkd") return fromLinkd();

  // Every content item class's subject type: the row value keys a property of that class takes.
  const subjectTypes = {};
  {
    ObjC.bindFunction("objc_getClassList", ["int", ["void **", "int"]]);
    ObjC.bindFunction("malloc", ["void **", ["int"]]);
    const n = $.objc_getClassList(null, 0), buf = $.malloc(n * 8); $.objc_getClassList(buf, n);
    for (let i = 0; i < n; i++) {
      let isContentItem = false;
      for (let c = $.class_getSuperclass(buf[i]); $.class_getName(c) !== "nil"; c = $.class_getSuperclass(c)) if ($.class_getName(c) === "WFContentItem") { isContentItem = true; break; }
      if (!isContentItem) continue;
      const name = $.class_getName(buf[i]);
      if (/^WFLink(Entity|Enumeration)ContentItem_/.test(name)) continue; // per-entity subclasses built below
      subjectTypes[name] = Number(klass(name).tableTemplateSubjectType);
    }
    subjectTypes.WFContentItem = Number(klass("WFContentItem").tableTemplateSubjectType);
  }

  // Built-in Find/Filter actions name their class in the definition (WFContentItemClass).
  const builtin = {};
  const classes = new Set();
  for (const def of Object.values(definitions)) {
    const walk = (v) => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) { if (k === "WFContentItemClass" && typeof x === "string") classes.add(x); walk(x); } };
    walk(def);
  }
  for (const c of [...classes].sort()) builtin[c] = describe(c);

  // Apple's entity types, built as tools/extract-entities.js builds them (from the index), with linkd's
  // archived metadata answering WorkflowKit's lookups for enum and entity property types.
  const entities = {};
  for (const [id, e] of Object.entries(input.entities)) {
    const props = {};
    for (const p of e.properties) { const t = decode("CCToolKitToolTypeInstance", p.typeInstance); props[p.id] = { name: p.name, type: t ? simplify(t, input.types) : { kind: "undecodable" } }; }
    const tpl = e.comparison ? decode("CCToolKitToolTypeDefinitionVersion1QueryPredicateTemplates", e.comparison) : null;
    for (const c of (tpl && tpl.comparison) || []) {
      const pid = c.property.id;
      props[pid] = props[pid] || { name: c.property.displayName, type: simplify(c.property.type, input.types) };
      const op = codeOf[KIND_NAMES[Object.keys(c.comparisonTemplate)[0]]];
      (props[pid].operators = props[pid].operators || []).includes(op) || props[pid].operators.push(op);
    }
    const built = entityContentClass(e, props);
    entities[id] = built ? describe(built.name) : null;
  }
  const rowValues = rowValueForms(builtin);
  const linkdCalls = JSON.parse($.sk_linkd_calls());
  writeJSON(outPath, { subjectTypes, builtin, entities, rowValues, linkdServed: Object.keys(linkdCalls).length > 0 });
  const sizeOf = (o) => Object.values(o).reduce((s, d) => s + (d ? Object.keys(d).length : 0), 0);
  return Object.keys(subjectTypes).length + " content item classes' subject types; " + Object.keys(builtin).length + " built-in Find/Filter classes with " + sizeOf(builtin) + " filterable properties; " +
    Object.keys(entities).length + " entity types (index-built) with " + sizeOf(entities) + " filterable properties" +
    (Object.keys(linkdCalls).length ? " (archive lookups served: " + JSON.stringify(linkdCalls) + ")" : " (no linkd archives: enum properties not built)") + " -> " + outPath;

  // The Values a row carries, per row value type, read two ways. Loaded as a filter row through a Find
  // action, every key must come back as a parameter state (the key is right) and the row must
  // serialize back (the form is right). Then the same row goes through the engine's own row model,
  // WFRowTemplateValue, and WFContentPredicateForRowTemplateValue, the C function the Find action
  // evaluates with at run time (sk_row_predicate): the value it compares with shows which field the
  // property reads (Contacts' Email Addresses reads email, not string) and what a unit code means
  // (ByteCountUnit 4 makes 5 into 5000000 bytes, "5 MB").
  function rowValueForms(builtin) {
    ObjC.bindFunction("sk_row_predicate", ["string", ["void *"]]);
    const token = (x) => ({ WFSerializationType: "WFTextTokenString", Value: { string: x, attachmentsByRange: {} } });
    const date = (t) => $.NSDate.dateWithTimeIntervalSince1970(t);
    const predicate = (className, pid, op, set) => {
      const row = klass("WFRowTemplateValue").alloc.initWithContentItemClassContentPropertyNameComparisonOperatorRemovable(klass(className), pid, op, true);
      set(row);
      return JSON.parse($.sk_row_predicate(ObjC.castObjectToRef(row)));
    };
    const problems = [], forms = {};
    // [value type, class, property, operator code, Values as the library writes them, the same row on WFRowTemplateValue, note]
    const samples = [
      ["RowTemplateStringValueType", "WFArticleContentItem", "URL", 4, { String: token("https://example.com") }, (r) => r.setString("https://example.com"), "String: a token string (or a plain string); URL, location and plain-text properties alike"],
      ["RowTemplateStringValueType", "WFContactContentItem", "Email Addresses", 4, { Email: token("a@b.co") }, (r) => r.setEmail("a@b.co"), "Email: the key for a property whose value class is WFEmailAddress; its string field is not read"],
      ["RowTemplateStringValueType", "WFContactContentItem", "Phone Numbers", 4, { Phone: token("5551234") }, (r) => r.setPhone("5551234"), "Phone: the key for a property whose value class is WFPhoneNumber"],
      ["RowTemplateNumberValueType", "WFAppContentItem", "Process Identifier", 2, { Number: 5 }, (r) => r.setNumber($(5)), "Number: a number (the editor also writes numeric strings)"],
      ["RowTemplateDateValueType", "WFAppContentItem", "Launch Date", 2, { Date: date(1767225600) }, (r) => r.setDate(date(1767225600)), "Date: a plist date"],
      ["RowTemplateDateValueType", "WFAppContentItem", "Launch Date", 1003, { Date: date(1767225600), AnotherDate: date(1767312000) }, (r) => { r.setDate(date(1767225600)); r.setAnotherDate(date(1767312000)); }, "is between: Date and AnotherDate"],
      ["DateIsTodayOperator", "WFAppContentItem", "Launch Date", 1002, {}, (r) => {}, "is today: no values"],
      ["RowTemplateCompoundNumberCalendarUnitValueType", "WFAppContentItem", "Launch Date", 1001, { Number: 7, Unit: 16 }, (r) => { r.setNumber($(7)); r.setCalendarUnit($(16)); }, "is in the last/next: Number and an NSCalendarUnit (16 = day)"],
      ["RowTemplateCompoundNumberCalendarUnitValueType", "WFAVAssetContentItem", "Duration", 2, { Number: 5, Unit: 64 }, (r) => { r.setNumber($(5)); r.setCalendarUnit($(64)); }, "a duration: Number and an NSCalendarUnit (64 = minute, so 5 is 300 seconds)"],
      ["RowTemplateCompoundNumberByteCountUnitValueType", "WFGenericFileContentItem", "File Size", 2, { Number: 5, ByteCountUnit: 4 }, (r) => { r.setNumber($(5)); r.setByteCountUnit($(4)); }, "a file size: Number and a ByteCountUnit code (byteCountUnits below; 4 = MB)"],
      ["RowTemplateEnumerationValueType<EnumerationStringValueKey, NSString, NSString>", "WFReminderContentItem", "Priority", 4, { Enumeration: { WFSerializationType: "WFStringSubstitutableState", Value: "High" } }, (r) => r.setEnumeration("High"), "Enumeration: a WFStringSubstitutableState holding one of the property's items (a bare string is dropped)"],
    ];
    for (const [type, className, pid, op, values, set, note] of samples) {
      const got = loadFilter(className, { WFSerializationType: "WFContentPredicateTableTemplate", Value: { WFActionParameterFilterPrefix: 1, WFContentPredicateBoundedDate: false, WFActionParameterFilterTemplates: [{ Property: pid, Operator: op, Removable: true, Values: values }] } });
      const row = got.rows[0], back = got.serialized && got.serialized.Value.WFActionParameterFilterTemplates[0];
      const missing = row ? Object.keys(values).filter((k) => !(k in row.values)) : Object.keys(values);
      if (!row || row.property !== pid || missing.length) problems.push(type + " " + className + "." + pid + " op " + op + ": wrote " + JSON.stringify(Object.keys(values)) + ", engine read " + JSON.stringify(row));
      const pred = predicate(className, pid, op, set);
      // Date ranges (is between, is in the last) become a compound predicate with no single value.
      if (Object.keys(values).length && pred.predicateClass === "WFContentComparisonPredicate" && (pred.value === null || pred.value === undefined)) problems.push(type + " " + className + "." + pid + ": the engine's predicate has no value for " + JSON.stringify(Object.keys(values)));
      // The operator type the engine names for this property and code, to tie the sample to the lists above.
      const engineType = ((builtin[className] || {})[pid] || { operators: [] }).operators.find((o) => o.code === op);
      (forms[type] = forms[type] || []).push({ class: className, property: pid, operator: op, operatorType: engineType ? engineType.type : null, values: plain($(values), 0), states: row ? row.values : null, writtenBack: back ? back.Values : null, predicate: pred, note });
    }
    // Every ByteCountUnit code the picker could write: what 5 of each becomes in bytes.
    const byteCountUnits = {};
    for (const code of [1, 2, 4, 8, 16, 32, 64]) {
      const pred = predicate("WFGenericFileContentItem", "File Size", 2, (r) => { r.setNumber($(5)); r.setByteCountUnit($(code)); });
      // 5 EB is 5e18 bytes, past JSON's exact integers, so the unit is kept as a power of ten.
      byteCountUnits[code] = { label: String(pred.formatted).replace(/^5 /, ""), decimalExponent: String(pred.byteCount).length - 1 };
    }
    if (problems.length) throw new Error(problems.length + " row value forms the engine did not read as written:\n  " + problems.join("\n  "));
    return { forms, byteCountUnits, stringKeyByValueClass: { WFEmailAddress: "Email", WFPhoneNumber: "Phone", default: "String" } };
  }

  // "linkd" mode: the entities built from linkd's own LNEntityMetadata and query, as the Shortcuts
  // app builds them (tools/linkd/resolve-properties.js does the same inside ShortcutsMacHelper over
  // XPC; here the archives answer, so it takes seconds). Per entity: the engine's filter rules for
  // that class and the content each property reference yields, for the index's property identifiers.
  //
  // linkd knows several queries for a few types (Contacts: ContactEntityQuery and
  // ContactEntityIDPassthroughQuery), and the class differs with the query (only ContactEntityQuery
  // gives filterable properties). The class is named after the type alone, so one process can build
  // each type once: pass 0 builds the query the index's parameters embed (first by identifier when
  // the index names several or none) and writes the file; pass N rebuilds the types with an Nth
  // other query and adds it under byQuery. The file's alternatesRemaining says whether to run again.
  function linkRowValueForms() {
    const problems = [], forms = {};
    const token = (x) => ({ WFSerializationType: "WFTextTokenString", Value: { string: x, attachmentsByRange: {} } });
    const samples = [
      ["RowTemplateEnumerationValueType<EnumerationLinkValueKey, LNDynamicOption, LNValue>", "WFLinkEntityContentItem_com.apple.Photos_AssetEntity", "assetType", 4, { Enumeration: { WFSerializationType: "WFLinkEnumerationSubstitutableState", Value: "video" } }, "Enumeration: a WFLinkEnumerationSubstitutableState holding the case identifier (cases per property in filters)"],
      ["RowTemplateContactHandleValueType", "WFLinkEntityContentItem_com.apple.MobileSMS_MessageEntity", "author", 4, { ContactHandle: { WFSerializationType: "WFTokenStringParameterState", Value: token("x") } }, "ContactHandle: a WFTokenStringParameterState around a token string (a plain string when it holds no reference)"],
    ];
    for (const [type, className, pid, op, values, note] of samples) {
      if (!klass(className) || isNil(klass(className))) { problems.push(type + ": no class " + className); continue; }
      const got = loadFilter(className, { WFSerializationType: "WFContentPredicateTableTemplate", Value: { WFActionParameterFilterPrefix: 1, WFContentPredicateBoundedDate: false, WFActionParameterFilterTemplates: [{ Property: pid, Operator: op, Removable: true, Values: values }] } });
      const row = got.rows[0], back = got.serialized && got.serialized.Value.WFActionParameterFilterTemplates[0];
      const missing = row ? Object.keys(values).filter((k) => !(k in row.values)) : Object.keys(values);
      if (!row || row.property !== pid || missing.length) problems.push(type + " " + className + "." + pid + " op " + op + ": wrote " + JSON.stringify(Object.keys(values)) + ", engine read " + JSON.stringify(row));
      (forms[type] = forms[type] || []).push({ class: className, property: pid, operator: op, values, states: row ? row.values : null, writtenBack: back ? back.Values : null, note });
    }
    if (problems.length) throw new Error(problems.length + " row value forms the engine did not read as written:\n  " + problems.join("\n  "));
    return { forms };
  }

  function fromLinkd() {
    if (!linkdServed) throw new Error("linkd mode needs SK_LINKD_DIR (tools/linkd/archive-metadata.js)");
    const provider = make("LNMetadataProvider", "init");
    const previous = pass > 0 ? readJSON(outPath).entities : null;
    let remaining = 0;
    const byBundle = {}, result = {};
    const queries = provider.queriesWithError(null);
    for (const [id, e] of Object.entries(input.entities)) {
      const bundle = e.bundleIdentifier;
      if (!byBundle[bundle]) {
        const list = provider.entitiesForBundleIdentifierError(bundle, null), ents = {};
        for (let i = 0; i < count(list); i++) ents[str(list.objectAtIndex(i).identifier)] = list.objectAtIndex(i);
        // queriesWithError: is bundle -> (query identifier -> LNQueryMetadata).
        // Several queries can serve one entity type (Contacts has ContactEntityQuery and
        // ContactEntityIDPassthroughQuery); which one the app builds the class from is not yet known,
        // so all are recorded and the first by identifier is used (resolve-properties.js does the same).
        const byId = isNil(queries) ? null : queries.objectForKey(bundle), q = {};
        const qs = !byId || isNil(byId) ? null : isA(byId, "NSDictionary") ? byId.allValues : byId;
        for (let i = 0; qs && i < count(qs); i++) (q[str(qs.objectAtIndex(i).entityType)] = q[str(qs.objectAtIndex(i).entityType)] || []).push(qs.objectAtIndex(i));
        for (const list of Object.values(q)) list.sort((a, b) => (str(a.identifier) < str(b.identifier) ? -1 : 1));
        byBundle[bundle] = { ents, q };
      }
      const ent = byBundle[bundle].ents[e.typeName];
      if (!ent) { result[id] = { linkd: false }; continue; }
      // Index names are Swift-qualified (ContactsUICore.ContactEntityQuery); linkd's identifiers drop
      // the module, or not (News' AutoDownloadEntity.EffectiveUniqueQuery).
      const all = byBundle[bundle].q[e.typeName] || [];
      const named = all.filter((x) => (e.queries || []).some((n) => n === str(x.identifier) || n.endsWith("." + str(x.identifier))));
      const cands = named.length ? named.concat(all.filter((x) => !named.includes(x))) : all;
      if (pass > 0 && cands.length <= pass) { result[id] = previous[id]; continue; }
      remaining += Math.max(0, cands.length - pass - 1);
      const query = cands[pass] || null;
      const linkdProperties = []; for (let i = 0; i < count(ent.properties); i++) linkdProperties.push(str(ent.properties.objectAtIndex(i).identifier));
      const evt = make("LNEntityValueType", "initWithIdentifier:", e.typeName);
      const ref = sendObjects(ObjC.castObjectToRef(ent), "wf_contentItemClassWithEntityValueType:queryMetadata:appBundleIdentifier:displayedAppBundleIdentifier:", evt, query, bundle, bundle);
      const className = $.class_getName(ref);
      // The index's property identifiers, including the ones only its filter templates name (Notes'
      // "Creation Date" beside creationDate), as apple-entities.json lists them.
      const pids = e.properties.map((p) => p.id);
      const tpl = e.comparison ? decode("CCToolKitToolTypeDefinitionVersion1QueryPredicateTemplates", e.comparison) : null;
      for (const c of (tpl && tpl.comparison) || []) if (!pids.includes(c.property.id)) pids.push(c.property.id);
      const yields = {};
      for (const pid of pids) yields[pid] = propertyContentClasses(className, { Type: "WFPropertyVariableAggrandizement", PropertyName: pid });
      const built = { filters: className === "nil" ? null : describe(className), yields };
      // App Intents enumeration properties: the cases an Enumeration row may name (identifiers, as the
      // WFLinkEnumerationSubstitutableState value), from linkd's LNEnumMetadata for the type.
      // The value class names the enum, WFLinkEnumerationContentItem_<bundle>_<enum identifier> (System
      // Settings' carry an extra _Z infix), so the enum is the one of the type's bundle whose identifier
      // ends the class name. Its cases are the identifiers an Enumeration row may hold.
      if (built.filters) for (const [pid, f] of Object.entries(built.filters)) {
        if (!/^WFLinkEnumerationContentItem_/.test(f.valueClass || "")) continue;
        const enums = provider.enumsForBundleIdentifierError(bundle, null);
        let found = null;
        for (let j = 0; !isNil(enums) && j < count(enums); j++) { const en = enums.objectAtIndex(j); if (f.valueClass.endsWith("_" + str(en.identifier))) found = en; }
        f.enumeration = found ? bundle + "." + str(found.identifier) : null;
        f.cases = [];
        if (found) for (let k = 0; k < count(found.cases); k++) f.cases.push(str(found.cases.objectAtIndex(k).identifier));
      }
      if (pass > 0) {
        result[id] = previous[id];
        result[id].byQuery[str(query.identifier)] = built;
        continue;
      }
      result[id] = Object.assign({ linkd: true, query: query ? str(query.identifier) : null, queries: all.map((x) => str(x.identifier)).sort(), indexQueries: e.queries || [], linkdProperties }, built, { byQuery: query ? { [str(query.identifier)]: built } : {} });
    }
    const calls = JSON.parse($.sk_linkd_calls());
    // Row value forms only an App Intents entity has: the enumeration case and the contact handle.
    const rowValues = pass > 0 ? readJSON(outPath).rowValues : linkRowValueForms();
    writeJSON(outPath, { entities: result, rowValues, alternatesRemaining: remaining });
    if (pass > 0) return "pass " + pass + ": " + Object.values(result).filter((d) => d.byQuery && Object.keys(d.byQuery).length > pass).length + " entity types rebuilt with another query; " + remaining + " more to build -> " + outPath;
    const known = Object.values(result).filter((d) => d.linkd).length;
    const resolved = Object.values(result).reduce((s, d) => s + (d.yields ? Object.values(d.yields).filter((y) => y.length).length : 0), 0);
    const total = Object.values(result).reduce((s, d) => s + (d.yields ? Object.keys(d.yields).length : 0), 0);
    const filterable = Object.values(result).reduce((s, d) => s + (d.filters ? Object.keys(d.filters).length : 0), 0);
    return known + " of " + Object.keys(result).length + " entity types in linkd's metadata; " + resolved + " of " + total + " properties resolved, " + filterable + " filterable (archive lookups served: " + JSON.stringify(calls) + ") -> " + outPath;
  }
}
