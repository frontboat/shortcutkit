#!/usr/bin/env python3
"""Tabulate the parameter value shapes used by the shortcuts in this Mac's library.

Shortcuts.app keeps each shortcut's action list as a binary plist in
~/Library/Shortcuts/Shortcuts.sqlite (table ZSHORTCUTACTIONS, column ZDATA). This
reads every one and reports, per encoding shape, how often it appears and one example.
Read-only. Useful as ground truth for what a generator must emit.

usage: dump-library-encodings.py [--json OUT.json] [--shortcut NAME]
"""
import collections
import json
import os
import plistlib
import sqlite3
import sys

DB = os.path.expanduser("~/Library/Shortcuts/Shortcuts.sqlite")


def shape(value):
    if isinstance(value, dict):
        kind = value.get("WFSerializationType")
        if kind:
            inner = value.get("Value")
            sub = inner.get("Type") if isinstance(inner, dict) else None
            return kind + (f"[{sub}]" if sub else "")
        return "dict{" + ",".join(sorted(value))[:60] + "}"
    if isinstance(value, list):
        return "list<" + (shape(value[0]) if value else "") + ">"
    return type(value).__name__


def main(argv):
    out_json = None
    only = None
    if "--json" in argv:
        out_json = argv[argv.index("--json") + 1]
    if "--shortcut" in argv:
        only = argv[argv.index("--shortcut") + 1]
    con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
    rows = con.execute("SELECT s.ZNAME, a.ZDATA FROM ZSHORTCUT s JOIN ZSHORTCUTACTIONS a ON s.ZACTIONS = a.Z_PK").fetchall()
    shapes = collections.defaultdict(collections.Counter)
    examples = {}
    n_actions = 0
    for name, blob in rows:
        if only and name != only:
            continue
        try:
            actions = plistlib.loads(blob)
        except Exception:
            continue
        if only:
            print(json.dumps(actions, default=lambda o: f"<{type(o).__name__}>", indent=1))
            return
        for action in actions if isinstance(actions, list) else []:
            n_actions += 1
            ident = action.get("WFWorkflowActionIdentifier", "?").split(".")[-1]
            for key, value in (action.get("WFWorkflowActionParameters") or {}).items():
                s = shape(value)
                shapes[s][f"{ident}.{key}"] += 1
                examples.setdefault(s, json.loads(json.dumps(value, default=lambda o: f"<{type(o).__name__}>")))
    print(f"{len(rows)} shortcuts, {n_actions} actions")
    for s, counter in sorted(shapes.items(), key=lambda kv: -sum(kv[1].values())):
        print(f"  {sum(counter.values()):4}  {s:48} e.g. {json.dumps(examples[s])[:110]}")
    if out_json:
        json.dump({s: {"uses": sum(c.values()), "where": dict(c.most_common(8)), "example": examples[s]} for s, c in shapes.items()}, open(out_json, "w"), indent=1)


if __name__ == "__main__":
    main(sys.argv[1:])
