# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`shortcutkit` builds, validates and signs Apple Shortcuts (`.shortcut`) files from TypeScript (Bun) and Python. The action catalogue and value encodings in `data/` were extracted from WorkflowKit and ActionKit (the private frameworks that are the Shortcuts engine) on a Mac, and both packages are generated from that data. macOS is required for `plutil` conversion, `shortcuts sign` (which additionally needs an iCloud login, so it cannot run on CI runners), and re-extraction; everything else is portable.

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

# Data pipeline (any Mac, no Xcode needed, ~10 s)
bun run extract               # regenerates data/, docs/, src/generated/actions.ts, python/src/shortcutkit/actions.py, provenance; also writes the local-only dumps. Needs Shortcuts.app to have run once (its ToolKit index)
bun run diff-data             # committed data vs working tree; recommends semver bump
bun run changelog             # same diff as a CHANGELOG section
```

CI (`.github/workflows/ci.yml`) runs typecheck, `bun test`, builds `dist/` and imports it from Node 20, installs the Python package, and writes an unsigned demo shortcut, all on `macos-latest`. Signing is not covered by CI: `shortcuts sign` fails with "you must be signed into iCloud" on GitHub runners.

## Architecture

**Data flows one way: engine → `data/` → generated code → library.**

1. `tools/extract-builtin-actions.sh` runs three JavaScript for Automation probes (`extract-builtin-actions.js`, `extract-parameter-encodings.js`, `extract-encoding-table.js`, each prefixed with `jxa-prelude.js`) under `osascript`. They `dlopen` ActionKit and WorkflowKit, ask `WFBundledActionProvider` for every definition, then serialize each parameter's state class. They are JXA rather than compiled code because ActionKit, which defines 53 of the built-in actions (Ask for Input, Show Alert, Count, URL, ...), asserts at load time that the host is an Apple platform binary, and a platform binary refuses to map non-platform code; osascript is a platform binary with no library validation. The prelude's `make()`/`sendObjects()` helpers call `objc_msgSend` on raw pointers where the JXA bridge cannot resolve a private initializer. Output: `data/builtin-actions.json` (definitions), `data/parameter-encodings.json` (parameter class → state class, plus per-action run-time parameter lists), `data/encoding-table.json` (exact serialized shapes), `data/provenance.json` (macOS/Shortcuts build that produced them).
   `tools/dump-toolkit-registry.py` then reads the Shortcuts app's own action index (`~/Library/Shortcuts/ToolKit/Tools-prod.*.sqlite`, the only readable copy of linkd's App Intents registry; linkd itself needs the `com.apple.linkd.registry` entitlement) and writes `data/apple-app-intents.json` (Apple apps' App Intents: exact identifiers, owning app, typed parameters, enum cases, Apple's snake_case keys) plus local-only `toolkit-registry.json`/`toolkit-names.json`; `tools/annotate-builtin-actions.py` fills `Name`, `Output.OutputName` and enumeration `Items` for what the engine's definitions leave out (ActionKit's built-ins declare parameters in code), each marked with a `*Source: "ToolKit"` key; enumeration entries only for keys the run-time walk reports.
2. `tools/generate-action-catalog.py` reads those and writes **both** `src/generated/actions.ts` and `python/src/shortcutkit/actions.py`. App Intents entries carry a `descriptor` that `action()` writes as `AppIntentDescriptor`; their keys are the app's `pythonName`, with variants (assistant twins, widget configurations, migrated `is.workflow.` identifiers) falling back to the sanitized identifier (`dedupe_keys`). Never hand-edit either; change the generator or the data and re-run. The state-class → value-kind mapping (`STATE_KIND`, `KIND_TS`) and the `LEGACY` keys for If/Choose-from-Menu live in this script.
3. `src/index.ts` is the whole runtime (control flow: `if`/`otherwise`/`endIf`, `repeatEach`, `repeatCount`, `chooseFromMenu`/`menuItem`/`endMenu`) (Node and Bun; it uses only `node:` builtins, and relative imports carry `.js` extensions so the emitted `.d.ts` resolve under NodeNext): `Shortcut` class, value helpers (`ref`, `variable`, `text`, `picker`, …), control flow, `toPlist`/`write`/`sign`. `src/values.ts` defines the value-shape types the generator references (`BoolValue`, `TextValue`, `EnumValue<…>`, …). `src/definitions.ts` types the raw JSON; `src/provenance.ts` exports `data/provenance.json`; `src/plist.ts` is a minimal XML plist writer; `src/cli.ts` is the `demo` command.
4. `python/src/shortcutkit/__init__.py` mirrors `src/index.ts` (same helpers, snake_case, `if_`/`end_if`) with run-time kind checks (`PARAM_KINDS`) standing in for TypeScript's compile-time `ParamTypes`. The extract script copies `builtin-actions.json` and `provenance.json` into `python/src/shortcutkit/data/`.

**Typing model.** `Shortcut.action(id, params)` is generic over the identifier: a built-in `ActionId` gets `Partial<ParamTypes[id] & MetaParams>`, anything else (App Intents from installed apps) gets `Record<string, Value>`. Every plain value type is unioned with `Attachment` because any Shortcuts parameter can hold a run-time reference. Enum choices use `Loose<T>` so unknown strings still compile. Run-time validation in `action()` checks identifiers starting with `is.workflow.` and unknown parameter keys against the definitions, using `META_KEYS` and `LEGACY_KEYS` for keys the definitions don't list.

**Encoding facts to preserve.** References are `WFTextTokenAttachment`; `text()` interleaves strings and attachments with U+FFFC placeholders keyed by `{offset, 1}` ranges (offset in UTF-16 code units, as NSRange counts; verified against WorkflowKit with emoji). Variable-picker parameters wrap an attachment as `{Type: "Variable", Variable: …}`. Control-flow blocks share a `GroupingIdentifier` with `WFControlFlowMode` 0 (open), 1 (middle branch), 2 (close). `docs/shortcut-file-format.md` is the full format reference; `docs/extraction.md` records how each fact was obtained and what is still approximate (some `CONDITION` codes come from community docs).

## Conventions

- Keep the TypeScript and Python packages in feature parity; a change to `src/index.ts` usually needs the same change in `python/src/shortcutkit/__init__.py`, and tests in `test/shortcut.test.ts` assert exact counts (434 built-in definitions, 2015 catalogue entries, 1581 with descriptors) that change only with a data refresh.
- Data refreshes follow semver for the whole repo: additions are minor, removals or class changes are major. Update `CHANGELOG.md` with `bun run changelog` output and bump both `package.json` and `python/pyproject.toml`.
- `data/gallery-workflows.json`, `data/app-provided-actions.json` and `data/builtin-action-identifiers.txt` are local-only dumps (gitignored); do not rely on them in committed code.
- Other tools: `tools/dump-gallery.py`, `tools/dump-appintents-actions.py`, `tools/dump-library-encodings.py` (read-only inspection of Apple's gallery, installed apps' App Intents, and the local Shortcuts library), `tools/fetch-apple-docs.py` (Apple docs as markdown), `tools/diff-data.py` (semver recommendation for a data refresh).
- The JXA probes call private API by selector name; if extraction breaks after a macOS update, re-dump the method lists of `WFBundledActionProvider`, `WFActionDefinition` and `WFParameterSummary` (the prelude's `methodNames()` does this from JXA) and adjust (see `docs/extraction.md`).
