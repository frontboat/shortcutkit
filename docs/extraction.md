# How the data was extracted

Everything in `data/` comes from the Shortcuts engine on a Mac. This is how, including what
did not work.

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
  strings but nothing else (still written locally to `data/builtin-action-identifiers.txt`).
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
   lists intents of installed App Store apps; those are skipped, keeping intents whose app
   resolves to no app at all, under `/System`, or to a `com.apple.` bundle identifier. The last
   test was added for Keynote, Numbers and Pages, which come preinstalled but live in
   `/Applications` with an App Store receipt: a `/System`-only rule dropped their fifteen SiriKit
   intents (nine the editor lists, six the index hides as iOS-only) while the registry route below
   kept the same apps' App Intents. 449 definitions in total.
3. Unwrap. `WFActionDefinition`, `WFParameterDefinition` and `WFActionDescriptionDefinition` are
   each a wrapper around one `NSDictionary` ivar. `WFParameterSummary` and
   `WFParameterSummaryValue` expose their format string, title, possible values, and the
   parameter values that select each variant. Every human-readable field is a
   `LocalizedStringResource` bridged to ObjC; its English default is read from the object's
   description.
4. Serialise to JSON. Enumeration parameter choice lists (`Parameters[].Items`) are Swift
   arrays of `LocalizedStringResource`; the bridge exposes them as `NSArray`, so each element
   is resolved to its English default like any other localized field. (`render-builtin-actions.py`
   still accepts the string form an earlier probe left.)

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
- `RequiredResources` entries (device idiom, capabilities, Apple Intelligence access) have no
  dictionary form. They are emitted as `{"resource": "<class>"}` plus any plain-valued ivars.
- App Intents actions are not among these definitions; the next section covers them.

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
  parameters in code). `tools/annotate-builtin-actions.py` fills the name, each enumeration's
  cases, and each parameter's label and description into the definition, marked `NameSource`,
  `LabelSource`, `DescriptionSource` and `Source: "ToolKit"`; parameter entries only for keys
  the run-time walk reports, and `diff-data` does not count them as parameters. Output names come from the engine instead: each created action
  answers `-outputName` ("Provided Input" for Ask for Input, where the registry's result label
  is the action's own name), recorded as `actionOutputNames` by the encodings probe and marked
  `OutputNameSource: "WFAction"`. Where a definition already names its output the definition
  wins; the action object's answer can follow the default parameter (Get Battery Level says
  "Battery Level", Statistics says "Average").

The committed `data/apple-app-intents.json` keeps the `WFLinkActionProvider` tools whose
container is an Apple bundle; those ship with macOS. Two groups are left out (281 on macOS
27): tools with `visibilityFlags` 0, which is what the editor on this Mac does not offer
(among built-ins: iPad-only Stage Manager, the retired Watch Me Do; among App Intents:
internal helpers such as "Fetch Contact Avatars", a Photos "workaround" intent, and every
widget, control and Live Activity configuration intent, whose system protocols say so:
`SystemToolProtocols`, see Apple's "App intent types" page); and the 135 intents linkd marks
not discoverable (`data/linkd-actions.json`), Siri-only intents the app refuses to import. The
four Focus-filter intents also carry a configuration protocol, but the index shows them and so
does the editor, so they stay. What those rules and the other probes' rules leave
out of the editor's list, and which of the hidden tools still work, is in
[the coverage section](#what-the-editor-shows-that-the-catalogue-does-not). 473 of the remaining entries carry the
`synthesizedTool` protocol: "Get …" and "Update …" actions Shortcuts derives from an app's
entities (most of the System Settings ones); they are offered in the editor and kept, and
marked `synthesized` in the data. The full index, third-party apps
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

**App Intents parameter encodings, from the engine.** The link action provider cannot build
an App Intents action without linkd: its only metadata source, `LNMetadataProvider`, is an
XPC client of the daemon, and there is no local parser of `extract.actionsdata` reachable
from a client. But the value encoding does not live in linkd. WorkflowKit maps each
LinkMetadata value type to one of its own parameter classes
(`-[LNValueType wf_parameterDefinitionWithParameterMetadata:]`), and both the value types
(`+[LNPrimitiveValueType stringValueType]`, `dateValueType`, …, `LNEntityValueType`,
`LNLinkEnumerationValueType`, `LNArrayValueType`) and the parameter metadata
(`-[LNActionParameterMetadata initWithName:valueType:optional:title:resolvableInputTypes:typeSpecificMetadata:]`)
are constructible locally. `extract-encoding-table.js` does that for every value type and
records the class as `appIntentValueTypes` (the table is in the
[format reference](shortcut-file-format.md#2-actions); arrays use their member's class). The
registry dump stamps each App Intent parameter with that class, and the generator derives the
kind from it exactly as for built-ins. The SiriKit-era types (`LNIntentsValueType`) take the
numeric identifier the apps' metadata uses: app (0) is `WFAppPickerParameter`, file (12)
`WFFilePickerParameter` (a file bookmark dictionary on disk), payment method (13) and
currency amount (14) their own classes; person (3) and the entity-like ones (calendar event,
note, task, media item, …) have no WorkflowKit parameter class at all. 4,563 of 4,989
parameters carry an engine class; file and app parameters keep the kind `any` because their
values are dictionaries, and people, arrays of people and a few unknown tags stay untyped.
Apple's developer documentation for these types (`tools/fetch-apple-docs.py`: `IntentFile`,
`IntentPerson`) describes what the app receives, not the on-disk form; that comes from the
engine. The gallery confirms the on-disk form: values are plain, not wrapped
(`summaryType: "createKeyPoints"`, `text` as a `WFTextTokenString`).

Requirement: Shortcuts.app must have run once on the extracting Mac so the index exists. The
`toolKit` field of `data/provenance.json` records which index version was read.

### What the editor shows that the catalogue does not

The editor's action list is that same index, so "is everything in the editor writable?" is a
diff, not a scroll: `tools/audit-catalogue-coverage.py` lists every indexed tool the editor
shows (`visibilityFlags` other than 0) that the catalogue lacks, with the rule that left it out,
and fails on one no rule explains. On macOS 27 the editor shows 1,914 tools. The first audit,
against a catalogue of 1,883 entries, found 68 missing under four rules, two of them wrong:

- **Third-party apps** (25 here, from two installed apps): by design, since the catalogue covers
  Apple's apps; `action()` takes them untyped.
- **Configuration-only intents** (4: the Messages, Safari, Calendar and Mail Focus filters):
  `dump-toolkit-registry.py` dropped intents whose system protocols are widget, control, Live
  Activity or Focus configurations. The index itself hides every widget, control and Live
  Activity configuration (`visibilityFlags` 0), so the rule only ever removed these four, which
  the index flags visible like any other action. Checked in the editor: Mail's category lists
  "Set Mail Focus Filter" under a "Focus" heading. Fixed: the dump records the protocols but
  no longer filters on them, and the four are in the catalogue.
- **Legacy interchange actions** (30: Bear, Tweetbot, WhatsApp, Add PDF to Books): served by
  `WFInterchangeActionProvider`, which no probe enumerates. The provider lists 56 and the
  engine marks each unavailable until its app is installed. The one Apple entry, Add PDF to
  Books (`com.apple.iBooksX.openin`), is offered by the editor on a Mac and is the one visible
  Apple action the catalogue lacks; the other 29 are not installed here.
- **SiriKit intents of Apple apps outside /System** (9: Keynote's Open Presentation and Play
  Presentation in Show Mode, Numbers' Create Spreadsheet from Template, Pages' Open Document,
  ...): the definition probe kept only intents whose app is under `/System`, on the assumption
  that anything else is an App Store app; Keynote, Numbers and Pages come preinstalled but live
  in `/Applications` with an App Store receipt. Fixed: `isSystemBundle()` in the prelude also
  accepts `com.apple.` bundle identifiers, which adds the nine and six index-hidden iOS-only
  twins (449 definitions). Both kinds import: a shortcut on Keynote's Create Presentation from
  Theme and one on the index-hidden `KNiOSOpenAnyDocumentIntent` were accepted by the import
  sheet, as every hidden built-in is. A CI runner has no iWork, so its engine marks them
  missing, which the verifier reports rather than fails.
- **Siri flow tools** (53, found later: `toolType` `flowTool`; 37 named `…Tool|<bundle id>`,
  such as Music's `PlayMusicTool|com.apple.Music`, and 16 without the suffix, such as Maps'
  `WhoAmITool`): the index lists them visible and linkd has no action metadata for them, so
  the first catalogue kept them. The editor's Music category does not list them, and a file
  that uses one imports but the action shows as "Unknown Action" and does not run, tried with
  the catalogue's descriptor, the corrected intent name and the bare identifier (macOS 27,
  2026-10-27). `dump-toolkit-registry.py` now leaves out every `flowTool`.

With the two rules fixed, every app group the editor lists on this Mac (App Store, Apple
Intelligence, Books, ... Weather: 41 groups) maps to catalogue entries, apart from the two
third-party apps; the groups with no index container of their own (Apple Intelligence,
FaceTime, Terminal, Disk Utility, Passwords, Mission Control, Time Machine) are built-ins and
System Settings or AppKit intents that the editor files under the app's name.

The index's hidden tools (`visibilityFlags` 0) stay out except the hidden built-ins, which the
catalogue keeps so that old files still reproduce (iPad-only Stage Manager, the retired Watch Me
Do, the pre-Apple-Intelligence Get What's On Screen). Every hidden built-in is served by the
engine on this Mac, so the question was whether hidden means unusable or merely unlisted.

**Hidden actions, tested.** Two shortcuts were built with the library, signed and imported.
One used the hidden built-in `is.workflow.actions.getonscreencontent` (the old Get What's On
Screen, disabled only on visionOS, `RequiredResources` photo access): it imported, and
`shortcuts run` ran it and wrote its output. The other used Reminders'
`GetDefaultListAppIntent`, hidden in the index, with the same `AppIntentDescriptor` the
catalogue would write: the app refused it with "This shortcut can't be imported because it
contains features not supported on this device". Nothing in the engine explains the refusal:
`-[WFWorkflowFile initWithDictionary:name:performMigration:]` loads it,
`-recordRepresentationWithError:` converts it with no error, `importQuestions` is empty, the
action's `disabledOnPlatforms` is empty and it has no required resources; the host cannot
build the Link action itself (above), but `action-metadata.js` shows linkd's availability
annotations allow every platform. The one thing linkd says differently about it is its
visibility metadata: `isDiscoverable` NO. A third shortcut tested that reading with a catalogue
entry, Books' `OpenMostRecentBookIntent` (`books_open_most_recent_book`), which linkd marks
not discoverable and `assistantOnly`: refused with the same message. So the rule the app
applies at import is linkd's discoverability, not the index's visibility, and the check lives
in the app's import step (`-[WFLinkActionProvider createActionsForRequests:allowsActionInDenyList:]`
and `+[NSError(WFUnsupportedOnPlatform) wf_unsupportedActionErrorWithType:platformIdiom:]` are
the WorkflowKit symbols on that path; the message is WorkflowKit's string).

**What that meant for the catalogue.** Of the 1,500 App Intents entries the first audit saw,
776 had linkd action metadata (`action-metadata.js` over every Apple bundle the index knows),
and 135 of those were `assistantOnly` and not discoverable: Siri-only intents such as Reminders'
Open List, News' Start Cooking, Books' Play Most Recent Audiobook, and Clock's and Photos'
assistant twins of ordinary actions (`PhotosCropAssistantIntent` beside `CropIntent`). A file
that uses any of them does not import. Among the tools that have action metadata,
`assistantOnly` is exactly `visibilityFlags == 2` in the index (135 of 135, none of the 641
discoverable ones), but the same value is normal for the synthesized entity tools and the flow
tools, which do import, so the index alone cannot name them. They now leave the catalogue by
linkd's word: `bun run extract-filters` saves the payload's output as `data/linkd-actions.json`
(committed) and `dump-toolkit-registry.py` drops every tool it marks not discoverable, counting
them in its summary, with a warning when the file is absent. The bundle list the payloads take
comes from the full local index, not from the committed catalogue, since the catalogue is what
they filter; deriving it from the catalogue shrank the next run by ten actions. The entries
without action metadata are the synthesized Get/Update/Find tools (keyed by entity), the flow
tools, the SiriKit intents the definition probe serves, and a few whose linkd bundle differs
from the index's (System Settings deep links); they are untouched.

One of the 135 had been the catalogue's own Create Note. The index gives the same key,
`notes_create_note`, to three tools, and the generator's dedupe had chosen
`com.apple.Notes.CreateNoteIntent`, the Siri-only one, over `com.apple.mobilenotes.SharingExtension`
because the latter's identifier looks like a variant. The editor writes the SharingExtension
identifier (a shortcut built in the editor and read from `~/Library/Shortcuts/Shortcuts.sqlite`
shows it), with `contents` where the Siri intent had `content`; the README example and the
fixtures now write that. Removing the Siri-only entries also removes the 21 entity types only
they output (Music's `SiriEntity` family): 413 entity types and 752 properties remain, and the
Find filters are unchanged at 150 actions and 403 properties.

A Find action's rows ("Date is in the last 7 days", "Sender is …") and a reference to one
property of an entity ("Message's Body") depend on the entity type, which the action catalogue
does not describe. The index does: `EntityProperties` lists each entity's properties with a
protobuf type blob, `EntityPropertyLocalizations` their names, and `PredicateTemplates` (keyed
`builtin.query.<entity>`) the comparisons its query supports. ToolKit's own classes decode the
blobs (`-[CCToolKitToolTypeInstance initWithData:error:]`,
`CCToolKitToolTypeDefinitionVersion1QueryPredicateTemplates`, then `jsonDictionary`).
`dump-toolkit-registry.py --entities` exports them for the 434 entity types Apple's actions
output or find, and `extract-entities.js` writes `data/apple-entities.json`.

The index says which comparisons exist, not how a row is written. WorkflowKit does, and it
needs no linkd for it. From the decoded properties the probe builds the LinkMetadata objects
linkd would send (`LNPropertyMetadata`, `LNQueryParameterMetadata` with one
`LNQueryParameterComparatorMetadata` per comparison, `LNQueryMetadata`, `LNEntityMetadata`),
and `-[LNEntityMetadata wf_contentItemClassWithEntityValueType:queryMetadata:appBundleIdentifier:displayedAppBundleIdentifier:]`
returns the entity's content item class (`WFLinkEntityContentItem_com.apple.MobileSMS_MessageEntity`),
the same one the editor uses. Each of its properties reports:

- its editing parameter (`parameterDefinition`), which decides the row's value key: a text
  field writes `String`, a number field `Number`, a date field `Date`. Messages' sender is an
  enumeration marked `WFLinkEntityContentPropertyUserInfoIsContactHandleKey`, and Apple's files
  write it as `ContactHandle`;
- `allowedOperators`, from the query's comparators by `-[LNQueryParameterMetadata wf_supportedContentOperators]`
  (the probe checks each comparator type against the operator it stands for), with the date
  operators WorkflowKit adds itself. The index also lists "does not contain" for 104 text
  properties, which no comparator produces; the packages leave it out;
- `timeUnits`, an NSCalendarUnit mask: the units the editor's picker
  (`WorkflowKit.CalendarUnitPickerParameter`) offers for "is in the last".

A Find action on the class (`WFContentItemFilterAction` with that `WFContentItemClass`) then
loads one row per property and operator with a sample value. The row state must name the
same operator and hold every value key; 906 rows do. A property aggrandizement must find the
property on the class (`-[WFPropertyVariableAggrandizement processedContentClasses:]` is empty
for an unknown name); 662 of the 889 properties do. The other 227 are typed by an enumeration
or another entity, which WorkflowKit leaves off the class when it has no metadata for that
type; their identifiers come from the index alone.

The value forms come from the engine too. A date string under `Date` is dropped (it takes a
plist date or a reference), a bare reference under `String` is dropped (it takes a token
string), and a handle without a reference re-serializes as the plain string inside
`WFTokenStringParameterState`. The verifier compares what the engine serializes back against
what the library wrote, so a form the engine normalizes would fail it.

Built-in Find actions use the same rows, but their operator lists are computed in Swift with
no Objective-C entry point, and built-in properties report no `allowedOperators`. The next
section is how those lists, and the enum properties the index route cannot build, were read
anyway; the generator types `where()` from it (`engine_rows`).

### The engine's own filter rules: an engine host, lldb, and a loader shortcut

`bun run extract-filters` (`tools/extract-engine-filters.sh`, about 25 s) writes
`data/engine-filters.json` and `data/linkd-properties.json`; `--check` adds a ten-minute
cross-check against the real linkd. It is a separate, optional step because it needs the Xcode
Command Line Tools and a shortcut imported into the Shortcuts app. Three things stood in the
way, and each has its own tool.

**linkd refuses every process we control.** Apple's App Intents registry, linkd, serves its
metadata over XPC (`com.apple.linkd.registry`) and rejects callers without the entitlement of
that name: its log says `RegistryEntitlementAudit: com.apple.osascript (pid …) lacks
com.apple.linkd.registry`, and `swift` scripts are rejected the same way. Shortcuts.app,
siriactionsd and two of Shortcuts' XPC services (`BackgroundShortcutRunner`, `ShortcutsMacHelper`)
have it. The way in is a shortcut: the Run JavaScript for Mac Automation action runs its script
inside `ShortcutsMacHelper`, where `LNMetadataProvider` answers. `tools/linkd/loader.js` is that
script; it evaluates `~/.shortcutkit-dev/payload.js` and returns what it produces.
`tools/linkd/build-loader.ts` wraps it in a signed shortcut named `SK <sha256 of the script>`
(importing a changed shortcut under an existing name confuses the app's run queue, so every
version gets a new name), and `tools/linkd/run-payload.sh` runs any payload through it from the
terminal after one run from the app has answered the JavaScript permission prompt. The helper is
sandboxed but writes to the user's home, so long payloads stream progress to
`~/.shortcutkit-dev/linkd/` and resume from it. A payload that hangs blocks every later run until
`killall siriactionsd`. The helper has WorkflowKit loaded but not ActionKit, and loading
ActionKit or touching `WFActionRegistry` there deadlocks, so the payloads only read metadata and
build entity classes.

Three payloads exist. `archive-metadata.js` saves linkd's `LNEntityMetadata`, `LNEnumMetadata` and
`LNQueryMetadata` for every Apple bundle as keyed archives (79 bundles, 7 s); everything below
runs against those archives, outside the helper. `action-metadata.js` saves what linkd says
about each action (`LNActionMetadata`: availability annotations per platform, `isDiscoverable`,
`assistantOnly`, deprecation) for every Apple bundle to `actions.json`, 1,193 actions in a few
seconds; it is what established the import rule under
[coverage](#what-the-editor-shows-that-the-catalogue-does-not). Payloads must call only getters
they know: reading every property of linkd's metadata objects reflectively crashed the helper
("Couldn't communicate with a helper application" from the loader shortcut), and after a crash
`killall siriactionsd ShortcutsMacHelper` is needed before the next run. `resolve-properties.js` is the cross-check
(`--check`): it builds each entity's class from the real metadata inside the helper, over XPC
to linkd, and asks which content a property reference to each of its properties yields, in
about ten minutes; `tools/compare-linkd-properties.py` requires its answers to match the
host's, and they do on all 889. It also shows that linkd's queries carry no parameters at all
(`MessageQuery` has none), so the editor's Find filter rows come from the index's
`PredicateTemplates`, which is what `where()` already uses.

**The filter rules are private Swift.** Which properties of a class the editor offers, which
operators each one gets, and which of those survive a bounded filter are three static functions
of `WorkflowKit.RowTemplateFindFilterParameterState`: `filterableProperties(for:)`,
`possibleOperators(contentItemClass:contentProperty:bounded:)` and `subjectType(contentProperty:)`.
They are not exported, so nothing can `dlsym` them, and they take Swift calling conventions
(`self` in x20 for the operators' `contentOperator` getters). `tools/engine-host` is a small
Objective-C host, `skhost`, that loads the three frameworks and runs a JXA probe through OSAKit,
with C functions the probe can bind: `sk_describe(class)` calls the three functions and returns
each property's subject type and operator list, each operator as its code (from the protocol's
`contentOperator` getter, called through a 14-instruction trampoline, `trampoline.s`) and its
Swift type name (`IsEqualOperator<RowTemplateStringValueType>`), whose generic argument names
the row's value type. `run.sh` runs the host under lldb for two reasons: lldb reads the shared
cache's private symbol table and writes the seven addresses into the process (`addresses.py`)
before anything runs, and a breakpoint returns from `+[WFActionKitStaticInitializer load]`
before its platform-binary assertion (it checks `SecTaskGetCodeSignStatus` for
`CS_PLATFORM_BINARY`), so ActionKit's content item classes load into a non-platform process.
That assertion is all the initializer does; the check cannot be interposed because the SDK
marks `SecTaskGetCodeSignStatus` unavailable and the dyld interpose section needs it by address.

**WorkflowKit needs linkd to build enum properties.** Building an entity class with an
enum-typed property makes WorkflowKit ask `LNMetadataProvider` for the enum's metadata, which
it cannot get here. With `SK_LINKD_DIR` set, the host replaces seven `LNMetadataProvider`
lookups (`entitiesForBundleIdentifier:error:`, `enumsForBundleIdentifier:error:`,
`entityForBundleIdentifier:withEntityIdentifier:error:`, `queriesWithError:` and three more)
with answers from the archives, and the classes come out whole: 256 filterable properties across
the 434 entities, against 147 the index route types, the 80 enum-typed ones among them.
`tools/extract-engine-filters.js` runs this for every entity (built exactly as
`extract-entities.js` builds it) and for the 30 content item classes the built-in Find and
Filter actions name in their definitions (`WFContentItemClass`): 294 filterable properties with
their operators, which `data/apple-entities.json` has nothing on. Running the probe again from
the committed tools reproduced the first results exactly. `generate-action-catalog.py` types
`where()` from these lists (`engine_rows`): 14 built-in Find and Filter actions and 136 App
Intents Find actions, 403 properties, against 75 actions and 147 properties from the index
route. Each operator's Swift value type names the row's kind; a string row's key follows the
property's value class. Two more facts came out of verifying the generated rows against the
engine. A bare reference under `Enumeration` is read, but as a `WFINSpeakableStringSubstitutableState`,
a different state class from the one the plain value takes; the library wraps a reference in the
row's own state class (`WFStringSubstitutableState`, `WFLinkEnumerationSubstitutableState`), which
round-trips. And Find Calendar Events replaces any filter lacking a bounded Start Date row (one of
is, is today, is between, is in the next, is in the last, marked `Bounded`, with
`WFContentPredicateBoundedDate` true) with its default row: the engine's default filter for the
action, in `actionDefaults` of `data/parameter-encodings.json`, is where the requirement shows, and
`BOUNDED_FILTERS` carries it to `action()`.

**The app builds entities from linkd, not from the index, and the two differ.** The same probe
in its `linkd` mode builds each entity the way the Shortcuts app does, from linkd's own
`LNEntityMetadata` and `LNQueryMetadata`, and writes `data/linkd-properties.json`: the engine's
rules for that class, what each property reference yields (866 of the 889 properties resolve;
the 23 left are Notes', whose linkd metadata names properties by their titles), and the type's
queries. Against the index-built classes, 114 of the 434 entity types come out the same and
320 differ: the linkd-built class has filterable properties the index-built one lacks in 196
types (Call History's Message gets duration and isRead beside date, Clock's Alarm gets enabled)
and the same properties with other operators in 123. Two facts about the engine fell out of
that work. The engine registers one content item class per type name
(`WFLinkEntityContentItem_<bundle>_<type>`), so building a type a second time in one process,
from other metadata or another query, silently returns the first class; `extract-engine-filters.sh`
therefore runs the host once per mode and once more per extra query. And linkd knows several
queries for five types (Contacts' `ContactEntityQuery` and `ContactEntityIDPassthroughQuery`,
Stocks' `SymbolQuery` and `SymbolNotInWatchlistQuery`, …), and the class depends on the query:
Contacts gets emailAddresses and phoneNumbers filters from the first and none from the second.
The index records which query each entity-typed parameter was indexed with, inside the
parameter's `typeInstance` (`dump-toolkit-registry.py --entities` reads it into `queries`), and
the host builds that one first (`query`), the others in later passes (`byQuery`). For Contacts
and Music the index names one; for Stocks, Podcasts and Shortcuts' navigation it names both,
and which one a given Find action gets is open.

What the data says, beyond the lists themselves:

- A property's subject type is the value class's `+tableTemplateSubjectType` (ContentKit): 0
  for anything without its own (contacts, files, entities, enums), 1 Bool, 2 String (and rich
  text, URL, email address, phone number, location), 3 Number, 4 Date, 5 Measurement, 6 file
  size, 7 Duration and time interval, 9 App. `subjectTypes` in the data lists all 95 classes.
  Message bodies, event notes and URL properties are therefore plain string rows; the index
  route dropped them only because their editing parameter is a variable picker.
- The row value keys the engine reads are the raw values of
  `RowTemplateFindFilterParameterState`'s key types, read by calling their `rawValue` getters
  under lldb (`swiftcall.py`): `Bool`, `Date`, `AnotherDate`, `Email`, `Phone`, `Number`, `String`,
  `Unit`, `ByteCountUnit`, `MeasurementUnit`, `ContactHandle`, and `Enumeration` for four
  enumeration kinds (string, number, speakable string, and `EnumerationLinkValueKey`, the App
  Intents enum, whose value type is `LNDynamicOption`). String rows also carry a style (plain,
  URL, location, phone number, email address; `RowTemplateStringStyle`).
- Where the engine's lists and the index's can be compared (the 145 properties `where()`
  types), 143 agree.

**What each row key holds** was read two ways, both in the probe's `index` mode (`rowValues`
in `data/engine-filters.json`, with the two App Intents forms in `data/linkd-properties.json`).
A sample row per row value type is loaded as a filter through a Find action: every key must
come back as a parameter state and the row must serialize back. Then the same row goes through
the engine's own row model, the ObjC `WFRowTemplateValue` (string, email, phone, number, date,
anotherDate, enumeration, calendarUnit, byteCountUnit, measurementUnit, contactHandles), and
`WFContentPredicateForRowTemplateValue`, the C function the Find action evaluates with at run
time, which the host exposes as `sk_row_predicate` (lldb hands over its address like the Swift
ones). The comparison predicate's value shows what the engine compares with: a string property
whose value class is `WFEmailAddress` reads the row's `email` and ignores `string`, so its key
is `Email` (`Phone` for `WFPhoneNumber`, `String` for all else, URLs included); `ByteCountUnit`
codes 1, 2, 4, 8, 16, 32, 64 turn 5 into 5 bytes, 5 KB, 5 MB, 5 GB, 5 TB, 5 PB and 5 EB
(powers of ten); a duration's `Number` and calendar `Unit` 64 make 300 seconds. Built-in
enumerations take `Enumeration` as a `WFStringSubstitutableState` (choices: the property's
parameter `Items`, recorded as `items`; dynamic ones such as albums have none), App Intents
enumerations as a `WFLinkEnumerationSubstitutableState` whose value is the case identifier
(`cases` per property, from linkd's `LNEnumMetadata`, found by the value class name
`WFLinkEnumerationContentItem_<bundle>_<enum>`; 82 of the 84 enumeration properties, the two
left being System Settings' accent and highlight colors, whose enum linkd does not list for
the bundle). `MeasurementUnit` serializes an `NSUnit` as a keyed archive, read from
`WFMeasurementUnitSubstitutableState`; no filterable property uses it. `WFRowTemplateValue`'s
properties are `NSNumber`s, not integers: the first attempt passed raw codes and crashed inside
the engine.

Open, in order of how much they block: the 34 Bool properties, for which `possibleOperators`
returns nothing although the editor shows a switch, so another code path supplies the
operator; the index listing
properties and operators the engine does not (266 filterable against 256, and "does not
contain" on different properties); Messages' Sender, an email-address value that the string
row code rejects (`Unexpected property class WFEmailAddress`) while the editor offers "is";
Notes' title-named date rows, present in the index and absent from the engine; and the query
behind a Find action whose type has several (Stocks' Symbol gets name and symbol filters from
`SymbolQuery` and none from `SymbolNotInWatchlistQuery`). Each one is engine behavior not yet
reverse-engineered, not a disagreement to settle by rule.

When a macOS update renames the Swift symbols, `addresses.py` stops at launch and names the
missing one; `syms RowTemplateFindFilter` (`tools/engine-host/syms.py`, which walks the module's
symbol table; `image lookup` ends a batch session under Xcode 27's lldb) on a process that
loaded WorkflowKit finds the new names. `calls.py` (the selectors, functions and strings a
function references), `strs.py` (WorkflowKit's string tables) and `swiftcall.py` (call a Swift
getter and decode its String) are the lldb commands that found the current ones. A one-off
lldb session needs only a command file: import `addresses.py` and the helper, the two
breakpoints `run.sh` sets, `process launch -- <probe.js>`, then the command;
`tools/engine-host/syms.sh '<regex>'` does exactly that for `syms`, and `tools/jxa-probe.sh
probe.js` runs a one-off `run(argv)` probe under osascript with the prelude prepended, which is
enough for anything that does not need ActionKit's content item classes or linkd's archives.
`syms` with a regex over the method names of interest is how the import rule's candidates
(`-[WFLinkActionProvider createActionsForRequests:allowsActionInDenyList:]`,
`+[NSError(WFUnsupportedOnPlatform) wf_unsupportedActionErrorWithType:platformIdiom:]`) were
found. Other lldb habits that cost time under Xcode 27: `ReadCStringFromMemory` raises
`SystemError` (use `ReadMemory`), every message in an expression needs an `(id)` or `(void)`
cast, and after a crash in an expression the frame must be fetched again.

What the host cannot do yet: its `LNMetadataProvider` replacement serves entities, enums and
queries, not action metadata, so `-[WFActionRegistry createActionWithIdentifier:serializedParameters:]`
in the host returns a `WFMissingAction` for every App Intents action ("Failed to load
LNActionMetadata ... from metadata provider"); App Intents actions are checked against the
state-class table instead, and anything about a Link action object (its `disabledOnPlatforms`,
its required resources) has to come from `action-metadata.js` inside the helper. Serving
`actionsForBundleIdentifier:error:` from an archive the same way would close that.

## Parameter value encoding

The definitions say which parameter keys exist and which parameter class each uses, but not
how a value is written. That is decided one level down.

### Where it is defined

Every `WFParameter` subclass answers `-singleStateClass`. The state class implements
`-serializedRepresentation` and `-initWithSerializedRepresentation:variableProvider:parameter:`.
Those two methods are the encoding. `extract-parameter-encodings.js` creates all 392 actions
through `WFBundledActionProvider` (`-createAllAvailableActionsIncludingMissingActions:YES`, so
iOS-only actions are included), walks their parameters, and records parameter class, state
class, and each parameter's `-defaultSerializedRepresentation`. Result: 98 parameter classes
resolve to 47 state classes (52 and 31 before ActionKit was loaded; 70 of the original
actions also gained parameters whose classes ActionKit defines).

The shapes themselves are in the [format reference](shortcut-file-format.md#3-parameter-values),
and each state class is listed in [`parameter-encodings.md`](parameter-encodings.md).

### Ground truth

The library database, `~/Library/Shortcuts/Shortcuts.sqlite`, stores each shortcut's action
list as a binary plist in `ZSHORTCUTACTIONS.ZDATA`. Reading it is the fastest way to see a real
encoding for any parameter: build the action once in the app, then dump it. A shortcut that
runs a script on the current Safari page, for example, is a single `runjavascriptforautomation`
action whose `Script` is a plain string and whose `Input` is an `ExtensionInput` attachment.

### Round-tripping the library's own output through the engine

Unit tests only compare the library against its author's expectations.
`tools/verify-encodings.js` checks it against the engine: for every
parameter state class it feeds each value form the library can write (plain string, number,
bool, bare attachment, token string, the wrapped If subject) to the class's own
`-initWithSerializedRepresentation:variableProvider:parameter:` and reads
`-serializedRepresentation` back. A class that returns nil does not read that form, and the
editor shows an empty placeholder for it. The matrix is `data/encoding-roundtrips.json`, and the
pipeline fails if a form the library emits for a value kind is rejected by the state behind
it. It is how the picker mistake was proven: `WFVariableParameterState` accepts the bare
attachment and rejects `{Type: "Variable", Variable: …}`, which only the two conditional-subject
states accept; every text state rejects a bare attachment and accepts a token string.

### Loading everything the library writes through the engine

The round trip above checks value forms against state classes in isolation. `bun run verify`
(`test/verify/run.sh`, also a CI step) checks the library's actual output:

1. `test/verify/fixture.ts` and `test/verify/fixture.py` drive each package over every
   catalogue action, every parameter key and every value form the types admit: the plain
   sample (the engine's own default for the key when it has one, else its first choice), a
   token string with an embedded reference, and every reference helper (`ref`, `shortcutInput`,
   `variable`, `clipboard`, `currentDate`, `ask`, `deviceDetails`, `currentApp`), plus whole
   shortcuts built through every block helper (`if` in each form, `repeatEach`, `repeatCount`,
   `chooseFromMenu`, the share-sheet envelope). Forms the library refuses for a key are written
   raw too, so the refusal can be checked.
2. `test/verify/parity.py` diffs the two fixtures: the packages must write the same bytes.
3. `tools/verify-library-output.js` loads each case through the engine's own action object
   (`-copyWithSerializedParameters:`) and asks `-parameterStateForKey:` whether the value was
   read; App Intents actions, which cannot be built without linkd, are checked against the
   state-class round-trip table. Whole shortcuts go through
   `-[WFWorkflowFile initWithDictionary:name:performMigration:]`, which is how the app imports a
   file. A form the library refuses must not be read either, or the restriction is too tight.
   Find filters and property references on Apple's entity types load through each entity's
   content item class, built as in [the entity section](#apples-entity-types-properties-and-find-filters):
   every row must come back with its property, operator and value keys and serialize back as
   written, and every property aggrandizement must parse and find its property.

A case is one engine load of one value for one parameter key, not one action: the fixture
writes every value form a key admits, and each form is a case. On the macOS 27 data that is
1,332 actions, 4,219 action-and-key pairs and 38,378 cases, most of them the reference helpers
(about 4,200 each, since nearly every key reads a reference), then the plain samples and the
token strings. The `where()`, `property()` and `coerce()` checks are counted apart in the same
summary line: 5,182 filter cases (one per property, operator and value form on the 150 Find
actions), 752 property references, 22 coercions, and the whole shortcuts.

The verifier fails on any case the engine does not read. Three outcomes are reported rather than
failed, each counted and named in the summary: keys on actions the engine itself loads as
missing (`unavailableActions` in `data/parameter-encodings.json`, retired integrations such as
CloudApp, Dropbox and Slack, marked `Unavailable` in the definitions); plain values the engine
validates against the device (a locale identifier, a HomeKit home, a contacts group, a reminders
list), which no fixture can satisfy on every Mac; and keys with no engine data at all.

**Which references a key reads.** The first run of this verifier found the types too wide: the
Filter actions' sort keys, and a few enumerations, read no reference at all, and every variable
picker reads no Ask reference. The editor's picker list (`-supportedVariableTypes`, recorded as
`variableTypes`) turned out to be the wrong source, narrower than the engine for many
enumerations that offer only Ask yet read any reference. So `tools/extract-parameter-encodings.js`
now loads each of the eight reference kinds through every parameter and records the ones that
produce a state as `reads`, and a plain sample as `readsPlain`. The generator turns `reads` into
`PARAM_VARIABLE_TYPES` (only keys that read fewer than all eight, so an absent key reads any
attachment) and into the compile-time types: `Attachment<T>` is generic over the variable type,
each helper returns its narrow type, and a key's type names the references the engine reads for
it. `Shortcut.action()` applies the same table at run time in both packages.

## The rest of the format

### How the remaining gaps were closed

- **Envelope.** Apple ships seven complete `.wflow` files in WorkflowKit's `Gallery.bundle`.
  Every top-level key came from there, cross-checked against the columns of the library
  database and against key strings in the framework.
- **Encodings, definitively.** `extract-encoding-table.js` constructs each variable kind
  (`WFActionOutputVariable`, `WFUserDefinedVariable`, `WFShortcutInputVariable`, …), a
  `WFVariableString` with embedded variables, and each state class via its own
  constructors (`initWithValue:`, `initWithNumber:`, `initWithVariable:`,
  `initWithVariableString:`), then calls `serializedRepresentation`. A lone variable in a text
  parameter comes out as a one-placeholder token string (`variable:MyVar` under
  `WFVariableStringParameterState`, `WFURLStringParameterState` and `WFDateFieldParameterState`
  in `data/encoding-table.json`); a variable picker's comes out bare (`variable:ActionOutput`
  under `WFVariableParameterState`), as in Apple's gallery files and the library.
- **Control flow.** Grouping identifier plus mode 0/1/2, observed in the library and the
  gallery for If, Otherwise, Repeat with Each, Repeat, and Choose from Menu.
- **Condition codes.** Each code loaded as a Filter Files row; the engine's row state names
  the operator it parsed (`selectedOperator`, recorded as `filterOperators` in
  `data/encoding-table.json`). Codes outside that set trap the engine. Apple's gallery has one
  calendar filter with 1002 and a "7 days" value; the engine names 1002 "is today", so the
  number there is left over, and the editor's own default for Find Calendar Events writes 1000,
  "is in the next". 100/101 also appear in `supportedComparisonOperators` on the subject states.
- **App Intents actions.** The gallery's Summarize Text and Notes actions show the on-disk
  form; `dump-appintents-actions.py` builds the same identifier and descriptor for every
  installed app from its `Metadata.appintents` bundle.
- **Icon palette.** `WFWorkflowIcon` constructed with palette colors 0–14 and asked for
  `backgroundColorValue`; the default glyph, 61440, is `+[WFWorkflowIcon defaultGlyphCharacter]`.

**Dictionary items and coercions** (2026-10-27). `WFDictionaryParameterState` was fed a dictionary holding
every item form (text, text with a reference, a key from a reference, a nested dictionary, an array of
each, a number, a boolean, both from references, and empty ones) through
`-initWithSerializedRepresentation:variableProvider:parameter:` and asked to serialize it back;
`extract-encoding-table.js` records the sample and the result as `dictionaryItems`, `verify-encodings.js`
requires the round trip, and the verifier compares every dictionary the fixtures write against what the
engine's actions write back. What the engine rewrote fixed the forms: a nested dictionary given without
the outer wrapper comes back wrapped once more, a bare number under type 3 comes back as "0", a
`WFBooleanSubstitutableState` comes back as `WFNumberSubstitutableState`, plain array items come back as
bare strings, and type code 9 raises (`State for WFPropertyListParameterValue is not of the expected
class`). The engine names only the codes; text, dictionary, array, number and boolean are the editor's
names for them. Reading an array item, the engine first tries the value as a bare list and logs a
`WFEnforceClass` warning ("is of type __NSDictionaryM, not NSArray! Falling back to nil") before
reading the wrapped form; the serialization still comes back as written. Coercion classes: the aggrandizement's parser (`WFCoercionVariableAggrandizement`,
through `WFVariableParameterState`) accepts any class name, including one that does not exist, so the
list the packages check against is `+[WFContentItem allSupportedItemClasses]` with each class's
`localizedTypeDescription`, which is the editor's variable "Type" menu (22 classes on macOS 27); the
verifier fails if this engine lists a class the data lacks.

**Content item classes, their properties and owned types** (2026-10-29). The engine defines 94
`WFContentItem` subclasses on macOS 27 (ContentKit 59, ActionKit 21, WorkflowKit 14; the prelude's
`contentItemSubclasses()` walks the runtime's class list by superclass, since
`objc_copyClassNamesForImage` sees only the last two), of which `+allSupportedItemClasses` names the
22 the Type menu offers; the rest are output-only (Calendar Event, Reminder, Message, Photo Media,
Weather Conditions, ...). The editor's "Get" list under a variable's Type menu is the class's
`+allProperties` (its own and inherited `WFContentProperty` objects; `+properties` is the class's
own and is nil on classes that add none). `+ownedTypes` lists the object classes and file types the
class wraps (`WFObjectType`, `WFFileType`): `NSDecimalNumber` and `NSNumber` for Number, `EKEvent`
for Calendar Event, `public.folder` for Folder; 133 on macOS 27, 8 of them owned by several classes,
always a subclass family (Location's three, the item-provider pair, the remote-app trio), which the
generator resolves to the common ancestor. The definitions name their outputs with 79 strings, 28
of them classes and 44 owned types; the 7 left are the base class, HealthKit's two classes (a
plugin the probe does not load) and four audio and video file types that only conform to an owned
type. `extract-encoding-table.js` records per class `coercible`, `superclass`, `ownedTypes`, and
each property's `name` (what `PropertyName` holds; "name" and the user-info key do not resolve),
`userInfo` (what the editor adds as `PropertyUserInfo`: a string such as `WFItemName`, a Contacts
property code, or nothing), `valueClass` (`valueItemClass`), `yields` (what
`-[WFPropertyVariableAggrandizement processedContentClasses:]` returns on the class, the check that
the name resolves: an unknown name yields nothing), and the `multipleValues`, `filterable`,
`sortable`, `gettable` flags, plus `coercesTo` (`+supportedItemClasses`, the classes it coerces to).
618 properties on macOS 27; every one yields its value class. The verifier loads every name through
`WFVariableParameterState`, on a coerced reference for a coercible class and as a bare property
reference otherwise, requires it to resolve on that class and to serialize back as written, and
fails if the engine defines a property the data lacks. Not recorded: what a property yields at run
time for a value whose class the file does not state (the editor offers the Get list only once a
Type is chosen or inferred).

**What an action outputs, per choice** (2026-10-29). The definitions declare an output's types once
(`Output.Types`), 24 of them as a union (Ask for Input: NSString, NSDecimalNumber, NSURL, NSDate)
with nothing linking a choice to a type. The action instance knows: `-outputContentClasses` on an
action built with `copyWithSerializedParameters:` answers in content item classes for the
parameters it holds (the editor labels a magic variable from it). `extract-parameter-encodings.js`
builds each action with no parameters (`classes`, the default's answer: Ask for Input's is Text)
and then with each choice of each enumeration parameter (`possibleStates`, the engine's own list)
set, and records under `byChoice` the keys where some choice yields something else: 32 actions on
macOS 27, one deciding key each (Ask for Input's Input Type, Get Device Details' detail, Get Wi-Fi
Details' detail, Get Battery Status' subject, Get Current Song's subject, Get Travel Time's mode,
Base64 Encode's mode, Use Model's result type, and the 24 Get Details of … actions' property). Of
the 24 union outputs, 6 follow a choice; the others follow the input (`inputTypeDeterminesOutputType`,
recorded where set) or are decided at run time, and keep the union. The engine's base answer differs
from the declaration for 151 actions, always the content item class for the declared object class.
Not read: Get Device Details reports Device Hostname and Device Is Locked as Number, which is what
the engine says and is kept as such.

### What is still approximate

- The generator emits the legacy single-condition If. Shortcuts migrates it on load. Multi-
  condition If needs the `WFConditions` template, which the format reference documents but the
  helper does not yet build.
- Specialised value dictionaries (contacts, locations, file bookmarks, colors) are documented
  from examples rather than exhaustively.
- Filter rows are typed from the engine's own rules for the built-in Find actions and for the
  App Intents Find actions as the app builds them (`data/engine-filters.json`,
  `data/linkd-properties.json`); Bool rows are the one form still unread, so Bool properties
  are not offered (see the open list under the engine's filter rules). Under osascript the
  verifier can only build the index's classes, which lack some of those properties; rows on
  them are checked in the engine host (`bun run verify` runs it when it is built).
- Dictionary item type names (text, dictionary, array, number, boolean) are the editor's; the engine
  exposes only the codes 0-4, and `exportWithError:` yields a program node rather than values, so what
  each code becomes at run time was not read from the engine.
- Coverage of the editor's list has no open rule
  ([the coverage section](#what-the-editor-shows-that-the-catalogue-does-not)). The rules were
  checked on one Mac and one editor build; a rule the index or linkd changes on a later macOS
  shows up as an audit failure, not silently.

### Run-time observations

Nothing offline can check what an action does when it runs. These came from running real
shortcuts and are recorded here because they are not in the data:

- Find Messages goes through Spotlight, then hydrates every hit. Past about a thousand
  entities on a cold Messages launch it hits a 30 s timeout (`LNConnectionErrorDomain` 1014,
  shown as "unknown error"); a narrower filter or a limit avoids it.
- The sort strings "Latest First" and "Oldest First" are accepted on Find actions; the editor
  stores the limit as a real and an integer also works.
- Run Shell Script's `Shell` takes a path (`/usr/bin/python3` works).
- Reported by a downstream user (zacharytamas/swiss-mcp, macOS 27.0), not reproduced here: an If whose
  subject is a dictionary value fails at run time with "Please choose a value for each parameter" until
  the subject carries a text coercion; `coerce(value, "WFStringContentItem")` writes that.
- `shortcuts run` returns the last action's output and now and then never returns after the
  shortcut has finished; `tools/linkd/run-payload.sh` watches its payload's progress file and
  kills the run and `siriactionsd` when that happens.
