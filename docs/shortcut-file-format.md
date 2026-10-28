# The .shortcut file format

Everything needed to write a `.shortcut` file, verified on macOS 27 against Apple's gallery
workflows, a Mac's Shortcuts library, and WorkflowKit's own serializer
([how](extraction.md)).

## 1. Envelope

A binary plist with these top-level keys (all present in every gallery file):

| Key | Type | Notes |
|---|---|---|
| `WFWorkflowActions` | array | the actions, in order |
| `WFWorkflowClientVersion` | string | e.g. `"4018.0.4"`; newer saves have `4528.0.4.2` or `5037.0.17` |
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

**Icon.** `WFWorkflowIconStartColor` is a 32-bit color, signed or unsigned (Apple writes
`-2873601`, others `4282601983`; both load). The palette, in picker order:

| Red | DarkOrange | Orange | Yellow | Green |
|---|---|---|---|---|
| 4282601983 | 4251333119 | 4271458815 | 4274264319 | 4292093695 |

| Teal | LightBlue | Blue | DarkBlue | Violet |
|---|---|---|---|---|
| 431817727 | 1440408063 | 463140863 | 946986751 | 2071128575 |

| Purple | Pink | Taupe | Gray | DarkGray |
|---|---|---|---|---|
| 3679049983 | 3980825855 | 255 | 3031607807 | 2846468607 |

Glyphs are private-use codepoints from Shortcuts' icon font; the default is 61440.

## 2. Actions

Each element of `WFWorkflowActions`:

```
{ "WFWorkflowActionIdentifier": "is.workflow.actions.setstoredcontent",
  "WFWorkflowActionParameters": { "UUID": "…", <parameter key>: <value>, … } }
```

`UUID` is any uppercase UUID; other actions reference this action's output through it.
`CustomOutputName` renames the output. Built-in identifiers, keys and parameter classes are in
`data/builtin-actions.json`.

**App Intents actions.** The identifier is `<app bundle identifier>.<intent type name>`, e.g.
`com.apple.reminders.TTRCreateReminderAppIntent`. An intent hosted in a framework or extension
(Clock's `MobileTimerIntents`, Notes' `SharingExtension`; 11 in the catalogue) keeps the host's
identifier instead, as `data/apple-app-intents.json` records it. Parameters are keyed by the intent's Swift parameter names
(`title`, `isFlagged`), and each value type is encoded as a built-in parameter class
(`appIntentValueTypes` in `data/encoding-table.json`):

| Value type | Parameter class | Written as |
|---|---|---|
| string, rich text | `WFTextInputParameter` | string or `WFTextTokenString` |
| bool | `WFSwitchParameter` | bool |
| number | `WFNumberFieldParameter` | number |
| URL | `WFURLParameter` | string or token string |
| date, date components | `WFDateFieldParameter` | string or token string |
| placemark | `WFLocationParameter` | location dictionary |
| enumeration | `WFLinkEnumerationParameter` | the case identifier (`"high"`, not "High") |
| entity | `WFLinkDynamicOptionsEnumerationParameter` | a dictionary the app understands, or a variable |

Each also carries a descriptor:

```
"AppIntentDescriptor": { "TeamIdentifier": "0000000000", "BundleIdentifier": "com.apple.reminders",
                         "Name": "Reminders", "AppIntentIdentifier": "TTRCreateReminderAppIntent",
                         "ActionRequiresAppInstallation": true }
```

`TeamIdentifier` is ten zeros for Apple's apps. The editor writes `ActionRequiresAppInstallation`
only on entity Find actions; the engine reads the descriptor with or without it. `data/apple-app-intents.json` has these fields
for every Apple App Intents action; `tools/dump-appintents-actions.py` lists the installed
third-party ones. Older SiriKit intents use `IntentAppDefinition` instead, and x-callback
actions use the app's own identifier scheme.

## 3. Parameter values

A parameter's state class decides its encoding. `data/parameter-encodings.json` maps each
parameter class to its state class; `data/encoding-table.json` shows what each state class
writes.

**Plain.** string, int, real, bool, array of strings. Enumerations are the choice label as a
string. Switches are bools. Steppers are ints.

**Attachment** (`WFTextTokenAttachment`), a reference resolved at run time:

```
{ "WFSerializationType": "WFTextTokenAttachment", "Value": V }
V = { "Type": "ActionOutput", "OutputUUID": "<UUID of the action>", "OutputName": "<its output name>" }
  | { "Type": "Variable", "VariableName": "MyVar" }
  | { "Type": "ExtensionInput" }            shortcut input
  | { "Type": "Ask", "Prompt": "…" }         ask each time (Prompt optional)
  | { "Type": "Clipboard" } | { "Type": "CurrentDate" } | { "Type": "DeviceDetails" } | { "Type": "CurrentApp" }
```
`V` may also carry `"Aggrandizements": [{"Type": "WFCoercionVariableAggrandizement", "CoercionItemClass": "WFStringContentItem"}]`
to coerce the value (the editor's variable "Type" menu; `coerce()` in the packages), or a property
aggrandizement to read a field of it: `{"Type": "WFPropertyVariableAggrandizement", "PropertyName": "body"}`.
The classes a coercion can name are `+[WFContentItem allSupportedItemClasses]`, 22 on macOS 27
(`contentItemClasses` in `data/encoding-table.json`, with the name the editor shows for each;
`CONTENT_ITEM_CLASSES` in the packages); the parser itself takes any class name. For an App Intents
entity, `PropertyName` is the property's identifier (`ENTITY_PROPERTIES` in the packages lists
them, from `data/apple-entities.json`).

**Text with references** (`WFTextTokenString`), used by text, URL, and date inputs:

```
{ "WFSerializationType": "WFTextTokenString",
  "Value": { "string": "Hello ￼!", "attachmentsByRange": { "{6, 1}": V } } }
```
Each U+FFFC in `string` is a placeholder, and `attachmentsByRange` maps its `{offset, length}`
to a `V`. Offsets count UTF-16 code units, as NSRange does: `"😀 "` followed by a reference is
`{3, 1}`, not `{2, 1}`. A text parameter never holds a bare attachment; a lone variable is a
token string whose `string` is one U+FFFC. Every other substitutable state takes the bare
attachment.

**Variable pickers** (`WFVariablePickerParameter`, e.g. `WFInput` on Repeat with Each and
Quick Look, and `WFContentItemInputParameter` on Filter actions) take the bare attachment. The
engine doesn't read the wrapped form as a connection; the editor shows an empty placeholder.

**If subject.** `WFInput` on `is.workflow.actions.conditional` is the one place the app writes
the wrapped form, `{ "Type": "Variable", "Variable": <attachment> }`.

**Substitutable states** (`WF*SubstitutableState`) take either the plain value or an
attachment, so any text, number, or switch can come from a variable.

**Which references a key reads** depends on the parameter. The Filter actions' sort keys
(`WFContentItemSortProperty`, `WFContentItemSortOrder`) and a few enumerations read none,
variable pickers read every kind except Ask, and some enumerations read only output, input,
variable, and Ask references. `reads` in `data/parameter-encodings.json` lists the kinds for
each key.

**Dictionaries** (`WFDictionaryFieldValue`: Dictionary's `WFItems`, Get Contents of URL's `WFHTTPHeaders`,
`WFFormValues` and `WFJSONValues`): `{"WFSerializationType": "WFDictionaryFieldValue", "Value": {"WFDictionaryFieldValueItems": [ item … ]}}`,
each item `{"WFKey": <token string>, "WFItemType": n, "WFValue": …}` with the value's form set by the
type code, as `WFDictionaryParameterState` writes them back (`dictionaryItems` in `data/encoding-table.json`):

| `WFItemType` | editor's type | `WFValue` |
|---|---|---|
| 0 | Text | a token string (plain text, or text with references) |
| 1 | Dictionary | `{"WFSerializationType": "WFDictionaryFieldValue", "Value": <a whole dictionary, with its own WFSerializationType>}`: wrapped once more than the outer one |
| 2 | Array | `{"WFSerializationType": "WFArrayParameterState", "Value": [ … ]}`: plain text items are bare strings, every other item `{"WFItemType": n, "WFValue": …}` with no key |
| 3 | Number | a token string holding the digits or a reference, never a bare number (a bare 5 reads back as "0") |
| 4 | Boolean | `{"WFSerializationType": "WFNumberSubstitutableState", "Value": true}` or an attachment in place of the boolean (a `WFBooleanSubstitutableState` is read and rewritten so) |

A key may hold a reference. The parser raises on any other type code. The engine omits an empty
`attachmentsByRange` from a token string it writes; the one the packages write (`{}`) is read the same.

**Specialised.** Quantity: `{"WFSerializationType": "WFQuantityFieldValue", "Value": {"Unit": "min", "Magnitude": …}}`.
Contacts, colors (`WFColorRepresentationType` + components), locations (`{"isCurrentLocation": true}`),
file bookmarks (`{"bookmarkData", "displayName", "filename"}`) and media items (`WFMediaItems` on
Play Music: `{"type": "Song", "itemName", "persistentIdentifier"}`, the identifier a local library id)
each have their own dictionary; `data/encoding-table.json` has examples.

## 4. Control flow

Blocks are separate actions sharing a `GroupingIdentifier` (a UUID) with `WFControlFlowMode`:
`0` opens the block, `1` is a middle branch, `2` closes it.

- **If**: `is.workflow.actions.conditional` ×2 or ×3. Mode 0 carries the condition; mode 1 is
  Otherwise; mode 2 is End If. Legacy form (still loaded, and what libraries write):
  `WFInput` (variable picker), `WFCondition` (code below), and one of
  `WFConditionalActionString`, `WFNumberValue`, `WFBooleanValue`, `WFDate`/`WFAnotherDate`,
  `WFDuration`, `WFEnumerationValue`. Modern form: a single `WFConditions` value of type
  `WFContentPredicateTableTemplate` (same template shape as filters, below).
- **Repeat with Each**: `is.workflow.actions.repeat.each`, mode 0 with `WFInput` (picker), mode 2.
  Inside, the item is `{"Type": "Variable", "VariableName": "Repeat Item"}` and the index `"Repeat Index"`.
- **Repeat N times**: `is.workflow.actions.repeat.count`, mode 0 with `WFRepeatCount`, mode 2.
- **Choose from Menu**: `is.workflow.actions.choosefrommenu`, mode 0 with `WFMenuPrompt` and
  `WFMenuItems` (array of titles); one mode 1 per item carrying `WFMenuItemTitle`; mode 2.

**Condition codes** (`WFCondition`, and `Operator` in filter templates). The meanings are the
engine's own: loading a filter row with each code, its row state names the operator
(`filterOperators` in `data/encoding-table.json`). Any other code traps the engine.

| code | meaning | code | meaning |
|---|---|---|---|
| 4 | is | 0 | is less than |
| 5 | is not | 1 | is less than or equal to |
| 99 | contains | 2 | is greater than |
| 999 | does not contain | 3 | is greater than or equal to |
| 8 | begins with | 1003 | is between |
| 9 | ends with | 1000 | is in the next (dates) |
| 100 | has any value | 1001 | is in the last (dates) |
| 101 | does not have any value | 1002 | is today (dates) |

Which codes a property offers depends on its type: the date codes only apply to dates, and
App Intents properties offer only what their query declares.

**Filter templates** (`WFContentItemFilter` on Filter actions, `WFConditions` on modern If):

```
{ "WFSerializationType": "WFContentPredicateTableTemplate",
  "Value": { "WFActionParameterFilterPrefix": 1,            1 = all conditions, 0 = any
             "WFContentPredicateBoundedDate": false,
             "WFActionParameterFilterTemplates": [
               { "Property": "Name", "Operator": 99, "Removable": true,
                 "Values": { "Unit": 4, "String": <token string> } },
               { "Property": "Start Date", "Operator": 1000, "Removable": false, "Bounded": true,
                 "Values": { "Unit": 16, "Number": "7" } } ] } }    Start Date is in the next 7 days
```

**Row values.** The editing parameter of a row's property decides which `Values` key holds
its value. The engine keeps every key it knows and drops the rest; Apple's files also carry
leftovers from earlier edits (`"Unit": 4` above).

| property edited by | key | value |
|---|---|---|
| text field | `String` | string or token string (a bare attachment is dropped) |
| number field | `Number` | number, numeric string, or attachment |
| switch | `Bool` | bool or attachment |
| date field | `Date`, and `AnotherDate` for 1003 | plist `<date>` or attachment (a date string is dropped) |
| contact handle (Messages' sender) | `ContactHandle` | `{"WFSerializationType": "WFTokenStringParameterState", "Value": <string, or token string when it holds a reference>}` |
| enumeration (built-in) | `Enumeration` | `{"WFSerializationType": "WFStringSubstitutableState", "Value": "Video"}` |

1000 and 1001 take `Number`, the count, and `Unit`, an NSCalendarUnit (4 years, 8 months,
8192 weeks, 16 days, 32 hours, 64 minutes, 128 seconds) or an attachment. Each date property
lists the units it offers (`timeUnits` in `data/apple-entities.json`). 1002 takes no value.
Some built-in Find actions require a bounded date row: Find Calendar Events replaces a filter
without a bounded Start Date row with its default, "Start Date is in the next 7 days". The row
carries `Bounded: true` and the filter `WFContentPredicateBoundedDate: true`; the operators that
count are the property's bounded ones (is, is today, is between, is in the next, is in the last).
The requirement shows in the action's default filter (`actionDefaults` in
`data/parameter-encodings.json`), from which the generator writes `BOUNDED_FILTERS`; `action()`
marks the row and refuses a filter without one.

The engine's full set of `Values` keys, read from WorkflowKit's row state type: `String`,
`Number`, `Bool`, `Date`, `AnotherDate`, `Email`, `Phone`, `ContactHandle`, `Enumeration`,
`Unit` (calendar), `MeasurementUnit` and `ByteCountUnit`. Which ones a row carries follows the
property's row value type (`rowValues` in `data/engine-filters.json` holds a sample of each,
read back through the engine):

- A string row holds one key, chosen by the property's value class (`valueClass` per property):
  `Email` for `WFEmailAddress`, `Phone` for `WFPhoneNumber`, `String` for everything else, URLs,
  locations and street addresses included. The value is a token string or a plain string (the
  editor writes plain strings when there is no reference). The engine reads only that key: an
  email property given `String` compares against nothing.
- A number row holds `Number`. A date row holds `Date` (a plist date), `Date` and `AnotherDate`
  for "is between", nothing for "is today", and `Number` with a calendar `Unit` (an
  `NSCalendarUnit`: 16 day, 32 hour, 64 minute, 8192 week) for "is in the last/next".
- A duration row (time intervals, subject type 7) holds `Number` and a calendar `Unit`: 5 with
  64 is 300 seconds.
- A file size row holds `Number` and `ByteCountUnit`, a code the engine scales by a power of ten:
  1 bytes, 2 KB (10³), 4 MB, 8 GB, 16 TB, 32 PB, 64 EB; any other code counts as bytes.
- A built-in enumeration (Reminders' Priority, Photos' Album) holds `Enumeration` as
  `{WFSerializationType: "WFStringSubstitutableState", Value: "High"}`; a bare string is dropped.
  Static choices are the property's `items`; properties without them (albums, calendars) take any
  string.
- An App Intents enumeration holds `Enumeration` as
  `{WFSerializationType: "WFLinkEnumerationSubstitutableState", Value: "<case identifier>"}`,
  the case identifiers being `cases` per property in `data/linkd-properties.json`.
- `ContactHandle` is a `WFTokenStringParameterState` around a token string, or a plain string
  when it holds no reference. `MeasurementUnit` is a keyed archive of an `NSUnit`; no property
  the engine offers filters on uses it.

`where()` writes rows from the engine's own lists: `data/engine-filters.json` for the 14
built-in Find and Filter actions (their content item classes) and `data/linkd-properties.json`
for Apple's App Intents Find actions (the entity as the app builds it, from linkd's metadata),
with `data/apple-entities.json`, the index route, standing in for an entity the engine host did
not build (`docs/extraction.md`, "The engine's own filter rules"). Per property the generated
`FILTERS` carry the operator codes, the value kind (which key the row holds), the units a
number-and-unit row offers and an enumeration's choices. Bool properties are not offered: the
engine lists no operator for them.

## 5. Naming, signing and import

The plist has no name key. Shortcuts names an imported shortcut after the file, so
`Morning Report.shortcut` imports as "Morning Report".

Shortcuts rejects unsigned files. `shortcuts sign --mode anyone --input in.shortcut --output
out.shortcut` wraps the plist in an AEA container (magic `AEA1`). It needs an iCloud login even
in `anyone` mode; without one it fails with "In order to do this, you must be signed into
iCloud." `open out.shortcut` shows the import sheet. The app stores each shortcut as this same
plist in `~/Library/Shortcuts/Shortcuts.sqlite`.

**What the import sheet refuses.** "This shortcut can't be imported because it contains
features not supported on this device" is the app's answer to an App Intents action that linkd
marks not discoverable (`LNVisibilityMetadata.isDiscoverable` NO), such as Reminders'
`GetDefaultListAppIntent`, even though its availability annotations allow every platform and
WorkflowKit itself loads the file, converts it to a record and raises no import question. The
check is in the app's import step, not in the engine. A built-in the editor hides
(`visibilityFlags` 0 in the app's index, such as the old `is.workflow.actions.getonscreencontent`)
imports and runs. See the extraction notes on
[hidden actions](extraction.md#what-the-editor-shows-that-the-catalogue-does-not) for how this
was established.

**Running from the command line.** `shortcuts run "<name>"` returns the last action's output,
and macOS asks "Allow … to output N items?" the first time (Always Allow silences it). End the
shortcut with `is.workflow.actions.nothing` to return nothing. The prompt doesn't appear when
the shortcut runs from the app, Spotlight, or a widget.
