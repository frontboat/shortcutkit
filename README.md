# shortcutkit

Build, validate, and sign Apple Shortcuts (`.shortcut`) files from TypeScript or Python.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/frontboat/shortcutkit/ci.yml?branch=main)](https://github.com/frontboat/shortcutkit/actions)

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

- **Every built-in action, typed.** `actions.*` lists all 434 identifiers, with each action's
  name, description, summary, output, and parameter keys as hover documentation. Each action's
  output content types are on `ACTIONS[id].outputTypes` and on the `Action` that `action()`
  returns.
- **Apple's apps too.** 1,441 App Intents actions from 77 Apple apps and system components
  (Create Reminder, Create Note, Send Message, the System Settings toggles), under the keys the
  Shortcuts app itself assigns them: `actions.reminders_create_reminder`. Enumeration cases are
  typed, and `action()` adds the `AppIntentDescriptor` the file needs.
- **Parameters checked before you run anything.** `{ WFStoredContentGlobalValue: "yes" }` is a
  compile error, because a switch takes a boolean or a reference. Your editor suggests
  enumeration choices. A plain value slot accepts a reference wherever the engine reads one, and
  its type names the kinds of reference allowed: a Filter action's sort key allows none; a
  variable picker allows every kind except Ask. `PARAM_VARIABLE_TYPES` holds the engine's
  answer for every key. Every action has a named parameter type (`ShowresultParams`,
  `RemindersCreateReminderParams`).
- **Value helpers that match the engine's serialization.** `ref()` refers to another action's
  output; `variable()`, `shortcutInput()`, `clipboard()`, `currentDate()`, `ask()`,
  `deviceDetails()`, and `currentApp()` cover named variables and the app's special ones;
  `text()` builds strings with embedded references. Pass a bare `ref()` wherever a reference is
  allowed: picker parameters take it as it is, and `action()` wraps it into the token string a
  text parameter needs or the form an If subject needs.
- **Control flow.** `if()` / `otherwise()` / `endIf()`, `repeatEach()` / `endRepeatEach()`,
  `repeatCount()` / `endRepeatCount()`, and `chooseFromMenu()` / `menuItem()` / `endMenu()`
  manage the grouping identifiers for you.
- **App Intents from installed apps.** Pass any identifier outside the catalog as a string.
  Identifiers starting with `is.workflow.` must be built-ins, and their parameter keys are
  checked at run time.
- **Definitions and provenance.** `getAction(id)` describes any identifier, built-in or App
  Intent: name, parameter keys and kinds, output, and descriptor. `getDefinition(id)` returns
  the engine's full record for a built-in (icon, keywords, parameter classes, required
  resources); `provenance` says which build produced the data.
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

Building, validating, and writing the unsigned file work anywhere. `write()` converts the plist
to binary with `plutil` when it is present and otherwise writes XML.

## Usage

```ts
import { Shortcut, actions, ref, text, shortcutInput } from "shortcutkit";

const s = new Shortcut("Greeting", { color: "Teal" });
const got = s.action(actions.getstoredcontent, { WFStoredContentKey: "greeting" });
s.action(actions.showresult, { Text: text("Stored: ", ref(got)) });
await s.write();                                        // Greeting.shortcut
Shortcut.sign("Greeting.shortcut", "Greeting-signed.shortcut");
```

Open the signed file and Shortcuts imports it.

### Share sheet

A shortcut offered from the share sheet declares its surfaces and the input it accepts, and
reads that input with `shortcutInput()`:

```ts
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

## Development

```bash
git clone https://github.com/frontboat/shortcutkit.git && cd shortcutkit
bun install
bun test              # all tests
bun run typecheck     # tsc --noEmit; also verifies the @ts-expect-error assertions in tests
bun run build         # bundles src/ into dist/index.js for Node and emits the .d.ts files

cd python && python3 -m venv .venv && .venv/bin/pip install -e .
.venv/bin/python -m shortcutkit demo /tmp/Demo.shortcut
```

CI runs on macOS: the type check, the tests, a Node import of the built package, a Python
install, the engine verification below, and an unsigned build of the demo shortcut. It cannot
sign, because the runner has no iCloud login.

### Verifying against the engine

```bash
bun run verify        # ~3 min on a Mac that has opened Shortcuts.app once
```

The verifier drives both packages over every action, parameter key, and value form their types
admit, diffs the two packages' output, and loads every case through the Shortcuts engine's own
action objects, which report whether each value was read. It also writes the forms the library
refuses, and the engine must refuse those too. Last, it builds whole shortcuts through every
block helper and imports them the way the app imports a file. The run fails on any case the
engine does not read, except on a Shortcuts build older than the data's, where it reports the
misses as version gaps (see `docs/extraction.md`).

### Repository layout

| Path | Contents |
|---|---|
| `src/` | The TypeScript package source. The tools generate `src/generated/`. `bun run build` bundles the source into `dist/`, which is what npm ships. |
| `python/` | The Python package. The tools generate `actions.py` and `data/`. |
| `data/` | Everything extracted from the engine: definitions, parameter encodings, serialization table, `apple-app-intents.json` from the Shortcuts app's registry, and `provenance.json`. |
| `docs/` | The format reference, action reference, encodings reference, and extraction notes. |
| `tools/` | The extraction pipeline. |

Never hand-edit the generated files. Change the generator or the data and re-run the pipeline.

### Regenerating the data

The extracted data is committed on purpose. Only a Mac can produce it, through private API that
changes between releases; committing it keeps the package reproducible. Refresh it after a
macOS update on any Mac that has opened Shortcuts.app at least once. No Xcode is needed. The
probes are JavaScript for Automation scripts run by `osascript`, because ActionKit, which
defines 53 of the built-in actions, loads only into Apple's platform binaries, and `osascript`
is one. Apple's App Intents come from the Shortcuts app's action index, which Shortcuts writes
on launch.

```bash
bun run extract        # ~10 s: loads WorkflowKit and ActionKit in osascript, dumps and serializes everything
bun install && bun test
bun run diff-data      # what changed vs the committed data, and the semver bump it implies
bun run changelog      # the same as a CHANGELOG.md section
```

The two packages and the data share one version number. A refresh that only adds actions or
parameters is a minor release. One that removes or retypes any is a major release, because the
generated catalog is part of the type surface. Bump `package.json` and `python/pyproject.toml`
together and add the `bun run changelog` output to `CHANGELOG.md`.

The tools also write local, gitignored dumps of Apple's gallery workflows, installed apps' App
Intents actions, and the raw identifier list.

## Status

The data was extracted on macOS 27.0 with Shortcuts 10.0 (see `data/provenance.json`).
Generated files declare minimum client version 900, which any current Shortcuts accepts. The
private classes the tools call can change with any release; the package itself depends only on
the committed data. Generated shortcuts import and run.

## License

[MIT](LICENSE).
