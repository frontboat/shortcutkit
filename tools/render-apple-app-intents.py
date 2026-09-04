#!/usr/bin/env python3
"""Render data/apple-app-intents.json (from dump-toolkit-registry.py) into a markdown reference.

usage: render-apple-app-intents.py IN.json OUT.md
"""
import json
import sys
from collections import defaultdict


def main(argv):
    doc = json.load(open(argv[1]))
    actions = doc["actions"]
    by_app = defaultdict(list)
    for ident, t in sorted(actions.items()):
        by_app[(t.get("app") or {}).get("name") or "?"].append(t)
    lines = ["# Apple App Intents actions", "",
             "Actions Apple's own apps and system components expose to Shortcuts through App Intents, as the",
             "Shortcuts app indexes them (`tools/dump-toolkit-registry.py`). Identifier, parameter keys, value",
             "kinds and enumeration cases are what a `.shortcut` file needs; `Shortcut.action()` adds the",
             "`AppIntentDescriptor` automatically. Generated; do not edit.", "",
             f"{len(actions)} actions from {len(by_app)} apps. Source: {doc.get('provenance', {})}", ""]
    for app in sorted(by_app):
        ts = by_app[app]
        bundle = (ts[0].get("app") or {}).get("bundleIdentifier")
        lines += [f"## {app} (`{bundle}`)", ""]
        for t in ts:
            lines += [f"### {t.get('name') or t['identifier']}", "", f"`{t['identifier']}` · key `{t.get('key') or '-'}`"]
            if t.get("description"):
                lines.append(f"  \n{t['description']}")
            if t.get("outputTypes"):
                lines.append(f"  \nOutput: {t.get('outputName') or ''} `{', '.join(t['outputTypes'])}`")
            lines.append("")
            if t.get("parameters"):
                lines += ["| Key | Name | Kind | Type |", "|---|---|---|---|"]
                for p in t["parameters"]:
                    ty = p.get("type") or {}
                    if ty.get("kind") == "primitive":
                        tdesc = ty.get("primitive")
                    elif ty.get("kind") == "enum":
                        tdesc = "enum: " + ", ".join(f"`{c['id']}`" for c in ty.get("cases", [])[:12]) + (" …" if len(ty.get("cases", [])) > 12 else "")
                    else:
                        tdesc = f"{ty.get('kind')} {ty.get('name') or ''}".strip()
                    lines.append(f"| `{p['key']}` | {p.get('name') or ''} | {p.get('kind')} | {tdesc} |")
                lines.append("")
    open(argv[2], "w").write("\n".join(lines))
    print(f"{len(actions)} actions from {len(by_app)} apps -> {argv[2]}")


if __name__ == "__main__":
    main(sys.argv)
