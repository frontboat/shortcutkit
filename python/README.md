# shortcutkit

Build, validate, and sign Apple Shortcuts (`.shortcut`) files from Python.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/frontboat/shortcutkit/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/frontboat/shortcutkit/ci.yml?branch=main)](https://github.com/frontboat/shortcutkit/actions)

A shortcut that asks your name and says hello:

```python
from shortcutkit import Shortcut, actions, ref, text

s = Shortcut("Greeting")
name = s.action(actions.ASK, WFAskActionPrompt="What's your name?")
s.action(actions.SHOWRESULT, Text=text("Hello, ", ref(name), "!"))

s.write()  # Greeting.shortcut
Shortcut.sign("Greeting.shortcut", "Greeting-signed.shortcut")
```

Open `Greeting-signed.shortcut` and Shortcuts adds it to your library. Shortcuts only imports
signed files, and signing needs a Mac with an iCloud login; everything else runs on any OS.

## Why

The action catalog is extracted from the Shortcuts app's own frameworks, not written by hand,
and one command refreshes it after a macOS update. Earlier libraries kept hand-written lists and
are archived ([python-shortcuts](https://github.com/alexander-akhmetov/python-shortcuts),
[shortcuts-js](https://github.com/joshfarrant/shortcuts-js));
[Cherri](https://github.com/electrikmilk/cherri) is a separate language with its own compiler.

- All 449 built-in actions as constants, so a typo is an `AttributeError`.
- 1,265 actions from Apple's apps: Reminders, Notes, Messages, Settings, and 70 more. Only
  actions the Shortcuts editor offers: the Siri-only intents the app refuses to import are left out.
- Third-party app actions, named by app and intent.
- Checked conditions for 150 Find actions, the 14 built-in ones (Filter Files, Find Photos, Find
  Contacts, ...) and 136 in Apple's apps (Find Messages, Find Notes, ...), from the engine's own
  rules, and the properties of what they find.
- If, Repeat, Repeat with Each, and Choose from Menu blocks.
- A wrong key or value raises `ValueError` before anything is written.
- Pure Python, no dependencies.

A [TypeScript package](https://www.npmjs.com/package/shortcutkit) with the same name and data
adds compile-time checks.

## Install

```bash
pip install shortcutkit   # Python 3.9+
```

## Usage

These examples build on the one at the top.

### Share sheet

```python
from shortcutkit import shortcut_input

s = Shortcut("Page Links", types=["ActionExtension"], input_classes=["WFSafariWebPageContentItem"])
links = s.action(actions.RUNJAVASCRIPTONWEBPAGE, WFInput=shortcut_input(), WFJavaScript="completion(document.links.length)")
s.action(actions.SHOWRESULT, Text=text("Links: ", ref(links)))
```

### Control flow

```python
gid = s.if_(ref(name), "has_any_value")
s.action(actions.SHOWRESULT, Text=text("Hello, ", ref(name)))
s.otherwise(gid)
s.action(actions.SHOWRESULT, Text=text("Hello, stranger"))
s.end_if(gid)
```

### Apple's apps

```python
r = s.action(actions.REMINDERS_CREATE_REMINDER, title=text("Buy milk"), priorityLevel="high")
s.action(actions.NOTES_CREATE_NOTE, name="Shopping", contents=text("Added ", ref(r)))
```

### Finding things

A Find action for Apple's apps takes conditions checked against what it finds: its properties,
their operators, and the units of a date range. `property_()` reads one property of the results.

```python
from shortcutkit import where, property_

found = s.action(actions.MESSAGES_FIND_MESSAGE,
                 WFContentItemFilter=where(("author", "is", "+15555550100"), ("date", "is_in_the_last", 7, "days")))
s.action(actions.SHOWRESULT, Text=text(property_(found, "body")))
```

### Dictionaries and types

A dictionary parameter takes a plain dict: strings, `text()` and references are text items, and
numbers, booleans, lists and nested dicts keep their type, as the editor's item type menu sets it.
`coerce()` reads a value as one content type, as the variable "Type" menu does, and `property_()` on the
result takes that class's properties, the menu's "Get" list (`CONTENT_ITEM_PROPERTIES`):
`property_(coerce(file, "WFGenericFileContentItem"), "File Size")`, checked at run time.

```python
from shortcutkit import coerce

d = s.action(actions.DICTIONARY, WFItems={"name": ref(name), "greeted": True, "tags": ["a", "b"]})
gid = s.if_(coerce(d, "WFStringContentItem"), "contains", "a")
s.end_if(gid)
```

### Other apps

Name the app and the intent: the identifier is the bundle identifier followed by the intent name, as
the catalogue identifies an app's own intents, and the descriptor is written as the catalogue's are.
The parameters are not checked: their keys are the intent's parameter names, from
`Metadata.appintents/extract.actionsdata` in the app bundle.

```python
from shortcutkit import app_intent

app = {"BundleIdentifier": "com.example.app", "Name": "Example", "TeamIdentifier": "ABCDE12345"}
note = s.action(app_intent(app, "CreateNoteIntent", "Note"), title=text("Hello"), body=ref(name))
s.action(actions.SHOWRESULT, Text=ref(note))
```

## API

| Export | What it does |
|---|---|
| `Shortcut(name, color=, glyph=, types=, input_classes=)` | A shortcut. |
| `s.action(id, **params)` | Appends an action and returns it. |
| `s.if_(subject, condition, value=None)`, `s.otherwise(gid)`, `s.end_if(gid)` | An If block. |
| `s.repeat_each(items)`, `s.end_repeat_each(gid)` | A Repeat with Each block. |
| `s.repeat_count(n)`, `s.end_repeat_count(gid)` | A Repeat block. |
| `s.choose_from_menu(prompt, items)`, `s.menu_item(gid, title)`, `s.end_menu(gid)` | A Choose from Menu block. |
| `s.write(path=None)` | Writes the unsigned file and returns its path. |
| `Shortcut.sign(src, dst, mode="anyone")` | Signs a file with `shortcuts sign`. |
| `s.to_plist()` | The shortcut as a plist dictionary. |
| `ref(action)` | An action's output. |
| `text(*parts)` | A string with references in it. |
| `variable(name)`, `repeat_item()`, `repeat_index()` | Named and repeat variables. |
| `shortcut_input()`, `clipboard()`, `current_date()`, `ask()`, `device_details()`, `current_app()` | Special variables. |
| `where(*rows)`, `where_any(*rows)` | Conditions for a Find action's `WFContentItemFilter`. |
| `property_(source, name)` | One property of an action's output or a variable. |
| `coerce(source, class)` | A value read as one content type, the editor's "Type" menu (`CONTENT_ITEM_CLASSES`). |
| `dictionary(items)` | A dictionary parameter's items; `action()` encodes a plain dict itself. |
| `app_intent(app, intent, output=None)` | Another app's action, for `s.action()`. |
| `FILTERS`, `ENTITY_PROPERTIES`, `FILTER_OPERATORS`, `CALENDAR_UNITS`, `CONTENT_ITEM_CLASSES` | What each Find action can filter on, each entity type's properties, and the content types a coercion can name. |
| `actions`, `ACTIONS`, `get_action(id)` | Action identifiers and their catalog entries. |
| `PARAM_KINDS`, `PARAM_CHOICES`, `PARAM_VARIABLE_TYPES` | What each parameter accepts. |
| `CONDITION`, `ICON_COLORS`, `PROVENANCE` | If conditions, icon colors, and the build the data came from. |

## Documentation

- [Shortcut file format](https://github.com/frontboat/shortcutkit/blob/main/docs/shortcut-file-format.md)
- [Built-in actions](https://github.com/frontboat/shortcutkit/blob/main/docs/builtin-actions-reference.md)
- [Apple app actions](https://github.com/frontboat/shortcutkit/blob/main/docs/apple-app-intents-reference.md)
- [Parameter encodings](https://github.com/frontboat/shortcutkit/blob/main/docs/parameter-encodings.md)
- [How the data was extracted](https://github.com/frontboat/shortcutkit/blob/main/docs/extraction.md),
  and what is still approximate

## Contributing

Issues and pull requests are welcome. See
[`CONTRIBUTING.md`](https://github.com/frontboat/shortcutkit/blob/main/CONTRIBUTING.md).

## License

[MIT](https://github.com/frontboat/shortcutkit/blob/main/LICENSE).
