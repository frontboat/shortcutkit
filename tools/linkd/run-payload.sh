#!/bin/sh
# run-payload.sh <payload.js> [args-json] [progress.jsonl]: run a script inside ShortcutsMacHelper, the Shortcuts
# app's helper process, which has the com.apple.linkd.registry entitlement that linkd requires of
# its callers (osascript, swift and our own binaries are refused).
#
# The loader shortcut (build-loader.ts; its name is "SK <sha256 of loader.js>") evaluates
# ~/.shortcutkit-dev/payload.js and returns main()'s result. This copies the payload there with
# __ARGS__ replaced by the JSON argument, runs the loader, and prints the result. Long payloads
# stream progress to ~/.shortcutkit-dev/linkd/ as they go (the helper can write to the user's home).
# A run that hangs blocks every later run until `killall siriactionsd`.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
payload="$1"; args="${2-null}"
name="SK $(shasum -a 256 "$here/loader.js" | cut -c1-7)"
if ! shortcuts list | grep -qx "$name"; then
  echo "the loader shortcut \"$name\" is not in the Shortcuts library; build it with: bun tools/linkd/build-loader.ts /tmp" >&2
  exit 2
fi
dev="$HOME/.shortcutkit-dev"
mkdir -p "$dev/linkd" && chmod 700 "$dev"
python3 - "$payload" "$args" "$dev/payload.js" <<'EOF'
import sys
src = open(sys.argv[1]).read().replace("__ARGS__", sys.argv[2])
open(sys.argv[3], "w").write(src)
EOF
# The result comes back on stdout (--output-path only writes file results). `shortcuts run` now and
# then never returns after the payload has finished; the payloads end their progress file with a
# {"done":true} line, so when that line appears and the run has not exited within 15 s, the run is
# killed along with siriactionsd (which would otherwise hold every later run).
progress="${3-}"
# Only lines this run appends count (resolve-properties.js resumes from its own earlier lines).
before=0; [ -n "$progress" ] && [ -f "$progress" ] && before=$(wc -l < "$progress")
shortcuts run "$name" &
run=$!
waited=0
while kill -0 "$run" 2>/dev/null; do
  sleep 1
  if [ -n "$progress" ] && [ -f "$progress" ] && tail -n "+$((before + 1))" "$progress" | grep -q '"done":true'; then
    waited=$((waited + 1))
    if [ "$waited" -ge 15 ]; then
      echo "the payload finished but \`shortcuts run\` did not return; restarting siriactionsd" >&2
      kill "$run" 2>/dev/null; killall siriactionsd 2>/dev/null || true
      break
    fi
  fi
done
wait "$run" 2>/dev/null || true
echo
