"""Checks data/linkd-properties.json (tools/engine-host, linkd mode) against what the same resolution
gives inside ShortcutsMacHelper (tools/linkd/resolve-properties.js, properties.jsonl): the host
serves linkd's archived metadata in place of linkd itself, and this proves the two routes agree.

    python3 tools/compare-linkd-properties.py ~/.shortcutkit-dev/linkd/properties.jsonl data/linkd-properties.json
"""
import json
import sys

lines, data_path = sys.argv[1:3]
helper = {}
for line in open(lines):
    line = line.strip()
    if line.startswith("{") and '"entity"' in line:
        o = json.loads(line)
        helper[o["entity"]] = o["r"]
host = json.load(open(data_path))["entities"]

problems = []
same = 0
for eid, h in helper.items():
    o = host.get(eid)
    if o is None:
        problems.append(f"{eid}: not in {data_path}")
        continue
    if (h.get("linkd", False), h.get("query"), h.get("queries", []), h.get("linkdProperties", [])) != (o.get("linkd", False), o.get("query"), o.get("queries", []), o.get("linkdProperties", [])):
        problems.append(f"{eid}: entity metadata differs")
    hy, oy = h.get("yields") or {}, o.get("yields") or {}
    for pid in sorted(set(hy) | set(oy)):
        if hy.get(pid) == oy.get(pid):
            same += 1
        else:
            problems.append(f"{eid}.{pid}: helper {hy.get(pid)} host {oy.get(pid)}")
missing = sorted(set(host) - set(helper))
print(f"{same} properties agree between ShortcutsMacHelper and the host; {len(helper)} entities compared" + (f", {len(missing)} not run in the helper" if missing else ""))
if problems:
    sys.exit("\n".join(problems[:20]) + (f"\n... {len(problems)} differences" if len(problems) > 20 else ""))
