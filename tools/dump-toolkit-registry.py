#!/usr/bin/env python3
"""Read the Shortcuts app's own action registry and write the App Intents catalogues.

Shortcuts 10 indexes every action it can offer, from every provider, into
~/Library/Shortcuts/ToolKit/Tools-prod.*.sqlite (written by BackgroundShortcutRunner, an
entitled Apple process that may query linkd, the App Intents daemon). That index is the only
readable copy of linkd's registry: linkd itself refuses any caller without the
com.apple.linkd.registry entitlement, which only Apple-signed code can carry. For each tool it
records the exact WFWorkflowActionIdentifier Shortcuts writes into a file, the owning app,
English names and descriptions, parameter keys with types, enumeration cases, and output types.

Writes:
  data/apple-app-intents.json   App Intents of Apple's own apps and system components
                                (committed; they ship with macOS)
  data/toolkit-registry.json    every tool in the index, third-party apps included
                                (local only; depends on what is installed)
  data/toolkit-names.json       English names, descriptions, output names and enumeration
                                cases for every identifier (local; used to fill what the
                                engine's definitions leave out)

usage: dump-toolkit-registry.py [--db PATH] [DATA_DIR]
"""
import glob
import json
import os
import pathlib
import sqlite3
import sys

DEFAULT_DB = os.path.expanduser("~/Library/Shortcuts/ToolKit/Tools-prod.*.sqlite")

# LNValueType primitive: the tag byte is the protobuf field number of the type that is set
# (verified by joining the index against the apps' own Metadata.appintents/extract.actionsdata).
PRIMITIVES = {0x08: "any", 0x10: "bool", 0x18: "int", 0x20: "double", 0x30: "string", 0x38: "date",
              0x40: "dateComponents", 0x48: "url", 0x58: "richText", 0x80: "person", 0x88: "file",
              0x90: "app", 0xb0: "recurrence", 0xc0: "measurement", 0xc8: "location"}
KIND_OF = {"string": "text", "richText": "text", "url": "text", "bool": "bool", "int": "number", "double": "number"}
TYPE_KIND = {1: "primitive", 2: "entity", 3: "enum", 4: "enum", 6: "type"}


def primitive_name(blob):
    # b"\n\x02<tag>\x00" or b"\n\x03<tag>\x01\x00": field 1 wraps the one-of; read its first byte.
    if len(blob) >= 3 and blob[0] == 0x0A:
        return PRIMITIVES.get(blob[2], f"primitive{blob[2]}")
    return "unknown"


def read_bundle_and_name(blob):
    # b"\x12<len>\n<len>bundle\x12<len>name"
    try:
        i = 2 if blob[0] == 0x12 else 0
        if blob[i] == 0x0A:
            n = blob[i + 1]; bundle = blob[i + 2:i + 2 + n].decode(); j = i + 2 + n
            if blob[j] == 0x12:
                m = blob[j + 1]; name = blob[j + 2:j + 2 + m].decode()
                return bundle, name
    except Exception:
        pass
    return None, None


def type_info(con, type_row_id):
    row = con.execute("select id, kind from Types where rowId=?", (type_row_id,)).fetchone()
    if not row:
        return {"kind": "unknown"}
    blob, kind = row
    k = TYPE_KIND.get(kind, f"kind{kind}")
    if k == "primitive":
        return {"kind": "primitive", "primitive": primitive_name(blob)}
    bundle, name = read_bundle_and_name(blob)
    info = {"kind": k, "bundleIdentifier": bundle, "name": name}
    if k == "enum":
        info["cases"] = [{"id": i, "title": t} for i, t in con.execute(
            "select id, title from EnumerationCases where typeId=? and locale='en' order by id", (type_row_id,))]
    return info


def load_value_type_table(data):
    """Value type -> WorkflowKit parameter class, as the engine maps them (extract-encoding-table.js)."""
    path = data / "encoding-table.json"
    if not path.exists():
        return {}
    table = json.load(open(path)).get("appIntentValueTypes", {})
    return {k: v for k, v in table.items() if isinstance(v, dict) and v.get("parameterClass") and not v["parameterClass"].startswith("(")}


def parameter_class(info, table):
    """The WorkflowKit parameter class the engine would use for this value type, or None."""
    if not table:
        return None
    kind = info.get("kind")
    if kind == "primitive":
        key = {"url": "url", "richText": "richText", "dateComponents": "dateComponents", "location": "location"}.get(info.get("primitive"), info.get("primitive"))
        return (table.get(key) or {}).get("parameterClass")
    if kind == "entity":
        return (table.get("entity") or {}).get("parameterClass")
    if kind == "enum":
        return (table.get("enum") or {}).get("parameterClass")
    return None


def value_kind(info):
    if info["kind"] == "primitive":
        return KIND_OF.get(info["primitive"], "any")
    if info["kind"] == "enum" and info.get("cases"):
        return "string"
    return "any"


def main(argv):
    db = None
    if "--db" in argv:
        db = argv[argv.index("--db") + 1]; argv = [a for i, a in enumerate(argv) if a != "--db" and argv[i - 1] != "--db"]
    data = pathlib.Path(argv[1]) if len(argv) > 1 else pathlib.Path(__file__).resolve().parent.parent / "data"
    if not db:
        found = sorted(glob.glob(DEFAULT_DB))
        if not found:
            sys.exit("no ToolKit index at ~/Library/Shortcuts/ToolKit; open Shortcuts.app once so it builds one")
        db = found[-1]
    con = sqlite3.connect(f"file:{db}?mode=ro", uri=True)
    value_types = load_value_type_table(data)
    meta = dict(con.execute("select key, value from Metadata"))
    containers = {}
    for row_id, cid, team, origin, ctype in con.execute("select rowId, id, teamId, origin, containerType from ContainerMetadata"):
        name = con.execute("select name from ContainerMetadataLocalizations where containerId=? and locale='en'", (row_id,)).fetchone()
        containers[row_id] = {"bundleIdentifier": cid, "teamId": team or None, "name": name[0] if name else None, "containerType": ctype}
    # Display names of entity/enum types ("Reminder" for com.apple.reminders.ReminderEntity): the
    # editor labels an App Intent's output with its output type's display name when the tool has
    # no result label of its own.
    type_display = {}
    for row_id, blob in con.execute("select rowId, id from Types"):
        bundle, tname = read_bundle_and_name(blob)
        if bundle and tname:
            name = con.execute("select name from TypeDisplayRepresentations where typeId=? and locale='en' and name is not null and name != '' limit 1", (row_id,)).fetchone()
            if name:
                type_display[f"{bundle}.{tname}"] = name[0]
    tools, names = [], {}
    for (row_id, ident, tool_type, flags, vis, provider, python_name, container_id, attribution_id) in con.execute(
            "select rowId, id, toolType, flags, visibilityFlags, sourceActionProvider, pythonName, sourceContainerId, attributionContainerId from Tools order by id"):
        loc = con.execute("select name, outputResultName, descriptionSummary, descriptionResult, descriptionNote from ToolLocalizations where toolId=? and locale='en'", (row_id,)).fetchone() or (None,) * 5
        params = []
        for key, order, pflags in con.execute("select key, sortOrder, flags from Parameters where toolId=? order by sortOrder", (row_id,)):
            ploc = con.execute("select name, description, trueString, falseString from ParameterLocalizations where toolId=? and key=? and locale='en'", (row_id, key)).fetchone() or (None,) * 4
            types = [type_info(con, t) for (t,) in con.execute("select typeId from ToolParameterTypes where toolId=? and key=?", (row_id, key))]
            info = types[0] if types else {"kind": "unknown"}
            if ploc[2] is not None and info.get("kind") == "primitive" and info.get("primitive") != "bool":
                info = {"kind": "primitive", "primitive": "bool"}
            p = {"key": key, "name": ploc[0], "description": ploc[1], "kind": value_kind(info), "type": info, "flags": pflags}
            pc = parameter_class(info, value_types)
            if pc:
                p["parameterClass"] = pc
            if len(types) > 1:
                p["alternativeTypes"] = types[1:]
            params.append(p)
        outputs = [t for (t,) in con.execute("select typeIdentifier from ToolOutputTypes where toolId=?", (row_id,))]
        output_name = loc[1] or next((type_display[t] for t in outputs if t in type_display), None)
        keywords = [k for (k,) in con.execute("select keyword from SearchKeywords where toolId=? and locale='en' order by \"order\"", (row_id,))]
        link_ids = [k for (k,) in con.execute("select identifier from LinkActionIdentifiers where toolId=?", (row_id,))]
        container = containers.get(container_id, {})
        tool = {"identifier": ident, "key": python_name, "toolType": tool_type, "provider": provider, "visibilityFlags": vis, "flags": flags,
                "app": container, "attribution": containers.get(attribution_id) if attribution_id and attribution_id != container_id else None,
                "name": loc[0], "outputName": output_name, "outputNameSource": "resultLabel" if loc[1] else ("outputType" if output_name else None),
                "description": loc[2], "descriptionResult": loc[3], "descriptionNote": loc[4],
                "outputTypes": outputs, "outputTypeNames": [type_display.get(t) for t in outputs], "keywords": keywords,
                "appIntentIdentifier": link_ids[0] if link_ids else None, "parameters": params}
        tools.append(tool)
        if loc[0]:
            enums = {p["key"]: [c["id"] for c in p["type"].get("cases", [])] for p in params if p["type"].get("kind") == "enum" and p["type"].get("cases")}
            labels = {p["key"]: p["name"] for p in params if p.get("name")}
            names[ident] = {"name": loc[0], "description": loc[2], "outputName": loc[1], "enumCases": enums, "labels": labels}
    apple = [t for t in tools if t["provider"] == "WFLinkActionProvider" and str(t["app"].get("bundleIdentifier", "")).startswith("com.apple.")
             and t["app"].get("teamId") in (None, "0000000000")]
    data.mkdir(parents=True, exist_ok=True)
    prov = {"source": os.path.basename(db), "osVersion": meta.get("OSVersion"), "indexerSource": meta.get("IndexerSource"),
            "toolkitVersion": json.loads(meta.get("VersionKey", "{}")).get("uuid"),
            "launchServicesSequence": json.loads(meta.get("LaunchServicesDatabaseVersionKey", "{}")).get("sequenceNumber")}
    json.dump({"provenance": prov, "actions": {t["identifier"]: t for t in apple}}, open(data / "apple-app-intents.json", "w"), indent=1, ensure_ascii=False, sort_keys=True)
    json.dump({"provenance": prov, "tools": tools}, open(data / "toolkit-registry.json", "w"), indent=1, ensure_ascii=False)
    json.dump(names, open(data / "toolkit-names.json", "w"), indent=1, ensure_ascii=False, sort_keys=True)
    by_provider = {}
    for t in tools:
        by_provider[t["provider"]] = by_provider.get(t["provider"], 0) + 1
    print(f"{len(tools)} tools in the index ({', '.join(f'{k} {v}' for k, v in sorted(by_provider.items()))}); "
          f"{len(apple)} Apple App Intents -> {data / 'apple-app-intents.json'}; {len(names)} names -> {data / 'toolkit-names.json'}")


if __name__ == "__main__":
    main(sys.argv)
