#!/usr/bin/env python3
"""Fill display names Apple left out of the engine's definitions from the Shortcuts app's
own registry (data/toolkit-names.json, written by dump-toolkit-registry.py).

A definition's Name is what the engine reports; ActionKit's App-Intent-backed actions such
as Ask for Input carry none and show their identifier instead. The registry has the English
name the app shows. Filled entries are marked NameSource: "ToolKit" so the origin stays visible.

usage: annotate-builtin-actions.py data/builtin-actions.json data/toolkit-names.json
"""
import json
import sys


def main(argv):
    defs_path, names_path = argv[1], argv[2]
    defs = json.load(open(defs_path))
    names = json.load(open(names_path))
    filled = 0
    for ident, d in defs.items():
        if not d.get("Name") and ident in names and names[ident].get("name"):
            d["Name"] = names[ident]["name"]
            d["NameSource"] = "ToolKit"
            filled += 1
            desc = d.get("Description")
            if names[ident].get("description") and (not isinstance(desc, dict) or not desc.get("DescriptionSummary")):
                d["Description"] = dict(desc or {}, DescriptionSummary=names[ident]["description"])
    json.dump(defs, open(defs_path, "w"), indent=2, ensure_ascii=False, sort_keys=True)
    print(f"{filled} names filled from the ToolKit registry; {sum(1 for d in defs.values() if not d.get('Name'))} still unnamed")


if __name__ == "__main__":
    main(sys.argv)
