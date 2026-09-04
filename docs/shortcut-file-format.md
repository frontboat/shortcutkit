# The .shortcut file format

Everything a generator needs, as verified on macOS 27 against three sources: Apple's own
gallery workflows shipped inside WorkflowKit (dump them locally with `tools/dump-gallery.py`; not committed, they are Apple's content), the shortcuts in
a Mac's own library (`tools/dump-library-encodings.py`), and WorkflowKit's classes asked to
serialize values directly (`data/encoding-table.json`). The package in `src/` implements it.

## 1. Envelope

A binary plist with these top-level keys (all present in every gallery file):

| Key | Type | Notes |
|---|---|---|
| `WFWorkflowActions` | array | the actions, in order |
| `WFWorkflowClientVersion` | string | e.g. `"4018.0.4"`; the library records `4528.0.4.2` and `5037.0.17` for newer saves |
| `WFWorkflowMinimumClientVersion` | int | `900` for anything current; `411` on very old shortcuts |
| `WFWorkflowMinimumClientVersionString` | string | same value as a string |
| `WFWorkflowIcon` | dict | `WFWorkflowIconStartColor` (int, see palette), `WFWorkflowIconGlyphNumber` (int) |
| `WFWorkflowTypes` | array | surfaces: `WatchKit`, `ActionExtension`, `NCWidget`, `MenuBar`, `QuickActions`, `Sleep`, `ReceivesOnScreenContent`; `[]` is normal |
| `WFQuickActionSurfaces` | array | `[]` |
| `WFWorkflowInputContentItemClasses` | array | content item classes accepted as input, e.g. `WFURLContentItem`, `WFStringContentItem`, `WFSafariWebPageContentItem` |
| `WFWorkflowOutputContentItemClasses` | array | usually `[]` |
| `WFWorkflowImportQuestions` | array | usually `[]` |
| `WFWorkflowHasShortcutInputVariables` | bool | true if any action references `ExtensionInput` |
| `WFWorkflowHasOutputFallback` | bool | `false` |
| `WFWorkflowNoInputBehavior` | dict | optional; value `WFWorkflowNoInputBehaviorAskForInput` etc. |

**Icon palette.** `WFWorkflowIconStartColor` is `-[WFWorkflowIcon backgroundColorValue]`, a
32-bit value. Apple writes it signed (gallery: `-2873601`); the library and community files
write it unsigned (`4282601983`). Both load. The 15 palette entries, in picker order:
Red 4282601983, DarkOrange 4251333119, Orange 4271458815, Yellow 4274264319,
Green 4292093695, Teal 431817727, LightBlue 1440408063, Blue 463140863, DarkBlue 946986751,
Violet 2071128575, Purple 3679049983, Pink 3980825855, Taupe 255, Gray 3031607807,
DarkGray 2846468607. Default glyph is 61440 (`+[WFWorkflowIcon defaultGlyphCharacter]`);
glyphs are private-use codepoints from Shortcuts' icon font.

## 2. Actions

Each element of `WFWorkflowActions`:

```
{ "WFWorkflowActionIdentifier": "is.workflow.actions.setstoredcontent",
  "WFWorkflowActionParameters": { "UUID": "…", <parameter key>: <value>, … } }
```

`UUID` is any uppercase UUID; other actions reference this action's output through it.
Built-in identifiers, parameter keys and parameter classes: `data/builtin-actions.json`.
`CustomOutputName` renames the output.

**App-provided actions (App Intents).** Identifier is `<app bundle identifier>.<intent type name>`
(gallery: `com.apple.WritingTools.WritingToolsAppIntentsExtension.SummarizeTextIntent`; Mac:
`com.apple.reminders.TTRCreateReminderAppIntent`). The bundle identifier is the app's even when
the intent is implemented in a framework the app loads, as Reminders' are. Parameters are keyed
by the intent's Swift parameter names (`title`, `isFlagged`). Each value type maps to one of the
built-in parameter classes, so the encodings are the ones in `data/encoding-table.json`:
strings and rich text `WFTextInputParameter` (plain string or `WFTextTokenString`), booleans
`WFSwitchParameter`, numbers `WFNumberFieldParameter`, URLs `WFURLParameter`, dates and date
components `WFDateFieldParameter`, placemarks `WFLocationParameter`, enumerations
`WFLinkEnumerationParameter` (the case identifier as a string: `"high"`, not the title "High"),
entities `WFLinkDynamicOptionsEnumerationParameter` (a dictionary the app understands, or a
variable). `appIntentValueTypes` in the encoding table lists them. Every such action also carries:

```
"AppIntentDescriptor": { "TeamIdentifier": "0000000000", "BundleIdentifier": "com.apple.reminders",
                         "Name": "Reminders", "AppIntentIdentifier": "TTRCreateReminderAppIntent",
                         "ActionRequiresAppInstallation": true }
```

`TeamIdentifier` is ten zeros for Apple's own apps. `data/apple-app-intents.json` lists every
App Intents action of Apple's apps and system components with these fields, read from the
Shortcuts app's own action index (see `docs/extraction.md`); `Shortcut.action()` adds the
descriptor for them. `tools/dump-appintents-actions.py` lists third-party apps' actions on a
Mac (local, not committed, since it depends on the installed apps). Older SiriKit custom
intents use `IntentAppDefinition` instead; interchange (x-callback) actions use the app's own
identifier scheme.

## 3. Parameter values

Which encoding a parameter uses is decided by its state class (`data/parameter-encodings.json`
maps parameter class to state class; `data/encoding-table.json` shows each state class's output).

**Plain.** string, int, real, bool, array of strings. Enumerations are the choice label as a
string. Switches are bools. Steppers are ints.

**Attachment** (`WFTextTokenAttachment`) — a reference resolved at run time:

```
{ "WFSerializationType": "WFTextTokenAttachment", "Value": V }
V = { "Type": "ActionOutput", "OutputUUID": "<UUID of the action>", "OutputName": "<its output name>" }
  | { "Type": "Variable", "VariableName": "MyVar" }
  | { "Type": "ExtensionInput" }            shortcut input
  | { "Type": "Ask", "Prompt": "…" }         ask each time (Prompt optional)
  | { "Type": "Clipboard" } | { "Type": "CurrentDate" } | { "Type": "DeviceDetails" } | { "Type": "CurrentApp" }
```
`V` may also carry `"Aggrandizements": [{"Type": "WFCoercionVariableAggrandizement", "CoercionItemClass": "WFStringContentItem"}]`
to coerce the value, or a property aggrandizement to read a field of it.

**Text with references** (`WFTextTokenString`) — used by text inputs, URLs, dates:

```
{ "WFSerializationType": "WFTextTokenString",
  "Value": { "string": "Hello ￼!", "attachmentsByRange": { "{6, 1}": V } } }
```
Each U+FFFC in `string` is a placeholder; `attachmentsByRange` maps its `{offset, length}` to a `V` as above. The offset is an NSRange location, i.e. counted in UTF-16 code units: `"😀 "` followed by a reference serializes as `{3, 1}`, not `{2, 1}`.
A text parameter never holds a bare attachment: a lone variable is written as a token string
whose `string` is one U+FFFC (`data/encoding-table.json`, `variable:MyVar` under
`WFVariableStringParameterState`, `WFURLStringParameterState`, `WFDateFieldParameterState`).
`Shortcut.action()` wraps a bare `ref()` given for a text key accordingly. Every other
substitutable state takes the bare attachment.

**Variable picker** parameters (`WFVariablePickerParameter`: `WFInput` on Repeat with Each,
Quick Look, Get Images from Input, `WFContentItemInputParameter` on Filter actions, …) take the
bare attachment. The engine's state (`WFVariableParameterState`, `variable:ActionOutput` in
`data/encoding-table.json`), Apple's gallery files and the app's own library all write it that
way; the wrapped form is not read as a connection (the editor shows the empty placeholder).

**If subject.** `WFInput` on `is.workflow.actions.conditional` is a different class (a
conditional-subject parameter) and is the one place the app writes the wrapped form
`{ "Type": "Variable", "Variable": <attachment> }`. `subject()` produces it; `Shortcut.action()`
wraps a bare reference given for that key.

**Substitutable states** (`WF*SubstitutableState`) accept either the plain value or an
attachment in the same slot. This is what lets any text, number, or switch be driven by a
variable.

**Which references a key reads** is decided by the parameter, not the state: the Filter
actions' sort keys (`WFContentItemSortProperty`, `WFContentItemSortOrder`) and a few
enumerations read no attachment at all, variable pickers read every kind except Ask, and some
enumerations read only output, input, variable and Ask references. `reads` in
`data/parameter-encodings.json` lists, per key, the kinds the engine produced a state for when
each was loaded through the action; `PARAM_VARIABLE_TYPES` in both packages carries the keys
that read fewer than all eight, and the TypeScript `ParamTypes` name them
(`Attachment<"ActionOutput" | "ExtensionInput" | …>`).

**Specialised.** Dictionary: `{"WFSerializationType": "WFDictionaryFieldValue", "Value": {"WFDictionaryFieldValueItems": [ {"WFItemType": 0, "WFKey": <token string>, "WFValue": <token string>} … ]}}`.
Quantity: `{"WFSerializationType": "WFQuantityFieldValue", "Value": {"Unit": "min", "Magnitude": …}}`.
Contacts, colors (`WFColorRepresentationType` + components), locations (`{"isCurrentLocation": true}`),
and file bookmarks (`{"bookmarkData", "displayName", "filename"}`) each have their own dictionary; see the examples in `data/encoding-table.json` and the library dump.

## 4. Control flow

Blocks are separate actions sharing a `GroupingIdentifier` (a UUID) with `WFControlFlowMode`:
`0` opens the block, `1` is a middle branch, `2` closes it.

- **If**: `is.workflow.actions.conditional` ×2 or ×3. Mode 0 carries the condition; mode 1 is
  Otherwise; mode 2 is End If. Legacy form (still loaded, and what existing libraries use):
  `WFInput` (variable picker), `WFCondition` (code below), and one of
  `WFConditionalActionString`, `WFNumberValue`, `WFBooleanValue`, `WFDate`/`WFAnotherDate`,
  `WFDuration`, `WFEnumerationValue`. Modern form: a single `WFConditions` value of type
  `WFContentPredicateTableTemplate` (same template shape as filters, below).
- **Repeat with Each**: `is.workflow.actions.repeat.each`, mode 0 with `WFInput` (picker), mode 2.
  Inside, the item is `{"Type": "Variable", "VariableName": "Repeat Item"}` and the index `"Repeat Index"`.
- **Repeat N times**: `is.workflow.actions.repeat.count`, mode 0 with `WFRepeatCount`, mode 2.
- **Choose from Menu**: `is.workflow.actions.choosefrommenu`, mode 0 with `WFMenuPrompt` and
  `WFMenuItems` (array of titles); one mode 1 per item carrying `WFMenuItemTitle`; mode 2.

**Condition codes** (`WFCondition`, and `Operator` in filter templates):

| code | meaning | evidence |
|---|---|---|
| 100 | has any value | `supportedComparisonOperators` on every subject state |
| 101 | does not have any value | same; library |
| 99 | contains | gallery filter "Name contains …" |
| 999 | does not contain | community |
| 4 / 5 | is / is not | community |
| 8 / 9 | begins with / ends with | community (Swift types `BeginsWithStringOperator`, `EndsWithStringOperator` exist) |
| 0 / 1 | is less than / is less than or equal to | library uses 0 with a number |
| 2 / 3 | is greater than / is greater than or equal to | library uses 2 with a number |
| 1003 | is between | community |
| 1002 | is in the next (dates) | gallery: Start Date, Unit 16, Number "7" |
| 1000 / 1001 | is today / is in the last (dates) | community |

The labels for these are not in any strings table on disk; only "is", "contains", "does not
contain", "is before", "is after" appear. Codes marked community come from shortcuts-js and
Cherri and are consistent with every observed use.

**Filter templates** (`WFContentItemFilter` on Filter actions, `WFConditions` on modern If):

```
{ "WFSerializationType": "WFContentPredicateTableTemplate",
  "Value": { "WFActionParameterFilterPrefix": 1,            1 = all conditions, 0 = any
             "WFContentPredicateBoundedDate": false,
             "WFActionParameterFilterTemplates": [
               { "Property": "Name", "Operator": 99, "Removable": true,
                 "Values": { "Unit": 4, "String": <token string> } },
               { "Property": "Start Date", "Operator": 1002, "Removable": false, "Bounded": true,
                 "Values": { "Unit": 16, "Number": "7" } } ] } }
```

## 5. Naming, signing and import

The plist has no name key. Shortcuts names an imported shortcut after the file, so
`Morning Report.shortcut` imports as "Morning Report".

Shortcuts rejects unsigned files. `shortcuts sign --mode anyone --input in.shortcut --output
out.shortcut` wraps the plist in an AEA container (magic `AEA1`). The command requires the Mac
to be signed into iCloud, even in `anyone` mode; on a machine without one (a CI runner, for
instance) it fails with "In order to do this, you must be signed into iCloud." `open out.shortcut` presents
the import sheet; `shortcuts run "<name>"` runs it once added. The Shortcuts app also stores
each library entry's action list as this same plist in `~/Library/Shortcuts/Shortcuts.sqlite`.

**Running from the command line.** `shortcuts run "<name>"` hands whatever flows out of the
last action back to the caller as output, and macOS asks "Allow … to output N items?" the
first time. Always Allow silences it per shortcut. To make a generated shortcut produce no
output at all, end it with `is.workflow.actions.nothing`. Neither prompt appears when the
shortcut runs from the app, Spotlight, or a widget.
