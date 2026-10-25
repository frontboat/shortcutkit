// Payload for run-payload.sh: for each Apple entity type, build its content item class from linkd's
// real metadata (as the Shortcuts app does) and ask which content a property reference to each
// property yields. This covers what the index route (tools/extract-entities.js) cannot build:
// enum- and entity-typed properties.
//
// ARGS: { entities: { bundleIdentifier: { typeName: [propertyId, ...] } }, budgetMs }. One JSON line per
// entity is appended to ~/.shortcutkit-dev/linkd/properties.jsonl as it goes; entities already in that
// file are skipped, so a run cut short by the budget is resumed by running again.
function main() {
  const ARGS = __ARGS__;
  const WANT = ARGS.entities, BUDGET = ARGS.budgetMs || 600000, t0 = Date.now();
  const dir = ObjC.unwrap($("~/.shortcutkit-dev/linkd").stringByExpandingTildeInPath), path = dir + "/properties.jsonl";
  const fm = $.NSFileManager.defaultManager;
  fm.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(dir, true, $(), null);
  const done = new Set();
  const prior = $.NSString.stringWithContentsOfFileEncodingError(path, 4, null);
  if (!prior.isNil()) for (const line of ObjC.unwrap(prior).split("\n")) { if (line.startsWith("{")) { const o = JSON.parse(line); if (o.entity) done.add(o.entity); } }
  if (done.size === 0) fm.createFileAtPathContentsAttributes(path, $(), $());
  const fh = $.NSFileHandle.fileHandleForWritingAtPath(path);
  const emit = (o) => { fh.seekToEndOfFile; fh.writeData($(JSON.stringify(o) + "\n").dataUsingEncoding(4)); };
  const list = (v) => { const a = []; if (!v || v.isNil()) return a; if (v.isKindOfClass($.NSDictionary)) { const ks = v.allKeys; for (let i = 0; i < Number(ks.count); i++) { const x = v.objectForKey(ks.objectAtIndex(i)); if (x.isKindOfClass($.NSArray)) { for (let j = 0; j < Number(x.count); j++) a.push(x.objectAtIndex(j)); } else a.push(x); } } else for (let i = 0; i < Number(v.count); i++) a.push(v.objectAtIndex(i)); return a; };
  emit({ start: new Date().toISOString(), process: ObjC.unwrap($.NSProcessInfo.processInfo.processName), resumed: done.size });
  const p = $.NSClassFromString("LNMetadataProvider").alloc.init;
  const allQ = p.queriesWithError(null);
  let count = 0, stoppedAt = null;
  outer: for (const bundle of Object.keys(WANT)) {
    let ents = null;
    const qs = allQ.isNil() ? [] : list(allQ.objectForKey(bundle));
    for (const [typeName, want] of Object.entries(WANT[bundle])) {
      const pids = want.properties;
      const id = bundle + "." + typeName;
      if (done.has(id)) continue;
      if (Date.now() - t0 > BUDGET) { stoppedAt = id; break outer; }
      if (ents === null) ents = list(p.entitiesForBundleIdentifierError(bundle, null));
      const r = { linkd: false };
      try {
        const ent = ents.find((e) => ObjC.unwrap(e.identifier) === typeName);
        if (ent) {
          r.linkd = true;
          const lp = ent.properties; r.linkdProperties = []; for (let i = 0; i < Number(lp.count); i++) r.linkdProperties.push(ObjC.unwrap(lp.objectAtIndex(i).identifier));
          // The query tools/extract-engine-filters.js chose for the type (WANT's "query"), else the first by identifier.
          const cands = qs.filter((x) => ObjC.unwrap(x.entityType) === typeName).sort((a, b) => (ObjC.unwrap(a.identifier) < ObjC.unwrap(b.identifier) ? -1 : 1));
          const q = cands.find((x) => ObjC.unwrap(x.identifier) === want.query) || cands[0] || null;
          r.query = q ? ObjC.unwrap(q.identifier) : null; r.queries = cands.map((x) => ObjC.unwrap(x.identifier));
          const evt = $.NSClassFromString("LNEntityValueType").alloc.initWithIdentifier(typeName);
          const cls = ent.wf_contentItemClassWithEntityValueTypeQueryMetadataAppBundleIdentifierDisplayedAppBundleIdentifier(evt, q ? q : $(), bundle, bundle);
          if (cls && !cls.isNil()) {
            r.yields = {};
            for (const pid of pids) {
              const ag = $.NSClassFromString("WFPropertyVariableAggrandizement").alloc.initWithDictionary($({ Type: "WFPropertyVariableAggrandizement", PropertyName: pid }));
              const pc = ag.processedContentClasses($.NSOrderedSet.orderedSetWithObject(cls));
              const arr = pc.isKindOfClass($.NSOrderedSet) ? pc.array : pc; const ys = [];
              for (let i = 0; i < Number(arr.count); i++) ys.push(ObjC.unwrap($.NSStringFromClass(arr.objectAtIndex(i))));
              r.yields[pid] = ys;
            }
          }
        }
      } catch (e) { r.error = String(e); }
      emit({ entity: id, ms: Date.now() - t0, r }); count++;
    }
  }
  emit({ done: true, entities: count, stoppedAt, ms: Date.now() - t0 });
  fh.closeFile;
  // A plain sentence: the Output action turns a JSON-looking result into a dictionary, which `shortcuts run --output-path` writes as nothing.
  return "resolved " + count + " entities (" + done.size + " already done) to " + path + " in " + (Date.now() - t0) + " ms (" + ObjC.unwrap($.NSProcessInfo.processInfo.processName) + ")" + (stoppedAt ? "; stopped at " + stoppedAt : "");
}
