#!/usr/bin/env python3
"""Read the Shortcuts app's own action registry and write the App Intents catalogues.

Shortcuts 10 indexes every action it can offer, from every provider, into
~/Library/Shortcuts/ToolKit/Tools-prod.*.sqlite (written by BackgroundShortcutRunner, an
entitled Apple process that may query linkd, the App Intents daemon). That index is the only
readable copy of linkd's registry: linkd itself refuses any caller without the
com.apple.linkd.registry entitlement, which only Apple-signed code can carry. For each tool it
records the exact WFWorkflowActionIdentifier Shortcuts writes into a file, the owning app,
English names and descriptions, parameter keys with types, enumeration cases, and output types.

Reads, when present:
  data/linkd-actions.json       linkd's visibility per action (tools/linkd/action-metadata.js,
                                `bun run extract-filters`); intents it marks not discoverable are
                                Siri-only and the app refuses to import them, so they are left out

Writes:
  data/apple-app-intents.json   App Intents of Apple's own apps and system components
                                (committed; they ship with macOS)
  data/toolkit-registry.json    every tool in the index, third-party apps included
                                (local only; depends on what is installed)
  data/toolkit-names.json       English names, descriptions, output names and enumeration
                                cases for every identifier (local; used to fill what the
                                engine's definitions leave out)

usage: dump-toolkit-registry.py [--db PATH] [--entities PATH] [DATA_DIR]
"""
import base64
import glob
import json
import os
import pathlib
import re
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
# App Intents protocols that configure widgets, controls, Live Activities and Focus filters
# (developer.apple.com/documentation/appintents/app-intent-types). Recorded per tool, not a
# filter: the index hides the widget, control and Live Activity configurations itself, and the
# four Focus filters it shows are in the editor (Mail's category lists "Set Mail Focus Filter"
# under a "Focus" heading), so they stay in the catalogue.
CONFIGURATION_PROTOCOLS = {"widgetConfiguration", "controlConfiguration", "liveActivity", "focusConfiguration"}


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


def protobuf_fields(blob):
    """Top-level (field number, value) pairs of a protobuf message, or None if the bytes are not one."""
    i, out = 0, []

    def varint():
        nonlocal i
        v = shift = 0
        while True:
            c = blob[i]; i += 1; v |= (c & 0x7F) << shift; shift += 7
            if not c & 0x80:
                return v
    try:
        while i < len(blob):
            tag = varint(); field, wire = tag >> 3, tag & 7
            if wire == 0:
                out.append((field, varint()))
            elif wire == 2:
                n = varint()
                if i + n > len(blob):
                    return None
                out.append((field, blob[i:i + n])); i += n
            elif wire == 1:
                out.append((field, blob[i:i + 8])); i += 8
            elif wire == 5:
                out.append((field, blob[i:i + 4])); i += 4
            else:
                return None
    except IndexError:
        return None
    return out


def two_strings(blob):
    fs = protobuf_fields(blob)
    if fs and len(fs) >= 2 and all(isinstance(v, bytes) for _, v in fs[:2]):
        try:
            return fs[0][1].decode(), fs[1][1].decode()
        except UnicodeDecodeError:
            return None
    return None


def embedded_queries(con):
    """The App Intents query each entity-typed parameter was indexed with: {type id: {Swift query type}}.
    A parameter's typeInstance embeds the entity's definition (properties, display names) under
    {1: type reference, 2: {1: {1: header, 2: {properties..., 9: {query type, bundle}}}}}; a union-typed
    parameter embeds one such definition per member type. linkd knows several queries for some types
    (Contacts' ContactEntityQuery and ContactEntityIDPassthroughQuery), and the one the index names
    is the one the editor builds the parameter's content item class from."""
    def sub(fs, n):
        return [v for f, v in fs if f == n and isinstance(v, bytes)]

    def type_ref(blob):
        fs = protobuf_fields(blob)
        if not fs:
            return None
        inner = sub(fs, 2)
        s = two_strings(inner[0]) if inner else two_strings(blob)
        return s if s and s[0].startswith("com.") and not s[1].endswith("Query") else None

    def collect(blob, acc, depth=0):
        fs = protobuf_fields(blob)
        if fs is None or depth > 40:
            return
        refs, defs = sub(fs, 1), sub(fs, 2)
        if refs and defs:
            ref = type_ref(refs[0])
            wrapper = protobuf_fields(defs[0]) if ref else None
            for d in (sub(wrapper, 1) if wrapper else []):
                df = protobuf_fields(d)
                for body in (sub(df, 2) if df else []):
                    bf = protobuf_fields(body)
                    for q in (sub(bf, 9) if bf else []):
                        s = two_strings(q)
                        if s and s[0].endswith("Query"):
                            acc.setdefault(f"{ref[0]}.{ref[1]}", set()).add(s[0])
        for _, v in fs:
            if isinstance(v, bytes) and v:
                collect(v, acc, depth + 1)
    acc = {}
    for (blob,) in con.execute("select typeInstance from Parameters"):
        collect(blob, acc)
    return acc


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


def export_entities(con, apple, path):
    """The entity types Apple's actions output or find, with their properties and filter templates
    as the index stores them (protobuf blobs, base64). extract-entities.js decodes them with
    ToolKit's own classes and has WorkflowKit build the filters from them."""
    wanted = {t for a in apple for t in a["outputTypes"]} | {a["identifier"] for a in apple if any(p["key"] == "WFContentItemFilter" for p in a["parameters"])}
    kinds = dict(con.execute("select rowId, kind from Types"))
    display = {}
    for type_id, name in con.execute("select typeId, name from TypeDisplayRepresentations where locale='en' and name is not null and name != ''"):
        display.setdefault(type_id, name)
    queries = embedded_queries(con)
    entities, referenced = {}, set()
    for type_id in sorted(wanted):
        if kinds.get(type_id) != 2:
            continue
        props = []
        for pid, ti in con.execute("select id, typeInstance from EntityProperties where typeId=? order by rowid", (type_id,)):
            loc = con.execute("select displayName from EntityPropertyLocalizations where typeId=? and propertyId=? and locale='en'", (type_id, pid)).fetchone()
            props.append({"id": pid, "name": loc[0] if loc else None, "typeInstance": base64.b64encode(ti).decode()})
        template = con.execute("select comparison from PredicateTemplates where typeId=?", (f"builtin.query.{type_id}",)).fetchone()
        tool = next((a for a in apple if a["identifier"] == type_id), None)
        bundle, type_name = read_bundle_and_name(con.execute("select id from Types where rowId=?", (type_id,)).fetchone()[0])
        app = con.execute("select l.name from Types t join ContainerMetadataLocalizations l on l.containerId = t.sourceContainerId and l.locale='en' where t.rowId=?", (type_id,)).fetchone()
        entities[type_id] = {"name": display.get(type_id), "bundleIdentifier": bundle, "typeName": type_name, "app": app[0] if app else None,
                             "find": type_id if tool else None,
                             "queries": sorted(queries.get(type_id, ())),
                             "properties": props, "comparison": base64.b64encode(template[0]).decode() if template else None}
    # Kind and cases of every custom type a property may name (entity, or enum with its cases).
    custom = {}
    for type_id, kind in kinds.items():
        if kind in (2, 3, 4) and type_id.startswith("com.apple."):
            entry = {"kind": TYPE_KIND[kind]}
            if TYPE_KIND[kind] == "enum":
                entry["cases"] = [{"id": i, "title": t} for i, t in con.execute("select id, title from EnumerationCases where typeId=? and locale='en' order by id", (type_id,))]
            custom[type_id] = entry
    json.dump({"entities": entities, "types": custom}, open(path, "w"), ensure_ascii=False)
    return len(entities)


def main(argv):
    db = None
    if "--db" in argv:
        db = argv[argv.index("--db") + 1]; argv = [a for i, a in enumerate(argv) if a != "--db" and argv[i - 1] != "--db"]
    entities_path = None
    if "--entities" in argv:
        entities_path = argv[argv.index("--entities") + 1]; argv = [a for i, a in enumerate(argv) if a != "--entities" and argv[i - 1] != "--entities"]
    linkd_actions = None
    if "--linkd-actions" in argv:
        linkd_actions = pathlib.Path(argv[argv.index("--linkd-actions") + 1]); argv = [a for i, a in enumerate(argv) if a != "--linkd-actions" and argv[i - 1] != "--linkd-actions"]
    data = pathlib.Path(argv[1]) if len(argv) > 1 else pathlib.Path(__file__).resolve().parent.parent / "data"
    if linkd_actions is None:
        linkd_actions = data / "linkd-actions.json"
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
        protocols = sorted({p for (p,) in con.execute("select identifier from SystemToolProtocols where toolId=?", (row_id,))})
        container = containers.get(container_id, {})
        tool = {"identifier": ident, "key": python_name, "toolType": tool_type, "provider": provider, "visibilityFlags": vis, "flags": flags,
                # visibilityFlags 0 is what the editor on this Mac does not offer (built-ins: iPad-only Stage
                # Manager, the retired Watch Me Do; App Intents: internal helpers such as "Fetch Contact Avatars").
                "hidden": vis == 0, "protocols": protocols, "configuration": bool(set(protocols) & CONFIGURATION_PROTOCOLS),
                "synthesized": "synthesizedTool" in protocols,
                "app": container, "attribution": containers.get(attribution_id) if attribution_id and attribution_id != container_id else None,
                "name": loc[0], "outputName": output_name, "outputNameSource": "resultLabel" if loc[1] else ("outputType" if output_name else None),
                "description": loc[2], "descriptionResult": loc[3], "descriptionNote": loc[4],
                "outputTypes": outputs, "outputTypeNames": [type_display.get(t) for t in outputs], "keywords": keywords,
                "appIntentIdentifier": link_ids[0] if link_ids else None, "parameters": params}
        tools.append(tool)
        if loc[0]:
            enums = {p["key"]: [c["id"] for c in p["type"].get("cases", [])] for p in params if p["type"].get("kind") == "enum" and p["type"].get("cases")}
            labels = {p["key"]: p["name"] for p in params if p.get("name")}
            descriptions = {p["key"]: p["description"] for p in params if p.get("description")}
            names[ident] = {"name": loc[0], "description": loc[2], "outputName": loc[1], "enumCases": enums, "labels": labels,
                            "descriptions": descriptions}
    # Intents linkd marks not discoverable (Siri-only; `assistantOnly` in its visibility metadata)
    # are refused by the app's import sheet, so they are left out. Only linkd knows: the index's
    # visibilityFlags does not single them out. data/linkd-actions.json comes from
    # tools/linkd/action-metadata.js (bun run extract-filters).
    undiscoverable = set()
    if linkd_actions.exists():
        for bundle, acts in json.load(open(linkd_actions)).items():
            undiscoverable.update(f"{bundle}.{aid}" for aid, a in (acts or {}).items() if not a.get("discoverable", True))
    else:
        print(f"warning: no {linkd_actions}; intents the app refuses to import (not discoverable in linkd) stay in the catalogue", file=sys.stderr)
    is_apple_link = lambda t: t["provider"] == "WFLinkActionProvider" and str(t["app"].get("bundleIdentifier", "")).startswith("com.apple.")
    apple = [t for t in tools if is_apple_link(t) and t["app"].get("teamId") in (None, "0000000000")
             and not t["hidden"] and t["identifier"] not in undiscoverable]
    excluded = sum(1 for t in tools if is_apple_link(t) and t["hidden"])
    not_discoverable = sum(1 for t in tools if is_apple_link(t) and not t["hidden"] and t["identifier"] in undiscoverable)
    data.mkdir(parents=True, exist_ok=True)
    # The index file name, its version key and the LaunchServices sequence are random or
    # per-machine values; only the schema version and the OS build say what was read.
    prov = {"source": re.sub(r"-[0-9A-Fa-f-]{36}(?=\.sqlite$)", "", os.path.basename(db)),
            "osVersion": meta.get("OSVersion"), "indexerSource": meta.get("IndexerSource")}
    json.dump({"provenance": prov, "actions": {t["identifier"]: t for t in apple}}, open(data / "apple-app-intents.json", "w"), indent=1, ensure_ascii=False, sort_keys=True)
    # The app keeps one index and rebuilds it on every OS update, so these dumps are the only copy
    # of a release's index once the Mac moves on. Keep one per build beside the current one.
    for suffix in [""] + ([f".{prov['osVersion']}"] if prov.get("osVersion") else []):
        json.dump({"provenance": prov, "tools": tools}, open(data / f"toolkit-registry{suffix}.json", "w"), indent=1, ensure_ascii=False)
        json.dump(names, open(data / f"toolkit-names{suffix}.json", "w"), indent=1, ensure_ascii=False, sort_keys=True)
    if entities_path:
        n = export_entities(con, apple, entities_path)
        print(f"{n} Apple entity types -> {entities_path}")
    by_provider = {}
    for t in tools:
        by_provider[t["provider"]] = by_provider.get(t["provider"], 0) + 1
    print(f"{len(tools)} tools in the index ({', '.join(f'{k} {v}' for k, v in sorted(by_provider.items()))}); "
          f"{len(apple)} Apple App Intents -> {data / 'apple-app-intents.json'} ({excluded} hidden and {not_discoverable} not discoverable in linkd left out); {len(names)} names -> {data / 'toolkit-names.json'}")


if __name__ == "__main__":
    main(sys.argv)
