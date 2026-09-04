#!/bin/bash
# Regenerate data/builtin-actions.json, docs/builtin-actions-reference.md,
# data/parameter-encodings.json, docs/parameter-encodings.md, data/encoding-table.json,
# data/apple-app-intents.json, docs/apple-app-intents-reference.md and
# data/builtin-action-identifiers.txt from the Shortcuts engine on this Mac.
#
#   bun run extract          # or ./tools/extract-builtin-actions.sh from the repo root
#
# Needs python3 (3.9+) and osascript (part of macOS). No compiler: the engine probes are
# JavaScript for Automation scripts because ActionKit, which owns about a quarter of the
# built-in actions, only loads into Apple platform binaries such as osascript (see
# tools/jxa-prelude.js). Bun is optional (rebuilds the TypeScript package's declarations when
# its node_modules exist).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="$(dirname "$here")"
data="$out/data"
docs="$out/docs"
mkdir -p "$data" "$docs"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# Run a probe inside osascript, a platform binary, so ActionKit's actions are included.
jxa() { local name="$1"; shift; cat "$here/jxa-prelude.js" "$here/$name.js" > "$work/$name.js"; osascript -l JavaScript "$work/$name.js" "$@"; }

echo "querying WorkflowKit and ActionKit"
jxa extract-builtin-actions "$data/builtin-actions.json"

# The Shortcuts app's own action index (~/Library/Shortcuts/ToolKit) is the only readable copy of
# linkd's registry: Apple's App Intents with their exact identifiers, plus English names for the
# definitions the engine leaves unnamed. Requires Shortcuts.app to have run once on this Mac.
echo "mapping parameter classes to state classes"
jxa extract-parameter-encodings "$data/parameter-encodings.json"
python3 "$here/render-parameter-encodings.py" "$data/parameter-encodings.json" "$docs/parameter-encodings.md"

echo "serializing variables, token strings, state classes, palette, App Intents value types"
jxa extract-encoding-table "$data/encoding-table.json" "$data/parameter-encodings.json"

echo "reading the Shortcuts app's action registry"
python3 "$here/dump-toolkit-registry.py" "$data"
python3 "$here/render-apple-app-intents.py" "$data/apple-app-intents.json" "$docs/apple-app-intents-reference.md"

echo "filling names, output names and enumeration cases the definitions leave out"
python3 "$here/annotate-builtin-actions.py" "$data/builtin-actions.json" "$data/toolkit-names.json" "$data/parameter-encodings.json"

echo "rendering markdown"
python3 "$here/render-builtin-actions.py" "$data/builtin-actions.json" "$docs/builtin-actions-reference.md"

echo "refreshing the Python package's bundled definitions"
mkdir -p "$out/python/src/shortcutkit/data" && cp "$data/builtin-actions.json" "$out/python/src/shortcutkit/data/builtin-actions.json"
[ -f "$data/provenance.json" ] && cp "$data/provenance.json" "$out/python/src/shortcutkit/data/provenance.json"

echo "generating typed action catalogues"
python3 "$here/generate-action-catalog.py" "$data/builtin-actions.json" "$data/apple-app-intents.json"
if [ -d "$out/node_modules" ]; then (cd "$out" && bunx tsc -p tsconfig.build.json); fi

echo "dumping Apple's gallery workflows and installed apps' App Intents actions"
python3 "$here/dump-gallery.py" "$data/gallery-workflows.json" | tail -1
python3 "$here/dump-appintents-actions.py" "$data/app-provided-actions.json" | tail -1

echo "listing identifier strings from the dyld shared cache"
cache_dir=/System/Volumes/Preboot/Cryptexes/OS/System/Library/dyld
if ls "$cache_dir"/dyld_shared_cache_arm64e* >/dev/null 2>&1; then
  if command -v rg >/dev/null; then
    rg -a -o --no-filename 'is\.workflow\.actions\.[A-Za-z0-9._-]+' "$cache_dir"/dyld_shared_cache_arm64e* 2>/dev/null
  else
    grep -a -o -E -h 'is\.workflow\.actions\.[A-Za-z0-9._-]+' "$cache_dir"/dyld_shared_cache_arm64e* 2>/dev/null
  fi | sort -u > "$data/builtin-action-identifiers.txt"
  echo "$(wc -l < "$data/builtin-action-identifiers.txt" | tr -d ' ') identifiers -> data/builtin-action-identifiers.txt"
else
  echo "shared cache not found at $cache_dir; skipped identifier list"
fi
echo "recording provenance"
shortcuts_version="$(defaults read /System/Applications/Shortcuts.app/Contents/Info.plist CFBundleShortVersionString 2>/dev/null || echo unknown)"
shortcuts_build="$(defaults read /System/Applications/Shortcuts.app/Contents/Info.plist CFBundleVersion 2>/dev/null || echo unknown)"
cat > "$data/provenance.json" <<JSON
{
  "extractedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "macOS": { "version": "$(sw_vers -productVersion)", "build": "$(sw_vers -buildVersion)", "arch": "$(uname -m)" },
  "shortcutsApp": { "version": "$shortcuts_version", "build": "$shortcuts_build" },
  "workflowKit": "$(defaults read /System/Library/PrivateFrameworks/WorkflowKit.framework/Versions/A/Resources/Info.plist CFBundleShortVersionString 2>/dev/null || echo unknown)",
  "actionKit": "$(defaults read /System/Library/PrivateFrameworks/ActionKit.framework/Versions/A/Resources/Info.plist CFBundleShortVersionString 2>/dev/null || echo unknown)",
  "toolKit": $(python3 -c "import json;print(json.dumps(json.load(open('$data/apple-app-intents.json'))['provenance']))"),
  "counts": {
    "builtinActions": $(python3 -c "import json;print(len(json.load(open('$data/builtin-actions.json'))))"),
    "appleAppIntents": $(python3 -c "import json;print(len(json.load(open('$data/apple-app-intents.json'))['actions']))"),
    "identifierStrings": $(wc -l < "$data/builtin-action-identifiers.txt" | tr -d ' '),
    "appProvidedActions": $(python3 -c "import json;print(len(json.load(open('$data/app-provided-actions.json'))))")
  },
  "note": "appProvidedActions counts the App Intents actions of apps installed on the extracting machine; that dump and toolkit-registry.json are local and not committed."
}
JSON
cp "$data/provenance.json" "$out/python/src/shortcutkit/data/provenance.json"
echo "done: $(sw_vers -productVersion) $(uname -m)"
