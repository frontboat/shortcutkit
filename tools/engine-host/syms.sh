#!/bin/sh
# syms.sh <regex> [probe.js]: WorkflowKit's symbol names matching the regex, from a one-off lldb
# session on skhost (syms.py). The process is launched with the probe (default: one that only
# loads the engine) so the shared cache's private symbol table is in the target; the same
# breakpoints as run.sh keep ActionKit's platform-binary assertion out of the way.
#   tools/engine-host/syms.sh '(?i)denylist|discoverab'
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
host="$here/build/skhost"
[ -x "$host" ] || "$here/build.sh"
pattern="$1"
probe="${2-}"
work="$(mktemp -d -t sk-syms)"
trap 'rm -rf "$work"' EXIT
if [ -z "$probe" ]; then
  probe="$work/load.js"
  { cat "$here/../jxa-prelude.js"; echo 'function run() { loadEngine(); return "loaded"; }'; } > "$probe"
fi
cat > "$work/cmds" <<EOF
command script import '$here/addresses.py'
command script import '$here/syms.py'
breakpoint set -n '+[WFActionKitStaticInitializer load]' -G true -C 'thread return'
breakpoint set -n sk_addresses_ready
process launch -- '$probe'
syms $pattern
kill
quit
EOF
SK_LINKD_DIR="${SK_LINKD_DIR-$HOME/.shortcutkit-dev/linkd}" lldb --batch --source "$work/cmds" "$host" 2>&1 | awk '
  /^\(lldb\)|^Process|^Breakpoint|^Current|^\* thread|frame #|^->|^    0x|^Target|^Executing|^command|libobjc|^WARNING|location added|^$/ { next }
  { print }'
