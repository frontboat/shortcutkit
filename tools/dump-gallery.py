#!/usr/bin/env python3
"""Dump Apple's bundled gallery shortcuts (WorkflowKit's Gallery.bundle) as JSON.

These are complete, unsigned .wflow plists written by Apple: the best reference for the
file envelope and for how App Intents actions and modern filter/condition templates are
encoded.

usage: dump-gallery.py [OUT.json]      # prints a summary; writes all workflows if OUT given
"""
import collections
import glob
import json
import plistlib
import sys

GALLERY = "/System/Library/PrivateFrameworks/WorkflowKit.framework/Versions/A/Resources/Gallery.bundle/Contents/Resources/*.wflow"


def main(argv):
    files = sorted(glob.glob(GALLERY))
    workflows = {}
    ids = collections.Counter()
    for f in files:
        w = plistlib.load(open(f, "rb"))
        workflows[f.split("/")[-1]] = json.loads(json.dumps(w, default=lambda o: f"<{type(o).__name__}>"))
        for a in w.get("WFWorkflowActions", []):
            ids[a.get("WFWorkflowActionIdentifier", "?")] += 1
    print(f"{len(files)} gallery workflows, {sum(ids.values())} actions, {len(ids)} distinct identifiers")
    first = next(iter(workflows.values()))
    print("envelope keys:", sorted(k for k in first if k != "WFWorkflowActions"))
    print("app-provided actions:", [i for i in ids if not i.startswith("is.workflow")])
    if len(argv) > 1:
        json.dump(workflows, open(argv[1], "w"), indent=1, sort_keys=True)
        print("wrote", argv[1])


if __name__ == "__main__":
    main(sys.argv)
