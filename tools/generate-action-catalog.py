#!/usr/bin/env python3
"""Generate typed action catalogues for both packages from data/builtin-actions.json and
data/apple-app-intents.json.

TypeScript: src/generated/actions.ts
  export const actions = { setstoredcontent: "is.workflow.actions.setstoredcontent", ... } as const
  export const ACTIONS = { "is.workflow.actions.setstoredcontent": { name, params, output }, ... } as const
  Each entry carries a JSDoc comment with the action's name and description, so editors show it.
Python: python/src/shortcutkit/actions.py
  SETSTOREDCONTENT = "is.workflow.actions.setstoredcontent"; ACTIONS = {identifier: {...}}

Keys are the identifier's tail after "is.workflow.actions." with dots turned into underscores;
non-standard identifiers keep their full form sanitized. App Intents use the snake_case key the
Shortcuts app assigns them (e.g. reminders_create_reminder), falling back to the sanitized
identifier when it is missing or shared. Run by extract-builtin-actions.sh.

usage: generate-action-catalog.py [data/builtin-actions.json] [data/apple-app-intents.json]
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
    # App Intents (LinkMetadata) value types: enumeration cases are stored as their case id string;
    # entities are dictionaries the app defines.
    "WFLinkEnumerationSubstitutableState": "string", "WFLinkDynamicOptionSubstitutableState": "any",
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
    state_map = {pc: str(e.get("stateClass")) for pc, e in enc["parameterClasses"].items()}
    # Parameter classes the engine uses for App Intents value types, from the encoding table.
    table = ROOT / "data" / "encoding-table.json"
    if table.exists():
        for e in json.load(open(table)).get("appIntentValueTypes", {}).values():
            if isinstance(e, dict) and e.get("parameterClass") and e.get("stateClass"):
                state_map.setdefault(e["parameterClass"], e["stateClass"])
    return state_map, enc.get("actionParameters", {})


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
            "output": text(outp.get("OutputName")), "outputTypes": [t for t in (outp.get("Types") or []) if isinstance(t, str)],
            "summary": text(a.get("ParameterSummary")), "kinds": kinds,
        })
    seen = {}
    for e in out:  # keys are unique by construction; guard anyway
        if e["key"] in seen:
            e["key"] += "_" + re.sub(r"[^A-Za-z0-9]", "", e["identifier"])[-6:]
        seen[e["key"]] = e
    return out


APP_INTENT_KIND_TS = {"text": "TextValue", "bool": "BoolValue", "number": "NumberValue", "string": "StringValue", "any": "AnyValue"}
APPLE_TEAM = "0000000000"  # what Apple's own gallery shortcuts write for system apps


def app_intent_entries(catalog):
    """Entries for Apple's App Intents, from the Shortcuts app's registry (dump-toolkit-registry.py)."""
    state_map, _ = load_state_map()
    out = []
    for ident in sorted(catalog):
        t = catalog[ident]
        params, kinds = [], {}
        for p in t.get("parameters", []):
            k = p["key"]
            # The engine's parameter class for the value type (extract-encoding-table.js) decides the
            # kind, exactly as for built-ins; the registry's own guess is the fallback.
            kind = kind_for(p["parameterClass"], state_map) if p.get("parameterClass") else p.get("kind", "any")
            cases = [c["id"] for c in p.get("type", {}).get("cases", [])]
            if cases and kind in ("string", "any", "text"):
                kind = "string"
            choices = cases if kind == "string" else []
            params.append(k); kinds[k] = {"kind": kind, "choices": choices, "class": p.get("parameterClass") or p.get("type", {}).get("kind")}
        app = t.get("app") or {}
        summary = ", ".join(f"{p.get('name') or p['key']}" for p in t.get("parameters", [])[:6])
        out.append({
            "key": t.get("key") or key_for(ident), "identifier": ident, "name": t.get("name") or ident,
            "description": (t.get("description") or "") + (f" ({app.get('name')})" if app.get("name") else ""),
            "params": params, "output": t.get("outputName"), "outputTypes": [x for x in (t.get("outputTypes") or []) if isinstance(x, str)], "summary": None, "kinds": kinds,
            "descriptor": {"BundleIdentifier": app.get("bundleIdentifier"), "Name": app.get("name"), "TeamIdentifier": app.get("teamId") or APPLE_TEAM,
                           "AppIntentIdentifier": t.get("appIntentIdentifier") or ident.rsplit(".", 1)[-1]},
        })
    return out


VARIANT = ("AssistantIntent", "WidgetConfiguration", "SharingExtension", "ConfigurationIntent")


def dedupe_keys(es):
    """Keys must be unique across both catalogues. The Shortcuts app gives an intent and its
    variants (assistant-only twin, widget configuration, sharing extension, migrated legacy
    identifier) the same snake_case key; the plain intent keeps it and the variants fall back
    to their sanitized identifier."""
    groups = {}
    for e in es:
        groups.setdefault(e["key"], []).append(e)
    for key, group in groups.items():
        if len(group) < 2:
            continue
        def rank(e):
            i = e["identifier"]
            return (i.startswith("is.workflow.") or any(v in i for v in VARIANT), i)
        winner = min(group, key=rank)
        for e in group:
            if e is not winner:
                e["key"] = key_for(e["identifier"])
    seen = set()
    for e in es:  # guard against a sanitized identifier colliding with an existing key
        if e["key"] in seen:
            e["key"] += "_" + re.sub(r"[^A-Za-z0-9]", "", e["identifier"])[-6:]
        seen.add(e["key"])
    return es


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
        if e.get("descriptor"):
            used.add("DictionaryValue")
        for k in e["params"]:
            info = e["kinds"].get(k, {"kind": "any", "choices": []})
            used.add("EnumValue" if info["kind"] == "string" and info["choices"] else KIND_TS[info["kind"]])
    lines = ["// Generated by tools/generate-action-catalog.py from data/builtin-actions.json. Do not edit.",
             "import type { " + ", ".join(sorted(used)) + " } from \"../values.js\";", "",
             "/** Action identifiers by short key. Use with Shortcut.action() for typed parameter keys. */",
             "export const actions = {"]
    for e in es:
        lines.append(jsdoc(e) + f"  {e['key']}: {js_str(e['identifier'])},")
    lines += ["} as const;", "", "/** Per-identifier metadata: display name, parameter keys, output name, and for App Intents the descriptor the file needs. */", "export const ACTIONS = {"]
    for e in es:
        params = "[" + ", ".join(js_str(p) for p in e["params"]) + "]"
        desc = e.get("descriptor")
        extra = f", descriptor: {{ {', '.join(f'{k}: {js_str(v)}' for k, v in desc.items())} }}" if desc else ""
        outs = "[" + ", ".join(js_str(x) for x in e.get("outputTypes", [])) + "]"
        lines.append(f"  {js_str(e['identifier'])}: {{ name: {js_str(e['name'])}, params: {params}, output: {js_str(e['output']) if e['output'] else 'null'}, outputTypes: {outs}{extra} }},")
    lines += ["} as const;", "", "/** Value kind per parameter key, as the engine's state class implies. `text` parameters take a plain string or a",
              " *  WFTextTokenString; Shortcut.action() wraps a bare attachment given for one into a token string, which is what the engine writes. */",
              "export const PARAM_KINDS = {"]
    for e in es:
        if e["kinds"]:
            lines.append(f"  {js_str(e['identifier'])}: {{ {', '.join(f'{js_str(k)}: {js_str(v['kind'])}' for k, v in e['kinds'].items())} }},")
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
        if e.get("descriptor"):
            fields.append('"AppIntentDescriptor"?: DictionaryValue')
        lines.append(f"  {js_str(e['identifier'])}: {{ {'; '.join(fields)} }};")
    lines += ["};", "", "export type MetaParams = { " + "; ".join(f"{k}: {v}" for k, v in META_TYPES.items()) + " };", "",
              "export type ActionId = keyof typeof ACTIONS;",
              "export type ActionKey = keyof typeof actions;",
              "/** Parameter keys declared for an action, plus the keys every action accepts. */",
              "export type ParamKey<I extends string> = I extends ActionId ? (typeof ACTIONS)[I][\"params\"][number] | " + " | ".join(js_str(m) for m in META) + " : string;", ""]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines))


def type_name(key):
    """showresult -> ShowresultParams, reminders_create_reminder -> RemindersCreateReminderParams."""
    return "".join(part[:1].upper() + part[1:] for part in key.split("_") if part) + "Params"


def write_params_ts(es, path):
    lines = ["// Generated by tools/generate-action-catalog.py. Do not edit.",
             "// A named parameter type per action: the same shape as ParamTypes[identifier], easier to read in",
             "// hover text and error messages. Output content types are ACTIONS[identifier].outputTypes.",
             'import type { ParamTypes } from "./actions.js";', ""]
    seen = {}
    for e in es:
        name = type_name(e["key"])
        if name in seen:
            name += "_" + re.sub(r"[^A-Za-z0-9]", "", e["identifier"])[-6:]
        seen[name] = True
        lines.append(f"/** Parameters of {e['name']} (`{e['identifier']}`). */")
        lines.append(f"export type {name} = ParamTypes[{js_str(e['identifier'])}];")
    path.write_text("\n".join(lines) + "\n")


def write_py(es, path):
    lines = ['"""Generated by tools/generate-action-catalog.py from data/builtin-actions.json. Do not edit."""', "",
             "# Identifier constants. Each entry's docstring-style comment gives the display name.", ""]
    for e in es:
        lines.append(f"{e['key'].upper()} = {json.dumps(e['identifier'])}  # {e['name']}")
    lines += ["", "# Per-identifier metadata: display name, parameter keys, output name, and for App Intents the descriptor the file needs.", "ACTIONS = {"]
    for e in es:
        desc = f", \"descriptor\": {json.dumps(e['descriptor'], ensure_ascii=False)}" if e.get("descriptor") else ""
        lines.append(f"    {json.dumps(e['identifier'])}: {{\"name\": {json.dumps(e['name'], ensure_ascii=False)}, \"params\": {json.dumps(e['params'])}, \"output\": {json.dumps(e['output']) if e['output'] else 'None'}, \"outputTypes\": {json.dumps(e.get('outputTypes', []))}{desc}}},")
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
    apps = pathlib.Path(argv[2]) if len(argv) > 2 else ROOT / "data" / "apple-app-intents.json"
    es = entries(json.load(open(src)))
    n_builtin = len(es)
    if apps.exists():
        es += app_intent_entries(json.load(open(apps)).get("actions", {}))
    es = dedupe_keys(es)
    write_ts(es, ROOT / "src/generated/actions.ts")
    write_params_ts(es, ROOT / "src/generated/params.ts")
    write_py(es, ROOT / "python/src/shortcutkit/actions.py")
    print(f"{n_builtin} built-in + {len(es) - n_builtin} App Intents actions -> src/generated/actions.ts, python/src/shortcutkit/actions.py")


if __name__ == "__main__":
    main(sys.argv)
