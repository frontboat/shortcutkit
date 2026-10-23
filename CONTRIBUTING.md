# Contributing to shortcutkit

Issues and pull requests are welcome. Three rules keep the two packages honest:

- Keep the TypeScript and Python packages in step. A change to `src/index.ts` usually needs the
  same change in `python/src/shortcutkit/__init__.py`.
- Never hand-edit the generated files. Change the generator or the data and re-run the pipeline.
- When the engine verifier fails, find the rule in the engine and put it in the data. Never
  special-case the failing key.

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

## Verifying against the engine

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

Run it after changing `action()`, a value helper, the generator, or the probes.

## Repository layout

| Path | Contents |
|---|---|
| `src/` | The TypeScript package source. The tools generate `src/generated/`. `bun run build` bundles the source into `dist/`, which is what npm ships. |
| `python/` | The Python package. The tools generate `actions.py` and `data/`. |
| `data/` | Everything extracted from the engine: definitions, parameter encodings, serialization table, `apple-app-intents.json` from the Shortcuts app's registry, and `provenance.json`. |
| `docs/` | The format reference, action reference, encodings reference, and extraction notes. |
| `tools/` | The extraction pipeline. |

## Regenerating the data

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
