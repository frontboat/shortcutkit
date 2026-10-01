#!/bin/bash
# Programmatic validation of everything the library writes:
#   1. fixture.ts / fixture.py drive each package over every action, key and value form
#   2. parity.py proves the two packages write the same bytes
#   3. verify-encodings.js round-trips every value form through each state class (data/encoding-roundtrips.json)
#   4. verify-library-output.js loads every case and every whole shortcut through the engine
# Needs macOS (the engine) and Shortcuts.app to have run once; run by `bun run verify` and by CI (advisory there; see ci.yml). VERIFY_TRACE=1 names each engine action as it loads, VERIFY_TRACE=calls each engine call; VERIFY_ONLY=<regex> limits step 4 to matching identifiers.
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
if ! jxa verify-library-output "$work/fixture-ts.json" "$root/data/apple-app-intents.json" "$root/data/parameter-encodings.json" "$root/data/encoding-table.json" "$work/roundtrips.json" "$work/report.json"; then
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
