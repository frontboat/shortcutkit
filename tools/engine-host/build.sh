#!/bin/sh
# Builds build/skhost (ad-hoc signed). Needs clang from the Xcode Command Line Tools.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$here/build"
clang -fobjc-arc -O1 -Wall -Wno-unused-function -o "$here/build/skhost" "$here/skhost.m" "$here/trampoline.s" \
  -framework Foundation -framework OSAKit -Wl,-export_dynamic
codesign -s - -f "$here/build/skhost" 2>/dev/null
echo "built $here/build/skhost"
