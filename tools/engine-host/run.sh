#!/bin/sh
# run.sh <script.js> [args...]: run a JXA probe in skhost (see skhost.m), under lldb.
#
# lldb does two things: it returns from +[WFActionKitStaticInitializer load] before its
# platform-binary assertion runs, and it looks up the private Swift symbols skhost calls
# (addresses.py). Needs the Xcode Command Line Tools. Set SK_LINKD_DIR to a directory of linkd
# archives (tools/linkd/archive-metadata.js writes ~/.shortcutkit-dev/linkd) to serve them;
# the default is that directory when it exists.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
host="$here/build/skhost"
[ -x "$host" ] || "$here/build.sh"
dir="${SK_LINKD_DIR-$HOME/.shortcutkit-dev/linkd}"
[ -d "$dir" ] || dir=""
cmds="$(mktemp)"
trap 'rm -f "$cmds"' EXIT
{
  echo "command script import '$here/addresses.py'"
  echo "breakpoint set -n '+[WFActionKitStaticInitializer load]' -G true -C 'thread return'"
  echo "breakpoint set -n sk_addresses_ready -G true"
  echo "breakpoint command add -F addresses.set_addresses 2"
  printf 'process launch --'; for a in "$@"; do printf " '%s'" "$(printf %s "$a" | sed "s/'/'\\\\''/g")"; done; echo
} > "$cmds"
# lldb echoes its own commands and stop notices; keep only the probe's output. Exit with the probe's status.
SK_LINKD_DIR="$dir" lldb --batch --source "$cmds" "$host" 2>&1 | awk '
  /^\(lldb\)|^Current executable|^Breakpoint [0-9]|^Executing commands|^command source|^[0-9]+ locations? added|^WARNING:  Unable to resolve breakpoint/ { next }
  /^Process [0-9]+ exited with status = ([0-9]+)/ { match($0, /status = [0-9]+/); status = substr($0, RSTART + 9, RLENGTH - 9); next }
  /^Process [0-9]+ (launched|stopped)/ { next }
  /^\* thread #1|^ *frame #0|^libobjc|^->  0x|^    0x[0-9a-f]+ <\+[0-9]+>:|^Target 0:/ { next }
  { print }
  END { exit status + 0 }'
