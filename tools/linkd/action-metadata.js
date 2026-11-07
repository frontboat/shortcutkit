// Payload for run-payload.sh: what linkd says about each App Intents action of the given bundles,
// beyond what the Shortcuts app's index records: its availability per platform and its visibility
// metadata (`isDiscoverable`, `assistantOnly`). An action that is not discoverable is the one the
// app refuses to import ("contains features not supported on this device"); see
// docs/extraction.md, "Hidden actions".
//   ~/.shortcutkit-dev/linkd/actions.json   { bundle: { identifier: { discoverable, assistantOnly,
//                                             availability: { platform: { introduced, deprecated, obsoleted } } } } }
// ARGS: { bundles: [...] }. Only getters known to be safe are called: reading every property of
// linkd's metadata objects reflectively crashes ShortcutsMacHelper ("Couldn't communicate with a
// helper application"), after which `killall siriactionsd ShortcutsMacHelper` is needed.
// Drop only process-local object-header addresses, preserving messages and replacement identifiers.
// Keep null bundles (no result) distinct from successful empty results, which add no action metadata.
function normalizeActionMetadata(metadata) {
  const normalized = {};
  for (const bundle of Object.keys(metadata)) {
    const entry = metadata[bundle];
    if (entry === null) { normalized[bundle] = null; continue; }
    if (!Object.keys(entry).length) continue;
    const actions = {};
    for (const identifier of Object.keys(entry)) {
      const action = Object.assign({}, entry[identifier]);
      if (typeof action.deprecated === "string") {
        action.deprecated = action.deprecated.replace(/(<[A-Za-z_][A-Za-z0-9_.$]*): 0x[0-9a-fA-F]+(?=[,>])/g, "$1");
      }
      actions[identifier] = action;
    }
    normalized[bundle] = actions;
  }
  return normalized;
}

function main() {
  const ARGS = __ARGS__;
  const dir = ObjC.unwrap($("~/.shortcutkit-dev/linkd").stringByExpandingTildeInPath);
  const str = (v) => (v && !v.isNil() ? ObjC.unwrap(v) : null);
  const version = (v) => (v && !v.isNil() ? str(v.description) : null);
  const p = $.NSClassFromString("LNMetadataProvider").alloc.init;
  const out = {};
  let n = 0;
  for (const bundle of ARGS.bundles) {
    const acts = p.actionsForBundleIdentifierError(bundle, null);
    if (!acts || acts.isNil()) { out[bundle] = null; continue; }
    const entry = {};
    for (let i = 0; i < Number(acts.count); i++) {
      const a = acts.objectAtIndex(i);
      const e = { discoverable: !!a.isDiscoverable, availability: {} };
      const vis = a.visibilityMetadata;
      if (vis && !vis.isNil()) e.assistantOnly = !!vis.assistantOnly;
      const ann = a.availabilityAnnotations;
      if (ann && !ann.isNil()) {
        const keys = ann.allKeys;
        for (let k = 0; k < Number(keys.count); k++) {
          const key = keys.objectAtIndex(k), v = ann.objectForKey(key);
          e.availability[str(key.description)] = { introduced: version(v.introducedVersion), deprecated: version(v.deprecatedVersion), obsoleted: version(v.obsoletedVersion) };
        }
      }
      const dep = a.deprecationMetadata;
      if (dep && !dep.isNil()) e.deprecated = str(dep.description);
      entry[str(a.identifier)] = e; n++;
    }
    out[bundle] = entry;
  }
  $(JSON.stringify(normalizeActionMetadata(out))).writeToFileAtomicallyEncodingError(dir + "/actions.json", true, 4, null);
  // A plain sentence: the Output action turns a JSON-looking result into a dictionary, which `shortcuts run --output-path` writes as nothing.
  return "saved " + n + " actions of " + ARGS.bundles.length + " bundles to " + dir + "/actions.json";
}
