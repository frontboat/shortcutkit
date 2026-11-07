---
name: shortcutkit
description: Use this skill to build Apple Shortcuts with ShortcutKit in TypeScript or Python. It covers catalog searches, actions, parameters, and output references. It also covers how to write, sign, and test .shortcut files.
license: MIT. See LICENSE.txt.
metadata:
  author: frontboat
  repository: https://github.com/frontboat/shortcutkit
---

# ShortcutKit

ShortcutKit builds Apple Shortcuts (`.shortcut` files) from TypeScript or Python. It supports checked parameters, output references, filters, and control flow. Its catalog describes actions and types extracted from Apple's Shortcuts frameworks. It also supports third-party App Intent descriptors and signing on macOS.

## Search the package catalog first

Before you write builder code, find the installed package's `catalog.txt` or `catalog.json`. These files are the primary reference for that release:

| Environment             | Catalog files                                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| TypeScript / Node / Bun | `dist/catalog.txt` and `dist/catalog.json` in the resolved package directory, typically `node_modules/shortcutkit/`. |
| Python                  | `data/catalog.txt` and `data/catalog.json` in the installed `shortcutkit` module directory.                          |
| Source checkout         | `docs/catalog.txt` and `src/generated/catalog.json`.                                                                 |

Both packages export `CATALOG` for programmatic queries.

Search or query the large catalog. Read only matching records:

1. Search `catalog.txt` by operation, action name, or content type. Narrow the results by record heading.
2. Read each complete matching record. Check these fields:
   - Identifier.
   - Parameter keys, kinds, choices, and defaults.
   - Evidence of reference support.
   - Rules for parameter visibility.
3. Query `catalog.json` or `CATALOG` for the information you need:
   - Relationships between inputs and outputs.
   - Output classes that depend on choices.
   - Filter operators and units.
   - Entity properties.
   - Relationships between content classes.

Return only the needed fields.

Do not include the full catalog in the conversation context.

Match the catalog to the installed release. For older releases without catalog files, inspect these sources:

- Exports.
- Definitions.
- Generated types.

Upstream documentation may describe newer APIs.

## Understand build time and runtime

TypeScript or Python constructs the action graph. Apple's Shortcuts runtime executes it later. A TypeScript or Python loop generates actions during the build. `repeatEach()` generates a Shortcuts loop that processes runtime values. The same distinction applies to conditions. Action handles refer to outputs available when the shortcut runs.

## Install and choose actions

1. Install `shortcutkit` with the project's existing language and package manager. For a new simple TypeScript project, use `bun add shortcutkit`. See the [README](https://github.com/frontboat/shortcutkit/blob/main/README.md#install) for Node installation or the [Python guide](https://github.com/frontboat/shortcutkit/blob/main/python/README.md#install) for Python.
2. Before you choose APIs, check the installed version, exports, and types.
3. Find the actions and exact parameter keys in the catalog.
4. Build the shortcut with `Shortcut` and `actions`. TypeScript checks catalog action parameters at compile time. Python checks them at runtime.
5. Write the unsigned file with `write()`. See [Check, sign, and test](#check-sign-and-test) for signing and import instructions.

## Build a greeting

This shortcut asks for a name and displays a greeting:

```ts
import { Shortcut, actions, ref, text } from "shortcutkit";

const s = new Shortcut("Greeting");
const name = s.action(actions.ask, {
  WFAskActionPrompt: "What's your name?",
});
s.action(actions.showresult, {
  Text: text("Hello, ", ref(name), "!"),
});

await s.write(); // Greeting.shortcut (unsigned)
Shortcut.sign("Greeting.shortcut", "Greeting-signed.shortcut");
```

`write()` produces unsigned `Greeting.shortcut`. Signing produces `Greeting-signed.shortcut` for import. Signing requires a Mac with an iCloud login. If you use another platform, transfer the unsigned file to a Mac for signing.

`s.action()` appends an action and returns a handle. `ref(handle)` connects the handle's output to another action. `text(...parts)` combines literal text and references. JavaScript interpolation converts a handle to a string at build time. Use `text()` to preserve runtime references.

## Inspect actions and parameters

Use these exports to inspect actions and parameters:

- `actions` contains action identifiers. `getAction(identifier)` returns parameter and type metadata for built-in and App Intent actions. `getDefinition(identifier)` returns the underlying definition for a built-in action.
- `PARAM_KINDS`, `PARAM_CHOICES`, and `PARAM_VARIABLE_TYPES` describe parameter forms, enumeration values, and measured reference restrictions. Supply stored choice values. If no probe tests reference support, treat that support as unknown.
- `acceptedBy(type)` finds actions that accept a content type. `producedBy(type)` finds actions that produce it. Test conversions with the actual runtime values.

Use identifiers from `actions`. Use parameter keys and value shapes from the corresponding catalog records.

## Extend the workflow

Split larger workflows into functions. Each function accepts a shared `Shortcut`, appends related actions, and returns output handles. Pass runtime data through references and named variables.

| Task                           | Helper or value                                                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Read a result property         | `property(source, name)`. Check `ENTITY_PROPERTIES` or `CONTENT_ITEM_PROPERTIES`.                                                     |
| Read a value as a content type | `coerce(source, contentClass)`. Check `CONTENT_ITEM_CLASSES`.                                                                         |
| Filter Find results            | `where(...rows)` or `whereAny(...rows)` in `WFContentItemFilter`. Check the action's filter properties, operators, values, and units. |
| Add a condition                | `if` / `otherwise` / `endIf`.                                                                                                         |
| Repeat actions                 | `repeatEach` / `endRepeatEach` or `repeatCount` / `endRepeatCount`. Access loop variables with `repeatItem()` and `repeatIndex()`.    |
| Offer menu choices             | `chooseFromMenu` / `menuItem` / `endMenu`. Emit branches in the declared label order.                                                 |
| Accept share-sheet input       | `shortcutInput()` with the shortcut's `types` and `inputClasses` options.                                                             |
| Supply a dictionary            | A plain object with typed values.                                                                                                     |
| Add a third-party App Intent   | `appIntent(app, intent, output?)`. Check untyped parameters against the app's intent metadata or an exported shortcut.               |

Close each condition, repeat, or menu with the group identifier that it returns. If you nest repeats or move helpers into loops, check which repeat each variable references.

Python uses uppercase action constants and snake*case helpers: `actions.ASK`, `if*()`, `end*if()`, `shortcut_input()`, and `property*()`. Pass action parameters as keyword arguments with their original keys, such as `WFAskActionPrompt`.

## Check, sign, and test

For unfamiliar actions, conversions, or encodings, build a small diagnostic shortcut. Test it in Shortcuts before you integrate it.

1. Type-check TypeScript with the project's compiler configuration.
2. Generate the file to run builder checks.
3. Inspect `toPlist()` or `toXml()` when you diagnose output. On macOS, `plutil -lint` can check the unsigned plist.
4. On a Mac with an iCloud login, sign with `Shortcut.sign(inputPath, outputPath)`.
5. Open the signed file to import it.
6. Run the affected paths. Check content conversions, repeat variables, and menu routing.

Without a suitable Mac, deliver the unsigned file. Mark signing and native testing as pending.

Report which checks passed and which device tests remain. Claim runtime success only for paths that ran in Shortcuts.

If a build rejects a parameter or reference, check these sources:

- The action's installed definition.
- The parameter kind.
- The parameter choices.
- The reference restrictions.

Correct the key or value form. Rebuild the shortcut.

If the imported shortcut fails, isolate the failing actions in a diagnostic shortcut. Inspect their inputs and content types.

## Find detailed help

Read the relevant file in a ShortcutKit checkout. Alternatively, open the corresponding upstream link:

- Configure a project or find an API example: [README](https://github.com/frontboat/shortcutkit/blob/main/README.md).
- Find actions, parameters, filters, or content types: [Action catalog](https://github.com/frontboat/shortcutkit/blob/main/docs/catalog.txt).
- Build in Python: [Python guide](https://github.com/frontboat/shortcutkit/blob/main/python/README.md).
- Diagnose a complex parameter's serialized value: [Parameter encodings](https://github.com/frontboat/shortcutkit/blob/main/docs/parameter-encodings.md).
- Inspect plist structure, variable attachments, or App Intent descriptors: [Shortcut file format](https://github.com/frontboat/shortcutkit/blob/main/docs/shortcut-file-format.md).
- Check catalog provenance and approximation limits: [Extraction notes](https://github.com/frontboat/shortcutkit/blob/main/docs/extraction.md).
- Study a larger workflow and native testing lessons: [MCP Toolkit case study](https://github.com/frontboat/AppleShortcutMcpClient/blob/main/CASE-STUDY.md). It uses ShortcutKit 3.1.0, before the shared `CATALOG` snapshot. Consult current package metadata for API details.
