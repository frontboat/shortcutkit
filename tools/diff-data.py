#!/usr/bin/env python3
"""Compare the committed action data with a fresh extraction and recommend a version bump.

The generated catalogue is part of the package's type surface, so data changes follow
semver: additions are minor, removals or kind changes are major, no change is patch.

usage: diff-data.py [OLD.json NEW.json]     # defaults: git HEAD:data/builtin-actions.json vs working tree
       diff-data.py --changelog [...]         # print a CHANGELOG section instead of a summary
"""
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "builtin-actions.json"
APPS = ROOT / "data" / "apple-app-intents.json"
PROV = ROOT / "data" / "provenance.json"


def load_old(rel="data/builtin-actions.json"):
    try:
        out = subprocess.run(["git", "-C", str(ROOT), "show", f"HEAD:{rel}"], capture_output=True, check=True)
        return json.loads(out.stdout)
    except subprocess.CalledProcessError:
        return {}


def app_keys(action):
    return {p["key"]: p.get("kind") for p in action.get("parameters", []) if p.get("key")}


def diff_apps(old, new):
    """Same rules for the App Intents catalogue: parameter kinds are the type surface there."""
    added = sorted(set(new) - set(old)); removed = sorted(set(old) - set(new))
    key_added, key_removed, kind_changed = [], [], []
    for ident in sorted(set(old) & set(new)):
        ok, nk = app_keys(old[ident]), app_keys(new[ident])
        key_added += [f"{ident}.{k}" for k in sorted(set(nk) - set(ok))]
        key_removed += [f"{ident}.{k}" for k in sorted(set(ok) - set(nk))]
        kind_changed += [f"{ident}.{k}: {ok[k]} -> {nk[k]}" for k in sorted(set(ok) & set(nk)) if ok[k] != nk[k]]
    breaking = removed or key_removed or kind_changed
    bump = "major" if breaking else ("minor" if (added or key_added) else "patch")
    return {"bump": bump, "added": added, "removed": removed, "key_added": key_added, "key_removed": key_removed, "kind_changed": kind_changed, "renamed": []}


def keys(action):
    return {p["Key"]: p.get("Class") for p in action.get("Parameters", []) if isinstance(p, dict) and p.get("Key")}


def diff(old, new):
    added = sorted(set(new) - set(old))
    removed = sorted(set(old) - set(new))
    key_added, key_removed, kind_changed, renamed = [], [], [], []
    for ident in sorted(set(old) & set(new)):
        ok, nk = keys(old[ident]), keys(new[ident])
        key_added += [f"{ident}.{k}" for k in sorted(set(nk) - set(ok))]
        key_removed += [f"{ident}.{k}" for k in sorted(set(ok) - set(nk))]
        kind_changed += [f"{ident}.{k}: {ok[k]} -> {nk[k]}" for k in sorted(set(ok) & set(nk)) if ok[k] != nk[k]]
        on = old[ident].get("Name"); nn = new[ident].get("Name")
        if isinstance(on, str) and isinstance(nn, str) and on != nn:
            renamed.append(f"{ident}: {on!r} -> {nn!r}")
    breaking = removed or key_removed or kind_changed
    bump = "major" if breaking else ("minor" if (added or key_added) else "patch")
    return {"bump": bump, "added": added, "removed": removed, "key_added": key_added, "key_removed": key_removed, "kind_changed": kind_changed, "renamed": renamed}


def main(argv):
    changelog = "--changelog" in argv
    argv = [a for a in argv if a != "--changelog"]
    old = json.load(open(argv[0])) if len(argv) == 2 else load_old()
    new = json.load(open(argv[1])) if len(argv) == 2 else json.load(open(DATA))
    d = diff(old, new)
    if len(argv) != 2 and APPS.exists():
        a = diff_apps(load_old("data/apple-app-intents.json").get("actions", {}), json.load(open(APPS)).get("actions", {}))
        order = ["patch", "minor", "major"]
        d["bump"] = order[max(order.index(d["bump"]), order.index(a["bump"]))]
        for k in ("added", "removed", "key_added", "key_removed", "kind_changed"):
            d[k] = d[k] + a[k]
        d["apps"] = a
    prov = json.load(open(PROV)) if PROV.exists() else {}
    src = f"macOS {prov.get('macOS', {}).get('version', '?')} ({prov.get('macOS', {}).get('build', '?')}), Shortcuts {prov.get('shortcutsApp', {}).get('version', '?')} build {prov.get('shortcutsApp', {}).get('build', '?')}, extracted {prov.get('extractedAt', '?')}"
    if changelog:
        print(f"### Data: {src}\n")
        print(f"Recommended bump: **{d['bump']}**\n")
        for label, items in (("Added actions", d["added"]), ("Removed actions", d["removed"]), ("Added parameters", d["key_added"]), ("Removed parameters", d["key_removed"]), ("Changed parameter classes", d["kind_changed"]), ("Renamed", d["renamed"])):
            if items:
                print(f"- {label} ({len(items)}):")
                for i in items[:60]:
                    print(f"  - `{i}`")
                if len(items) > 60:
                    print(f"  - … {len(items) - 60} more")
        if not any(d[k] for k in ("added", "removed", "key_added", "key_removed", "kind_changed", "renamed")):
            print("- No changes to actions or parameters.")
        return
    print(f"source: {src}")
    print(f"actions: {len(old)} -> {len(new)} | +{len(d['added'])} -{len(d['removed'])} | params +{len(d['key_added'])} -{len(d['key_removed'])} | class changes {len(d['kind_changed'])} | renamed {len(d['renamed'])}")
    print(f"recommended bump: {d['bump']}")
    for label, items in (("removed", d["removed"]), ("removed params", d["key_removed"]), ("class changes", d["kind_changed"])):
        for i in items[:10]:
            print(f"  BREAKING {label}: {i}")


if __name__ == "__main__":
    main(sys.argv[1:])
