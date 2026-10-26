#!/bin/sh
# jxa-probe.sh <probe.js> [args...]: run a one-off JXA probe against the engine under osascript,
# with tools/jxa-prelude.js and the definition probe's helpers (sanitize, plain) prepended, the
# same way tools/extract-builtin-actions.sh and test/verify/run.sh assemble their probes.
# The probe defines run(argv) and returns a string. For a probe that needs ActionKit past its
# platform-binary check, or linkd's archives, use tools/engine-host/run.sh with the same file.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
probe="$1"; shift
work="$(mktemp -t sk-probe.XXXXXX.js)"
trap 'rm -f "$work"' EXIT
{ cat "$here/jxa-prelude.js"; sed -n '1,/^function run(/p' "$here/extract-builtin-actions.js" | sed '$d'; cat "$probe"; } > "$work"
osascript -l JavaScript "$work" "$@"
