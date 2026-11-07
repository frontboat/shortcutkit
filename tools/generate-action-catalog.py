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

usage: generate-action-catalog.py [data/builtin-actions.json] [data/apple-app-intents.json] [data/apple-entities.json] [data/engine-filters.json] [data/linkd-properties.json]
"""
import argparse
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
           "plainString": "PlainString", "plainNumber": "PlainNumber", "dictionary": "DictionaryParam", "quantity": "QuantityValue",
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


def load_output_classes():
    """Per action, the output content item classes the engine's instance computes, and per enumeration key the classes
    each choice yields where a choice changes them (actionOutputClasses in data/parameter-encodings.json)."""
    path = ROOT / "data" / "parameter-encodings.json"
    if not path.exists():
        return {}
    return json.load(open(path)).get("actionOutputClasses", {})


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


def plain_text(v):
    """A label or description with its whitespace collapsed, or None when empty."""
    return " ".join(v.split()) if isinstance(v, str) and v.strip() else None


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


def entries(defs, filters=None):
    state_map, runtime_params = load_state_map()
    output_classes = load_output_classes()
    out = []
    for ident in sorted(defs):
        a = defs[ident]
        pdefs = [p for p in a.get("Parameters", []) if isinstance(p, dict) and p.get("Key")]
        choices = {p["Key"]: [i for i in (p.get("Items") or []) if isinstance(i, str)] for p in pdefs}
        docs = {p["Key"]: (text(p.get("Label")), text(p.get("Description"))) for p in pdefs}
        # Enumeration choice titles: ItemDisplayNames aligned with Items, kept only where the title differs from the id.
        titles = {p["Key"]: {i: t for i, t in zip(p["Items"], p["ItemDisplayNames"]) if isinstance(i, str) and isinstance(t, str) and t != i}
                  for p in pdefs if isinstance(p.get("Items"), list) and isinstance(p.get("ItemDisplayNames"), list) and len(p["Items"]) == len(p["ItemDisplayNames"])}
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
                kinds[k].update(doc=doc_text(label, description), label=plain_text(label), description=plain_text(description), titles=titles.get(k) or {})
        if filters and ident in filters and "WFContentItemFilter" in kinds:
            kinds["WFContentItemFilter"].update(kind="filter", ts=f"Where<FilterRows[{js_str(ident)}]> | FilterTemplateValue",
                                                doc="Find conditions: `where(...rows)` or `whereAny(...rows)`, or a raw `WFContentPredicateTableTemplate`.")
        desc = a.get("Description") if isinstance(a.get("Description"), dict) else {}
        outp = a.get("Output") if isinstance(a.get("Output"), dict) else {}
        out.append({
            "key": key_for(ident), "identifier": ident, "name": text(a.get("Name")) or ident,
            "description": text(desc.get("DescriptionSummary")) or "", "params": params,
            "output": text(outp.get("OutputName")), "outputTypes": [t for t in (outp.get("Types") or []) if isinstance(t, str)],
            "summary": text(a.get("ParameterSummary")), "kinds": kinds, "unavailable": bool(a.get("Unavailable")),
            # The rest of the definition's card: what the action takes, how the editor finds it, when it is not offered,
            # and which parameters show only for a value of another (WFParameterRelationResource).
            "inputTypes": [t for t in (inp.get("Types") or []) if isinstance(t, str)] if isinstance(inp, dict) else [],
            "inputKey": inp.get("ParameterKey") if isinstance(inp, dict) else None,
            "inputRequired": bool(inp.get("Required")) if isinstance(inp, dict) else False,
            "keywords": [k for k in (a.get("ActionKeywords") or "").split("|") if k] if isinstance(a.get("ActionKeywords"), str) else [],
            "descriptionNote": text(desc.get("DescriptionNote")) or "", "descriptionResult": text(desc.get("DescriptionResult")) or "",
            "discontinued": bool(a.get("Discontinued")), "requiresUnlock": bool(a.get("RequiresUnlock")),
            "disabledOn": [x for x in (a.get("DisabledOnPlatforms") or []) if isinstance(x, str)],
            "requires": parameter_relations(pdefs),
            # The engine's own answer to "what comes out": content item classes, and per enumeration choice where it decides.
            "outputClasses": list((output_classes.get(ident) or {}).get("classes") or []),
            "outputClassesBy": dict((output_classes.get(ident) or {}).get("byChoice") or {}),
        })
    seen = {}
    for e in out:  # keys are unique by construction; guard anyway
        if e["key"] in seen:
            e["key"] += "_" + re.sub(r"[^A-Za-z0-9]", "", e["identifier"])[-6:]
        seen[e["key"]] = e
    return out


def parameter_relations(pdefs):
    """Per key, the WFParameterRelationResource rules under which the editor shows it: the other key, the
    engine's relation (`=` when the definition leaves it out, `!=`, `??`, `nil`) and the values. Resources
    come as a list of dictionaries, now and then nested one level or as a bare class name; only the
    relation ones are read."""
    out = {}
    for p in pdefs:
        rules = []
        stack = list(p.get("RequiredResources") or [])
        while stack:
            r = stack.pop(0)
            if isinstance(r, list):
                stack = r + stack
                continue
            if not isinstance(r, dict) or r.get("WFResourceClass") != "WFParameterRelationResource" or not r.get("WFParameterKey"):
                continue
            values = r.get("WFParameterValues") if isinstance(r.get("WFParameterValues"), list) else ([r["WFParameterValue"]] if "WFParameterValue" in r else [])
            rules.append({"key": r["WFParameterKey"], "relation": r.get("WFParameterRelation") or "=", "values": values})
        if rules:
            out[p["Key"]] = rules
    return out


APP_INTENT_KIND_TS = {"text": "TextValue", "bool": "BoolValue", "number": "NumberValue", "string": "StringValue", "any": "AnyValue"}
APPLE_TEAM = "0000000000"  # what Apple's own gallery shortcuts write for system apps


def app_intent_entries(catalog, filters, entities=None):
    """Entries for Apple's App Intents, from the Shortcuts app's registry (dump-toolkit-registry.py).
    `entities` (apple-entities.json) resolves entity-typed parameters to the catalogue's entity type
    identifiers; a parameter whose entity is not in the catalogue is left untyped."""
    state_map, _ = load_state_map()
    # A parameter names its entity by bundle identifier and type name; the name is the entity's full typeName
    # (GeoToolbox.PlaceDescriptorEntity) or its last component (ListEntity), so both are keys.
    entity_ids = {}
    for eid, e in (entities or {}).items():
        full = e.get("typeName") or eid
        for k in {(e.get("bundleIdentifier"), full), (e.get("bundleIdentifier"), full.split(".")[-1])}:
            entity_ids[k] = None if k in entity_ids else eid  # an ambiguous name resolves to nothing
    entity_ids = {k: v for k, v in entity_ids.items() if v}
    out = []
    for ident in sorted(catalog):
        t = catalog[ident]
        params, kinds = [], {}
        for p in t.get("parameters", []):
            k = p["key"]
            # The engine's parameter class for the value type (extract-encoding-table.js) decides the
            # kind, exactly as for built-ins; the registry's own guess is the fallback.
            kind = kind_for(p["parameterClass"], state_map) if p.get("parameterClass") else p.get("kind", "any")
            raw_cases = [c for c in p.get("type", {}).get("cases", []) if isinstance(c, dict) and isinstance(c.get("id"), str)]
            cases = [c["id"] for c in raw_cases]
            if cases and kind in ("string", "any", "text"):
                kind = "string"
            choices = cases if kind == "string" else []
            params.append(k); kinds[k] = {"kind": kind, "choices": choices, "class": p.get("parameterClass") or p.get("type", {}).get("kind"),
                                          "doc": doc_text(p.get("name"), p.get("description")), "label": plain_text(p.get("name")), "description": plain_text(p.get("description")),
                                          "titles": {c["id"]: c["title"] for c in raw_cases if isinstance(c.get("title"), str) and c["title"] != c["id"]} if choices else {}}
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
            "inputTypes": [], "inputKey": None, "inputRequired": False,
            "keywords": [k for k in (t.get("keywords") or []) if isinstance(k, str)],
            "descriptionText": t.get("description") or "", "descriptionNote": t.get("descriptionNote") or "", "descriptionResult": t.get("descriptionResult") or "",
            "discontinued": False, "requiresUnlock": False, "disabledOn": [], "requires": {},
            "paramEntities": {p["key"]: entity_ids[(p["type"]["bundleIdentifier"], p["type"]["name"])] for p in t.get("parameters", [])
                              if isinstance(p.get("type"), dict) and p["type"].get("kind") == "entity" and (p["type"].get("bundleIdentifier"), p["type"].get("name")) in entity_ids},
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


def ts_map(d):
    """A string -> string map as a TypeScript object literal."""
    return "{ " + ", ".join(f"{js_str(k)}: {js_str(v)}" for k, v in d.items()) + " }"


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


def card(e):
    """The rest of an action's catalogue entry, as data: present only where the definition says something."""
    c = {"inputTypes": e.get("inputTypes", [])}
    if e.get("outputClasses"):
        c["outputClasses"] = e["outputClasses"]
    if e.get("inputKey"):
        c["inputKey"] = e["inputKey"]
    if e.get("inputRequired"):
        c["inputRequired"] = True
    if e.get("keywords"):
        c["keywords"] = e["keywords"]
    d = e.get("descriptionText", e.get("description")) if e.get("descriptor") else e.get("description")
    if d:
        c["description"] = d
    for k in ("descriptionNote", "descriptionResult"):
        if e.get(k):
            c[k] = e[k]
    for k in ("discontinued", "unavailable", "requiresUnlock"):
        if e.get(k):
            c[k] = True
    if e.get("disabledOn"):
        c["disabledOn"] = e["disabledOn"]
    if e.get("requires"):
        c["requires"] = e["requires"]
    return c


def card_ts(e):
    out = []
    for k, v in card(e).items():
        if isinstance(v, bool):
            out.append(f"{k}: true")
        elif isinstance(v, str):
            out.append(f"{k}: {js_str(v)}")
        elif isinstance(v, list):
            out.append(f"{k}: [{', '.join(js_str(x) for x in v)}]")
        else:  # requires
            rules = ", ".join(f"{js_str(pk)}: [{', '.join('{ key: ' + js_str(r['key']) + ', relation: ' + js_str(r['relation']) + ', values: [' + ', '.join(js_str(x) for x in r['values']) + '] }' for r in rs)}]" for pk, rs in v.items())
            out.append(f"{k}: {{ {rules} }}")
    return ", " + ", ".join(out)


def write_ts(es, path):
    used = set()
    for e in es:
        if e.get("descriptor"):
            used.add("AppIntentDescriptor")
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
        extra += card_ts(e)
        lines.append(f"  {js_str(e['identifier'])}: {{ name: {js_str(e['name'])}, params: {params}, output: {js_str(e['output']) if e['output'] else 'null'}, outputTypes: {outs}{extra} }},")
    lines += ["} as const;", "", "/** The entity type of each entity-typed App Intents parameter, by action identifier and key (`acceptedBy()` reads it). */", "export const PARAM_ENTITY_TYPES = {"]
    for e in es:
        if e.get("paramEntities"):
            lines.append(f"  {js_str(e['identifier'])}: {{ {', '.join(f'{js_str(k)}: {js_str(v)}' for k, v in e['paramEntities'].items())} }},")
    lines += ["} as const;", "", "/** Actions whose output class follows one enumeration choice (Ask for Input's Input Type, Get Details of Images' property, ...):",
              " *  per key, the content item classes each choice yields, as the engine's action instance computes them. `property()` narrows by it",
              " *  when the choice is a literal. */", "export const OUTPUT_CLASSES_BY = {"]
    for e in es:
        if e.get("outputClassesBy"):
            per = ", ".join(f"{js_str(k)}: {{ {', '.join(f'{js_str(c)}: [{", ".join(js_str(x) for x in v)}]' for c, v in choices.items())} }}" for k, choices in e["outputClassesBy"].items())
            lines.append(f"  {js_str(e['identifier'])}: {{ {per} }},")
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
    lines += ["} as const;", "", "/** The editor's title for each enumeration choice whose title differs from its id (`WFCompoundType`'s `0` is \"Any\",",
              " *  Create Reminder's `connected` is \"Getting in\"): ItemDisplayNames for built-ins, the registry's case titles for App Intents. */",
              "export const PARAM_CHOICE_TITLES = {"]
    for e in es:
        t = {k: v["titles"] for k, v in e["kinds"].items() if v.get("titles") and v["choices"]}
        if t:
            lines.append(f"  {js_str(e['identifier'])}: {{ {', '.join(f'{js_str(k)}: {ts_map(v)}' for k, v in t.items())} }},")
    lines += ["} as const;", "", "/** The editor's label for each parameter key, where the definition or the registry gives one. */", "export const PARAM_LABELS = {"]
    for e in es:
        t = {k: v["label"] for k, v in e["kinds"].items() if v.get("label")}
        if t:
            lines.append(f"  {js_str(e['identifier'])}: {ts_map(t)},")
    lines += ["} as const;", "", "/** The editor's description of each parameter key (its hover text), where there is one. */", "export const PARAM_DESCRIPTIONS = {"]
    for e in es:
        t = {k: v["description"] for k, v in e["kinds"].items() if v.get("description")}
        if t:
            lines.append(f"  {js_str(e['identifier'])}: {ts_map(t)},")
    lines += ["} as const;", "", "/** Parameter keys the engine does not read every reference for, with the variable types it does read",
              " *  (each one was loaded through the action; see docs/extraction.md). [] permits no reference kinds. Keys absent",
              " *  here permit any attachment; absence also includes unprobed keys (see CATALOG for evidence). ParamTypes and Shortcut.action() enforce this policy. */",
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
            fields.append(("The app that provides this action. `action()` adds it; pass it only to override.", '"AppIntentDescriptor"?: AppIntentDescriptor'))
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
        desc += ", " + repr(card(e))[1:-1]  # a Python literal: True, not JSON's true, for the flags and relation values
        lines.append(f"    {json.dumps(e['identifier'])}: {{\"name\": {json.dumps(e['name'], ensure_ascii=False)}, \"params\": {json.dumps(e['params'])}, \"output\": {json.dumps(e['output']) if e['output'] else 'None'}, \"outputTypes\": {json.dumps(e.get('outputTypes', []))}{desc}}},")
    lines += ["}", "", "# The entity type of each entity-typed App Intents parameter, by action identifier and key (accepted_by() reads it).", "PARAM_ENTITY_TYPES = {"]
    for e in es:
        if e.get("paramEntities"):
            lines.append(f"    {json.dumps(e['identifier'])}: {json.dumps(e['paramEntities'])},")
    lines += ["}", "", "# Actions whose output class follows one enumeration choice: per key, the content item classes each choice yields,",
              "# as the engine's action instance computes them. property_() narrows by it.", "OUTPUT_CLASSES_BY = {"]
    for e in es:
        if e.get("outputClassesBy"):
            lines.append(f"    {json.dumps(e['identifier'])}: {json.dumps(e['outputClassesBy'], ensure_ascii=False)},")
    lines += ["}", "", "# Accepted value kind per parameter key: bool, number, string, text, picker, subject, plainString, plainNumber, dictionary, quantity, filter, any.", "PARAM_KINDS = {"]
    for e in es:
        if e["kinds"]:
            lines.append(f"    {json.dumps(e['identifier'])}: {json.dumps({k: v['kind'] for k, v in e['kinds'].items()})},")
    lines += ["}", "", "# The editor's title for each enumeration choice whose title differs from its id.", "PARAM_CHOICE_TITLES = {"]
    for e in es:
        t = {k: v["titles"] for k, v in e["kinds"].items() if v.get("titles") and v["choices"]}
        if t:
            lines.append(f"    {json.dumps(e['identifier'])}: {json.dumps(t, ensure_ascii=False)},")
    lines += ["}", "", "# The editor's label for each parameter key, where there is one.", "PARAM_LABELS = {"]
    for e in es:
        t = {k: v["label"] for k, v in e["kinds"].items() if v.get("label")}
        if t:
            lines.append(f"    {json.dumps(e['identifier'])}: {json.dumps(t, ensure_ascii=False)},")
    lines += ["}", "", "# The editor's description of each parameter key (its hover text), where there is one.", "PARAM_DESCRIPTIONS = {"]
    for e in es:
        t = {k: v["description"] for k, v in e["kinds"].items() if v.get("description")}
        if t:
            lines.append(f"    {json.dumps(e['identifier'])}: {json.dumps(t, ensure_ascii=False)},")
    lines += ["}", "", "# Parameter keys the engine does not read every reference for, with the variable types it does read.",
              "# [] permits no reference kinds. Absent keys permit any attachment, including unprobed keys; CATALOG preserves evidence.", "PARAM_VARIABLE_TYPES = {"]
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
# Byte-count units a file-size row counts in: the engine's ByteCountUnit codes, named as it formats them
# (decimal: 1 KB is 1000 bytes; rowValues.byteCountUnits in data/engine-filters.json).
BYTE_COUNT_UNITS = {"bytes": 1, "KB": 2, "MB": 4, "GB": 8, "TB": 16, "PB": 32, "EB": 64}
# Row value kinds -> the TypeScript type a row takes for each value. Enumerations and unit rows are built per property.
ROW_VALUE_TS = {"text": "TextValue", "email": "TextValue", "phone": "TextValue", "number": "NumberValue", "bool": "BoolValue", "date": "DateValue", "contactHandle": "TextValue"}
# The row value type the engine names in an operator's Swift type -> the row's value kind. A string row's kind
# then follows the property's value class (Email, Phone, String); a Number+Unit row is a date's "is in the
# last/next" or a duration's comparison. rowValues in data/engine-filters.json records each form.
DATE_TYPES = {"DateFilterOperator", "DateIsTodayOperator", "RowTemplateDateValueType"}
STRING_KINDS = {"WFEmailAddress": "email", "WFPhoneNumber": "phone"}


def engine_rows(props, at):
    """FILTERS rows for one content item class from the engine's own filter rules (extract-engine-filters.js):
    per property the operator codes, the value kind, the units a Number+Unit row takes and an enumeration's
    choices. Properties the engine offers no operator for (Bool ones, as of this data) are left out."""
    rows = {}
    for pid in sorted(props):
        f = props[pid]
        ops = [o["code"] for o in f["operators"]]
        if not ops:
            continue
        types = {re.sub(r"^\w+<(.*)>$", r"\1", o["type"]) if "<" in o["type"] else o["type"] for o in f["operators"]}
        units = [u for u in f.get("timeUnits", []) if u in CALENDAR_UNITS.values()]
        row = {"operators": ops}
        if types <= DATE_TYPES | {"RowTemplateCompoundNumberCalendarUnitValueType"} and types & DATE_TYPES:
            row["values"] = "date"
        elif types == {"RowTemplateCompoundNumberCalendarUnitValueType"}:
            row["values"] = "duration"
        elif types == {"RowTemplateCompoundNumberByteCountUnitValueType"}:
            row["values"] = "fileSize"
            units = []
        elif types == {"RowTemplateStringValueType"}:
            row["values"] = STRING_KINDS.get(f.get("valueClass"), "text")
        elif types == {"RowTemplateNumberValueType"}:
            row["values"] = "number"
        elif types == {"RowTemplateContactHandleValueType"}:
            row["values"] = "contactHandle"
        elif types == {"RowTemplateEnumerationValueType<EnumerationStringValueKey, NSString, NSString>"}:
            row["values"] = "enumeration"
            row["choices"] = f.get("items", [])
        elif types == {"RowTemplateEnumerationValueType<EnumerationLinkValueKey, LNDynamicOption, LNValue>"}:
            row["values"] = "enumCase"
            row["choices"] = f.get("cases", [])
        else:
            raise SystemExit(f"{at}.{pid}: no row kind for the engine's value types {sorted(types)}")
        unknown = [o for o in ops if o not in FILTER_OPERATOR_NAMES]
        if unknown:
            raise SystemExit(f"{at}.{pid}: no name for operator {unknown}")
        if units and row["values"] in ("date", "duration"):
            row["units"] = units
        bounded = [o["code"] for o in f.get("bounded", [])]
        if bounded != ops:
            row["boundedOperators"] = bounded
        rows[pid] = row
    return rows


def index_rows(e, eid):
    """FILTERS rows from the index route (data/apple-entities.json), for an entity the engine host did not build."""
    unit_codes = set(CALENDAR_UNITS.values())
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
            rows[pid] = {"operators": ops, "values": f["values"], **({"units": f["timeUnits"]} if f.get("timeUnits") else {})}
    return rows


def bounded_filters(filters, engine):
    """Find actions whose filter must hold a bounded date row (Find Calendar Events: a Start Date row with one
    of the bounded operators, marked Bounded, and WFContentPredicateBoundedDate true), or the engine replaces
    the whole filter with its default. The requirement shows in the action's default filter
    (actionDefaults in data/parameter-encodings.json: a row with Bounded true); the operators that count come
    from the engine's rules for the property (bounded in data/engine-filters.json)."""
    path = ROOT / "data" / "parameter-encodings.json"
    if not path.exists() or not engine:
        return {}
    out = {}
    for ident, params in json.load(open(path)).get("actionDefaults", {}).items():
        rows = (((params.get("WFContentItemFilter") or {}).get("Value") or {}).get("WFActionParameterFilterTemplates") or [])
        for row in rows:
            if isinstance(row, dict) and row.get("Bounded") and ident in filters and row["Property"] in filters[ident]:
                prop = filters[ident][row["Property"]]
                ops = [o for o in prop.get("boundedOperators", prop["operators"])]
                out[ident] = {"property": row["Property"], "operators": ops}
    return out


def find_actions(entities, catalog):
    """Entity type -> the actions that filter it: the index's Find action (`find`) and every App Intents action with a
    WFContentItemFilter parameter whose first output type is the entity (Find Notes keeps its legacy identifier
    `is.workflow.actions.filter.notes`, Clock's Get Alarms is `MTGetAlarmsIntent`; neither is the entity's `find`)."""
    out = {}
    for eid, e in entities.items():
        if e.get("find"):
            out.setdefault(eid, []).append(e["find"])
    for ident in sorted(catalog or {}):
        t = catalog[ident]
        first = (t.get("outputTypes") or [None])[0]
        if any(p.get("key") == "WFContentItemFilter" for p in t.get("parameters", [])) and first in entities and ident not in out.get(first, []):
            out.setdefault(first, []).append(ident)
    return out


def entity_tables(entities, defs, engine, linkd, catalog=None):
    """FILTERS: per Find action, the properties a row can name, with the operators the engine offers for
    each, the value kind and the choices or units the value takes. App Intents Find actions (find_actions)
    come from the entity built from linkd's metadata as the app builds it (data/linkd-properties.json; the
    index route stands in where the host did not build the entity or built it with no filter rules, as for
    Notes), built-in Find and Filter actions from their content item class (data/engine-filters.json).
    ENTITY_PROPERTIES: per entity type, every property identifier the index lists."""
    filters, properties = {}, {}
    finds = find_actions(entities, catalog)
    for eid in sorted(entities):
        e = entities[eid]
        properties[eid] = sorted(e["properties"])
        if not finds.get(eid):
            continue
        built = (linkd.get(eid) or {}).get("filters") if linkd else None
        rows = engine_rows(built, eid) if built else index_rows(e, eid)
        for pid, row in rows.items():
            row["name"] = e["properties"].get(pid, {}).get("name")
        for ident in finds[eid]:
            if rows:
                filters[ident] = dict(rows)
    for ident in sorted(defs):
        a = defs[ident]
        if a.get("ActionClass") != "WFContentItemFilterAction" or not a.get("WFContentItemClass"):
            continue
        props = (engine or {}).get("builtin", {}).get(a["WFContentItemClass"])
        if props:
            rows = engine_rows(props, ident)
            if rows:
                filters[ident] = rows
    return filters, properties


def type_label(t):
    """An entity property's type as one word: the primitive, `enum`, an entity's type name, `[]` for a list."""
    if not isinstance(t, dict):
        return "unknown"
    kind = t.get("kind")
    if kind == "primitive":
        return t.get("primitive") or "unknown"
    if kind == "entity":
        return (t.get("typeName") or t.get("type") or "entity").split(".")[-1]
    if kind == "array":
        return type_label(t.get("of")) + "[]"
    return kind or "unknown"


def entity_records(entities, catalog=None):
    """ENTITIES: per entity type, its display name, owning app and bundle, its Find action where the index has one,
    and each property's name and type (what the editor shows for the type, and what docs/catalog.txt prints)."""
    out = {}
    finds = find_actions(entities, catalog)
    for eid in sorted(entities):
        e = entities[eid]
        rec = {"name": e.get("name") or eid.split(".")[-1], "app": e.get("app") or "", "bundleIdentifier": e.get("bundleIdentifier") or ""}
        if finds.get(eid):
            rec["find"] = finds[eid][0]
        rec["properties"] = {pid: {"name": p.get("name") or pid, "type": type_label(p.get("type"))} for pid, p in sorted(e["properties"].items())}
        out[eid] = rec
    return out


def row_types(pid, f):
    """The row tuples one property admits, grouped by the operands each operator takes."""
    unit_names = {v: k for k, v in CALENDAR_UNITS.items()}
    kind = f["values"]
    if kind in ("enumeration", "enumCase"):
        v = "EnumValue<" + " | ".join(js_str(c) for c in f["choices"]) + ">" if f.get("choices") else "StringValue"
    elif kind in ("duration", "fileSize"):
        table = CALENDAR_UNITS if kind == "duration" else BYTE_COUNT_UNITS
        allowed = [n for n, c in table.items() if not f.get("units") or c in f["units"]]
        v = "NumberValue, " + " | ".join(js_str(n) for n in allowed) + " | Attachment"
    else:
        v = ROW_VALUE_TS[kind]
    out, plain = [], []
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


def write_entities_ts(filters, properties, bounded, classes, records, path):
    unions = {fid: " | ".join(t for pid, f in rows.items() for t in row_types(pid, f)) for fid, rows in filters.items()}
    used = sorted({n for u in unions.values() for n in re.findall(r"[A-Za-z]+", u) if n in ("Attachment", "EnumValue", "StringValue", *ROW_VALUE_TS.values(), "NumberValue")})
    lines = ["// Generated by tools/generate-action-catalog.py from data/engine-filters.json, data/linkd-properties.json and data/apple-entities.json. Do not edit.",
             "import type { " + ", ".join(used) + ' } from "../values.js";', "",
             "/** Filter row operators by name (CONDITION's names, plus the date operators If does not take). */",
             "export const FILTER_OPERATORS = { " + ", ".join(f"{n}: {c}" for c, n in FILTER_OPERATOR_NAMES.items()) + " } as const;",
             "/** Calendar units for `is_in_the_last`, `is_in_the_next` and duration rows, as NSCalendarUnit values. */",
             "export const CALENDAR_UNITS = { " + ", ".join(f"{n}: {c}" for n, c in CALENDAR_UNITS.items()) + " } as const;",
             "/** Units for file-size rows, as the engine's ByteCountUnit codes (decimal: 1 KB is 1000 bytes). */",
             "export const BYTE_COUNT_UNITS = { " + ", ".join(f"{n}: {c}" for n, c in BYTE_COUNT_UNITS.items()) + " } as const;", "",
             "/** The properties a Find action's filter rows can name, by action identifier: operator codes, the value kind",
             " *  (which row key holds the value), the calendar units a Number+Unit row offers, and an enumeration's choices. */",
             "export const FILTERS = {"]
    for fid, rows in filters.items():
        body = ", ".join(f"{js_str(pid)}: {{ operators: [{', '.join(map(str, f['operators']))}], values: {js_str(f['values'])}" + (f", units: [{', '.join(map(str, f['units']))}]" if f.get("units") else "") + (f", choices: [{', '.join(js_str(c) for c in f['choices'])}]" if f.get("choices") else "") + " }" for pid, f in rows.items())
        lines.append(f"  {js_str(fid)}: {{ {body} }},")
    lines += ["} as const;", "",
              "/** Find actions whose filter must include a bounded date row on this property, with one of these operators (Find Calendar",
              " *  Events: a Start Date row); `action()` marks it `Bounded` and sets `WFContentPredicateBoundedDate`, as the editor does. */",
              "export const BOUNDED_FILTERS = {"]
    for fid, b in bounded.items():
        lines.append(f"  {js_str(fid)}: {{ property: {js_str(b['property'])}, operators: [{', '.join(map(str, b['operators']))}] }},")
    lines += ["} as const;", "", "/** Every property identifier Apple's index lists for an entity type; `property()` takes these. */", "export const ENTITY_PROPERTIES = {"]
    for eid, props in properties.items():
        lines.append(f"  {js_str(eid)}: [{', '.join(js_str(p) for p in props)}],")
    lines += ["} as const;", "", "/** Every entity type Apple's index lists: display name, owning app and bundle, its Find action where there is one, and each",
              " *  property's name and type (a primitive, `enum`, an entity's type name, `[]` for a list). `ENTITY_PROPERTIES` holds the identifiers alone. */",
              "export const ENTITIES = {"]
    for eid, r in records.items():
        props = ", ".join(f"{js_str(pid)}: {{ name: {js_str(p['name'])}, type: {js_str(p['type'])} }}" for pid, p in r["properties"].items())
        find = f", find: {js_str(r['find'])}" if r.get("find") else ""
        lines.append(f"  {js_str(eid)}: {{ name: {js_str(r['name'])}, app: {js_str(r['app'])}, bundleIdentifier: {js_str(r['bundleIdentifier'])}{find}, properties: {{ {props} }} }},")
    lines += ["} as const;", "", "/** The rows `where()` accepts per Find action: `[property, operator, ...values]`. */", "export type FilterRows = {"]
    for fid, union in unions.items():
        lines.append(f"  {js_str(fid)}: {union};")
    lines += ["};", "", "export type EntityId = keyof typeof ENTITY_PROPERTIES;",
              "/** Property identifiers of an entity type. */",
              "export type EntityProperty<E extends EntityId> = (typeof ENTITY_PROPERTIES)[E][number];", "",
              "/** Content item classes a coercion can name (`coerce()`): the engine's own list, which is the editor's variable \"Type\" menu",
              " *  (`+[WFContentItem allSupportedItemClasses]`), each with the type name the editor shows. */",
              "export const CONTENT_ITEM_CLASSES = { " + ", ".join(f"{c}: {js_str(v['name'])}" for c, v in classes.items() if v["coercible"]) + " } as const;",
              "export type ContentItemClass = keyof typeof CONTENT_ITEM_CLASSES;", "",
              "/** The properties of every content item class the engine defines (`+allProperties`, 94 classes on macOS 27, the 22 coercible ones",
              " *  among them): the editor's \"Get\" list for a value of that type, and the names `property()` takes on a `coerce()`d value or",
              " *  on an output of that class. */",
              "export const CONTENT_ITEM_PROPERTIES = {"]
    for c, v in classes.items():
        if v["properties"]:
            lines.append(f"  {js_str(c)}: [{', '.join(js_str(p['name']) for p in v['properties'])}],")
    lines += ["} as const;", "/** A content item class with a property list: the coercible classes and the output-only ones (Calendar Event, Reminder, ...). */",
              "export type ContentItemType = keyof typeof CONTENT_ITEM_PROPERTIES;",
              "/** Property names of a content item class. */",
              "export type ContentItemProperty<C extends ContentItemType> = (typeof CONTENT_ITEM_PROPERTIES)[C][number];", "",
              "/** The content item class that wraps each object class or file type (`+ownedTypes`): what a definition's output type such as",
              " *  `NSDecimalNumber` or `public.folder` is in content item terms. A type several classes own maps to their common ancestor. */",
              "export const CONTENT_ITEM_TYPES = {"]
    for t, c in owned_types(classes).items():
        lines.append(f"  {js_str(t)}: {js_str(c)},")
    lines += ["} as const;", ""]
    path.write_text("\n".join(lines))


def owned_types(classes):
    """Object class or file type -> the content item class that owns it; a type several classes own resolves to the
    one that is an ancestor of all the others (the location family, the item-provider pair), else to nothing."""
    claims = {}
    for c, v in classes.items():
        for t in v.get("ownedTypes", []):
            claims.setdefault(t["name"], []).append(c)
    def ancestors(c):
        out = []
        while c in classes:
            c = classes[c].get("superclass"); out.append(c)
        return out
    out = {}
    for t, cs in claims.items():
        anc = [c for c in cs if all(c == o or c in ancestors(o) for o in cs)]
        if len(anc) == 1:
            out[t] = anc[0]
    return dict(sorted(out.items()))


def write_entities_py(filters, properties, bounded, classes, records, path):
    lines = ['"""Generated by tools/generate-action-catalog.py from data/engine-filters.json, data/linkd-properties.json and data/apple-entities.json. Do not edit."""', "",
             "# Filter row operators by name (CONDITION's names, plus the date operators If does not take).",
             f"FILTER_OPERATORS = {json.dumps({n: c for c, n in FILTER_OPERATOR_NAMES.items()})}",
             "# Calendar units for is_in_the_last, is_in_the_next and duration rows, as NSCalendarUnit values.",
             f"CALENDAR_UNITS = {json.dumps(CALENDAR_UNITS)}",
             "# Units for file-size rows, as the engine's ByteCountUnit codes (decimal: 1 KB is 1000 bytes).",
             f"BYTE_COUNT_UNITS = {json.dumps(BYTE_COUNT_UNITS)}", "",
             "# The properties a Find action's filter rows can name, by action identifier: operator codes, value kind, units, choices.",
             "FILTERS = {"]
    for fid, rows in filters.items():
        lines.append(f"    {json.dumps(fid)}: {json.dumps({pid: {k: v for k, v in f.items() if k not in ('name', 'boundedOperators') and not (k in ('choices', 'units') and not v)} for pid, f in rows.items()})},")
    lines += ["}", "", "# Find actions whose filter must include a bounded date row on this property, with one of these operators; action() marks it Bounded.",
              f"BOUNDED_FILTERS = {json.dumps(bounded)}", "",
              "# Every property identifier Apple's index lists for an entity type; property_() takes these.", "ENTITY_PROPERTIES = {"]
    for eid, props in properties.items():
        lines.append(f"    {json.dumps(eid)}: {json.dumps(props)},")
    lines += ["}", "", "# Every entity type Apple's index lists: display name, owning app and bundle, its Find action where there is one, and each",
              "# property's name and type (a primitive, enum, an entity's type name, [] for a list).", "ENTITIES = {"]
    for eid, r in records.items():
        lines.append(f"    {json.dumps(eid)}: {json.dumps(r, ensure_ascii=False)},")
    lines += ["}", "", "# Content item classes a coercion can name (coerce()): the engine's own list, the editor's variable \"Type\" menu, with the name it shows.",
              f"CONTENT_ITEM_CLASSES = {json.dumps({c: v['name'] for c, v in classes.items() if v['coercible']})}", "",
              "# The properties of every content item class the engine defines (+allProperties; the coercible ones among them): the editor's",
              "# \"Get\" list for a value of that type, and the names property_() takes on a coerce()d value or on an output of that class.", "CONTENT_ITEM_PROPERTIES = {"]
    for c, v in classes.items():
        if v["properties"]:
            lines.append(f"    {json.dumps(c)}: {json.dumps([p['name'] for p in v['properties']])},")
    lines += ["}", "", "# The content item class that wraps each object class or file type (+ownedTypes): what a definition's output type such as",
              "# NSDecimalNumber or public.folder is in content item terms. A type several classes own maps to their common ancestor.",
              f"CONTENT_ITEM_TYPES = {json.dumps(owned_types(classes))}", ""]
    path.write_text("\n".join(lines))


def canonical_model(es, defs, catalog, filters, records, classes, bounded, provenance, raw_entities):
    """Preserve evidence before compatibility tables erase measured-all versus unprobed."""
    actions = {}
    measured_outputs = load_output_classes()
    for e in es:
        ident = e["identifier"]
        builtin = ident in defs
        source = "definition" if builtin else "registry"
        pdefs = {p["Key"]: p for p in defs.get(ident, {}).get("Parameters", []) if isinstance(p, dict) and p.get("Key")}
        registry_params = {p["key"]: p for p in catalog.get(ident, {}).get("parameters", [])}
        parameters = {}
        for key in e["params"]:
            info = e["kinds"][key]
            raw = registry_params.get(key, {})
            entity = e.get("paramEntities", {}).get(key)
            refs = {"status": "not-probed"} if info.get("reads") is None else {"status": "measured", "allowed": info["reads"]}
            param = {
                "kind": info["kind"],
                "kindSource": ("legacy" if info.get("class") == "Legacy" else "implicit-input" if info.get("class") == "Input" else "parameter-class" if info.get("class") else source) if builtin else ("parameter-class" if raw.get("parameterClass") else "registry"),
                "choices": info.get("choices", []), "choiceTitles": info.get("titles", {}),
                "label": info.get("label"), "description": info.get("description"), "refs": refs,
                "entityStatus": "resolved" if entity else "unresolved" if (raw.get("type") or {}).get("kind") == "entity" else "not-applicable",
            }
            if entity:
                param["entityType"] = entity
            if "DefaultValue" in pdefs.get(key, {}):
                param["default"] = pdefs[key]["DefaultValue"]
            parameters[key] = param
        action = {k: v for k, v in e.items() if k not in ("kinds", "paramEntities", "descriptionText")}
        action["description"] = e.get("descriptionText", e.get("description", ""))
        for key, default in (("outputClasses", []), ("outputClassesBy", {})):
            action.setdefault(key, default)
        action.setdefault("unavailable", False)
        owner = defs[ident].get("AppDefinition", {}) if builtin else e.get("descriptor", {})
        action["app"] = {"name": text(owner.get("Name")), "bundleIdentifier": owner.get("BundleIdentifier")}
        action.update(origin="builtin" if builtin else "app-intent", parameters=parameters,
                      outputEvidence={"status": "measured" if ident in measured_outputs else "not-probed"},
                      inputStatus=("declared" if isinstance(defs[ident].get("Input"), dict) else "not-declared") if builtin else "named-parameters",
                      descriptionEvidence={"source": source, **{name: "present" if action.get(field) else "absent" for name, field in (("summary", "description"), ("note", "descriptionNote"), ("result", "descriptionResult"))}},
                      filterStatus="available" if ident in filters else "unresolved" if "WFContentItemFilter" in parameters else "not-applicable")
        if defs.get(ident, {}).get("WFContentItemClass"):
            action["filterClass"] = defs[ident]["WFContentItemClass"]
        actions[ident] = action
    joined_entities = {eid: {**record, "properties": {pid: {**prop, "typeInfo": raw_entities[eid]["properties"][pid].get("type")} for pid, prop in record["properties"].items()}} for eid, record in records.items()}
    normalized_filters = {ident: {pid: {k: v for k, v in row.items() if k not in ("name", "boundedOperators") and not (k in ("choices", "units") and not v)} for pid, row in rows.items()} for ident, rows in filters.items()}
    return {"schemaVersion": 1, "provenance": provenance, "actions": actions, "entities": joined_entities,
            "filters": normalized_filters, "filterOperators": {name: code for code, name in FILTER_OPERATOR_NAMES.items()},
            "calendarUnits": CALENDAR_UNITS, "byteCountUnits": BYTE_COUNT_UNITS, "boundedFilters": bounded,
            "contentItemClasses": classes, "contentItemTypes": owned_types(classes)}


def main(argv):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("inputs", nargs="*", type=pathlib.Path)
    parser.add_argument("--output-root", type=pathlib.Path, default=ROOT)
    args = parser.parse_args(argv[1:])
    if len(args.inputs) > 5:
        parser.error("at most five input paths are supported")
    defaults = [ROOT / "data" / name for name in ("builtin-actions.json", "apple-app-intents.json", "apple-entities.json", "engine-filters.json", "linkd-properties.json")]
    src, apps, ents, engine_path, linkd_path = args.inputs + defaults[len(args.inputs):]
    defs = json.loads(src.read_text())
    engine = json.loads(engine_path.read_text())
    linkd = json.loads(linkd_path.read_text())["entities"]
    entities_json = json.loads(ents.read_text())["entities"]
    catalog = json.loads(apps.read_text())["actions"]
    filters, properties = entity_tables(entities_json, defs, engine, linkd, catalog)
    es = entries(defs, filters)
    n_builtin = len(es)
    es = dedupe_keys(es + app_intent_entries(catalog, filters, entities_json))
    missing = sorted(set(filters) - {e["identifier"] for e in es})
    if missing:
        raise SystemExit(f"Find filters for actions not in the catalogue: {missing[:5]}")
    # Load and validate the complete snapshot before writing any output.
    classes = json.loads((ROOT / "data/encoding-table.json").read_text()).get("contentItemClasses")
    if not classes:
        raise SystemExit("data/encoding-table.json has no contentItemClasses; run bun run extract")
    bounded = bounded_filters(filters, engine)
    records = entity_records(entities_json, catalog)
    provenance = json.loads((ROOT / "data/provenance.json").read_text())
    model = canonical_model(es, defs, catalog, filters, records, classes, bounded, provenance, entities_json)
    output = args.output_root
    for directory in ("src/generated", "python/src/shortcutkit/data"):
        (output / directory).mkdir(parents=True, exist_ok=True)
    write_ts(es, output / "src/generated/actions.ts")
    write_params_ts(es, output / "src/generated/params.ts")
    write_py(es, output / "python/src/shortcutkit/actions.py")
    write_entities_ts(filters, properties, bounded, classes, records, output / "src/generated/entities.ts")
    write_entities_py(filters, properties, bounded, classes, records, output / "python/src/shortcutkit/entities.py")
    encoded = json.dumps(model, ensure_ascii=False, indent=2) + "\n"
    (output / "src/generated/catalog.json").write_text(encoded)
    (output / "python/src/shortcutkit/data/catalog.json").write_text(encoded)
    for name in ("builtin-actions.json", "provenance.json"):
        source = src if name == "builtin-actions.json" else ROOT / "data" / name
        (output / "python/src/shortcutkit/data" / name).write_bytes(source.read_bytes())
    print(f"{n_builtin} built-in + {len(es) - n_builtin} App Intents; {len(filters)} Find filters; {len(records)} entity types")


if __name__ == "__main__":
    main(sys.argv)
