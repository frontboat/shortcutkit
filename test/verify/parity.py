"""Diff the TypeScript and Python fixtures: the two packages must write the same bytes for the
same calls (UUIDs aside). Exit 1 on any difference.
    python3 test/verify/parity.py fixture-ts.json fixture-py.json
"""
import json
import sys

VOLATILE = {"UUID", "GroupingIdentifier", "OutputUUID"}


def strip(o):
    if isinstance(o, dict):
        return {k: strip(v) for k, v in o.items() if k not in VOLATILE}
    if isinstance(o, list):
        return [strip(x) for x in o]
    return o


ts, py = json.load(open(sys.argv[1])), json.load(open(sys.argv[2]))
tc = {(c["identifier"], c["key"], c["form"]): strip(c["params"]) for c in ts["cases"]}
pc = {(c["identifier"], c["key"], c["form"]): strip(c["params"]) for c in py["cases"]}
problems = [f"only in TypeScript: {k}" for k in sorted(set(tc) - set(pc))] + [f"only in Python: {k}" for k in sorted(set(pc) - set(tc))]
problems += [f"differs: {k}\n    ts {json.dumps(tc[k])[:200]}\n    py {json.dumps(pc[k])[:200]}" for k in sorted(set(tc) & set(pc)) if tc[k] != pc[k]]
for a, b in zip(ts["shortcuts"], py["shortcuts"]):
    if strip(a["plist"]) != strip(b["plist"]):
        problems.append(f"whole shortcut {a['name']} differs between packages")
print(f"parity: {len(tc)} TypeScript cases, {len(pc)} Python cases, {len(ts['shortcuts'])} shortcuts; {len(problems)} problem(s)")
for p in problems[:20]:
    print("  " + p)
sys.exit(1 if problems else 0)
