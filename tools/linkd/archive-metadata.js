// Payload for run-payload.sh: saves linkd's metadata for the given bundles as keyed archives, so a
// process without the linkd entitlement (tools/engine-host) can serve them to WorkflowKit.
//   ~/.shortcutkit-dev/linkd/<bundle>.archive   { entities: [LNEntityMetadata], enums: [LNEnumMetadata] }
//   ~/.shortcutkit-dev/linkd/queries.archive    linkd's queriesWithError: dictionary, bundle -> [LNQueryMetadata]
// Progress streams to ~/.shortcutkit-dev/linkd/progress.jsonl. ARGS: { bundles: [...], budgetMs }.
function main() {
  const ARGS = __ARGS__;
  const BUNDLES = ARGS.bundles, BUDGET = ARGS.budgetMs || 600000, t0 = Date.now();
  const fm = $.NSFileManager.defaultManager, dir = ObjC.unwrap($("~/.shortcutkit-dev/linkd").stringByExpandingTildeInPath);
  fm.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(dir, true, $(), null);
  fm.createFileAtPathContentsAttributes(dir + "/progress.jsonl", $(), $());
  const fh = $.NSFileHandle.fileHandleForWritingAtPath(dir + "/progress.jsonl");
  const emit = (o) => { fh.seekToEndOfFile; fh.writeData($(JSON.stringify(o) + "\n").dataUsingEncoding(4)); };
  const save = (name, obj) => {
    const err = Ref();
    const data = $.NSKeyedArchiver.archivedDataWithRootObjectRequiringSecureCodingError(obj, false, err);
    if (!data || data.isNil()) return "archive failed: " + (err[0] && !err[0].isNil() ? ObjC.unwrap(err[0].localizedDescription) : "?");
    return data.writeToFileAtomically(dir + "/" + name + ".archive", true) ? Number(data.length) : "write failed";
  };
  const n = (v) => (!v || v.isNil() ? null : Number(v.count));
  emit({ start: new Date().toISOString(), process: ObjC.unwrap($.NSProcessInfo.processInfo.processName), bundles: BUNDLES.length });
  const p = $.NSClassFromString("LNMetadataProvider").alloc.init;
  const queries = p.queriesWithError(null);
  emit({ queries: n(queries), bytes: save("queries", queries), ms: Date.now() - t0 });
  let done = 0, stoppedAt = null;
  for (const b of BUNDLES) {
    if (Date.now() - t0 > BUDGET) { stoppedAt = b; break; }
    const r = { bundle: b };
    try {
      const ents = p.entitiesForBundleIdentifierError(b, null), enums = p.enumsForBundleIdentifierError(b, null);
      r.entities = n(ents); r.enums = n(enums);
      r.bytes = save(b, $({ entities: ents && !ents.isNil() ? ents : $([]), enums: enums && !enums.isNil() ? enums : $([]) }));
    } catch (e) { r.error = String(e); }
    r.ms = Date.now() - t0; emit(r); done++;
  }
  emit({ done: true, bundlesDone: done, stoppedAt, ms: Date.now() - t0 });
  fh.closeFile;
  // A plain sentence: the Output action turns a JSON-looking result into a dictionary, which `shortcuts run --output-path` writes as nothing.
  return "saved " + done + " of " + BUNDLES.length + " bundles to " + dir + " in " + (Date.now() - t0) + " ms (" + ObjC.unwrap($.NSProcessInfo.processInfo.processName) + ")" + (stoppedAt ? "; stopped at " + stoppedAt : "");
}
