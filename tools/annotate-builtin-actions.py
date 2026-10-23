#!/usr/bin/env python3
"""Fill what the engine's definitions leave out from the Shortcuts app's own registry
(data/toolkit-names.json, written by dump-toolkit-registry.py).

ActionKit's App-Intent-backed built-ins (Ask for Input, Combine Text, ...) declare their
parameters in code: the definition has no Name, no OutputName and no Parameters list, so the
catalogue would show the identifier, label references "Output", type enumerations as any
string, and give no parameter a label. The registry has the English name, the output name,
each enumeration's cases, and each parameter's name and description. Everything added is
marked with a *Source: "ToolKit" key so the origin stays visible. Parameter entries are added
only for keys the engine reports at run time (data/parameter-encodings.json), never invented.

usage: annotate-builtin-actions.py data/builtin-actions.json data/toolkit-names.json [data/parameter-encodings.json]
"""
import json
import sys


def main(argv):
    defs_path, names_path = argv[1], argv[2]
    defs = json.load(open(defs_path))
    names = json.load(open(names_path))
    encodings = json.load(open(argv[3])) if len(argv) > 3 else {}
    runtime = encodings.get("actionParameters", {})
    engine_outputs = encodings.get("actionOutputNames", {})  # from the action objects themselves
    unavailable = 0
    for ident in encodings.get("unavailableActions", []):
        if ident in defs:
            defs[ident]["Unavailable"] = True; unavailable += 1
    defaults = encodings.get("actionDefaults", {})  # engine defaults, to check registry case lists against
    filled = outputs = enums = disagree = labels = descs = params_added = 0
    checked = mismatched = 0
    for ident, d in defs.items():
        reg = names.get(ident)
        if not reg:
            continue
        if not d.get("Name") and reg.get("name"):
            d["Name"] = reg["name"]; d["NameSource"] = "ToolKit"; filled += 1
            desc = d.get("Description")
            if reg.get("description") and (not isinstance(desc, dict) or not desc.get("DescriptionSummary")):
                d["Description"] = dict(desc or {}, DescriptionSummary=reg["description"])
        out = d.get("Output")
        if isinstance(out, dict) and not out.get("OutputName"):
            # Prefer the engine's own answer; the registry's result label can be the action name.
            if engine_outputs.get(ident):
                out["OutputName"] = engine_outputs[ident]; out["OutputNameSource"] = "WFAction"; outputs += 1
            elif reg.get("outputName"):
                out["OutputName"] = reg["outputName"]; out["OutputNameSource"] = "ToolKit"; outputs += 1
        elif isinstance(out, dict) and engine_outputs.get(ident) and engine_outputs[ident] != out.get("OutputName"):
            disagree += 1
        known_keys = {p["key"] for p in runtime.get(ident, []) if p.get("key")}
        listed = {p.get("Key") for p in d.get("Parameters", []) if isinstance(p, dict)}
        for key, cases in (reg.get("enumCases") or {}).items():
            if key in listed or (runtime and key not in known_keys) or not cases:
                continue
            dv = defaults.get(ident, {}).get(key)
            if isinstance(dv, str):
                checked += 1
                if dv not in cases:
                    mismatched += 1
                    print(f"  warning: {ident}.{key}: engine default {dv!r} is not among the registry's cases {cases[:6]}; skipped", file=sys.stderr)
                    continue
            d.setdefault("Parameters", []).append({"Key": key, "Items": cases, "Label": (reg.get("labels") or {}).get(key), "Source": "ToolKit"})
            enums += 1
        # Labels and descriptions for the editor, so each key's hover text says what it is.
        reg_labels, reg_descs = reg.get("labels") or {}, reg.get("descriptions") or {}
        entries = {p.get("Key"): p for p in d.get("Parameters", []) if isinstance(p, dict) and p.get("Key")}
        for key in sorted(set(reg_labels) | set(reg_descs)):
            p = entries.get(key)
            if p is None:
                if key not in known_keys:
                    continue
                p = {"Key": key, "Source": "ToolKit"}
                d.setdefault("Parameters", []).append(p); entries[key] = p; params_added += 1
            if not p.get("Label") and reg_labels.get(key):
                p["Label"] = reg_labels[key]; p.setdefault("LabelSource", "ToolKit"); labels += 1
            if not p.get("Description") and reg_descs.get(key):
                p["Description"] = reg_descs[key]; p.setdefault("DescriptionSource", "ToolKit"); descs += 1
    json.dump(defs, open(defs_path, "w"), indent=2, ensure_ascii=False, sort_keys=True)
    print(f"filled: {filled} names, {outputs} output names, {enums} enumeration case lists; "
          f"{sum(1 for d in defs.values() if not d.get('Name'))} still unnamed; "
          f"{unavailable} definitions the engine loads as missing actions (Unavailable); "
          f"{disagree} definitions whose OutputName differs from the action object's (definition kept); "
          f"enumeration lists checked against engine defaults: {checked}, mismatched: {mismatched}; "
          f"parameter labels: {labels}, descriptions: {descs}, new parameter entries: {params_added}")


if __name__ == "__main__":
    main(sys.argv)
