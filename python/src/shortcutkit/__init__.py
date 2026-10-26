#!/usr/bin/env python3
"""shortcutkit: build, validate and sign Apple Shortcuts files from Python.

The file format is the one Shortcuts.app uses (verified against Apple's gallery
workflows in WorkflowKit and against this Mac's library). Actions and parameter keys
are validated against _builtin-actions.json produced by extract-builtin-actions.sh.

    from shortcutkit import Shortcut, ref, text, ask, shortcut_input, clipboard, variable

    s = Shortcut("Demo", color="Teal", glyph=0xF000)
    stored = s.action("is.workflow.actions.setstoredcontent",
                      WFInput="hello", WFStoredContentKey="greeting", WFStoredContentGlobalValue=False)
    got = s.action("is.workflow.actions.getstoredcontent", WFStoredContentKey="greeting")
    s.action("is.workflow.actions.showresult", Text=text("Stored: ", ref(got)))
    s.write("Demo.shortcut")            # unsigned plist
    s.sign("Demo.shortcut", "Demo-signed.shortcut")   # runs `shortcuts sign --mode anyone`

Command line:  python -m shortcutkit demo OUT.shortcut   (writes and signs the demo above)

Value helpers return the exact structures WorkflowKit's state classes serialize:
  ref(action)        WFTextTokenAttachment  -> that action's output
  variable("Name")   WFTextTokenAttachment  -> a named variable
  shortcut_input()   WFTextTokenAttachment  -> the shortcut's input
  clipboard()        WFTextTokenAttachment  -> clipboard
  current_date()     WFTextTokenAttachment  -> current date
  ask("Prompt")      WFTextTokenAttachment  -> ask each time
  text("a ", ref(x)) WFTextTokenString      -> text with embedded references
  subject(att)       {"Type": "Variable", "Variable": att}  (the If condition's subject; pickers take the bare attachment)
  property_(x, "body")  a reference to one property of x (a WFPropertyVariableAggrandizement)
  where(row, ...)    Find conditions, encoded by action() for the Find action's entity
Plain str / int / float / bool / list / datetime are written as-is.
"""
import copy
import datetime
import functools
import json
import pathlib
import plistlib
import subprocess
import sys
import uuid

HERE = pathlib.Path(__file__).resolve().parent
DEFINITIONS = HERE / "data" / "builtin-actions.json"


@functools.lru_cache(maxsize=None)
def _load_definitions(path):
    """The definitions file, parsed once per path; {} when it is absent."""
    path = pathlib.Path(path)
    return json.loads(path.read_text()) if path.exists() else {}

# WFWorkflowIcon.backgroundColorValue for palette colors 0-14, as the unsigned 32-bit
# value the plist stores. Names follow Shortcuts' picker order.
ICON_COLORS = {
    "Red": 4282601983, "DarkOrange": 4251333119, "Orange": 4271458815, "Yellow": 4274264319,
    "Green": 4292093695, "Teal": 431817727, "LightBlue": 1440408063, "Blue": 463140863,
    "DarkBlue": 946986751, "Violet": 2071128575, "Purple": 3679049983, "Pink": 3980825855,
    "Taupe": 255, "Gray": 3031607807, "DarkGray": 2846468607,
}
DEFAULT_GLYPH = 61440  # +[WFWorkflowIcon defaultGlyphCharacter]

# Legacy WFCondition codes for is.workflow.actions.conditional. Shortcuts still reads these
# and migrates them to the modern WFConditions template on load. Each code's meaning is the
# engine's own (filterOperators in data/encoding-table.json).
CONDITION = {
    "less_than": 0,
    "less_or_equal": 1,
    "greater_than": 2,
    "greater_or_equal": 3,
    "is": 4,
    "is_not": 5,
    "begins_with": 8,
    "ends_with": 9,
    "contains": 99,
    "has_any_value": 100,
    "has_no_value": 101,
    "does_not_contain": 999,
    "is_between": 1003,
}


# Keys Shortcuts still accepts on load even though the current definition no longer lists
# them. Legacy If: single condition on WFInput, migrated to WFConditions by the app.
LEGACY_KEYS = {
    "is.workflow.actions.conditional": {"WFInput", "WFCondition", "WFConditionalActionString", "WFNumberValue",
                                        "WFConditionalLegacyComparisonBehavior", "WFEnumerationValue", "WFBooleanValue",
                                        "WFDate", "WFAnotherDate", "WFDuration", "WFConditions"},
    "is.workflow.actions.choosefrommenu": {"WFMenuPrompt", "WFMenuItems", "WFMenuItemTitle", "WFMenuItemAttributedTitle"},
}


def _is_reference(value):
    """Attachments, token strings and picker wrappers are accepted wherever a plain value is."""
    return isinstance(value, dict) and ("WFSerializationType" in value or value.get("Type") == "Variable")


def _check_kind(kind, value):
    """Run-time counterpart of the TypeScript ParamTypes: returns a problem string or None."""
    if _is_reference(value):
        return None
    if kind == "bool" and not isinstance(value, bool):
        return f"expected a bool or a reference, got {type(value).__name__}"
    if kind in ("number", "plainNumber") and (isinstance(value, bool) or not isinstance(value, (int, float))):
        return f"expected a number{'' if kind == 'plainNumber' else ' or a reference'}, got {type(value).__name__}"
    if kind in ("string", "text", "plainString") and not isinstance(value, str):
        return f"expected a string{'' if kind == 'plainString' else ' or a reference'}, got {type(value).__name__}"
    if kind == "picker":
        return "expected a reference (ref(), variable(), shortcut_input(), ...)"
    if kind == "subject" and not (isinstance(value, dict) and value.get("Type") == "Variable" and "Variable" in value):
        return "expected a reference or subject(<reference>)"
    return None


def _attachment(value):
    return {"WFSerializationType": "WFTextTokenAttachment", "Value": value}


def ref(action, output_name=None):
    """Another action's output. `action` is what Shortcut.action() returned."""
    return _attachment({"Type": "ActionOutput", "OutputUUID": action["WFWorkflowActionParameters"]["UUID"],
                        "OutputName": output_name or action.get("_outputName", "Output")})


def variable(name):
    """A named variable, as set by Set Variable or Add to Variable."""
    return _attachment({"Type": "Variable", "VariableName": name})


def shortcut_input():
    """The shortcut's input, from the share sheet, Quick Actions, or Run Shortcut."""
    return _attachment({"Type": "ExtensionInput"})


def clipboard():
    """The clipboard's contents."""
    return _attachment({"Type": "Clipboard"})


def current_date():
    """The date and time the shortcut runs."""
    return _attachment({"Type": "CurrentDate"})


def ask(prompt=None):
    """A value the user is asked for each time the shortcut runs."""
    return _attachment({"Type": "Ask", **({"Prompt": prompt} if prompt else {})})


def device_details():
    """Device Details (name, model, OS version, ...); the app usually adds a property aggrandizement."""
    return _attachment({"Type": "DeviceDetails"})


def current_app():
    """The app the shortcut was run from."""
    return _attachment({"Type": "CurrentApp"})


def _reference_types(value):
    """The variable types (Ask, ActionOutput, Variable, ...) referenced anywhere in a value."""
    if not isinstance(value, dict):
        return []
    if value.get("WFSerializationType") == "WFTextTokenAttachment":
        return [str(value.get("Value", {}).get("Type"))]
    if value.get("WFSerializationType") == "WFTextTokenString":
        return [str(a.get("Type")) for a in value.get("Value", {}).get("attachmentsByRange", {}).values()]
    if value.get("Type") == "Variable" and isinstance(value.get("Variable"), dict):
        return _reference_types(value["Variable"])
    return []


def repeat_item():
    """The current item inside a Repeat with Each block."""
    return _attachment({"Type": "Variable", "VariableName": "Repeat Item"})


def repeat_index():
    """The current index (1-based) inside a Repeat block."""
    return _attachment({"Type": "Variable", "VariableName": "Repeat Index"})


def subject(attachment):
    """The If-subject form of a reference. if_() and action() apply it for you."""
    return {"Type": "Variable", "Variable": attachment}


def property_(source, name):
    """One property of an action's output or of any reference, as the editor's property picker writes
    it (a WFPropertyVariableAggrandizement): property_(found, "body"), property_(repeat_item(), "date").
    Given an action whose output is one of Apple's entity types, the name must be one of its
    properties (ENTITY_PROPERTIES)."""
    if not _is_reference(source):
        entities = [t for t in source.get("_outputTypes", []) if t in ENTITY_PROPERTIES]
        known = {p for e in entities for p in ENTITY_PROPERTIES[e]}
        if entities and name not in known:
            raise ValueError(f"{' / '.join(entities)} has no property {name}; it has {', '.join(sorted(known))}")
        source = ref(source)
    prior = source["Value"].get("Aggrandizements")
    return _attachment({**source["Value"], "Aggrandizements": [*(prior if isinstance(prior, list) else []), {"Type": "WFPropertyVariableAggrandizement", "PropertyName": name}]})


def where(*rows):
    """Find conditions that must all hold. Each row is (property, operator, *values), checked against
    the Find action's FILTERS entry by action(): where(("date", "is_in_the_last", 7, "days"), ("author", "is", ref(contact)))."""
    return {"match": "all", "rows": [tuple(r) for r in rows]}


def where_any(*rows):
    """Find conditions of which any one must hold; rows as for where()."""
    return {"match": "any", "rows": [tuple(r) for r in rows]}


def _is_where(value):
    return isinstance(value, dict) and set(value) == {"match", "rows"} and value["match"] in ("all", "any")


def _encode_filter(identifier, w):
    """Encode where() rows for a Find action: each value goes under the row key its kind uses (see docs/shortcut-file-format.md)."""
    table = FILTERS.get(identifier)
    if table is None:
        raise ValueError(f"{identifier}: where() rows need a Find action with typed filters (FILTERS); pass a WFContentPredicateTableTemplate here")
    rows = []
    for row in w["rows"]:
        prop, op, *args = row
        p = table.get(prop)
        if p is None:
            raise ValueError(f"{identifier}: no filterable property {prop}; filterable: {', '.join(table)}")
        at = f"{identifier} {prop} {op}"
        offered = [n for n, c in FILTER_OPERATORS.items() if c in p["operators"]]
        if op not in offered:
            raise ValueError(f"{identifier} {prop}: no operator {op}; offered: {', '.join(offered)}")
        arity = 0 if op == "is_today" else 2 if op in ("is_between", "is_in_the_last", "is_in_the_next") or p["values"] in ("duration", "fileSize") else 1
        if len(args) != arity:
            raise ValueError(f"{at}: takes {arity} value(s), got {len(args)}")
        rows.append({"Property": prop, "Operator": FILTER_OPERATORS[op], "Removable": True, "Values": _row_values(at, p, op, args)})
    # Some Find actions need a bounded date row (Find Calendar Events: Start Date in a range), or the engine
    # replaces the whole filter with its default; the row is marked Bounded, and the filter says it has one.
    bounded = BOUNDED_FILTERS.get(identifier)
    has_bounded = False
    if bounded:
        for r in rows:
            if r["Property"] == bounded["property"] and r["Operator"] in bounded["operators"]:
                r["Bounded"] = True
                has_bounded = True
        if not has_bounded:
            names = [n for n, c in FILTER_OPERATORS.items() if c in bounded["operators"]]
            raise ValueError(f"{identifier}: needs a {bounded['property']} row with one of {', '.join(names)} (the engine replaces a filter without one with its default)")
    return {"WFSerializationType": "WFContentPredicateTableTemplate",
            "Value": {"WFActionParameterFilterPrefix": 1 if w["match"] == "all" else 0, "WFContentPredicateBoundedDate": has_bounded, "WFActionParameterFilterTemplates": rows}}


def _is_attachment(v):
    return isinstance(v, dict) and v.get("WFSerializationType") == "WFTextTokenAttachment"


def _row_values(at, p, op, args):
    def check(ok, v, what):
        if not ok:
            raise ValueError(f"{at}: expected {what}, got {v!r}")

    def one(v, kind):
        if kind == "number":
            check(_is_attachment(v) or (isinstance(v, (int, float)) and not isinstance(v, bool)), v, "a number or a reference")
            return "Number", v
        if kind == "bool":
            check(_is_attachment(v) or isinstance(v, bool), v, "a boolean or a reference")
            return "Bool", v
        if kind == "date":
            check(_is_attachment(v) or isinstance(v, datetime.datetime), v, "a datetime or a reference")
            return "Date", v if _is_attachment(v) else _utc(v)
        if kind in ("enumeration", "enumCase"):
            # An enumeration's state class holds one of the property's choices or a reference (a bare reference is read as a different state class).
            check(isinstance(v, str) or _is_attachment(v), v, "a string or a reference" if kind == "enumeration" else "a case identifier or a reference")
            state = "WFStringSubstitutableState" if kind == "enumeration" else "WFLinkEnumerationSubstitutableState"
            return "Enumeration", {"WFSerializationType": state, "Value": v}
        if kind in ("text", "email", "phone", "contactHandle"):
            is_token = isinstance(v, dict) and v.get("WFSerializationType") == "WFTextTokenString"
            check(isinstance(v, str) or is_token or _is_attachment(v), v, "a string, text() or a reference")
            # The engine drops a bare reference in a text row; it reads the token string the editor writes.
            t = text(v) if _is_attachment(v) else v
            # The key follows the property's value class: Email for email addresses, Phone for phone numbers, String for the rest.
            if kind == "text":
                return "String", t
            if kind == "email":
                return "Email", t
            if kind == "phone":
                return "Phone", t
            # A handle is wrapped in its state class, holding the plain string when there is no reference in it (as the engine writes it).
            plain = t if isinstance(t, str) else None if t["Value"]["attachmentsByRange"] else t["Value"]["string"]
            return "ContactHandle", {"WFSerializationType": "WFTokenStringParameterState", "Value": t if plain is None else plain}
        raise ValueError(f"{at}: no row key for values of kind {kind}")

    if op == "is_today":
        return {}
    if op in ("is_in_the_last", "is_in_the_next"):
        n, unit = args
        check(_is_attachment(n) or (isinstance(n, (int, float)) and not isinstance(n, bool)), n, "a number or a reference")
        units = [u for u, c in CALENDAR_UNITS.items() if c in p.get("units", [])]
        check(_is_attachment(unit) or unit in units, unit, f"a reference or one of {', '.join(units)}")
        return {"Number": n, "Unit": unit if _is_attachment(unit) else CALENDAR_UNITS[unit]}
    if op == "is_between":
        return {"Date": one(args[0], p["values"])[1], "AnotherDate": one(args[1], p["values"])[1]}
    # Durations compare a number of calendar units (Unit, an NSCalendarUnit); file sizes a number of byte-count units.
    if p["values"] in ("duration", "fileSize"):
        n, unit = args
        check(_is_attachment(n) or (isinstance(n, (int, float)) and not isinstance(n, bool)), n, "a number or a reference")
        table = CALENDAR_UNITS if p["values"] == "duration" else BYTE_COUNT_UNITS
        units = [u for u, c in table.items() if not p.get("units") or c in p["units"]]
        check(_is_attachment(unit) or unit in units, unit, f"a reference or one of {', '.join(units)}")
        return {"Number": n, ("Unit" if p["values"] == "duration" else "ByteCountUnit"): unit if _is_attachment(unit) else table[unit]}
    k, v = one(args[0], p["values"])
    return {k: v}


def _utc(d):
    """A datetime as plistlib writes it: naive, in UTC, whole seconds. Naive input is taken to be UTC already."""
    if d.tzinfo is not None:
        d = d.astimezone(datetime.timezone.utc).replace(tzinfo=None)
    return d.replace(microsecond=0)


def picker(attachment):
    """Deprecated, misnamed: this is the If-subject form. Pass a bare reference to picker parameters."""
    """Wrap an attachment for WFVariablePickerParameter keys (e.g. WFInput on Repeat with Each)."""
    return {"Type": "Variable", "Variable": attachment}


def text(*parts):
    """Text with references in it: text("Hello, ", ref(name), "!")."""
    string = ""
    attachments = {}
    for part in parts:
        if isinstance(part, dict) and part.get("WFSerializationType") == "WFTextTokenAttachment":
            # NSRange offsets are UTF-16 code units, not code points.
            attachments[f"{{{len(string.encode('utf-16-le')) // 2}, 1}}"] = part["Value"]
            string += "￼"
        else:
            string += str(part)
    return {"WFSerializationType": "WFTextTokenString", "Value": {"string": string, "attachmentsByRange": attachments}}


class Shortcut:
    """A shortcut. Add actions, then write() and sign(); Shortcuts names the import after the file,
    which defaults to <name>.shortcut."""

    def __init__(self, name, color="Blue", glyph=DEFAULT_GLYPH, input_classes=None, types=None, definitions=DEFINITIONS):
        """color: a palette name ("Teal") or a raw value. glyph: a codepoint from Shortcuts' icon font.
        types: where the shortcut appears: "ActionExtension" (share sheet), "QuickActions" (Finder and
        Services menus), "MenuBar", "NCWidget", "WatchKit", "Sleep", "ReceivesOnScreenContent".
        input_classes: content item classes it accepts as input."""
        self.name = name
        self.color = ICON_COLORS[color] if isinstance(color, str) else color
        self.glyph = glyph
        self.input_classes = input_classes or []
        self.types = list(types or [])
        self.actions = []
        self.defs = _load_definitions(definitions)

    def action(self, identifier, /, **params):
        """Append an action and return it; ref() it to use its output. Catalog identifiers are
        checked: unknown keys, wrong value kinds, and unreadable references raise ValueError. Other
        identifiers pass through unchecked. `identifier` is positional-only, so a parameter can
        have that name."""
        definition = self.defs.get(identifier)
        catalog = ACTIONS.get(identifier) or {}
        descriptor = catalog.get("descriptor")
        if self.defs and definition is None and not catalog and identifier.startswith("is.workflow."):
            raise ValueError(f"unknown built-in action {identifier}")
        if definition or descriptor:
            known = {p.get("Key") for p in (definition or {}).get("Parameters", []) if isinstance(p, dict)}
            known |= {"UUID", "GroupingIdentifier", "WFControlFlowMode", "CustomOutputName"}
            known |= LEGACY_KEYS.get(identifier, set())
            known |= set(catalog.get("params", []))
            if descriptor:
                known.add("AppIntentDescriptor")
            inp = (definition or {}).get("Input")
            if isinstance(inp, dict) and inp.get("ParameterKey"):
                known.add(inp["ParameterKey"])
            unknown = set(params) - known
            if unknown and known - {"UUID", "GroupingIdentifier", "WFControlFlowMode", "CustomOutputName"}:
                raise ValueError(f"{identifier}: unknown parameter(s) {sorted(unknown)}; known: {sorted(known)}")
        kinds = PARAM_KINDS.get(identifier, {})
        restricted = PARAM_VARIABLE_TYPES.get(identifier, {})
        for key, value in params.items():
            if _is_where(value) and kinds.get(key) != "filter":
                raise ValueError(f"{identifier}.{key}: where() rows go only in a Find action's WFContentItemFilter")
            problem = _check_kind(kinds.get(key, "any"), value)
            if problem:
                raise ValueError(f"{identifier}.{key}: {problem}")
            # Keys the engine reads no reference for (or only Ask): the same rule as the TypeScript types, at run time.
            if key in restricted:
                bad = [t for t in _reference_types(value) if t not in restricted[key]]
                if bad:
                    raise ValueError(f"{identifier}.{key}: the engine does not read a {'/'.join(bad)} reference here (it reads {', '.join(restricted[key]) if restricted[key] else 'only a plain value'})")
        # Text parameters never hold a bare attachment: the engine writes a lone variable as a
        # token string with one placeholder. Wrap it so ref() works for text keys too.
        params = {k: (text(v) if kinds.get(k) == "text" and _is_reference(v) and v.get("WFSerializationType") == "WFTextTokenAttachment"
                      else subject(v) if kinds.get(k) == "subject" and _is_reference(v) and v.get("WFSerializationType") == "WFTextTokenAttachment"
                      else _encode_filter(identifier, v) if _is_where(v) else v)
                  for k, v in params.items()}
        # App Intents actions carry a descriptor naming the app that provides them.
        head = {"UUID": str(uuid.uuid4()).upper()}
        if descriptor and "AppIntentDescriptor" not in params:
            head["AppIntentDescriptor"] = dict(descriptor, ActionRequiresAppInstallation=True)
        entry = {"WFWorkflowActionIdentifier": identifier,
                 "WFWorkflowActionParameters": {**head, **params}}
        output = (definition or {}).get("Output", {})
        entry["_outputName"] = (output.get("OutputName") if isinstance(output, dict) else None) or catalog.get("output")
        entry["_outputTypes"] = list(catalog.get("outputTypes") or (output.get("Types") if isinstance(output, dict) else []) or [])
        if isinstance(entry["_outputName"], dict):
            entry["_outputName"] = entry["_outputName"].get("format")
        self.actions.append(entry)
        return entry

    # Control flow: each block is a group sharing a GroupingIdentifier, with
    # WFControlFlowMode 0 = start, 1 = middle (Otherwise / menu item), 2 = end.
    @staticmethod
    def _subject(value):
        return value if isinstance(value, dict) and value.get("Type") == "Variable" and "Variable" in value else subject(value)

    def if_(self, subject, condition, value=None):
        """Open an If block on `subject`. `condition` is a CONDITION name or code; `value` is what it
        compares with, if anything. Returns the id for otherwise() and end_if()."""
        gid = str(uuid.uuid4()).upper()
        params = {"GroupingIdentifier": gid, "WFControlFlowMode": 0, "WFInput": self._subject(subject),
                  "WFCondition": CONDITION[condition] if isinstance(condition, str) else condition}
        if isinstance(value, (int, float)) and not isinstance(value, bool):
            params["WFNumberValue"] = value
        elif value is not None:
            params["WFConditionalActionString"] = value
        self.action("is.workflow.actions.conditional", **params)
        return gid

    def otherwise(self, gid):
        """Start the Otherwise branch of If block `gid`."""
        self.action("is.workflow.actions.conditional", GroupingIdentifier=gid, WFControlFlowMode=1)

    def end_if(self, gid):
        """Close If block `gid`."""
        self.action("is.workflow.actions.conditional", GroupingIdentifier=gid, WFControlFlowMode=2)

    def repeat_each(self, items):
        """Open a Repeat with Each block over `items`; returns the id for end_repeat_each(). Inside,
        use repeat_item() and repeat_index()."""
        gid = str(uuid.uuid4()).upper()
        self.action("is.workflow.actions.repeat.each", GroupingIdentifier=gid, WFControlFlowMode=0, WFInput=items)
        return gid

    def end_repeat_each(self, gid):
        """Close a Repeat with Each block and return it; ref() it for the Repeat Results."""
        a = self.action("is.workflow.actions.repeat.each", GroupingIdentifier=gid, WFControlFlowMode=2)
        a["_outputName"] = "Repeat Results"
        return a

    def repeat_count(self, count):
        """Open a Repeat block that runs `count` times; returns the id for end_repeat_count()."""
        gid = str(uuid.uuid4()).upper()
        self.action("is.workflow.actions.repeat.count", GroupingIdentifier=gid, WFControlFlowMode=0, WFRepeatCount=count)
        return gid

    def end_repeat_count(self, gid):
        """Close a Repeat block and return it; ref() it for the Repeat Results."""
        a = self.action("is.workflow.actions.repeat.count", GroupingIdentifier=gid, WFControlFlowMode=2)
        a["_outputName"] = "Repeat Results"
        return a

    def choose_from_menu(self, prompt, items):
        """Open a Choose from Menu block; returns the id for menu_item() and end_menu(). Follow with
        one menu_item() per title, in order, each followed by that branch's actions."""
        gid = str(uuid.uuid4()).upper()
        self.action("is.workflow.actions.choosefrommenu", GroupingIdentifier=gid, WFControlFlowMode=0, WFMenuPrompt=prompt, WFMenuItems=list(items))
        return gid

    def menu_item(self, gid, title):
        """Start the branch for `title` in menu `gid`."""
        self.action("is.workflow.actions.choosefrommenu", GroupingIdentifier=gid, WFControlFlowMode=1, WFMenuItemTitle=title)

    def end_menu(self, gid):
        """Close menu `gid`."""
        self.action("is.workflow.actions.choosefrommenu", GroupingIdentifier=gid, WFControlFlowMode=2)

    def to_plist(self):
        """The shortcut as a plist dictionary."""
        actions = []
        for a in self.actions:
            actions.append({k: v for k, v in a.items() if not k.startswith("_")})
        return {
            "WFWorkflowClientVersion": "4018.0.4",
            "WFWorkflowMinimumClientVersion": 900,
            "WFWorkflowMinimumClientVersionString": "900",
            "WFWorkflowIcon": {"WFWorkflowIconStartColor": self.color, "WFWorkflowIconGlyphNumber": self.glyph},
            "WFWorkflowTypes": self.types,
            "WFQuickActionSurfaces": [],
            "WFWorkflowInputContentItemClasses": self.input_classes,
            "WFWorkflowOutputContentItemClasses": [],
            "WFWorkflowImportQuestions": [],
            "WFWorkflowHasShortcutInputVariables": any(
                json.dumps(a, default=str).find('"ExtensionInput"') >= 0 for a in actions),
            "WFWorkflowHasOutputFallback": False,
            "WFWorkflowActions": actions,
        }

    def write(self, path=None):
        """Write the unsigned file, <name>.shortcut by default, and return its path."""
        path = pathlib.Path(path) if path else pathlib.Path(f"{self.name}.shortcut")
        with open(path, "wb") as f:
            plistlib.dump(self.to_plist(), f, fmt=plistlib.FMT_BINARY)
        return path

    @staticmethod
    def sign(src, dst, mode="anyone"):
        """Sign `src` into `dst`, which Shortcuts will import, and return `dst`. Needs a Mac with an
        iCloud login."""
        subprocess.run(["shortcuts", "sign", "--mode", mode, "--input", str(src), "--output", str(dst)], check=True)
        return dst


def get_action(identifier, definitions=DEFINITIONS):
    """What the catalog knows about any identifier, built-in or App Intent: name, params, kinds,
    output, descriptor (App Intents), and definition (built-ins)."""
    entry = ACTIONS.get(identifier)
    if entry is None:
        return None
    out = {"identifier": identifier, "name": entry["name"], "params": list(entry["params"]),
           "kinds": dict(PARAM_KINDS.get(identifier, {})), "output": entry.get("output"), "outputTypes": list(entry.get("outputTypes", []))}
    if entry.get("descriptor"):
        out["descriptor"] = entry["descriptor"]
    defs = _load_definitions(definitions) if definitions else {}
    if identifier in defs:
        out["definition"] = copy.deepcopy(defs[identifier])
    return out


def demo(out):
    out = pathlib.Path(out)
    s = Shortcut(out.stem, color="Teal")
    stored = s.action("is.workflow.actions.setstoredcontent", WFInput="hello from python",
                      WFStoredContentKey="demo-greeting", WFStoredContentGlobalValue=False)
    got = s.action("is.workflow.actions.getstoredcontent", WFStoredContentKey="demo-greeting")
    gid = s.if_(ref(got), "has_any_value")
    s.action("is.workflow.actions.showresult", Text=text("Stored value: ", ref(got)))
    s.otherwise(gid)
    s.action("is.workflow.actions.showresult", Text=text("Nothing stored"))
    s.end_if(gid)
    unsigned = pathlib.Path(out).with_suffix(".unsigned.shortcut")
    s.write(unsigned)
    s.sign(unsigned, out)
    print(f"wrote {out} ({len(s.actions)} actions)")


from . import actions  # noqa: E402  (generated identifier constants and ACTIONS metadata)
from .actions import ACTIONS, PARAM_KINDS, PARAM_CHOICES, PARAM_VARIABLE_TYPES  # noqa: E402
from .entities import FILTERS, FILTER_OPERATORS, CALENDAR_UNITS, BYTE_COUNT_UNITS, BOUNDED_FILTERS, ENTITY_PROPERTIES  # noqa: E402  (generated Find filters and entity properties)

PROVENANCE = json.load(open(HERE / "data" / "provenance.json")) if (HERE / "data" / "provenance.json").exists() else {}
"""Which macOS and Shortcuts build the bundled data was extracted from."""

__all__ = ["actions", "ACTIONS", "PARAM_KINDS", "PARAM_CHOICES", "PARAM_VARIABLE_TYPES", "PROVENANCE", "get_action", "repeat_item", "repeat_index", "subject", "Shortcut", "ref", "variable", "shortcut_input", "clipboard", "current_date", "ask", "device_details", "current_app", "picker", "text",
           "property_", "where", "where_any", "FILTERS", "FILTER_OPERATORS", "CALENDAR_UNITS", "BYTE_COUNT_UNITS", "BOUNDED_FILTERS", "ENTITY_PROPERTIES",
           "ICON_COLORS", "CONDITION", "DEFAULT_GLYPH", "LEGACY_KEYS", "demo"]
__version__ = "2.0.0"
