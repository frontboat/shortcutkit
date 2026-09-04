# Shortcuts parameter value encodings

How each built-in action parameter is serialized inside a `.shortcut` file. Every `WFParameter` subclass names a state class; that class's `serializedRepresentation` is the on-disk form. Defaults below are the parameter's own `defaultSerializedRepresentation`. 99 parameter classes, 48 state classes. See docs/shortcut-file-format.md for the general shapes and docs/extraction.md for how this was produced.

## State classes

### WFStringSubstitutableState

- parameter uses: 329
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFEnumerationParameter` (176 uses) default e.g. `"Video"`; used by `facetime`, `Share`, `additemtolist`
  - `WFCustomIntentEnumerationParameter` (66 uses) default e.g. `"off"`; used by `NPRFPingMyPhoneIntent`, `NPRFSetAlwaysOnIntent`, `NPRFSetAutoLaunchAudioAppsIntent`
  - `WFDynamicEnumerationParameter` (38 uses) default e.g. `"Driving"`; used by `apps`, `articles`, `calendarevents`
  - `WFContentItemFilterEnumerationParameter` (9 uses) default e.g. `"Library"`; used by `apps`, `calendarevents`, `contacts`
  - `WFAccountPickerParameter` (2 uses) default e.g. `none`; used by `send`, `post`
  - `WFDateActionPickerModeParameter` (2 uses) default e.g. `"Current Date"`; used by `date`, `input`
  - `WFDateActionYearPickerParameter` (2 uses) default e.g. `none`; used by `date`, `input`
  - `WFDynamicTagFieldParameter` (2 uses) default e.g. `none`; used by `post`
  - `WFHomePickerParameter` (2 uses) default e.g. `none`; used by `gethomeaccessorystate`, `homeaccessory`
  - `WFLocationAccuracyParameter` (2 uses) default e.g. `"HundredMeters"`; used by `getcurrentlocation`, `getdistance`
  - `WFMapsAppPickerParameter` (2 uses) default e.g. `"Maps"`; used by `getdirections`, `searchmaps`
  - `WFSpeakTextLanguagePickerParameter` (2 uses) default e.g. `none`; used by `makespokenaudiofromtext`, `speaktext`
  - `WFSpeakTextVoicePickerParameter` (2 uses) default e.g. `none`; used by `makespokenaudiofromtext`, `speaktext`
  - `WFTranslateTextLanguagePickerParameter` (2 uses) default e.g. `"Detect Language"`; used by `translate`
  - `WFUnitTypePickerParameter` (2 uses) default e.g. `"Length"`; used by `convert`, `create`
  - `WFAirDropVisibilityParameter` (1 uses) default e.g. `"Everyone"`; used by `setairdropreceiving`
  - `WFAskLLMModelParameter` (1 uses) default e.g. `"Apple Intelligence"`; used by `askllm`
  - `WFDictateTextLanguagePickerParameter` (1 uses) default e.g. `"en-US"`; used by `dictatetext`
  - `WFGenerativeResultTypePickerParameter` (1 uses) default e.g. `"Automatic"`; used by `askllm`
  - `WFGetDistanceUnitPickerParameter` (1 uses) default e.g. `"Miles"`; used by `getdistance`
  - `WFImageConvertFormatPickerParameter` (1 uses) default e.g. `"JPEG"`; used by `convert`
  - `WFInputSurfaceParameter` (1 uses) default e.g. `""`; used by `input`
  - `WFInputTypeParameter` (1 uses) default e.g. `none`; used by `input`
  - `WFListeningModePickerParameter` (1 uses) default e.g. `none`; used by `set`
  - `WFLocalePickerParameter` (1 uses) default e.g. `none`; used by `date`
  - `WFMailSenderPickerParameter` (1 uses) default e.g. `none`; used by `sendemail`
  - `WFMakeImageFromPDFPageColorspaceParameter` (1 uses) default e.g. `"RGB"`; used by `makeimagefrompdfpage`
  - `WFMakeImageFromPDFPageImageFormatParameter` (1 uses) default e.g. `"public.png"`; used by `makeimagefrompdfpage`
  - `WFNetworkPickerParameter` (1 uses) default e.g. `"Wi-Fi"`; used by `getwifi`
  - `WFOnScreenContextResultTypePickerParameter` (1 uses) default e.g. `"Images"`; used by `getonscreencontext`
  - `WFSpotlightSearchResultTypePickerParameter` (1 uses) default e.g. `["Calendar Events", "Contacts", "Mail", "Messages", "Photos", "Reminders", "Voice Recordings", "Book`; used by `spotlightsearch`
  - `WFTagFieldParameter` (1 uses) default e.g. `none`; used by `addnewreminder`
  - `WFTodoistProjectPickerParameter` (1 uses) default e.g. `"Inbox"`; used by `add`

### WFBooleanSubstitutableState

- parameter uses: 250
- selectors: `initWithBoolValue:`, `initWithNumber:`, `initWithNumberSubstitutableState:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFSwitchParameter` (249 uses) default e.g. `true`; used by `RecognizeMusicIntent`, `NPRFPingMyPhoneIntent`, `NPRFSetAlwaysOnIntent`
  - `WFTumblrComposeInAppParameter` (1 uses) default e.g. `false`; used by `post`

### WFVariableStringParameterState

- parameter uses: 194
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithVariable:`, `initWithVariableString:`, `initWithVariableString:userInputInsertionIndex:`, `serializedRepresentation`, `shouldSerializeAsPlainString`
- parameter classes:
  - `WFTextInputParameter` (188 uses) default e.g. `"Do you want to continue?"`; used by `Share`, `additemtolist`, `addnewcalendar`
  - `WFStoredValueVariableFieldParameter` (3 uses) default e.g. `none`; used by `deletestoredcontent`, `getstoredcontent`, `setstoredcontent`
  - `WFCountryFieldParameter` (1 uses) default e.g. `"United States"`; used by `address`
  - `WFCustomDateFormatParameter` (1 uses) default e.g. `"EEE, dd MMM yyyy HH:mm:ss Z"`; used by `date`
  - `WFRegexFieldParameter` (1 uses) default e.g. `"[0-9a-zA-Z]"`; used by `match`

### WFVariableParameterState

- parameter uses: 149
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFVariablePickerParameter` (149 uses) default e.g. `none`; used by `StreamShareService`, `addframetogif`, `additemtolist`

### WFNumberStringSubstitutableState

- parameter uses: 58
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFNumberFieldParameter` (58 uses) default e.g. `0.25`; used by `addframetogif`, `additemtolist`, `ask`

### WFNumberSubstitutableState

- parameter uses: 56
- selectors: `initWithNumber:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFStepperParameter` (39 uses) default e.g. `1`; used by `delay`, `get`, `apps`
  - `WFSliderParameter` (16 uses) default e.g. `10`; used by `UASetBackgroundSoundsVolumeIntent`, `flashlight`, `convert`
  - `WFFileLabelColorPickerParameter` (1 uses) default e.g. `none`; used by `label`

### WFDateFieldParameterState

- parameter uses: 26
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithVariable:`, `initWithVariableString:`, `initWithVariableString:userInputInsertionIndex:`, `serializedRepresentation`, `shouldSerializeAsPlainString`
- parameter classes:
  - `WFDateFieldParameter` (26 uses) default e.g. `none`; used by `UASetBackgroundSoundsTimerIntent`, `addnewevent`, `addnewreminder`

### WFFileParameterState

- parameter uses: 22
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFFilePickerParameter` (22 uses) default e.g. `{"displayName": "Shortcuts", "fileLocation": {"relativeSubpath": "", "WFFileLocationType": "Shortcut`; used by `compresspdf`, `open`, `save`

### WFLocationParameterState

- parameter uses: 20
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFLocationParameter` (20 uses) default e.g. `{"isCurrentLocation": true}`; used by `addnewreminder`, `getdirections`, `getdistance`

### WFContactFieldEntry

- parameter uses: 16
- selectors: `initWithCoder:`, `initWithContact:`, `initWithCustomHandle:`, `initWithEmailAddress:`, `initWithHandleString:`, `initWithHandleString:allowsCustomHandles:`, `initWithMessageGroup:`, `initWithPhoneNumber:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `serializedRepresentation`
- parameter classes:
  - `WFEmailAddressFieldParameter` (6 uses) default e.g. `none`; used by `addnewcontact`, `email`, `sendemail`
  - `WFContactFieldParameter` (4 uses) default e.g. `none`; used by `facetime`, `addnewreminder`, `contacts`
  - `WFContactHandleFieldParameter` (3 uses) default e.g. `none`; used by `sendmessage`, `pay`, `request`
  - `WFPhoneNumberFieldParameter` (3 uses) default e.g. `none`; used by `call`, `addnewcontact`, `phonenumber`

### Swift generic table-template state

- parameter uses: 15
- parameter classes:
  - `WFTableTemplateContentItemFilterParameter` (14 uses) default e.g. `{"Value": {"WFActionParameterFilterPrefix": 1, "WFActionParameterFilterTemplates": [], "WFContentPre`; used by `apps`, `articles`, `calendarevents`
  - `WFTableTemplateParameter` (1 uses) default e.g. `{"Value": {"WFActionParameterFilterPrefix": 1, "WFActionParameterFilterTemplates": [], "WFContentPre`; used by `conditional`

### WFQuantityParameterState

- parameter uses: 13
- selectors: `initWithMagnitudeState:unitString:`, `initWithMagnitudeState:unitString:variable:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFDurationQuantityFieldParameter` (7 uses) default e.g. `{"Value": {"Magnitude": "15", "Unit": "min"}, "WFSerializationType": "WFQuantityFieldValue"}`; used by `UASetBackgroundSoundsTimerIntent`, `adjustdate`, `log`
  - `WFUnitQuantityFieldParameter` (3 uses) default e.g. `{"Value": {"Magnitude": "1000", "Unit": "ft"}, "WFSerializationType": "WFQuantityFieldValue"}`; used by `addnewreminder`, `makediskimage`, `create`
  - `WFCurrencyQuantityFieldParameter` (2 uses) default e.g. `{"Value": {"Unit": "USD"}, "WFSerializationType": "WFQuantityFieldValue"}`; used by `pay`, `request`
  - `WFSearchLocalBusinessesRadiusParameter` (1 uses) default e.g. `{"Value": {"Magnitude": "1", "Unit": "mi"}, "WFSerializationType": "WFQuantityFieldValue"}`; used by `searchlocalbusinesses`

### WFAppDescriptorParameterState

- parameter uses: 10
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `legacySerializedRepresentation`, `serializedRepresentation`
- parameter classes:
  - `WFAppPickerParameter` (10 uses) default e.g. `none`; used by `app`, `app`, `openapp`

### WFIntentDescriptorParameterState

- parameter uses: 9
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFIntentAppPickerParameter` (9 uses) default e.g. `{"BundleIdentifier": "com.apple.TelephonyUtilities.PhoneIntentHandler"}`; used by `facetime`, `call`, `requestride`

### WFMediaRouteState

- parameter uses: 8
- selectors: `initWithRoute:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFMediaRoutePickerParameter` (8 uses) default e.g. `{"isLocalDevice": true, "routeUID": "Speaker"}`; used by `handoffplayback`, `set`, `pausemusic`

### WFURLStringParameterState

- parameter uses: 6
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithVariable:`, `initWithVariableString:`, `initWithVariableString:userInputInsertionIndex:`, `serializedRepresentation`, `shouldSerializeAsPlainString`
- parameter classes:
  - `WFURLParameter` (6 uses) default e.g. `none`; used by `addnewreminder`, `ask`, `calendarevents`

### WFCalendarSubstitutableState

- parameter uses: 5
- selectors: `initWithCalendar:`, `initWithRemindersList:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `legacySerializedRepresentation`, `serializedRepresentation`
- parameter classes:
  - `WFRemindersListPickerParameter` (3 uses) default e.g. `none`; used by `addnewreminder`, `getupcomingreminders`, `showlist`
  - `WFCalendarPickerParameter` (2 uses) default e.g. `none`; used by `addnewevent`, `getupcomingevents`

### WFDictionaryParameterState

- parameter uses: 5
- selectors: `initWithKeyValuePairs:`, `initWithKeyValuePairs:identity:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `serializedRepresentation`
- parameter classes:
  - `WFDictionaryParameter` (5 uses) default e.g. `none`; used by `dictionary`, `downloadurl`, `post`

### WFColorParameterState

- parameter uses: 4
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFColorPickerParameter` (4 uses) default e.g. `{"alphaComponent": 1, "blueComponent": 0, "greenComponent": 0, "redComponent": 0, "WFColorRepresenta`; used by `generatebarcode`, `overlaytext`

### WFNumberParameterState

- parameter uses: 4
- selectors: `initWithNumber:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `serializedRepresentation`
- parameter classes:
  - `WFExpandingParameter` (4 uses) default e.g. `none`; used by `downloadurl`, `encodemedia`, `post`

### WFStringParameterState

- parameter uses: 4
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithString:`, `serializedRepresentation`
- parameter classes:
  - `WFOSAScriptEditorParameter` (2 uses) default e.g. `"on run {input, parameters}\n    (* Your script goes here *)\n    return input\nend run"`; used by `runapplescript`, `runjavascriptforautomation`
  - `WFVariableFieldParameter` (2 uses) default e.g. `none`; used by `appendvariable`, `setvariable`

### WFCodableAttributeBackedSubstitutableState

- parameter uses: 3
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithValue:codableAttribute:stringLocalizer:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFCustomIntentDynamicEnumerationParameter` (3 uses) default e.g. `none`; used by `TagIntent`, `ICNotesFolderIntent`, `WeatherIntent`

### WFINObjectSubstitutableState

- parameter uses: 3
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFFocusModesPickerParameter` (1 uses) default e.g. `none`; used by `set`
  - `WFLightroomPresetPickerParameter` (1 uses) default e.g. `none`; used by `import`
  - `WFWorkflowFolderPickerParameter` (1 uses) default e.g. `{"DisplayString": "All Shortcuts", "Identifier": "AllShortcuts"}`; used by `getmyworkflows`

### WFiTunesStoreCountrySubstitutableState

- parameter uses: 3
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFiTunesStoreCountryPickerParameter` (3 uses) default e.g. `"United States"`; used by `searchappstore`, `searchitunes`, `searchpodcasts`

### WFTrelloBoardSubstitutableState

- parameter uses: 3
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFTrelloBoardPickerParameter` (3 uses) default e.g. `none`; used by `card`, `list`, `get`

### (container, no value state)

- parameter uses: 2
- parameter classes:
  - `WFChooseFromMenuArrayParameter` (1 uses) default e.g. `none`; used by `choosefrommenu`
  - `WFContentArrayParameter` (1 uses) default e.g. `none`; used by `list`

### WFPHAssetCollectionState

- parameter uses: 2
- selectors: `initWithCollection:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFPhotoAlbumPickerParameter` (2 uses) default e.g. `none`; used by `removefromalbum`, `savetocameraroll`

### WFPlaylistSubstitutableState

- parameter uses: 2
- selectors: `initWithPlaylist:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFPlaylistPickerParameter` (2 uses) default e.g. `{"EntireMusicLibrary": true}`; used by `addtoplaylist`, `playlist`

### WFPodcastSubstitutableState

- parameter uses: 2
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFPodcastPickerParameter` (2 uses) default e.g. `none`; used by `getepisodesforpodcast`, `playpodcast`

### WFPosterParameterState

- parameter uses: 2
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFPosterPickerParameter` (2 uses) default e.g. `none`; used by `switch`, `set`

### WFTimeZonePickerParameterState

- parameter uses: 2
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFTimeZonePickerParameter` (2 uses) default e.g. `none`; used by `converttimezone`

### WFTrelloListSubstitutableState

- parameter uses: 2
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFTrelloListPickerParameter` (2 uses) default e.g. `none`; used by `card`, `get`

### WFArchiveFormatSubstitutableState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFArchiveFormatParameter` (1 uses) default e.g. `"zip"`; used by `makezip`

### WFDisplayParameterState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFDisplayPickerParameter` (1 uses) default e.g. `none`; used by `movewindow`

### WFFontParameterState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFFontPickerParameter` (1 uses) default e.g. `none`; used by `overlaytext`

### WFHFTriggerActionSetsBuilderParameterState

- parameter uses: 1
- selectors: `initWithActionSets:homeIdentifier:`, `initWithSerializedActionSets:homeIdentifier:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `serializedActionSets`, `serializedRepresentation`
- parameter classes:
  - `WFHomeAccessoryPickerParameter` (1 uses) default e.g. `none`; used by `homeaccessory`

### WFHMHomeAreaSubstitutableState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFHomeAreaPickerParameter` (1 uses) default e.g. `none`; used by `intercom`

### WFHMCharacteristicSubstitutableState

- parameter uses: 1
- selectors: `initWithCharacteristic:homeIdentifier:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedCharacteristic`, `serializedRepresentation`, `setSerializedCharacteristic:`
- parameter classes:
  - `WFHomeCharacteristicPickerParameter` (1 uses) default e.g. `none`; used by `gethomeaccessorystate`

### WFHMServiceParameterState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithSerializedService:homeIdentifier:`, `initWithService:homeIdentifier:`, `serializedRepresentation`, `serializedService`, `setSerializedService:`
- parameter classes:
  - `WFHomeServicePickerParameter` (1 uses) default e.g. `none`; used by `gethomeaccessorystate`

### WFNSUnitSubstitutableState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFMeasurementUnitPickerParameter` (1 uses) default e.g. `{"WFNSUnitSymbol": "ft", "WFNSUnitType": "Length"}`; used by `convert`

### WFMediaItemState

- parameter uses: 1
- selectors: `initWithMediaType:persistentID:`, `initWithMediaType:persistentID:storeID:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFMediaPickerParameter` (1 uses) default e.g. `none`; used by `playmusic`

### WFINPaymentMethodParameterState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFPaymentMethodParameter` (1 uses) default e.g. `none`; used by `requestride`

### WFINRideOptionParameterState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFRideOptionParameter` (1 uses) default e.g. `none`; used by `requestride`

### WFSSHKeyParameterState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `serializedRepresentation`
- parameter classes:
  - `WFSSHKeyParameter` (1 uses) default e.g. `{}`; used by `runsshscript`

### WFTumblrBlogSubstitutableState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFTumblrBlogPickerParameter` (1 uses) default e.g. `none`; used by `post`

### WFUIRecordingEventState

- parameter uses: 1
- selectors: `initWithEvent:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `serializedRepresentation`
- parameter classes:
  - `WFUIRecordingEventParameter` (1 uses) default e.g. `{}`; used by `watchmedo`

### WFVPNParameterState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFVPNPickerParameter` (1 uses) default e.g. `none`; used by `set`

### WFWorkflowParameterState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `legacySerializedRepresentation`, `serializedRepresentation`
- parameter classes:
  - `WFWorkflowPickerParameter` (1 uses) default e.g. `none`; used by `runworkflow`
