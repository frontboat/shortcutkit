#!/usr/bin/env python3
"""Generate typed action catalogues for both packages from data/builtin-actions.json,
data/apple-app-intents.json and data/apple-entities.json.

TypeScript: src/generated/actions.ts
  export const actions = { setstoredcontent: "is.workflow.actions.setstoredcontent", ... } as const
  export const ACTIONS = { "is.workflow.actions.setstoredcontent": { name, params, output }, ... } as const
  Each entry carries a JSDoc comment with the action's name and description, so editors show it.
Python: python/src/shortcutkit/actions.py
  SETSTOREDCONTENT = "is.workflow.actions.setstoredcontent"; ACTIONS = {identifier: {...}}
Both: src/generated/entities.ts and python/src/shortcutkit/entities.py, the Find filter rows and
  entity properties of Apple's App Intents (FILTERS, ENTITY_PROPERTIES), with the row types.

Keys are the identifier's tail after "is.workflow.actions." with dots turned into underscores;
non-standard identifiers keep their full form sanitized. App Intents use the snake_case key the
Shortcuts app assigns them (e.g. reminders_create_reminder), falling back to the sanitized
identifier when it is missing or shared. Run by extract-builtin-actions.sh.

usage: generate-action-catalog.py [data/builtin-actions.json] [data/apple-app-intents.json] [data/apple-entities.json]
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
    "is.workflow.actions.conditional": {"WFConditions": "filter", "WFInput": "subject", "WFCondition": "plainNumber", "WFConditionalActionString": "text",
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
KIND_TS = {"bool": "BoolValue", "number": "NumberValue", "string": "StringValue", "text": "TextValue", "picker": "PickerValue", "subject": "SubjectValue",
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


VARIABLE_TYPES = ["ActionOutput", "ExtensionInput", "Variable", "Clipboard", "CurrentDate", "Ask", "DeviceDetails", "CurrentApp"]


def references(info):
    """The variable types the engine reads for a key (the probe loaded each one through the action), or
    None when every one is read or there is no engine data (definition-only, legacy and App Intents keys)."""
    reads = info.get("reads")
    return None if reads is None or set(reads) >= set(VARIABLE_TYPES) else sorted(reads, key=VARIABLE_TYPES.index)


def ts_type(info):
    """TypeScript value type for a key: the state class's kind, narrowed to the references the engine reads."""
    if info.get("ts"):
        return info["ts"]
    kind, reads = info["kind"], references(info)
    if reads is None or kind not in ("bool", "number", "string", "text", "picker"):
        if kind == "string" and info["choices"]:
            return "EnumValue<" + " | ".join(js_str(c) for c in info["choices"]) + ">"
        return KIND_TS[kind]
    att = ("Attachment<" + " | ".join(js_str(t) for t in reads) + ">") if reads else None
    if kind == "picker":
        return att or "never"
    plain = {"bool": "boolean", "number": "number", "text": "string | TokenString",
             "string": ("Loose<" + " | ".join(js_str(c) for c in info["choices"]) + ">") if info["choices"] else "string"}[kind]
    return plain + (f" | {att}" if att else "")


def kind_for(param_class, state_map):
    state = state_map.get(param_class, "")
    if state.startswith("_TtGC"):
        return "filter"
    return STATE_KIND.get(state, "any")


def text(v):
    return v if isinstance(v, str) else (v.get("format") if isinstance(v, dict) else None)


def doc_text(label, description):
    """A parameter's hover text: the editor's label, then its description when there is one."""
    parts = [" ".join(x.split()) for x in (label, description) if x]
    return ": ".join(parts).replace("*/", "* /") if parts else None


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
        docs = {p["Key"]: (text(p.get("Label")), text(p.get("Description"))) for p in pdefs}
        params, kinds = [], {}
        # 1. the parameters the action actually creates at run time (authoritative, covers actions whose definitions list none)
        for rp in runtime_params.get(ident, []):
            k = rp.get("key")
            if k and k not in kinds:
                params.append(k); kinds[k] = {"kind": kind_for(rp.get("class"), state_map), "choices": choices.get(k, []), "class": rp.get("class"), "reads": rp.get("reads")}
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
        for k, (label, description) in docs.items():
            if k in kinds:
                kinds[k]["doc"] = doc_text(label, description)
        desc = a.get("Description") if isinstance(a.get("Description"), dict) else {}
        outp = a.get("Output") if isinstance(a.get("Output"), dict) else {}
        out.append({
            "key": key_for(ident), "identifier": ident, "name": text(a.get("Name")) or ident,
            "description": text(desc.get("DescriptionSummary")) or "", "params": params,
            "output": text(outp.get("OutputName")), "outputTypes": [t for t in (outp.get("Types") or []) if isinstance(t, str)],
            "summary": text(a.get("ParameterSummary")), "kinds": kinds, "unavailable": bool(a.get("Unavailable")),
        })
    seen = {}
    for e in out:  # keys are unique by construction; guard anyway
        if e["key"] in seen:
            e["key"] += "_" + re.sub(r"[^A-Za-z0-9]", "", e["identifier"])[-6:]
        seen[e["key"]] = e
    return out


APP_INTENT_KIND_TS = {"text": "TextValue", "bool": "BoolValue", "number": "NumberValue", "string": "StringValue", "any": "AnyValue"}
APPLE_TEAM = "0000000000"  # what Apple's own gallery shortcuts write for system apps


def app_intent_entries(catalog, filters):
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
            params.append(k); kinds[k] = {"kind": kind, "choices": choices, "class": p.get("parameterClass") or p.get("type", {}).get("kind"),
                                          "doc": doc_text(p.get("name"), p.get("description"))}
            if k == "WFContentItemFilter" and ident in filters:
                kinds[k].update(kind="filter", ts=f"Where<FilterRows[{js_str(ident)}]> | FilterTemplateValue",
                                doc="Find conditions: `where(...rows)` or `whereAny(...rows)`, or a raw `WFContentPredicateTableTemplate`.")
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
    if e.get("unavailable"):
        lines.append("Unavailable: Shortcuts shows this as a missing action.")
    body = "\n   *\n".join(f"   * {l}" for l in lines)
    return f"  /**\n{body}\n   */\n"


def write_ts(es, path):
    used = set()
    for e in es:
        if e.get("descriptor"):
            used.add("DictionaryValue")
        for k in e["params"]:
            info = e["kinds"].get(k, {"kind": "any", "choices": []})
            for name in re.findall(r"[A-Za-z]+", ts_type(info)):
                if name in ("Loose", "Attachment", "TokenString", "EnumValue", "Where") or name in KIND_TS.values():
                    used.add(name)
    lines = ["// Generated by tools/generate-action-catalog.py from data/builtin-actions.json. Do not edit.",
             "import type { " + ", ".join(sorted(used)) + " } from \"../values.js\";",
             "import type { FilterRows } from \"./entities.js\";", "",
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
    lines += ["} as const;", "", "/** Choice labels for enumeration parameters, as the engine and the Shortcuts app's registry list them. */", "export const PARAM_CHOICES = {"]
    for e in es:
        ch = {k: v["choices"] for k, v in e["kinds"].items() if v["choices"]}
        if ch:
            lines.append(f"  {js_str(e['identifier'])}: {{ {', '.join(f'{js_str(k)}: [{", ".join(js_str(c) for c in v)}]' for k, v in ch.items())} }},")
    lines += ["} as const;", "", "/** Parameter keys the engine does not read every reference for, with the variable types it does read",
              " *  (each one was loaded through the action; see docs/extraction.md). [] means only a plain value. Keys absent",
              " *  here read any attachment. ParamTypes encodes this for the compiler; Shortcut.action() enforces it at run time. */",
              "export const PARAM_VARIABLE_TYPES = {"]
    for e in es:
        restricted = {k: references(v) for k, v in e["kinds"].items() if references(v) is not None}
        if restricted:
            lines.append(f"  {js_str(e['identifier'])}: {{ {', '.join(f'{js_str(k)}: [{", ".join(js_str(t) for t in v)}]' for k, v in restricted.items())} }},")
    lines += ["} as const;", "", "/** Accepted value type for every parameter key of every action (see values.ts). */", "export type ParamTypes = {"]
    for e in es:
        fields = []
        for k in e["params"]:
            info = e["kinds"].get(k, {"kind": "any", "choices": []})
            doc = info.get("doc") or ("Filter conditions, a `WFContentPredicateTableTemplate` (see docs/shortcut-file-format.md)." if info["kind"] == "filter" else None)
            fields.append((doc, f"{js_str(k)}: {ts_type(info)}"))
        if e.get("descriptor"):
            fields.append(("The app that provides this action. `action()` adds it; pass it only to override.", '"AppIntentDescriptor"?: DictionaryValue'))
        if not any(doc for doc, _ in fields):
            lines.append(f"  {js_str(e['identifier'])}: {{ {'; '.join(f for _, f in fields)} }};")
            continue
        lines.append(f"  {js_str(e['identifier'])}: {{")
        for doc, field in fields:
            if doc:
                lines.append(f"    /** {doc} */")
            lines.append(f"    {field};")
        lines.append("  };")
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
             "// A named parameter type per action: what Shortcut.action() accepts for it (every key optional),",
             "// easier to read in hover text and error messages than Partial<ParamTypes[identifier]>.",
             "// Output content types are ACTIONS[identifier].outputTypes.",
             'import type { ParamTypes } from "./actions.js";', ""]
    seen = {}
    for e in es:
        name = type_name(e["key"])
        if name in seen:
            name += "_" + re.sub(r"[^A-Za-z0-9]", "", e["identifier"])[-6:]
        seen[name] = True
        lines.append(f"/** Parameters of {e['name']} (`{e['identifier']}`). */")
        lines.append(f"export type {name} = Partial<ParamTypes[{js_str(e['identifier'])}]>;")
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
    lines += ["}", "", "# Accepted value kind per parameter key: bool, number, string, text, picker, subject, plainString, plainNumber, dictionary, quantity, filter, any.", "PARAM_KINDS = {"]
    for e in es:
        lines.append(f"    {json.dumps(e['identifier'])}: {json.dumps({k: v['kind'] for k, v in e['kinds'].items()})},")
    lines += ["}", "", "# Parameter keys the engine does not read every reference for, with the variable types it does read.",
              "# [] means only a plain value. Keys absent here read any attachment.", "PARAM_VARIABLE_TYPES = {"]
    for e in es:
        restricted = {k: references(v) for k, v in e["kinds"].items() if references(v) is not None}
        if restricted:
            lines.append(f"    {json.dumps(e['identifier'])}: {json.dumps(restricted)},")
    lines += ["}", "", "# Choice labels for enumeration parameters.", "PARAM_CHOICES = {"]
    for e in es:
        ch = {k: v["choices"] for k, v in e["kinds"].items() if v["choices"]}
        if ch:
            lines.append(f"    {json.dumps(e['identifier'])}: {json.dumps(ch, ensure_ascii=False)},")
    lines += ["}", ""]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines))


# Filter row operators by code, named as CONDITION names If's (the engine's own names are in
# filterOperators in data/encoding-table.json; 1000-1002 are the date ones If does not take).
FILTER_OPERATOR_NAMES = {0: "less_than", 1: "less_or_equal", 2: "greater_than", 3: "greater_or_equal", 4: "is", 5: "is_not", 8: "begins_with", 9: "ends_with",
                         99: "contains", 100: "has_any_value", 101: "has_no_value", 999: "does_not_contain", 1000: "is_in_the_next", 1001: "is_in_the_last",
                         1002: "is_today", 1003: "is_between"}
# Calendar units "is in the last/next" counts in: NSCalendarUnit values, named as the editor's picker shows them.
CALENDAR_UNITS = {"years": 4, "months": 8, "weeks": 8192, "days": 16, "hours": 32, "minutes": 64, "seconds": 128}
# Row value kinds (extract-entities.js) -> the TypeScript type a row takes for each value.
ROW_VALUE_TS = {"text": "TextValue", "number": "NumberValue", "bool": "BoolValue", "date": "DateValue", "contactHandle": "TextValue"}


def entity_tables(entities):
    """FILTERS: per Find action, the properties a row can name, with the operators WorkflowKit offers
    for each (the index's list, less those the query's comparators do not produce) and the value kind;
    properties whose value the editor edits with a parameter the library does not write are left out.
    ENTITY_PROPERTIES: per entity type, every property identifier the index lists."""
    unit_codes = set(CALENDAR_UNITS.values())
    filters, properties = {}, {}
    for eid in sorted(entities):
        e = entities[eid]
        properties[eid] = sorted(e["properties"])
        if not e.get("find"):
            continue
        rows = {}
        for pid in sorted(e["properties"]):
            f = e["properties"][pid].get("filter")
            if not f or not f.get("values"):
                continue
            ops = [o for o in f["operators"] if o not in f.get("notFromComparators", [])]
            unknown = [o for o in ops if o not in FILTER_OPERATOR_NAMES] + [u for u in f.get("timeUnits", []) if u not in unit_codes]
            if unknown:
                raise SystemExit(f"{eid}.{pid}: no name for operator or unit {unknown}")
            if ops:
                rows[pid] = {"name": e["properties"][pid].get("name"), "operators": ops, "values": f["values"], **({"units": f["timeUnits"]} if f.get("timeUnits") else {})}
        if rows:
            filters[e["find"]] = rows
    return filters, properties


def row_types(pid, f):
    """The row tuples one property admits, grouped by the operands each operator takes."""
    unit_names = {v: k for k, v in CALENDAR_UNITS.items()}
    v, out, plain = ROW_VALUE_TS[f["values"]], [], []
    for o in f["operators"]:
        name = FILTER_OPERATOR_NAMES[o]
        if name == "is_today":
            out.append(f"readonly [{js_str(pid)}, \"is_today\"]")
        elif name in ("is_in_the_last", "is_in_the_next"):
            units = " | ".join(js_str(unit_names[u]) for u in f.get("units", []))
            out.append(f"readonly [{js_str(pid)}, {js_str(name)}, NumberValue, {units} | Attachment]")
        elif name == "is_between":
            out.append(f"readonly [{js_str(pid)}, \"is_between\", {v}, {v}]")
        else:
            plain.append(js_str(name))
    if plain:
        out.insert(0, f"readonly [{js_str(pid)}, {' | '.join(plain)}, {v}]")
    return out


def write_entities_ts(filters, properties, path):
    unions = {fid: " | ".join(t for pid, f in rows.items() for t in row_types(pid, f)) for fid, rows in filters.items()}
    used = sorted({n for u in unions.values() for n in re.findall(r"[A-Za-z]+", u) if n in ("Attachment", *ROW_VALUE_TS.values(), "NumberValue")})
    lines = ["// Generated by tools/generate-action-catalog.py from data/apple-entities.json. Do not edit.",
             "import type { " + ", ".join(used) + ' } from "../values.js";', "",
             "/** Filter row operators by name (CONDITION's names, plus the date operators If does not take). */",
             "export const FILTER_OPERATORS = { " + ", ".join(f"{n}: {c}" for c, n in FILTER_OPERATOR_NAMES.items()) + " } as const;",
             "/** Calendar units for `is_in_the_last` and `is_in_the_next`, as NSCalendarUnit values. */",
             "export const CALENDAR_UNITS = { " + ", ".join(f"{n}: {c}" for n, c in CALENDAR_UNITS.items()) + " } as const;", "",
             "/** The properties a Find action's filter rows can name, by action identifier: operator codes, the value",
             " *  kind (which row key holds the value), and the calendar units `is_in_the_last`/`is_in_the_next` offer. */",
             "export const FILTERS = {"]
    for fid, rows in filters.items():
        body = ", ".join(f"{js_str(pid)}: {{ operators: [{', '.join(map(str, f['operators']))}], values: {js_str(f['values'])}" + (f", units: [{', '.join(map(str, f['units']))}]" if f.get("units") else "") + " }" for pid, f in rows.items())
        lines.append(f"  {js_str(fid)}: {{ {body} }},")
    lines += ["} as const;", "", "/** Every property identifier Apple's index lists for an entity type; `property()` takes these. */", "export const ENTITY_PROPERTIES = {"]
    for eid, props in properties.items():
        lines.append(f"  {js_str(eid)}: [{', '.join(js_str(p) for p in props)}],")
    lines += ["} as const;", "", "/** The rows `where()` accepts per Find action: `[property, operator, ...values]`. */", "export type FilterRows = {"]
    for fid, union in unions.items():
        lines.append(f"  {js_str(fid)}: {union};")
    lines += ["};", "", "export type EntityId = keyof typeof ENTITY_PROPERTIES;",
              "/** Property identifiers of an entity type. */",
              "export type EntityProperty<E extends EntityId> = (typeof ENTITY_PROPERTIES)[E][number];", ""]
    path.write_text("\n".join(lines))


def write_entities_py(filters, properties, path):
    lines = ['"""Generated by tools/generate-action-catalog.py from data/apple-entities.json. Do not edit."""', "",
             "# Filter row operators by name (CONDITION's names, plus the date operators If does not take).",
             f"FILTER_OPERATORS = {json.dumps({n: c for c, n in FILTER_OPERATOR_NAMES.items()})}",
             "# Calendar units for is_in_the_last and is_in_the_next, as NSCalendarUnit values.",
             f"CALENDAR_UNITS = {json.dumps(CALENDAR_UNITS)}", "",
             "# The properties a Find action's filter rows can name, by action identifier: operator codes, value kind, calendar units.",
             "FILTERS = {"]
    for fid, rows in filters.items():
        lines.append(f"    {json.dumps(fid)}: {json.dumps({pid: {k: v for k, v in f.items() if k != 'name'} for pid, f in rows.items()})},")
    lines += ["}", "", "# Every property identifier Apple's index lists for an entity type; property_() takes these.", "ENTITY_PROPERTIES = {"]
    for eid, props in properties.items():
        lines.append(f"    {json.dumps(eid)}: {json.dumps(props)},")
    lines += ["}", ""]
    path.write_text("\n".join(lines))


def main(argv):
    src = pathlib.Path(argv[1]) if len(argv) > 1 else ROOT / "data" / "builtin-actions.json"
    apps = pathlib.Path(argv[2]) if len(argv) > 2 else ROOT / "data" / "apple-app-intents.json"
    ents = pathlib.Path(argv[3]) if len(argv) > 3 else ROOT / "data" / "apple-entities.json"
    es = entries(json.load(open(src)))
    n_builtin = len(es)
    filters, properties = entity_tables(json.load(open(ents))["entities"]) if ents.exists() else ({}, {})
    if apps.exists():
        es += app_intent_entries(json.load(open(apps)).get("actions", {}), filters)
    es = dedupe_keys(es)
    missing = sorted(set(filters) - {e["identifier"] for e in es})
    if missing:
        raise SystemExit(f"Find filters for actions not in the catalogue: {missing[:5]}")
    write_ts(es, ROOT / "src/generated/actions.ts")
    write_params_ts(es, ROOT / "src/generated/params.ts")
    write_py(es, ROOT / "python/src/shortcutkit/actions.py")
    write_entities_ts(filters, properties, ROOT / "src/generated/entities.ts")
    write_entities_py(filters, properties, ROOT / "python/src/shortcutkit/entities.py")
    rows = sum(len(p) for p in filters.values())
    print(f"{n_builtin} built-in + {len(es) - n_builtin} App Intents actions -> src/generated/actions.ts, python/src/shortcutkit/actions.py; "
          f"{len(filters)} Find filters ({rows} properties), {len(properties)} entity types -> src/generated/entities.ts, python/src/shortcutkit/entities.py")


if __name__ == "__main__":
    main(sys.argv)
