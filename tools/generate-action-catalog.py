#!/usr/bin/env python3
"""Generate typed action catalogues for both packages from data/builtin-actions.json.

TypeScript: src/generated/actions.ts
  export const actions = { setstoredcontent: "is.workflow.actions.setstoredcontent", ... } as const
  export const ACTIONS = { "is.workflow.actions.setstoredcontent": { name, params, output }, ... } as const
  Each entry carries a JSDoc comment with the action's name and description, so editors show it.
Python: python/src/shortcutkit/actions.py
  SETSTOREDCONTENT = "is.workflow.actions.setstoredcontent"; ACTIONS = {identifier: {...}}

Keys are the identifier's tail after "is.workflow.actions." with dots turned into underscores;
non-standard identifiers keep their full form sanitized. Run by extract-builtin-actions.sh.

usage: generate-action-catalog.py [data/builtin-actions.json]
"""
import json
import pathlib
import re
import sys

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
META = ["UUID", "GroupingIdentifier", "WFControlFlowMode", "CustomOutputName"]
# Keys Shortcuts accepts that the current definitions do not list, with their value kinds.
LEGACY = {
    "is.workflow.actions.conditional": {"WFConditions": "filter", "WFInput": "picker", "WFCondition": "plainNumber", "WFConditionalActionString": "text",
                                        "WFNumberValue": "number", "WFConditionalLegacyComparisonBehavior": "bool", "WFEnumerationValue": "text",
                                        "WFBooleanValue": "bool", "WFDate": "text", "WFAnotherDate": "text", "WFDuration": "any"},
    "is.workflow.actions.choosefrommenu": {"WFMenuPrompt": "text", "WFMenuItems": "any", "WFMenuItemTitle": "plainString", "WFMenuItemAttributedTitle": "any"},
}


STATE_KIND = {
    "WFBooleanSubstitutableState": "bool", "WFNumberSubstitutableState": "number", "WFNumberStringSubstitutableState": "number",
    "WFStringSubstitutableState": "string", "WFVariableStringParameterState": "text", "WFURLStringParameterState": "text",
    "WFDateFieldParameterState": "text", "WFVariableParameterState": "picker", "WFStringParameterState": "plainString",
    "WFNumberParameterState": "plainNumber", "WFDictionaryParameterState": "dictionary", "WFQuantityParameterState": "quantity",
}
KIND_TS = {"bool": "BoolValue", "number": "NumberValue", "string": "StringValue", "text": "TextValue", "picker": "PickerValue",
           "plainString": "PlainString", "plainNumber": "PlainNumber", "dictionary": "DictionaryValue", "quantity": "QuantityValue",
           "filter": "FilterTemplateValue", "any": "AnyValue"}
META_TYPES = {"UUID": "string", "GroupingIdentifier": "string", "WFControlFlowMode": "0 | 1 | 2", "CustomOutputName": "string"}


def load_state_map():
    """Parameter class -> state class, and per-action run-time parameter lists, from the encoding probe."""
    path = ROOT / "data" / "parameter-encodings.json"
    if not path.exists():
        return {}, {}
    enc = json.load(open(path))
    return {pc: str(e.get("stateClass")) for pc, e in enc["parameterClasses"].items()}, enc.get("actionParameters", {})


def kind_for(param_class, state_map):
    state = state_map.get(param_class, "")
    if state.startswith("_TtGC"):
        return "filter"
    return STATE_KIND.get(state, "any")


def text(v):
    return v if isinstance(v, str) else (v.get("format") if isinstance(v, dict) else None)


def key_for(identifier):
    tail = identifier[len("is.workflow.actions."):] if identifier.startswith("is.workflow.actions.") else identifier
    key = re.sub(r"[^A-Za-z0-9]+", "_", tail).strip("_")
    if key[0].isdigit():
        key = "_" + key
    return key


def entries(defs):
    state_map, runtime_params = load_state_map()
    out = []
    for ident in sorted(defs):
        a = defs[ident]
        pdefs = [p for p in a.get("Parameters", []) if isinstance(p, dict) and p.get("Key")]
        choices = {p["Key"]: [i for i in (p.get("Items") or []) if isinstance(i, str)] for p in pdefs}
        params, kinds = [], {}
        # 1. the parameters the action actually creates at run time (authoritative, covers actions whose definitions list none)
        for rp in runtime_params.get(ident, []):
            k = rp.get("key")
            if k and k not in kinds:
                params.append(k); kinds[k] = {"kind": kind_for(rp.get("class"), state_map), "choices": choices.get(k, []), "class": rp.get("class")}
        # 2. anything the definition lists that the run-time walk did not
        for p in pdefs:
            if p["Key"] not in kinds:
                params.append(p["Key"]); kinds[p["Key"]] = {"kind": kind_for(p.get("Class"), state_map), "choices": choices.get(p["Key"], []), "class": p.get("Class")}
        # 3. legacy keys Shortcuts still reads
        for k, kind in LEGACY.get(ident, {}).items():
            if k not in kinds:
                params.append(k); kinds[k] = {"kind": kind, "choices": [], "class": "Legacy"}
        # 4. the implicit input key, if it is not an explicit parameter
        inp = a.get("Input")
        if isinstance(inp, dict) and inp.get("ParameterKey") and inp["ParameterKey"] not in kinds:
            params.insert(0, inp["ParameterKey"]); kinds[inp["ParameterKey"]] = {"kind": "any", "choices": [], "class": "Input"}
        desc = a.get("Description") if isinstance(a.get("Description"), dict) else {}
        outp = a.get("Output") if isinstance(a.get("Output"), dict) else {}
        out.append({
            "key": key_for(ident), "identifier": ident, "name": text(a.get("Name")) or ident,
            "description": text(desc.get("DescriptionSummary")) or "", "params": params,
            "output": text(outp.get("OutputName")), "summary": text(a.get("ParameterSummary")), "kinds": kinds,
        })
    seen = {}
    for e in out:  # keys are unique by construction; guard anyway
        if e["key"] in seen:
            e["key"] += "_" + re.sub(r"[^A-Za-z0-9]", "", e["identifier"])[-6:]
        seen[e["key"]] = e
    return out


def js_str(s):
    return json.dumps(s, ensure_ascii=False)


def jsdoc(e):
    lines = [f"**{e['name']}**"]
    if e["description"]:
        lines.append(e["description"].replace("*/", "* /"))
    if e["summary"]:
        lines.append(f"Summary: `{e['summary']}`")
    if e["output"]:
        lines.append(f"Output: {e['output']}")
    if e["params"]:
        lines.append("Parameters: " + ", ".join(f"`{p}`" for p in e["params"]))
    body = "\n".join(f"   * {l}" for l in lines)
    return f"  /**\n{body}\n   */\n"


def write_ts(es, path):
    used = set()
    for e in es:
        for k in e["params"]:
            info = e["kinds"].get(k, {"kind": "any", "choices": []})
            used.add("EnumValue" if info["kind"] == "string" and info["choices"] else KIND_TS[info["kind"]])
    lines = ["// Generated by tools/generate-action-catalog.py from data/builtin-actions.json. Do not edit.",
             "import type { " + ", ".join(sorted(used)) + " } from \"../values.js\";", "",
             "/** Action identifiers by short key. Use with Shortcut.action() for typed parameter keys. */",
             "export const actions = {"]
    for e in es:
        lines.append(jsdoc(e) + f"  {e['key']}: {js_str(e['identifier'])},")
    lines += ["} as const;", "", "/** Per-identifier metadata: display name, parameter keys, output name. */", "export const ACTIONS = {"]
    for e in es:
        params = "[" + ", ".join(js_str(p) for p in e["params"]) + "]"
        lines.append(f"  {js_str(e['identifier'])}: {{ name: {js_str(e['name'])}, params: {params}, output: {js_str(e['output']) if e['output'] else 'null'} }},")
    lines += ["} as const;", "", "/** Accepted value type for every parameter key of every action (see values.ts). */", "export type ParamTypes = {"]
    for e in es:
        fields = []
        for k in e["params"]:
            info = e["kinds"].get(k, {"kind": "any", "choices": []})
            if info["kind"] == "string" and info["choices"]:
                t = "EnumValue<" + " | ".join(js_str(c) for c in info["choices"]) + ">"
            else:
                t = KIND_TS[info["kind"]]
            fields.append(f"{js_str(k)}: {t}")
        lines.append(f"  {js_str(e['identifier'])}: {{ {'; '.join(fields)} }};")
    lines += ["};", "", "export type MetaParams = { " + "; ".join(f"{k}: {v}" for k, v in META_TYPES.items()) + " };", "",
              "export type ActionId = keyof typeof ACTIONS;",
              "export type ActionKey = keyof typeof actions;",
              "/** Parameter keys declared for an action, plus the keys every action accepts. */",
              "export type ParamKey<I extends string> = I extends ActionId ? (typeof ACTIONS)[I][\"params\"][number] | " + " | ".join(js_str(m) for m in META) + " : string;", ""]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines))


def write_py(es, path):
    lines = ['"""Generated by tools/generate-action-catalog.py from data/builtin-actions.json. Do not edit."""', "",
             "# Identifier constants. Each entry's docstring-style comment gives the display name.", ""]
    for e in es:
        lines.append(f"{e['key'].upper()} = {json.dumps(e['identifier'])}  # {e['name']}")
    lines += ["", "# Per-identifier metadata: display name, parameter keys, output name.", "ACTIONS = {"]
    for e in es:
        lines.append(f"    {json.dumps(e['identifier'])}: {{\"name\": {json.dumps(e['name'], ensure_ascii=False)}, \"params\": {json.dumps(e['params'])}, \"output\": {json.dumps(e['output']) if e['output'] else 'None'}}},")
    lines += ["}", "", "# Accepted value kind per parameter key: bool, number, string, text, picker, plainString, plainNumber, dictionary, quantity, filter, any.", "PARAM_KINDS = {"]
    for e in es:
        lines.append(f"    {json.dumps(e['identifier'])}: {json.dumps({k: v['kind'] for k, v in e['kinds'].items()})},")
    lines += ["}", "", "# Choice labels for enumeration parameters.", "PARAM_CHOICES = {"]
    for e in es:
        ch = {k: v["choices"] for k, v in e["kinds"].items() if v["choices"]}
        if ch:
            lines.append(f"    {json.dumps(e['identifier'])}: {json.dumps(ch, ensure_ascii=False)},")
    lines += ["}", ""]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines))


def main(argv):
    src = pathlib.Path(argv[1]) if len(argv) > 1 else ROOT / "data" / "builtin-actions.json"
    es = entries(json.load(open(src)))
    write_ts(es, ROOT / "src/generated/actions.ts")
    write_py(es, ROOT / "python/src/shortcutkit/actions.py")
    print(f"{len(es)} actions -> src/generated/actions.ts, python/src/shortcutkit/actions.py")


if __name__ == "__main__":
    main(sys.argv)
