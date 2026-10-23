# shortcutkit

Build, validate, and sign Apple Shortcuts (`.shortcut`) files from TypeScript or Python.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/frontboat/shortcutkit/ci.yml?branch=main)](https://github.com/frontboat/shortcutkit/actions)
[![npm](https://img.shields.io/npm/v/shortcutkit)](https://www.npmjs.com/package/shortcutkit)
[![PyPI](https://img.shields.io/pypi/v/shortcutkit)](https://pypi.org/project/shortcutkit/)

```ts
import { Shortcut, actions, ref, text } from "shortcutkit";

const s = new Shortcut("Greeting", { color: "Teal" });
const got = s.action(actions.getstoredcontent, { WFStoredContentKey: "greeting" });
s.action(actions.showresult, { Text: text("Stored: ", ref(got)) });
await s.write();                                        // Greeting.shortcut
Shortcut.sign("Greeting.shortcut", "Greeting-signed.shortcut");
```

Open `Greeting-signed.shortcut` and Shortcuts imports it. Shortcuts rejects unsigned files, and
signing needs a Mac signed into iCloud; everything before `sign()` runs on any OS.

## About

Apple has never documented the `.shortcut` format or what its actions accept. shortcutkit
does not guess at either. The tools in this repository load WorkflowKit and ActionKit, the
private frameworks behind the Shortcuts app, and ask their own classes to describe and
serialize every built-in action. The actions of Apple's apps come from the Shortcuts app's
action index, the only readable copy of the App Intents registry. Every action identifier,
parameter key, value encoding, and icon color, and even the UTF-16 offset rule for embedded
references, came out of the engine rather than from someone reading files.

That turns an undocumented format into a typed one. In TypeScript, a wrong parameter key or a
string where a boolean belongs is a compile error. In Python the same checks run when you call
`action()`. A file built from plain code signs, imports, and runs.

The data stays current the same way it was made. After a macOS update, one command re-extracts
everything in about ten seconds, and another prints what Apple changed and the semver bump it
calls for.

## Features

- **Every built-in action, typed.** All 434, with each action's name, description, summary,
  output, and parameters as hover documentation in your editor.
- **Apple's apps too.** 1,441 App Intents actions from 77 Apple apps and system components
  (Create Reminder, Create Note, Send Message, the System Settings toggles), under the keys the
  Shortcuts app itself assigns them.
- **Parameters checked before you run anything.** A wrong key, or `"yes"` where a switch takes
  a boolean, is a compile error in TypeScript and a `ValueError` in Python. Where a parameter
  accepts a variable, its type names the kinds the engine reads there.
- **References serialized the way the app writes them.** Pass `ref()` to any parameter that
  takes one; `action()` wraps it into the form that parameter needs.
- **Control flow.** If/Otherwise, Repeat, Repeat with Each, and Choose from Menu blocks, with
  the grouping identifiers managed for you.
- **Any app's actions.** Third-party App Intents pass through with the descriptor you supply.
- **Signing.** `Shortcut.sign()` wraps `shortcuts sign`; a signed file imports on any device.

## How it compares

Earlier libraries for writing Shortcuts as code kept their action lists by hand. The two most
used are archived: [shortcuts-js](https://github.com/joshfarrant/shortcuts-js) (TypeScript, 129
actions) since 2023 and [python-shortcuts](https://github.com/alexander-akhmetov/python-shortcuts)
(Python) since 2024. [Cherri](https://github.com/electrikmilk/cherri), the active project in this
space, takes a different approach: a programming language with its own compiler, editor
extension, and package manager, whose actions are defined in that language.

shortcutkit is a library, not a language. You write TypeScript or Python you already know, and
the action catalog comes from the Shortcuts engine rather than from a maintainer. It covers all
434 built-in actions and 1,441 Apple App Intents today, and the next macOS update is one
`bun run extract` away.

## Installation

```bash
npm install shortcutkit      # or: bun add shortcutkit
```

Python:

```bash
pip install shortcutkit
```

### Requirements

- TypeScript: Node 20 or newer, or Bun. The published package is plain ES module JavaScript
  with type declarations.
- Python: 3.9 or newer.
- Signing: a Mac signed into iCloud. `sign()` runs `shortcuts sign`, which refuses to work
  without an iCloud login even in `anyone` mode. CI runners have no iCloud login.

Everything except signing works on any OS. `write()` converts the plist to binary with `plutil`
when it is present and otherwise writes XML.

## Usage

These examples build on the one at the top: `s` is a `Shortcut`, and `got` is an action.

### Share sheet

A shortcut offered from the share sheet declares its surfaces and the input it accepts, and
reads that input with `shortcutInput()`:

```ts
import { shortcutInput } from "shortcutkit";

const s = new Shortcut("Page Links", { types: ["ActionExtension"], inputClasses: ["WFSafariWebPageContentItem"] });
const links = s.action(actions.runjavascriptonwebpage, { WFInput: shortcutInput(), WFJavaScript: "completion(document.links.length)" });
s.action(actions.showresult, { Text: text("Links: ", ref(links)) });
```

`types` takes `ActionExtension` (share sheet), `QuickActions` (Finder and Services menus),
`MenuBar`, `NCWidget`, `WatchKit`, `Sleep`, and `ReceivesOnScreenContent`.

### Control flow

`if()` returns a grouping identifier that the matching `otherwise()` and `endIf()` calls take
back:

```ts
const gid = s.if(ref(got), "has_any_value");
s.action(actions.showresult, { Text: text("Stored value: ", ref(got)) });
s.otherwise(gid);
s.action(actions.showresult, { Text: text("Nothing stored") });
s.endIf(gid);
```

### Apple's apps

Apple's App Intents actions are in the catalog under the Shortcuts app's own keys. Their
parameters are typed like the built-ins, and `action()` adds the `AppIntentDescriptor` each
one carries in the file:

```ts
const r = s.action(actions.reminders_create_reminder, { title: text("Buy milk"), priorityLevel: "high" });
s.action(actions.notes_create_note, { name: "Shopping", content: text("Added ", ref(r)) });
```

### Actions from other apps

Third-party App Intents actions are not in the catalog. Pass the identifier as a string and
the descriptor yourself; the parameters are typed as `Record<string, Value>`, and `action()`
writes them as given:

```ts
s.action("com.example.app.CreateNoteIntent", {
  AppIntentDescriptor: {
    BundleIdentifier: "com.example.app", Name: "Example", TeamIdentifier: "ABCDE12345",
    AppIntentIdentifier: "CreateNoteIntent", ActionRequiresAppInstallation: true,
  },
  title: text("Hello"),
  body: ref(got),
});
```

### Python

The Python package has the same API and the same bundled data, with snake_case names and
run-time value checks in place of compile-time ones:

```python
from shortcutkit import Shortcut, actions, ref, text

s = Shortcut("Greeting", color="Teal")
got = s.action(actions.GETSTOREDCONTENT, WFStoredContentKey="greeting")
s.action(actions.SHOWRESULT, Text=text("Stored: ", ref(got)))
s.write()
Shortcut.sign("Greeting.shortcut", "Greeting-signed.shortcut")
```

See [`python/README.md`](python/README.md) for the full Python surface.

### Demo

A demo builds a working shortcut with storage, an If/Otherwise block, and output. The Python
package ships it; for TypeScript, run it from a clone:

```bash
python -m shortcutkit demo out.shortcut
bun run demo out.shortcut               # from a clone of this repository
```

## API

The TypeScript names are below. Python uses the same names in snake_case (`if_()`,
`end_if()`, `repeat_each()`); its action constants are upper case (`actions.SHOWRESULT`).

| Export | What it does |
|---|---|
| `new Shortcut(name, { color, glyph, types, inputClasses })` | A shortcut. `color` is a palette name (`"Teal"`) or a raw value; `types` and `inputClasses` set where it appears and what input it takes. |
| `s.action(id, params)` | Appends an action and returns it. Checks keys and value kinds, and adds the descriptor for Apple's App Intents. |
| `s.if(subject, condition, value?)`, `s.otherwise(gid)`, `s.endIf(gid)` | An If block. `condition` is a `CONDITION` name or a raw code. |
| `s.repeatEach(items)`, `s.endRepeatEach(gid)` | A Repeat with Each block. The closer returns an action; `ref()` it for the Repeat Results. |
| `s.repeatCount(n)`, `s.endRepeatCount(gid)` | A Repeat block, with the same Repeat Results. |
| `s.chooseFromMenu(prompt, items)`, `s.menuItem(gid, title)`, `s.endMenu(gid)` | A Choose from Menu block. |
| `s.write(path?)` | Writes the unsigned file, `<name>.shortcut` by default, and resolves to its path. |
| `Shortcut.sign(input, output, mode?)` | Signs with `shortcuts sign`. `mode` is `"anyone"` (the default) or `"people-who-know-me"`. |
| `s.toPlist()`, `s.toXml()` | The shortcut as a plist object or as XML. |
| `ref(action, outputName?)` | Another action's output. |
| `variable(name)`, `repeatItem()`, `repeatIndex()` | A named variable; the current item and index inside a repeat. |
| `shortcutInput()`, `clipboard()`, `currentDate()`, `ask(prompt?)`, `deviceDetails()`, `currentApp()` | The app's special variables. |
| `text(...parts)` | A string with embedded references. |
| `subject(attachment)` | The If-subject form. `if()` and `action()` apply it for you. |
| `actions`, `ACTIONS` | Identifier constants, and the catalog entry for each: name, parameters, output, and output content types. |
| `getAction(id)`, `getDefinition(id)` | The catalog entry for any identifier; the engine's full definition for a built-in (icon, keywords, parameter classes, required resources). |
| `PARAM_KINDS`, `PARAM_CHOICES`, `PARAM_VARIABLE_TYPES` | Per action and key: the value kind, the enumeration choices, and the reference kinds the engine reads. |
| `CONDITION`, `ICON_COLORS` | If condition codes and the icon palette. |
| `provenance` | The macOS and Shortcuts build that produced the data. |

Every action also has a named parameter type (`ShowresultParams`,
`RemindersCreateReminderParams`), and `OutputTypes<id>` gives its output content types.

## Documentation

- [`docs/shortcut-file-format.md`](docs/shortcut-file-format.md): the `.shortcut` format end
  to end, every field.
- [`docs/builtin-actions-reference.md`](docs/builtin-actions-reference.md): all 434 built-in
  actions with their parameters.
- [`docs/apple-app-intents-reference.md`](docs/apple-app-intents-reference.md): the 1,441 App
  Intents actions of Apple's apps, by app, with parameter kinds and enumeration cases.
- [`docs/parameter-encodings.md`](docs/parameter-encodings.md): how each parameter class is
  serialized.
- [`docs/extraction.md`](docs/extraction.md): how the data was obtained, what did not work,
  and what remains approximate. A handful of condition codes rest on community documentation.

## Contributing

Issues and pull requests are welcome. [`CONTRIBUTING.md`](CONTRIBUTING.md) covers the
development setup, the engine verifier, the repository layout, and refreshing the data after a
macOS update.

```bash
git clone https://github.com/frontboat/shortcutkit.git && cd shortcutkit
bun install && bun test
```

## Status

The data was extracted on macOS 27.0 with Shortcuts 10.0 (see `data/provenance.json`).
Generated files declare minimum client version 900, which any current Shortcuts accepts. The
private classes the tools call can change with any release; the package itself depends only on
the committed data. Generated shortcuts import and run.

## License

[MIT](LICENSE).
