# Contributing to shortcutkit

Issues and pull requests are welcome. If you change code:

- Make the same change in TypeScript (`src/index.ts`) and Python
  (`python/src/shortcutkit/__init__.py`).
- Don't hand-edit generated files. Change the generator or the data and re-run it.
- When the engine verifier fails, find the engine's rule and put it in the data. Don't
  special-case the failing key.

## Development

```bash
git clone https://github.com/frontboat/shortcutkit.git && cd shortcutkit
bun install
bun test
bun run typecheck     # also checks the @ts-expect-error assertions in the tests
bun run build         # dist/, which npm ships

cd python && python3 -m venv .venv && .venv/bin/pip install -e .
.venv/bin/python -m shortcutkit demo /tmp/Demo.shortcut
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
