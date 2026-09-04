# How the data was extracted

Everything in `data/` comes from the Shortcuts engine on a Mac, not from documentation. This is the record of how, including what did not work.

## Built-in Shortcuts actions

### Where the definitions live

Built-in actions like Store Content are not App Intents. They are legacy "WF" actions defined
inside WorkflowKit, the private framework that is the Shortcuts engine. The Info panel in the
app shows text from WorkflowKit's `Localizable.loctable` (5,046 English strings, 45 locales),
keyed like `Store Content (Action Name)` and `Global Value (WFStoredContentGlobalValue)`.

Apple ships no document listing these actions. The definitions used to be a `WFActions.plist`
resource in the framework. They are now compiled into code: `WFActionDefinitionRegistry` has
one class method per action, `+actionDefinitionForStoreContent` and so on, each of which
registers a definition when the registry initialises.

### What did not work

- **Reading `WFActions.plist`.** It no longer exists on disk.
- **Scanning the strings table.** Gives names and descriptions but no structure, and no link
  between an action and its parameters.
- **Scanning the dyld shared cache for identifiers.** Finds all 411 `is.workflow.actions.*`
  strings but nothing else. The driver still writes `data/builtin-action-identifiers.txt` locally; it is not committed.
- **Extracting WorkflowKit from the cache and carving the string section.** Xcode's
  `dsc_extractor.bundle` rebuilds the framework in seconds (it exports one function,
  `dyld_shared_cache_extract_dylibs_progress`, callable from a small C program). The action
  strings then appear in the C-string section in roughly definition order, but the linker
  deduplicates identical strings, so an action's identifier can sit far from its block and a
  linear parse misattributes entries. Abandoned.
- **Calling the `+actionDefinitionFor…` methods directly.** They return void and register into
  private state; one of them crashes when invoked outside the registry's own initialisation.

### What worked

Load the engine into a process and ask the same object Shortcuts.app asks:

1. `dlopen` ActionKit, then WorkflowKit. Both resolve from the shared cache; no extraction, no
   SIP changes. The process must be an Apple platform binary (see the next section), so the
   probes are JavaScript for Automation run by `osascript`.
2. `[[WFBundledActionProvider alloc] init]`, then `-availableActionIdentifiers` (392 on macOS 27:
   339 from WorkflowKit plus 53 that ActionKit registers when it loads) and
   `-actionDefinitionsWithIdentifiers:`, which returns a dictionary of `WFActionDefinition`
   objects keyed by identifier. `WFIntentActionProvider` adds Apple's SiriKit custom intents
   (Apple Watch settings, Accessibility toggles, a Notes folder intent): it has no definitions
   call, so `-createAllAvailableActions` is walked and each action's `definition` taken. It also
   lists intents of installed App Store apps (Keynote, Pages); those are skipped, keeping only
   intents whose app resolves under `/System` or to no app at all. 434 definitions in total.
3. Unwrap. `WFActionDefinition`, `WFParameterDefinition` and `WFActionDescriptionDefinition` are
   each a wrapper around one `NSDictionary` ivar. `WFParameterSummary` and
   `WFParameterSummaryValue` expose their format string, title, possible values, and the
   parameter values that select each variant. Every human-readable field is a
   `LocalizedStringResource` bridged to ObjC; its English default is read from the object's
   description.
4. Serialise to JSON. Enumeration parameter choice lists (`Parameters[].Items`) are Swift
   arrays of `LocalizedStringResource`; the bridge exposes them as `NSArray`, so each element
   is resolved to its English default like any other localized field. (The earlier compiled
   probe could not see into them and left their description for `render-builtin-actions.py`
   to parse, which is why that script still accepts the string form.)

The method names above were found with the ObjC runtime, `class_copyMethodList` and
`class_copyIvarList`, on the classes named in the binary. They are private API and can change
with any macOS release. If the extractor fails, re-dump the method lists of
`WFBundledActionProvider`, `WFActionDefinition`, and `WFParameterSummary` and adjust
(`methodNames()` in `tools/jxa-prelude.js` does this from JXA).

### ActionKit and the platform-binary requirement

The first extraction ran a compiled probe in an ordinary process and got 339 definitions. That
was wrong by 53, and the missing ones were not obscure: Ask for Input, Show Alert, Count,
Choose from List, Date, Format Date, Get Clipboard, URL and Get Dictionary Value were all
absent. Those actions are not implemented in WorkflowKit. They live in ActionKit.framework as
`WFAskForInputAction`, `WFAlertAction`, `WFCountAction` and so on, each backed by an App
Intent, and ActionKit registers them with `WFBundledActionProvider` when it loads.

ActionKit does not load into an ordinary process. `+[WFActionKitStaticInitializer load]` reads
the host's code-signing flags and aborts unless `CS_PLATFORM_BINARY` is set ("Assertion
failed: (platformBinary)"). A platform binary, in turn, refuses to map any code that is not
itself platform-signed, so a compiled helper cannot be loaded into one either. The way through
is `osascript`: it is a platform binary, it has no library validation, and JavaScript for
Automation can `dlopen` frameworks (`ObjC.bindFunction("dlopen", …)`) and call Objective-C
through its bridge. With ActionKit loaded there, the same provider call returns 392.

Two bridge limitations shaped the probes. The JXA `Class.alloc.initWith…` chain does not
resolve initializers of these private classes even though the instances respond to them, so
`tools/jxa-prelude.js` creates objects with `objc_msgSend` on raw pointers (`make()`,
`makeBool()`, `makeUInts()`). And bridged objects are callable proxies (`typeof` reports
`"function"`), 64-bit integers come back as strings, and Swift-backed arrays report `count`
as a string; the prelude's `isObj()`, `count()` and `Number()` calls exist for that.

Of the 411 `is.workflow.actions.*` identifier strings in the shared cache, 392 now have
definitions. The remaining 19 are accessor and variant identifiers (`image.rotate.left`,
`getstartdate`, `runworkflow.WFInput`, a `detect.dicionary` typo) and retired integrations
(`dropbox.*`, `alarm.*`) that no provider offers on macOS.

### Caveats

- Reflects the Shortcuts engine on the Mac that ran it, so iOS-only actions do not appear.
- 392 definitions versus 411 identifier strings: the difference is property accessors,
  deprecated actions, and platform variants the provider does not offer (see the ActionKit
  section above for the list).
- `RequiredResources` entries (device idiom, capabilities, Apple Intelligence access) have no
  dictionary form. They are emitted as `{"resource": "<class>"}` plus any plain-valued ivars.
- Actions contributed by apps through App Intents are not here. Those come from each app's
  `Metadata.appintents/extract.actionsdata` bundle, generated by Xcode at build time and
  indexed by the system on install.

### Apple's App Intents, from the Shortcuts app's own registry

Most of what a user sees in the Shortcuts editor beyond the built-ins is App Intents: Create
Reminder, Create Note, the System Settings toggles, Photos, Mail, Safari. Their metadata ships
on disk in each bundle's `Metadata.appintents/extract.actionsdata`, but that file does not say
which identifier Shortcuts writes (Reminders' intents live in `RemindersAppIntents.framework`,
yet the file uses `com.apple.reminders.…`), and it lists intents Shortcuts never offers.

The authoritative registry is kept by `linkd`, the App Intents daemon. It refuses every caller
without the `com.apple.linkd.registry` entitlement, which only Apple-signed code can carry;
WorkflowKit's `WFAppIntentsMetadataProvider` returns nothing even from osascript. But
Shortcuts 10 indexes every action it can offer, from every provider, as a "tool" for its
model features, into `~/Library/Shortcuts/ToolKit/Tools-prod.*.sqlite`, written by
`BackgroundShortcutRunner`, an entitled Apple process. That index is linkd's registry in
readable form. `tools/dump-toolkit-registry.py` reads it:

- `Tools`: the exact `WFWorkflowActionIdentifier`, the provider that serves it
  (`WFBundledActionProvider`, `WFIntentActionProvider`, `WFInterchangeActionProvider`,
  `WFLinkActionProvider`), the owning app (`ContainerMetadata`), visibility flags, and the
  snake_case `pythonName` the app assigns (`reminders_create_reminder`), which the catalogue
  uses as the key.
- `Parameters`, `ToolParameterTypes`, `Types`: each parameter's key and value type. Primitive
  types are a small protobuf whose tag byte is the field number of the type that is set; the
  mapping (string, bool, int, double, date, URL, rich text, file, person, …) was verified by
  joining the index against the apps' own `extract.actionsdata`. Entities carry bundle and
  type name; enumerations list their cases (`EnumerationCases`: the case id that is stored and
  the title the app shows).
- `ToolLocalizations`, `ParameterLocalizations`: English names, output names and descriptions,
  including for the ActionKit built-ins whose engine definitions have no `Name`, no
  `OutputName` and no `Parameters` list (`Ask for Input`, `Combine Text`: they declare
  parameters in code). `tools/annotate-builtin-actions.py` fills the name and each enumeration's cases into the
  definition, marked `NameSource` and `Source: "ToolKit"`; enumeration entries only for keys
  the run-time walk reports. Output names come from the engine instead: each created action
  answers `-outputName` ("Provided Input" for Ask for Input, where the registry's result label
  is the action's own name), recorded as `actionOutputNames` by the encodings probe and marked
  `OutputNameSource: "WFAction"`. Where a definition already names its output the definition
  wins; the action object's answer can follow the default parameter (Get Battery Level says
  "Battery Level", Statistics says "Average").

The committed `data/apple-app-intents.json` keeps the `WFLinkActionProvider` tools whose
container is an Apple bundle; those ship with macOS. The full index, third-party apps
included, is written locally to `data/toolkit-registry.json`. The index also shows what the
provider calls cannot: seven built-ins (`appendnote`, `deletephotos`, `filter.notes`, …) are
now served through App Intents and appear only there, and fifteen catalogue entries (control
flow, retired integrations) are not offered in the editor at all.

**What the registry is trusted for.** It is the app's index for its model tooling, not a
copy of what Shortcuts writes into files, so each column is used only where it was checked:
identifiers (against Apple's gallery files and the on-disk metadata), parameter keys and
enumeration case ids (every list with an engine default was checked: the default is one of
the cases, 93 of 93), display names, and descriptions. Its result label is not the editor's
output name (for Ask for Input it is the action's own name, the editor writes "Provided
Input"), so output names come from the engine's action objects wherever the engine can
answer, and for App Intents from the tool's result label or its output type's display name
("Reminder"). Whenever the engine can produce a value, the engine wins; the registry fills in
only what the engine cannot say. `annotate-builtin-actions.py` re-checks the enumeration
lists on every refresh and warns on a mismatch.

Requirement: Shortcuts.app must have run once on the extracting Mac so the index exists. The
`toolKit` field of `data/provenance.json` records which index version was read.

## Parameter value encoding

A `.shortcut` file is a plist: an array of actions, each with `WFWorkflowActionIdentifier`
and a `WFWorkflowActionParameters` dictionary keyed by the parameter keys from Part 2. The
definitions say which keys exist and which parameter class each uses; they do not say how a
value is written. That is decided one level down.

### Where it is defined

Every `WFParameter` subclass answers `-singleStateClass`. The state class implements
`-serializedRepresentation` and `-initWithSerializedRepresentation:variableProvider:parameter:`.
Those two methods are the encoding. `extract-parameter-encodings.js` creates all 392 actions
through `WFBundledActionProvider` (`-createAllAvailableActionsIncludingMissingActions:YES`, so
iOS-only actions are included), walks their parameters, and records parameter class, state
class, and each parameter's `-defaultSerializedRepresentation`. Result: 98 parameter classes
resolve to 47 state classes (52 and 31 before ActionKit was loaded; 70 of the original
actions also gained parameters whose classes ActionKit defines).

### The general shapes

Most state classes are "substitutable": the value is either a plain plist value or a token
that resolves at run time. Observed in a Mac's library (`dump-library-encodings.py`):

- Plain values: string, integer, boolean, real, array of strings. Enumerations are the choice
  label as a string. Switches are booleans. A `UUID` string identifies the action so later
  actions can reference its output.
- A reference to something dynamic is a `WFTextTokenAttachment`:
  `{"WFSerializationType": "WFTextTokenAttachment", "Value": {"Type": T, ...}}` where `T` is
  `ActionOutput` with `OutputUUID` and `OutputName`, `Variable` with `VariableName`,
  `ExtensionInput` for the shortcut's input, `Ask` to prompt at run time, or `Clipboard`.
- Text with embedded references is a `WFTextTokenString`:
  `{"WFSerializationType": "WFTextTokenString", "Value": {"string": "…\ufffc…",
  "attachmentsByRange": {"{offset, 1}": attachment}}}`. Each U+FFFC in the string is a
  placeholder; the dictionary maps its range to the attachment that fills it.
- A variable-picker parameter wraps an attachment as `{"Type": "Variable", "Variable": {…}}`.
- Specialised shapes exist for quantities (`WFQuantityFieldValue`), dictionaries
  (`WFDictionaryFieldValue`), contacts (`WFContactFieldValue`), colors, locations, and file
  bookmarks. Their state classes are listed in `docs/parameter-encodings.md`.

### Ground truth

The library database, `~/Library/Shortcuts/Shortcuts.sqlite`, stores each shortcut's action
list as a binary plist in `ZSHORTCUTACTIONS.ZDATA`. Reading it is the fastest way to see a real
encoding for any parameter: build the action once in the app, then dump it. A shortcut that
runs a script on the current Safari page, for example, is a single `runjavascriptforautomation`
action whose `Script` is a plain string and whose `Input` is an `ExtensionInput` attachment.

### Signing

Shortcuts refuses unsigned files. `shortcuts sign --mode anyone --input in.shortcut --output
out.shortcut` produces an importable file; opening it hands it to Shortcuts.app. Signing needs
an iCloud login on the Mac, so it cannot run on GitHub-hosted runners; CI stops at the unsigned file.

## Building shortcuts

`docs/shortcut-file-format.md` is the full format reference. `src/` implements
it: a small library plus a `demo` command that writes, validates and signs a shortcut.
Validation checks every built-in identifier and parameter key against `data/builtin-actions.json`.

### How the remaining gaps were closed

- **Envelope.** Apple ships seven complete `.wflow` files in WorkflowKit's `Gallery.bundle`.
  Every top-level key came from there, cross-checked against the columns of the library
  database and against key strings in the framework.
- **Encodings, definitively.** `extract-encoding-table.js` constructs each variable kind
  (`WFActionOutputVariable`, `WFUserDefinedVariable`, `WFShortcutInputVariable`, …), a
  `WFVariableString` with embedded variables, and each state class via its own
  constructors (`initWithValue:`, `initWithNumber:`, `initWithVariable:`,
  `initWithVariableString:`), then calls `serializedRepresentation`. No guessing.
- **Control flow.** Grouping identifier plus mode 0/1/2, observed in the library and the
  gallery for If, Otherwise, Repeat with Each, Repeat, and Choose from Menu.
- **Condition codes.** 100/101 from `supportedComparisonOperators` on the subject states;
  99 and 1002 from the gallery's filter templates; 0 and 2 from the library; the rest from
  community documentation, marked as such in the format reference. The operator labels are not
  in any strings table on disk, so they could not be read back from the framework.
- **App Intents actions.** The gallery's Summarize Text and Notes actions show the on-disk
  form; `dump-appintents-actions.py` builds the same identifier and descriptor for every
  installed app from its `Metadata.appintents` bundle. The live provider path
  (`WFLinkActionProvider` over `WFAppIntentsMetadataProvider`) returns nothing from an
  ordinary process because the metadata daemon does not answer unentitled clients.
- **Icon palette.** `WFWorkflowIcon` constructed with palette colors 0–14 and asked for
  `backgroundColorValue`.

### What is still approximate

- Condition codes 1, 3, 4, 5, 8, 9, 999, 1000, 1001, 1003 rest on community documentation.
  Every observed use agrees with it; none contradicts it.
- The generator emits the legacy single-condition If. Shortcuts migrates it on load. Multi-
  condition If needs the `WFConditions` template, which the format reference documents but the
  helper does not yet build.
- Specialised value dictionaries (contacts, locations, file bookmarks, colors) are documented
  from examples rather than exhaustively.
