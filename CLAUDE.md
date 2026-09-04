# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`shortcutkit` builds, validates and signs Apple Shortcuts (`.shortcut`) files from TypeScript (Bun) and Python. The action catalogue and value encodings in `data/` were extracted from WorkflowKit (the private Shortcuts engine) on a Mac, and both packages are generated from that data. macOS is required for `plutil` conversion, `shortcuts sign`, and re-extraction; everything else is portable.

## Commands

```bash
bun install
bun test                      # all tests (test/shortcut.test.ts)
bun test -t "control flow"    # single test by name
bun run typecheck             # tsc --noEmit; also verifies the @ts-expect-error assertions in tests
bun run build                 # bun build src/index.ts → dist/index.js (Node ESM, JSON inlined) + tsc .d.ts; npm ships dist/ only
bun run demo out.shortcut     # builds, writes and signs a demo shortcut (macOS)

# Python package
cd python && python3 -m venv .venv && .venv/bin/pip install -e .
.venv/bin/python -m shortcutkit demo /tmp/Demo.shortcut

# Data pipeline (macOS with Xcode CLT, ~1 min)
bun run extract               # regenerates data/, docs/, src/generated/actions.ts, python/src/shortcutkit/actions.py, provenance; also writes the local-only dumps
bun run diff-data             # committed data vs working tree; recommends semver bump
bun run changelog             # same diff as a CHANGELOG section
```

CI (`.github/workflows/ci.yml`) runs typecheck, `bun test`, builds `dist/` and imports it from Node 20, installs the Python package, and builds+signs a demo shortcut, all on `macos-latest`.

## Architecture

**Data flows one way: engine → `data/` → generated code → library.**

1. `tools/extract-builtin-actions.sh` compiles three ObjC probes (`extract-builtin-actions.m`, `extract-parameter-encodings.m`, `extract-encoding-table.m`) that `dlopen` WorkflowKit and ask `WFBundledActionProvider` for every definition, then serialize each parameter's state class. Output: `data/builtin-actions.json` (definitions), `data/parameter-encodings.json` (parameter class → state class, plus per-action run-time parameter lists), `data/encoding-table.json` (exact serialized shapes), `data/provenance.json` (macOS/Shortcuts build that produced them).
2. `tools/generate-action-catalog.py` reads those and writes **both** `src/generated/actions.ts` and `python/src/shortcutkit/actions.py`. Never hand-edit either; change the generator or the data and re-run. The state-class → value-kind mapping (`STATE_KIND`, `KIND_TS`) and the `LEGACY` keys for If/Choose-from-Menu live in this script.
3. `src/index.ts` is the whole runtime (Node and Bun; it uses only `node:` builtins, and relative imports carry `.js` extensions so the emitted `.d.ts` resolve under NodeNext): `Shortcut` class, value helpers (`ref`, `variable`, `text`, `picker`, …), control flow, `toPlist`/`write`/`sign`. `src/values.ts` defines the value-shape types the generator references (`BoolValue`, `TextValue`, `EnumValue<…>`, …). `src/definitions.ts` types the raw JSON; `src/provenance.ts` exports `data/provenance.json`; `src/plist.ts` is a minimal XML plist writer; `src/cli.ts` is the `demo` command.
4. `python/src/shortcutkit/__init__.py` mirrors `src/index.ts` (same helpers, snake_case, `if_`/`end_if`) with run-time kind checks (`PARAM_KINDS`) standing in for TypeScript's compile-time `ParamTypes`. The extract script copies `builtin-actions.json` and `provenance.json` into `python/src/shortcutkit/data/`.

**Typing model.** `Shortcut.action(id, params)` is generic over the identifier: a built-in `ActionId` gets `Partial<ParamTypes[id] & MetaParams>`, anything else (App Intents from installed apps) gets `Record<string, Value>`. Every plain value type is unioned with `Attachment` because any Shortcuts parameter can hold a run-time reference. Enum choices use `Loose<T>` so unknown strings still compile. Run-time validation in `action()` checks identifiers starting with `is.workflow.` and unknown parameter keys against the definitions, using `META_KEYS` and `LEGACY_KEYS` for keys the definitions don't list.

**Encoding facts to preserve.** References are `WFTextTokenAttachment`; `text()` interleaves strings and attachments with U+FFFC placeholders keyed by `{offset, 1}` ranges (offset in UTF-16 code units, as NSRange counts; verified against WorkflowKit with emoji). Variable-picker parameters wrap an attachment as `{Type: "Variable", Variable: …}`. Control-flow blocks share a `GroupingIdentifier` with `WFControlFlowMode` 0 (open), 1 (middle branch), 2 (close). `docs/shortcut-file-format.md` is the full format reference; `docs/extraction.md` records how each fact was obtained and what is still approximate (some `CONDITION` codes come from community docs).

## Conventions

- Keep the TypeScript and Python packages in feature parity; a change to `src/index.ts` usually needs the same change in `python/src/shortcutkit/__init__.py`, and tests in `test/shortcut.test.ts` assert exact counts (339 actions) that change only with a data refresh.
- Data refreshes follow semver for the whole repo: additions are minor, removals or class changes are major. Update `CHANGELOG.md` with `bun run changelog` output and bump both `package.json` and `python/pyproject.toml`.
- `data/gallery-workflows.json`, `data/app-provided-actions.json` and `data/builtin-action-identifiers.txt` are local-only dumps (gitignored); do not rely on them in committed code.
- Other tools: `tools/dump-gallery.py`, `tools/dump-appintents-actions.py`, `tools/dump-library-encodings.py` (read-only inspection of Apple's gallery, installed apps' App Intents, and the local Shortcuts library), `tools/fetch-apple-docs.py` (Apple docs as markdown), `tools/diff-data.py` (semver recommendation for a data refresh).
- The ObjC probes call private API by method name; if extraction breaks after a macOS update, re-dump the method lists of `WFBundledActionProvider`, `WFActionDefinition` and `WFParameterSummary` and adjust (see `docs/extraction.md`).
