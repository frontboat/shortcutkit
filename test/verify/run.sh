#!/bin/bash
# Programmatic validation of everything the library writes:
#   1. fixture.ts / fixture.py drive each package over every action, key and value form
#   2. parity.py proves the two packages write the same bytes
#   3. verify-encodings.js round-trips every value form through each state class (data/encoding-roundtrips.json)
#   4. verify-library-output.js loads every case and every whole shortcut through the engine
# Needs macOS (the engine) and Shortcuts.app to have run once; run by `bun run verify` and by CI (an older runner engine reports version gaps instead of failing; see ci.yml). VERIFY_TRACE=1 names each engine action as it loads, VERIFY_TRACE=calls each engine call; VERIFY_ONLY=<regex> limits step 4 to matching identifiers.
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
work="$(mktemp -d)"; trap 'rm -rf "$work"' EXIT
py="${PYTHON:-$root/python/.venv/bin/python}"; [ -x "$py" ] || py=python3
jxa() { local name="$1"; shift; cat "$root/tools/jxa-prelude.js" "$root/tools/$name.js" > "$work/$name.js"; osascript -l JavaScript "$work/$name.js" "$@"; }
echo "generating fixtures from both packages"
bun "$root/test/verify/fixture.ts" "$work/fixture-ts.json"
PYTHONPATH="$root/python/src" "$py" "$root/test/verify/fixture.py" "$work/fixture-py.json"
python3 "$root/test/verify/parity.py" "$work/fixture-ts.json" "$work/fixture-py.json"
echo "round-tripping value forms through the engine's state classes"
jxa verify-encodings "$root/data/parameter-encodings.json" "$root/data/encoding-table.json" "$work/roundtrips.json"
echo "loading every case and whole shortcut through the engine"
verify_args=("$work/fixture-ts.json" "$root/data/apple-app-intents.json" "$root/data/parameter-encodings.json" "$root/data/encoding-table.json" "$work/roundtrips.json" "$work/report.json" "$root/data/provenance.json" "$root/data/apple-entities.json" "$root/data/linkd-properties.json")
# With the engine host built and linkd's archives saved (bun run extract-filters), the Find filters are also
# loaded through the entity classes the app builds, from linkd's metadata; osascript can only build the index's.
if [ -x "$root/tools/engine-host/build/skhost" ] && [ -d "$HOME/.shortcutkit-dev/linkd" ] && [ -z "${VERIFY_NO_HOST-}" ]; then
  echo "loading Find filters through linkd-built entity classes (tools/engine-host)"
  cat "$root/tools/jxa-prelude.js" "$root/tools/verify-library-output.js" > "$work/verify-host.js"
  host_args=("${verify_args[@]}"); host_args[5]="$work/report-host.json"
  if ! VERIFY_ONLY="${VERIFY_ONLY-}" SK_LINKD_DIR="$HOME/.shortcutkit-dev/linkd" "$root/tools/engine-host/run.sh" "$work/verify-host.js" "${host_args[@]}"; then
    cp "$work/report-host.json" /tmp/shortcutkit-host-report.json 2>/dev/null && echo "engine host verification failed; report copied to /tmp/shortcutkit-host-report.json"
    exit 1
  fi
fi
if ! jxa verify-library-output "${verify_args[@]}"; then
  # The report lives in $work, which the trap removes; print the failures while it exists.
  [ -f "$work/report.json" ] && python3 - "$work/report.json" <<'PY'
import collections, json, sys
failures = json.load(open(sys.argv[1]))["failures"]
by = collections.defaultdict(list)
for f in failures:
    by[(f.get("verdict"), f.get("via", ""))].append(f"{f.get('identifier', f.get('shortcut'))}.{f.get('key', '')} [{f.get('form', '')}]")
for (verdict, via), cases in sorted(by.items(), key=lambda kv: -len(kv[1])):
    print(f"{len(cases):5} {verdict} (via {via or 'shortcut load'})")
    for c in cases: print(f"        {c}")
PY
  exit 1
fi
