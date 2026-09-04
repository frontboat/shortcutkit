#!/usr/bin/env python3
"""Render data/builtin-actions.json (from extract-builtin-actions.m) into a markdown reference.

Also normalises one wart the ObjC dumper cannot fix: enumeration parameter choice
lists (Parameters[].Items) arrive as Swift arrays boxed in __SwiftValue, which
only expose a description string. This script parses the English defaults out of
that string and rewrites the JSON field as a plain list of labels.

usage: render-builtin-actions.py IN.json OUT.md
"""
import json
import re
import sys

WRAPPER = "<_NSStringLocalizationResource"
DEFAULT_KEY = re.compile(
    r'defaultValue: \(extension in Foundation\):Swift\.String\.LocalizationValue'
    r'\(arguments: \[[^\]]*\], key: \\?"((?:[^"\\]|\\.)*?)\\?"\)'
)


def unbox_items(node):
    """Replace boxed Swift arrays of localized strings with lists of their English defaults."""
    if isinstance(node, dict):
        for key, value in list(node.items()):
            if isinstance(value, str) and WRAPPER in value:
                node[key] = [m.replace('\\"', '"') for m in DEFAULT_KEY.findall(value)]
            else:
                unbox_items(value)
    elif isinstance(node, list):
        for value in node:
            unbox_items(value)


def text(value):
    if isinstance(value, str):
        return value
    if isinstance(value, dict):
        return value.get("format")
    return None


def render(actions):
    lines = [
        "# Shortcuts built-in actions (from WorkflowKit's action registry)",
        "",
        f"Extracted by loading WorkflowKit and asking WFBundledActionProvider for every definition. "
        f"{len(actions)} actions. Field names are Apple's own (ActionClass, Parameters[].Class, etc.). "
        "Full structured data: data/builtin-actions.json. See docs/extraction.md for how this was produced.",
        "",
    ]
    for ident in sorted(actions, key=lambda k: (text(actions[k].get("Name")) or k).lower()):
        a = actions[ident]
        lines += [f"## {text(a.get('Name')) or ident}", "", f"- identifier: `{ident}`  ·  class `{a.get('ActionClass')}`"]
        desc = a.get("Description") if isinstance(a.get("Description"), dict) else {}
        for key, label in (("DescriptionSummary", None), ("DescriptionInput", "input"), ("DescriptionResult", "result"), ("DescriptionNote", "note")):
            if desc.get(key):
                lines.append(f"- {label + ': ' if label else ''}{text(desc[key])}")
        summary = a.get("ParameterSummary")
        if isinstance(summary, dict) and summary.get("possibleValues"):
            lines.append("- summary variants:")
            for variant in summary["possibleValues"]:
                required = variant.get("requiredValues") if isinstance(variant, dict) else None
                lines.append(f"  - `{text(variant)}`" + (f"  when {json.dumps(required)}" if required else ""))
        elif text(summary):
            lines.append(f"- summary: `{text(summary)}`")
        inp, outp = a.get("Input"), a.get("Output")
        if isinstance(inp, dict) and inp.get("Types"):
            lines.append(f"- input: {', '.join(inp['Types'])}{' (required)' if inp.get('Required') else ''}")
        if isinstance(outp, dict):
            lines.append(f"- output: {text(outp.get('OutputName')) or ''} {', '.join(outp.get('Types', []))}".rstrip())
        if a.get("ActionKeywords"):
            lines.append(f"- keywords: {', '.join(text(a['ActionKeywords']).split('|'))}")
        if a.get("IconSymbol"):
            lines.append(f"- icon: {a['IconSymbol']} ({a.get('IconColor', '')})")
        for flag in ("ResidentCompatible", "InputPassthrough", "RequiresUserInteraction", "Deprecated", "DisallowedOnWatch", "AppIdentifier"):
            if flag in a:
                lines.append(f"- {flag}: {a[flag]}")
        params = [p for p in (a.get("Parameters") or []) if isinstance(p, dict)]
        if params:
            lines.append("- parameters:")
            for p in params:
                bits = [f"`{p.get('Key')}`", f"({(p.get('Class') or '').replace('WF', '').replace('Parameter', '')})"]
                if text(p.get("Label")):
                    bits.append(text(p["Label"]))
                if "DefaultValue" in p:
                    bits.append(f"default={json.dumps(p['DefaultValue'])}")
                if p.get("Items"):
                    choices = [i if isinstance(i, str) else (text(i.get("Label")) or text(i.get("Value")) or i.get("Value")) for i in p["Items"]]
                    bits.append("choices=" + json.dumps(choices))
                line = "  - " + " ".join(bits)
                if text(p.get("Description")):
                    line += f" — {text(p['Description'])}"
                lines.append(line)
        lines.append("")
    return "\n".join(lines)


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, dst = sys.argv[1], sys.argv[2]
    actions = json.load(open(src))
    unbox_items(actions)
    json.dump(actions, open(src, "w"), indent=1, sort_keys=True)
    open(dst, "w").write(render(actions))
    named = sum(1 for a in actions.values() if text(a.get("Name")))
    with_params = sum(1 for a in actions.values() if a.get("Parameters"))
    print(f"{len(actions)} actions, {named} named, {with_params} with parameters -> {dst}")


if __name__ == "__main__":
    main()
