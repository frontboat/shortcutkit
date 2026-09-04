#!/bin/bash
# Programmatic validation of everything the library writes:
#   1. fixture.ts / fixture.py drive each package over every action, key and value form
#   2. parity.py proves the two packages write the same bytes
#   3. verify-encodings.js round-trips every value form through each state class (data/encoding-roundtrips.json)
#   4. verify-library-output.js loads every case and every whole shortcut through the engine
# Needs macOS (the engine) and Shortcuts.app to have run once; run by `bun run verify` and by CI.
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
jxa verify-library-output "$work/fixture-ts.json" "$root/data/apple-app-intents.json" "$root/data/parameter-encodings.json" "$root/data/encoding-table.json" "$work/roundtrips.json" "$work/report.json"
