# shortcutkit

Build, validate, and sign Apple Shortcuts (`.shortcut`) files from TypeScript or Python.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/frontboat/shortcutkit/ci.yml?branch=main)](https://github.com/frontboat/shortcutkit/actions)
[![npm](https://img.shields.io/npm/v/shortcutkit)](https://www.npmjs.com/package/shortcutkit)
[![PyPI](https://img.shields.io/pypi/v/shortcutkit)](https://pypi.org/project/shortcutkit/)

A shortcut that asks your name and says hello:

```ts
import { Shortcut, actions, ref, text } from "shortcutkit";

const s = new Shortcut("Greeting");
const name = s.action(actions.ask, { WFAskActionPrompt: "What's your name?" });
s.action(actions.showresult, { Text: text("Hello, ", ref(name), "!") });

await s.write(); // Greeting.shortcut
Shortcut.sign("Greeting.shortcut", "Greeting-signed.shortcut");
```

Open `Greeting-signed.shortcut` and Shortcuts adds it to your library. Shortcuts only imports
signed files, and signing needs a Mac with an iCloud login; everything else runs on any OS.

## Why

The action catalog is extracted from the Shortcuts app's own frameworks, not written by hand,
and one command refreshes it after a macOS update. Earlier libraries kept hand-written lists and
are archived ([shortcuts-js](https://github.com/joshfarrant/shortcuts-js),
[python-shortcuts](https://github.com/alexander-akhmetov/python-shortcuts));
[Cherri](https://github.com/electrikmilk/cherri) is a separate language with its own compiler.

- All 449 built-in actions, typed, with documentation on hover.
- 1,265 actions from Apple's apps: Reminders, Notes, Messages, Settings, and 70 more. Only
  actions the Shortcuts editor offers: the Siri-only intents the app refuses to import are left out.
- Third-party app actions, named by app and intent.
- Typed conditions for 150 Find actions, the 14 built-in ones (Filter Files, Find Photos, Find
  Contacts, ...) and 136 in Apple's apps (Find Messages, Find Notes, ...), from the engine's own
  rules, and the properties of what they find.
- If, Repeat, Repeat with Each, and Choose from Menu blocks.
- A wrong key or value fails at compile time in TypeScript, and at `action()` in Python.

## Install

```bash
npm install shortcutkit   # Node 20+ or Bun
pip install shortcutkit   # Python 3.9+
```

## Usage

These examples build on the one at the top.

### Share sheet

```ts
import { shortcutInput } from "shortcutkit";

const s = new Shortcut("Page Links", { types: ["ActionExtension"], inputClasses: ["WFSafariWebPageContentItem"] });
const links = s.action(actions.runjavascriptonwebpage, { WFInput: shortcutInput(), WFJavaScript: "completion(document.links.length)" });
s.action(actions.showresult, { Text: text("Links: ", ref(links)) });
```

### Control flow

```ts
const gid = s.if(ref(name), "has_any_value");
s.action(actions.showresult, { Text: text("Hello, ", ref(name)) });
s.otherwise(gid);
s.action(actions.showresult, { Text: text("Hello, stranger") });
s.endIf(gid);
```

### Apple's apps

```ts
const r = s.action(actions.reminders_create_reminder, { title: text("Buy milk"), priorityLevel: "high" });
s.action(actions.notes_create_note, { name: "Shopping", contents: text("Added ", ref(r)) });
```

### Finding things

A Find action takes conditions typed for what it finds: its properties, their operators, the
values each takes (an enumeration's choices, a file size's units), and the units of a date range.
`property()` reads one property of the results.

```ts
import { where, property } from "shortcutkit";

const found = s.action(actions.messages_find_message, {
  WFContentItemFilter: where(["author", "is", "+15555550100"], ["date", "is_in_the_last", 7, "days"]),
});
s.action(actions.showresult, { Text: text(property(found, "body")) });
```

The built-in Find and Filter actions take the same rows, with units where the editor shows them:

```ts
import { where } from "shortcutkit";

s.action(actions.filter_files, {
  WFContentItemFilter: where(["File Size", "greater_than", 5, "MB"], ["Last Modified Date", "is_in_the_last", 2, "weeks"]),
});
```

### Dictionaries and types

A dictionary parameter takes a plain object: strings, `text()` and references are text items, and
numbers, booleans, arrays and nested objects keep their type, as the editor's item type menu sets
it. `coerce()` reads a value as one content type, as the variable "Type" menu does, and `property()`
on the result takes that class's properties, the menu's "Get" list (`CONTENT_ITEM_PROPERTIES`):
`property(coerce(file, "WFGenericFileContentItem"), "File Size")`, checked at compile time and run time. An output the catalogue
types, by class or by the object class it wraps (`CONTENT_ITEM_TYPES`), is checked the same way without a
coercion: `property(askedNumber, "Name")`.

```ts
import { coerce } from "shortcutkit";

const d = s.action(actions.dictionary, { WFItems: { name: ref(name), greeted: true, tags: ["a", "b"] } });
const gid = s.if(coerce(d, "WFStringContentItem"), "contains", "a");
s.endIf(gid);
```

### Other apps

Name the app and the intent: the identifier is the bundle identifier followed by the intent name, as
the catalogue identifies an app's own intents, and the descriptor is written as the catalogue's are.
The parameters are untyped: their keys are the intent's parameter names, from
`Metadata.appintents/extract.actionsdata` in the app bundle.

```ts
import { appIntent } from "shortcutkit";

const app = { BundleIdentifier: "com.example.app", Name: "Example", TeamIdentifier: "ABCDE12345" };
const note = s.action(appIntent(app, "CreateNoteIntent", "Note"), { title: text("Hello"), body: ref(name) });
s.action(actions.showresult, { Text: ref(note) });
```

### Python

Same API in snake_case. See [`python/README.md`](python/README.md).

```python
from shortcutkit import Shortcut, actions, ref, text

s = Shortcut("Greeting")
name = s.action(actions.ASK, WFAskActionPrompt="What's your name?")
s.action(actions.SHOWRESULT, Text=text("Hello, ", ref(name), "!"))

s.write()
Shortcut.sign("Greeting.shortcut", "Greeting-signed.shortcut")
```

## API

| Export | What it does |
|---|---|
| `new Shortcut(name, { color, glyph, types, inputClasses })` | A shortcut. |
| `s.action(id, params)` | Appends an action and returns it. |
| `s.if(subject, condition, value?)`, `s.otherwise(gid)`, `s.endIf(gid)` | An If block. |
| `s.repeatEach(items)`, `s.endRepeatEach(gid)` | A Repeat with Each block. |
| `s.repeatCount(n)`, `s.endRepeatCount(gid)` | A Repeat block. |
| `s.chooseFromMenu(prompt, items)`, `s.menuItem(gid, title)`, `s.endMenu(gid)` | A Choose from Menu block. |
| `s.write(path?)` | Writes the unsigned file and returns its path. |
| `Shortcut.sign(input, output, mode?)` | Signs a file with `shortcuts sign`. |
| `s.toPlist()`, `s.toXml()` | The shortcut as a plist object or XML. |
| `ref(action)` | An action's output. |
| `text(...parts)` | A string with references in it. |
| `variable(name)`, `repeatItem()`, `repeatIndex()` | Named and repeat variables. |
| `shortcutInput()`, `clipboard()`, `currentDate()`, `ask()`, `deviceDetails()`, `currentApp()` | Special variables. |
| `where(...rows)`, `whereAny(...rows)` | Conditions for a Find action's `WFContentItemFilter`. |
| `property(source, name)` | One property of an action's output or a variable: the editor's "Get" list (`ENTITY_PROPERTIES`, `CONTENT_ITEM_PROPERTIES`). |
| `coerce(source, class)` | A value read as one content type, the editor's "Type" menu (`CONTENT_ITEM_CLASSES`). |
| `dictionary(items)` | A dictionary parameter's items; `action()` encodes a plain object itself. |
| `appIntent(app, intent, output?)` | Another app's action, for `s.action()`. |
| `FILTERS`, `ENTITY_PROPERTIES`, `FILTER_OPERATORS`, `CALENDAR_UNITS`, `BYTE_COUNT_UNITS`, `BOUNDED_FILTERS`, `CONTENT_ITEM_CLASSES` | What each Find action can filter on, each entity type's properties, and the content types a coercion can name. |
| `actions`, `getAction(id)`, `getDefinition(id)` | Action identifiers and their catalog entries: parameters and kinds, output and input types, keywords, description, flags, and the rules under which the editor shows each parameter. |
| `acceptedBy(type)`, `producedBy(type)` | Which actions take a content type as input or as an entity parameter, and which output it. |
| `PARAM_KINDS`, `PARAM_CHOICES`, `PARAM_VARIABLE_TYPES` | What each parameter accepts. |
| `CONDITION`, `ICON_COLORS`, `provenance` | If conditions, icon colors, and the build the data came from. |

## Documentation

- [Shortcut file format](docs/shortcut-file-format.md)
- [Built-in actions](docs/builtin-actions-reference.md)
- [Apple app actions](docs/apple-app-intents-reference.md)
- [Parameter encodings](docs/parameter-encodings.md)
- [How the data was extracted](docs/extraction.md), and what is still approximate

## Status

Extracted from macOS 27.2 and Shortcuts 10.0. A future macOS can break re-extraction, but not
the published packages, which ship the data.

## Contributing

Issues and pull requests are welcome. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

[MIT](LICENSE).
