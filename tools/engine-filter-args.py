"""Arguments for the tools/linkd payloads, from the committed data.

    engine-filter-args.py bundles <data dir>     {"bundles": [...], "budgetMs"}: every Apple bundle that owns an
                                                 entity type or an App Intents action (archive-metadata.js)
    engine-filter-args.py properties <data dir>  {"entities": {bundle: {typeName: {properties: [ids], query}}}, "budgetMs"}
                                                 (resolve-properties.js; the query is the one linkd-properties.json chose)
"""
import json
import sys

kind, data = sys.argv[1:3]
entities = json.load(open(data + "/apple-entities.json"))["entities"]
if kind == "bundles":
    # Every Apple bundle the index knows, from the full local dump rather than the committed
    # catalogue: the catalogue is itself filtered by what these payloads find (intents linkd marks
    # not discoverable leave it), so deriving the bundle list from it would shrink the next run.
    tools = json.load(open(data + "/toolkit-registry.json"))["tools"]
    bundles = {(t.get("app") or {}).get("bundleIdentifier") for t in tools if t["provider"] == "WFLinkActionProvider"}
    bundles |= {e["bundleIdentifier"] for e in entities.values()}
    bundles = {b for b in bundles if b and b.startswith("com.apple.")}
    print(json.dumps({"bundles": sorted(bundles), "budgetMs": 120000}))
elif kind == "properties":
    chosen = json.load(open(data + "/linkd-properties.json"))["entities"]
    want = {}
    for eid, e in entities.items():
        pids = sorted(set(e["properties"]) | set((chosen.get(eid) or {}).get("yields") or {}))
        want.setdefault(e["bundleIdentifier"], {})[e["typeName"]] = {"properties": pids, "query": (chosen.get(eid) or {}).get("query")}
    print(json.dumps({"entities": want, "budgetMs": 1500000}))
else:
    sys.exit("usage: engine-filter-args.py bundles|properties <data dir>")
