#!/usr/bin/env python3
"""Render data/parameter-encodings.json (from extract-parameter-encodings.js) as markdown.

usage: render-parameter-encodings.py IN.json OUT.md
"""
import collections
import json
import sys


def short(name):
    if name is None or name == "None":
        return "(container, no value state)"
    if name.startswith("_TtGC11WorkflowKit"):
        return "Swift generic table-template state"
    return name


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    data = json.load(open(sys.argv[1]))
    classes = data["parameterClasses"]
    by_state = collections.defaultdict(list)
    for pc, entry in classes.items():
        by_state[short(entry.get("stateClass"))].append((pc, entry))
    lines = [
        "# Shortcuts parameter value encodings",
        "",
        "How each built-in action parameter is serialized inside a `.shortcut` file. Every `WFParameter` subclass "
        "names a state class; that class's `serializedRepresentation` is the on-disk form. Defaults below are the "
        f"parameter's own `defaultSerializedRepresentation`. {len(classes)} parameter classes, {len(by_state)} state classes. "
        "See docs/shortcut-file-format.md for the general shapes and docs/extraction.md for how this was produced.",
        "",
        "## State classes",
        "",
    ]
    for state, members in sorted(by_state.items(), key=lambda kv: -sum(e["count"] for _, e in kv[1])):
        uses = sum(e["count"] for _, e in members)
        lines += [f"### {state}", "", f"- parameter uses: {uses}"]
        sels = data["stateClassSelectors"].get(state) if state in data["stateClassSelectors"] else None
        if sels:
            lines.append(f"- selectors: {', '.join(f'`{s}`' for s in sorted(set(sels)))}")
        lines.append("- parameter classes:")
        for pc, entry in sorted(members, key=lambda m: -m[1]["count"]):
            ex = json.dumps(entry["defaultExamples"][0]) if entry.get("defaultExamples") else "none"
            lines.append(f"  - `{pc}` ({entry['count']} uses) default e.g. `{ex[:100]}`; used by {', '.join('`' + u.split('.')[-1] + '`' for u in entry.get('usedBy', [])[:3])}")
        lines.append("")
    open(sys.argv[2], "w").write("\n".join(lines))
    print(f"{len(classes)} parameter classes, {len(by_state)} state classes -> {sys.argv[2]}")


if __name__ == "__main__":
    main()
