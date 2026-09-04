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
  picker(att)        {"Type": "Variable", "Variable": att}  (variable-picker parameters)
Plain str / int / float / bool / list are written as-is.
"""
import json
import pathlib
import plistlib
import subprocess
import sys
import uuid

HERE = pathlib.Path(__file__).resolve().parent
DEFINITIONS = HERE / "data" / "builtin-actions.json"

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
# and migrates them to the modern WFConditions template on load. Codes marked (v) were
# verified against shortcuts on this Mac or Apple's gallery; the rest follow the same
# enumeration as documented by the community (shortcuts-js, Cherri).
CONDITION = {
    "less_than": 0,            # (v) numbers
    "less_or_equal": 1,
    "greater_than": 2,         # (v) numbers
    "greater_or_equal": 3,
    "is": 4,
    "is_not": 5,
    "begins_with": 8,
    "ends_with": 9,
    "contains": 99,            # (v) as filter Operator in the gallery
    "has_any_value": 100,      # (v) supportedComparisonOperators of every subject state
    "has_no_value": 101,       # (v)
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
        return "expected picker(<attachment>) or an attachment"
    return None


def _attachment(value):
    return {"WFSerializationType": "WFTextTokenAttachment", "Value": value}


def ref(action, output_name=None):
    """Reference another action's output. `action` is the dict returned by Shortcut.action()."""
    return _attachment({"Type": "ActionOutput", "OutputUUID": action["WFWorkflowActionParameters"]["UUID"],
                        "OutputName": output_name or action.get("_outputName", "Output")})


def variable(name):
    return _attachment({"Type": "Variable", "VariableName": name})


def shortcut_input():
    return _attachment({"Type": "ExtensionInput"})


def clipboard():
    return _attachment({"Type": "Clipboard"})


def current_date():
    return _attachment({"Type": "CurrentDate"})


def ask(prompt=None):
    return _attachment({"Type": "Ask", **({"Prompt": prompt} if prompt else {})})


def picker(attachment):
    """Wrap an attachment for WFVariablePickerParameter keys (e.g. WFInput on Repeat with Each)."""
    return {"Type": "Variable", "Variable": attachment}


def text(*parts):
    """A WFTextTokenString: strings and attachments interleaved. Each attachment becomes U+FFFC."""
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
    def __init__(self, name, color="Blue", glyph=DEFAULT_GLYPH, input_classes=None, definitions=DEFINITIONS):
        self.name = name
        self.color = ICON_COLORS[color] if isinstance(color, str) else color
        self.glyph = glyph
        self.input_classes = input_classes or []
        self.actions = []
        self.defs = json.load(open(definitions)) if pathlib.Path(definitions).exists() else {}

    def action(self, identifier, **params):
        """Append an action. Unknown identifiers or parameter keys raise ValueError."""
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
        for key, value in params.items():
            problem = _check_kind(PARAM_KINDS.get(identifier, {}).get(key, "any"), value)
            if problem:
                raise ValueError(f"{identifier}.{key}: {problem}")
        # App Intents actions carry a descriptor naming the app that provides them.
        head = {"UUID": str(uuid.uuid4()).upper()}
        if descriptor and "AppIntentDescriptor" not in params:
            head["AppIntentDescriptor"] = dict(descriptor, ActionRequiresAppInstallation=True)
        entry = {"WFWorkflowActionIdentifier": identifier,
                 "WFWorkflowActionParameters": {**head, **params}}
        output = (definition or {}).get("Output", {})
        entry["_outputName"] = (output.get("OutputName") if isinstance(output, dict) else None) or catalog.get("output")
        if isinstance(entry["_outputName"], dict):
            entry["_outputName"] = entry["_outputName"].get("format")
        self.actions.append(entry)
        return entry

    # Control flow: each block is a group sharing a GroupingIdentifier, with
    # WFControlFlowMode 0 = start, 1 = middle (Otherwise / menu item), 2 = end.
    def if_(self, subject, condition, value=None):
        gid = str(uuid.uuid4()).upper()
        params = {"GroupingIdentifier": gid, "WFControlFlowMode": 0, "WFInput": picker(subject),
                  "WFCondition": CONDITION[condition] if isinstance(condition, str) else condition}
        if isinstance(value, (int, float)) and not isinstance(value, bool):
            params["WFNumberValue"] = value
        elif value is not None:
            params["WFConditionalActionString"] = value
        self.action("is.workflow.actions.conditional", **params)
        return gid

    def otherwise(self, gid):
        self.action("is.workflow.actions.conditional", GroupingIdentifier=gid, WFControlFlowMode=1)

    def end_if(self, gid):
        self.action("is.workflow.actions.conditional", GroupingIdentifier=gid, WFControlFlowMode=2)

    def repeat_each(self, items):
        """Open a Repeat with Each block; returns the grouping identifier to pass to end_repeat_each()."""
        gid = str(uuid.uuid4()).upper()
        self.action("is.workflow.actions.repeat.each", GroupingIdentifier=gid, WFControlFlowMode=0, WFInput=picker(items))
        return gid

    def end_repeat_each(self, gid):
        self.action("is.workflow.actions.repeat.each", GroupingIdentifier=gid, WFControlFlowMode=2)

    def repeat_count(self, count):
        """Open a Repeat block that runs `count` times; returns the grouping identifier for end_repeat_count()."""
        gid = str(uuid.uuid4()).upper()
        self.action("is.workflow.actions.repeat.count", GroupingIdentifier=gid, WFControlFlowMode=0, WFRepeatCount=count)
        return gid

    def end_repeat_count(self, gid):
        self.action("is.workflow.actions.repeat.count", GroupingIdentifier=gid, WFControlFlowMode=2)

    def choose_from_menu(self, prompt, items):
        """Open a Choose from Menu block. Follow with one menu_item() per title, in order, each with
        the actions of that branch, then end_menu(). Returns the grouping identifier."""
        gid = str(uuid.uuid4()).upper()
        self.action("is.workflow.actions.choosefrommenu", GroupingIdentifier=gid, WFControlFlowMode=0, WFMenuPrompt=prompt, WFMenuItems=list(items))
        return gid

    def menu_item(self, gid, title):
        self.action("is.workflow.actions.choosefrommenu", GroupingIdentifier=gid, WFControlFlowMode=1, WFMenuItemTitle=title)

    def end_menu(self, gid):
        self.action("is.workflow.actions.choosefrommenu", GroupingIdentifier=gid, WFControlFlowMode=2)

    def to_plist(self):
        actions = []
        for a in self.actions:
            actions.append({k: v for k, v in a.items() if not k.startswith("_")})
        return {
            "WFWorkflowClientVersion": "4018.0.4",
            "WFWorkflowMinimumClientVersion": 900,
            "WFWorkflowMinimumClientVersionString": "900",
            "WFWorkflowIcon": {"WFWorkflowIconStartColor": self.color, "WFWorkflowIconGlyphNumber": self.glyph},
            "WFWorkflowTypes": [],
            "WFQuickActionSurfaces": [],
            "WFWorkflowInputContentItemClasses": self.input_classes,
            "WFWorkflowOutputContentItemClasses": [],
            "WFWorkflowImportQuestions": [],
            "WFWorkflowHasShortcutInputVariables": any(
                json.dumps(a).find('"ExtensionInput"') >= 0 for a in actions),
            "WFWorkflowHasOutputFallback": False,
            "WFWorkflowActions": actions,
        }

    def write(self, path=None):
        """Write the unsigned plist. Shortcuts names an imported shortcut after its file, so the
        default file name is the shortcut's name."""
        path = pathlib.Path(path) if path else pathlib.Path(f"{self.name}.shortcut")
        with open(path, "wb") as f:
            plistlib.dump(self.to_plist(), f, fmt=plistlib.FMT_BINARY)
        return path

    @staticmethod
    def sign(src, dst, mode="anyone"):
        subprocess.run(["shortcuts", "sign", "--mode", mode, "--input", str(src), "--output", str(dst)], check=True)
        return dst


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
from .actions import ACTIONS, PARAM_KINDS, PARAM_CHOICES  # noqa: E402

PROVENANCE = json.load(open(HERE / "data" / "provenance.json")) if (HERE / "data" / "provenance.json").exists() else {}
"""Which macOS and Shortcuts build the bundled data was extracted from."""

__all__ = ["actions", "ACTIONS", "PARAM_KINDS", "PARAM_CHOICES", "PROVENANCE", "Shortcut", "ref", "variable", "shortcut_input", "clipboard", "current_date", "ask", "picker", "text",
           "ICON_COLORS", "CONDITION", "DEFAULT_GLYPH", "LEGACY_KEYS", "demo"]
__version__ = "0.5.1"
