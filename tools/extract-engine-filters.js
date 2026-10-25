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
    for (const p of Object.values(d)) for (const key of ["operators", "bounded"]) p[key] = p[key].map((o) => ({ code: o.code, type: shorten(o.type) }));
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
  const linkdCalls = JSON.parse($.sk_linkd_calls());
  writeJSON(outPath, { subjectTypes, builtin, entities, linkdServed: Object.keys(linkdCalls).length > 0 });
  const sizeOf = (o) => Object.values(o).reduce((s, d) => s + (d ? Object.keys(d).length : 0), 0);
  return Object.keys(subjectTypes).length + " content item classes' subject types; " + Object.keys(builtin).length + " built-in Find/Filter classes with " + sizeOf(builtin) + " filterable properties; " +
    Object.keys(entities).length + " entity types (index-built) with " + sizeOf(entities) + " filterable properties" +
    (Object.keys(linkdCalls).length ? " (archive lookups served: " + JSON.stringify(linkdCalls) + ")" : " (no linkd archives: enum properties not built)") + " -> " + outPath;

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
      if (pass > 0) {
        result[id] = previous[id];
        result[id].byQuery[str(query.identifier)] = built;
        continue;
      }
      result[id] = Object.assign({ linkd: true, query: query ? str(query.identifier) : null, queries: all.map((x) => str(x.identifier)).sort(), indexQueries: e.queries || [], linkdProperties }, built, { byQuery: query ? { [str(query.identifier)]: built } : {} });
    }
    const calls = JSON.parse($.sk_linkd_calls());
    writeJSON(outPath, { entities: result, alternatesRemaining: remaining });
    if (pass > 0) return "pass " + pass + ": " + Object.values(result).filter((d) => d.byQuery && Object.keys(d.byQuery).length > pass).length + " entity types rebuilt with another query; " + remaining + " more to build -> " + outPath;
    const known = Object.values(result).filter((d) => d.linkd).length;
    const resolved = Object.values(result).reduce((s, d) => s + (d.yields ? Object.values(d.yields).filter((y) => y.length).length : 0), 0);
    const total = Object.values(result).reduce((s, d) => s + (d.yields ? Object.keys(d.yields).length : 0), 0);
    const filterable = Object.values(result).reduce((s, d) => s + (d.filters ? Object.keys(d.filters).length : 0), 0);
    return known + " of " + Object.keys(result).length + " entity types in linkd's metadata; " + resolved + " of " + total + " properties resolved, " + filterable + " filterable (archive lookups served: " + JSON.stringify(calls) + ") -> " + outPath;
  }
}
