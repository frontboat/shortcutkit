# Shortcuts built-in actions (from WorkflowKit's action registry)

Extracted by loading WorkflowKit and asking WFBundledActionProvider for every definition. 434 actions. Field names are Apple's own (ActionClass, Parameters[].Class, etc.). Full structured data: data/builtin-actions.json. See docs/extraction.md for how this was produced.

## Add Frame to GIF

- identifier: `is.workflow.actions.addframetogif`  ·  class `WFAddFrameToGIFAction`
- Adds an image to the existing animated GIF passed as input. If no GIF is passed as input, a new animated GIF is created.
- input: An existing animated GIF, if desired.
- result: An animated GIF
- summary: `Add ${WFImage} to ${WFInputGIF}`
- input: WFImageContentItem (required)
- output: GIF com.compuserve.gif
- keywords: animate, make, generate, gif
- icon: square.stack.3d.forward.dottedline.fill (Purple)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFImage` (VariablePicker) Image
  - `WFInputGIF` (VariablePicker) GIF
  - `WFGIFDelayTime` (NumberField) Delay Time default=0.25
  - `WFGIFAutoSize` (Switch) Auto Size default=true
  - `WFGIFManualSizeWidth` (NumberField) Width
  - `WFGIFManualSizeHeight` (NumberField) Height

## Add Item to List

- identifier: `is.workflow.actions.additemtolist`  ·  class `WFAddItemToListAction`
- Adds the specified item to a list at the beginning, end, or a specific index.
- note: Lists use one-based indexing, so the first item is at index 1, the second is at index 2, etc.
- summary variants:
  - `Add ${WFListItem} to ${WFInsertPosition} of ${WFListVariable}`  when {"WFInsertPosition": "Beginning"}
  - `Add ${WFListItem} to ${WFInsertPosition} of ${WFListVariable}`  when {"WFInsertPosition": "End"}
  - `Add ${WFListItem} to ${WFInsertPosition} ${WFItemIndex} in ${WFListVariable}`  when {"WFInsertPosition": "Index"}
- output: List WFContentItem
- keywords: array, set, collection, for, append, prepend, insert
- icon: list.bullet (Orange)
- ResidentCompatible: True
- parameters:
  - `WFListItem` (TextInput) Item
  - `WFInsertPosition` (Enumeration) Position default="End" choices=["Beginning", "End", "Index"]
  - `WFItemIndex` (NumberField) Index
  - `WFListVariable` (VariablePicker) List

## Add New Calendar

- identifier: `is.workflow.actions.addnewcalendar`  ·  class `WFAddNewCalendarAction`
- Creates a new calendar.
- result: The name of the new calendar
- summary: `Add new calendar ${CalendarName}`
- output: New Calendar NSString
- keywords: create, calendar
- InputPassthrough: False
- parameters:
  - `CalendarName` (TextInput) Calendar Name

## Add to Instapaper

- identifier: `is.workflow.actions.instapaper.add`  ·  class `WFInstapaperAddAction`
- Adds the input to Instapaper.
- summary: `Add ${WFInputURL}`
- input: WFURLContentItem (required)
- InputPassthrough: True
- parameters:
  - `WFInstapaperFolder` (DynamicEnumeration) Folder — This action will save your input to the specified folder. Leaving this empty will save the input to Instapaper’s Home folder.
  - `WFInputURL` (TextInput) URL

## Add to Pinboard

- identifier: `is.workflow.actions.pinboard.add`  ·  class `WFPinboardAddAction`
- Adds the URL passed into the action to your Pinboard.
- summary: `Add ${WFPinboardURL}`
- input: WFURLContentItem (required)
- keywords: URL, web, later, save, pinboard
- InputPassthrough: True
- parameters:
  - `WFPinTitle` (TextInput) Title
  - `WFPinTags` (TextInput) Tags
  - `WFPinPublic` (Switch) Public default=true
  - `WFPinUnread` (Switch) Unread default=true
  - `WFPinDescription` (TextInput) Description
  - `WFPinboardURL` (TextInput) URL

## Add to Playing Next

- identifier: `is.workflow.actions.addmusictoupnext`  ·  class `WFAddMusicToUpNextAction`
- Adds the music passed as input to your Playing Next queue.
- input: Items in your music library or items from the Find iTunes Store Items action.
- summary: `Add ${WFMusic} to ${WFWhenToPlay} of Playing Next`
- input: WFiTunesProductContentItem, WFMPMediaContentItem (required)
- keywords: song, music, itunes, up next, apple, album, next, play
- InputPassthrough: True
- parameters:
  - `WFWhenToPlay` (Enumeration) Play default="Next" choices=["Next", "Later"]
  - `WFMusic` (VariablePicker) Music

## Add to Playlist

- identifier: `is.workflow.actions.addtoplaylist`  ·  class `WFAddToPlaylistAction`
- Adds the items passed as input to the specified playlist.
- input: Items in your music library or items from the Find iTunes Store Items action.
- result: The contents of the updated playlist
- summary: `Add ${WFInput} to ${WFPlaylistName}`
- input: WFiTunesProductContentItem, WFMPMediaContentItem (required)
- output: Updated Playlist MPMediaItem
- keywords: song, music, itunes, playlist, apple, album
- InputPassthrough: False
- parameters:
  - `WFPlaylistName` (PlaylistPicker) Playlist
  - `WFInput` (VariablePicker) Music

## Add to Pocket

- identifier: `is.workflow.actions.pocket.add`  ·  class `WFPocketAddAction`
- Adds the input to Pocket.
- summary: `Add ${WFInputURL}`
- input: WFURLContentItem (required)
- InputPassthrough: True
- parameters:
  - `WFPocketTags` (TextInput) Tags — A comma-separated list of tags to apply to the items added to Pocket.
  - `WFInputURL` (TextInput) URL

## Add to Reading List

- identifier: `is.workflow.actions.readinglist`  ·  class `WFAddToReadingListAction`
- Adds URLs passed into the action to your reading list.
- summary: `Add ${WFURL} to Reading List`
- input: WFURLContentItem (required)
- keywords: URL, web, later, save, reading, list
- InputPassthrough: True
- parameters:
  - `WFURL` (TextInput) URL

## Add to Variable

- identifier: `is.workflow.actions.appendvariable`  ·  class `WFAppendVariableAction`
- Appends this action’s input to the specified variable, creating the variable if it does not exist.\n\nThis allows you to make a variable hold multiple items.
- result: The updated contents of the variable.
- summary: `Add ${WFInput} to ${WFVariableName}`
- input: WFContentItem (required)
- output: Variable WFContentItem
- keywords: add
- ResidentCompatible: True
- parameters:
  - `WFVariableName` (VariableField) Variable
  - `WFInput` (VariablePicker) Input

## Add Todoist Item

- identifier: `is.workflow.actions.todoist.add`  ·  class `WFTodoistAddAction`
- Adds a new item to Todoist.
- input: Files to attach to the item
- result: The URL of the newly created item
- summary: `Add ${WFTodoistContent} to ${WFTodoistProject}`
- input: WFGenericFileContentItem
- output: Todoist Item NSURL
- keywords: note, text, todo, to-do, task
- parameters:
  - `WFTodoistContent` (TextInput) Item
  - `WFTodoistProject` (TodoistProjectPicker) Project default="Inbox"
  - `WFTodoistDueDate` (DateField) Due Date
  - `WFTodoistReminder` (DateField) Remind Me On
  - `WFTodoistReminderType` (Enumeration) Reminder Type default="Email" choices=["Email", "Push Notification", "Text Message"]
  - `WFTodoistPriority` (Enumeration) Priority default="4" choices=["4", "3", "2", "1"]
  - `WFTodoistNotes` (TextInput) Notes
  - `WFTodoistFile` (VariablePicker) Files

## Add Trello Card

- identifier: `is.workflow.actions.trello.add.card`  ·  class `WFTrelloAddCardAction`
- Creates a new card on the specified list and board in your Trello account.
- summary: `Add ${WFTrelloName} to the ${WFTrelloCardPosition} of ${WFTrelloList} in ${WFTrelloBoard}`
- output: Trello Card WFTrelloCard
- parameters:
  - `WFTrelloName` (TextInput) Item
  - `WFTrelloBoard` (TrelloBoardPicker) Board
  - `WFTrelloList` (TrelloListPicker) List
  - `WFTrelloDueDate` (DateField) Due
  - `WFTrelloCardPosition` (Enumeration) Position default="Top" choices=["Top", "Bottom"]
  - `WFTrelloAttachments` (VariablePicker) Attachments — A list of items to be attached to the new card as files.
  - `WFTrelloDescription` (TextInput) Description

## Adjust Date

- identifier: `is.workflow.actions.adjustdate`  ·  class `WFAdjustDateAction`
- Adds or subtracts an amount of time from the date passed into the action.
- note: This action supports decimal numbers when adding or subtracting seconds, minutes, hours, or days. Otherwise only integers are supported.
- summary variants:
  - `${WFAdjustOperation} from ${WFDate}`
  - `${WFAdjustOperation} ${WFDuration} to ${WFDate}`
  - `${WFAdjustOperation} ${WFDuration} from ${WFDate}`  when {"WFAdjustOperation": "Subtract"}
- input: WFDateContentItem, WFCalendarEventContentItem, WFTimeIntervalContentItem (required)
- output: Adjusted Date NSDate
- keywords: add, subtract, math, time, get, start, of, this, minute, hour, day, week, month, year
- icon: calendar.badge.clock (Tint)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFDate` (DateField) Date
  - `WFAdjustOperation` (Enumeration) Operation default="Add" choices=["Add", "Subtract", "Get Start of Minute", "Get Start of Hour", "Get Start of Day", "Get Start of Week", "Get Start of Month", "Get Start of Year"]
  - `WFDuration` (DurationQuantityField) Duration

## AirDrop

- identifier: `is.workflow.actions.airdropdocument`  ·  class `WFAirDropAction`
- Prompts to share the specified content via AirDrop.
- summary: `AirDrop ${WFInput}`
- input: WFContentItem (required)
- keywords: airdrop, file, document, send, share
- InputPassthrough: True
- parameters:
  - `WFInput` (VariablePicker) Content

## Append to Dropbox Text File

- identifier: `is.workflow.actions.dropbox.appendfile`  ·  class `WFAppendDropboxFileAction`
- Adds the text passed as input to the end of the specified file.
- result: The file that was appended to
- note: If no file exists yet at the specified path, a new file will be created. Make sure to include a file extension (usually .txt) at the end of your path.
- summary: `${WFAppendFileWriteMode} ${WFInput}`
- input: WFStringContentItem (required)
- output: Appended File public.data
- keywords: add, text, prepend
- parameters:
  - `WFFilePath` (TextInput) File Path — The name or path of the file to retrieve. For example, if you are appending a file called “notes.txt” in a folder called “Public”, use “/Public/notes.txt”.
  - `WFAppendFileWriteMode` (Enumeration) Mode default="Append" choices=["Append", "Prepend"]
  - `WFAppendOnNewLine` (Switch) Make New Line default=true
  - `WFInput` (TextInput) Text

## Append to Evernote

- identifier: `is.workflow.actions.evernote.append`  ·  class `WFEvernoteAppendAction`
- Finds a note using the specified criteria and appends the input to the note.
- input: The content to add to your note
- summary: `${WFEvernoteWriteMode} ${WFInput} to the note ${WFEvernoteNotesTitleSearch}`
- input: WFContentItem (required)
- output: Note ENNoteRef
- keywords: add, prepend, save, evernote
- parameters:
  - `WFInput` (VariablePicker) Content
  - `WFEvernoteNotesTitleSearch` (TextInput) Note Title — The title (or part of the title) of the note to append to
  - `WFEvernoteWriteMode` (Enumeration) Mode default="Append" choices=["Append", "Prepend"]
  - `WFEvernoteNotesNotebookName` (EvernoteNotebookPicker) In Notebook — The notebook in which the note is located (optional)

## Append to Text File

- identifier: `is.workflow.actions.file.append`  ·  class `WFAppendFileAction`
- Adds the text passed as input to the end of the specified text file.
- result: The file that was appended to
- note: If no file exists yet at the specified path, a new file will be created. Make sure to include a file extension (usually .txt) at the end of your path.
- summary: `${WFAppendFileWriteMode} ${WFInput} to ${WFFile}`
- input: WFStringContentItem (required)
- output: Appended File public.data
- keywords: add, text, prepend
- icon: text.append (Tint)
- parameters:
  - `WFFile` (FilePicker) Folder
  - `WFFilePath` (TextInput) File Path — The name or path of the file to retrieve. For example, if you are appending a file called “notes.txt” in a folder called “Public”, use “/Public/notes.txt”.
  - `WFAppendFileWriteMode` (Enumeration) Mode default="Append" choices=["Append", "Prepend"]
  - `WFAppendOnNewLine` (Switch) Make New Line default=true
  - `WFInput` (TextInput) Text

## Ask for Input

- identifier: `is.workflow.actions.ask`  ·  class `WFAskForInputAction`
- Displays a dialog prompting the user to enter a piece of information.
- summary: `Ask for ${WFInputType} with ${WFAskActionPrompt}`
- output: Provided Input NSString, NSDecimalNumber, NSURL, NSDate
- keywords: ask, prompt, show, dialog, keyboard, text, number, url, date, time
- icon: plus.bubble.fill (Cyan)
- parameters:
  - `WFInputType` () Input Type choices=["Date", "Date and Time", "Number", "Text", "Time", "URL"]

## Base64 Encode

- identifier: `is.workflow.actions.base64encode`  ·  class `WFBase64EncodingAction`
- Encodes or decodes text or files using Base64 encoding.
- summary: `${WFEncodeMode} ${WFInput} with base64`
- input: WFStringContentItem, public.data (required)
- output: Base64 Encoded WFStringContentItem, public.data
- keywords: base, 64, encode, decode
- icon: octagon.fill (Gray)
- ResidentCompatible: True
- parameters:
  - `WFEncodeMode` (Enumeration) Mode default="Encode" choices=["Encode", "Decode"]
  - `WFBase64LineBreakMode` (Enumeration) Line Breaks default="Every 76 Characters" choices=["None", "Every 64 Characters", "Every 76 Characters"]
  - `WFInput` (VariablePicker) Input

## Calculate

- identifier: `is.workflow.actions.math`  ·  class `WFCalculateAction`
- Performs a number operation on the input and returns the result.
- summary variants:
  - `${WFInput} ${WFMathOperation} ${WFMathOperand}`
  - `${WFInput} ${WFMathOperation} ${WFScientificMathOperand}`  when {"WFMathOperation": "...", "WFScientificMathOperation": "Modulus"}
- input: NSDecimalNumber (required)
- output: Calculation Result NSDecimalNumber
- keywords: scientific, math, calculator, number, add, addition, subtract, subtraction, multiply, multiplication, times, divide, division, modulus, square, squared, exponent, exponential, power, ^, ln, log, logarithm, root, sin, cos, tan, sine, cosine, tangent, trig, abs, absolute, value, factorial
- icon: math.operators (Gray)
- ResidentCompatible: True
- parameters:
  - `WFInput` (NumberField) Number
  - `WFMathOperation` (Enumeration) Operation default="+" choices=["+", "-", "\u00d7", "\u00f7", "\u2026"]
  - `WFScientificMathOperation` (Enumeration) Scientific Operation choices=["Modulus", "x^2", "x^3", "x^y", "e^x", "10^x", "ln(x)", "log(x)", "\u221ax", "\u221bx", "x!", "sin(x)", "cos(x)", "tan(x)", "abs(x)"]
  - `WFMathOperand` (NumberField) Operand
  - `WFScientificMathOperand` (NumberField) Operand

## Calculate Expression

- identifier: `is.workflow.actions.calculateexpression`  ·  class `WFCalculateExpressionAction`
- Evaluates the mathematical expression in the given input text and outputs the result as a number. \n\nExample expressions:\n\n7 + 7\n\n8 * sqrt(5)\n\n$8 USD in euros\n\n7 feet in meters
- summary: `Calculate ${Input}`
- input: WFStringContentItem (required)
- output: Calculation Result NSDecimalNumber
- keywords: evaluate, expression, math, currency, convert, conversion, measure, measurement
- icon: calculator.fill (Gray)
- ResidentCompatible: True
- parameters:
  - `Input` (TextInput) Input

## Calculate Statistics

- identifier: `is.workflow.actions.statistics`  ·  class `WFCalculateStatisticsAction`
- Calculates statistics on the numbers that are provided as input.
- summary: `Calculate the ${WFStatisticsOperation} of ${Input}`
- input: NSNumber (required)
- output: Statistics NSNumber
- keywords: number, average, mean, mode, median, maximum, deviation, sum, minimum
- icon: chart.bar.fill (Gray)
- parameters:
  - `WFStatisticsOperation` (Enumeration) Operation default="Average" choices=["Average", "Minimum", "Maximum", "Sum", "Median", "Mode", "Range", "Standard Deviation"]
  - `Input` (VariablePicker) Input

## Call

- identifier: `com.apple.mobilephone.call`  ·  class `WFStartCallAction`
- Calls the phone number passed in as input.
- summary: `Call ${WFCallContact}`
- input: WFPhoneNumber, NSString (required)
- keywords: phone, number, dial, mobile, telephone
- InputPassthrough: True
- parameters:
  - `IntentAppDefinition` (IntentAppPicker) App default={"BundleIdentifier": "com.apple.TelephonyUtilities.PhoneIntentHandler"}
  - `WFCallContact` (PhoneNumberField) Contact

## Change Background Sound

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UASetBackgroundSoundIntent`  ·  class `None`
- Change the background sound that will play when background sounds is turned on. Background sounds mask unwanted environmental noise. Background sounds can also be enabled under Accessibility in Settings.
- parameters:
  - `backgroundSound` () Background Sound choices=["Airplane", "Babble", "BalancedNoise", "Boat", "BrightNoise", "Bus", "DarkNoise", "Fire", "Night", "Ocean", "QuietNight", "Rain", "RainOnRoof", "Steam", "Stream", "Train"]

## Change Case

- identifier: `is.workflow.actions.text.changecase`  ·  class `WFHandleCustomIntentAction`
- Changes the case of the text passed into the action to UPPERCASE, lowercase, or Title Case.
- output: Updated Text
- keywords: uppercase, lowercase, title, transform, text, capitalize
- icon: textformat (Yellow_Accessibility)
- ResidentCompatible: True
- parameters:
  - `WFCaseType` () Case choices=["Capitalize Every Word", "Capitalize with Title Case", "Capitalize with sentence case", "UPPERCASE", "cApItAlIzE wItH aLtErNaTiNg cAsE", "lowercase"]

## Change Playback Destination

- identifier: `is.workflow.actions.setplaybackdestination`  ·  class `WFChangePlaybackDestinationAction`
- Changes the current playback destination. Use this action to route audio to AirPods, Bluetooth speakers, HomePod, or other AirPlay devices. Optionally, this action can add or remove devices from a group, so you can route audio to multiple devices at once.
- note: When attempting to add a device that does not support groups, all other devices are removed as playback destinations first.
- summary variants:
  - `${WFMediaRouteOperation} ${WFMediaRoute} to playback destinations`  when {"WFMediaRouteOperation": "Add"}
  - `${WFMediaRouteOperation} ${WFMediaRoute} from playback destinations`  when {"WFMediaRouteOperation": "Remove"}
  - `${WFMediaRouteOperation} playback destination to ${WFMediaRoute}`  when {"WFMediaRouteOperation": "Set"}
- output: Change Playback Destination
- keywords: device, airplay, playback, audio, route, set
- icon: airplayaudio (Red)
- parameters:
  - `WFMediaRouteOperation` (Enumeration) Operation default="Set" choices=["Set", "Add", "Remove"]
  - `WFMediaRoute` (MediaRoutePicker) Device default="Local" — The device that is set, added, or removed as playback destination.

## Choose from List

- identifier: `is.workflow.actions.choosefromlist`  ·  class `WFChooseFromListAction`
- Presents a menu of the items passed as input to the action and outputs the user’s selection.
- summary: `Choose from ${WFInput}`
- input: WFImageContentItem, WFDictionaryContentItem, WFContentItem (required)
- output: Chosen Item WFContentItem
- keywords: choose, select, list, options, menu, multiple
- icon: list.bullet.rectangle (Cyan)
- parameters:
  - `WFInput` (VariablePicker) List
  - `WFChooseFromListActionPrompt` (TextInput) Prompt default="" — The instruction provided when the list is presented.
  - `WFChooseFromListActionSelectMultiple` (Switch) Select Multiple default=false — When enabled, multiple items may be chosen from the list.
  - `WFChooseFromListActionSelectAll` (Switch) Select All Initially default=false — When enabled, all of the items in the list will start out selected when Choose from List is presented.

## Choose from Menu

- identifier: `is.workflow.actions.choosefrommenu`  ·  class `WFChooseFromMenuAction`
- Presents a menu and runs different actions based on which menu item was chosen.
- summary: `Choose from menu with ${WFMenuPrompt}`
- output:
- keywords: list, prompt, select, action, sheet, switch
- icon: filemenu.and.selection (Cyan)
- InputPassthrough: True
- parameters:
  - `WFMenuPrompt` (TextInput) Prompt — The instruction provided when the menu is presented.
  - `WFMenuItems` (ChooseFromMenuArray) Items default=["One", "Two"]

## Clear Playing Next

- identifier: `is.workflow.actions.clearupnext`  ·  class `WFClearUpNextAction`
- Clears all the music in your Playing Next queue.
- summary: `Clear Playing Next`
- keywords: song, music, itunes, up next, apple, album, next, play, clear
- InputPassthrough: True

## Combine Images

- identifier: `is.workflow.actions.image.combine`  ·  class `WFImageCombineAction`
- Combines the images passed into the action horizontally, vertically, or in a grid.
- summary: `Combine ${WFInput} ${WFImageCombineMode}`
- input: WFImage (required)
- output: Combined Image WFImage
- keywords: horizontal, vertical, grid, photos, compile, connect, montage, photos
- icon: square.grid.2x2.fill (Blue)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFImageCombineMode` (Enumeration) Mode default="Horizontally" choices=["Horizontally", "Vertically", "In a Grid"]
  - `WFImageCombineSpacing` (NumberField) Spacing default=0 — The number of pixels of transparent space to place between consecutive images.
  - `WFInput` (VariablePicker) Images

## Combine Text

- identifier: `is.workflow.actions.text.combine`  ·  class `WFTextComponentsAction`
- Joins the text together, inserting the separator between each join.
- output: Combined Text
- keywords: separate, delimiter, append
- ResidentCompatible: True
- parameters:
  - `WFTextSeparator` () Separator choices=["Custom", "New Lines", "Spaces"]

## Comment

- identifier: `is.workflow.actions.comment`  ·  class `WFCommentAction`
- This action lets you explain how part of a shortcut works. When run, this action does nothing.
- keywords: note, explain
- icon: text.justifyleft (Clear)
- ResidentCompatible: True
- InputPassthrough: True
- parameters:
  - `WFCommentActionText` (TextInput) Comment

## Connect to Servers

- identifier: `is.workflow.actions.connecttoservers`  ·  class `WFConnectToServersAction`
- Connects your computer to the specified file servers on the network. For example, you can connect to SMB/CIFS, NFS, FTP (read-only), or WebDAV servers.
- result: Mounted volume
- input: WFURLContentItem (required)
- output: Connected Server public.folder
- keywords: server, connect, internet, smb
- parameters:
  - `WFInput` (TextInput) smb://computer.local

## Contacts

- identifier: `is.workflow.actions.contacts`  ·  class `WFContactsAction`
- Passes the specified contacts to the next action.
- summary: `${WFContact}`
- output: Contacts WFContact
- keywords: contact, person, people
- ResidentCompatible: True
- parameters:
  - `WFContact` (ContactField) Contact

## Continue in Shortcuts App

- identifier: `is.workflow.actions.handoff`  ·  class `WFHandoffAction`
- Switches into the Shortcuts app and continues to the next action.
- summary: `Continue in Shortcuts app`
- keywords: apple, watch, send, phone, transfer, switch, handoff, continuity, workflow
- InputPassthrough: True

## Control Home

- identifier: `is.workflow.actions.homeaccessory`  ·  class `WFHomeAccessoryAction`
- Set the state of your home.
- summary variants:
  - `Set ${WFHomeTriggerActionSets} in ${WFHome}`
  - `Set ${WFHomeTriggerActionSets}`
- keywords: homekit, accessories, accessory, automation, smart, house, my, home, control
- ResidentCompatible: True
- InputPassthrough: True
- parameters:
  - `WFHome` (HomePicker) Home
  - `WFHomeTriggerActionSets` (HomeAccessoryPicker) Scenes and Accessories

## Convert Image

- identifier: `is.workflow.actions.image.convert`  ·  class `WFImageConvertAction`
- Converts the images passed into the action to the specified image format.
- summary: `Convert ${WFInput} to ${WFImageFormat}`
- input: WFImage (required)
- output: Converted Image WFImage
- keywords: jpeg, jpg, png, bmp, tiff, strip, remove, preserve, metadata, photos
- icon: photo.fill (Blue)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFImageFormat` (ImageConvertFormatPicker) Format default="JPEG"
  - `WFImageCompressionQuality` (Slider) Quality default=0.75 — Allows you to choose the image quality used when compressing the image file. Higher quality images will look better, but result in larger files.
  - `WFImagePreserveMetadata` (Switch) Preserve Metadata default=true — When Preserve Metadata is turned off, all metadata, such as the GPS coordinates where the photo was taken, will be stripped from the image file.
  - `WFInput` (VariablePicker) Image

## Convert Image

- identifier: `is.workflow.actions.image.convert.finder`  ·  class `WFFinderImageConvertAction`
- input: WFImage (required)
- output: Converted Image WFImage
- InputPassthrough: False
- parameters:
  - `WFPreserveMetadata` (Switch) Preserve Metadata
  - `WFImage` (VariablePicker) Image
  - `WFFileFormat` (Enumeration) File Format default="JPEG" choices=["JPEG", "PNG", "HEIF"]
  - `WFSize` (Enumeration) Image Size default="Small" choices=["Small", "Medium", "Large", "Original"]

## Convert Measurement

- identifier: `is.workflow.actions.measurement.convert`  ·  class `WFMeasurementConvertAction`
- Converts the measurements passed into the action to the specified unit.
- summary variants:
  - `Convert ${WFInput} into ${WFMeasurementUnitType}`
  - `Convert ${WFInput} into ${WFMeasurementUnitType} in ${WFMeasurementUnit}`
- input: NSMeasurement (required)
- output: Converted Measurement NSMeasurement
- keywords: degrees, distance, pressure, measure, speed, weather
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFMeasurementUnitType` (UnitTypePicker) Type default="Length"
  - `WFMeasurementUnit` (MeasurementUnitPicker) Unit
  - `WFInput` (VariablePicker) Measurement

## Convert Time Zone

- identifier: `is.workflow.actions.converttimezone`  ·  class `WFConvertTimeZoneAction`
- Converts the specified date and time from one time zone to another.
- summary: `Convert ${Date} from ${SourceTimeZone} to ${DestinationTimeZone}`
- input: NSDate, NSDateComponents (required)
- output: Converted Date NSDateComponents
- keywords: date, set, pass, time, zone, timezone, current, now, get
- icon: globe (Tint)
- parameters:
  - `Date` (DateField) Date
  - `SourceTimeZone` (TimeZonePicker) Time Zone
  - `DestinationTimeZone` (TimeZonePicker) Destination Time Zone

## Copy to Clipboard

- identifier: `is.workflow.actions.setclipboard`  ·  class `WFSetClipboardAction`
- Copies the result of the last action to the clipboard.
- summary: `Copy ${WFInput} to clipboard`
- input: WFContentItem (required)
- keywords: text, clipboard, copy, paste, set
- icon: doc.on.doc.fill (Tint)
- InputPassthrough: True
- parameters:
  - `WFLocalOnly` (Switch) Local Only default=false — When enabled, the input will only be copied locally, and will not be shared to other devices via Handoff.
  - `WFExpirationDate` (DateField) Expire At — When set, the clipboard contents will expire and be automatically deleted at the specified time. Optional.
  - `WFInput` (VariablePicker) Content

## Correct Spelling

- identifier: `is.workflow.actions.correctspelling`  ·  class `WFHandleCustomIntentAction`
- Autocorrects the spelling of text passed into the action.
- output: Corrected Spelling
- keywords: text, spell, spelling, correct, autocorrect
- ResidentCompatible: True

## Count

- identifier: `is.workflow.actions.count`  ·  class `WFCountAction`
- Counts the number of items, characters, words, sentences, or lines passed as input.
- note: This is just like the Count in Sesame Street, but instead of a vampire, it’s a Shortcuts action.
- summary: `Count ${WFCountType} in ${Input}`
- input: WFContentItem, WFStringContentItem (required)
- output: Count NSDecimalNumber
- keywords: get, number, length, list, file, document
- icon: sum (Gray)
- ResidentCompatible: True
- parameters:
  - `WFCountType` (Enumeration) Type default="Items" choices=["Items", "Characters", "Words", "Sentences", "Lines"]
  - `Input` (VariablePicker) Input

## Create Dropbox Folder

- identifier: `is.workflow.actions.dropbox.createfolder`  ·  class `WFCreateDropboxFolderAction`
- Makes a new Dropbox folder.
- keywords: directory
- parameters:
  - `WFFilePath` (TextInput) Path — The path of the new folder. For example, if you want to create “Adventure” in an existing folder titled “Photos”, put “/Photos/Adventure/”

## Create Folder

- identifier: `is.workflow.actions.file.createfolder`  ·  class `WFCreateFolderAction`
- Makes a new folder.
- summary: `Create folder in ${WFFolder} at ${WFFilePath}`
- output: Created Folder public.data
- keywords: directory
- icon: folder.fill.badge.plus (Tint)
- parameters:
  - `WFFilePath` (TextInput) Path — The path of the new folder. For example, if you want to create “Adventure” in an existing folder titled “Photos”, put “/Photos/Adventure/”
  - `WFFolder` (FilePicker) Folder

## Create New Note

- identifier: `is.workflow.actions.evernote.new`  ·  class `WFEvernoteCreateAction`
- Saves the input as a note in Evernote.
- input: The content to include in your new note
- summary: `Create note with ${WFInput} named ${WFEvernoteNoteTitle}`
- input: WFContentItem (required)
- output: New Note ENNoteRef
- keywords: make, save
- parameters:
  - `WFEvernoteNoteTitle` (TextInput) Note Title
  - `WFEvernoteNotebook` (EvernoteNotebookPicker) Notebook — The notebook in which to save your new note (optional)
  - `WFEvernoteTags` (EvernoteTagsTagField) Tags — A list of tags to apply to the new note (optional)
  - `WFInput` (VariablePicker) Content

## Create Photo Album

- identifier: `is.workflow.actions.photos.createalbum`  ·  class `WFCreatePhotoAlbumAction`
- Creates a new album in the Photos app, including the specified photos and videos.
- input: Photos, videos, or audio to include in the new album
- result: The items saved to the album
- summary: `Create photo album ${AlbumName} with ${WFInput}`
- input: WFPhotoMediaContentItem, WFImage, AVAsset (required)
- output: Saved Photo Media PHAsset
- keywords: add, new, photo, photos, picture, image, camera, roll
- InputPassthrough: False
- parameters:
  - `AlbumName` (TextInput) Album Name — If there is already a photo album by this name, photos will be added to the existing album instead of creating a new one.
  - `WFInput` (VariablePicker) Photos

## Create Playlist

- identifier: `is.workflow.actions.createplaylist`  ·  class `WFCreatePlaylistAction`
- Creates a new playlist in the Music app, adding any items passed as input to the new playlist.
- input: Items in your music library or items from the Find iTunes Store Items action.
- summary: `Create playlist ${WFPlaylistName} with ${WFPlaylistItems}`
- input: WFiTunesProductContentItem, WFMPMediaContentItem
- output: New Playlist MPMediaItem
- keywords: song, music, itunes, playlist, apple, album
- InputPassthrough: False
- parameters:
  - `WFPlaylistName` (TextInput) Playlist Name
  - `WFPlaylistAuthor` (TextInput) Author
  - `WFPlaylistDescription` (TextInput) Description
  - `WFPlaylistItems` (VariablePicker) Music

## Create QR Code

- identifier: `is.workflow.actions.generatebarcode`  ·  class `WFGenerateMachineReadableCodeAction`
- Creates a Quick Response (QR) code for the specified text.
- summary: `Create QR code for ${WFText}`
- input: NSString (required)
- output: QR Code WFImage
- ResidentCompatible: True
- parameters:
  - `WFText` (TextInput) Text
  - `WFQRForegroundColor` (ColorPicker) Foreground Color default={"WFColorRepresentationType": "WFColorRepresentationTypeCGColor", "alphaComponent": 1, "blueComponent": 0, "greenComponent": 0, "redComponent": 0}
  - `WFQRBackgroundColor` (ColorPicker) Background Color default={"WFColorRepresentationType": "WFColorRepresentationTypeCGColor", "alphaComponent": 1, "blueComponent": 1, "greenComponent": 1, "redComponent": 1}
  - `WFQRRounded` (Switch) Rounded default=false
  - `WFQRErrorCorrectionLevel` (Enumeration) Error Correction default="Medium" choices=["Low", "Medium", "Quartile", "High"]

## Create Trello Board

- identifier: `is.workflow.actions.trello.add.board`  ·  class `WFTrelloCreateBoardAction`
- Creates a new board in your Trello account.
- summary: `Create the board ${WFTrelloName}`
- output: Trello Board WFTrelloBoard
- parameters:
  - `WFTrelloName` (TextInput) Name
  - `WFTrelloDescription` (TextInput) Description

## Create Trello List

- identifier: `is.workflow.actions.trello.add.list`  ·  class `WFTrelloCreateListAction`
- Creates a new list on the specified board in your Trello account.
- summary: `Create the list ${WFTrelloName} in ${WFTrelloBoard}`
- output: Trello List WFTrelloList
- parameters:
  - `WFTrelloName` (TextInput) Name
  - `WFTrelloBoard` (TrelloBoardPicker) Board
  - `WFTrelloPosition` (Enumeration) Position default="Top" choices=["Top", "Bottom"]

## Crop Image

- identifier: `is.workflow.actions.image.crop`  ·  class `WFImageCropAction`
- Crops images to a smaller rectangle.
- summary: `Crop ${WFInput}`
- input: WFImage (required)
- output: Cropped Image WFImage
- keywords: transform, shrink, stretch, expand, rectangle, clip, canvas, photos
- icon: crop (Blue)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFInput` (VariablePicker) Image
  - `WFImageCropPosition` (Enumeration) Position default="Center" choices=["Center", "Top Left", "Top Right", "Bottom Left", "Bottom Right", "Custom"] — Where on the original image the crop should occur.
  - `WFImageCropX` (NumberField) X Coordinate
  - `WFImageCropY` (NumberField) Y Coordinate
  - `WFImageCropWidth` (NumberField) Width default=100
  - `WFImageCropHeight` (NumberField) Height default=100

## Date

- identifier: `is.workflow.actions.date`  ·  class `WFDateAction`
- Passes the specified date and time to the next action.
- output: Date NSDate, NSDateComponents
- keywords: date, set date, pass date, time, current, now, get, holiday, public event, event
- icon: calendar (Tint)
- ResidentCompatible: True
- parameters:
  - `WFDateActionMode` (DateActionPickerMode) Date default="Current Date"
  - `WFDateActionDate` (DateField) Date
  - `WFEventOccurrenceMode` (Enumeration) Occurrence default="Next Occurrence" choices=["Next Occurrence", "Specified Year"]
  - `WFEventOccurrenceSpecifiedYear` (DateActionYearPicker) Year

## Delete Files

- identifier: `is.workflow.actions.file.delete`  ·  class `WFDeleteFileAction`
- Deletes the files passed in as input.
- summary: `Delete ${WFInput}`
- input: public.data (required)
- keywords: delete, files, remove, obliterate
- icon: trash.fill (Tint)
- parameters:
  - `WFInput` (FilePicker) Files
  - `WFDeleteImmediatelyDelete` (Switch) Delete Immediately default=false — When enabled, this action will delete files immediately, instead of moving to the Trash or Recently Deleted folder.

## Delete Notes

- identifier: `is.workflow.actions.evernote.delete`  ·  class `WFEvernoteDeleteAction`
- Deletes the notes passed as input from Evernote.
- summary: `Delete ${WFInput}`
- input: ENNoteRef (required)
- keywords: banish, demolish, remove, peace, byebye
- parameters:
  - `WFInput` (VariablePicker) Notes

## Delete Stored Content

- identifier: `is.workflow.actions.deletestoredcontent`  ·  class `WFDeleteStoredContentAction`
- Deletes stored content for the specified name.
- summary: `Delete ${WFStoredContentKey}`
- keywords: save, remove, clear, stored, value, data, database, user, defaults, storage, file, global
- icon: cylinder.split.1x2.fill (Cyan)
- ResidentCompatible: True
- parameters:
  - `WFStoredContentKey` (StoredValueVariableField) Stored Content Name
  - `WFStoredContentGlobalValue` (Switch) Global Value default=false — When enabled, any shortcut on your device can access and update this stored value. Otherwise, the value is only accessible within this shortcut.

## Detect Language

- identifier: `is.workflow.actions.detectlanguage`  ·  class `WFDetectLanguageAction`
- Detects the language of the text provided as input.
- summary: `Detect language of ${WFInput}`
- input: NSString (required)
- output: Language NSString
- keywords: Translate, Get, Text
- ResidentCompatible: False
- parameters:
  - `WFInput` (TextInput) Text

## Dictate Text

- identifier: `is.workflow.actions.dictatetext`  ·  class `WFDictateTextAction`
- Transcribes what you say aloud into text and passes the result to the next action.
- summary: `Dictate text`
- output: Dictated Text NSString
- keywords: speech, detection, dictation, speak, say, voice, recognize, microphone, transcribe, transcription, siri
- icon: mic.fill (Cyan)
- parameters:
  - `WFSpeechLanguage` (DictateTextLanguagePicker) Language
  - `WFDictateTextStopListening` (Enumeration) Stop Listening default="After Pause" choices=["After Pause", "After Short Pause", "On Tap"]

## Dictionary

- identifier: `is.workflow.actions.dictionary`  ·  class `WFDictionaryAction`
- Passes the specified list of key-value pairs to the next action as a dictionary.
- note: When coerced to text, the dictionary is represented as JSON.
- output: Dictionary NSDictionary
- keywords: json, plist
- icon: book.closed.fill (Orange)
- ResidentCompatible: True
- parameters:
  - `WFItems` (Dictionary) Items

## Dismiss Siri and Continue

- identifier: `is.workflow.actions.dismisssiri`  ·  class `WFHandoffAction`
- Switches into the Shortcuts app and continues to the next action.
- summary: `Dismiss Siri and Continue`
- keywords: apple, watch, send, phone, transfer, switch, handoff, continuity, workflow
- InputPassthrough: True

## Edit Calendar Event

- identifier: `is.workflow.actions.setters.calendarevents`  ·  class `WFContentItemSetterAction`
- ResidentCompatible: True
- parameters:
  - `WFCalendarEventContentItemMyStatus` () Value choices=["Accepted", "Completed", "Declined", "Delegated", "In Process", "Pending", "Tentative", "Unknown"]

## Edit Contact

- identifier: `is.workflow.actions.setters.contacts`  ·  class `WFContentItemSetterAction`
- ResidentCompatible: True

## Edit Reminder

- identifier: `is.workflow.actions.setters.reminders`  ·  class `WFContentItemSetterAction`
- ResidentCompatible: True
- parameters:
  - `WFReminderContentItemList` () Value choices=["Reminders"]
  - `WFReminderContentItemPriority` () Value choices=["High", "Low", "Medium", "None"]

## Eject Disk

- identifier: `is.workflow.actions.ejectdisk`  ·  class `WFEjectDiskAction`
- This action ejects a mounted disk or volume.
- summary: `Eject ${WFInput}`
- input: WFGenericFileContentItem (required)
- keywords: dmg
- parameters:
  - `WFInput` (FilePicker) Disk

## Email Address

- identifier: `is.workflow.actions.email`  ·  class `WFEmailAddressAction`
- Passes the specified email addresses to the next action.
- output: Email Address WFEmailAddress
- keywords: emails, e-mails, address
- icon: envelope.fill (Cyan)
- ResidentCompatible: True
- parameters:
  - `WFEmailAddress` (EmailAddressField) Email Address

## Encode Media

- identifier: `is.workflow.actions.encodemedia`  ·  class `WFEncodeMediaAction`
- Re-encodes the media passed as input at the specified size, optionally converting to audio.
- summary: `Encode ${WFMedia}`
- input: AVAsset (required)
- output: Encoded Media AVAsset
- keywords: quicktime, render, audio, transcode, metadata, artwork, id3, video
- icon: quicktime (Cyan)
- ResidentCompatible: True
- InputPassthrough: False
- AppIdentifier: com.apple.QuickTimePlayerX
- parameters:
  - `WFMedia` (VariablePicker) Media
  - `WFMediaAudioOnly` (Switch) Audio Only default=false
  - `WFMediaAudioFormat` (Enumeration) Format default="M4A" choices=["M4A", "AIFF"]
  - `WFMediaSize` (Enumeration) Size default="Passthrough" choices=["640x480", "960x540", "1280x720", "1920x1080", "3840x2160", "HEVC 1920x1080", "HEVC 3840x2160", "ProRes 422", "Passthrough"]
  - `WFMediaSpeed` (Enumeration) Speed default="Normal" choices=["0.5X", "Normal", "1.5X", "2X", "Custom"]
  - `WFMediaPreserveTransparency` (Switch) Preserve Transparency default=false
  - `WFMediaCustomSpeed` (NumberField) Custom Speed — A number greater than zero that indicates how fast or slow to encode the media. Values between 0.0 and 1.0 slow down the media.
  - `Metadata` (Expanding) Metadata
  - `WFMetadataTitle` (TextInput) Title
  - `WFMetadataArtist` (TextInput) Artist
  - `WFMetadataAlbum` (TextInput) Album
  - `WFMetadataGenre` (TextInput) Genre
  - `WFMetadataYear` (TextInput) Year
  - `WFMetadataArtwork` (VariablePicker) Artwork

## End Workout

- identifier: `is.workflow.actions.workout.end`  ·  class `WFEndWorkoutIntentAction`
- Ends the active workout on your Apple Watch.
- summary: `End workout`
- keywords: workout, watch, fitness
- InputPassthrough: True
- parameters:
  - `IntentAppDefinition` (IntentAppPicker) App default={"BundleIdentifier": "com.apple.SessionTrackerApp"}

## Expand URL

- identifier: `is.workflow.actions.url.expand`  ·  class `WFExpandURLAction`
- This action expands and cleans up URLs which have been shortened using a URL shortening service like TinyURL or Bit.ly.
- result: The full, expanded URL, or the original URL if the URL was not shortened
- note: The expanded URL is cleaned, removing unnecessary parameters such as “utm_source”.
- summary: `Expand ${URL}`
- input: WFURLContentItem (required)
- output: Expanded URL WFURLContentItem
- keywords: clean, link, links, long, short
- icon: link (Tint)
- ResidentCompatible: True
- parameters:
  - `URL` (TextInput) URL

## Extract Archive

- identifier: `is.workflow.actions.unzip`  ·  class `WFExtractArchiveAction`
- Extracts files from the archive passed as input. Many archive formats are supported, including zip, rar, tar.gz, tar.bz2, tar, gzip, cpio, cab, and iso archives.
- input: Archive
- summary: `Extract ${WFArchive}`
- input: public.data (required)
- output: Files WFGenericFileContentItem
- keywords: extract, unarchive, unzip, contents, gzip
- icon: doc.zipper (Tint)
- parameters:
  - `WFArchive` (VariablePicker) Archive

## FaceTime

- identifier: `com.apple.facetime.facetime`  ·  class `WFStartCallAction`
- Calls the contact passed in as input using FaceTime.
- summary: `${WFFaceTimeType} ${WFFaceTimeContact}`
- input: WFPhoneNumber, WFEmailAddress, NSString (required)
- keywords: phone, number, call
- InputPassthrough: True
- parameters:
  - `IntentAppDefinition` (IntentAppPicker) App default={"BundleIdentifier": "com.apple.TelephonyUtilities.PhoneIntentHandler"}
  - `WFFaceTimeType` (Enumeration) Call Type default="Video" choices=["Video", "Audio"]
  - `WFFaceTimeContact` (ContactField) Contact

## File

- identifier: `is.workflow.actions.file`  ·  class `WFFileAction`
- Passes the specified files or folders as output.
- summary: `${WFFile}`
- output: File public.data
- keywords: file, document, filepicker, select, folder
- icon: doc.fill (Tint)
- parameters:
  - `WFFile` (FilePicker) File

## Filter Articles

- identifier: `is.workflow.actions.filter.articles`  ·  class `WFContentItemFilterAction`
- output: Articles
- icon: line.3.horizontal.decrease.circle.fill (Orange)
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemSortProperty` () Sort by choices=["Author", "Name", "Number of Words", "Published Date", "Random", "Title"]

## Filter Event Attendees

- identifier: `is.workflow.actions.filter.eventattendees`  ·  class `WFContentItemFilterAction`
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemSortProperty` () Sort by choices=["Email Address", "Name", "Random", "Role", "Status", "Type"]

## Filter Files

- identifier: `is.workflow.actions.filter.files`  ·  class `WFContentItemFilterAction`
- input: public.data
- icon: line.3.horizontal.decrease.circle.fill (Tint)
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemSortProperty` () Sort by choices=["Creation Date", "File Extension", "File Path", "File Size", "Last Modified Date", "Name", "Random"]

## Filter Images

- identifier: `is.workflow.actions.filter.images`  ·  class `WFContentItemFilterAction`
- input: WFPhotoMediaContentItem, WFImageContentItem, WFAVAssetContentItem
- icon: line.horizontal.3.decrease.circle.fill (Blue)
- ResidentCompatible: True
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemSortProperty` () Sort by choices=["Creation Date", "Date Taken", "Duration", "File Extension", "File Path", "File Size", "Frame Rate", "Height", "Last Modified Date", "Name", "Orientation", "Random", "Time Taken", "Width"]

## Filter Locations

- identifier: `is.workflow.actions.filter.locations`  ·  class `WFContentItemFilterAction`
- output: Locations
- icon: line.3.horizontal.decrease.circle.fill (Tint)
- ResidentCompatible: True
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemSortProperty` () Sort by choices=["Altitude", "City", "Country", "Label", "Latitude", "Longitude", "Name", "Phone Number", "Random", "State", "Street", "ZIP Code"]

## Find App Store Apps

- identifier: `is.workflow.actions.searchappstore`  ·  class `WFSearchiTunesAction`
- Searches the App Store, returning the apps that match the specified search terms. You can get more details about the results using the Get Details of App Store App action.
- summary: `Find ${WFSearchTerm} on the App Store`
- output: App Store Apps WFAppStoreAppContentItem
- keywords: app, song, music, movie, ebook, audiobook, tv, album, store, search, get
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFSearchTerm` (TextInput) Search
  - `WFAttribute` (DynamicEnumeration) Search By
  - `WFEntity` (DynamicEnumeration) Results
  - `WFCountry` (iTunesStoreCountryPicker) Region
  - `WFItemLimit` (Stepper) default=25

## Find Apps

- identifier: `is.workflow.actions.filter.apps`  ·  class `WFContentItemFilterAction`
- input: WFAppContentItem
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemInputParameter` () apps choices=["Library"]
  - `WFContentItemSortProperty` () Sort by choices=["Bundle Identifier", "Launch Date", "Name", "Process Identifier", "Random"]

## Find Calendar Events

- identifier: `is.workflow.actions.filter.calendarevents`  ·  class `WFContentItemFilterAction`
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemInputParameter` () calendar events choices=["Library"]
  - `WFContentItemSortProperty` () Sort by choices=["Calendar", "Creation Date", "Duration", "End Date", "File Extension", "File Path", "Last Modified Date", "My Status", "Name", "Number of Attendees", "Random", "Start Date", "Title"]

## Find Contacts

- identifier: `is.workflow.actions.filter.contacts`  ·  class `WFContentItemFilterAction`
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemInputParameter` () contacts choices=["Library"]
  - `WFContentItemSortProperty` () Sort by choices=["Birthday", "Company", "Creation Date", "Department", "File Extension", "File Path", "First Name", "Job Title", "Last Modified Date", "Last Name", "Middle Name", "Name", "Nickname", "Phonetic First Name", "Phonetic Last Name", "Phonetic Middle Name", "Prefix", "Random", "Suffix"]

## Find Displays

- identifier: `is.workflow.actions.filter.displays`  ·  class `WFContentItemFilterAction`
- input: WFDisplayContentItem
- icon: display.2 (Blue)
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemInputParameter` () displays choices=["Library"]
  - `WFContentItemSortProperty` () Sort by choices=["Name", "Random", "Scale"]

## Find Giphy GIFs

- identifier: `is.workflow.actions.giphy`  ·  class `WFGiphyAction`
- Finds GIFs representing the provided text, using Giphy.
- note: Powered by Giphy (giphy.com)
- summary: `Find ${WFGiphyQuery} GIFs on Giphy`
- output: GIFs WFGiphyObject
- keywords: gif, search
- parameters:
  - `WFGiphyQuery` (TextInput) Search
  - `WFGiphyShowPicker` (Switch) Show GIF Picker default=true
  - `WFGiphyLimit` (Stepper) default=1
  - `WFGiphySelectMultiple` (Switch) Select Multiple

## Find Health Samples

- identifier: `is.workflow.actions.filter.health.quantity`  ·  class `WFFindHealthSamplesAction`
- note: If you only see some but not all of your data in the results, make sure that “Allow Shortcuts to read data” is set to on in the Health app.

## Find iTunes Store Items

- identifier: `is.workflow.actions.searchitunes`  ·  class `WFSearchiTunesAction`
- Searches the iTunes Store, returning the items that match the specified search terms. You can get more details about the results using the Get Details of iTunes Product action.
- summary: `Find ${WFSearchTerm} on the iTunes Store`
- output: iTunes Products WFiTunesProductContentItem
- keywords: app, song, music, movie, ebook, audiobook, tv, album, store, search
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFSearchTerm` (TextInput) Search
  - `WFMediaType` (DynamicEnumeration) Category
  - `WFAttribute` (DynamicEnumeration) Search By
  - `WFEntity` (DynamicEnumeration) Results
  - `WFCountry` (iTunesStoreCountryPicker) Region
  - `WFItemLimit` (Stepper) default=25

## Find Music

- identifier: `is.workflow.actions.filter.music`  ·  class `WFContentItemFilterAction`
- input: WFMPMediaContentItem, WFAVAssetContentItem, WFGenericFileContentItem
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemInputParameter` () music choices=["Library"]
  - `WFContentItemSortProperty` () Sort by choices=["Album", "Album Artist", "Album Track #", "Artist", "Composer", "Date Added", "Disc #", "Duration", "File Path", "Genre", "Last Played Date", "Media Kind", "Name", "Play Count", "Random", "Rating", "Release Date", "Skip Count", "Title"]

## Find Photos

- identifier: `is.workflow.actions.filter.photos`  ·  class `WFContentItemFilterAction`
- input: WFPhotoMediaContentItem, WFImageContentItem, WFAVAssetContentItem, WFGenericFileContentItem
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemInputParameter` () photos choices=["Library"]
  - `WFContentItemSortProperty` () Sort by choices=["Creation Date", "Date Taken", "Duration", "File Extension", "File Path", "Frame Rate", "Height", "Last Modified Date", "Media Type", "Name", "Random", "Time Taken", "Width"]

## Find Places

- identifier: `is.workflow.actions.searchlocalbusinesses`  ·  class `WFSearchLocalBusinessesAction`
- Finds nearby places using Maps, and returns the results.
- input: A location to search near.
- summary: `Find ${WFSearchQuery} near ${WFInput}`
- input: CLLocation
- output: Local Businesses MKMapItem
- keywords: maps, search, query, place, location, nearby, find, local, businesses
- ResidentCompatible: True
- parameters:
  - `WFInput` (Location) Location
  - `WFSearchQuery` (TextInput) Search — Keywords used to search for places.
  - `WFSearchRadius` (SearchLocalBusinessesRadius) Radius
  - `WFSearchSortOrder` (Enumeration) Sort By default="Relevance" choices=["Relevance", "Distance"] — How to order the search results - by relevance, or by distance from the reference location.

## Find Podcasts

- identifier: `is.workflow.actions.searchpodcasts`  ·  class `WFSearchiTunesAction`
- Finds podcasts in the Apple Podcasts catalog, returning the items that match the specified search terms.
- summary: `Find ${WFSearchTerm}`
- output: Podcasts WFPodcastShowContentItem
- keywords: podcast, search
- InputPassthrough: False
- parameters:
  - `WFSearchTerm` (TextInput) Search
  - `WFAttribute` (DynamicEnumeration) Search By
  - `WFEntity` (DynamicEnumeration) Results
  - `WFCountry` (iTunesStoreCountryPicker) Country
  - `WFItemLimit` (Stepper) default=25

## Find Reminders

- identifier: `is.workflow.actions.filter.reminders`  ·  class `WFContentItemFilterAction`
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemInputParameter` () reminders choices=["Library"]
  - `WFContentItemSortProperty` () Sort by choices=["Completion Date", "Creation Date", "Due Date", "File Extension", "File Path", "Last Modified Date", "List", "Name", "Priority", "Random", "Title"]

## Find VPNs

- identifier: `is.workflow.actions.filter.vpns`  ·  class `WFContentItemFilterAction`
- Searches for VPNs installed on your device that match the given criteria.
- input: WFVPNContentItem
- output: Found VPNs WFVPNConfiguration
- keywords: virtual, private, network, secure, connect, tunnel
- icon: network.connected.to.line.below.fill (Blue)
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemInputParameter` () VPNs choices=["Library"]
  - `WFContentItemSortProperty` () Sort by choices=["Name", "Random", "Server Address"]

## Find Windows

- identifier: `is.workflow.actions.filter.windows`  ·  class `WFContentItemFilterAction`
- input: WFWindowContentItem
- parameters:
  - `WFCompoundType` () choices=["0", "1"]
  - `WFContentItemInputParameter` () windows choices=["Library"]
  - `WFContentItemSortProperty` () Sort by choices=["App Name", "Height", "Name", "Random", "Width", "Window Index", "X Position", "Y Position"]

## Flip Image

- identifier: `is.workflow.actions.image.flip`  ·  class `WFImageFlipAction`
- Reverses the direction of images either horizontally or vertically.
- summary: `Flip ${WFInput} ${WFImageFlipDirection}`
- input: WFImage (required)
- output: Flipped Image WFImage
- keywords: portrait, landscape, horizontal, vertical, photos
- icon: arrow.left.and.right.righttriangle.left.righttriangle.right.fill (Blue)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFImageFlipDirection` (Enumeration) Direction default="Horizontal" choices=["Horizontal", "Vertical"]
  - `WFInput` (VariablePicker) Image

## Follow Podcast

- identifier: `is.workflow.actions.podcasts.subscribe`  ·  class `WFSubscribeToPodcastAction`
- Follows podcasts or podcast feed URLs passed into the action.
- summary: `Follow ${WFInput}`
- input: WFURLContentItem, WFPodcastShowContentItem (required)
- keywords: URL, podcast, show
- InputPassthrough: True
- parameters:
  - `WFInput` (TextInput) Podcast URL

## Format Date

- identifier: `is.workflow.actions.format.date`  ·  class `WFFormatDateAction`
- Formats a date and time into text.
- note: Custom format strings use the format patterns from Unicode Technical Standard #35 (unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_Patterns).
- summary: `Format ${WFDate}`
- input: WFDateContentItem (required)
- output: Formatted Date NSString
- keywords: date, time, formatter
- icon: calendar (Tint)
- ResidentCompatible: True
- parameters:
  - `WFDateFormatStyle` (Enumeration) Date Format default="Short" choices=["None", "Short", "Medium", "Long", "Relative", "RFC 2822", "ISO 8601", "Custom"]
  - `WFRelativeDateFormatStyle` (Enumeration) Alternate Format default="Medium" choices=["Short", "Medium", "Long"]
  - `WFTimeFormatStyle` (Enumeration) Time Format default="Short" choices=["None", "Short", "Medium", "Long", "Relative"]
  - `WFISO8601IncludeTime` (Switch) Include ISO 8601 Time
  - `WFDateFormat` (CustomDateFormat) Format String
  - `WFDate` (DateField) Date
  - `WFLocale` (LocalePicker) Locale

## Format File Size

- identifier: `is.workflow.actions.format.filesize`  ·  class `WFFormatFileSizeAction`
- Formats a file size into text.
- input: A file size from another action, or a number of bytes
- note: 1000 bytes are shown as 1 KB.
- summary: `Format ${WFFileSize} into ${WFFileSizeFormat}`
- input: WFFileSizeContentItem, WFNumberContentItem (required)
- output: Formatted File Size NSString
- keywords: byte, bytes, megabyte, megabytes, count
- icon: document.fill (Tint)
- parameters:
  - `WFFileSizeFormat` (Enumeration) Format default="Automatic" choices=["Automatic", "Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB or Higher"]
  - `WFFileSizeIncludeUnits` (Switch) Include Units default=true
  - `WFFileSize` (NumberField) File Size

## Format Number

- identifier: `is.workflow.actions.format.number`  ·  class `WFFormatNumberAction`
- Formats a number into text.
- summary: `Format ${WFNumber} to ${WFNumberFormatDecimalPlaces}`
- input: WFBooleanContentItem, WFNumberContentItem (required)
- output: Formatted Number NSString
- keywords: digits, decimal
- icon: number (Gray)
- ResidentCompatible: True
- parameters:
  - `WFNumber` (NumberField) Number
  - `WFNumberFormatDecimalPlaces` (Stepper) default=2

## Generate Hash

- identifier: `is.workflow.actions.hash`  ·  class `WFGenerateHashAction`
- Generates a MD5/SHA1 hash from the input.
- summary: `Generate ${WFHashType} hash of ${WFInput}`
- input: WFGenericFileContentItem (required)
- output: Hash NSString
- keywords: crypto
- icon: hexagon.fill (Gray)
- ResidentCompatible: True
- parameters:
  - `WFHashType` (Enumeration) Type default="MD5" choices=["MD5", "SHA1", "SHA256", "SHA512"]
  - `WFInput` (VariablePicker) Input

## Get Addresses from Input

- identifier: `is.workflow.actions.detect.address`  ·  class `WFCoercionAction`
- Returns any street addresses found in the output from the previous action.
- summary: `Get addresses from ${WFInput}`
- input: WFStreetAddress (required)
- output: Addresses WFLocationContentItem
- keywords: address, street, detect, scan, map
- icon: mappin (Tint)
- ResidentCompatible: True
- parameters:
  - `WFInput` (VariablePicker) Input

## Get All Wallpapers

- identifier: `is.workflow.actions.posters.get`  ·  class `WFGetPostersAction`
- Gets all of your Lock Screen wallpapers, and returns them as output so you can use them with other actions.
- summary variants:
  - `Get ${WFPosterType} wallpapers`  when {"WFPosterType": "All"}
  - `Get ${WFPosterType} wallpaper`  when {"WFPosterType": "Current"}
- output: Wallpapers WFPosterRepresentation
- keywords: current, photo, lock, home, screen
- parameters:
  - `WFPosterType` (Enumeration) Type default="All" choices=["All", "Current"]

## Get Article using Safari Reader

- identifier: `is.workflow.actions.getarticle`  ·  class `WFCoercionAction`
- Gets article details, including body text, author, publish date, and more, from every URL passed into the action.
- note: Use a Get Details of Article action immediately after this action to get specific details about the article. This action only supports getting one article from each URL.
- summary: `Get article from ${WFWebPage}`
- input: WFURLContentItem (required)
- output: Article WFArticleContentItem
- keywords: web, pages, author, word, excerpt, title, content, body, published, reader
- icon: safari (Orange)
- InputPassthrough: False
- parameters:
  - `WFWebPage` (TextInput) URL

## Get Battery Status

- identifier: `is.workflow.actions.getbatterylevel`  ·  class `WFBatteryLevelAction`
- Returns information about the battery and any charger connected to the device.
- result: A number with the current battery percentage, current charge limit, or a Yes/No Boolean value.
- note: You can use this action to fetch the current battery percentage, whether your device is plugged into a charger or is charging, or get the current battery charge limit if one is enabled.
- summary: `Get ${Subject}`
- output: Battery State NSDecimalNumber, WFBooleanContentItem
- keywords: remaining, percentage, left, power, charging, charger, plugged, outlet, level, connected, lightning, usb
- icon: battery.100 (Green)
- parameters:
  - `Subject` (Enumeration) Get default="Battery Level" choices=["Battery Level", "Is Charging", "Is Connected to Charger", "Charge Limit"]

## Get Clipboard

- identifier: `is.workflow.actions.getclipboard`  ·  class `WFGetClipboardAction`
- Passes the contents of the clipboard to the next action.
- summary: `Get clipboard`
- output: Clipboard WFContentItem
- keywords: text, clipboard, copy, paste, contents, of
- icon: clipboard.fill (Tint)

## Get Component of URL

- identifier: `is.workflow.actions.geturlcomponent`  ·  class `WFURLGetComponentAction`
- Gets the specified part of the URL passed into the action.
- note: URLs are structured as follows: scheme://user:password@host:port/path?query#fragment
- summary: `Get ${WFURLComponent} from ${WFURL}`
- input: WFURLContentItem (required)
- output: Component of URL NSString
- keywords: Scheme, User, Password, Host, Port, Path, Query, Fragment
- icon: link (Tint)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFURL` (TextInput) URL
  - `WFURLComponent` (Enumeration) Component default="Scheme" choices=["Scheme", "User", "Password", "Host", "Port", "Path", "Query", "Fragment"]

## Get Contacts from Input

- identifier: `is.workflow.actions.detect.contacts`  ·  class `WFCoercionAction`
- Gets contacts from the result of the previous action.
- summary: `Get contacts from ${WFInput}`
- input: WFContact (required)
- output: Contacts WFContactContentItem
- keywords: find, detect, people, person, email, e-mail, phone
- ResidentCompatible: True
- parameters:
  - `WFInput` (VariablePicker) Input

## Get Contents of Folder

- identifier: `is.workflow.actions.file.getfoldercontents`  ·  class `WFGetFolderContentsAction`
- This action gets the files inside of the specified folder.
- result: The folder contents
- summary: `Get contents of ${WFFolder}`
- input: public.data (required)
- output: Folder Contents public.data
- keywords: directory, files
- icon: folder.fill (Tint)
- parameters:
  - `WFFolder` (FilePicker) Folder
  - `Recursive` (Switch) Recursive default=false — If this option is enabled, this action will get all the files inside of a folder, including its subfolders.

## Get Contents of URL

- identifier: `is.workflow.actions.downloadurl`  ·  class `WFDownloadURLAction`
- Gets the contents of URLs passed into the action. Useful for downloading files and web content, or for making API requests.
- result: The fetched data
- note: To make a multipart HTTP request, choose “Form” as the request body type and add files as field values.
- summary: `Get contents of ${WFURL}`
- input: WFURLContentItem (required)
- output: Contents of URL public.data
- keywords: URL, web, display, site, open, show, post, put, api, curl, wget, http, headers, request, form
- icon: square.and.arrow.down (Green)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFURL` (TextInput) URL
  - `WFHTTPMethod` (Enumeration) Method default="GET" choices=["GET", "POST", "PUT", "PATCH", "DELETE"] — The HTTP method to use.
  - `ShowHeaders` (Expanding) Headers
  - `WFHTTPHeaders` (Dictionary) Headers
  - `WFHTTPBodyType` (Enumeration) Request Body default="JSON" choices=["JSON", "Form", "File"]
  - `WFFormValues` (Dictionary) Form Values
  - `WFJSONValues` (Dictionary) JSON Values
  - `WFRequestVariable` (VariablePicker) File

## Get Contents of Web Page

- identifier: `is.workflow.actions.getwebpagecontents`  ·  class `WFGetWebPageAction`
- Extracts the contents of the web pages passed into the action.
- summary: `Get contents of web page at ${WFInput}`
- input: WFURLContentItem (required)
- output: Contents of Web Page NSAttributedString
- ResidentCompatible: True
- parameters:
  - `WFInput` (TextInput) URL

## Get Current App

- identifier: `is.workflow.actions.getcurrentapp`  ·  class `WFGetCurrentAppAction`
- Gets the current visible app.
- summary variants:
  - `Get ${WFVisibleAppScope} app`  when {"WFVisibleAppScope": "Current"}
  - `Get ${WFVisibleAppScope} apps`  when {"WFVisibleAppScope": "Visible"}
- output: Current App WFApp
- keywords: app, foreground, visible, topmost
- parameters:
  - `WFVisibleAppScope` (Enumeration) Scope default="Current" choices=["Current", "Visible"]

## Get Current Focus

- identifier: `is.workflow.actions.dnd.getfocus`  ·  class `WFGetFocusAction`
- Returns the currently active Focus.
- note: This action returns nothing if no Focus is active.
- output: Current Focus WFFocusModeContentItem
- keywords: dnd, disturb, silence
- icon: moon.fill (Indigo)

## Get Current IP Address

- identifier: `is.workflow.actions.getipaddress`  ·  class `WFGetIPAddressAction`
- Returns the local or external IP address of the device.
- summary: `Get current IP address`
- output: Current IP Address NSString
- keywords: network, local, external, cellular, wi-fi, wifi
- icon: ethernet (Blue)
- ResidentCompatible: True
- parameters:
  - `WFIPAddressSourceOption` (Enumeration) Address default="External" choices=["External", "Local"]
  - `WFIPAddressTypeOption` (Enumeration) Type default="IPv4" choices=["IPv4", "IPv6"]

## Get Current Location

- identifier: `is.workflow.actions.getcurrentlocation`  ·  class `WFGetCurrentLocationAction`
- Gets the current location of the device.
- summary: `Get current location`
- output: Current Location CLLocation
- keywords: gps, map, place, address
- icon: location.fill (Blue)
- ResidentCompatible: True
- parameters:
  - `Accuracy` (LocationAccuracy) Precision

## Get Current Song

- identifier: `is.workflow.actions.getcurrentsong`  ·  class `WFGetCurrentSongAction`
- Returns the song that is currently playing in the Music app, if any.
- summary: `Get ${Subject}`
- output: Current Song MPMediaItem, WFTimeInterval
- keywords: current, song, ipod, track, music, itunes, library, listening, playing
- InputPassthrough: False
- parameters:
  - `Subject` (Enumeration) Get default="Current Song" choices=["Current Song", "Current Playback Time"]

## Get Current VPN

- identifier: `is.workflow.actions.vpn.get`  ·  class `WFGetVPNAction`
- Returns the currently active VPN. If VPN is not active, this action returns nothing.
- output: Current VPN WFVPNConfiguration
- keywords: virtual, private, network, secure, connect, tunnel
- icon: network.connected.to.line.below.fill (Blue)
- InputPassthrough: False

## Get Current Weather

- identifier: `is.workflow.actions.weather.currentconditions`  ·  class `WFGetCurrentWeatherConditionsAction`
- Gets the current weather conditions at the specified location.
- summary: `Get weather at ${WFWeatherCustomLocation}`
- output: Weather Conditions WFWeatherData
- keywords: current, temperature, visibility, humidity, pressure, wind, sunrise, sunset
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFWeatherCustomLocation` (Location) Location

## Get Current Web Page from Safari

- identifier: `is.workflow.actions.safari.geturl`  ·  class `WFGetCurrentSafariWebPageAction`
- Gets the web page of the frontmost Safari window.
- summary: `Get current web page from Safari`
- output: Web Page WFSafariWebPage
- keywords: url, webpage, safari, website, current, web

## Get Dates from Input

- identifier: `is.workflow.actions.detect.date`  ·  class `WFCoercionAction`
- Returns any dates found in the output from the previous action.
- summary: `Get dates from ${WFInput}`
- input: NSDate (required)
- output: Dates WFDateContentItem
- keywords: date, time, detect, scan
- icon: calendar (Tint)
- ResidentCompatible: True
- parameters:
  - `WFInput` (VariablePicker) Input

## Get Details of App Store App

- identifier: `is.workflow.actions.properties.appstore`  ·  class `WFContentItemPropertiesAction`
- output: Details of App Store Apps
- ResidentCompatible: True
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["# of Ratings", "# of Ratings (This Version)", "Artist", "Artwork", "Artwork URL", "Bundle Identifier", "Category", "Content Rating", "Currency Code", "Description", "Download Size", "Formatted Price", "Is Universal", "Last Updated", "Minimum OS Version", "Name", "Price", "Rating", "Rating (This Version)", "Release Date", "Release Notes", "Screenshot URLs", "Store ID", "Store URL", "Supported Devices", "Supported Languages", "Supports Game Center", "Version", "iPad Screenshot URLs"]

## Get Details of Appearance

- identifier: `is.workflow.actions.properties.appearance`  ·  class `WFContentItemPropertiesAction`
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Dark Mode Is On", "Inverse Appearance", "Name"]

## Get Details of Article

- identifier: `is.workflow.actions.properties.articles`  ·  class `WFContentItemPropertiesAction`
- output: Details of Articles
- icon: doc.richtext.fill (Orange)
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Author", "Body", "Excerpt", "Main Image URL", "Name", "Number of Words", "Published Date", "Title", "URL"]

## Get Details of Calendar Events

- identifier: `is.workflow.actions.properties.calendarevents`  ·  class `WFContentItemPropertiesAction`
- output: Details of Calendar Events
- ResidentCompatible: True
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Attachments", "Attendees", "Calendar", "Canceled", "Creation Date", "Duration", "End Date", "File Extension", "File Path", "File Size", "Has Alarms", "Is All Day", "Last Modified Date", "Location", "My Status", "Name", "Notes", "Number of Attendees", "Organizer", "Organizer Is Me", "Start Date", "Title", "URL"]

## Get Details of Contacts

- identifier: `is.workflow.actions.properties.contacts`  ·  class `WFContentItemPropertiesAction`
- ResidentCompatible: True
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Birthday", "Company", "Contact Photo", "Creation Date", "Department", "Email Addresses", "File Extension", "File Path", "File Size", "First Name", "Job Title", "Last Modified Date", "Last Name", "Middle Name", "Name", "Nickname", "Notes", "Phone Numbers", "Phonetic First Name", "Phonetic Last Name", "Phonetic Middle Name", "Prefix", "Relationship to Me", "Street Addresses", "Suffix", "URLs"]

## Get Details of Event Attendees

- identifier: `is.workflow.actions.properties.eventattendees`  ·  class `WFContentItemPropertiesAction`
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Email Address", "Is Me", "Name", "Role", "Status", "Type"]

## Get Details of Files

- identifier: `is.workflow.actions.properties.files`  ·  class `WFContentItemPropertiesAction`
- input: public.data
- icon: doc.fill.badge.ellipsis (Tint)
- ResidentCompatible: True
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Creation Date", "File Extension", "File Path", "File Size", "Last Modified Date", "Name"]

## Get Details of Health Sample

- identifier: `is.workflow.actions.properties.health.quantity`  ·  class `WFContentItemPropertiesAction`

## Get Details of Images

- identifier: `is.workflow.actions.properties.images`  ·  class `WFContentItemPropertiesAction`
- input: WFPhotoMediaContentItem, WFImageContentItem, WFAVAssetContentItem
- keywords: photo, video, media
- icon: photo.fill (Blue)
- ResidentCompatible: True
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Album", "Camera Make", "Camera Model", "Creation Date", "Date Taken", "Duration", "File Extension", "File Path", "File Size", "Frame Rate", "Height", "Is Favorite", "Is a Screen Recording", "Is a Screenshot", "Last Modified Date", "Location", "Media Type", "Metadata Dictionary", "Name", "Orientation", "Photo Type", "Width"]

## Get Details of iTunes Artist

- identifier: `is.workflow.actions.properties.itunesartist`  ·  class `WFContentItemPropertiesAction`
- output: Details of Itunes Artists
- ResidentCompatible: True
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Artwork", "Artwork URL", "Genre", "Name", "Store ID", "Store URL", "Type"]

## Get Details of iTunes Product

- identifier: `is.workflow.actions.properties.itunesstore`  ·  class `WFContentItemPropertiesAction`
- output: Details of Itunes Products
- ResidentCompatible: True
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Artist", "Artwork", "Artwork URL", "Currency Code", "Description", "Duration", "Formatted Price", "Genre", "Is Explicit", "Name", "Price", "Release Date", "Store ID", "Store URL", "Streamable"]

## Get Details of Locations

- identifier: `is.workflow.actions.properties.locations`  ·  class `WFContentItemPropertiesAction`
- keywords: geocode, latitude, longitude
- icon: mappin (Tint)
- ResidentCompatible: True
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Altitude", "City", "Country", "Label", "Latitude", "Longitude", "Name", "Phone Number", "State", "Street", "URL", "ZIP Code"]

## Get Details of Music

- identifier: `is.workflow.actions.properties.music`  ·  class `WFContentItemPropertiesAction`
- input: WFMPMediaContentItem, WFAVAssetContentItem
- output: Artist
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Album", "Album Artist", "Album Artwork", "Album Track #", "Artist", "Comments", "Composer", "Date Added", "Disc #", "Duration", "File Path", "Genre", "Is Cloud Item", "Is Explicit", "Last Played Date", "Lyrics", "Media Kind", "Name", "Play Count", "Rating", "Release Date", "Skip Count", "Title"]

## Get Details of Parked Car

- identifier: `is.workflow.actions.properties.parkedcar`  ·  class `WFContentItemPropertiesAction`
- icon: car.fill (Tint)
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Date", "Location", "Name", "Notes", "Photo", "Was Location Set by User"]

## Get Details of Podcast

- identifier: `is.workflow.actions.properties.podcastshow`  ·  class `WFContentItemPropertiesAction`
- output: Details of Podcasts
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Artist", "Artwork", "Artwork URL", "Episode Count", "Feed URL", "Genre", "Name", "Store ID", "Store URL"]

## Get Details of Podcast Episode

- identifier: `is.workflow.actions.properties.podcast`  ·  class `WFContentItemPropertiesAction`
- output: Details of Podcast Episodes
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Artwork", "Artwork URL", "Author", "Description", "Duration", "Genres", "Name", "Release Date", "Store ID", "Store URL", "Title"]

## Get Details of Reminders

- identifier: `is.workflow.actions.properties.reminders`  ·  class `WFContentItemPropertiesAction`
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Completion Date", "Creation Date", "Due Date", "File Extension", "File Path", "File Size", "Has Alarms", "Has Subtasks", "Images", "Is Completed", "Is Flagged", "Last Modified Date", "List", "Name", "Notes", "Parent Reminder", "Priority", "Reminder Location", "Subtasks", "Tags", "Title", "URL"]

## Get Details of Ride Status

- identifier: `is.workflow.actions.properties.ridestatus`  ·  class `WFContentItemPropertiesAction`
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Driver", "Drop Off Location", "Drop Off Time", "Maximum Price", "Minimum Price", "Name", "Pickup Location", "Pickup Time", "Ride Option Name", "Vehicle Information"]

## Get Details of Safari Web Page

- identifier: `is.workflow.actions.properties.safariwebpage`  ·  class `WFContentItemPropertiesAction`
- note: Safari Web Page items are only available when running your shortcut as an Action Extension in Safari.
- output: Details of Safari Web Pages
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Name", "Page Contents", "Page Selection", "Page URL"]

## Get Details of Shazam

- identifier: `is.workflow.actions.properties.shazam`  ·  class `WFContentItemPropertiesAction`
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Apple Music ID", "Apple Music URL", "Artist", "Artwork", "Is Explicit", "Lyric Snippet Synced", "Lyrics Snippet", "Name", "Shazam URL", "Title", "Video URL"]

## Get Details of Shortcut

- identifier: `is.workflow.actions.properties.workflow`  ·  class `WFContentItemPropertiesAction`
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Action Count", "Creation Date", "File Extension", "File Path", "File Size", "Folder", "Icon", "Last Modified Date", "Name"]

## Get Details of Trello Item

- identifier: `is.workflow.actions.properties.trello`  ·  class `WFContentItemPropertiesAction`
- input: WFTrelloBoardContentItem, WFTrelloListContentItem, WFTrelloCardContentItem (required)
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Card Attachments", "Card Due Date", "Description", "Name", "URL"]

## Get Details of Ulysses Sheet

- identifier: `is.workflow.actions.properties.ulysses.sheet`  ·  class `WFContentItemPropertiesAction`
- input: WFUlyssesSheetContentItem (required)
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Contents", "Identifier", "Keywords", "Name", "Notes", "Title"]

## Get Details of Weather Conditions

- identifier: `is.workflow.actions.properties.weather.conditions`  ·  class `WFContentItemPropertiesAction`
- ResidentCompatible: True
- parameters:
  - `WFContentItemPropertyName` () Detail choices=["Air Pollutants", "Air Quality Category", "Air Quality Index", "Condition", "Date", "Dewpoint", "Feels Like", "High", "Humidity", "Location", "Low", "Name", "Precipitation Amount", "Precipitation Chance", "Pressure", "Sunrise Time", "Sunset Time", "Temperature", "UV Index", "Visibility", "Wind Direction", "Wind Speed"]

## Get Device Details

- identifier: `is.workflow.actions.getdevicedetails`  ·  class `WFGetDeviceDetailsAction`
- Gets information about the current device.
- summary: `Get the ${WFDeviceDetail}`
- output: Device Details NSString, NSNumber
- keywords: name, model, screen, dimensions, version, system, os, ios, software, current, brightness, volume, firmware
- icon: iphone (Blue)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFDeviceDetail` (Enumeration) Get default="Device Name" choices=["Device Name", "Device Hostname", "Device Model", "Device Is Watch", "System Version", "System Build Number", "Screen Width", "Screen Height", "Current Volume", "Current Brightness", "Current Appearance", "Device Is Locked"]

## Get Dictionary from Input

- identifier: `is.workflow.actions.detect.dictionary`  ·  class `WFCoercionAction`
- Makes a dictionary from the text passed as input. JSON (like {\"foo\": \"bar\"}), key-value pairs (like foo=bar&baz=biz), and XML-based plist are supported.
- summary: `Get dictionary from ${WFInput}`
- input: NSDictionary (required)
- output: Dictionary WFDictionaryContentItem
- keywords: json, xml, plist, www, urlencoded, form, query, string
- icon: book.closed.fill (Orange)
- ResidentCompatible: True
- parameters:
  - `WFInput` (VariablePicker) Input

## Get Dictionary Value

- identifier: `is.workflow.actions.getvalueforkey`  ·  class `WFGetDictionaryValueAction`
- Gets the value for the specified key in the dictionary passed into the action.
- note: You can reference values deep inside of a dictionary by providing multiple keys separated by dots. For example, to get the value “soup” from the dictionary {\"beverages\": [{\"favorite\": \"soup\"}]}, you can specify the key path “beverages.1.favorite”.
- summary variants:
  - `Get ${WFGetDictionaryValueType} in ${WFInput}`  when {"WFGetDictionaryValueType": "All Keys"}
  - `Get ${WFGetDictionaryValueType} in ${WFInput}`  when {"WFGetDictionaryValueType": "All Values"}
  - `Get ${WFGetDictionaryValueType} for ${WFDictionaryKey} in ${WFInput}`  when {"WFGetDictionaryValueType": "Value"}
- input: WFDictionaryContentItem (required)
- output: Dictionary Value WFStringContentItem, WFNumberContentItem, WFDateContentItem, WFDictionaryContentItem, WFBooleanContentItem
- keywords: json, plist, xml, urlencoded, query, string, for, key
- icon: book.closed.fill (Orange)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFGetDictionaryValueType` (Enumeration) Get default="Value" choices=["Value", "All Keys", "All Values"]
  - `WFDictionaryKey` (TextInput) Key
  - `WFInput` (VariablePicker) Dictionary

## Get Distance

- identifier: `is.workflow.actions.getdistance`  ·  class `WFGetDistanceAction`
- Calculates the distance to the location passed into this action.
- input: The destination
- result: The distance to the location in miles or kilometers.
- summary: `Get distance from ${WFGetDirectionsCustomLocation} to ${WFGetDistanceDestination}`
- input: NSString, CLLocation, MKMapItem (required)
- output: Distance NSNumber
- keywords: maps, directions, calculate
- icon: point.topleft.down.curvedto.point.bottomright.up (Tint)
- ResidentCompatible: True
- parameters:
  - `WFGetDirectionsCustomLocation` (Location) Start Location
  - `WFGetDistanceDestination` (Location) End Location
  - `WFGetDirectionsActionMode` (Enumeration) Route Type default="Direct" choices=["Direct", "Driving", "Walking", "Biking"]
  - `WFAvoidTolls` (Switch) Avoid Tolls default=false — When enabled, the route will avoid toll roads.
  - `WFAvoidHighways` (Switch) Avoid Highways default=false — When enabled, the route will avoid highways.
  - `WFDistanceUnit` (GetDistanceUnitPicker) Unit choices=["Miles", "Kilometers"]
  - `Accuracy` (LocationAccuracy) Precision

## Get Dropbox File

- identifier: `is.workflow.actions.dropbox.open`  ·  class `WFGetDropboxFileAction`
- Gets files from Dropbox. Turn off “Show Document Picker” to specify a path to retrieve.
- output: File public.data
- keywords: pick, select, file, document, filepicker.io, filepicker, ink
- parameters:
  - `WFShowFilePicker` (Switch) Show Document Picker default=true
  - `SelectMultiple` (Switch) Select Multiple default=false
  - `WFGetFilePath` (TextInput) File Path — The path to retrieve, such as “/folder/file.txt”
  - `WFGetFileInitialDirectoryPath` (TextInput) Initial Path
  - `WFFileErrorIfNotFound` (Switch) Error If Not Found default=true

## Get Email Addresses from Input

- identifier: `is.workflow.actions.detect.emailaddress`  ·  class `WFCoercionAction`
- Returns any email addresses found in the output from the previous action.
- summary: `Get email addresses from ${WFInput}`
- input: WFEmailAddress (required)
- output: Email Addresses WFEmailAddressContentItem
- keywords: find, search, detect, scan, e-mail, emails
- icon: envelope.circle.fill (Cyan)
- ResidentCompatible: True
- parameters:
  - `WFInput` (TextInput) Input

## Get Episodes of Podcast

- identifier: `is.workflow.actions.getepisodesforpodcast`  ·  class `WFGetEpisodesForPodcastAction`
- Returns a list of episodes from a podcast show.
- summary: `Get episodes of ${WFInput}`
- input: WFPodcastShowContentItem (required)
- output: Episodes WFPodcastEpisodeContentItem
- keywords: episodes, podcast, show, library
- parameters:
  - `WFInput` (PodcastPicker) Podcast

## Get File from Folder

- identifier: `is.workflow.actions.documentpicker.open`  ·  class `WFGetFileAction`
- Gets a file or folder by a relative path, starting at a folder you choose.
- summary: `Get file from ${WFFile} at path ${WFGetFilePath}`
- input: public.data (required)
- output: File public.data, public.folder
- keywords: file, document, filepicker, select
- icon: folder.fill (Tint)
- parameters:
  - `WFFileErrorIfNotFound` (Switch) Error If Not Found default=true
  - `WFGetFolderContents` (Switch) If Folder, Fetch Contents default=false
  - `WFFile` (FilePicker) Folder
  - `WFGetFilePath` (TextInput) Path — The relative path to retrieve, such as “folder/file.txt”

## Get File of Type

- identifier: `is.workflow.actions.gettypeaction`  ·  class `WFGetTypeAction`
- Returns a particular file type from the input.
- summary: `Get file of type ${WFFileType} from ${WFInput}`
- input: WFContentItem (required)
- output: File of Type public.data
- icon: gear.badge.questionmark (Gray)
- parameters:
  - `WFFileType` (TextInput) Type default="public.rtf"
  - `WFInput` (VariablePicker) Input

## Get Frames from Image

- identifier: `is.workflow.actions.getframesfromimage`  ·  class `WFGetFramesFromImageAction`
- Splits an animated GIF or a photo burst into individual frames.
- input: An animated GIF or photo burst
- result: The frames
- summary: `Get frames from ${WFImage}`
- input: com.compuserve.gif (required)
- output: Frames from Image WFImageContentItem, WFPhotoMediaContentItem
- keywords: animated, gif, burst, split, individual, explode, separate
- icon: square.stack.3d.forward.dottedline.fill (Purple)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFImage` (VariablePicker) Image

## Get Group from Matched Text

- identifier: `is.workflow.actions.text.match.getgroup`  ·  class `WFHandleCustomIntentAction`
- Gets the text that matched a particular capture group or all of the capture groups from the output of a Match Text action.
- output: Text
- keywords: finding, matching, searching, regular, expression, regexp
- ResidentCompatible: True
- parameters:
  - `WFGetGroupType` () Get choices=["All Groups", "Group At Index"]

## Get Halfway Point

- identifier: `is.workflow.actions.gethalfwaypoint`  ·  class `WFGetHalfwayPointAction`
- Gets the halfway point between two locations.
- summary: `Get halfway point between ${WFGetHalfwayPointFirstLocation} and ${WFGetHalfwayPointSecondLocation}`
- output: Halfway Point CLLocation
- keywords: Location, Maps, Two, Places
- icon: lines.measurement.horizontal (Tint)
- ResidentCompatible: True
- parameters:
  - `WFGetHalfwayPointFirstLocation` (Location) First Location
  - `WFGetHalfwayPointSecondLocation` (Location) Second Location

## Get Headers of URL

- identifier: `is.workflow.actions.url.getheaders`  ·  class `WFGetURLHeadersAction`
- Retrieves the HTTP headers of the URL passed as input using a HEAD request.
- summary: `Get headers of ${WFInput}`
- input: WFURLContentItem (required)
- output: Headers of URL NSDictionary
- keywords: URL, web, http
- icon: square.and.arrow.down (Green)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFInput` (TextInput) URL

## Get Hotspot Password

- identifier: `is.workflow.actions.personalhotspot.password.get`  ·  class `WFGetHotspotPasswordAction`
- Returns the password of your Personal Hotspot.
- summary: `Get Personal Hotspot password`
- output: Personal Hotspot Password NSString
- keywords: keychain
- icon: personalhotspot (Green)

## Get Images from Input

- identifier: `is.workflow.actions.detect.images`  ·  class `WFCoercionAction`
- Gets images from the result of the previous action.\n\nFor example, this action can get the album art of a song, or all the images on a web page.
- summary: `Get images from ${WFInput}`
- input: WFImage (required)
- output: Images WFImageContentItem
- keywords: find, search, detect, scan, e-mail, emails, photos
- icon: photo.fill (Blue)
- ResidentCompatible: True
- parameters:
  - `WFInput` (VariablePicker) Input

## Get Instapaper Bookmarks

- identifier: `is.workflow.actions.instapaper.get`  ·  class `WFInstapaperGetAction`
- Gets the contents of a folder in Instapaper. Requires Instapaper Premium.
- summary: `Get ${WFBookmarkCount} from ${WFInstapaperFolder}`
- output: Instapaper Bookmarks WFURLContentItem
- parameters:
  - `WFInstapaperFolder` (DynamicEnumeration) Folder — The folder to get bookmarks from. Leaving this empty will get items from Instapaper’s Home folder.
  - `WFBookmarkCount` (Stepper) default=5

## Get Item from List

- identifier: `is.workflow.actions.getitemfromlist`  ·  class `WFGetItemFromListAction`
- Returns one or more items from the list passed as input. You can get the first item, the last item, a random item, the item at a particular index, or items in a range of indexes.
- note: Lists use one-based indexing, so the first item is at index 1, the second is at index 2, etc.
- summary variants:
  - `Get ${WFItemSpecifier} from ${WFInput}`  when {"WFItemSpecifier": "First Item"}
  - `Get ${WFItemSpecifier} ${WFItemIndex} from ${WFInput}`  when {"WFItemSpecifier": "Item At Index"}
  - `Get ${WFItemSpecifier} ${WFItemRangeStart} to ${WFItemRangeEnd} from ${WFInput}`  when {"WFItemSpecifier": "Items in Range"}
  - `Get ${WFItemSpecifier} from ${WFInput}`  when {"WFItemSpecifier": "Last Item"}
  - `Get ${WFItemSpecifier} from ${WFInput}`  when {"WFItemSpecifier": "Random Item"}
- input: WFContentItem (required)
- output: Item from List WFContentItem
- keywords: indices, index, subset, first, last, random
- icon: list.bullet (Orange)
- ResidentCompatible: True
- parameters:
  - `WFItemSpecifier` (Enumeration) Get default="First Item" choices=["First Item", "Last Item", "Random Item", "Item At Index", "Items in Range"]
  - `WFItemIndex` (NumberField) Index
  - `WFItemRangeStart` (NumberField) Start Index
  - `WFItemRangeEnd` (NumberField) End Index
  - `WFInput` (VariablePicker) List

## Get Items from Pocket

- identifier: `is.workflow.actions.pocket.get`  ·  class `WFPocketGetAction`
- Returns items in your Pocket account.
- summary: `Get ${WFPocketItemCount}`
- output: Items from Pocket NSURL
- parameters:
  - `WFPocketItemCount` (Stepper)
  - `WFPocketItemState` (Enumeration) Type default="All" choices=["Unread", "Archived", "All"]
  - `WFPocketItemSearchTerm` (TextInput) Search — If specified, only items with titles or URLs matching this search will be returned.
  - `WFPocketItemSearchTags` (TextInput) Tag — If specified, only items matching this tag will be returned.

## Get Items from RSS Feed

- identifier: `is.workflow.actions.rss`  ·  class `WFRSSFeedAction`
- Downloads the latest items from an RSS feed.
- summary: `Get ${WFRSSItemQuantity} from ${WFRSSFeedURL}`
- input: WFURLContentItem, WFRichTextContentItem (required)
- output: RSS Items WFArticle, NSURL
- keywords: article, podcast, text, clipboard, copy, paste
- icon: dot.radiowaves.up.forward (Orange)
- ResidentCompatible: True
- parameters:
  - `WFRSSFeedURL` (TextInput) URL default="https://www.apple.com/newsroom/rss-feed.rss"
  - `WFRSSItemQuantity` (Stepper) default=10

## Get Last Import

- identifier: `is.workflow.actions.getlatestphotoimport`  ·  class `WFGetLatestPhotoImportAction`
- Gets the most recent photo import from the Photos app.
- summary: `Get last import`
- output: Imported Photos PHAsset
- keywords: camera, roll, picture, photo, import, camera, sd, card, usb

## Get Latest Bursts

- identifier: `is.workflow.actions.getlatestbursts`  ·  class `WFGetLatestPhotosAction`
- Gets the most recent burst photos from the photo library.
- summary: `Get the latest ${WFGetLatestPhotoCount}`
- output: Latest Bursts PHAsset
- keywords: camera, roll, picture, photo, animated
- parameters:
  - `WFGetLatestPhotoCount` (Stepper) default=1

## Get Latest Live Photos

- identifier: `is.workflow.actions.getlatestlivephotos`  ·  class `WFGetLatestPhotosAction`
- Gets the most recent Live Photos from the photo library.
- summary: `Get the latest ${WFGetLatestPhotoCount}`
- output: Latest Live Photos PHAsset
- keywords: camera, roll, picture, photo, animated
- parameters:
  - `WFGetLatestPhotoCount` (Stepper) default=1

## Get Latest Photos

- identifier: `is.workflow.actions.getlastphoto`  ·  class `WFGetLatestPhotosAction`
- Gets the most recent photos from the photo library.
- summary: `Get the latest ${WFGetLatestPhotoCount}`
- output: Latest Photos PHAsset
- keywords: camera, roll, picture, last
- parameters:
  - `WFGetLatestPhotoCount` (Stepper) default=1
  - `WFGetLatestPhotosActionIncludeScreenshots` (Switch) Include Screenshots default=true

## Get Latest Screenshots

- identifier: `is.workflow.actions.getlastscreenshot`  ·  class `WFGetLatestPhotosAction`
- Gets the most recent screenshots from the photo library.
- summary: `Get the latest ${WFGetLatestPhotoCount}`
- output: Latest Screenshots PHAsset
- keywords: camera, roll, picture, photo, screen
- parameters:
  - `WFGetLatestPhotoCount` (Stepper) default=1

## Get Latest Videos

- identifier: `is.workflow.actions.getlastvideo`  ·  class `WFGetLatestPhotosAction`
- Gets the most recent videos from the photo library.
- summary: `Get the latest ${WFGetLatestPhotoCount}`
- output: Latest Videos PHAsset
- keywords: video, camera, roll, movie
- parameters:
  - `WFGetLatestPhotoCount` (Stepper) default=1

## Get Link to File

- identifier: `is.workflow.actions.file.getlink`  ·  class `WFGetFileLinkAction`
- Gets a public iCloud link to the file passed into the action. The specified file must already be uploaded to iCloud.
- summary: `Get link to ${WFFile}`
- input: public.data (required)
- output: Link to File NSURL
- keywords: url, share
- icon: link.icloud.fill (Tint)
- parameters:
  - `WFFile` (VariablePicker) File

## Get Maps URL

- identifier: `is.workflow.actions.getmapslink`  ·  class `WFGetMapsLinkAction`
- Creates a URL to search for the location, place, or text that was passed into the action in a separate maps app.
- summary: `Get maps URL from ${WFInput}`
- input: NSString, CLLocation, MKMapItem (required)
- output: Maps URL NSURL
- keywords: link, location, app
- parameters:
  - `WFInput` (Location) Location

## Get My Shortcuts

- identifier: `is.workflow.actions.getmyworkflows`  ·  class `WFGetMyWorkflowsAction`
- Gets the shortcuts stored on this device.
- result: When saved as a file, shortcuts will be exported using the “For People Who Know Me” setting.
- summary: `Get shortcuts from ${Folder}`
- output: My Shortcuts WFWorkflowReference
- keywords: installed, downloaded, workflow
- parameters:
  - `Folder` (WorkflowFolderPicker) Folder

## Get Name

- identifier: `is.workflow.actions.getitemname`  ·  class `WFGetItemNameAction`
- Returns the name of every item passed as input. Depending on the input, this could be a file name, the title of a website, the title of a calendar event, etc.
- summary: `Get name of ${WFInput}`
- input: WFContentItem (required)
- output: Name NSString
- keywords: title
- icon: textformat.alt (Gray)
- ResidentCompatible: True
- parameters:
  - `WFInput` (VariablePicker) Item
  - `GetWebPageTitle` (Switch) Get Web Page Title default=true — If this option is enabled, and a URL is passed in, this action will fetch the title of the corresponding web page.

## Get Name of Emoji

- identifier: `is.workflow.actions.getnameofemoji`  ·  class `WFGetEmojiNameAction`
- Gets the names of emoji passed into the action.
- summary: `Get name of emoji in ${WFInput}`
- input: NSString (required)
- output: Name of Emoji NSString
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFInput` (TextInput) Text

## Get Network Details

- identifier: `is.workflow.actions.getwifi`  ·  class `WFGetNetworkDetailsAction`
- Gets information about the currently connected networks.
- summary variants:
  - `Get ${WFNetworkDetailsNetwork} network details`
  - `Get ${WFNetworkDetailsNetwork} network’s ${WFCellularDetail}`
  - `Get ${WFNetworkDetailsNetwork} network’s ${WFWiFiDetail}`
  - `Get ${WFNetworkDetailsNetwork} network\'s ${WFEthernetDetail}`
  - `Get ${WFNetworkDetailsNetwork} network’s ${WFCellularDetail}`  when {"WFNetworkDetailsNetwork": "Cellular"}
  - `Get ${WFNetworkDetailsNetwork} network’s ${WFWiFiDetail}`  when {"WFNetworkDetailsNetwork": "Wi-Fi"}
  - `Get ${WFNetworkDetailsNetwork} network\'s ${WFEthernetDetail}`  when {"WFNetworkDetailsNetwork": "Ethernet"}
- output: Network Details NSString, NSNumber
- keywords: wifi, wi-fi, mac, address, name, technology, code, radio, country, carrier, cellular, wlan, ethernet, wired, lan, gateway, router, subnet, ip
- icon: network (Blue)
- ResidentCompatible: True
- parameters:
  - `WFNetworkDetailsNetwork` (NetworkPicker) Network
  - `WFWiFiDetail` (Enumeration) Detail default="Network Name" choices=["Network Name", "BSSID", "Wi-Fi Standard", "RX Rate", "TX Rate", "RSSI", "Noise", "Channel Number", "Hardware MAC Address"]
  - `WFCellularDetail` (Enumeration) Detail default="Carrier Name" choices=["Carrier Name", "Radio Technology", "Country Code", "Is Roaming Abroad", "Number of Signal Bars"]
  - `WFEthernetDetail` (Enumeration) Detail default="Interface Name" choices=["Interface Name", "IPv4 Address", "IPv6 Address", "Subnet Mask", "Router IP", "Is Connected", "Link Speed", "Ethernet Standard", "Hardware MAC Address"]

## Get Note Link

- identifier: `is.workflow.actions.evernote.getlink`  ·  class `WFEvernoteGetLinkAction`
- Gets a link to the Evernote note passed into the action, which can be shared.
- summary: `Get link for ${WFInput}`
- input: ENNoteRef (required)
- output: Note Link NSURL
- keywords: url, share
- parameters:
  - `WFEvernoteShareInAppLink` (Switch) In-App Link default=false — When enabled, an evernote:// URL will be generated, suitable for opening the note in the Evernote app.
  - `WFInput` (VariablePicker) Note

## Get Notes

- identifier: `is.workflow.actions.evernote.get`  ·  class `WFEvernoteGetNotesAction`
- Gets recent notes from Evernote, optionally filtering based on criteria.
- summary: `Get ${WFEvernoteNotesCount}`
- output: Notes ENNoteRef
- keywords: search, tag
- parameters:
  - `WFEvernoteNotesTitleSearch` (TextInput) Title Search — Text to look for in the title of notes.
  - `WFEvernoteNotesTags` (EvernoteTagsTagField) Tags — A list of tags with which to find matching notes. Wildcard characters (*) may be used.
  - `WFEvernoteNotesNotebookName` (EvernoteNotebookPicker) In Notebook — The notebook in which to look for notes (optional)
  - `WFEvernoteNotesCount` (Stepper) default=1

## Get Numbers from Input

- identifier: `is.workflow.actions.detect.number`  ·  class `WFCoercionAction`
- Returns numbers from the previous action’s output.
- summary: `Get numbers from ${WFInput}`
- input: NSNumber (required)
- output: Numbers WFNumberContentItem
- keywords: numeric, digits, detect, extract, scan
- icon: number (Gray)
- ResidentCompatible: True
- parameters:
  - `WFInput` (NumberField) Input

## Get Object of Class

- identifier: `is.workflow.actions.getclassaction`  ·  class `WFGetClassAction`
- Returns a particular object class from the input.
- summary: `Get object of class ${Class} from ${Input}`
- input: WFContentItem (required)
- output: Object of Class WFContentItem
- icon: gear.badge.questionmark (Gray)
- parameters:
  - `Class` (TextInput) Class
  - `Input` (VariablePicker) Input

## Get Parent Directory

- identifier: `is.workflow.actions.getparentdirectory`  ·  class `WFGetParentDirectoryAction`
- Gets the common parent directory of the files passed in.
- summary: `Get parent directory of ${WFInput}`
- input: public.data (required)
- output: Get Parent Directory public.folder
- keywords: file, files, folder, root
- icon: arrow.turn.left.up (Tint)
- parameters:
  - `WFInput` (FilePicker) Files

## Get Parked Car Location

- identifier: `is.workflow.actions.getparkedcarlocation`  ·  class `WFGetParkedCarLocationAction`
- Fetches the details of your Parked Car, as stored in the Maps app.
- result: The location of the car and its associated details. If no location is known, this action returns nothing.
- output: Car Location WFParkedCarContentItem
- keywords: carplay, parking, find
- icon: car.fill (Tint)

## Get Phone Numbers from Input

- identifier: `is.workflow.actions.detect.phonenumber`  ·  class `WFCoercionAction`
- Returns any phone numbers found in the output from the previous action.
- summary: `Get phone numbers from ${WFInput}`
- input: WFPhoneNumber (required)
- output: Phone Numbers WFPhoneNumberContentItem
- keywords: phone, number, detect, scan
- icon: phone.circle.fill (Green)
- ResidentCompatible: True
- parameters:
  - `WFInput` (TextInput) Input

## Get Pinboard Bookmarks

- identifier: `is.workflow.actions.pinboard.get`  ·  class `WFPinboardGetAction`
- Gets bookmarks in your Pinboard account.
- summary: `Get ${WFBookmarkCount}`
- output: Pinboard Bookmarks WFURLContentItem
- keywords: URL, web, later, save, pinboard
- parameters:
  - `WFPinTags` (TextInput) Tags — If specified, only items matching all of these tags will be returned. Supports a maximum of three tags.
  - `WFBookmarkCount` (Stepper) default=5

## Get Playlist

- identifier: `is.workflow.actions.get.playlist`  ·  class `WFGetPlaylistAction`
- Gets every song in the specified playlist.
- summary: `Get songs in ${WFPlaylistName}`
- output: Playlist MPMediaItem
- keywords: song, track
- parameters:
  - `WFPlaylistName` (PlaylistPicker) Playlist

## Get Podcasts from Library

- identifier: `is.workflow.actions.getpodcastsfromlibrary`  ·  class `WFGetPodcastsFromLibraryAction`
- Gets a list of all shows in your Podcast library.
- output: Podcasts WFPodcastShowContentItem
- keywords: podcast, show, library

## Get RSS Feeds from Page

- identifier: `is.workflow.actions.rss.extract`  ·  class `WFRSSFeedExtractAction`
- Extracts any RSS feed URLs from the given web URLs or web page.
- summary: `Get RSS feeds from ${WFURLs}`
- input: WFURLContentItem, WFRichTextContentItem (required)
- output: RSS Feeds from Page WFURLContentItem
- keywords: extract, clipboard, copy, paste
- icon: dot.radiowaves.up.forward (Orange)
- ResidentCompatible: True
- parameters:
  - `WFURLs` (TextInput) Page

## Get Selected Files in Finder

- identifier: `is.workflow.actions.finder.getselectedfiles`  ·  class `WFGetSelectedFinderFilesAction`
- Gets the files that are currently selected in Finder.
- output: Selected File public.data
- keywords: file, document

## Get Selected Text

- identifier: `is.workflow.actions.getselectedtext`  ·  class `WFGetSelectedTextAction`
- Finds and outputs text that is selected in the currently active app.
- result: The selected text.
- summary: `Get selected text`
- output: Selected Text WFStringContentItem
- keywords: selected, text, selection, highlight, cursor, clipboard
- icon: text.cursor (Pink)

## Get state

- identifier: `is.workflow.actions.gethomeaccessorystate`  ·  class `WFGetHomeAccessoryStateAction`
- Gets the state of a Home accessory.
- summary variants:
  - `Get ${WFHMService} in ${WFHome}`
  - `Get ${WFHMService} ${WFHMCharacteristic} in ${WFHome}`
  - `Get ${WFHMService}`
  - `Get ${WFHMService} ${WFHMCharacteristic}`
- output: Accessory State
- keywords: homekit, accessories, accessory, automation, smart, house, scene
- ResidentCompatible: True
- parameters:
  - `WFHome` (HomePicker) Home
  - `WFHMService` (HomeServicePicker) Accessory State
  - `WFHMCharacteristic` (HomeCharacteristicPicker) Characteristic

## Get Stored Content

- identifier: `is.workflow.actions.getstoredcontent`  ·  class `WFGetStoredContentAction`
- Gets stored content for the specified name.
- summary: `Get ${WFStoredContentKey}`
- output: Stored Content WFContentItem
- keywords: save, retrieve, stored, value, data, database, user, defaults, storage, file, global
- icon: cylinder.split.1x2.fill (Cyan)
- ResidentCompatible: True
- parameters:
  - `WFStoredContentKey` (StoredValueVariableField) Stored Content Name
  - `WFStoredContentGlobalValue` (Switch) Global Value default=false — When enabled, any shortcut on your device can access and update this stored value. Otherwise, the value is only accessible within this shortcut.

## Get Text from Input

- identifier: `is.workflow.actions.detect.text`  ·  class `WFCoercionAction`
- Returns text from the previous action’s output.\n\nFor example, this action can get the name of a photo or song, or the text of a web page.
- summary: `Get text from ${WFInput}`
- input: WFContentItem (required)
- output: Text WFStringContentItem
- keywords: find, search, detect, scan, e-mail, emails
- ResidentCompatible: True
- parameters:
  - `WFInput` (VariablePicker) Input

## Get Text from PDF

- identifier: `is.workflow.actions.gettextfrompdf`  ·  class `WFGetTextFromPDFAction`
- Gets text from the provided PDF file.
- summary: `Get ${WFGetTextFromPDFTextType} from PDF ${WFInput}`
- input: com.adobe.pdf (required)
- output: Text NSString, NSAttributedString
- keywords: text, pdf, ocr, string, scan
- parameters:
  - `WFInput` (FilePicker) PDF
  - `WFGetTextFromPDFTextType` (Enumeration) Type default="Text" choices=["Text", "Rich Text"]
  - `WFGetTextFromPDFPageHeader` (TextInput) Page Header Text
  - `WFGetTextFromPDFPageFooter` (TextInput) Page Footer Text
  - `WFCombinePages` (Switch) Combine Pages default=true

## Get Time Between Dates

- identifier: `is.workflow.actions.gettimebetweendates`  ·  class `WFTimeUntilDateAction`
- Subtracts the specified date from the date passed into the action. For example, this action could get the number of minutes from now until a calendar event passed in as input.
- note: This action outputs a negative number if the input date takes place before the specified date.
- summary variants:
  - `Get ${WFTimeUntilUnit} between ${WFTimeUntilFromDate} and ${WFInput}`  when {"WFTimeUntilUnit": "Total Time"}
  - `Get ${WFTimeUntilUnit} between ${WFTimeUntilFromDate} and ${WFInput}`  when {"WFTimeUntilUnit": "Seconds"}
  - `Get ${WFTimeUntilUnit} between ${WFTimeUntilFromDate} and ${WFInput}`  when {"WFTimeUntilUnit": "Minutes"}
  - `Get ${WFTimeUntilUnit} between ${WFTimeUntilFromDate} and ${WFInput}`  when {"WFTimeUntilUnit": "Hours"}
  - `Get ${WFTimeUntilUnit} between ${WFTimeUntilFromDate} and ${WFInput}`  when {"WFTimeUntilUnit": "Days"}
  - `Get ${WFTimeUntilUnit} between ${WFTimeUntilFromDate} and ${WFInput}`  when {"WFTimeUntilUnit": "Weeks"}
  - `Get ${WFTimeUntilUnit} between ${WFTimeUntilFromDate} and ${WFInput}`  when {"WFTimeUntilUnit": "Months"}
  - `Get ${WFTimeUntilUnit} between ${WFTimeUntilFromDate} and ${WFInput}`  when {"WFTimeUntilUnit": "Years"}
- input: NSDate (required)
- output: Time Between Dates NSNumber
- keywords: between, after, before, seconds, minutes, hours, days, weeks, years, math, calculate, interval
- icon: calendar.badge.clock (Tint)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFTimeUntilFromDate` (DateField) First Date
  - `WFInput` (DateField) Second Date
  - `WFTimeUntilUnit` (Enumeration) In default="Minutes" choices=["Total Time", "Seconds", "Minutes", "Hours", "Days", "Weeks", "Months", "Years"]

## Get Travel Time

- identifier: `is.workflow.actions.gettraveltime`  ·  class `WFGetTravelTimeAction`
- Estimates the amount of time it will take to travel to the location passed into this action.
- input: The destination
- result: The amount of time it will take to get to the destination. If passed into an action expecting a date, this will be the date and time of arrival if you leave now.
- note: Travel times are provided by Apple Maps and take into account current traffic conditions.
- summary: `Get ${WFGetDirectionsActionMode} time from ${WFGetDirectionsCustomLocation} to ${WFDestination}`
- input: NSString, CLLocation, MKMapItem (required)
- output: Travel Time WFTripInfo
- keywords: maps, directions, calculate, estimated, arrival, eta, driving, walking, transit
- icon: clock.fill (Tint)
- ResidentCompatible: True
- parameters:
  - `WFGetDirectionsCustomLocation` (Location) Start Location
  - `WFDestination` (Location) End Location
  - `WFGetDirectionsActionMode` (Enumeration) Mode default="Driving" choices=["Driving", "Walking", "Transit", "Biking"]
  - `WFAvoidTolls` (Switch) Avoid Tolls default=false — When enabled, the route will avoid toll roads.
  - `WFAvoidHighways` (Switch) Avoid Highways default=false — When enabled, the route will avoid highways.

## Get Trello Items

- identifier: `is.workflow.actions.trello.get`  ·  class `WFTrelloGetItemsAction`
- Gets cards, lists, or boards in your Trello account.
- output: Trello Items WFTrelloBoard, WFTrelloList, WFTrelloCard
- parameters:
  - `WFTrelloItemType` (Enumeration) Get default="Boards" choices=["Boards", "Lists", "Cards"]
  - `WFTrelloBoard` (TrelloBoardPicker) Board
  - `WFTrelloList` (TrelloListPicker) List

## Get Type

- identifier: `is.workflow.actions.getitemtype`  ·  class `WFGetItemTypeAction`
- Returns the type of every item passed as input. For example, if a URL is passed, this action will return “URL”.
- summary: `Get type of ${WFInput}`
- input: WFContentItem (required)
- output: Type NSString
- keywords: content, item, class
- icon: gear.badge.questionmark (Gray)
- ResidentCompatible: True
- parameters:
  - `WFInput` (VariablePicker) Item

## Get Upcoming Events

- identifier: `is.workflow.actions.getupcomingevents`  ·  class `WFGetUpcomingCalendarItemsAction`
- Gets upcoming calendar events, ordered from nearest to farthest away in time.
- summary: `Get ${WFGetUpcomingItemCount} from ${WFGetUpcomingItemCalendar}`
- output: Events EKEvent
- keywords: calendar, event, events, next, upcoming
- parameters:
  - `WFGetUpcomingItemCalendar` (CalendarPicker) Calendar
  - `WFGetUpcomingItemCount` (Stepper) default=1
  - `WFDateSpecifier` (Enumeration) Day default="Any Day" choices=["Any Day", "Today", "Tomorrow", "Specified Day"]
  - `WFSpecifiedDate` (DateField) Specified Day

## Get Upcoming Reminders

- identifier: `is.workflow.actions.getupcomingreminders`  ·  class `WFGetUpcomingCalendarItemsAction`
- Gets upcoming reminders, ordered from nearest to farthest away due date.
- summary: `Get ${WFGetUpcomingItemCount} from ${WFGetUpcomingItemCalendar}`
- output: Reminders REMReminder
- keywords: calendar, reminder, next, upcoming
- parameters:
  - `WFGetUpcomingItemCalendar` (RemindersListPicker) List
  - `WFGetUpcomingItemCount` (Stepper) default=1

## Get URLs from Input

- identifier: `is.workflow.actions.detect.link`  ·  class `WFCoercionAction`
- Returns any links found in the output from the previous action.
- summary: `Get URLs from ${WFInput}`
- input: NSURL (required)
- output: URLs WFURLContentItem
- keywords: link, web, site, detect, scan
- icon: link (Tint)
- ResidentCompatible: True
- parameters:
  - `WFInput` (TextInput) Input

## Get Variable

- identifier: `is.workflow.actions.getvariable`  ·  class `WFGetVariableAction`
- Gets the value of the specified variable and passes it to the next action.
- summary: `Get ${WFVariable}`
- output: Variable WFContentItem
- keywords: programming, scripting, var
- ResidentCompatible: True
- parameters:
  - `WFVariable` (VariablePicker) Variable

## Get Weather Forecast

- identifier: `is.workflow.actions.weather.forecast`  ·  class `WFGetWeatherForecastAction`
- Gets an hourly or daily weather forecast at the specified location.
- summary: `Get ${WFWeatherForecastType} forecast at ${WFWeatherCustomLocation}`
- output: Weather Conditions WFWeatherData
- keywords: current, temperature, visibility, humidity, pressure, wind, sunrise, sunset
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFWeatherCustomLocation` (Location) Location
  - `WFWeatherForecastType` (Enumeration) Type default="Daily" choices=["Hourly", "Daily"]

## Get What’s On Screen

- identifier: `is.workflow.actions.getonscreencontent`  ·  class `WFGetOnScreenContentAction`
- Gets the current content on screen, if available.
- summary: `Get what’s on screen`
- output: On-Screen Content public.data
- keywords: on, screen
- icon: text.viewfinder (Pink)

## Get What’s On Screen

- identifier: `is.workflow.actions.getonscreencontext`  ·  class `WFOnScreenContextAction`
- Finds content that is currently visible on-screen like images, calendar events, URLs, and more.
- result: The on-screen content that matches the specified type.
- summary: `Get on-screen ${WFOnScreenContextResultType}`
- output: On-Screen Content WFContentItem, WFStringContentItem, WFURLContentItem, WFCalendarEventContentItem, WFContactContentItem, WFEmailContentItem, WFMessageContentItem, WFPhotoMediaContentItem, WFReminderContentItem, WFLinkEntityContentItem
- keywords: on, screen, context, visible, app, entity, ui, element, text, content, focused, calendar, contact, mail, message, photo, reminder, note, file, voice, memo, web, page
- icon: text.viewfinder (Pink)
- parameters:
  - `WFOnScreenContextResultType` (OnScreenContextResultTypePicker) Type default="Images"
  - `WFOnScreenContextScope` (Enumeration) Scope default="All Visible" choices=["All Visible", "Focused App Only"]
  - `WFOnScreenContextLimitEnabled` (Switch) Limit default=false
  - `WFOnScreenContextLimit` (Stepper) default=5

## Go to Home Screen

- identifier: `is.workflow.actions.returntohomescreen`  ·  class `WFReturnToHomeScreenAction`
- Navigates to the Home Screen.
- summary: `Go to Home Screen`
- keywords: home, screen, SpringBoard

## Hand Off Playback

- identifier: `is.workflow.actions.handoffplayback`  ·  class `WFHandOffPlaybackAction`
- Hands off Music or Podcasts playback between two devices.
- summary: `Hand off playback from ${WFSourceMediaRoute} to ${WFDestinationMediaRoute}`
- output: Hand Off Playback
- keywords: device, airplay, playback, audio, route
- icon: ipad.and.arrow.forward (Red)
- parameters:
  - `WFSourceMediaRoute` (MediaRoutePicker) Source — The device to hand off playback from.
  - `WFDestinationMediaRoute` (MediaRoutePicker) Destination — The device to hand off playback to.

## Hide App

- identifier: `is.workflow.actions.hide.app`  ·  class `WFHideAppAction`
- Hides one or all open applications. You can choose a list of apps to keep open.
- summary variants:
  - `Hide ${WFHideAppMode} ${WFApp}`
  - `Hide ${WFHideAppMode} except ${WFAppsExcept}`
- keywords: hide, kill, close
- icon: app.dashed (Indigo)
- parameters:
  - `WFHideAppMode` (Enumeration) Mode default="App" choices=["App", "All Apps"]
  - `WFApp` (AppPicker) App
  - `WFAppsExcept` (AppPicker) Apps

## If

- identifier: `is.workflow.actions.conditional`  ·  class `WFConditionalAction`
- Tests if a condition is true, and if so, runs the actions inside. Otherwise, the actions under “Otherwise” are run.
- input: WFContentItem
- keywords: statement, conditional, then
- icon: arrow.triangle.branch (Gray)
- ResidentCompatible: True
- InputPassthrough: True

## Import Audio Files into Music

- identifier: `is.workflow.actions.importaudiofiles`  ·  class `WFImportAudioFilesAction`
- Imports audio files into Music and compresses them with the chosen encoder.
- summary: `Import ${WFInput} into Music`
- input: public.audio (required)
- output: Imported Items MPMediaItem
- keywords: audio, import, music, itunes, sound, save, rip
- parameters:
  - `WFInput` (FilePicker) Audio Files
  - `WFImportAudioFilesReencode` (Switch) Re-encode default=false
  - `WFImportAudioFilesEncoder` (Enumeration) Encoder default="Default" choices=["Default", "AAC", "AIFF", "Lossless", "MP3", "WAV"]

## Import to Lightroom

- identifier: `is.workflow.actions.lightroom.import`  ·  class `WFImportToLightroomAction`
- Imports the photos passed as input into Lightroom.
- summary: `Import ${WFInput} to Lightroom`
- input: WFPhotoMediaContentItem (required)
- InputPassthrough: True
- parameters:
  - `applyPreset` (Switch) Apply Preset default=false
  - `presetGroup` (Enumeration) Preset Group default="Color" choices=["B&W", "Color", "Creative", "Curve", "Grain", "Sharpening", "Vignetting"]
  - `preset` (LightroomPresetPicker) Preset
  - `WFInput` (VariablePicker) Photos

## Input

- identifier: `is.workflow.actions.input`  ·  class `WFInputAction`
- Stops execution of the current shortcut and dismisses the shortcut on screen. No more actions will be run after this action.
- summary: `Receive ${WFInputType} from ${WFInputSurface}`
- input: WFContentItem
- keywords: quit, return, workflow
- ResidentCompatible: True
- parameters:
  - `WFInputType` (InputType) Input Type
  - `WFInputSurface` (InputSurface) Input Surface default=""
  - `WFNoInputBehavior` (Enumeration) If there’s no input default="Stop and Respond" choices=["Stop and Respond", "Ask For", "Get Clipboard", "Continue"]
  - `WFStopAndRespondResponse` (TextInput) Response
  - `WFAskForType` (Enumeration) Type default="Photos" choices=["Files", "Text", "Date", "Photos", "Contacts", "Email Address", "Music", "Phone Number"]
  - `WFEventOccurrenceMode` () Occurrence choices=["Next Occurrence", "Specified Year"]
  - `WFPhotoPickerTypes` () Include choices=["Images", "Live Photos", "Videos"]
  - `WFPickingMode` () Type choices=["Files", "Folders"]

## Intercom

- identifier: `is.workflow.actions.intercom`  ·  class `WFIntercomAction`
- Announces a message passed as input using Intercom.
- note: This action accepts both text and media files as input. Media files will be broadcast as they are. When text is provided, it will be first converted to audio using the current Siri language and voice. You can also use the Make Spoken Audio From Text action to customize the voice parameters.
- summary: `Intercom ${WFInput} to ${WFHome}`
- input: WFAVAssetContentItem, WFStringContentItem (required)
- keywords: announce, homepod, notif, home, family, audio, broadcast, message, speak, speech
- icon: intercom (Orange)
- parameters:
  - `WFHome` (HomeAreaPicker) Home
  - `WFInput` (TextInput) Message — The message to announce using Intercom. Any input exceeding 60 seconds in duration will be trimmed.

## Label Files

- identifier: `is.workflow.actions.file.label`  ·  class `WFLabelFilesAction`
- Applies a label to the specified files.
- summary: `Label ${WFInput} with ${WFLabelColorNumber}`
- input: public.data (required)
- keywords: label, file, document, tag, color
- icon: tag.fill (Tint)
- parameters:
  - `WFInput` (FilePicker) Files
  - `WFLabelColorNumber` (FileLabelColorPicker) Label Color

## List

- identifier: `is.workflow.actions.list`  ·  class `WFListAction`
- Allows you to specify a list of items to be passed to the next action.
- note: If you specify a variable, the contents of that variable will be included in the list.
- output: List WFContentItem
- keywords: array
- icon: list.bullet (Orange)
- ResidentCompatible: True
- parameters:
  - `WFItems` (ContentArray) Items default=["One", "Two"]

## Location

- identifier: `is.workflow.actions.location`  ·  class `WFLocationAction`
- Passes the specified location to the next action.
- summary: `${WFLocation}`
- output: Location WFLocationContentItem
- keywords: maps, search, query, place, location, find
- icon: mappin (Tint)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFLocation` (Location) Location

## Lock App

- identifier: `is.workflow.actions.lock.app`  ·  class `WFLockAppAction`
- Changes whether the selected application is locked. Locked apps require authentication to access.
- summary variants:
  - `${WFLockAppOperation} lock for ${WFApp}`  when {"WFLockOperation": "Toggle"}
  - `${WFLockAppOperation} ${WFApp}`  when {"WFLockOperation": "Lock"}
  - `${WFLockAppOperation} ${WFApp}`  when {"WFLockOperation": "Unlock"}
- keywords: lock, protect, authentication, private
- icon: lock (Blue)
- parameters:
  - `WFLockAppOperation` (Enumeration) Operation default="Lock" choices=["Lock", "Unlock", "Toggle"]
  - `WFApp` (AppPicker) App

## Lock Screen

- identifier: `is.workflow.actions.lockscreen`  ·  class `WFLockScreenAction`
- Locks the screen of this device.
- summary: `Lock the screen`
- keywords: display
- icon: lock.fill (Gray)

## Log Health Sample

- identifier: `is.workflow.actions.health.quantity.log`  ·  class `WFLogHealthSampleAction`
- Adds a data point into the Health app. You can log anything that the Health app supports, including your weight, steps taken, running distance, caloric intake and more.
- output: Health Sample WFHKSampleContentItem
- keywords: health, quantity, steps, weight, fitness
- parameters:
  - `WFQuantitySampleType` (QuantityTypePicker) Type
  - `WFQuantitySampleQuantity` (HealthQuantityField) Value
  - `WFQuantitySampleAdditionalQuantity` (HealthQuantityAdditionalField)
  - `WFQuantitySampleAdditionalEnumeration` (HealthQuantityAdditionalPicker) Reason
  - `WFCategorySampleEnumeration` (HealthCategoryPicker) Value
  - `WFCategorySampleAdditionalEnumerationKey` (HealthCategoryAdditionalPicker) Value
  - `WFQuantitySampleDate` (HealthActionStartDateField) Date — The date and time of the data point. The current date will be used if you don’t provide a date.
  - `WFSampleEndDate` (HealthActionEndDateField) End Date — The date and time for the end of the data point. The current date will be used if you don’t provide a date.

## Log Out User

- identifier: `is.workflow.actions.logout`  ·  class `WFLogOutUserAction`
- Logs out the current user.
- summary: `Log out the current user`
- keywords: log, out, logout, user
- icon: person.crop.circle.fill (Gray)

## Log Workout

- identifier: `is.workflow.actions.health.workout.log`  ·  class `WFLogWorkoutAction`
- Adds a workout into the Health app. You can log all kinds of activities, from running and cycling to playing a sport.
- summary: `Log ${WFWorkoutReadableActivityType} workout`
- output: Workout WFHKWorkoutContentItem
- keywords: health, workout, sport, fitness, activity
- parameters:
  - `WFWorkoutReadableActivityType` (WorkoutTypePicker) Type
  - `WFWorkoutDate` (DateField) Date — The date and time of the start of the workout
  - `WFWorkoutDuration` (DurationQuantityField) Duration — The duration of the workout (optional)
  - `WFWorkoutCaloriesQuantity` (HealthQuantityField) Calories — The calories burned during the activity (optional)
  - `WFWorkoutDistanceQuantity` (HealthQuantityField) Distance — The distance covered during the activity. Only provide this if it makes sense for the activity. (optional)

## Make Archive

- identifier: `is.workflow.actions.makezip`  ·  class `WFMakeArchiveAction`
- Makes an archive out of the files passed as input. Supports creating zip, tar.gz, tar.bz2, tar.xz, tar, gzip, cpio, or iso archives.
- result: Archive
- summary: `Make ${WFArchiveFormat} archive from ${WFInput}`
- input: WFContentItem (required)
- output: Archive WFGenericFileContentItem
- keywords: make, generate, gzip
- icon: doc.zipper (Tint)
- ResidentCompatible: True
- parameters:
  - `WFZIPName` (TextInput) Archive Name
  - `WFArchiveFormat` (ArchiveFormat) Format
  - `WFInput` (VariablePicker) Input

## Make Disk Image

- identifier: `is.workflow.actions.makediskimage`  ·  class `WFMakeDiskImageAction`
- Creates a new disk image (.dmg) file. The disk image will contain any files passed as input.
- result: Disk Image
- summary: `Make disk image with ${WFInput}`
- input: WFContentItem (required)
- output: Disk Image WFGenericFileContentItem
- keywords: create, generate, dmg
- parameters:
  - `WFInput` (FilePicker) Files
  - `VolumeName` (TextInput) Volume Name
  - `EncryptImage` (Switch) Encrypt
  - `SizeToFit` (Switch) Size to Fit Contents default=false
  - `ImageSize` (UnitQuantityField) Image Size default=1

## Make GIF

- identifier: `is.workflow.actions.makegif`  ·  class `WFMakeGIFAction`
- Creates an animated GIF from the images or video passed into the action.
- result: An animated GIF
- summary: `Make GIF from ${WFInput}`
- input: WFImage, public.mpeg-4 (required)
- output: GIF com.compuserve.gif
- keywords: animate, make, generate, gif
- icon: square.stack.3d.forward.dottedline.fill (Purple)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFMakeGIFActionDelayTime` (NumberField) Seconds Per Photo default=0.2
  - `WFMakeGIFActionLoopEnabled` (Switch) Loop Forever default=true
  - `WFMakeGIFActionLoopCount` (Stepper)
  - `WFMakeGIFActionAutoSize` (Switch) Auto Size default=true
  - `WFMakeGIFActionManualSizeWidth` (NumberField) Width
  - `WFMakeGIFActionManualSizeHeight` (NumberField) Height
  - `WFInput` (VariablePicker) Content

## Make HTML from Rich Text

- identifier: `is.workflow.actions.gethtmlfromrichtext`  ·  class `WFHTMLFromRichTextAction`
- Converts the rich text passed as input to HTML text.
- result: HTML
- summary: `Make HTML from ${WFInput}`
- input: WFRichTextContentItem (required)
- output: HTML from Rich Text NSString
- keywords: page, source, web, get
- icon: doc.richtext.fill (Indigo)
- ResidentCompatible: True
- parameters:
  - `WFMakeFullDocument` (Switch) Make Full Document — This indicates whether or not this action writes out an entire HTML document. If this is turned off, partial HTML will be returned if possible.
  - `WFInput` (VariablePicker) Rich Text

## Make Image from PDF Page

- identifier: `is.workflow.actions.makeimagefrompdfpage`  ·  class `WFMakeImageFromPDFPageAction`
- Creates images from the pages in the PDF passed into the action.
- summary: `Make ${WFMakeImageFromPDFPageImageFormat} image from ${WFInput}`
- input: com.adobe.pdf (required)
- output: Image public.image
- keywords: pdf, page, convert
- icon: text.below.photo.fill (Blue)
- InputPassthrough: False
- parameters:
  - `WFInput` (VariablePicker) PDF
  - `WFMakeImageFromPDFPageImageFormat` (MakeImageFromPDFPageImageFormat) Image Format
  - `WFMakeImageFromPDFPageColorspace` (MakeImageFromPDFPageColorspace) Color
  - `WFMakeImageFromPDFPageResolution` (NumberField) Resolution (dots per inch) default=300

## Make Image from Rich Text

- identifier: `is.workflow.actions.makeimagefromrichtext`  ·  class `WFMakeImageFromRichTextAction`
- Creates an image from the rich text, web content, or URL passed in as input.
- summary: `Make image from ${WFInput}`
- input: WFRichTextContentItem, WFURLContentItem (required)
- output: Image public.image
- keywords: html, convert
- icon: text.below.photo.fill (Blue)
- InputPassthrough: False
- parameters:
  - `WFInput` (VariablePicker) Rich Text
  - `WFWidth` (NumberField) Width default=1024
  - `WFHeight` (NumberField) Height default=768

## Make Markdown from Rich Text

- identifier: `is.workflow.actions.getmarkdownfromrichtext`  ·  class `WFMarkdownFromRichTextAction`
- Converts the rich text passed as input to Markdown text (comparable to Aaron Swartz’s html2text script).
- result: Markdown
- summary: `Make Markdown from ${WFInput}`
- input: WFRichTextContentItem (required)
- output: Markdown from Rich Text NSString
- keywords: html2text, source
- icon: doc.richtext.fill (Indigo)
- ResidentCompatible: True
- parameters:
  - `WFInput` (VariablePicker) Rich Text

## Make PDF

- identifier: `is.workflow.actions.makepdf`  ·  class `WFMakePDFAction`
- Makes a PDF out of the input. The resulting PDF can optionally include a quarter-inch margin for better printing.
- summary: `Make PDF from ${WFInput}`
- input: WFContentItem (required)
- output: PDF WFPDFContentItem
- keywords: make, generate, pdf, print
- icon: doc.text.fill (Tint)
- ResidentCompatible: True
- parameters:
  - `WFPDFIncludeMargin` (Switch) Include Margin default=false
  - `WFPDFIncludedPages` (Enumeration) Include default="All Pages" choices=["All Pages", "Single Page", "Page Range"]
  - `WFPDFSinglePage` (NumberField) Page #
  - `WFPDFPageRangeStart` (NumberField) Start Page #
  - `WFPDFPageRangeEnd` (NumberField) End Page #
  - `WFInput` (VariablePicker) Input
  - `WFPDFDocumentMergeBehavior` (Enumeration) Merge Behavior default="Append" choices=["Append", "Shuffle"] — Merge documents by appending or shuffling pages. Shuffling will add one page from each of the passed documents to the new document, then proceed to take the next page from each passed document, until all pages in the passed documents have been added to the new document.

## Make Rich Text from HTML

- identifier: `is.workflow.actions.getrichtextfromhtml`  ·  class `WFRichTextFromHTMLAction`
- Takes the inputted HTML and turns it into rich text, which can then be converted to other formats.
- input: HTML
- summary: `Make rich text from ${WFHTML}`
- input: WFStringContentItem (required)
- output: Rich Text from HTML public.html
- keywords: page, source, web, get
- icon: doc.richtext.fill (Indigo)
- ResidentCompatible: True
- parameters:
  - `WFHTML` (VariablePicker) HTML

## Make Rich Text from Markdown

- identifier: `is.workflow.actions.getrichtextfrommarkdown`  ·  class `WFRichTextFromMarkdownAction`
- Takes the inputted Markdown and turns it into rich text, which can then be converted to other formats.
- input: Markdown
- summary: `Make rich text from ${WFInput}`
- input: WFStringContentItem (required)
- output: Rich Text from Markdown public.html
- keywords: html, get
- icon: doc.richtext.fill (Indigo)
- ResidentCompatible: True
- parameters:
  - `WFInput` (VariablePicker) Markdown Text

## Make Spoken Audio from Text

- identifier: `is.workflow.actions.makespokenaudiofromtext`  ·  class `WFMakeSpokenAudioFromTextAction`
- Creates an audio file from text, using text-to-speech.
- result: Audio File
- summary: `Make spoken audio from ${WFInput}`
- input: WFStringContentItem (required)
- output: Spoken Audio com.apple.coreaudio-format
- keywords: text, speak, speech, audio, file, tts, aiff
- icon: speaker.wave.3.fill (Red)
- parameters:
  - `WFInput` (TextInput) Text
  - `WFSpeakTextRate` (Slider) Rate default=0.5
  - `WFSpeakTextPitch` (Slider) Pitch default=1
  - `WFSpeakTextLanguage` (SpeakTextLanguagePicker) Language default="Default"
  - `WFSpeakTextVoice` (SpeakTextVoicePicker) Voice default="Default"

## Make Video from GIF

- identifier: `is.workflow.actions.makevideofromgif`  ·  class `WFMakeVideoFromGIFAction`
- Converts an animated GIF into a video.
- input: An animated GIF
- result: A video
- summary: `Make video from GIF ${WFInputGIF}`
- input: com.compuserve.gif (required)
- output: Video public.mpeg-4
- keywords: video, gif, convert, make
- icon: square.stack.3d.forward.dottedline.fill (Purple)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFMakeVideoFromGIFActionLoopCount` (Stepper) default=1
  - `WFInputGIF` (VariablePicker) Image

## Markup

- identifier: `is.workflow.actions.avairyeditphoto`  ·  class `WFMarkupAction`
- Edits an image or PDF with Markup.
- result: The edited content
- summary: `Mark up ${WFDocument}`
- input: WFImageContentItem, WFPDFContentItem (required)
- output: Markup Result WFImageContentItem, WFPDFContentItem
- keywords: edit, photo, modify, picture, aviary, adobe, pdf, sign, draw, document
- icon: pencil.tip.crop.circle.fill (Gray)
- parameters:
  - `WFDocument` (VariablePicker) Document

## Mask Image

- identifier: `is.workflow.actions.image.mask`  ·  class `WFMaskImageAction`
- Applies a mask to each image passed into the action. For example, you can cut images into a rounded rectangle, ellipse or icon shape, or provide a custom alpha mask.
- input: Images to mask
- result: The masked images
- summary variants:
  - `Mask ${WFInput} with ${WFMaskType} shape`
  - `Mask ${WFInput} with ${WFMaskType} ${WFCustomMaskImage}`  when {"WFMaskType": "Custom Image"}
  - `Mask ${WFInput} with ${WFMaskType} shape`  when {"WFMaskType": "Rounded Rectangle"}
- input: WFImageContentItem (required)
- output: Masked Image WFImageContentItem
- keywords: photos, transform, overlay, clip, corner, radius
- icon: photo.fill (Blue)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFInput` (VariablePicker) Image
  - `WFMaskType` (Enumeration) Type default="Rounded Rectangle" choices=["Rounded Rectangle", "Ellipse", "Icon", "Custom Image"]
  - `WFMaskCornerRadius` (NumberField) Corner Radius — A radius to apply to each corner of the source image in pixels.
  - `WFCustomMaskImage` (VariablePicker) Custom Image — An alpha mask to apply to the source image, where darker colors become transparent and lighter colors remain opaque. If the mask is sized differently than the source image, the mask is resized to match the dimensions of the source image.

## Match Text

- identifier: `is.workflow.actions.text.match`  ·  class `WFHandleCustomIntentAction`
- Searches text passed into the action for matches to a regular expression.
- result: A list of text items that matched the regular expression
- output: Matches
- keywords: finding, matching, searching, regular, expression, regexp
- ResidentCompatible: True

## Measurement

- identifier: `is.workflow.actions.measurement.create`  ·  class `WFMeasurementCreateAction`
- Passes the specified measurement (including number and unit) to the next action.
- summary: `${WFMeasurementUnitType}\n${WFMeasurementUnit}`
- output: Measurement NSMeasurement
- keywords: degrees, distance, pressure, measure, speed, weather
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFMeasurementUnitType` (UnitTypePicker) Type default="Length"
  - `WFMeasurementUnit` (UnitQuantityField) Value

## Mount Disk Image

- identifier: `is.workflow.actions.mountdiskimage`  ·  class `WFMountDiskImageAction`
- Mounts a disk image (.dmg) file on your desktop.
- result: The mounted volume
- summary: `Mount disk image ${WFInput}`
- input: WFContentItem (required)
- output: Mounted Volume WFGenericFileContentItem
- keywords: dmg
- parameters:
  - `WFInput` (FilePicker) File

## Move File

- identifier: `is.workflow.actions.file.move`  ·  class `WFMoveFileAction`
- Moves the specified file to a new location.
- summary: `Move ${WFFile} to ${WFFolder}`
- input: public.data (required)
- output: File public.data
- keywords: file, document, filepicker, move, folder, rename
- icon: folder.fill (Tint)
- parameters:
  - `WFFile` (FilePicker) File
  - `WFFolder` (FilePicker) Folder
  - `WFReplaceExisting` (Switch) Replace Existing Files default=false

## Move Window

- identifier: `is.workflow.actions.movewindow`  ·  class `WFMoveWindowAction`
- Moves one or more windows to the specified location.
- input: The window(s) to move
- summary variants:
  - `Move ${WFWindow} to ${WFPosition}`
  - `Move ${WFWindow} to ${WFPosition} ${WFXCoordinate}, ${WFYCoordinate}`  when {"WFPosition": "Coordinates"}
- input: WFWindowContentItem, WFAppContentItem (required)
- parameters:
  - `WFPosition` (Enumeration) Position default="Center" choices=["Top Left", "Top Center", "Top Right", "Middle Left", "Center", "Middle Right", "Bottom Left", "Bottom Center", "Bottom Right", "Coordinates"]
  - `WFXCoordinate` (NumberField) X
  - `WFYCoordinate` (NumberField) Y
  - `WFWindow` (VariablePicker) Window
  - `WFBringToFront` (Switch) Bring to Front default=true
  - `Display` (DisplayPicker) Display — The display to move the window to.

## New Contact

- identifier: `is.workflow.actions.addnewcontact`  ·  class `WFAddNewContactAction`
- Creates a new contact.
- result: The new contact
- summary: `Add ${WFContactFirstName}${WFContactLastName} to Contacts`
- output: New Contact WFContact
- keywords: create, add, contact
- InputPassthrough: False
- parameters:
  - `WFContactFirstName` (TextInput) First name — The first name of the contact.
  - `WFContactLastName` (TextInput) Last name — The last name of the contact.
  - `WFContactCompany` (TextInput) Company — The company of the contact.
  - `WFContactPhoto` (VariablePicker) Photo
  - `WFContactPhoneNumbers` (PhoneNumberField) Phone Number
  - `WFContactEmails` (EmailAddressField) Email Address
  - `WFContactNotes` (TextInput) Notes — Optionally, notes for this contact.
  - `ShowWhenRun` (Switch) Show Compose Sheet default=true

## New Event

- identifier: `is.workflow.actions.addnewevent`  ·  class `WFAddNewEventAction`
- Creates a new event and adds it to the selected calendar.
- result: The new event
- summary: `Add ${WFCalendarItemTitle} from ${WFCalendarItemStartDate} to ${WFCalendarItemEndDate}`
- output: New Event EKEvent
- keywords: create, add, calendar
- InputPassthrough: False
- parameters:
  - `WFCalendarItemTitle` (TextInput) Title — The title of this event.
  - `WFCalendarItemLocation` (TextInput) Location
  - `WFCalendarDescriptor` (CalendarPicker) Calendar — The calendar to add this event to.
  - `WFCalendarItemStartDate` (DateField) Start Date — Text representing the date this event begins. Examples: “tomorrow at 2”, “January 3”, “8:00pm”
  - `WFCalendarItemEndDate` (DateField) End Date — Text representing the date this event finishes.
  - `WFCalendarItemAllDay` (Switch) All Day default=false — When enabled, the event takes place over an entire day and time is ignored.
  - `WFAlertTime` (Enumeration) Alert choices=["None", "At time of event", "5 minutes before", "15 minutes before", "30 minutes before", "1 hour before", "2 hours before", "1 day before", "2 days before", "1 week before", "Custom"] — Optionally, when to show an alert to notify me of this event.
  - `WFAlertCustomTime` (TextInput) Alert Time — Text representing the date when the alert should occur. Examples: “tonight at 7”, “March 7”
  - `WFCalendarItemNotes` (TextInput) Notes — Optionally, a description for this event.
  - `ShowWhenRun` (Switch) Show Compose Sheet default=true

## New Reminder

- identifier: `is.workflow.actions.addnewreminder`  ·  class `WFAddNewReminderAction`
- Creates a new reminder and adds it to the selected list of reminders.
- result: The new reminder
- summary variants:
  - `Add ${WFCalendarItemTitle} with ${WFAlertEnabled} ${WFAlertCondition} ${WFAlertCustomTime}`  when {"WFAlertCondition": "At Time", "WFAlertEnabled": "Alert"}
  - `Add ${WFCalendarItemTitle} with ${WFAlertEnabled} ${WFAlertCondition} at ${WFAlertLocation}`  when {"WFAlertCondition": "When I Arrive", "WFAlertEnabled": "Alert"}
  - `Add ${WFCalendarItemTitle} with ${WFAlertEnabled} ${WFAlertCondition} from ${WFAlertLocation}`  when {"WFAlertCondition": "When I Leave", "WFAlertEnabled": "Alert"}
  - `Add ${WFCalendarItemTitle} with ${WFAlertEnabled} ${WFAlertCondition} ${WFAlertPerson}`  when {"WFAlertCondition": "When Messaging", "WFAlertEnabled": "Alert"}
  - `Add ${WFCalendarItemTitle} with ${WFAlertEnabled}`  when {"WFAlertEnabled": "No Alert"}
  - `Add ${WFCalendarItemTitle} to ${WFCalendarDescriptor} with ${WFAlertEnabled} ${WFAlertCondition} ${WFAlertCustomTime}`  when {"WFAlertCondition": "At Time", "WFAlertEnabled": "Alert"}
  - `Add ${WFCalendarItemTitle} to ${WFCalendarDescriptor} with ${WFAlertEnabled} ${WFAlertCondition} at ${WFAlertLocation}`  when {"WFAlertCondition": "When I Arrive", "WFAlertEnabled": "Alert"}
  - `Add ${WFCalendarItemTitle} to ${WFCalendarDescriptor} with ${WFAlertEnabled} ${WFAlertCondition} from ${WFAlertLocation}`  when {"WFAlertCondition": "When I Leave", "WFAlertEnabled": "Alert"}
  - `Add ${WFCalendarItemTitle} to ${WFCalendarDescriptor} with ${WFAlertEnabled} ${WFAlertCondition} ${WFAlertPerson}`  when {"WFAlertCondition": "When Messaging", "WFAlertEnabled": "Alert"}
  - `Add ${WFCalendarItemTitle} to ${WFCalendarDescriptor} with ${WFAlertEnabled}`  when {"WFAlertEnabled": "No Alert"}
- output: New Reminder REMReminder
- keywords: create, add, calendar, task, todo, to-do
- InputPassthrough: False
- parameters:
  - `WFCalendarItemTitle` (TextInput) Reminder — The title of this reminder.
  - `WFCalendarDescriptor` (RemindersListPicker) List — The list of reminders to add this reminder to.
  - `WFAlertEnabled` (Enumeration) Alert default="No Alert" choices=["No Alert", "Alert"]
  - `WFAlertCondition` (Enumeration) Trigger default="At Time" choices=["At Time", "When I Arrive", "When I Leave", "When Messaging"]
  - `WFAlertLocation` (Location) Location — The location that triggers the alert.
  - `WFAlertPerson` (ContactField) Person — The reminder notification will be shown when chatting with this person in Messages.
  - `WFAlertLocationRadius` (UnitQuantityField) Radius default=1000 — The distance from the provided location to consider “arriving” or “leaving” the location
  - `WFAlertCustomTime` (DateField) Time — Text representing the date or date and time when the alert should occur. Examples: “tonight at 7”, “March 7”
  - `WFPriority` (Enumeration) Priority default="None" choices=["None", "Low", "Medium", "High"]
  - `WFUrgent` (Switch) Urgent
  - `WFFlag` (Switch) Flag
  - `WFURL` (URL) URL — Optionally, a URL to attach to this reminder.
  - `WFImages` (VariablePicker) Images — An optional set of images to attach to this reminder. Use a variable to get the images.
  - `WFParentTask` (VariablePicker) Parent Reminder — Optionally, a parent reminder to add this reminder to.
  - `WFTags` (TagField) Tags — Optionally, tags to add to this reminder.
  - `WFCalendarItemNotes` (TextInput) Notes — Optionally, a description for this reminder.

## Nothing

- identifier: `is.workflow.actions.nothing`  ·  class `WFNothingAction`
- This action does nothing and produces no output. It is useful to separate blocks of actions, or to explicitly pass an empty input to an action.
- result: Nothing
- summary: `Nothing`
- output: Nothing WFContentItem
- keywords: nil, nothing, empty, discard, clear
- icon: app.dashed (Clear)
- ResidentCompatible: True
- InputPassthrough: False

## Number

- identifier: `is.workflow.actions.number`  ·  class `WFNumberAction`
- Passes a number to the next action.
- summary: `${WFNumberActionNumber}`
- output: Number NSDecimalNumber
- keywords: decimal, math
- icon: number (Gray)
- ResidentCompatible: True
- parameters:
  - `WFNumberActionNumber` (NumberField) Number

## Open App

- identifier: `is.workflow.actions.openapp`  ·  class `WFOpenAppAction`
- Opens the specified app.
- summary: `Open ${WFSelectedApp}`
- output: App WFAppContentItem
- keywords: launch, run, switch
- icon: arrow.up.forward (Indigo)
- parameters:
  - `WFSelectedApp` (AppPicker) App
  - `WFAppName` (TextInput) App Name
  - `WFWindowingFormat` (Enumeration) Window Location & Size default="Full Screen" choices=["Full Screen", "Left", "Right", "Top", "Bottom", "Top Leading", "Top Trailing", "Bottom Leading", "Bottom Trailing", "Left Third", "Middle Third", "Right Third"]

## Open Directions

- identifier: `is.workflow.actions.getdirections`  ·  class `WFGetDirectionsAction`
- Opens directions to the location passed into this action in your choice of Maps, Google Maps, Citymapper, Transit, or Waze. For example, you can use this action to get directions to an upcoming event on your calendar.
- input: The destination address
- summary variants:
  - `Open directions to ${WFDestination} using ${WFGetDirectionsActionApp}`
  - `Open directions from ${WFLocation} to ${WFDestination}`
  - `Open directions from ${WFLocation} to ${WFDestination} using ${WFGetDirectionsActionApp}`
  - `Open ${WFGetDirectionsActionMode} directions from ${WFLocation} to ${WFDestination}`
  - `Open ${WFGetDirectionsActionMode} directions from ${WFLocation} to ${WFDestination} using ${WFGetDirectionsActionApp}`
- input: NSString, CLLocation, MKMapItem (required)
- output: Open Directions
- keywords: get, maps, search, query, place, location, find, waze, google, transit, citymapper
- InputPassthrough: True
- parameters:
  - `WFLocation` (Location) Location
  - `WFDestination` (Location) Destination — Multi-stop trips are only supported by Apple Maps.
  - `WFGetDirectionsActionApp` (MapsAppPicker) App default="Maps"
  - `WFGetDirectionsActionMode` (DynamicEnumeration) Mode default="Driving"

## Open File

- identifier: `is.workflow.actions.openin`  ·  class `WFOpenInAction`
- Opens the input as a file in the specified app.
- summary variants:
  - `Open ${WFInput} in ${WFSelectedApp}`  when {"WFOpenInAskWhenRun": "0"}
  - `Open ${WFInput}`  when {"WFOpenInAskWhenRun": "1"}
- input: public.data (required)
- keywords: open, file, document, in, app, application, uidocumentinteractioncontroller
- icon: arrow.up.forward (Tint)
- InputPassthrough: True
- parameters:
  - `WFOpenInAskWhenRun` (Switch) Show Open In Menu default=false
  - `WFSelectedApp` (AppPicker) App
  - `WFAppName` (TextInput) App Name
  - `WFInput` (FilePicker) File

## Open in BlindSquare

- identifier: `is.workflow.actions.showinblindsquare`  ·  class `WFShowInBlindSquareAction`
- Opens BlindSquare showing information about the place passed as input, so you can save it as a favorite, start tracking it, or start simulation mode.
- summary: `Open ${WFInput}`
- input: CLLocation, MKMapItem (required)
- InputPassthrough: True
- parameters:
  - `WFBlindSquareSimulation` (Switch) Start Simulation default=false
  - `WFInput` (Location) Location

## Open in Calendar

- identifier: `is.workflow.actions.showincalendar`  ·  class `WFOpenInCalendarAction`
- Shows the date or calendar event passed as input in the Calendar app.
- summary: `Open ${WFEvent} in Calendar`
- input: WFDateContentItem, WFCalendarEventContentItem, WFTimeIntervalContentItem (required)
- keywords: date, event, show, reveal
- InputPassthrough: True
- parameters:
  - `WFEvent` (VariablePicker) Event

## Open in GoodReader

- identifier: `is.workflow.actions.goodreader.open`  ·  class `WFSendToGoodReaderAction`
- Opens a file in GoodReader.
- summary: `Open ${WFInput}`
- input: public.data (required)
- output: Open in GoodReader
- keywords: save, file, document
- InputPassthrough: True
- parameters:
  - `WFInput` (VariablePicker) File

## Open in Maps

- identifier: `is.workflow.actions.searchmaps`  ·  class `WFSearchMapsAction`
- Opens your choice of Maps, Google Maps, or Waze and searches for the location, place, or text that was passed into the action.
- summary: `Open ${WFInput} in Maps`
- input: NSString, CLLocation, MKMapItem (required)
- keywords: maps, search, query, places, waze, google
- InputPassthrough: True
- parameters:
  - `WFInput` (Location) Location
  - `WFSearchMapsActionApp` (MapsAppPicker) App default="Maps"

## Open Reminders List

- identifier: `is.workflow.actions.reminders.showlist`  ·  class `WFShowRemindersListAction`
- Shows the specified list in the Reminders app.
- summary: `Open ${WFList}`
- keywords: task, todo, to-do
- parameters:
  - `WFList` (RemindersListPicker) List — The list to show

## Open URLs

- identifier: `is.workflow.actions.openurl`  ·  class `WFOpenURLAction`
- Opens URLs passed into the action in Safari.
- summary: `Open ${WFInput}`
- input: NSURL (required)
- keywords: URL, web, display, site, open, show, multiple
- icon: arrow.up.forward (Tint)
- InputPassthrough: True
- parameters:
  - `WFInput` (TextInput) URL

## Open X-Callback URL

- identifier: `is.workflow.actions.openxcallbackurl`  ·  class `WFOpenXCallbackURLAction`
- Performs the specified x-callback-url action. The x-success, x-cancel, and x-error parameters will be added automatically.
- result: When the app that’s opened calls back to Shortcuts using x-success, it may include parameters in the URL. These will be passed as output to the next action, as text if there is just one parameter, or as a dictionary if there are multiple (use Get Dictionary Value to access it).
- summary: `Open ${WFXCallbackURL} with x-callback`
- input: WFURLContentItem (required)
- output: X-Callback Result NSString, NSDictionary
- keywords: xcallback
- icon: arrow.left.arrow.right (Tint)
- parameters:
  - `WFXCallbackCustomCallbackEnabled` (Switch) Custom Callback — Turn this on if you want to open a callback URL that is not x-callback-url compliant and uses keys other than “x-success”, “x-error”, and “x-cancel”.
  - `WFXCallbackCustomSuccessKey` (TextInput) Success Key default="x-success"
  - `WFXCallbackCustomCancelKey` (TextInput) Cancel Key
  - `WFXCallbackCustomErrorKey` (TextInput) Error Key
  - `WFXCallbackCustomSuccessURLEnabled` (Switch) Custom X-Success URL — If enabled, Shortcuts will use a custom success callback URL. This is useful if the app you are calling uses placeholders in the x-success URL to pass output.
  - `WFXCallbackCustomSuccessURL` (TextInput) X-Success URL default="shortcuts://callback" — For example, you might use shortcuts://callback?result=[[output]]
  - `WFXCallbackURL` (TextInput) X-Callback URL

## Optimize File Size of PDF

- identifier: `is.workflow.actions.compresspdf`  ·  class `WFCompressPDFAction`
- Optimizes the file size of the provided PDF file by compressing its images.\n\nIf the images contained in the PDF are already compressed, this action might not have a measurable effect on file size.
- summary: `Optimize file size of ${WFInput}`
- input: com.adobe.pdf (required)
- output: Optimized PDF com.adobe.pdf
- keywords: text, pdf, ocr, string, scan
- icon: arrow.down.right.and.arrow.up.left (Tint)
- parameters:
  - `WFInput` (FilePicker) PDF

## Overlay Image

- identifier: `is.workflow.actions.overlayimageonimage`  ·  class `WFOverlayImageAction`
- Overlays an image on top of another image.
- input: Background images
- result: The combined images
- summary: `Overlay ${WFImage} on ${WFInput}`
- input: WFImageContentItem (required)
- output: Overlaid Image WFImageContentItem
- keywords: picture, edit, editor, photos
- icon: photo.fill.on.rectangle.fill (Blue)
- InputPassthrough: False
- parameters:
  - `WFImage` (VariablePicker) Image
  - `WFInput` (VariablePicker) Image
  - `WFShouldShowImageEditor` (Switch) Show Image Editor default=true
  - `WFImagePosition` (Enumeration) Position default="Center" choices=["Center", "Top Left", "Top Right", "Bottom Left", "Bottom Right", "Custom"]
  - `WFImageWidth` (NumberField) Width
  - `WFImageHeight` (NumberField) Height
  - `WFImageX` (NumberField) X Coordinate
  - `WFImageY` (NumberField) Y Coordinate
  - `WFRotation` (NumberField) Rotation (Degrees) default=0
  - `WFOverlayImageOpacity` (NumberField) Opacity default=100

## Overlay Text

- identifier: `is.workflow.actions.overlaytext`  ·  class `WFOverlayTextAction`
- Overlays text onto the image passed as input.
- input: An image
- result: An image with text
- summary variants:
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFPercentageTextOffset}`  when {"WFTextPosition": "Bottom Center"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFTextOffset} points`  when {"WFTextPosition": "Bottom Center"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFPercentageTextOffset}`  when {"WFTextPosition": "Bottom Left"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFTextOffset} points`  when {"WFTextPosition": "Bottom Left"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFPercentageTextOffset}`  when {"WFTextPosition": "Bottom Right"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFTextOffset} points`  when {"WFTextPosition": "Bottom Right"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition}`  when {"WFTextPosition": "Center"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} ${WFPercentageTextX}, ${WFPercentageTextY}`  when {"WFTextPosition": "Custom Position"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} ${WFTextX}, ${WFTextY}`  when {"WFTextPosition": "Custom Position"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFPercentageTextOffset}`  when {"WFTextPosition": "Middle Left"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFTextOffset} points`  when {"WFTextPosition": "Middle Left"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFPercentageTextOffset}`  when {"WFTextPosition": "Middle Right"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFTextOffset} points`  when {"WFTextPosition": "Middle Right"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFPercentageTextOffset}`  when {"WFTextPosition": "Top Center"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFTextOffset} points`  when {"WFTextPosition": "Top Center"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFPercentageTextOffset}`  when {"WFTextPosition": "Top Left"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFTextOffset} points`  when {"WFTextPosition": "Top Left"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFPercentageTextOffset}`  when {"WFTextPosition": "Top Right"}
  - `Overlay ${WFText} on ${WFImage} at ${WFTextPosition} offset by ${WFTextOffset} points`  when {"WFTextPosition": "Top Right"}
- input: WFImageContentItem (required)
- output: Image with Text WFImageContentItem
- keywords: hairforce, caption, meme
- InputPassthrough: False
- parameters:
  - `WFText` (TextInput) Text
  - `WFImage` (VariablePicker) Image
  - `WFTextPosition` (Enumeration) Position default="Center" choices=["Top Left", "Top Center", "Top Right", "Middle Left", "Center", "Middle Right", "Bottom Left", "Bottom Center", "Bottom Right", "Custom Position"]
  - `WFTextX` (NumberField) X Coordinate — The X Coordinate to start the text at, in points. 0 starts at the left of the image.
  - `WFPercentageTextX` (Slider) X Coordinate — The X Coordinate to start the text at, as a decimal proportion of the image size between 0 and 1. 0 starts at the left of the image.
  - `WFTextY` (NumberField) Y Coordinate — The Y Coordinate to start the text at, in points. 0 starts at the top of the image.
  - `WFPercentageTextY` (Slider) Y Coordinate — The Y Coordinate to start the text at, as a decimal proportion of the image size between 0 and 1. 0 starts at the top of the image.
  - `WFTextOffset` (NumberField) Offset default=0 — The amount of additional space between the text box and the nearest edges of the image, in points. For example, the nearest edges are the Left for Middle Left alignment, the Bottom and Right for Bottom Right alignment, and the Top for Top alignment.
  - `WFPercentageTextOffset` (Slider) Offset default=0.1 — The amount of additional space between the text box and the nearest edges of the image, as a decimal proportion of the image size between 0 and 1. For example, the nearest edges are the Left for Middle Left alignment, the Bottom and Right for Bottom Right alignment, and the Top for Top alignment.
  - `WFFont` (FontPicker) Font
  - `WFFontSize` (NumberField) Font Size default=36 — The size of the font, in points, to apply to the text.
  - `WFPercentageFontSize` (Slider) Font Size default=0.1 — The size of the font, as a decimal proportion of the image size between 0 and 1, to apply to the text.
  - `WFTextAlignment` (Enumeration) Text Alignment default="Center" choices=["Left", "Center", "Right"] — The alignment to apply to the text. This will align to the edge of the bounding box created by the Maximum Width, if any.
  - `WFTextColor` (ColorPicker) Font Color
  - `WFTextRotation` (NumberField) Rotation default=0 — The amount of rotation, in degrees, to apply to the text. Starts from the center of the text bounds. Optional.
  - `WFTextOutlineEnabled` (Switch) Outline Text default=false
  - `WFTextStrokeWidth` (NumberField) Stroke Width default=0 — The stroke width, in points, to apply to the text. Optional.
  - `WFPercentageTextStrokeWidth` (Slider) Stroke Width default=0.1 — The stroke width, as a decimal proportion of the font size between 0 and 1, to apply to the text. Optional.
  - `WFTextStrokeColor` (ColorPicker) Stroke Color
  - `WFTextBoxWidth` (NumberField) Maximum Width — The maximum width of the text, in points. If 0, the text will have a bounding box that is as wide as necessary, and may run off the edge of the image. Otherwise, the text will wrap within the bounds of the width. Optional.
  - `WFPercentageTextBoxWidth` (Slider) Maximum Width default=0.8 — The maximum width of the text, as a decimal proportion of the image size between 0 and 1. If 0, the text will have a bounding box that is as wide as necessary, and may run off the edge of the image. Otherwise, the text will wrap within the bounds of the width. Optional.
  - `WFSizingMethod` (Enumeration) Sizing default="Proportional" choices=["Proportional", "Absolute"] — The sizing method to use. Proportional sizing will cause all parameters to use a decimal proportion between 0 and 1. Absolute sizing will cause all parameters to use points.

## Phone Number

- identifier: `is.workflow.actions.phonenumber`  ·  class `WFPhoneNumberAction`
- Passes the specified phone numbers to the next action.
- output: Phone Number WFPhoneNumber
- keywords: phone, number, mobile, home, cellular, telephone
- icon: phone.fill (Green)
- ResidentCompatible: True
- parameters:
  - `WFPhoneNumber` (PhoneNumberField) Phone Number

## Ping My iPhone

- identifier: `com.apple.NanoSettings.NPRFPingMyPhoneIntent`  ·  class `None`
- Plays a sound on your paired iPhone.

You can also choose to have the flashlight pulse.
- parameters:
  - `state` () State choices=["off", "on"]

## Play Music

- identifier: `is.workflow.actions.playmusic`  ·  class `WFPlayMusicAction`
- Plays music using the Music app.
- input: The music to be played
- summary: `Play ${WFMediaItems}`
- input: MPMediaItem, WFMediaItemCollectionContentItem
- keywords: play, song, ipod, track, music, itunes, library
- InputPassthrough: True
- parameters:
  - `WFMediaItems` (MediaPicker) Music — Selects music to start playing.
  - `WFPlayMusicActionShuffle` (Enumeration) Shuffle choices=["Off", "Songs"]
  - `WFPlayMusicActionRepeat` (Enumeration) Repeat choices=["None", "One", "All"]

## Play Podcast

- identifier: `is.workflow.actions.playpodcast`  ·  class `WFPlayPodcastAction`
- Plays a podcast using the Podcasts app. If no podcast is selected, resumes playback.
- input: The podcast to be played
- summary: `Play ${WFPodcastShow}`
- input: WFPodcastShowContentItem, WFPodcastEpisodeContentItem
- keywords: play, podcast, show, library
- InputPassthrough: True
- parameters:
  - `WFPodcastShow` (PodcastPicker) Podcast
  - `WFPodcastPlaybackOrder` (Enumeration) Playback Order choices=["Default", "Newest First", "Oldest First"] — The order within a show of the episodes to play. By default, the order will match the order used in the Podcasts app.

## Play Sound

- identifier: `is.workflow.actions.playsound`  ·  class `WFPlaySoundAction`
- Plays the audio file passed as input, or a default notification sound if no audio file was passed.
- summary: `Play sound`
- input: AVAsset
- keywords: notification, audio, music
- icon: play.circle.fill (Red)
- InputPassthrough: True
- parameters:
  - `WFInput` (VariablePicker) Sound File

## Play/Pause

- identifier: `is.workflow.actions.pausemusic`  ·  class `WFPlayPauseAction`
- Plays or pauses the currently playing media.
- summary: `${WFPlayPauseBehavior} on ${WFMediaRoute}`
- keywords: pause, play, song, podcast, ipod, track, music, itunes
- icon: playpause.fill (Red)
- InputPassthrough: True
- parameters:
  - `WFPlayPauseBehavior` (Enumeration) Play/Pause default="Play/Pause" choices=["Play/Pause", "Play", "Pause"]
  - `WFMediaRoute` (MediaRoutePicker) Device default="Local"

## Post on Facebook

- identifier: `is.workflow.actions.postonfacebook`  ·  class `WFSocialAction`
- Shares the input on Facebook.
- input: Content to share.
- summary: `Post ${FacebookContent}`
- input: WFImageContentItem, WFAVAssetContentItem, WFURLContentItem, WFStringContentItem (required)
- keywords: share, text, post, facebook, fb
- parameters:
  - `FacebookContent` (VariablePicker) Content

## Post to Shared Album

- identifier: `com.apple.mobileslideshow.StreamShareService`  ·  class `WFShareExtensionAction`
- summary: `Post ${ImageInput} to Shared Album`
- input: WFImageContentItem, WFPhotoMediaContentItem (required)
- keywords: post, stream, share, with, icloud, photo, sharing
- parameters:
  - `ImageInput` (VariablePicker) Images

## Post to Slack

- identifier: `is.workflow.actions.slack.send`  ·  class `WFSlackPostAction`
- Posts the input to the specified Slack channel.
- summary: `Post ${WFSlackInput} to ${SlackChannel}`
- input: WFGenericFileContentItem, WFStringContentItem (required)
- keywords: send, text, gif, image, video
- InputPassthrough: True
- parameters:
  - `WFAccount` (AccountPicker) Account
  - `SlackChannel` (SlackChannelPicker) Channel
  - `WFSlackInput` (VariablePicker) Content

## Post to Tumblr

- identifier: `is.workflow.actions.tumblr.post`  ·  class `WFTumblrPostAction`
- Posts the content passed into the action to Tumblr.
- result: The URL of the new post
- summary: `Post ${WFInput}`
- input: NSString, WFImage, NSURL, AVAsset (required)
- output: Tumblr Post URL WFURLContentItem
- keywords: blog
- parameters:
  - `WFInput` (VariablePicker) Content
  - `WFComposeInApp` (TumblrComposeInApp) Compose In Tumblr
  - `WFBlogName` (TumblrBlogPicker) Blog — The name of the blog to post to.
  - `WFPostType` (DynamicEnumeration) Type
  - `WFPostState` (Enumeration) Post Status default="Post Now" choices=["Post Now", "Add to Queue", "Save as Draft", "Post Privately"]
  - `WFPostTitle` (TextInput) Title
  - `WFPostSource` (TextInput) Source
  - `WFPostCaption` (TextInput) Caption
  - `WFPostTags` (TextInput) Tags
  - `WFPostDescription` (TextInput) Description

## Post to WordPress

- identifier: `is.workflow.actions.wordpress.post`  ·  class `WFWordPressPostAction`
- Posts the input to a WordPress blog as a new post or page.
- result: The URL of the new blog post
- summary: `Post ${WFInput} as ${Title}`
- input: WFRichTextContentItem, WFStringContentItem, WFImageContentItem (required)
- output: WordPress Post URL NSURL
- parameters:
  - `WFAccount` (AccountPicker) Account
  - `Blog` (DynamicEnumeration) Blog
  - `Title` (TextInput) Title
  - `Type` (DynamicEnumeration) Type
  - `Format` (DynamicEnumeration) Format
  - `Status` (DynamicEnumeration) Status
  - `Categories` (DynamicTagField) Categories
  - `Tags` (DynamicTagField) Tags
  - `Advanced` (Expanding) Advanced
  - `AllowComments` (Switch) Allow Comments
  - `Slug` (TextInput) Slug
  - `Excerpt` (TextInput) Excerpt
  - `Date` (DateField) Publish Date
  - `Template` (DynamicEnumeration) Template
  - `ThumbnailImage` (VariablePicker) Featured Image
  - `ShowCustomFields` (Expanding) Custom Fields
  - `CustomFields` (Dictionary) Custom Fields
  - `WFInput` (VariablePicker) Content

## Print

- identifier: `is.workflow.actions.print`  ·  class `WFPrintAction`
- Prints the input using AirPrint.
- summary: `Print ${WFInput}`
- input: UIPrintFormatter, com.adobe.pdf (required)
- keywords: pdf, print, printer, airprint
- icon: printer.fill (Gray)
- InputPassthrough: True
- parameters:
  - `WFInput` (VariablePicker) Input

## Put Display to Sleep

- identifier: `is.workflow.actions.displaysleep`  ·  class `WFDisplaySleepAction`
- Puts the display(s) of this Mac to sleep.
- summary: `Put the display to sleep`
- keywords: screen, off, monitor, idle, standby, shut, turn
- icon: display (Gray)

## Quick Look

- identifier: `is.workflow.actions.previewdocument`  ·  class `WFQuickLookAction`
- Displays a preview of the input using the system Quick Look.
- summary: `Show ${WFInput} in Quick Look`
- input: public.data (required)
- keywords: preview, show, file, document, quicklook, quick look
- icon: eye.fill (Yellow_Accessibility)
- InputPassthrough: True
- parameters:
  - `WFInput` (VariablePicker) Input
  - `WFQuickLookActionFullScreen` (Switch) Full Screen

## Quit App

- identifier: `is.workflow.actions.quit.app`  ·  class `WFQuitAppAction`
- Quits one or all open applications. You can choose a list of apps to keep open.
- summary variants:
  - `Quit ${WFQuitAppMode} ${WFApp}`
  - `Quit ${WFQuitAppMode} except ${WFAppsExcept}`
- keywords: kill, close
- icon: xmark.app.fill (Indigo)
- parameters:
  - `WFQuitAppMode` (Enumeration) Mode default="App" choices=["App", "All Apps"]
  - `WFAppsExcept` (AppPicker) Apps
  - `WFApp` (AppPicker) App
  - `WFAskToSaveChanges` (Switch) Ask to Save Changes default=true

## Random Number

- identifier: `is.workflow.actions.number.random`  ·  class `WFRandomNumberAction`
- Passes a random number between the given minimum and maximum to the next action. The minimum and maximum numbers are included as possible results.
- summary: `Random number between ${WFRandomNumberMinimum} and ${WFRandomNumberMaximum}`
- output: Random Number NSDecimalNumber
- keywords: decimal, math, generate, generator
- icon: number (Gray)
- ResidentCompatible: True
- parameters:
  - `WFRandomNumberMinimum` (NumberField) Minimum
  - `WFRandomNumberMaximum` (NumberField) Maximum

## Recognize Music

- identifier: `com.apple.musicrecognition.RecognizeMusicIntent`  ·  class `WFRecognizeMusicAction`
- Uses the microphone to listen to and identify nearby media.
- summary: `Recognize Music`
- output: Shazam Media WFShazamMedia
- keywords: song, identification, shazam, music
- InputPassthrough: False
- parameters:
  - `WFShazamMediaActionShowWhenRun` (Switch) Show When Run default=true
  - `WFShazamMediaActionErrorIfNotRecognized` (Switch) Error If Not Recognized default=true

## Record Audio

- identifier: `is.workflow.actions.recordaudio`  ·  class `WFRecordAudioAction`
- Uses the microphone to record audio.
- summary: `Record audio`
- output: Recorded Audio com.apple.m4a-audio
- keywords: camera, clip, record
- icon: record.circle.fill (Red)
- InputPassthrough: False
- parameters:
  - `WFRecordingCompression` (Enumeration) Audio Quality default="Normal" choices=["Normal", "Very High"] — High-quality audio takes up a lot more space than normal audio, so stick with normal unless you really need it. Normal audio is returned as an M4A file (with AAC audio), while high-quality audio is returned in uncompressed WAV format.
  - `WFRecordingStart` (Enumeration) Start Recording default="On Tap" choices=["On Tap", "Immediately"]
  - `WFRecordingEnd` (Enumeration) Finish Recording default="On Tap" choices=["On Tap", "After Time"]
  - `WFRecordingTimeInterval` (DurationQuantityField) Duration

## Remove Events

- identifier: `is.workflow.actions.removeevents`  ·  class `WFRemoveCalendarItemsAction`
- Removes all events passed into the action from the calendars they are contained in.
- note: This is a destructive and permanent action. You will be asked to confirm before events are removed.
- summary: `Remove ${WFInputEvents}`
- input: EKEvent (required)
- keywords: calendar, delete
- InputPassthrough: False
- parameters:
  - `WFCalendarIncludeFutureEvents` (Switch) Include Future Events default=false — When enabled, any repeats of an event in the future are also removed.
  - `WFInputEvents` (VariablePicker) Events

## Remove from Photo Album

- identifier: `is.workflow.actions.removefromalbum`  ·  class `WFRemovePhotoFromAlbumAction`
- Removes the photos or videos passed as input from the specified photo album.
- input: Photos, videos to remove
- result: The removed items
- summary: `Remove ${WFInput} from ${WFRemoveAlbumSelectedGroup}`
- input: WFPhotoMediaContentItem (required)
- output: Removed Photo Media PHAsset
- keywords: remove, photo, photos, picture, image, album
- InputPassthrough: False
- parameters:
  - `WFRemoveAlbumSelectedGroup` (PhotoAlbumPicker) Album
  - `WFInput` (VariablePicker) Input

## Remove Reminders

- identifier: `is.workflow.actions.removereminders`  ·  class `WFRemoveCalendarItemsAction`
- Removes all reminders passed into the action from the lists they are contained in.
- note: This is a destructive and permanent action. You will be asked to confirm before reminders are removed.
- summary: `Remove ${WFInputReminders}`
- input: REMReminder (required)
- keywords: calendar, delete
- InputPassthrough: False
- parameters:
  - `WFInputReminders` (VariablePicker) Reminders

## Rename File

- identifier: `is.workflow.actions.file.rename`  ·  class `WFRenameFileAction`
- Renames the specified file.
- summary: `Rename ${WFFile} to ${WFNewFilename}`
- input: public.data (required)
- output: File public.data
- keywords: file, document, filepicker, rename, folder, move
- icon: character.textbox (Tint)
- parameters:
  - `WFFile` (FilePicker) File
  - `WFNewFilename` (TextInput) Name

## Repeat

- identifier: `is.workflow.actions.repeat.count`  ·  class `WFFiniteRepeatAction`
- Repeats the contained actions, running them the specified number of times.
- summary: `Repeat ${WFRepeatCount}`
- input: WFContentItem
- output: Repeat WFContentItem
- keywords: loop, while, for
- icon: repeat (Gray)
- ResidentCompatible: True
- parameters:
  - `WFRepeatCount` (Stepper) default=1

## Repeat with Each

- identifier: `is.workflow.actions.repeat.each`  ·  class `WFForEachRepeatAction`
- Takes a list of items as input, and runs the contained actions once for each item in the list.
- input: A list of items
- result: Every item passed to the “End Repeat” action
- summary: `Repeat with each item in ${WFInput}`
- input: WFContentItem
- output: Repeat with Each WFContentItem
- keywords: loop, while, for
- icon: repeat (Gray)
- ResidentCompatible: True
- parameters:
  - `WFInput` (VariablePicker) Items

## Replace Text

- identifier: `is.workflow.actions.text.replace`  ·  class `WFReplaceTextAction`
- Replaces all occurrences of the given text with other text.
- summary: `Replace ${WFReplaceTextFind} with ${WFReplaceTextReplace} in ${WFInput}`
- input: NSString (required)
- output: Updated Text NSString
- keywords: finding, matching, searching, regular, expression, regexp
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFReplaceTextFind` (TextInput) Find Text — The text to be replaced.
  - `WFReplaceTextReplace` (TextInput) Replace With — The text to replace all occurrences of Find Text.
  - `WFReplaceTextCaseSensitive` (Switch) Case Sensitive default=true — When disabled, the capitalization of letters is ignored.
  - `WFReplaceTextRegularExpression` (Switch) Regular Expression default=false — When enabled, Find Text is treated as a regular expression.
  - `WFInput` (TextInput) Text

## Request Payment

- identifier: `is.workflow.actions.venmo.request`  ·  class `WFHandlePaymentIntentAction`
- Requests a payment from the specified people using a payment app on your device.
- summary: `Request ${WFVenmoActionAmount} from ${WFVenmoActionRecipients}`
- keywords: venmo, money, send, pay, request, cash, currency, dollars
- InputPassthrough: True
- parameters:
  - `IntentAppDefinition` (IntentAppPicker) App default={"BundleIdentifier": "com.apple.PassKit.PassKitIntentsExtension"}
  - `WFVenmoActionRecipients` (ContactHandleField) Recipients
  - `WFVenmoActionAmount` (CurrencyQuantityField) Amount
  - `WFVenmoActionAppSwitch` (Switch) Open in App default=false
  - `ShowWhenRun` (Switch) Show When Run default=true
  - `WFVenmoActionNote` (TextInput) Note

## Request Ride

- identifier: `is.workflow.actions.ride.requestride`  ·  class `WFRequestRideIntentAction`
- Requests a ride from the specified pickup location to a specified drop off location.
- summary: `Request ride from ${PickupLocation} to ${DropOffLocation} with ${IntentAppDefinition}`
- input: CLLocation
- output: Requested Ride INRideStatus
- keywords: ride, request, taxi
- icon: figure.wave (Tint)
- parameters:
  - `IntentAppDefinition` (IntentAppPicker) App
  - `PickupLocation` (Location) Pickup Location
  - `DropOffLocation` (Location) Drop Off Location
  - `RideOption` (RideOption) Ride Type
  - `PaymentMethod` (PaymentMethod) Payment Method
  - `PartySize` (Stepper) Party Size default=1

## Resize Image

- identifier: `is.workflow.actions.image.resize`  ·  class `WFImageResizeAction`
- Scales images to a particular width and height.
- note: If the width or height is not set, that dimension is automatically calculated to maintain the original image’s aspect ratio.
- summary variants:
  - `Resize ${WFImage} to ${WFImageResizeKey} ${WFImageResizeWidth} × ${WFImageResizeHeight}`
  - `Resize ${WFImage} to ${WFImageResizeKey} ${WFImageResizeLength}`
  - `Resize ${WFImage} by ${WFImageResizeKey} ${WFImageResizePercentage}%`
- input: WFImage (required)
- output: Resized Image WFImage
- keywords: scale, transform, shrink, stretch, expand, width, height, photos
- icon: arrow.up.left.and.down.right.and.arrow.up.right.and.down.left (Blue)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFImageResizeKey` (Enumeration) By default="Size" choices=["Size", "Percentage", "Longest Edge"]
  - `WFImageResizeWidth` (NumberField) Width default=640
  - `WFImageResizeHeight` (NumberField) Height
  - `WFImageResizePercentage` (NumberField) Percentage
  - `WFImageResizeLength` (NumberField) Longest Edge Size
  - `WFImage` (VariablePicker) Image

## Resize Window

- identifier: `is.workflow.actions.resizewindow`  ·  class `WFResizeWindowAction`
- Resizes one or more windows to the specified width and height.
- input: The window(s) to resize
- summary variants:
  - `Resize ${WFWindow} to ${WFConfiguration}`
  - `Resize ${WFWindow} to ${WFConfiguration} ${WFWidth} × ${WFHeight}`  when {"WFConfiguration": "Dimensions"}
- input: WFWindowContentItem (required)
- parameters:
  - `WFConfiguration` (Enumeration) Configuration default="Fit Screen" choices=["Fit Screen", "Top Half", "Bottom Half", "Left Half", "Right Half", "Top Left Quarter", "Top Right Quarter", "Bottom Left Quarter", "Bottom Right Quarter", "Dimensions"]
  - `WFWidth` (NumberField) Width
  - `WFHeight` (NumberField) Height
  - `WFWindow` (VariablePicker) Window
  - `WFBringToFront` (Switch) Bring to Front default=true

## Reveal Files in Finder

- identifier: `is.workflow.actions.file.reveal`  ·  class `WFRevealFilesAction`
- Opens windows in the Finder with the specified files selected.
- summary: `Reveal ${WFFile}`
- input: public.data (required)
- keywords: show, file, document
- parameters:
  - `WFFile` (FilePicker) Files

## Rotate Image/Video

- identifier: `is.workflow.actions.image.rotate`  ·  class `WFImageRotateAction`
- Turns an image or video clockwise by a particular number of degrees.
- summary: `Rotate ${WFImage} by ${WFImageRotateAmount} degrees`
- input: WFImage, AVAsset (required)
- output: Rotated Image/Video WFImage, AVAsset
- keywords: portrait, landscape, degrees, rotation, orientation, photos
- icon: rotate.right.fill (Blue)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFImageRotateAmount` (NumberField) Degrees default=90
  - `WFImage` (VariablePicker) Image

## Round Number

- identifier: `is.workflow.actions.round`  ·  class `WFRoundNumberAction`
- Rounds the number(s) passed into the action.
- summary variants:
  - `Round ${WFInput} to ${WFRoundTo}`
  - `Round ${WFInput} to ${WFRoundTo} ${TenToThePowerOf}`  when {"WFRoundTo": "10 ^"}
- input: WFNumberContentItem (required)
- output: Rounded Number NSDecimalNumber
- keywords: calculator, calculate, number, ceiling, floor
- icon: equal (Gray)
- ResidentCompatible: True
- parameters:
  - `WFInput` (NumberField) Number
  - `WFRoundTo` (Enumeration) Value default="Ones Place" choices=["Millions", "Hundred Thousands", "Ten Thousands", "Thousands", "Hundreds Place", "Tens Place", "Ones Place", "Tenths", "Hundredths", "Thousandths", "Ten Thousandths", "Hundred Thousandths", "Millionths", "Ten Millionths", "Hundred Millionths", "Billionths", "10 ^"]
  - `WFRoundMode` (Enumeration) Mode default="Normal" choices=["Normal", "Always Round Up", "Always Round Down"]
  - `TenToThePowerOf` (NumberField) Ten to the Power of default=0

## Run AppleScript

- identifier: `is.workflow.actions.runapplescript`  ·  class `WFRunOSAScriptAction`
- This action executes an AppleScript.
- input: The input passed to this action will be passed to the first argument of the `on run` handler.
- result: The output from the script
- summary: `Run AppleScript with ${Input}`
- input: WFGenericFileContentItem
- output: AppleScript Result WFDictionaryContentItem, WFStringContentItem, WFBooleanContentItem, WFNumberContentItem
- keywords: apple, script, hypertalk, event, OSA
- InputPassthrough: False
- parameters:
  - `Input` (VariablePicker) Input
  - `Script` (OSAScriptEditor) default="on run {input, parameters}\\n    (* Your script goes here *)\\n    return input\\nend run"

## Run JavaScript for Mac Automation

- identifier: `is.workflow.actions.runjavascriptforautomation`  ·  class `WFRunOSAScriptAction`
- This action executes a JavaScript for Automation (JXA) script.
- input: The input passed to this action will be passed to the first argument of the `run` function.
- result: The output from the script
- summary: `Run JavaScript for Automation with ${Input}`
- input: WFGenericFileContentItem
- output: JavaScript Result WFDictionaryContentItem, WFStringContentItem, WFBooleanContentItem, WFNumberContentItem
- keywords: jxa, apple, script, applescript, event, OSA
- InputPassthrough: False
- parameters:
  - `Input` (VariablePicker) Input
  - `Script` (OSAScriptEditor) default="function run(input, parameters) {\\n    // Your script goes here\\n    return input;\\n}"

## Run JavaScript on Active Safari Tab

- identifier: `is.workflow.actions.runjavascriptonwebpage`  ·  class `WFRunJavaScriptOnWebPageAction`
- Runs JavaScript on a Safari web page passed in as input
- input: Safari web pages
- result: The output from the JavaScript (JSON)
- note: Safari Web Page items are only available when running your shortcut as an Action Extension in Safari.
- input: WFSafariWebPageContentItem (required)
- output: JavaScript Result WFDictionaryContentItem, WFStringContentItem, WFBooleanContentItem, WFNumberContentItem
- keywords: script, safari, java, javascript, web page, webkit, browser, json, web, page, website
- InputPassthrough: False
- parameters:
  - `WFJavaScript` (TextInput) JavaScript default="var result = [];\\n// Get all links from the page\\nvar elements = document.querySelectorAll(\\\"a\\\");\\nfor (let element of elements) {\\n    result.push({\\n        \\\"url\\\": element.href,\\n        \\\"text\\\": element.innerText\\n    });\\n}\\n\\n// Call completion to finish\\ncompletion(result);"
  - `WFInput` (VariablePicker) Web Page

## Run Script Over SSH

- identifier: `is.workflow.actions.runsshscript`  ·  class `WFRunSSHScriptAction`
- Runs a script on a remote computer over SSH.
- input: The input passed to the shell script (stdin)
- result: The output from the shell script (stdout)
- summary: `Run script over SSH`
- input: public.data
- output: Shell Script Result public.data
- keywords: unix, shell, script, ssh, terminal, linux, mac
- icon: terminal.fill (Black)
- ResidentCompatible: True
- parameters:
  - `WFSSHScript` (TextInput) Script
  - `WFSSHHost` (TextInput) Host
  - `WFSSHPort` (TextInput) Port default="22"
  - `WFSSHUser` (TextInput) User
  - `WFSSHAuthenticationType` (Enumeration) Authentication default="Password" choices=["Password", "SSH Key"]
  - `WFSSHPassword` (TextInput) Password
  - `WFSSHKey` (SSHKey) SSH Key
  - `WFInput` (VariablePicker) Input

## Run Shell Script

- identifier: `is.workflow.actions.runshellscript`  ·  class `WFRunShellScriptAction`
- This action executes a UNIX shell script. The script will execute starting in your user’s home directory.
- input: Item(s) to be passed either as stdin or as arguments to the script.
- result: The output from the script
- summary: `Run Shell Script`
- input: WFGenericFileContentItem
- output: Shell Script Result public.data, public.plain-text
- keywords: script, terminal, bash, zsh
- InputPassthrough: False
- parameters:
  - `Script` (TextInput)
  - `Shell` (DynamicEnumeration) Shell — The shell to use for interpreting and running the script.
  - `Input` (VariablePicker) Input
  - `InputMode` (Enumeration) Pass Input default="to stdin" choices=["to stdin", "as arguments"] — to stdin: The input will be converted to a file and directed to the stdin pipe of the script.\nas arguments: The input will be converted to a list of strings and passed as arguments to the script.
  - `RunAsRoot` (Switch) Run as Administrator default=false — When enabled, Shortcuts will ask for an administrator’s password and run the script as the root user. This is similar to using sudo on the command line.

## Run Shortcut

- identifier: `is.workflow.actions.runworkflow`  ·  class `WFRunWorkflowAction`
- Runs a shortcut from your shortcut.
- input: The input to pass to the shortcut.
- result: The shortcut’s result
- summary: `Run ${WFWorkflow}`
- input: WFContentItem (required)
- output: Shortcut Result WFContentItem
- keywords: action, workflow, shortcuts
- parameters:
  - `WFWorkflow` (WorkflowPicker) Shortcut
  - `WFInput` (VariablePicker) Input

## Save Dropbox File

- identifier: `is.workflow.actions.dropbox.savefile`  ·  class `WFSaveDropboxFileAction`
- Save files to Dropbox. Turn off “Ask Where to Save” in order to specify a destination path.
- result: The saved files
- summary: `Save ${WFInput}`
- input: public.data (required)
- output: Saved File public.data
- keywords: save, file, document, upload, dropbox
- parameters:
  - `WFAskWhereToSave` (Switch) Ask Where to Save default=true
  - `WFFileDestinationPath` (TextInput) Destination Path — The path to save to, such as “/folder/file.txt”
  - `WFSaveFileOverwrite` (Switch) Replace Existing Files
  - `WFInput` (VariablePicker) File

## Save File

- identifier: `is.workflow.actions.documentpicker.save`  ·  class `WFSaveFileAction`
- Saves files to a specified folder. You can also use this action to copy a file.
- result: The saved files
- summary variants:
  - `Save ${WFInput} to ${WFFolder}`  when {"WFAskWhereToSave": "0"}
  - `Save ${WFInput}`  when {"WFAskWhereToSave": "1"}
- input: public.data (required)
- output: Saved File public.data
- keywords: save, file, document, icloud, cloud, upload, copy
- icon: doc.fill.badge.plus (Tint)
- parameters:
  - `WFInput` (FilePicker) File
  - `WFFolder` (FilePicker) Folder
  - `WFAskWhereToSave` (Switch) Ask Where To Save default=true
  - `WFFileDestinationPath` (TextInput) Subpath — The path to save to, such as “/folder/file.txt”
  - `WFSaveFileOverwrite` (Switch) Overwrite If File Exists default=false

## Save to Photos

- identifier: `is.workflow.actions.savetocameraroll`  ·  class `WFSaveToCameraRollAction`
- Adds the photos and videos passed as input to the specified photo album.
- input: Photos, videos, or audio to save
- result: The saved items
- note: If a photo passed as input is already in the specified album, the photo will be duplicated.
- summary: `Save ${WFInput} to ${WFCameraRollSelectedGroup}`
- input: WFPhotoMediaContentItem, WFImage, AVAsset (required)
- output: Saved Photo Media PHAsset
- keywords: save, photo, photos, picture, image, camera, roll
- InputPassthrough: False
- parameters:
  - `WFCameraRollSelectedGroup` (PhotoAlbumPicker) Album
  - `WFInput` (VariablePicker) Input

## Save with Transmit

- identifier: `com.panic.iOS.Transmit.Share`  ·  class `WFShareExtensionAction`
- input: WFGenericFileContentItem (required)
- keywords: upload, ftp, sftp, webdav, amazon, s3, transmit, panic
- parameters:
  - `TransmitSaveTo` (Enumeration) Save To default="Remote" choices=["Local", "Remote"]
  - `TransmitFavoriteName` (TextInput) Favorite Name
  - `TransmitPath` (TextInput) Path

## Search

- identifier: `is.workflow.actions.spotlightsearch`  ·  class `WFSpotlightSearchAction`
- Searches for content in the system that matches the specified text.
- result: The content that matches the search criteria.
- summary: `Search ${WFInputText}`
- input: WFStringContentItem (required)
- output: Results WFLinkEntityContentItem, WFCalendarEventContentItem, WFMessageContentItem, WFReminderContentItem, WFContactContentItem, WFPhotoMediaContentItem
- icon: magnifyingglass (Blue)
- parameters:
  - `WFInputText` (TextInput) Text
  - `WFSpotlightSearchResultType` (SpotlightSearchResultTypePicker) Type default="All"
  - `WFSpotlightSearchLimit` (Stepper) default=5

## Search in Passwords

- identifier: `is.workflow.actions.openpasswords`  ·  class `WFShowPasswordsAction`
- Opens Passwords and searches for the given text.
- summary: `Search ${WFShowPasswordsSearchTerm} in Passwords`
- keywords: keychain
- parameters:
  - `WFShowPasswordsSearchTerm` (TextInput) Text

## Search Web

- identifier: `is.workflow.actions.searchweb`  ·  class `WFSearchWebAction`
- Searches the web for the text provided as input.
- summary: `Search ${WFSearchWebDestination} for ${WFInputText}`
- input: NSString (required)
- keywords: Amazon, Bing, DuckDuckGo, eBay, Google, Reddit, Twitter, X, Yahoo!, YouTube, Internet, Website
- icon: magnifyingglass (Tint)
- InputPassthrough: True
- parameters:
  - `WFSearchWebDestination` (Enumeration) Service default="Google" choices=["Amazon", "Bing", "DuckDuckGo", "eBay", "Google", "Reddit", "Twitter", "Yahoo!", "YouTube"]
  - `WFInputText` (TextInput) Text

## Seek

- identifier: `is.workflow.actions.seek`  ·  class `WFSeekAction`
- Seek to a specific time, or forward and backward by some duration, in the currently playing media.
- summary: `Seek ${WFSeekBehavior} ${WFTimeInterval} on ${WFMediaRoute}`
- keywords: ipod, track, music, itunes, skip
- icon: goforward (Red)
- parameters:
  - `WFSeekBehavior` (Enumeration) Seek Type default="To Time" choices=["To Time", "Forward By", "Backward By"]
  - `WFTimeInterval` (DurationQuantityField) Time Interval
  - `WFMediaRoute` (MediaRoutePicker) Device default="Local"

## Select Contact

- identifier: `is.workflow.actions.selectcontacts`  ·  class `WFSelectContactsAction`
- Prompts to pick a person from your contacts and passes the selection to the next action.
- summary: `Select contact`
- output: Contacts WFContact
- keywords: select, person, people, contact, addressbook
- InputPassthrough: False
- parameters:
  - `WFSelectMultiple` (Switch) Select Multiple

## Select Email Address

- identifier: `is.workflow.actions.selectemail`  ·  class `WFSelectContactsAction`
- Prompts to pick an email address from your contacts and passes the selection to the next action.
- output: Email Addresses WFEmailAddress
- keywords: select, email, address, e-mail, addressbook
- icon: envelope.fill (Cyan)
- InputPassthrough: False

## Select File

- identifier: `is.workflow.actions.file.select`  ·  class `WFSelectFilesAction`
- Prompts to select files or folders.
- summary: `Select ${WFPickingMode}`
- output: File public.data, public.folder
- keywords: file, document, picker, open, folder
- icon: doc.fill (Tint)
- parameters:
  - `WFPickingMode` (Enumeration) Type default="Files" choices=["Files", "Folders"]
  - `SelectMultiple` (Switch) Select Multiple default=false

## Select Music

- identifier: `is.workflow.actions.exportsong`  ·  class `WFSelectMusicAction`
- Prompts to select music from your local music library.
- summary: `Select music`
- output: Music MPMediaItem
- keywords: export, song, music, itunes, library
- InputPassthrough: False
- parameters:
  - `WFExportSongActionSelectMultiple` (Switch) Select Multiple Songs

## Select Phone Number

- identifier: `is.workflow.actions.selectphone`  ·  class `WFSelectContactsAction`
- Prompts to pick a phone number from your contacts and passes the selection to the next action.
- output: Phone Numbers WFPhoneNumber
- keywords: select, phone, number, telephone, addressbook
- icon: phone.fill (Green)
- InputPassthrough: False

## Select Photos

- identifier: `is.workflow.actions.selectphoto`  ·  class `WFSelectPhotoAction`
- Prompts to choose photos and videos from your photo library.
- result: The selected photos/videos
- summary: `Select photos`
- output: Photos PHAsset
- keywords: select, photo, from, library, picture
- parameters:
  - `WFPhotoPickerTypes` (Enumeration) Include default=["Images", "Live Photos", "Videos"] choices=["Images", "Live Photos", "Videos"]
  - `WFSelectMultiplePhotos` (Switch) Select Multiple default=false

## Send Email

- identifier: `is.workflow.actions.sendemail`  ·  class `WFSendEmailAction`
- Pass text into the action to set the email body. Other types of input are added as attachments.
- summary: `Send ${WFSendEmailActionInputAttachments} with ${WFSendEmailActionSubject} to ${WFSendEmailActionToRecipients}`
- input: NSString, WFContentItem
- keywords: email, e-mail, mail, send, gmail, yahoo, hotmail, icloud, aol
- InputPassthrough: True
- parameters:
  - `WFEmailAccountActionSelectedAccount` (MailSenderPicker) From
  - `WFSendEmailActionFrom` (TextInput) From — The email address to send from. This must be an email address that is set up in the Mail app.
  - `WFSendEmailActionToRecipients` (EmailAddressField) Recipients
  - `WFSendEmailActionCcRecipients` (EmailAddressField) Cc
  - `WFSendEmailActionBccRecipients` (EmailAddressField) Bcc
  - `WFSendEmailActionSubject` (TextInput) Subject
  - `WFSendEmailActionInputAttachments` (TextInput) Message
  - `WFSendEmailActionSaveAsDraft` (Switch) Save as Draft
  - `WFSendEmailActionShowComposeSheet` (Switch) Show Compose Sheet default=true

## Send Message

- identifier: `is.workflow.actions.sendmessage`  ·  class `WFSendMessageAction`
- Sends a message. Pass images, videos, or other files as input to include attachments.
- summary: `Send ${WFSendMessageContent} to ${WFSendMessageActionRecipients}`
- input: WFContentItem
- keywords: message, sms, send, text
- InputPassthrough: True
- parameters:
  - `IntentAppDefinition` (IntentAppPicker) App default={"BundleIdentifier": "com.apple.MobileSMS"}
  - `ShowWhenRun` (Switch) Show Compose Sheet default=false
  - `WFSendMessageActionRecipients` (ContactHandleField) Recipients
  - `WFSendMessageContent` (TextInput) Message
  - `WFSendMessagePrefix` (TextInput) Prefix

## Send Payment

- identifier: `is.workflow.actions.venmo.pay`  ·  class `WFHandlePaymentIntentAction`
- Sends a payment to the specified people using a payment app on your device.
- summary: `Send ${WFVenmoActionAmount} to ${WFVenmoActionRecipients}`
- keywords: venmo, money, send, pay, request, cash, currency, dollars
- InputPassthrough: True
- parameters:
  - `IntentAppDefinition` (IntentAppPicker) App default={"BundleIdentifier": "com.apple.PassKit.PassKitIntentsExtension"}
  - `WFVenmoActionRecipients` (ContactHandleField) Recipients
  - `WFVenmoActionAmount` (CurrencyQuantityField) Amount
  - `WFVenmoActionAppSwitch` (Switch) Open in App default=false
  - `WFVenmoActionNote` (TextInput) Note

## Send via DeskConnect

- identifier: `is.workflow.actions.deskconnect.send`  ·  class `WFShareExtensionAction`
- Sends the input to another device via DeskConnect. DeskConnect makes it easy to send web pages, documents, pictures, and anything else between your devices.
- summary: `Send ${WFInput} via the missing link between your devices, DeskConnect 💔`
- input: WFURLContentItem, WFGenericFileContentItem (required)
- keywords: airdrop, push, desk, connect, device, mac, share
- InputPassthrough: True
- parameters:
  - `WFInput` (VariablePicker) Content

## Send via Messenger

- identifier: `is.workflow.actions.facebook.messenger.send`  ·  class `WFFBMessengerSendAction`
- Sends the input via Facebook Messenger
- input: WFImageContentItem, WFAVAssetContentItem, com.compuserve.gif (required)
- keywords: messenger, facebook, fb, send, text, gif, image, video
- InputPassthrough: True

## Set Accessibility Keyboard

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleAccessibilityKeyboardIntent`  ·  class `None`
- Enable or disable the Accessibility Keyboard, allowing typing by clicking on the screen.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set AirDrop Receiving

- identifier: `is.workflow.actions.setairdropreceiving`  ·  class `WFSetAirDropReceivingAction`
- summary: `Set AirDrop Receiving to ${WFAirDropState}`
- parameters:
  - `WFAirDropState` (AirDropVisibility) State

## Set Airplane Mode

- identifier: `is.workflow.actions.airplanemode.set`  ·  class `WFHandleCustomIntentAction`
- Sets the device’s Airplane Mode to on or off.
- keywords: airport, wi-fi, bluetooth, cellular, turn, toggle
- icon: airplane (Orange)
- InputPassthrough: True
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Alternate Pointer Actions

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleAlternatePointerActionsIntent`  ·  class `None`
- Enable or disable Alternate Pointer Actions, allowing the use of switches or gesture to trigger mouse actions such as clicks.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Always On

- identifier: `com.apple.NanoSettings.NPRFSetAlwaysOnIntent`  ·  class `None`
- Sets the Always On display setting of your Apple Watch to on or off.

When Always On is activated, your Apple Watch face will be visible even when your wrist is down.
- parameters:
  - `operation` () Operation choices=["set", "toggle"]
  - `state` () State choices=["off", "on"]

## Set Always On Display

- identifier: `is.workflow.actions.display.always-on.set`  ·  class `WFSetAlwaysOnDisplayAction`
- Sets the Always On Display setting of your iPhone to on or off.
- keywords: display, aod
- icon: iphone.always.on.display (Blue)
- InputPassthrough: True
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Announce Notifications

- identifier: `is.workflow.actions.announcenotifications.set`  ·  class `WFHandleCustomIntentAction`
- Sets Announce Notifications to on or off. When on, Siri will announce notifications from new apps that send Time Sensitive notifications or direct messages.
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Appearance

- identifier: `is.workflow.actions.appearance`  ·  class `WFSetAppearanceAction`
- Changes system appearance.
- keywords: style, mode, dark, appearance
- icon: appearance (Blue)
- ResidentCompatible: False
- parameters:
  - `operation` () Operation choices=["set", "toggle"]
  - `style` () Appearance choices=["dark", "light"]

## Set Appearance on Apple TV

- identifier: `com.apple.TVRemoteUIService.ToggleSystemAppearanceIntent`  ·  class `WFHandleCustomIntentAction`
- output: Set Appearance on Apple TV
- icon: appearance.darkmode (Black)

## Set Audio Descriptions

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleAudioDescriptionsIntent`  ·  class `None`
- Automatically play audio descriptions. Audio Descriptions can also be enabled under Accessibility in Settings.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Auto-Launch Audio Apps

- identifier: `com.apple.NanoSettings.NPRFSetAutoLaunchAudioAppsIntent`  ·  class `None`
- Sets the Auto-Launch Audio Apps setting of your Apple Watch to on or off.

When Auto-Launch Audio Apps is on, the app actively playing media will be shown when your Apple Watch wakes.
- parameters:
  - `operation` () Operation choices=["set", "toggle"]
  - `state` () state choices=["off", "on"]

## Set Background Sounds Timer Interval

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UASetBackgroundSoundsTimerIntent`  ·  class `None`
- Sets the timer interval for background sounds. Background sounds mask unwanted environmental noise and can be used when media is playing. Background sounds can also be enabled under Accessibility in Settings.
- parameters:
  - `interval` () Interval choices=["duration", "endInterval"]

## Set Background Sounds Volume

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UASetBackgroundSoundsVolumeIntent`  ·  class `None`
- Sets the volume for background sounds.

## Set Bluetooth

- identifier: `is.workflow.actions.bluetooth.set`  ·  class `WFHandleCustomIntentAction`
- Sets the device’s Bluetooth to on or off.
- keywords: wireless, accessories, accessory, turn
- icon: bluetooth (Blue)
- InputPassthrough: True
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Brightness

- identifier: `is.workflow.actions.setbrightness`  ·  class `WFHandleCustomIntentAction`
- Sets the device brightness.
- keywords: screen, display, backlight
- icon: sun.max.fill (Blue)
- InputPassthrough: True

## Set Cellular Data

- identifier: `is.workflow.actions.cellulardata.set`  ·  class `WFSetCellularDataAction`
- Sets the device’s Cellular Data to on or off.
- keywords: service, phone, airplane, turn
- icon: antenna.radiowaves.left.and.right (Green)
- InputPassthrough: True
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Classic Invert

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleClassicInvertIntent`  ·  class `None`
- Reverses the colors of the display. Classic Invert can also be enabled under Accessibility in Settings.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Closed Captions+SDH

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleCaptionsIntent`  ·  class `None`
- Use closed captions for the deaf and hard of hearing. Closed captions can also be enabled under Accessibility in Settings.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Color Filters

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleColorFiltersIntent`  ·  class `None`
- Enable or disable Color Filters, allowing the display's colors to be adjusted as desired.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Dictionary Value

- identifier: `is.workflow.actions.setvalueforkey`  ·  class `WFSetDictionaryValueAction`
- Sets a value in the dictionary passed into the action. 
- summary: `Set ${WFDictionaryKey} to ${WFDictionaryValue} in ${WFDictionary}`
- input: WFDictionaryContentItem (required)
- output: Dictionary WFDictionaryContentItem
- keywords: json, plist, xml, urlencoded, query, string, for, key, update, merge
- icon: book.closed.fill (Orange)
- InputPassthrough: False
- parameters:
  - `WFDictionaryKey` (TextInput) Key
  - `WFDictionaryValue` (TextInput) Value
  - `WFDictionary` (VariablePicker) Dictionary

## Set Flashlight

- identifier: `com.apple.NanoSettings.NPRFSetFlashLightIntent`  ·  class `None`
- Enables Flashlight.
- parameters:
  - `operation` () Operation choices=["set", "toggle"]
  - `state` () State choices=["off", "on"]

## Set Flashlight

- identifier: `is.workflow.actions.flashlight`  ·  class `WFHandleCustomIntentAction`
- Turns on or off the flashlight near the device's camera.
- summary variants:
  - `${operation} flashlight ${state}`
  - `${operation} flashlight ${state}`
  - `${operation} flashlight`
- keywords: flash, torch, turn
- icon: flashlight.on.fill (Blue)
- InputPassthrough: True
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Focus

- identifier: `is.workflow.actions.dnd.set`  ·  class `WFToggleDoNotDisturbAction`
- Sets the specified Focus on or off.
- summary variants:
  - `${Operation} ${FocusModes}`  when {"Operation": "Toggle"}
  - `${Operation} ${FocusModes} ${Enabled}`  when {"Operation": "Turn"}
  - `${Operation} ${FocusModes} ${Enabled} until ${AssertionType} ${Event}`  when {"AssertionType": "Event Ends", "Enabled": "1", "Operation": "Turn"}
  - `${Operation} ${FocusModes} ${Enabled} until ${AssertionType}`  when {"AssertionType": "I Leave", "Enabled": "1", "Operation": "Turn"}
  - `${Operation} ${FocusModes} ${Enabled} until ${AssertionType} ${Time}`  when {"AssertionType": "Time", "Enabled": "1", "Operation": "Turn"}
  - `${Operation} ${FocusModes} ${Enabled} until ${AssertionType}`  when {"AssertionType": "Turned Off", "Enabled": "1", "Operation": "Turn"}
- keywords: dnd, toggle, turn, do, not, disturb, silence
- icon: moon.fill (Indigo)
- InputPassthrough: True
- parameters:
  - `Operation` (Enumeration) Operation default="Turn" choices=["Turn", "Toggle"]
  - `Enabled` (Switch) State default=false
  - `AssertionType` (Enumeration) Until default="Turned Off" choices=["Turned Off", "Time", "I Leave", "Event Ends"]
  - `Event` (VariablePicker) Event — The event after which to turn off the Focus
  - `Time` (DateField) Time — The time after which to turn off the Focus
  - `FocusModes` (FocusModesPicker) Focus

## Set Full Keyboard Access

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleFullKeyboardAccessIntent`  ·  class `None`
- Enable or disable Full Keyboard Access, allowing use of the device with only a keyboard.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Head Pointer

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleHeadPointerIntent`  ·  class `None`
- Enable or disable Head Pointer, allowing movement of the mouse cursor using your head.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Hotspot Password

- identifier: `is.workflow.actions.personalhotspot.password.set`  ·  class `WFSetHotspotPasswordAction`
- Sets the Personal Hotspot password.
- summary: `Set Personal Hotspot password to ${WFInput}`
- input: WFStringContentItem (required)
- keywords: keychain
- icon: personalhotspot (Green)
- parameters:
  - `WFInput` (TextInput) Password

## Set Hover Text

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleHoverTextIntent`  ·  class `None`
- Enable or disable Hover Text.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Hover Typing

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleHoverTypingIntent`  ·  class `None`
- Enable or disable Hover Typing.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Increase Contrast

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleContrastIntent`  ·  class `None`
- Increase color contrast between app foreground and background colors. Increase Contrast can also be enabled under Accessibility in Settings.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Live Captions

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleLiveCaptionsIntent`  ·  class `None`
- Enable or disable Live Captions.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Live Speech

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleLiveSpeechIntent`  ·  class `None`
- Enable or disable Live Speech.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Low Power Mode

- identifier: `is.workflow.actions.lowpowermode.set`  ·  class `WFSetLowPowerModeAction`
- Sets the device’s Low Power Mode to on or off.
- keywords: battery, life, charge, turn
- icon: battery.50 (Orange)
- InputPassthrough: True
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Mono Audio

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleMonoAudioIntent`  ·  class `None`
- Mono Audio enables the left and right speakers to play the same content. Mono Audio can also be enabled under Accessibility in Settings.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Motion Cues

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleMotionCuesIntent`  ·  class `None`
- Enable or disable Motion Cues.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Mouse Keys

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleMouseKeysIntent`  ·  class `None`
- Enable or disable Mouse Keys, allowing the movement of the mouse cursor using the keyboard.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Name

- identifier: `is.workflow.actions.setitemname`  ·  class `WFSetItemNameAction`
- Sets the name of the item passed as input.
- summary: `Set name of ${WFInput} to ${WFName}`
- input: WFContentItem (required)
- output: Renamed Item WFContentItem
- keywords: title
- icon: character.cursor.ibeam (Gray)
- ResidentCompatible: True
- parameters:
  - `WFName` (TextInput) Name
  - `WFDontIncludeFileExtension` (Switch) Don’t Include File Extension — By default, Shortcuts will automatically include a file extension if one isn’t specified. Turn this on if you want to create a file with no extension.
  - `WFInput` (VariablePicker) Input

## Set Night Shift

- identifier: `is.workflow.actions.nightshift.set`  ·  class `WFHandleCustomIntentAction`
- Enables or disables Night Shift. When enabled, the colors of your display will be shifted to the warmer end of the color spectrum after dark. This may help you get a better night’s sleep.
- keywords: display, brightness, blue light
- icon: nightshift (Orange)
- InputPassthrough: True
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Noise Control Mode

- identifier: `is.workflow.actions.listeningmode.set`  ·  class `WFSetListeningModeAction`
- Sets a Noise Control mode on your selected device
- summary variants:
  - `Set Noise Control mode on ${WFRoute}`
  - `Set Noise Control mode on ${WFRoute} to ${WFListeningMode}`
- keywords: device, airpods, noise, control, cancellation, focus, presence, aripods
- icon: person.open.fill (Red)
- parameters:
  - `WFRoute` (MediaRoutePicker) Device
  - `WFListeningMode` (ListeningModePicker) Noise Control Mode

## Set Orientation Lock

- identifier: `is.workflow.actions.orientationlock.set`  ·  class `WFSetOrientationLockAction`
- Turns on or off orientation lock on your device.
- keywords: rotation, rotate
- icon: lock.rotation (Red)
- InputPassthrough: True
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Parked Car

- identifier: `is.workflow.actions.setparkedcar`  ·  class `WFSetParkedCarAction`
- Saves details of your Parked Car in the Maps app.
- result: The location of the car and its associated details, if any.
- summary: `Set Parked Car at ${WFLocation}`
- input: CLLocation, MKMapItem (required)
- output: Parked Car WFParkedCarContentItem
- keywords: carplay, parking, save, record
- icon: car.fill (Tint)
- parameters:
  - `WFLocation` (Location) Location — The location of the car.
  - `WFSetParkedCarNotes` (TextInput) Notes — Optional text that will be stored along with your parked car.
  - `WFImage` (VariablePicker) Image — An optional image of the location where you parked the car.

## Set Personal Hotspot

- identifier: `is.workflow.actions.personalhotspot.set`  ·  class `WFHandleCustomIntentAction`
- Sets the device’s Personal Hotspot to on or off.
- note: When turning Personal Hotspot on, this action will make the hotspot discoverable for only a short period of time, in order to preserve battery life.
- keywords: wireless, accessories, accessory, turn, tethering, cellular, internet, sharing, data, 3g, 4g, 5g
- icon: personalhotspot (Green)
- InputPassthrough: True
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Reduce Motion

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleReduceMotionIntent`  ·  class `None`
- Reduce the motion of the user interface, including the parallax effect of icons. Reduce Motion can also be enabled under Accessibility in Settings.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Reduce Transparency

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleTransparencyIntent`  ·  class `None`
- Improve contrast by reducing transparency and blurs on some backgrounds to increase legibility. Reduce Transparency can also be enabled under Accessibility in Settings.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Schooltime

- identifier: `com.apple.NanoSettings.NPRFSetSchoolTimeIntent`  ·  class `None`
- Sets Schooltime on your Apple Watch to on or off.

Schooltime limits Apple Watch features during school hours.
- parameters:
  - `operation` () Operation choices=["set", "toggle"]
  - `state` () State choices=["off", "on"]

## Set Silence Unknown Callers

- identifier: `is.workflow.actions.silenceunknowncallers.set`  ·  class `WFHandleCustomIntentAction`
- Sets Silence Unknown Callers to on or off. When on, calls from unknown numbers will be silenced and sent to voicemail. Calls will still be displayed on the Recents list. Incoming calls will continue to ring from people in your contacts, recent outgoing calls, and Siri Suggestions.
- keywords: phone, spam, scam
- icon: phone.arrow.down.left.fill (Green)
- InputPassthrough: True
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Silent Mode

- identifier: `com.apple.NanoSettings.NPRFSetSilentModeIntent`  ·  class `None`
- Sets Silent Mode on your Apple Watch to on or off.

Silent Mode mutes most Apple Watch sounds.
- parameters:
  - `operation` () Operation choices=["set", "toggle"]
  - `state` () State choices=["off", "on"]

## Set Slow Keys

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleSlowKeysIntent`  ·  class `None`
- Enable or disable Slow Keys, allowing the keyboard to avoid recognizing rapid key presses.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Smart Invert

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleSmartInvertIntent`  ·  class `None`
- Reverses the colors of the display except for images, media and some apps that use dark color styles. Smart Invert can also be enabled under Accessibility in Settings.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Stage Manager

- identifier: `is.workflow.actions.stagemanager.set`  ·  class `WFHandleCustomIntentAction`
- Enables or disables Stage Manager on the device.
- keywords: window, set
- icon: squares.leading.rectangle (Blue)
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Sticky Keys

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleStickyKeysIntent`  ·  class `None`
- Enable or disable Sticky Keys, making it easier to press keyboard modifier keys.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Switch Control

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleSwitchControlIntent`  ·  class `None`
- Switch Control highlights items on the screen to control through an adaptive accessory. Switch Control can also be enabled under Accessibility in Settings.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Theater Mode

- identifier: `com.apple.NanoSettings.NPRFSetTheaterModeIntent`  ·  class `None`
- Sets Theater Mode on your Apple Watch to on or off.

Theater Mode mutes most Apple Watch sounds and limits display activity.
- parameters:
  - `operation` () Operation choices=["set", "toggle"]
  - `state` () State choices=["off", "on"]

## Set True Tone

- identifier: `is.workflow.actions.truetone.set`  ·  class `WFHandleCustomIntentAction`
- Enables or disables True Tone. When enabled, your device display will automatically adapt based on ambient lighting conditions to make colors appear consistent in different environments.
- keywords: display, brightness
- icon: truetone (Blue)
- InputPassthrough: True
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Variable

- identifier: `is.workflow.actions.setvariable`  ·  class `WFSetVariableAction`
- Sets the value of the specified variable to the input of this action.
- summary: `Set variable ${WFVariableName} to ${WFInput}`
- input: WFContentItem (required)
- keywords: programming, scripting, var
- ResidentCompatible: True
- InputPassthrough: True
- parameters:
  - `WFInput` (VariablePicker) Input
  - `WFVariableName` (VariableField) Variable

## Set Voice Control

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleVoiceControlIntent`  ·  class `None`
- Voice Control allows you to use your voice to control your iOS device. Voice Control can also be enabled under Accessibility in Settings.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set VoiceOver

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleVoiceOverIntent`  ·  class `None`
- VoiceOver speaks items on the screen. VoiceOver can also be enabled under Accessibility in Settings.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Set Volume

- identifier: `is.workflow.actions.setvolume`  ·  class `WFSetVolumeAction`
- Sets the volume of the device.
- summary variants:
  - `Set volume to ${WFVolume}`
  - `Set ${WFVolumeSetting} volume to ${WFVolume}`
- keywords: sound, speaker, loud, ringtone, alert
- icon: speaker.wave.2.fill (Red)
- InputPassthrough: True
- parameters:
  - `WFVolumeSetting` (Enumeration) Volume Setting default="Media" choices=["Media", "Ringtone", "Alarms & Timers", "Alerts & System Sounds"] — The volume setting to change: Media, Ringtone, Alarms & Timers, or Alerts & System Sounds.
  - `WFVolume` (Slider) Volume default=0.5 — If you set the volume using a variable, use a number between 0 and 1 (for example, pass 0.5 for half volume).

## Set VPN

- identifier: `is.workflow.actions.vpn.set`  ·  class `WFSetVPNAction`
- Connects, disconnects or changes the On Demand setting for one or more VPN Configurations on this device.
- note: VPN Configurations can be set up in the Settings app. On macOS, you must authenticate as an administrator to change the On Demand setting for a VPN Configuration.
- summary variants:
  - `${WFVPNOperation} to ${WFVPN}`  when {"WFVPNOperation": "Connect"}
  - `${WFVPNOperation} from ${WFVPN}`  when {"WFVPNOperation": "Disconnect"}
  - `${WFVPNOperation} to ${WFOnDemandValue} for ${WFVPN}`  when {"WFVPNOperation": "Set On Demand"}
  - `${WFVPNOperation} for ${WFVPN}`  when {"WFVPNOperation": "Toggle On Demand"}
  - `${WFVPNOperation} ${WFVPN}`  when {"WFVPNOperation": "Toggle"}
- input: WFVPNContentItem (required)
- keywords: virtual, private, network, secure, connect, tunnel
- icon: network.connected.to.line.below.fill (Blue)
- InputPassthrough: True
- parameters:
  - `WFVPNOperation` (Enumeration) Operation default="Connect" choices=["Connect", "Disconnect", "Toggle", "Set On Demand", "Toggle On Demand"]
  - `WFOnDemandValue` (Switch) Set On Demand To default=true
  - `WFVPN` (VPNPicker) VPN — The VPNs that will be configured by running this action.

## Set Wake on Wrist Raise

- identifier: `com.apple.NanoSettings.NPRFSetWakeOnWristRaiseIntent`  ·  class `None`
- Sets the Wake on Wrist Raise setting of your Apple Watch to on or off.

When Wake on Wrist Raise is on, the screen will wake when you raise your wrist.
- parameters:
  - `operation` () Operation choices=["set", "toggle"]
  - `state` () state choices=["off", "on"]

## Set Wallpaper Photo

- identifier: `is.workflow.actions.wallpaper.set`  ·  class `WFSetWallpaperAction`
- Sets the wallpaper to the specified image.
- summary variants:
  - `Set wallpaper to ${WFInput}`
  - `Set ${WFWallpaperLocation} wallpaper to ${WFInput}`
  - `Set ${WFSelectedPoster} to ${WFInput} for ${WFWallpaperLocation}`
- input: WFImageContentItem, WFPhotoMediaContentItem (required)
- output: Wallpaper WFPosterRepresentation
- keywords: set, wallpaper, current, photo, lock, home, screen
- parameters:
  - `WFInput` (VariablePicker) Image
  - `WFWallpaperLocation` (Enumeration) Wallpaper Location default=["Lock Screen", "Home Screen"] choices=["Lock Screen", "Home Screen"]
  - `WFWallpaperShowPreview` (Switch) Show Preview default=true
  - `WFWallpaperPerspectiveZoom` (Switch) Perspective Zoom default=false
  - `WFSelectedPoster` (PosterPicker) Wallpaper
  - `WFWallpaperSmartCrop` (Switch) Crop to Subject default=true
  - `WFWallpaperLegibilityBlur` (Switch) Legibility Blur default=true

## Set Water Lock

- identifier: `com.apple.NanoSettings.NPRFSetWaterLockIntent`  ·  class `None`
- Sets the Water Lock setting on your Apple Watch to on or off.

Water Lock protects against accidental input when you use your Apple Watch in water.
- parameters:
  - `operation` () Operation choices=["set", "toggle"]
  - `state` () State choices=["off", "on"]

## Set Wi-Fi

- identifier: `is.workflow.actions.wifi.set`  ·  class `WFSetWiFiAction`
- Sets the device’s Wi-Fi to on or off.
- keywords: airport, wifi, wi-fi, wireless, internet, network, wlan, turn
- icon: wifi (Blue)
- InputPassthrough: True
- parameters:
  - `operation` () Operation choices=["set", "toggle"]

## Set Zoom

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleZoomIntent`  ·  class `None`
- Zoom magnifies the entire screen. Zoom can also be enabled under Accessibility in Settings.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Share

- identifier: `is.workflow.actions.share`  ·  class `WFShareAction`
- Prompts to share the specified content.
- summary: `Share ${WFInput}`
- input: WFContentItem (required)
- keywords: share, file, document, send
- icon: square.and.arrow.up (Tint)
- InputPassthrough: True
- parameters:
  - `WFInput` (VariablePicker) Content

## Share with Apps

- identifier: `is.workflow.actions.runextension`  ·  class `WFShareAction`
- Prompts to share the specified content using action extensions and sharing extensions provided by other apps.
- summary: `Share ${WFInput} with ${WFApp}`
- input: WFContentItem (required)
- keywords: action, extension, sharing, share, app, inter
- icon: square.and.arrow.up (Tint)
- InputPassthrough: True
- parameters:
  - `WFInput` (VariablePicker) Content
  - `WFApp` (AppPicker) App

## Shazam It

- identifier: `is.workflow.actions.shazamMedia`  ·  class `WFShazamMediaAction`
- Uses the microphone to listen to and identify nearby media.
- summary: `Shazam it`
- output: Shazam Media WFShazamMedia
- keywords: song, identification, shazam, music
- InputPassthrough: False
- parameters:
  - `WFShazamMediaActionShowWhenRun` (Switch) Show When Run default=true
  - `WFShazamMediaActionErrorIfNotRecognized` (Switch) Error If Not Recognized default=true

## Show Alert

- identifier: `is.workflow.actions.alert`  ·  class `WFAlertAction`
- Displays an alert with a title, a message, and two buttons. If the user selects the OK button, the shortcut continues. The cancel button stops the shortcut.
- summary: `Show alert ${WFAlertActionMessage}`
- keywords: message, ask, display, prompt, show, confirmation
- icon: macwindow (Yellow_Accessibility)
- InputPassthrough: True
- parameters:
  - `WFAlertActionTitle` (TextInput) Title
  - `WFAlertActionMessage` (TextInput) Message default="Do you want to continue?"
  - `WFAlertActionCancelButtonShown` (Switch) Show Cancel Button default=true

## Show Content

- identifier: `is.workflow.actions.showresult`  ·  class `WFShowResultAction`
- Shows a preview of the provided content. If run from Siri, speaks the provided text.
- summary: `Show ${Text}`
- input: WFStringContentItem, WFImageContentItem, WFGenericFileContentItem, WFAVAssetContentItem, WFPhotoMediaContentItem, WFLocationContentItem (required)
- keywords: text, result, string, display, alert, present, reveal, notification, image, output
- icon: rectangle.and.text.magnifyingglass (Yellow_Accessibility)
- InputPassthrough: True
- parameters:
  - `Text` (TextInput) Content default=""

## Show Content Attribution

- identifier: `is.workflow.actions.debug.contentattribution`  ·  class `WFContentAttributionSetDebuggerAction`
- Shows the Content Source of Input contents
- summary: `Show Content Attribution of ${Input}`
- input: WFContentItem (required)
- keywords: mdm, content source, data info
- icon: point.3.filled.connected.trianglepath.dotted (Yellow_Accessibility)
- InputPassthrough: True
- parameters:
  - `Input` (VariablePicker) Input

## Show Content Graph

- identifier: `is.workflow.actions.viewresult`  ·  class `WFViewContentGraphAction`
- Shows the results of the previous action in the Content Graph.
- summary: `Show Content Graph of ${WFInput}`
- input: WFContentItem (required)
- icon: point.3.filled.connected.trianglepath.dotted (Yellow_Accessibility)
- InputPassthrough: True
- parameters:
  - `WFInput` (VariablePicker) Input

## Show Definition

- identifier: `is.workflow.actions.showdefinition`  ·  class `WFShowDefinitionAction`
- Shows the definition of the word passed into the action.
- summary: `Show definition of ${Word}`
- input: NSString (required)
- keywords: define, word, dictionary, lookup, term
- icon: textformat (Pink)
- InputPassthrough: True
- parameters:
  - `Word` (TextInput) Word

## Show in iTunes Store

- identifier: `is.workflow.actions.showinstore`  ·  class `WFShowInStoreAction`
- Shows the iTunes products or App Store apps passed as input in a store sheet. This is useful with the Find iTunes Store Items and Find App Store Apps actions.
- summary: `Show ${WFProduct} in iTunes Store`
- input: WFiTunesProductContentItem, WFAppStoreAppContentItem (required)
- keywords: app, song, music, movie, ebook, audiobook, tv, album, store
- InputPassthrough: True
- parameters:
  - `WFProduct` (VariablePicker) Product

## Show Notes Folder

- identifier: `com.apple.Notes.ICNotesFolderIntent`  ·  class `None`
- Get quick access to one of your Notes folders.

## Show Notification

- identifier: `is.workflow.actions.notification`  ·  class `WFNotificationAction`
- Displays a local notification.
- input: An image or video to include in the notification
- summary: `Show notification ${WFNotificationActionBody}`
- input: WFStringContentItem
- keywords: local, notification, show, send, alert, reminder, push
- icon: bell.badge.fill (Red)
- InputPassthrough: True
- parameters:
  - `WFNotificationActionTitle` (TextInput) Title
  - `WFNotificationActionBody` (TextInput) Body
  - `WFNotificationActionSound` (Switch) Play Sound default=true
  - `WFInput` (VariablePicker) Attachment

## Show Quick Reminder

- identifier: `is.workflow.actions.addquickreminder`  ·  class `WFAddQuickReminderAction`
- Opens the Quick Reminder view.
- output: Show Quick Reminder
- InputPassthrough: False

## Show Today Feed

- identifier: `com.apple.news.TodayIntent`  ·  class `None`
- Shows stories from the Today feed in Apple News.

## Show Topic

- identifier: `com.apple.news.TagIntent`  ·  class `None`
- Shows stories about the topic you choose.

## Show Weather

- identifier: `com.apple.weather.WeatherIntent`  ·  class `None`
- Shows and gets the current weather for the specified location.

## Show Web View

- identifier: `is.workflow.actions.showwebpage`  ·  class `WFShowWebPageAction`
- Shows the web URL passed into the action in a Safari View Controller, allowing you to view the web page without switching apps.
- summary: `Show web view at ${WFURL}`
- input: WFURLContentItem, WFRichTextContentItem (required)
- keywords: safari, view, controller, open, website, preview, quick look
- InputPassthrough: True
- parameters:
  - `WFEnterSafariReader` (Switch) Enter Safari Reader default=false — Enter Safari Reader mode if it’s available for the given web page.
  - `WFURL` (TextInput) URL

## Shut Down

- identifier: `is.workflow.actions.reboot`  ·  class `WFShutDownDeviceAction`
- Shuts down or restarts your device.
- summary variants:
  - `${WFShutdownMode} this device`  when {"WFShutdownMode": "Restart"}
  - `${WFShutdownMode} this device`  when {"WFShutdownMode": "Shut Down"}
- keywords: reboot, restart, turn, off, halt, power, down
- icon: power (Gray)
- parameters:
  - `WFShutdownMode` (Enumeration) Mode default="Shut Down" choices=["Shut Down", "Restart"]

## Skip Back

- identifier: `is.workflow.actions.skipback`  ·  class `WFSkipSongAction`
- Skips to the previous song in the current music queue.
- summary: `Skip back to the ${WFSkipBackBehavior} on ${WFMediaRoute}`
- keywords: ipod, track, music, itunes, previous
- icon: backward.fill (Red)
- InputPassthrough: True
- parameters:
  - `WFSkipBackBehavior` (Enumeration) Skip To default="Beginning" choices=["Beginning", "Previous Song"]
  - `WFMediaRoute` (MediaRoutePicker) Device default="Local"

## Skip Forward

- identifier: `is.workflow.actions.skipforward`  ·  class `WFSkipSongAction`
- Skips to the next song in the current music queue.
- summary: `Skip forward on ${WFMediaRoute}`
- keywords: ipod, track, music, itunes, next
- icon: forward.fill (Red)
- InputPassthrough: True
- parameters:
  - `WFMediaRoute` (MediaRoutePicker) Device default="Local"

## Sleep

- identifier: `is.workflow.actions.sleep`  ·  class `WFSleepDeviceAction`
- Put this Mac to sleep.
- summary: `Put this Mac to sleep`
- keywords: standby
- icon: sleep (Gray)

## Speak Text

- identifier: `is.workflow.actions.speaktext`  ·  class `WFSpeakTextAction`
- Speaks the inputted text aloud.
- summary: `Speak ${WFText}`
- input: NSString (required)
- keywords: speak, dictate, text, say, speech, talk, out, loud
- icon: speaker.wave.3.fill (Red)
- InputPassthrough: True
- parameters:
  - `WFSpeakTextWait` (Switch) Wait Until Finished default=true
  - `WFSpeakTextRate` (Slider) Rate default=0.5
  - `WFSpeakTextPitch` (Slider) Pitch default=1
  - `WFSpeakTextLanguage` (SpeakTextLanguagePicker) Language default="Default"
  - `WFSpeakTextVoice` (SpeakTextVoicePicker) Voice default="Default"
  - `WFText` (TextInput) Text

## Split PDF Into Pages

- identifier: `is.workflow.actions.splitpdf`  ·  class `WFSplitPDFAction`
- Splits the input document by creating a PDF for each page.
- summary: `Split PDF ${WFInput} into pages`
- input: WFPDFContentItem (required)
- output: PDF Pages WFPDFContentItem
- keywords: split, generate, pdf, Documents, break
- icon: doc.on.doc.fill (Tint)
- InputPassthrough: False
- parameters:
  - `WFInput` (FilePicker) PDF

## Split Screen Apps

- identifier: `is.workflow.actions.splitscreen`  ·  class `WFSplitScreenAppAction`
- Open the specified apps in split screen mode.
- summary: `Split screen between ${WFPrimaryAppIdentifier} and ${WFSecondaryAppIdentifier}`
- keywords: split, tile, window, open
- icon: square.split.2x1.fill (Indigo)
- InputPassthrough: True
- parameters:
  - `WFPrimaryAppIdentifier` (AppPicker) App
  - `WFSecondaryAppIdentifier` (AppPicker) App
  - `WFAppRatio` (Enumeration) Ratio default="\u00bd + \u00bd" choices=["\u00bd + \u00bd", "\u2154 + \u2153"]

## Split Text

- identifier: `is.workflow.actions.text.split`  ·  class `WFTextComponentsAction`
- Separates text passed into the action into a list.
- output: Split Text
- keywords: separate, delimiter
- ResidentCompatible: True
- parameters:
  - `WFTextSeparator` () Separator choices=["Custom", "Every Character", "New Lines", "Spaces"]

## Start Screen Saver

- identifier: `is.workflow.actions.startscreensaver`  ·  class `WFStartScreenSaverAction`
- Starts the screen saver selected in the Desktop & Screen Saver preference pane.
- summary: `Start screen saver`
- keywords: desktop, screensaver, flurry
- icon: moon.and.stars.artframe (Cyan)

## Start Timer

- identifier: `is.workflow.actions.timer.start`  ·  class `WFStartTimerAction`
- Starts a timer in the Clock app for the specified amount of time.
- summary: `Start timer for ${WFDuration}`
- output: Start Timer
- keywords: timer, set, clock, watch
- InputPassthrough: True
- parameters:
  - `IntentAppDefinition` (IntentAppPicker) App default={"BundleIdentifier": "com.apple.mobiletimer-framework.MobileTimerIntents"}
  - `WFDuration` (DurationQuantityField) Duration

## Start Workout

- identifier: `is.workflow.actions.workout.start`  ·  class `WFStartWorkoutIntentAction`
- Starts a workout on your Apple Watch.
- summary variants:
  - `Start ${workoutName} for ${isOpenEnded} ${WorkoutGoal}`  when {"isOpenEnded": "0"}
  - `Start ${workoutName} with ${isOpenEnded}`  when {"isOpenEnded": "1"}
- keywords: watch, fitness
- InputPassthrough: True
- parameters:
  - `IntentAppDefinition` (IntentAppPicker) App default={"BundleIdentifier": "com.apple.SessionTrackerApp"}
  - `workoutName` (FitnessWorkoutTypePicker) Type
  - `isOpenEnded` (Switch) Open Goal default=true
  - `WorkoutGoal` (WorkoutGoalQuantityField) Value default="15"

## Stop and Output

- identifier: `is.workflow.actions.output`  ·  class `WFOutputAction`
- Stops execution of the current shortcut, and outputs content. This action is useful when:\n• Running a shortcut from another shortcut (using the Run Shortcut action). The output will be used as the output of the Run Shortcut action.\n• Running a shortcut from Quick Actions in Finder on macOS. The output will be saved as a file alongside the files selected in Finder.\n• Running a shortcut from Services on macOS. The output will replace the selected text, if applicable.\n• Or, when running a shortcut from another location that supports output, like the command-line or the Shortcuts URL scheme.\n\nNo more actions will be run after this action.
- summary: `Stop and output ${WFOutput}`
- input: WFContentItem
- keywords: quit, return, workflow
- icon: rectangle.portrait.and.arrow.right (Blue)
- ResidentCompatible: True
- parameters:
  - `WFOutput` (TextInput) Result default=""
  - `WFNoOutputSurfaceBehavior` (Enumeration) If there’s nowhere to output default="Do Nothing" choices=["Respond", "Do Nothing", "Copy to Clipboard"]
  - `WFResponse` (TextInput) Result default=""

## Stop This Shortcut

- identifier: `is.workflow.actions.exit`  ·  class `WFExitAction`
- Stops execution of the current shortcut and dismisses the shortcut on screen. No more actions will be run after this action.
- summary: `Stop this shortcut`
- input: WFContentItem
- keywords: quit, return, workflow
- icon: stop.fill (Gray)
- ResidentCompatible: True

## Store Content

- identifier: `is.workflow.actions.setstoredcontent`  ·  class `WFSetStoredContentAction`
- Stores the content that is passed in and its specified name. This content is persisted between shortcut runs, allowing you to retrieve it later.
- summary: `Store ${WFInput} as ${WFStoredContentKey}`
- input: WFContentItem (required)
- output: Stored Content WFContentItem
- keywords: save, set, update, write, stored, value, data, database, user, defaults, storage, file, global
- icon: cylinder.split.1x2.fill (Cyan)
- ResidentCompatible: True
- InputPassthrough: True
- parameters:
  - `WFInput` (TextInput) Content
  - `WFStoredContentKey` (StoredValueVariableField) Name
  - `WFStoredContentGlobalValue` (Switch) Global Value default=false — When enabled, any shortcut on your device can access and update this stored value. Otherwise, the value is only accessible within this shortcut.

## Street Address

- identifier: `is.workflow.actions.address`  ·  class `WFAddressAction`
- Passes the specified address to the next action.
- output: Street Address WFStreetAddress
- keywords: maps, search, query, place, location, find
- icon: mappin (Tint)
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFAddressLine1` (TextInput) Line 1
  - `WFAddressLine2` (TextInput) Line 2
  - `WFCity` (TextInput) City
  - `WFState` (TextInput) State
  - `WFPostalCode` (TextInput) Postal Code
  - `WFCountry` (CountryField) Region

## Switch Between Wallpapers

- identifier: `is.workflow.actions.posters.switch`  ·  class `WFSwitchPosterAction`
- Switches the current Lock Screen wallpaper.
- note: If the wallpaper has a linked Focus, this action will set the Focus, too.
- summary: `Switch to ${WFPoster}`
- input: WFPosterRepresentation (required)
- keywords: photo, lock, home, screen
- parameters:
  - `WFPoster` (PosterPicker) Wallpaper

## Take Photo

- identifier: `is.workflow.actions.takephoto`  ·  class `WFTakePhotoAction`
- Uses the camera to take photos.
- result: Photo from the camera.
- summary variants:
  - `Take photo`
  - `Take photo with ${WFCameraCaptureDevice} camera`
  - `Take ${WFPhotoCount}`  when {"WFCameraCaptureShowPreview": "1"}
  - `Take ${WFPhotoCount} with ${WFCameraCaptureDevice} camera`  when {"WFCameraCaptureShowPreview": "1"}
- output: Photo WFImage
- keywords: camera, take, photo
- InputPassthrough: False
- parameters:
  - `WFCameraCaptureShowPreview` (Switch) Show Camera Preview default=true
  - `WFPhotoCount` (Stepper) default=1
  - `WFCameraCaptureDevice` (Enumeration) Camera default="Back" choices=["Front", "Back"]

## Take Screenshot

- identifier: `is.workflow.actions.takescreenshot`  ·  class `WFTakeScreenshotAction`
- Take a screenshot of the device’s screen.
- result: Image from the device’s screen.
- output: Screenshot WFImage
- keywords: capture, take, screen
- icon: camera.viewfinder (Gray)
- parameters:
  - `WFTakeScreenshotScreenshotType` (Enumeration) Type default="Full Screen" choices=["Full Screen", "Interactive"]
  - `WFTakeScreenshotActionInteractiveSelectionType` (Enumeration) Selection default="Window" choices=["Window", "Custom"]
  - `WFTakeScreenshotMainMonitorOnly` (Switch) Capture Main Display Only default=false
  - `WFTakeScreenshotIgnoreContextualAssistanceLayers` (Switch) Ignore Contextual Assistance Layers default=false

## Take Video

- identifier: `is.workflow.actions.takevideo`  ·  class `WFTakeVideoAction`
- Uses the camera to take a video clip.
- result: Video from the camera.
- summary variants:
  - `Take video`
  - `Take video with ${WFCameraCaptureDevice} camera`  when {"WFCameraCaptureDevice": "Front"}
  - `Take video with ${WFCameraCaptureDevice} camera`  when {"WFCameraCaptureDevice": "Back"}
- output: Video com.apple.quicktime-movie
- keywords: camera, clip, record
- InputPassthrough: False
- parameters:
  - `WFCameraCaptureDevice` (Enumeration) Camera default="Back" choices=["Front", "Back"]
  - `WFCameraCaptureQuality` (Enumeration) Quality default="High" choices=["Low", "Medium", "High"]
  - `WFRecordingStart` (Enumeration) Start Recording default="Immediately" choices=["On Tap", "Immediately"]

## Text

- identifier: `is.workflow.actions.gettext`  ·  class `WFTextAction`
- Passes the specified text to the next action.
- output: Text NSString
- keywords: text, such text, very speech, much words, so wow, string
- ResidentCompatible: True
- parameters:
  - `WFTextActionText` (TextInput) Text default=""

## Toggle Background Sounds

- identifier: `com.apple.UniversalAccess.UASettingsShortcuts.UAToggleBackgroundSoundsIntent`  ·  class `None`
- Enable or disable Background Sounds.
- parameters:
  - `operation` () Operation choices=["toggle", "turn"]

## Translate Text

- identifier: `is.workflow.actions.text.translate`  ·  class `WFTranslateTextAction`
- Translates the text passed into the action into another language.
- summary: `Translate ${WFInputText} from ${WFSelectedFromLanguage} to ${WFSelectedLanguage}`
- input: NSString (required)
- output: Translated Text NSString
- keywords: translation, language
- ResidentCompatible: False
- InputPassthrough: False
- parameters:
  - `WFSelectedFromLanguage` (TranslateTextLanguagePicker) Language
  - `WFSelectedLanguage` (TranslateTextLanguagePicker) To
  - `WFInputText` (TextInput) Text

## Trim Media

- identifier: `is.workflow.actions.trimvideo`  ·  class `WFTrimVideoAction`
- Presents a view allowing you to trim the media passed into the action.
- input: The audio or video file to edit.
- result: The trimmed media.
- summary: `Trim ${WFInputMedia}`
- input: WFAVAssetContentItem (required)
- output: Trimmed Media com.apple.quicktime-movie
- keywords: clip, editor, audio, video, movie
- icon: timeline.selection (Cyan)
- parameters:
  - `WFInputMedia` (VariablePicker) Media

## Trim Whitespace

- identifier: `is.workflow.actions.text.trimwhitespace`  ·  class `WFTrimWhitespaceAction`
- Removes whitespace and newlines from both ends of the text passed into the action.
- summary: `Trim whitespace from ${WFInput}`
- input: NSString (required)
- output: Updated Text NSString
- keywords: whitespace, trim, regex, newline, format
- ResidentCompatible: True
- InputPassthrough: False
- parameters:
  - `WFInput` (TextInput) Text

## Tweet

- identifier: `is.workflow.actions.tweet`  ·  class `WFSocialAction`
- Tweets the input.
- input: Content to tweet.
- summary: `Tweet ${TweetInput}`
- input: WFImageContentItem, WFURLContentItem, WFStringContentItem (required)
- output: Tweet
- keywords: twitter, tweet, social, media, sharing, share
- parameters:
  - `TweetInput` (TextInput) Tweet

## Unknown Action

- identifier: `com.apple.TVRemoteUIService.LaunchApplicationIntent`  ·  class `WFHandleCustomIntentAction`
- output: Unknown Action

## Unknown Action

- identifier: `com.apple.TVRemoteUIService.LaunchRemoteIntent`  ·  class `WFHandleCustomIntentAction`
- output: Unknown Action
- icon: appletvremote.gen4.fill (Black)

## Unknown Action

- identifier: `com.apple.TVRemoteUIService.LaunchScreenSaverIntent`  ·  class `WFHandleCustomIntentAction`
- output: Unknown Action
- icon: tv.fill (Black)

## Unknown Action

- identifier: `com.apple.TVRemoteUIService.PauseContentIntent`  ·  class `WFHandleCustomIntentAction`
- output: Unknown Action
- icon: playpause.fill (Black)

## Unknown Action

- identifier: `com.apple.TVRemoteUIService.ReduceLoudSoundsIntent`  ·  class `WFHandleCustomIntentAction`
- output: Unknown Action
- icon: ear.trianglebadge.exclamationmark (Black)

## Unknown Action

- identifier: `com.apple.TVRemoteUIService.SkipContentIntent`  ·  class `WFHandleCustomIntentAction`
- output: Unknown Action
- icon: forward.fill (Black)

## Unknown Action

- identifier: `com.apple.TVRemoteUIService.SleepAppleTVIntent`  ·  class `WFHandleCustomIntentAction`
- output: Unknown Action
- icon: sleep (Black)

## Unknown Action

- identifier: `com.apple.TVRemoteUIService.SwitchUserAccountIntent`  ·  class `WFHandleCustomIntentAction`
- output: Unknown Action
- icon: person.crop.circle (Black)

## Unknown Action

- identifier: `com.apple.TVRemoteUIService.ToggleCaptionsIntent`  ·  class `WFHandleCustomIntentAction`
- output: Unknown Action
- icon: captions.bubble.fill (Black)

## Unknown Action

- identifier: `com.apple.TVRemoteUIService.WakeAppleTVIntent`  ·  class `WFHandleCustomIntentAction`
- output: Unknown Action
- icon: power (Black)

## Unknown Intent

- identifier: `is.workflow.actions.sirikit.donation.handle`  ·  class `WFHandleDonatedIntentAction`
- InputPassthrough: True
- parameters:
  - `ShowWhenRun` (Switch) Show When Run default=true

## Unknown User Activity

- identifier: `is.workflow.actions.useractivity.open`  ·  class `WFOpenUserActivityAction`
- InputPassthrough: True

## Upload to CloudApp

- identifier: `is.workflow.actions.cloudapp.upload`  ·  class `WFCloudAppUploadAction`
- Uploads the input to CloudApp and returns the CloudApp URL.
- result: CloudApp URL
- summary: `Upload ${WFInput}`
- input: WFGenericFileContentItem, WFURLContentItem (required)
- output: CloudApp URLs NSURL
- parameters:
  - `WFCloudAppPrivacyType` (Enumeration) Link Privacy default="Private" choices=["Private", "Public"]
  - `WFInput` (VariablePicker) Content

## Upload to Imgur

- identifier: `is.workflow.actions.imgur.upload`  ·  class `WFImgurUploadAction`
- Uploads the input to Imgur.
- note: Powered by Imgur (imgur.com)
- summary: `Upload ${WFInput}`
- input: WFImageContentItem (required)
- output: Imgur URLs NSURL
- keywords: image, reddit, album, photo
- parameters:
  - `WFInput` (VariablePicker) Images
  - `WFImgurAnonymous` (Switch) Upload Anonymously default=true
  - `WFImgurDirectLink` (Switch) Direct Link — If enabled, the action will return a link to the image, and not its Imgur page.
  - `WFImgurAlbum` (Switch) Create Album default=false — If enabled, the input images will be grouped into an album. Otherwise, the individual links will be returned.
  - `WFImgurAlbumLayout` (Enumeration) Album Layout default="Blog" choices=["Blog", "Grid", "Horizontal", "Vertical"]
  - `WFImgurAlbumPrivacy` (Enumeration) Album Privacy default="Hidden" choices=["Public", "Hidden", "Secret"]
  - `WFImgurTitle` (TextInput) Title
  - `WFImgurDescription` (TextInput) Description

## URL

- identifier: `is.workflow.actions.url`  ·  class `WFURLAction`
- Passes the specified URL to the next action.
- summary: `${WFURLActionURL}`
- output: URL NSURL
- keywords: text, such text, very speech, much words, so wow
- icon: link (Tint)
- ResidentCompatible: True
- parameters:
  - `WFURLActionURL` (URL) URL

## URL Encode

- identifier: `is.workflow.actions.urlencode`  ·  class `WFURLEncodeAction`
- Encodes or decodes text passed into the action to be suitable for inclusion in a URL by adding or removing percent escapes when appropriate.
- summary: `URL ${WFEncodeMode} ${WFInput}`
- input: WFStringContentItem (required)
- output: URL Encoded Text WFStringContentItem
- keywords: URL, encode, decode, x, callback, x-callback, xcallback, urlencode, urldecode
- icon: link (Tint)
- ResidentCompatible: True
- parameters:
  - `WFEncodeMode` (Enumeration) Mode default="Encode" choices=["Encode", "Decode"]
  - `WFInput` (TextInput) Text

## Use Model

- identifier: `is.workflow.actions.askllm`  ·  class `WFAskLLMAction`
- Use a model to handle complex requests in your shortcuts.
- summary variants:
  - `Use ${WFLLMModel} model`
  - `Use ${WFLLMModel} model`  when {"WFLLMModel": "Apple Intelligence"}
  - `Use ${WFLLMModel} model`  when {"WFLLMModel": "Apple Intelligence Pro"}
  - `Use ${WFLLMModel}`  when {"WFLLMModel": "ChatGPT"}
- input: WFContentItem (required)
- output: Response WFGeneratedContentItem, WFBooleanContentItem, WFNumberContentItem, WFDictionaryContentItem, WFContentItem, WFDateContentItem
- keywords: ask, apple, intelligence, intelligent, ai, generative, chat, llm, language, chatgpt, siri
- parameters:
  - `WFLLMModel` (AskLLMModel) Model
  - `WFLLMPrompt` (TextInput) Request — A request for the model that optionally includes variables and outputs from previous actions, including calendar events, reminders, images, and more.
  - `WFAllowWebSearch` (Switch) Use Broad World Knowledge default=false — Allow the model to go out to the web for up-to-date information.
  - `WFGenerativeResultType` (GenerativeResultTypePicker) Output default="Automatic" — Responses are automatically optimized for the actions they’re passed into — for example, if the response is passed into the ‘Repeat with Each’ action, the model creates a list.\n\nTo manually specify the model’s output, select an output type using the ‘Output’ parameter.
  - `FollowUp` (Switch) Follow Up default=false — Show the model’s response and make additional requests before the final response is passed to the next action.\n\n**Private Cloud Compute Models**\nUse large server-based models on Private Cloud Compute to handle complex requests while protecting your privacy.\n\n**On-Device Model**\nUse the on-device model to handle simple requests without the need for a network connection.\n\nImage analysis is supported by the Private Cloud Compute and Extension models, however image generation is not supported.

## Vibrate Device

- identifier: `is.workflow.actions.vibrate`  ·  class `WFVibrateAction`
- Vibrates the device for a short amount of time.
- summary: `Vibrate device`
- keywords: vibration, taptic, haptic, notification, alert
- icon: iphone.radiowaves.left.and.right (Red)
- InputPassthrough: True
- parameters:
  - `WFVibrateHapticType` (Enumeration) Haptic Pattern default="Default" choices=["Default", "Up Direction", "Down Direction", "Success", "Failure", "Retry", "Start", "Stop", "Click"] — When run on Apple Watch, the selected pattern will be tapped on to your wrist.

## Wait

- identifier: `is.workflow.actions.delay`  ·  class `WFDelayAction`
- Waits for the specified number of seconds before continuing with the next action.
- summary: `Wait ${WFDelayTime}`
- keywords: time, delay, wait, seconds
- icon: hourglass (Gray)
- ResidentCompatible: True
- InputPassthrough: True
- parameters:
  - `WFDelayTime` (Stepper) default=1

## Wait to Return

- identifier: `is.workflow.actions.waittoreturn`  ·  class `WFWaitToReturnAction`
- Pauses execution until you leave the Shortcuts app and return to it.\n\nThis action might be useful after an action that switches apps, to pause execution until you return to the Shortcuts app.\n\nThis action will only take effect when running shortcuts in the Shortcuts app.
- summary: `Wait to return`
- keywords: wait
- icon: person.badge.hourglass.fill (Gray)
- InputPassthrough: True

## Watch Me Do

- identifier: `is.workflow.actions.watchmedo`  ·  class `WFWatchMeDoAction`
- Records and plays back mouse and keyboard events.
- summary: `${WFUserEvent}`
- keywords: record, playback, automation, event
- icon: menubar.dock.rectangle.badge.record (Gray)
- parameters:
  - `WFUserEvent` (UIRecordingEvent) User Event
  - `WFPlaybackSpeed` (Slider) Playback Speed default=1 — Allows you to choose the playback speed of the action.
