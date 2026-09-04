#!/bin/bash
# Regenerate data/builtin-actions.json, docs/builtin-actions-reference.md,
# data/parameter-encodings.json, docs/parameter-encodings.md, data/encoding-table.json and
# data/builtin-action-identifiers.txt from the Shortcuts engine on this Mac.
#
#   bun run extract          # or ./tools/extract-builtin-actions.sh from the repo root
#
# Needs Xcode or the Command Line Tools (xcrun clang) and python3 (3.9+). Bun is optional
# (rebuilds the TypeScript package's declarations when its node_modules exist).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="$(dirname "$here")"
data="$out/data"
docs="$out/docs"
mkdir -p "$data" "$docs"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

echo "compiling extractor"
xcrun clang -fobjc-arc -framework Foundation -o "$work/extract" "$here/extract-builtin-actions.m"

echo "querying WorkflowKit"
"$work/extract" "$data/builtin-actions.json"

echo "rendering markdown"
python3 "$here/render-builtin-actions.py" "$data/builtin-actions.json" "$docs/builtin-actions-reference.md"

echo "compiling parameter-encoding probe"
xcrun clang -fobjc-arc -fobjc-exceptions -framework Foundation -o "$work/encodings" "$here/extract-parameter-encodings.m"
echo "mapping parameter classes to state classes"
"$work/encodings" "$data/parameter-encodings.json" 2>&1 | rg -v "must implement" || true
python3 "$here/render-parameter-encodings.py" "$data/parameter-encodings.json" "$docs/parameter-encodings.md"

echo "compiling encoding-table probe"
xcrun clang -fobjc-arc -fobjc-exceptions -framework Foundation -o "$work/enctable" "$here/extract-encoding-table.m"
echo "serializing variables, token strings, state classes, palette"
"$work/enctable" "$data/encoding-table.json" "$data/parameter-encodings.json"

echo "refreshing the Python package's bundled definitions"
mkdir -p "$out/python/src/shortcutkit/data" && cp "$data/builtin-actions.json" "$out/python/src/shortcutkit/data/builtin-actions.json"
[ -f "$data/provenance.json" ] && cp "$data/provenance.json" "$out/python/src/shortcutkit/data/provenance.json"

echo "generating typed action catalogues"
python3 "$here/generate-action-catalog.py" "$data/builtin-actions.json"
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
  "counts": {
    "builtinActions": $(python3 -c "import json;print(len(json.load(open('$data/builtin-actions.json'))))"),
    "identifierStrings": $(wc -l < "$data/builtin-action-identifiers.txt" | tr -d ' '),
    "appProvidedActions": $(python3 -c "import json;print(len(json.load(open('$data/app-provided-actions.json'))))")
  },
  "note": "appProvidedActions counts the App Intents actions of apps installed on the extracting machine; that dump is local and not committed."
}
JSON
cp "$data/provenance.json" "$out/python/src/shortcutkit/data/provenance.json"
echo "done: $(sw_vers -productVersion) $(uname -m)"
