# Shortcuts parameter value encodings

How each built-in action parameter is serialized inside a `.shortcut` file. Every `WFParameter` subclass names a state class; that class's `serializedRepresentation` is the on-disk form. Defaults below are the parameter's own `defaultSerializedRepresentation`. 52 parameter classes, 31 state classes. See docs/shortcut-file-format.md for the general shapes and docs/extraction.md for how this was produced.

## State classes

### WFStringSubstitutableState

- parameter uses: 200
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFEnumerationParameter` (145 uses) default e.g. `"Remote"`; used by `Share`, `additemtolist`, `addmusictoupnext`
  - `WFDynamicEnumerationParameter` (37 uses) default e.g. `"Driving"`; used by `apps`, `articles`, `calendarevents`
  - `WFContentItemFilterEnumerationParameter` (8 uses) default e.g. `"Library"`; used by `apps`, `calendarevents`, `contacts`
  - `WFDynamicTagFieldParameter` (2 uses) default e.g. `none`; used by `post`
  - `WFHomePickerParameter` (2 uses) default e.g. `none`; used by `gethomeaccessorystate`, `homeaccessory`
  - `WFLocationAccuracyParameter` (2 uses) default e.g. `"HundredMeters"`; used by `getcurrentlocation`, `getdistance`
  - `WFAskLLMModelParameter` (1 uses) default e.g. `"Apple Intelligence"`; used by `askllm`
  - `WFInputSurfaceParameter` (1 uses) default e.g. `""`; used by `input`
  - `WFInputTypeParameter` (1 uses) default e.g. `none`; used by `input`
  - `WFTagFieldParameter` (1 uses) default e.g. `none`; used by `addnewreminder`

### WFVariableStringParameterState

- parameter uses: 163
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithVariable:`, `initWithVariableString:`, `initWithVariableString:userInputInsertionIndex:`, `serializedRepresentation`, `shouldSerializeAsPlainString`
- parameter classes:
  - `WFTextInputParameter` (160 uses) default e.g. `""`; used by `Share`, `additemtolist`, `addnewcalendar`
  - `WFStoredValueVariableFieldParameter` (3 uses) default e.g. `none`; used by `deletestoredcontent`, `getstoredcontent`, `setstoredcontent`

### WFVariableParameterState

- parameter uses: 132
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFVariablePickerParameter` (132 uses) default e.g. `none`; used by `StreamShareService`, `addframetogif`, `additemtolist`

### WFBooleanSubstitutableState

- parameter uses: 129
- selectors: `initWithBoolValue:`, `initWithNumber:`, `initWithNumberSubstitutableState:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFSwitchParameter` (129 uses) default e.g. `true`; used by `LaunchApplicationIntent`, `LaunchRemoteIntent`, `LaunchScreenSaverIntent`

### WFNumberStringSubstitutableState

- parameter uses: 54
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFNumberFieldParameter` (54 uses) default e.g. `0.25`; used by `addframetogif`, `additemtolist`, `number`

### WFNumberSubstitutableState

- parameter uses: 48
- selectors: `initWithNumber:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFStepperParameter` (35 uses) default e.g. `1`; used by `get`, `apps`, `articles`
  - `WFSliderParameter` (13 uses) default e.g. `0.75`; used by `convert`, `makespokenaudiofromtext`, `overlaytext`

### WFFileParameterState

- parameter uses: 22
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFFilePickerParameter` (22 uses) default e.g. `{"displayName": "Shortcuts", "fileLocation": {"relativeSubpath": "", "WFFileLocationType": "Shortcut`; used by `compresspdf`, `open`, `save`

### WFLocationParameterState

- parameter uses: 18
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFLocationParameter` (18 uses) default e.g. `{"isCurrentLocation": true}`; used by `addnewreminder`, `getdirections`, `getdistance`

### Swift generic table-template state

- parameter uses: 14
- parameter classes:
  - `WFTableTemplateContentItemFilterParameter` (13 uses) default e.g. `{"Value": {"WFActionParameterFilterPrefix": 1, "WFActionParameterFilterTemplates": [], "WFContentPre`; used by `apps`, `articles`, `calendarevents`
  - `WFTableTemplateParameter` (1 uses) default e.g. `{"Value": {"WFActionParameterFilterPrefix": 1, "WFActionParameterFilterTemplates": [], "WFContentPre`; used by `conditional`

### WFDateFieldParameterState

- parameter uses: 13
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithVariable:`, `initWithVariableString:`, `initWithVariableString:userInputInsertionIndex:`, `serializedRepresentation`, `shouldSerializeAsPlainString`
- parameter classes:
  - `WFDateFieldParameter` (13 uses) default e.g. `none`; used by `addnewreminder`, `adjustdate`, `set`

### WFContactFieldEntry

- parameter uses: 12
- selectors: `initWithCoder:`, `initWithContact:`, `initWithCustomHandle:`, `initWithEmailAddress:`, `initWithHandleString:`, `initWithHandleString:allowsCustomHandles:`, `initWithMessageGroup:`, `initWithPhoneNumber:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `serializedRepresentation`
- parameter classes:
  - `WFEmailAddressFieldParameter` (5 uses) default e.g. `none`; used by `email`, `sendemail`, `calendarevents`
  - `WFContactFieldParameter` (3 uses) default e.g. `none`; used by `addnewreminder`, `contacts`, `reminders`
  - `WFContactHandleFieldParameter` (3 uses) default e.g. `none`; used by `sendmessage`, `pay`, `request`
  - `WFPhoneNumberFieldParameter` (1 uses) default e.g. `none`; used by `phonenumber`

### WFQuantityParameterState

- parameter uses: 11
- selectors: `initWithMagnitudeState:unitString:`, `initWithMagnitudeState:unitString:variable:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFDurationQuantityFieldParameter` (6 uses) default e.g. `{"Value": {"Unit": "sec"}, "WFSerializationType": "WFQuantityFieldValue"}`; used by `adjustdate`, `log`, `recordaudio`
  - `WFUnitQuantityFieldParameter` (3 uses) default e.g. `{"Value": {"Magnitude": "1000", "Unit": "ft"}, "WFSerializationType": "WFQuantityFieldValue"}`; used by `addnewreminder`, `makediskimage`, `create`
  - `WFCurrencyQuantityFieldParameter` (2 uses) default e.g. `{"Value": {"Unit": "USD"}, "WFSerializationType": "WFQuantityFieldValue"}`; used by `pay`, `request`

### WFAppDescriptorParameterState

- parameter uses: 9
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `legacySerializedRepresentation`, `serializedRepresentation`
- parameter classes:
  - `WFAppPickerParameter` (9 uses) default e.g. `none`; used by `app`, `openapp`, `openin`

### WFIntentDescriptorParameterState

- parameter uses: 7
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFIntentAppPickerParameter` (7 uses) default e.g. `{"BundleIdentifier": "com.apple.MobileSMS"}`; used by `requestride`, `sendmessage`, `start`

### WFDictionaryParameterState

- parameter uses: 5
- selectors: `initWithKeyValuePairs:`, `initWithKeyValuePairs:identity:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `serializedRepresentation`
- parameter classes:
  - `WFDictionaryParameter` (5 uses) default e.g. `none`; used by `dictionary`, `downloadurl`, `post`

### WFCalendarSubstitutableState

- parameter uses: 4
- selectors: `initWithCalendar:`, `initWithRemindersList:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `legacySerializedRepresentation`, `serializedRepresentation`
- parameter classes:
  - `WFRemindersListPickerParameter` (3 uses) default e.g. `none`; used by `addnewreminder`, `getupcomingreminders`, `showlist`
  - `WFCalendarPickerParameter` (1 uses) default e.g. `none`; used by `getupcomingevents`

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

### WFURLStringParameterState

- parameter uses: 4
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithVariable:`, `initWithVariableString:`, `initWithVariableString:userInputInsertionIndex:`, `serializedRepresentation`, `shouldSerializeAsPlainString`
- parameter classes:
  - `WFURLParameter` (4 uses) default e.g. `none`; used by `addnewreminder`, `calendarevents`, `contacts`

### (container, no value state)

- parameter uses: 2
- parameter classes:
  - `WFChooseFromMenuArrayParameter` (1 uses) default e.g. `none`; used by `choosefrommenu`
  - `WFContentArrayParameter` (1 uses) default e.g. `none`; used by `list`

### WFINObjectSubstitutableState

- parameter uses: 2
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `serializedRepresentation`
- parameter classes:
  - `WFFocusModesPickerParameter` (1 uses) default e.g. `none`; used by `set`
  - `WFWorkflowFolderPickerParameter` (1 uses) default e.g. `{"DisplayString": "All Shortcuts", "Identifier": "AllShortcuts"}`; used by `getmyworkflows`

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
  - `WFMeasurementUnitPickerParameter` (1 uses) default e.g. `none`; used by `convert`

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

### WFUIRecordingEventState

- parameter uses: 1
- selectors: `initWithEvent:`, `initWithSerializedRepresentation:variableProvider:parameter:`, `serializedRepresentation`
- parameter classes:
  - `WFUIRecordingEventParameter` (1 uses) default e.g. `{}`; used by `watchmedo`

### WFWorkflowParameterState

- parameter uses: 1
- selectors: `initWithSerializedRepresentation:variableProvider:parameter:`, `initWithValue:`, `initWithVariable:`, `legacySerializedRepresentation`, `serializedRepresentation`
- parameter classes:
  - `WFWorkflowPickerParameter` (1 uses) default e.g. `none`; used by `runworkflow`
