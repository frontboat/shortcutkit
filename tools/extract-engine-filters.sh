#!/bin/bash
# Optional extraction step: the engine's own Find-filter rules and linkd's property resolution.
#
#   bun run extract-filters          # data/engine-filters.json and data/linkd-properties.json, about a minute
#   bun run extract-filters --check  # also re-resolves every property inside ShortcutsMacHelper (10 min) and compares
#
# Beyond `bun run extract` this needs the Xcode Command Line Tools (clang and lldb, for
# tools/engine-host) and the loader shortcut from tools/linkd imported into Shortcuts. Steps:
#   1. the loader shortcut saves linkd's metadata to ~/.shortcutkit-dev/linkd (7 s), because linkd only
#      answers processes with the com.apple.linkd.registry entitlement;
#   2. tools/engine-host runs tools/extract-engine-filters.js twice with those archives served to
#      WorkflowKit and WorkflowKit's private Swift filter rules reachable: once for the index-built
#      classes and the built-in ones, once for the classes built from linkd's own metadata;
#   3. with --check, the loader shortcut resolves every entity property inside the helper, over XPC to
#      the real linkd, and the result must match the host's.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="$(dirname "$here")"
data="$out/data"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
dev="$HOME/.shortcutkit-dev/linkd"

echo "saving linkd's metadata from inside ShortcutsMacHelper"
rm -f "$dev/progress.jsonl"
python3 "$here/engine-filter-args.py" bundles "$data" > "$work/archive-args.json"
"$here/linkd/run-payload.sh" "$here/linkd/archive-metadata.js" "$(cat "$work/archive-args.json")" "$dev/progress.jsonl"

echo "reading the Shortcuts app's entity index"
python3 "$here/dump-toolkit-registry.py" --entities "$work/entities.json" "$work" > /dev/null

echo "asking WorkflowKit's filter rules about every class (tools/engine-host, under lldb)"
cat "$here/jxa-prelude.js" "$here/extract-entities.js" "$here/extract-engine-filters.js" > "$work/probe.js"
# Two processes: the engine registers one content item class per name, and the two routes build
# the same names (index-built entities for engine-filters.json, linkd-built for linkd-properties.json).
SK_LINKD_DIR="$dev" "$here/engine-host/run.sh" "$work/probe.js" index "$data/builtin-actions.json" "$work/entities.json" "$data/encoding-table.json" "$data/engine-filters.json"
echo "building every entity from linkd's own metadata and resolving its properties"
# A few types have several queries in linkd; each needs its own process (one class per type name).
pass=0
while :; do
  SK_LINKD_DIR="$dev" "$here/engine-host/run.sh" "$work/probe.js" linkd "$data/builtin-actions.json" "$work/entities.json" "$data/encoding-table.json" "$data/linkd-properties.json" "$pass"
  [ "$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["alternatesRemaining"])' "$data/linkd-properties.json")" = 0 ] && break
  pass=$((pass + 1))
done

if [ "${1-}" = "--check" ]; then
  echo "checking against the same resolution inside ShortcutsMacHelper (about 10 minutes; streams to $dev/properties.jsonl)"
  rm -f "$dev/properties.jsonl"
  python3 "$here/engine-filter-args.py" properties "$data" > "$work/properties-args.json"
  # The run resumes from properties.jsonl, so a run the helper cuts short is completed by running again.
  for attempt in 1 2 3; do
    "$here/linkd/run-payload.sh" "$here/linkd/resolve-properties.js" "$(cat "$work/properties-args.json")" "$dev/properties.jsonl"
    tail -n 1 "$dev/properties.jsonl" | grep -q '"stoppedAt":null' && break
  done
  python3 "$here/compare-linkd-properties.py" "$dev/properties.jsonl" "$data/linkd-properties.json"
fi
echo "done"
