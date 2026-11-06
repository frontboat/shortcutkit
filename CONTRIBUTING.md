# Contributing to shortcutkit

Issues and pull requests are welcome. If you change code:

- Make the same change in TypeScript (`src/index.ts`) and Python
  (`python/src/shortcutkit/__init__.py`).
- Don't hand-edit generated files. Change the generator or the data and re-run it.
- When the engine verifier fails, find the engine's rule and put it in the data. Don't
  special-case the failing key.
- If you change a README example, change its copy in `test/readme-examples.ts` too; `bun test`
  fails until they match.

## Development

```bash
git clone https://github.com/frontboat/shortcutkit.git && cd shortcutkit
bun install
bun test
bun run typecheck     # also checks the @ts-expect-error assertions in the tests
bun run generate      # both languages and the shared catalogue, from saved data/
bun run check-generated # read-only check that prepared sources are current
bun run check-parity  # both packages' public metadata and lookup results
bun run build         # npm bundle, declarations and catalogue in dist/

cd python && python3 -m venv .venv && .venv/bin/pip install -e .
.venv/bin/python -m shortcutkit demo /tmp/Demo.shortcut
.venv/bin/python ../test/readme_examples.py   # runs python/README.md's examples
```

CI runs all of this on macOS, plus the verifier below. It can't sign: runners have no iCloud
login.

## Verifying against the engine

```bash
bun run verify        # ~3 min; needs a Mac that has opened Shortcuts.app once
```

Checks that both packages write the same output, then loads every value form they write or
refuse through the Shortcuts engine and fails where the engine disagrees. Run it after changing `action()`, a value helper, the
generator, or the probes. On a Shortcuts build older than the data's, misses are reported as
version gaps instead.

## Repository layout

| Path | Contents |
|---|---|
| `src/` | TypeScript package; `src/generated/` is generated. |
| `python/` | Python package; `actions.py` and `data/` are generated. |
| `data/` | Everything extracted from Shortcuts. |
| `docs/` | Format, action, and encoding references, and extraction notes. |
| `tools/` | The extraction pipeline. |

## Regenerating the data

Extraction queries Apple's installed frameworks and saves the results in `data/`.
`bun run extract` finishes by running shared generation. Generation itself is portable:
`bun run generate` reads the saved snapshot, joins its facts once, and prepares both packages
and `docs/catalog.txt`. It requires Bun and Python, but no Apple private frameworks.

The canonical model lives in `src/generated/catalog.json`; Python bundles an identical copy
as `shortcutkit/data/catalog.json`. Both packages expose it as `CATALOG`. The text catalogue
includes all recorded properties and relationships, choice-dependent outputs, and evidence
for missing or unprobed metadata. Declared relationships do not guarantee runtime conversion.

Builds consume prepared sources. npm includes `dist/catalog.json` and `dist/catalog.txt`;
Python includes the same files under `shortcutkit/data/`. CI checks generated freshness,
metadata parity, and the built distributions. Python's catalogue has structural annotations;
the dynamic action API does not yet offer TypeScript-equivalent static parameter checking.

The data is committed because only a Mac can produce it. After a macOS update, on any Mac
that has opened Shortcuts.app once (no Xcode needed):

```bash
bun run extract        # ~10 s
bun install && bun test
bun run diff-data      # what changed, and the semver bump it implies
bun run changelog      # the same, as a CHANGELOG.md section
```

The packages and the data share one version. Added actions or parameters are a minor
release; removed or retyped ones are major. Bump `package.json` and `python/pyproject.toml`
together and add the changelog section to `CHANGELOG.md`.

[`docs/extraction.md`](docs/extraction.md) explains how extraction works.
