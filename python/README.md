# shortcutkit

Build, validate and sign Apple Shortcuts (`.shortcut`) files from Python.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/frontboat/shortcutkit/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/frontboat/shortcutkit/ci.yml?branch=main)](https://github.com/frontboat/shortcutkit/actions)

## About

Apple has never documented the `.shortcut` format or what its actions accept. shortcutkit
does not guess at either. Its data was produced by loading WorkflowKit and ActionKit, the private
frameworks behind the Shortcuts app, and asking their own classes to describe and serialize
every built-in action, plus the Shortcuts app's own action index for the App Intents of
Apple's apps. Every identifier, parameter key and value encoding came out of the engine, not from a
person reading files, so the package cannot disagree with the app.

All 434 built-in actions and 1,441 Apple App Intents actions are bundled with the value kind
each parameter accepts, and
`action()` checks your call against them before anything is written. A wrong key or a string
where a boolean belongs raises `ValueError`. A file built from plain code signs, imports and
runs. Pure Python, no dependencies. Signing shells out to the macOS `shortcuts` command;
everything else runs anywhere.

The data regenerates in about a minute after any macOS update, with a diff of what Apple
changed and the semver bump it deserves. `PROVENANCE` records which macOS and Shortcuts build
produced the bundled files.

A TypeScript package of the same name shares the same data and adds compile-time checking.
Both live at https://github.com/frontboat/shortcutkit.

## Features

- **Every built-in action, as a constant.** `actions.SETSTOREDCONTENT` and 433 more, so a
  typo is an `AttributeError` rather than a silent bad file.
- **Apple's apps too.** `actions.REMINDERS_CREATE_REMINDER`, `actions.NOTES_CREATE_NOTE` and
  1,439 more App Intents actions from 77 Apple apps and system components, with the
  `AppIntentDescriptor` the file needs added for you.
- **Parameters checked before you write anything.** `ACTIONS[identifier]` gives the name,
  parameter keys and output name; `PARAM_KINDS[identifier]` gives the value kind each key
  accepts. Unknown keys and wrong kinds raise `ValueError`. Attachments and token strings are
  accepted wherever a plain value is, because that is how Shortcuts works.
- **Value helpers that match the engine's serialization.** `ref()` to another action's output,
  `variable()`, `shortcut_input()`, `clipboard()`, `current_date()`, `ask()`, `text()` for
  strings with embedded references, and `picker()` for variable-picker parameters.
- **Control flow.** `if_()` / `otherwise()` / `end_if()`, `repeat_each()` / `end_repeat_each()`,
  `repeat_count()` / `end_repeat_count()` and `choose_from_menu()` / `menu_item()` / `end_menu()`
  manage the grouping identifiers for you.
- **App Intents from installed apps.** Any identifier outside the built-in set is accepted and
  its parameters are passed through as given.
- **Lookup.** `get_action(identifier)` describes any identifier, built-in or App Intent: name,
  parameter keys and kinds, output, descriptor, and the engine's definition for built-ins.
- **Reference tables.** `CONDITION` codes, `ICON_COLORS`, `PARAM_CHOICES`, and `PROVENANCE` recording which
  macOS and Shortcuts build the bundled data came from.

## How it compares

Earlier libraries kept their action lists by hand, and the two most used ones are archived:
[python-shortcuts](https://github.com/alexander-akhmetov/python-shortcuts) (the `shortcuts`
package on PyPI, archived 2024) and [shortcuts-js](https://github.com/joshfarrant/shortcuts-js)
(archived 2023). [Cherri](https://github.com/electrikmilk/cherri) is the active project in this
space and is a programming language with its own compiler rather than a library.

shortcutkit is a plain Python library whose action catalogue comes from the Shortcuts engine
rather than from a maintainer. All 434 built-in actions and 1,441 Apple App Intents are covered, and the data regenerates
after each macOS update.

## Installation

```bash
pip install shortcutkit
```

### Requirements

- Python 3.9 or newer.
- A Mac signed into iCloud for `Shortcut.sign()`. It runs `shortcuts sign`, which refuses to
  work without an iCloud login even in `anyone` mode. Building and writing the unsigned file
  works on any platform.

## Usage

```python
from shortcutkit import Shortcut, actions, ref, text, shortcut_input

s = Shortcut("Greeting", color="Teal")
got = s.action(actions.GETSTOREDCONTENT, WFStoredContentKey="greeting")
s.action(actions.SHOWRESULT, Text=text("Stored: ", ref(got)))
s.write()                                                        # Greeting.shortcut (unsigned)
Shortcut.sign("Greeting.shortcut", "Greeting-signed.shortcut")   # macOS
```

Open the signed file and Shortcuts imports it.

### Share sheet

```python
s = Shortcut("Page Links", types=["ActionExtension"], input_classes=["WFSafariWebPageContentItem"])
links = s.action(actions.RUNJAVASCRIPTONWEBPAGE, WFInput=shortcut_input(), WFJavaScript="completion(document.links.length)")
s.action(actions.SHOWRESULT, Text=text("Links: ", ref(links)))
```

`types` takes `ActionExtension` (share sheet), `QuickActions` (Finder and Services menus),
`MenuBar`, `NCWidget`, `WatchKit`, `Sleep` and `ReceivesOnScreenContent`.

### Control flow

`if_()` returns a grouping identifier that the matching `otherwise()` and `end_if()` calls
take back:

```python
gid = s.if_(ref(got), "has_any_value")
s.action(actions.SHOWRESULT, Text=text("Stored value: ", ref(got)))
s.otherwise(gid)
s.action(actions.SHOWRESULT, Text=text("Nothing stored"))
s.end_if(gid)
```

### Apple's apps

```python
r = s.action(actions.REMINDERS_CREATE_REMINDER, title=text("Buy milk"), priorityLevel="high")
s.action(actions.NOTES_CREATE_NOTE, name="Shopping", content=text("Added ", ref(r)))
```

### Actions from other apps

Third-party App Intents actions are not in the catalogue, so pass the identifier as a string:

```python
s.action("com.example.app.CreateNote", title=text("Hello"), body=ref(got))
```

### Demo

The package ships a demo that builds a working shortcut with storage, an If/Otherwise block
and output, then signs it:

```bash
python -m shortcutkit demo out.shortcut
```

## Documentation

- [Shortcut file format](https://github.com/frontboat/shortcutkit/blob/main/docs/shortcut-file-format.md):
  the `.shortcut` format end to end, every field.
- [Built-in actions reference](https://github.com/frontboat/shortcutkit/blob/main/docs/builtin-actions-reference.md):
  all 434 built-in actions with their parameters.
- [Apple App Intents reference](https://github.com/frontboat/shortcutkit/blob/main/docs/apple-app-intents-reference.md):
  the 1,441 App Intents actions of Apple's apps, by app.
- [Parameter encodings](https://github.com/frontboat/shortcutkit/blob/main/docs/parameter-encodings.md):
  how each parameter class is serialized.
- [Extraction notes](https://github.com/frontboat/shortcutkit/blob/main/docs/extraction.md):
  how the data was obtained and what remains approximate.

## Development

From a checkout of the repository:

```bash
git clone https://github.com/frontboat/shortcutkit.git && cd shortcutkit/python
uv venv .venv && uv pip install -e . --python .venv/bin/python   # or: python3 -m venv .venv && .venv/bin/pip install -e .
.venv/bin/python -m shortcutkit demo /tmp/Demo.shortcut
```

`actions.py` and `data/` are generated by the repository's extraction tools from the Shortcuts
engine on a Mac. Do not edit them; change the generator or the data and run `bun run extract`
at the repository root. The Python and TypeScript packages are versioned together with the
data, and are kept in feature parity.

## License

shortcutkit is licensed under the MIT license. See
[LICENSE](https://github.com/frontboat/shortcutkit/blob/main/LICENSE) for details.
