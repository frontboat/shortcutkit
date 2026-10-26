"""Python mirror of test/verify/fixture.ts: the same cases through the Python package, so the two
packages' output can be diffed. Run from the repo root with the python venv:
    python/.venv/bin/python test/verify/fixture.py out.json
"""
import datetime
import json
import sys

sys.path.insert(0, "python/src")
from shortcutkit import ACTIONS, PARAM_KINDS, PARAM_CHOICES, PARAM_VARIABLE_TYPES, FILTERS, FILTER_OPERATORS, CALENDAR_UNITS, BOUNDED_FILTERS, ENTITY_PROPERTIES, Shortcut, actions, ref, text, variable, shortcut_input, clipboard, current_date, ask, device_details, current_app, repeat_item, property_, where, where_any  # noqa: E402

encodings = json.load(open("data/parameter-encodings.json"))
DEFAULTS = encodings["actionDefaults"]


def runtime(identifier, key):
    return next((p for p in encodings["actionParameters"].get(identifier, []) if p["key"] == key), None)


def is_plain(v):
    return isinstance(v, (str, int, float, bool))


seed = Shortcut("Seed")
source = seed.action(actions.GETSTOREDCONTENT, WFStoredContentKey="seed")
REF = ref(source)
REFERENCES = [("ref", REF), ("shortcutInput", shortcut_input()), ("variable", variable("MyVar")), ("clipboard", clipboard()), ("currentDate", current_date()), ("ask", ask("Which?")), ("deviceDetails", device_details()), ("currentApp", current_app())]


def samples(identifier, key, kind):
    choices = PARAM_CHOICES.get(identifier, {}).get(key, [])
    rt = runtime(identifier, key) or {}
    candidates = [rt.get("plainSample"), DEFAULTS.get(identifier, {}).get(key)]

    def same_type(v, fallback):
        if isinstance(fallback, bool):
            return isinstance(v, bool)
        if isinstance(fallback, (int, float)):
            return isinstance(v, (int, float)) and not isinstance(v, bool)
        return isinstance(v, str)

    def plain(fallback):
        return next((v for v in candidates if v is not None and same_type(v, fallback)), fallback)
    return {
        "bool": [("bool", plain(True)), *REFERENCES],
        "number": [("number", plain(5)), *REFERENCES],
        "string": [("string", plain(choices[0] if choices else "hello")), *REFERENCES],
        "text": [("string", plain("hello")), ("text+ref", text("Hi ", REF)), *REFERENCES],
        "picker": [r for r in REFERENCES if r[0] != "ask"],
        "subject": [("ref", REF)],
        "plainString": [("string", "hello")],
        "plainNumber": [("number", 5)],
    }.get(kind, [])


LEGACY = {
    "is.workflow.actions.conditional": ["WFInput", "WFCondition", "WFConditionalActionString", "WFNumberValue", "WFConditionalLegacyComparisonBehavior", "WFEnumerationValue", "WFBooleanValue", "WFDate", "WFAnotherDate", "WFDuration"],
    "is.workflow.actions.choosefrommenu": ["WFMenuPrompt", "WFMenuItems", "WFMenuItemTitle", "WFMenuItemAttributedTitle"],
}
cases = []
for identifier in ACTIONS:
    for key, kind in PARAM_KINDS.get(identifier, {}).items():
        if key in LEGACY.get(identifier, []):
            continue
        allowed = PARAM_VARIABLE_TYPES.get(identifier, {}).get(key)
        for form, value in samples(identifier, key, kind):
            is_ref = isinstance(value, dict) and value.get("WFSerializationType") == "WFTextTokenAttachment"
            if allowed is not None and is_ref and value["Value"]["Type"] not in allowed:
                cases.append({"identifier": identifier, "key": key, "kind": kind, "form": form, "params": {key: value}, "expect": "rejected"})
                continue
            if allowed is not None and form == "text+ref":
                continue
            s = Shortcut("Case")
            a = s.action(identifier, **{key: value})
            params = {k: v for k, v in a["WFWorkflowActionParameters"].items() if k != "UUID"}
            rt = runtime(identifier, key)
            expect = "deviceValidated" if is_plain(value) and rt is not None and rt.get("readsPlain") is False else "read"
            cases.append({"identifier": identifier, "key": key, "kind": kind, "form": form, "params": params, "expect": expect})

filter_cases = []
DATE = datetime.datetime(2026, 1, 1, tzinfo=datetime.timezone.utc)
PLAIN = {"text": "hello", "email": "a@b.co", "phone": "+15555550100", "contactHandle": "+15555550100", "number": 5, "bool": True, "date": DATE}
OPERATOR_NAME = {c: n for n, c in FILTER_OPERATORS.items()}


def row_forms(prop, op, kind, units, choices):
    if op == "is_today":
        return [("none", (prop, op))]
    if op in ("is_in_the_last", "is_in_the_next"):
        unit = next(u for u, c in CALENDAR_UNITS.items() if c in units)
        return [("number+unit", (prop, op, 5, unit)), ("ref+ref", (prop, op, REF, REF))]
    if op == "is_between":
        return [("plain+plain", (prop, op, PLAIN[kind], PLAIN[kind])), ("ref+ref", (prop, op, REF, REF))]
    # Durations count calendar units, file sizes byte-count units; the unit may be a reference too.
    if kind == "duration":
        return [("number+unit", (prop, op, 5, next(u for u, c in CALENDAR_UNITS.items() if not units or c in units))), ("ref+ref", (prop, op, REF, REF))]
    if kind == "fileSize":
        return [("number+unit", (prop, op, 5, "MB")), ("ref+ref", (prop, op, REF, REF))]
    # An enumeration takes one of its choices (any string when the engine lists none) or a reference.
    if kind in ("enumeration", "enumCase"):
        return [("plain", (prop, op, choices[0] if choices else "x")), ("ref", (prop, op, REF))]
    return [("plain", (prop, op, PLAIN[kind])), ("ref", (prop, op, REF))] + ([("text+ref", (prop, op, text("Hi ", REF)))] if kind in ("text", "email", "phone", "contactHandle") else [])


def with_bounded(identifier, rows):
    """A Find action that needs a bounded date row (BOUNDED_FILTERS) gets one added to every case that lacks it."""
    b = BOUNDED_FILTERS.get(identifier)
    if not b or any(r[0] == b["property"] and FILTER_OPERATORS[r[1]] in b["operators"] for r in rows):
        return rows
    return [*rows, (b["property"], "is_in_the_next", 7, "days")]


for identifier, props in FILTERS.items():
    first = []
    for prop, p in props.items():
        for code in p["operators"]:
            forms = row_forms(prop, OPERATOR_NAME[code], p["values"], p.get("units", []), p.get("choices", []))
            if len(first) < list(props).index(prop) + 1:
                first.append(forms[0][1])
            for form, row in forms:
                a = Shortcut("Case").action(identifier, WFContentItemFilter=where(*with_bounded(identifier, [row])))
                filter_cases.append({"identifier": identifier, "form": f"{prop} {OPERATOR_NAME[code]} {form}", "filter": a["WFWorkflowActionParameters"]["WFContentItemFilter"]})
    a = Shortcut("Case").action(identifier, WFContentItemFilter=where_any(*with_bounded(identifier, first)))
    filter_cases.append({"identifier": identifier, "form": "any of each property", "filter": a["WFWorkflowActionParameters"]["WFContentItemFilter"]})

property_cases = []
producers = Shortcut("Producers")
for entity, props in ENTITY_PROPERTIES.items():
    by = entity if entity in ACTIONS else next((i for i, a in ACTIONS.items() if entity in a["outputTypes"]), None)
    if by is None:
        continue
    a = producers.action(by)
    for name in props:
        property_cases.append({"entity": entity, "property": name, "attachment": property_(a, name)})

s = Shortcut("Blocks", color="Teal", types=["ActionExtension"], input_classes=["WFSafariWebPageContentItem", "WFURLContentItem"])
got = s.action(actions.GETSTOREDCONTENT, WFStoredContentKey="k")
c = s.if_(ref(got), "has_any_value")
loop = s.repeat_each(ref(got))
s.action(actions.DOWNLOADURL, WFURL=repeat_item())
results = s.end_repeat_each(loop)
s.action(actions.PREVIEWDOCUMENT, WFInput=ref(results))
s.otherwise(c)
n = s.repeat_count(3)
s.action(actions.SHOWRESULT, Text=text("tick ", repeat_item()))
s.end_repeat_count(n)
s.end_if(c)
c2 = s.if_(ref(got), "is", "hello"); s.action(actions.SHOWRESULT, Text=text("is")); s.end_if(c2)
c3 = s.if_(ref(got), "less_than", 5); s.action(actions.SHOWRESULT, Text=text("lt")); s.end_if(c3)
c4 = s.if_(shortcut_input(), "contains", "x"); s.action(actions.SHOWRESULT, Text=text("has")); s.otherwise(c4); s.end_if(c4)
m = s.choose_from_menu("Pick", ["A", "B"])
s.menu_item(m, "A"); s.action(actions.SHOWRESULT, Text=ref(got))
s.menu_item(m, "B"); s.action(actions.SHOWRESULT, Text=shortcut_input())
s.end_menu(m)
s.action(actions.NOTES_CREATE_NOTE, name="n", contents=text("c ", ref(got)))
found = s.action("com.apple.MobileSMS.MessageEntity", WFContentItemFilter=where(("date", "is_in_the_last", 7, "days"), ("author", "is", ref(got))))
each = s.repeat_each(ref(found))
s.action(actions.SHOWRESULT, Text=text(property_(repeat_item(), "body"), " ", property_(found, "date")))
s.end_repeat_each(each)
shortcuts = [{"name": "Blocks", "plist": s.to_plist(), "actionCount": len(s.actions)}]

def dates(o):
    """Dates cross JSON as {"$date": ...} (whole seconds, UTC), as fixture.ts writes them; the library already made them naive UTC."""
    if isinstance(o, datetime.datetime):
        return {"$date": o.strftime("%Y-%m-%dT%H:%M:%SZ")}
    raise TypeError(type(o).__name__)


json.dump({"cases": cases, "filterCases": filter_cases, "propertyCases": property_cases, "shortcuts": shortcuts}, open(sys.argv[1], "w"), indent=1, ensure_ascii=False, default=dates)
print(len(cases), "parameter cases across", len({c["identifier"] for c in cases}), "actions;", len(filter_cases), "filters across", len(FILTERS), "Find actions;",
      len(property_cases), "properties;", len(shortcuts), "whole shortcuts ->", sys.argv[1])
