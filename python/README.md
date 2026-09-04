# shortcutkit

Build, validate and sign Apple Shortcuts (`.shortcut`) files from Python.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/frontboat/shortcutkit/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/frontboat/shortcutkit/ci.yml?branch=main)](https://github.com/frontboat/shortcutkit/actions)

## About

Apple has never documented the `.shortcut` format or what its actions accept. shortcutkit
does not guess at either. Its data was produced by loading WorkflowKit, the private framework
behind the Shortcuts app, and asking its own classes to describe and serialize every built-in
action. Every identifier, parameter key and value encoding came out of the engine, not from a
person reading files, so the package cannot disagree with the app.

All 339 built-in actions are bundled with the value kind each parameter accepts, and
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

- **Every built-in action, as a constant.** `actions.SETSTOREDCONTENT` and 338 more, so a
  typo is an `AttributeError` rather than a silent bad file.
- **Parameters checked before you write anything.** `ACTIONS[identifier]` gives the name,
  parameter keys and output name; `PARAM_KINDS[identifier]` gives the value kind each key
  accepts. Unknown keys and wrong kinds raise `ValueError`. Attachments and token strings are
  accepted wherever a plain value is, because that is how Shortcuts works.
- **Value helpers that match the engine's serialization.** `ref()` to another action's output,
  `variable()`, `shortcut_input()`, `clipboard()`, `current_date()`, `ask()`, `text()` for
  strings with embedded references, and `picker()` for variable-picker parameters.
- **Control flow.** `if_()` / `otherwise()` / `end_if()` and `repeat_each()` /
  `end_repeat_each()` manage the grouping identifiers for you.
- **App Intents from installed apps.** Any identifier outside the built-in set is accepted and
  its parameters are passed through as given.
- **Reference tables.** `CONDITION` codes, `ICON_COLORS`, and `PROVENANCE` recording which
  macOS and Shortcuts build the bundled data came from.

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
from shortcutkit import Shortcut, actions, ref, text

s = Shortcut("Greeting", color="Teal")
got = s.action(actions.GETSTOREDCONTENT, WFStoredContentKey="greeting")
s.action(actions.SHOWRESULT, Text=text("Stored: ", ref(got)))
s.write()                                                        # Greeting.shortcut (unsigned)
Shortcut.sign("Greeting.shortcut", "Greeting-signed.shortcut")   # macOS
```

Open the signed file and Shortcuts imports it.

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

### Actions from other apps

App Intents actions are not in the catalogue, so pass the identifier as a string:

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
  all 339 built-in actions with their parameters.
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
