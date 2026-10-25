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
    actions = json.load(open(data + "/apple-app-intents.json"))["actions"]
    bundles = {e["bundleIdentifier"] for e in entities.values()} | {(a.get("app") or {}).get("bundleIdentifier") for a in actions.values()}
    print(json.dumps({"bundles": sorted(bundles - {None}), "budgetMs": 120000}))
elif kind == "properties":
    chosen = json.load(open(data + "/linkd-properties.json"))["entities"]
    want = {}
    for eid, e in entities.items():
        pids = sorted(set(e["properties"]) | set((chosen.get(eid) or {}).get("yields") or {}))
        want.setdefault(e["bundleIdentifier"], {})[e["typeName"]] = {"properties": pids, "query": (chosen.get(eid) or {}).get("query")}
    print(json.dumps({"entities": want, "budgetMs": 1500000}))
else:
    sys.exit("usage: engine-filter-args.py bundles|properties <data dir>")
