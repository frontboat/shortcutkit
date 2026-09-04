# shortcutkit

Build, validate and sign Apple Shortcuts (`.shortcut`) files from TypeScript or Python.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/frontboat/shortcutkit/ci.yml?branch=main)](https://github.com/frontboat/shortcutkit/actions)

## About

Shortcuts has no public file-format specification and no public list of what its actions
accept. shortcutkit fills that gap by extracting the action definitions and value encodings
from WorkflowKit, the engine inside the Shortcuts app, and generating a typed catalogue from
them. Every one of the 339 built-in actions is available with its parameter keys and value
shapes checked at compile time in TypeScript, or at run time in Python. Nothing was
transcribed by hand, and `data/provenance.json` records exactly which macOS and Shortcuts build
the data came from.

## Features

- **Every built-in action, typed.** `actions.*` lists all 339 identifiers, with each action's
  name, description, summary, output and parameter keys as hover documentation.
- **Parameters checked before you run anything.** `{ WFStoredContentGlobalValue: "yes" }` is a
  compile error; a switch takes a boolean or a reference. Enumeration choices are suggested.
  Any plain value slot also accepts an attachment, because that is how Shortcuts works.
- **Value helpers that match the engine's serialization.** `ref()` to another action's output,
  `variable()`, `shortcutInput()`, `clipboard()`, `currentDate()`, `ask()`, `text()` for
  strings with embedded references, and `picker()` for variable-picker parameters.
- **Control flow.** `if()` / `otherwise()` / `endIf()` and `repeatEach()` / `endRepeatEach()`
  manage the grouping identifiers for you.
- **App Intents from installed apps.** Any identifier outside the built-in set is accepted;
  built-in identifiers and their parameter keys are also validated at run time.
- **Definitions and provenance.** `getDefinition(id)` returns the full record (icon, keywords,
  parameter classes, required resources); `provenance` says which build produced the data.
- **Signing.** `Shortcut.sign()` wraps `shortcuts sign` so the output imports on any device.

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

### Actions from other apps

App Intents actions are not in the catalogue, so pass the identifier as a string. Parameter
keys are then typed as `Record<string, Value>` and passed through as given:

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
- [`docs/builtin-actions-reference.md`](docs/builtin-actions-reference.md): all 339 built-in
  actions with their parameters.
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
| `data/` | Everything extracted from the engine: definitions, parameter encodings, serialization table, and `provenance.json`. |
| `docs/` | The format reference, action reference, encodings reference and extraction notes. |
| `tools/` | The extraction pipeline. |

Never hand-edit the generated files. Change the generator or the data and re-run the pipeline.

### Regenerating the data

The extracted data is committed on purpose. It can only be produced on a Mac, through private
API that changes between releases, so committing it is what makes the package reproducible.
To refresh after a macOS update, on a Mac with Xcode or the Command Line Tools:

```bash
bun run extract        # ~1 minute: loads WorkflowKit, dumps and serializes everything
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
