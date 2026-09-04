# shortcutkit

Build, validate and sign Apple Shortcuts (`.shortcut`) files from TypeScript or Python.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/frontboat/shortcutkit/ci.yml?branch=main)](https://github.com/frontboat/shortcutkit/actions)

## About

Apple has never documented the `.shortcut` format or what its actions accept. shortcutkit
does not guess at either. The tools in this repository load WorkflowKit and ActionKit, the private
frameworks behind the Shortcuts app, and ask their own classes to describe and serialize
every built-in action. Apple's own apps' actions come from the Shortcuts app's action index,
the only readable copy of the App Intents registry. Every action identifier, parameter key, value encoding, icon colour, and even the
UTF-16 offset rule for embedded references came out of the engine, not from a person reading
files. The package cannot disagree with the app.

That turns an undocumented format into a typed one. In TypeScript, a wrong parameter key or a
string where a boolean belongs is a compile error. In Python the same checks run when you call
`action()`. A file built from plain code signs, imports and runs.

The data stays current the same way it was made. After a macOS update, one command re-extracts
everything in about a minute and prints a diff of what Apple changed, along with the semver
bump it deserves. `data/provenance.json` records which macOS and Shortcuts build produced the
files you are using.

## Features

- **Every built-in action, typed.** `actions.*` lists all 434 identifiers, with each action's
  name, description, summary, output and parameter keys as hover documentation.
- **Apple's apps too.** 1,581 App Intents actions from 80 Apple apps and system components,
  Create Reminder, Create Note, Send Message, the System Settings toggles, under the keys the
  Shortcuts app itself assigns them: `actions.reminders_create_reminder`. Enumeration cases are
  typed, and the `AppIntentDescriptor` the file needs is added for you.
- **Parameters checked before you run anything.** `{ WFStoredContentGlobalValue: "yes" }` is a
  compile error; a switch takes a boolean or a reference. Enumeration choices are suggested.
  Any plain value slot also accepts an attachment, because that is how Shortcuts works.
- **Value helpers that match the engine's serialization.** `ref()` to another action's output,
  `variable()`, `shortcutInput()`, `clipboard()`, `currentDate()`, `ask()`, `text()` for
  strings with embedded references, and `picker()` for variable-picker parameters.
- **Control flow.** `if()` / `otherwise()` / `endIf()`, `repeatEach()` / `endRepeatEach()`,
  `repeatCount()` / `endRepeatCount()` and `chooseFromMenu()` / `menuItem()` / `endMenu()`
  manage the grouping identifiers for you.
- **App Intents from installed apps.** Any identifier outside the built-in set is accepted;
  built-in identifiers and their parameter keys are also validated at run time.
- **Definitions and provenance.** `getDefinition(id)` returns the full record (icon, keywords,
  parameter classes, required resources); `provenance` says which build produced the data.
- **Signing.** `Shortcut.sign()` wraps `shortcuts sign` so the output imports on any device.

## How it compares

Every earlier library for writing Shortcuts as code kept its action list by hand, and that is
how the two most used ones ended: [shortcuts-js](https://github.com/joshfarrant/shortcuts-js)
(TypeScript, 129 actions, archived 2023) and
[python-shortcuts](https://github.com/alexander-akhmetov/python-shortcuts) (Python, archived
2024) both stopped once keeping up with Apple became a chore.
[Cherri](https://github.com/electrikmilk/cherri) is the active project in this space and takes
a different shape: a programming language with its own compiler, editor extension and package
manager, whose actions are defined in that language.

shortcutkit is a library, not a language. You write TypeScript or Python you already know, and
the action catalogue comes from the Shortcuts engine rather than from a maintainer. All 434
built-in actions and 1,581 Apple App Intents are covered today, and the next macOS update is
one `bun run extract` away.

## Installation

```bash
npm install shortcutkit      # or: bun add shortcutkit
```

Python:

```bash
pip install shortcutkit
```

### Requirements

- Node 20 or newer, or Bun, for the TypeScript package. The published package is plain ES
  module JavaScript with type declarations. Python 3.9 or newer for the Python package.
- A Mac signed into iCloud for `sign()`. It runs `shortcuts sign`, which refuses to work
  without an iCloud login even in `anyone` mode, so it cannot run on CI runners. `write()`
  converts the plist to binary with `plutil` when present and otherwise leaves the XML form.
  Building, validating and writing the unsigned file works anywhere.

## Usage

```ts
import { Shortcut, actions, ref, text } from "shortcutkit";

const s = new Shortcut("Greeting", { color: "Teal" });
const got = s.action(actions.getstoredcontent, { WFStoredContentKey: "greeting" });
s.action(actions.showresult, { Text: text("Stored: ", ref(got)) });
await s.write();                                        // Greeting.shortcut
Shortcut.sign("Greeting.shortcut", "Greeting-signed.shortcut");
```

Open the signed file and Shortcuts imports it.

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

Apple's App Intents actions are in the catalogue under the Shortcuts app's own keys. Their
parameters are typed like the built-ins, and the `AppIntentDescriptor` every such action
carries in the file is added automatically:

```ts
const r = s.action(actions.reminders_create_reminder, { title: text("Buy milk"), priorityLevel: "high" });
s.action(actions.notes_create_note, { name: "Shopping", content: text("Added ", ref(r)) });
```

### Actions from other apps

Third-party App Intents actions are not in the catalogue, so pass the identifier as a string
and the descriptor yourself. Parameter keys are then typed as `Record<string, Value>` and
passed through as given:

```ts
s.action("com.example.app.CreateNote", { title: text("Hello"), body: ref(got) });
```

### Python

Same API and same bundled data, with snake_case names and run-time value checks instead of
compile-time ones:

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

Both packages ship a demo that builds a working shortcut with storage, an If/Otherwise block
and output:

```bash
bun run demo out.shortcut
python -m shortcutkit demo out.shortcut
```

## Documentation

- [`docs/shortcut-file-format.md`](docs/shortcut-file-format.md): the `.shortcut` format end
  to end, every field.
- [`docs/builtin-actions-reference.md`](docs/builtin-actions-reference.md): all 434 built-in
  actions with their parameters.
- [`docs/apple-app-intents-reference.md`](docs/apple-app-intents-reference.md): the 1,581 App
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

CI runs the type check, the tests, a Node import of the built package, a Python install and an
unsigned build of the demo shortcut on macOS. Signing is not exercised in CI because the runner
has no iCloud login.

### Repository layout

| Path | Contents |
|---|---|
| `src/` | The TypeScript package source. `src/generated/actions.ts` is produced by the tools. `bun run build` bundles it into `dist/`, which is what npm ships. |
| `python/` | The Python package. `actions.py` and `data/` are produced by the tools. |
| `data/` | Everything extracted from the engine: definitions, parameter encodings, serialization table, `apple-app-intents.json` from the Shortcuts app's registry, and `provenance.json`. |
| `docs/` | The format reference, action reference, encodings reference and extraction notes. |
| `tools/` | The extraction pipeline. |

Never hand-edit the generated files. Change the generator or the data and re-run the pipeline.

### Regenerating the data

The extracted data is committed on purpose. It can only be produced on a Mac, through private
API that changes between releases, so committing it is what makes the package reproducible.
To refresh after a macOS update, on any Mac that has opened Shortcuts.app at least once. No
Xcode is needed: the probes are JavaScript for Automation scripts run by `osascript`, because
ActionKit, which defines about a quarter of the built-in actions, only loads into Apple's own
platform binaries. Apple's App Intents come from the Shortcuts app's action index, which
Shortcuts writes on launch.

```bash
bun run extract        # ~10 s: loads WorkflowKit and ActionKit in osascript, dumps and serializes everything
bun install && bun test
bun run diff-data      # what changed vs the committed data, and the semver bump it implies
bun run changelog      # the same as a CHANGELOG.md section
```

Both packages and the data are versioned together. A refresh that only adds actions or
parameters is a minor release. One that removes or retypes any is a major release, because the
generated catalogue is part of the type surface. Bump `package.json` and
`python/pyproject.toml` together and add the `bun run changelog` output to `CHANGELOG.md`.

The tools also dump Apple's gallery workflows, installed apps' App Intents actions and the raw
identifier list. Those files are local and gitignored.

## Status

Data extracted on macOS 27.0 with Shortcuts 10.0 (see `data/provenance.json`). Generated files
declare minimum client version 900, which any current Shortcuts accepts. The private classes
the tools call can change with any release; the package itself depends only on the committed
data. Generated shortcuts import and run.

## License

shortcutkit is licensed under the MIT license. See [`LICENSE`](LICENSE) for details.
