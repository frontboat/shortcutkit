# Changelog

Versions follow semver for the whole repository: the TypeScript package, the Python package,
and the data they bundle are released together. Because the generated action catalogue is part
of the type surface, a data refresh is a **minor** release when it only adds actions or
parameters and a **major** release when it removes or retypes any. `bun run changelog` prints
the section for a fresh extraction from the diff against the committed data.

## 0.7.2 (2026-09-04)

- `repeatItem()` and `repeatIndex()` (Python `repeat_item`, `repeat_index`) for the current
  item and index inside a Repeat block. `endRepeatEach()` and `endRepeatCount()` now return
  the closing action, whose `ref()` is the block's "Repeat Results", as Apple's gallery files
  reference it.

## 0.7.1 (2026-09-04)

- `Shortcut` takes `types` (Python `types=`), the surfaces a shortcut is offered in:
  `ActionExtension` for the share sheet, `QuickActions` for the Finder and Services menus,
  `MenuBar`, `NCWidget`, `WatchKit`, `Sleep`, `ReceivesOnScreenContent`. `WFWorkflowTypes`
  was always written empty before, so there was no way to make a share-sheet shortcut.

## 0.7.0 (2026-09-04)

- **A named parameter type for every action**: `ShowresultParams`,
  `RemindersCreateReminderParams`, … (`src/generated/params.ts`), the same shape as
  `ParamTypes[identifier]` under a name that reads in hover text and errors.
- **Output content types**: `ACTIONS[id].outputTypes` (`WFStringContentItem`, `NSURL`, an App
  Intents entity, …), also on the `Action` returned by `action()`, in `getAction()`, and as the
  `OutputTypes<I>` type. Descriptive, not restrictive: Shortcuts coerces between many content
  types at run time, so `ref()` stays accepted everywhere. Python: `outputTypes` in `ACTIONS`
  and `get_action`.

## 0.6.2 (2026-09-04)

- `getAction(identifier)` (Python `get_action`) describes any catalogue identifier, built-in or
  App Intent, in one shape: name, parameter keys and kinds, output, descriptor, and the engine's
  definition for built-ins. `getDefinition()` is engine-only and returns nothing for App
  Intents, which made their names look missing when exploring the catalogue.
- Format reference: variable-picker parameters take either the wrapped form the app writes or
  the bare attachment the engine and Apple's gallery write; both load.

## 0.6.1 (2026-09-04)

- `action()` wraps a bare attachment given for a text parameter (string, URL and date fields)
  into the token string the engine writes for a lone variable; `TextValue` had admitted the
  bare form, which the engine never produces. Both packages. TypeScript now exports
  `PARAM_KINDS`, the per-parameter value kinds Python already had.

## 0.6.0 (2026-09-04)

- **140 App Intents entries removed** that are not actions a shortcut can run: 29 widget,
  control, Live Activity and Focus configuration intents (their system protocols say so; see
  Apple's "App intent types" page) and 111 the editor on this Mac hides (`visibilityFlags` 0:
  internal helpers such as "Fetch Contact Avatars"). 1,441 Apple App Intents remain, from 77
  apps. Removals are breaking, hence the minor bump under 0.x.
- Each App Intent record now carries its system protocols and `hidden`, `configuration` and
  `synthesized` flags; the 473 synthesized "Get …"/"Update …" entity actions are kept.

### Data: macOS 27.0 (26A5421a), Shortcuts 10.0 build 5037.0.17, extracted 2026-09-04T13:10:34Z

Recommended bump: **major**

- Removed actions (140):
  - `com.apple.-Photos-AppIntents.PHWorkaroundFor146914251Intent`
  - `com.apple.AddressBook.FetchContactAvatarIntent`
  - `com.apple.AddressBook.FetchContactIntent`
  - `com.apple.Home.ActivateSceneIntent`
  - `com.apple.Home.AutomateAttributeValueIntent`
  - `com.apple.Home.AutomateSceneIntent`
  - `com.apple.Home.DeltaAttributeValueIntent`
  - `com.apple.Home.ErrorIntent`
  - `com.apple.Home.ForecastWidgetConfiguration`
  - `com.apple.Home.GetAttributeValueIntent`
  - `com.apple.Home.GetDeviceInfoIntent`
  - `com.apple.Home.HistoricalUsageWidgetConfiguration`
  - `com.apple.Home.HomeSingleTileConfigurationIntent`
  - `com.apple.Home.HomeXLModuleConfigurationIntent`
  - `com.apple.Home.OpenURLInHomeIntent`
  - `com.apple.Home.RecommendedItemIntent`
  - `com.apple.Home.SecureToggleIntent`
  - `com.apple.Home.SetAttributeValueIntent`
  - `com.apple.Home.ShowDeviceResultIntent`
  - `com.apple.Home.ShowErrorIntent`
  - `com.apple.Home.ShowNavigationIntent`
  - `com.apple.Home.ShowSceneResultIntent`
  - `com.apple.Home.TileControlAction`
  - `com.apple.Home.ToggleAttributeIntent`
  - `com.apple.Home.ToggleControlConfigurationIntent`
  - `com.apple.Home.UtilityRateInfoWidgetConfiguration`
  - `com.apple.Magnifier.MagnifierIntent`
  - `com.apple.MobileSMS.ConversationListFocusFilterAction`
  - `com.apple.MobileSMS.FetchConversationIdentifierIntent`
  - `com.apple.MobileSMS.FetchDowntimeConversationListIntent`
  - `com.apple.MobileSMS.FetchMutedConversationListIntent`
  - `com.apple.MobileSMS.MuteConversationIntent`
  - `com.apple.MobileSMS.OpenConversationListIntent`
  - `com.apple.Notes.GenerateFallbackPDF`
  - `com.apple.Notes.QuickNoteIntent`
  - `com.apple.PeopleViewService.SelectPersonIntent`
  - `com.apple.PeopleViewService.URLAppIntent`
  - `com.apple.Photos.PLPhotosReliveWidgetConfigurationIntent`
  - `com.apple.Photos.PhotosReliveWidgetFeaturedConfiguration`
  - `com.apple.Safari.AddHistoryItem`
  - `com.apple.Safari.CloseTabsAssistantIntent`
  - `com.apple.Safari.CreateTabAssistantIntent`
  - `com.apple.Safari.DeleteHistoryItems`
  - `com.apple.Safari.GetHistoryItems`
  - `com.apple.Safari.NotifyUserForUpdatedPageIntent`
  - `com.apple.Safari.OpenBookmarkAssistantIntent`
  - `com.apple.Safari.OpenHistoryItem`
  - `com.apple.Safari.OpenTabGroupForFocus`
  - `com.apple.Safari.ReportNotifyMeWhenAutomationResult`
  - `com.apple.Safari.RequestWebPageContextIntent`
  - `com.apple.ShortcutsActions.PlayMusicTopHitAction`
  - `com.apple.ShortcutsActions.PlayPodcastTopHitAction`
  - `com.apple.ShortcutsActions.StartCallTopHitAction`
  - `com.apple.ShortcutsActions.StartFaceTimeAudioCallTopHitAction`
  - `com.apple.ShortcutsActions.StartFaceTimeCallTopHitAction`
  - `com.apple.ShortcutsActions.StartFaceTimeVideoCallTopHitAction`
  - `com.apple.Spotlight.SearchSpotlightIntentInternal`
  - `com.apple.VoiceMemos.OpenResetAnalyticsIdentifierEntity`
  - `com.apple.VoiceMemos.RCCombineRecordings`
  - `com.apple.VoiceMemos.RCControlCenterToggleRecording`
  - … 80 more

## 0.5.1 (2026-09-04)

- The encoding table covers the SiriKit-era value types too: app parameters map to
  `WFAppPickerParameter`, file parameters to `WFFilePickerParameter`, plus payment method and
  currency amount; person and the entity-like ones have no WorkflowKit parameter class. 4,563
  of 4,989 App Intent parameters now carry an engine class. No generated type changes: file
  and app values are dictionaries and keep the kind `any`.

## 0.5.0 (2026-09-04)

- **App Intent parameters typed by the engine.** WorkflowKit's mapping from each LinkMetadata
  value type to its own parameter class is observable without linkd, and the encoding table
  now records it (`appIntentValueTypes`). 4,489 of 4,989 App Intent parameters take their
  kind from that class exactly as built-ins do: dates and date components become text
  (`WFDateFieldParameter`), URLs text, entities dynamic options, enumerations their case ids.
  Files, people, apps and arrays of those stay `any`. Narrower types than 0.4.x for date
  parameters, hence the minor bump under 0.x.
- `diff-data` compares App Intent parameter classes, so future retypes are reported.
- `docs/extraction.md` explains why the actions themselves cannot be built without linkd and
  why their encodings can.

### Data: macOS 27.0 (26A5421a), Shortcuts 10.0 build 5037.0.17, extracted 2026-09-04T12:49:37Z

Recommended bump: **major**

- Changed parameter classes (4489):
  - `com.apple.-Photos-AppIntents.PHWorkaroundFor146914251Intent.asset: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.ContactEntity.WFCompoundType: string -> WFLinkEnumerationParameter`
  - `com.apple.AddressBook.ContactEntity.WFContentItemInputParameter: string -> WFLinkEnumerationParameter`
  - `com.apple.AddressBook.ContactEntity.WFContentItemLimitEnabled: bool -> WFSwitchParameter`
  - `com.apple.AddressBook.ContactEntity.WFContentItemLimitNumber: number -> WFNumberFieldParameter`
  - `com.apple.AddressBook.ContactEntity.WFContentItemSortOrder: text -> WFTextInputParameter`
  - `com.apple.AddressBook.ContactEntity.WFContentItemSortProperty: string -> WFLinkEnumerationParameter`
  - `com.apple.AddressBook.CreateContactIntent.OpenWhenRun: bool -> WFSwitchParameter`
  - `com.apple.AddressBook.CreateContactIntent.birthday: any -> WFDateFieldParameter`
  - `com.apple.AddressBook.CreateContactIntent.contactRelations: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.CreateContactIntent.contactType: string -> WFLinkEnumerationParameter`
  - `com.apple.AddressBook.CreateContactIntent.dates: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.CreateContactIntent.departmentName: text -> WFTextInputParameter`
  - `com.apple.AddressBook.CreateContactIntent.emailAddresses: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.CreateContactIntent.jobTitle: text -> WFTextInputParameter`
  - `com.apple.AddressBook.CreateContactIntent.organizationName: text -> WFTextInputParameter`
  - `com.apple.AddressBook.CreateContactIntent.phoneNumbers: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.CreateContactIntent.phoneticOrganizationName: text -> WFTextInputParameter`
  - `com.apple.AddressBook.CreateContactIntent.postalAddresses: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.DeleteContactIntent.entities: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.FetchContactAvatarIntent.identifiers: text -> WFTextInputParameter`
  - `com.apple.AddressBook.FetchContactAvatarIntent.kinds: string -> WFLinkEnumerationParameter`
  - `com.apple.AddressBook.FetchContactIntent.identifiers: text -> WFTextInputParameter`
  - `com.apple.AddressBook.FetchContactIntent.keysToFetch: text -> WFTextInputParameter`
  - `com.apple.AddressBook.SearchInContactsIntent.criteria: text -> WFTextInputParameter`
  - `com.apple.AddressBook.UpdateContactIntent.OpenWhenRun: bool -> WFSwitchParameter`
  - `com.apple.AddressBook.UpdateContactIntent.birthday: any -> WFDateFieldParameter`
  - `com.apple.AddressBook.UpdateContactIntent.contactRelations: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.UpdateContactIntent.contactType: string -> WFLinkEnumerationParameter`
  - `com.apple.AddressBook.UpdateContactIntent.dates: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.UpdateContactIntent.departmentName: text -> WFTextInputParameter`
  - `com.apple.AddressBook.UpdateContactIntent.emailAddresses: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.UpdateContactIntent.jobTitle: text -> WFTextInputParameter`
  - `com.apple.AddressBook.UpdateContactIntent.organizationName: text -> WFTextInputParameter`
  - `com.apple.AddressBook.UpdateContactIntent.phoneNumbers: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.UpdateContactIntent.phoneticOrganizationName: text -> WFTextInputParameter`
  - `com.apple.AddressBook.UpdateContactIntent.postalAddresses: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.UpdateContactIntent.target: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.ViewContactCardIntent.highlightedPropertyType: string -> WFLinkEnumerationParameter`
  - `com.apple.AddressBook.ViewContactCardIntent.highlightedValue: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AddressBook.ViewContactCardIntent.shouldEdit: bool -> WFSwitchParameter`
  - `com.apple.AddressBook.ViewContactCardIntent.target: any -> WFLinkDynamicOptionsEnumerationParameter`
  - `com.apple.AppKit.FetchIntelligenceCommands.cachedIfAvailable: bool -> WFSwitchParameter`
  - `com.apple.AppKit.FetchIntelligenceCommands.includeNonPerformable: bool -> WFSwitchParameter`
  - `com.apple.AppKit.FetchIntelligenceCommands.includeUntitled: bool -> WFSwitchParameter`
  - `com.apple.AppKit.FetchIntelligenceCommands.processInstanceIdentifier: text -> WFTextInputParameter`
  - `com.apple.AppKit.InsertIntelligenceText.processInstanceIdentifier: text -> WFTextInputParameter`
  - `com.apple.AppKit.InsertIntelligenceText.replaceExisting: bool -> WFSwitchParameter`
  - `com.apple.AppKit.InsertIntelligenceText.targetFrame: text -> WFTextInputParameter`
  - `com.apple.AppKit.InsertIntelligenceText.targetWindowIdentifier: text -> WFTextInputParameter`
  - `com.apple.AppKit.InsertIntelligenceText.text: text -> WFTextInputParameter`
  - `com.apple.AppKit.PresentWritingToolsResult.precomputedCitationsJSON: text -> WFTextInputParameter`
  - `com.apple.AppKit.PresentWritingToolsResult.precomputedContentAdvisoriesJSON: text -> WFTextInputParameter`
  - `com.apple.AppKit.PresentWritingToolsResult.replaceExisting: bool -> WFSwitchParameter`
  - `com.apple.AppKit.PresentWritingToolsResult.targetFrame: text -> WFTextInputParameter`
  - `com.apple.AppKit.PresentWritingToolsResult.targetWindowIdentifier: text -> WFTextInputParameter`
  - `com.apple.AppKit.PresentWritingToolsResult.text: text -> WFTextInputParameter`
  - `com.apple.AppKit.RequestEditingContext.targetFrame: text -> WFTextInputParameter`
  - `com.apple.AppKit.RequestEditingContext.targetWindowIdentifier: text -> WFTextInputParameter`
  - `com.apple.AppKit.RunIntelligenceCommand.command: any -> WFLinkDynamicOptionsEnumerationParameter`
  - … 4429 more

## 0.4.2 (2026-09-04)

- App Intents output names: where the registry has no result label, the output type's display
  name is used ("Reminder" for Create Reminder, "Note" for Create Note) instead of the raw type
  identifier; 194 actions gain a label, 710 have no output.
- Every enumeration case list taken from the registry is checked against the engine's default
  on each refresh (93 of 93 agree); the extraction notes record what the registry is and is
  not trusted for. No parameter or type change.

## 0.4.1 (2026-09-04)

- Output names for the ActionKit built-ins now come from the engine's action objects rather
  than the Shortcuts app's registry, whose result label can be the action's own name. `ref()`
  of Ask for Input reads "Provided Input", as the editor does; 40 definitions carry an
  engine-sourced output name, marked `OutputNameSource: "WFAction"`. No parameter or type
  change.

## 0.4.0 (2026-09-04)

- **Control flow helpers**: `repeatCount()` / `endRepeatCount()` and `chooseFromMenu()` /
  `menuItem()` / `endMenu()` (Python: `repeat_count`, `choose_from_menu`, `menu_item`,
  `end_menu`).
- **ActionKit built-ins completed from the registry**: 19 output names (`ref()` of Ask for
  Input now reads "Ask for Input" rather than "Output") and 132 enumeration case lists, so
  keys like Ask for Input's `WFInputType` are typed as their cases instead of any string.
  Additions to the type surface, hence minor.
- Python exports `PARAM_CHOICES`.

### Data: macOS 27.0 (26A5421a), Shortcuts 10.0 build 5037.0.17, extracted 2026-09-04T12:23:11Z

Recommended bump: **minor**

- Added parameters (132):
  - `com.apple.NanoSettings.NPRFPingMyPhoneIntent.state`
  - `com.apple.NanoSettings.NPRFSetAlwaysOnIntent.operation`
  - `com.apple.NanoSettings.NPRFSetAlwaysOnIntent.state`
  - `com.apple.NanoSettings.NPRFSetAutoLaunchAudioAppsIntent.operation`
  - `com.apple.NanoSettings.NPRFSetAutoLaunchAudioAppsIntent.state`
  - `com.apple.NanoSettings.NPRFSetFlashLightIntent.operation`
  - `com.apple.NanoSettings.NPRFSetFlashLightIntent.state`
  - `com.apple.NanoSettings.NPRFSetSchoolTimeIntent.operation`
  - `com.apple.NanoSettings.NPRFSetSchoolTimeIntent.state`
  - `com.apple.NanoSettings.NPRFSetSilentModeIntent.operation`
  - `com.apple.NanoSettings.NPRFSetSilentModeIntent.state`
  - `com.apple.NanoSettings.NPRFSetTheaterModeIntent.operation`
  - `com.apple.NanoSettings.NPRFSetTheaterModeIntent.state`
  - `com.apple.NanoSettings.NPRFSetWakeOnWristRaiseIntent.operation`
  - `com.apple.NanoSettings.NPRFSetWakeOnWristRaiseIntent.state`
  - `com.apple.NanoSettings.NPRFSetWaterLockIntent.operation`
  - `com.apple.NanoSettings.NPRFSetWaterLockIntent.state`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UASetBackgroundSoundIntent.backgroundSound`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UASetBackgroundSoundsTimerIntent.interval`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleAccessibilityKeyboardIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleAlternatePointerActionsIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleAudioDescriptionsIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleBackgroundSoundsIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleCaptionsIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleClassicInvertIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleColorFiltersIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleContrastIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleFullKeyboardAccessIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleHeadPointerIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleHoverTextIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleHoverTypingIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleLiveCaptionsIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleLiveSpeechIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleMonoAudioIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleMotionCuesIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleMouseKeysIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleReduceMotionIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleSlowKeysIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleSmartInvertIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleStickyKeysIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleSwitchControlIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleTransparencyIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleVoiceControlIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleVoiceOverIntent.operation`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleZoomIntent.operation`
  - `is.workflow.actions.airplanemode.set.operation`
  - `is.workflow.actions.announcenotifications.set.operation`
  - `is.workflow.actions.appearance.operation`
  - `is.workflow.actions.appearance.style`
  - `is.workflow.actions.ask.WFInputType`
  - `is.workflow.actions.bluetooth.set.operation`
  - `is.workflow.actions.cellulardata.set.operation`
  - `is.workflow.actions.display.always-on.set.operation`
  - `is.workflow.actions.filter.apps.WFCompoundType`
  - `is.workflow.actions.filter.apps.WFContentItemInputParameter`
  - `is.workflow.actions.filter.apps.WFContentItemSortProperty`
  - `is.workflow.actions.filter.articles.WFCompoundType`
  - `is.workflow.actions.filter.articles.WFContentItemSortProperty`
  - `is.workflow.actions.filter.calendarevents.WFCompoundType`
  - `is.workflow.actions.filter.calendarevents.WFContentItemInputParameter`
  - … 72 more

## 0.3.0 (2026-09-04)

Apple's own apps' actions, and the rest of the built-ins.

- **1,581 App Intents actions from 80 Apple apps and system components**: Create Reminder,
  Create Note, Send Message, Photos, Mail, Safari, the System Settings toggles. They come from
  the Shortcuts app's own action index, the only readable copy of the App Intents registry
  (`linkd` refuses unentitled callers), so identifiers are exactly what Shortcuts writes,
  including for intents hosted in frameworks. Keys are the ones the Shortcuts app assigns
  (`actions.reminders_create_reminder`); parameters are typed, enumeration cases included; the
  `AppIntentDescriptor` is added by `action()`.
- **42 more built-in actions** from `WFIntentActionProvider`: Apple Watch settings,
  Accessibility toggles, Notes folder. 434 built-in definitions in total.
- **Every built-in now has a display name.** 76 definitions the engine leaves unnamed (Ask for
  Input, Show Alert, …) take theirs from the same index, marked `NameSource: "ToolKit"`.
- `docs/apple-app-intents-reference.md`, `provenance.toolKit` and `counts.appleAppIntents`.
- Regenerating now also needs Shortcuts.app to have run once on the Mac.

### Data: macOS 27.0 (26A5421a), Shortcuts 10.0 build 5037.0.17, extracted 2026-09-04T12:13:25Z

Recommended bump: **minor**

- Added actions (1623):
  - `com.apple.NanoSettings.NPRFPingMyPhoneIntent`
  - `com.apple.NanoSettings.NPRFSetAlwaysOnIntent`
  - `com.apple.NanoSettings.NPRFSetAutoLaunchAudioAppsIntent`
  - `com.apple.NanoSettings.NPRFSetFlashLightIntent`
  - `com.apple.NanoSettings.NPRFSetSchoolTimeIntent`
  - `com.apple.NanoSettings.NPRFSetSilentModeIntent`
  - `com.apple.NanoSettings.NPRFSetTheaterModeIntent`
  - `com.apple.NanoSettings.NPRFSetWakeOnWristRaiseIntent`
  - `com.apple.NanoSettings.NPRFSetWaterLockIntent`
  - `com.apple.Notes.ICNotesFolderIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UASetBackgroundSoundIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UASetBackgroundSoundsTimerIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UASetBackgroundSoundsVolumeIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleAccessibilityKeyboardIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleAlternatePointerActionsIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleAudioDescriptionsIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleBackgroundSoundsIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleCaptionsIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleClassicInvertIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleColorFiltersIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleContrastIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleFullKeyboardAccessIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleHeadPointerIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleHoverTextIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleHoverTypingIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleLiveCaptionsIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleLiveSpeechIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleMonoAudioIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleMotionCuesIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleMouseKeysIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleReduceMotionIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleSlowKeysIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleSmartInvertIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleStickyKeysIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleSwitchControlIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleTransparencyIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleVoiceControlIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleVoiceOverIntent`
  - `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleZoomIntent`
  - `com.apple.news.TagIntent`
  - `com.apple.news.TodayIntent`
  - `com.apple.weather.WeatherIntent`
  - `com.apple.-Photos-AppIntents.PHWorkaroundFor146914251Intent`
  - `com.apple.AddressBook.ContactEntity`
  - `com.apple.AddressBook.CreateContactIntent`
  - `com.apple.AddressBook.DeleteContactIntent`
  - `com.apple.AddressBook.FetchContactAvatarIntent`
  - `com.apple.AddressBook.FetchContactIntent`
  - `com.apple.AddressBook.SearchInContactsIntent`
  - `com.apple.AddressBook.UpdateContactIntent`
  - `com.apple.AddressBook.ViewContactCardIntent`
  - `com.apple.AppKit.FetchIntelligenceCommands`
  - `com.apple.AppKit.InsertIntelligenceText`
  - `com.apple.AppKit.PresentWritingToolsResult`
  - `com.apple.AppKit.RequestEditingContext`
  - `com.apple.AppKit.RunIntelligenceCommand`
  - `com.apple.AppKit.RunIntelligenceCommandForKey`
  - `com.apple.AppKit.WindowTabActivateIntent`
  - `com.apple.AppKit.WindowTabEntity`
  - `com.apple.AppKit.WritingToolsCanPerformIntent`
  - … 1563 more

## 0.2.0 (2026-09-04)

53 more built-in actions, including Ask for Input, Show Alert, Count, Choose from List, Date,
Format Date, Get Clipboard, URL and Get Dictionary Value. These live in ActionKit.framework,
not WorkflowKit, and ActionKit only loads into Apple platform binaries, so the compiled
extraction probes could never see them. The probes are now JavaScript for Automation scripts
run by `osascript`, a platform binary; no Xcode is needed to regenerate the data. See
`docs/extraction.md`.

- 70 existing actions gained parameters whose classes ActionKit defines; 98 parameter classes
  and 47 state classes are now mapped (52 and 31 before).
- Enumeration choice lists are read as real arrays; a few labels that previously carried
  `\U00d7`-style escape artifacts are now the actual characters.
- `provenance.actionKit` records the ActionKit version alongside WorkflowKit's.

### Data: macOS 27.0 (26A5421a), Shortcuts 10.0 build 5037.0.17, extracted 2026-09-04T11:43:38Z

Recommended bump: **minor**

- Added actions (53):
  - `com.apple.facetime.facetime`
  - `com.apple.mobilephone.call`
  - `is.workflow.actions.addnewcontact`
  - `is.workflow.actions.addnewevent`
  - `is.workflow.actions.alert`
  - `is.workflow.actions.announcenotifications.set`
  - `is.workflow.actions.ask`
  - `is.workflow.actions.choosefromlist`
  - `is.workflow.actions.converttimezone`
  - `is.workflow.actions.correctspelling`
  - `is.workflow.actions.count`
  - `is.workflow.actions.date`
  - `is.workflow.actions.delay`
  - `is.workflow.actions.displaysleep`
  - `is.workflow.actions.filter.vpns`
  - `is.workflow.actions.format.date`
  - `is.workflow.actions.format.number`
  - `is.workflow.actions.getbatterylevel`
  - `is.workflow.actions.getclipboard`
  - `is.workflow.actions.getcurrentapp`
  - `is.workflow.actions.getnameofemoji`
  - `is.workflow.actions.gettimebetweendates`
  - `is.workflow.actions.getvalueforkey`
  - `is.workflow.actions.image.rotate`
  - `is.workflow.actions.intercom`
  - `is.workflow.actions.lock.app`
  - `is.workflow.actions.lockscreen`
  - `is.workflow.actions.logout`
  - `is.workflow.actions.openpasswords`
  - `is.workflow.actions.personalhotspot.password.get`
  - `is.workflow.actions.personalhotspot.password.set`
  - `is.workflow.actions.posters.get`
  - `is.workflow.actions.posters.switch`
  - `is.workflow.actions.reboot`
  - `is.workflow.actions.setairdropreceiving`
  - `is.workflow.actions.setclipboard`
  - `is.workflow.actions.showincalendar`
  - `is.workflow.actions.sleep`
  - `is.workflow.actions.takephoto`
  - `is.workflow.actions.takescreenshot`
  - `is.workflow.actions.text.changecase`
  - `is.workflow.actions.text.combine`
  - `is.workflow.actions.text.match`
  - `is.workflow.actions.text.match.getgroup`
  - `is.workflow.actions.text.split`
  - `is.workflow.actions.text.translate`
  - `is.workflow.actions.url`
  - `is.workflow.actions.url.expand`
  - `is.workflow.actions.vpn.get`
  - `is.workflow.actions.vpn.set`
  - `is.workflow.actions.wallpaper.set`
  - `is.workflow.actions.weather.currentconditions`
  - `is.workflow.actions.weather.forecast`

## 0.1.1 (2026-09-04)

Documentation and metadata only. No code or data changes.

- README leads with why engine-extracted data matters; PyPI and npm pages pick up the new text.
- Registry keywords widened for Shortcuts and macOS automation searches.
- Signing requirement documented: `shortcuts sign` needs a Mac signed into iCloud.

## 0.1.0 (2026-09-04)

First release, published to npm and PyPI.

- TypeScript package for Node 20+ and Bun: typed `actions.*` catalogue, value helpers,
  control flow, `write()` and `sign()`.
- Python package for 3.9+ with the same API and run-time kind checks.
- Format reference, action reference, encoding reference and extraction notes in `docs/`.

### Data: macOS 27.0 (26A5421a), Shortcuts 10.0 build 5037.0.17, extracted 2026-09-04T09:32:49Z

Initial extraction: 339 built-in actions, 870 parameters, 52 parameter classes.
