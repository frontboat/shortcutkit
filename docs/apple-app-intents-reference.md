# Apple App Intents actions

Actions Apple's own apps and system components expose to Shortcuts through App Intents, as the
Shortcuts app indexes them (`tools/dump-toolkit-registry.py`). Identifier, parameter keys, value
kinds and enumeration cases are what a `.shortcut` file needs; `Shortcut.action()` adds the
`AppIntentDescriptor` automatically. Generated; do not edit.

1441 actions from 77 apps. Source: {'indexerSource': 'BackgroundShortcutRunner', 'launchServicesSequence': 11580, 'osVersion': '26A5421a', 'source': 'Tools-prod.v79-8281961B-2D2A-4863-967F-B85898F44141.sqlite', 'toolkitVersion': '9C1DBC60-6B3D-4993-B5BA-1525716A6D98'}

## App Store (`com.apple.AppStore`)

### Search App Store

`com.apple.AppStore.SystemSearchIntent` · key `app_store_search_app_store`
  
Navigate to search results.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Criteria | text | string |

## AudioAppIntentsExtension (`com.apple.siri.AudioAppIntentsExtension`)

### Add Audio Item to Library

`com.apple.siri.AudioAppIntentsExtension.SiriKitAddAudioToLibraryIntent` · key `com_apple_siri_audio_app_intents_extension_add_audio_item_to_library`
  
Add an audio item to the person’s library
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity SiriKitAlbumEntity |

### Add Audio Item to Playlist

`com.apple.siri.AudioAppIntentsExtension.SiriKitAddAudioToPlaylistIntent` · key `com_apple_siri_audio_app_intents_extension_add_audio_item_to_playlist`
  
Add an audio item to a playlist
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity SiriKitAlbumEntity |
| `playlist` | Playlist | any | entity SiriKitPlaylistEntity |

### Play Audio Item

`com.apple.siri.AudioAppIntentsExtension.SiriKitPlayAudioIntent` · key `com_apple_siri_audio_app_intents_extension_play_audio_item`
  
Play an audio item
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity SiriKitAlbumEntity |
| `playbackAttributes` | Playback Attributes | string | enum: `repeat`, `shuffle` |
| `queueLocation` | Queue Location | string | enum: `next`, `tail` |
| `warmupAudioQueueResult` | Warmup Audio Queue Result | any | entity SiriKitWarmupAudioQueueResultEntity |

### Like Audio Item

`com.apple.siri.AudioAppIntentsExtension.SiriKitUpdateAudioAffinityIntent` · key `com_apple_siri_audio_app_intents_extension_like_audio_item`
  
Set the like state of an audio item to liked, unliked, or unset
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Target | any | entity SiriKitAlbumEntity |
| `affinityState` | Affinity State | string | enum: `dislike`, `like`, `unset` |

### Whole House Audio Placeholder Intent

`com.apple.siri.AudioAppIntentsExtension.WholeHouseAudioPlaceholderIntent` · key `com_apple_siri_audio_app_intents_extension_whole_house_audio_placeholder_intent`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `destinations` | Destinations | any | entity MediaIntents.HomeDeviceGroupRepresentationEntity |

## Books (`com.apple.iBooksX`)

### Find Audiobook

`com.apple.iBooksX.AudiobookAppEntity` · key `books_find_audiobook`
  
Output: Audiobook `com.apple.iBooksX.AudiobookAppEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `author`, `genre`, `purchaseDate`, `seriesTitle`, `title`, `url` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | audiobook | string | enum: `Library` |

### Find Audiobook

`com.apple.iBooksX.AudiobookEntity` · key `books_find_audiobook`
  
Output: Audiobook `com.apple.iBooksX.AudiobookEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `author`, `genre`, `narrator`, `publisher`, `purchaseDate`, `releaseDate`, `seriesTitle`, `title` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | audiobook | string | enum: `Library` |

### Set Audiobook Sleep Timer

`com.apple.iBooksX.AudiobookSleepTimerIntent` · key `books_set_audiobook_sleep_timer`
  
Sets a sleep timer in the Books app from available sleep timer options.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `option` | Timer | string | enum: `timerCustom`, `timerOff`, `timerWhenCurrentChapterEnds` |
| `duration` | Duration | any | primitive96 |
| `ShowWhenRun` | Show When Run | bool | bool |

### Find Books

`com.apple.iBooksX.BookAppEntity` · key `books_find_books`
  
Output: Book `com.apple.iBooksX.BookAppEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `author`, `contentType`, `genre`, `purchaseDate`, `seriesTitle`, `title`, `url` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | book | string | enum: `Library` |

### Change Book Appearance

`com.apple.iBooksX.BookReaderChangeThemeIntent` · key `books_change_book_appearance`
  
Changes the appearance or reading theme in an open book.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `changeOperation` | Operation | string | enum: `disable`, `enable`, `toggle` |
| `setting` | Appearance | string | enum: `darkMode`, `lightMode`, `theme1`, `theme2`, `theme3`, `theme4`, `theme5`, `theme6` |

### Turn Page

`com.apple.iBooksX.BookReaderNavigatePageInBookIntent` · key `books_turn_page`
  
Navigates to the next or previous page.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `direction` | Direction | string | enum: `next`, `previous` |
| `target` | Book | any | entity BookAppEntity |

### Turn Page

`com.apple.iBooksX.BookReaderNavigatePagesIntent` · key `books_turn_page`
  
Navigates pages in an open book forward to backwards sequentially.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `direction` | Direction | string | enum: `next`, `previous` |

### Get Book Settings

`com.apple.iBooksX.BookSettingsEntity` · key `books_get_book_settings`
  
Output: Book Settings `com.apple.iBooksX.BookSettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `font`, `fontSize`, `isAllowMultipleColumns`, `isTextJustified`, `pageNavigationSetting`, `theme` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | book settings | string | enum: `Library` |

### Edit Book Settings

`com.apple.iBooksX.BookSettingsEntity-UpdatableEntity` · key `books_edit_book_settings`
  
Edit Book Settings
 • Font
 • Font Size
 • Is Allow Multiple Columns
 • Is Text Justified
 • Page Navigation Setting
 • Theme
  
Output: Book Settings `com.apple.iBooksX.BookSettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Book Settings | any | entity BookSettingsEntity |
| `font` | Font to update on BookSettings AppEntity | string | enum: `default` |
| `fontSize` | Font Size to update on BookSettings AppEntity | string | enum: `default` |
| `isAllowMultipleColumns` | Allow Multiple Columns to update on BookSettings AppEntity | bool | bool |
| `isTextJustified` | Text Justified to update on BookSettings AppEntity | bool | bool |
| `pageNavigationSetting` | Page Navigation Setting to update on BookSettings AppEntity | string | enum: `continuousScroll`, `pageTurning` |
| `theme` | Theme to update on BookSettings AppEntity | string | enum: `darkMode`, `lightMode`, `theme1`, `theme2`, `theme3`, `theme4`, `theme5`, `theme6` |

### Change Text Size

`com.apple.iBooksX.ChangeFontSizeIntent` · key `books_change_text_size`
  
Updates the font size for a book.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `changeOperation` | Font Change | string | enum: `decrease`, `increase` |
| `target` | Settings | any | entity BookSettingsEntity |
| `book` | Book | any | entity BookAppEntity |

### Open View or Collection in Books App

`com.apple.iBooksX.DeepLinkIntent` · key `books_open_view_or_collection_in_books_app`
  
Opens the Books app to the view you specify.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Deep Link to View | string | enum: `audiobookStoreTab`, `audiobooksCollection`, `bookStoreTab`, `booksCollection`, `downloadedCollection`, `finishedCollection`, `homeTab`, `libraryAllCollection`, `libraryTab`, `mangaTab`, `mySamplesCollection`, `pdfsCollection` … |

### Find Standard Collection

`com.apple.iBooksX.DefaultCollectionEntity` · key `books_find_standard_collection`
  
Output: Standard Collection `com.apple.iBooksX.DefaultCollectionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | standard collection | string | enum: `Library` |

### Open Audio Item

`com.apple.iBooksX.OpenAudioIntent` · key `books_open_audio_item`
  
Opens an audio item in the app UI
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Target | any | entity AudiobookEntity |

### Open Book

`com.apple.iBooksX.OpenBookIntent` · key `books_open_book`
  
Opens the last book you were reading, or a book you specify, in the Books app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `mode` | Type | string | enum: `mostRecent`, `specific` |
| `target` | Book | any | entity BookAppEntity |

### Open Default Collection

`com.apple.iBooksX.OpenDefaultCollectionIntent` · key `books_open_default_collection`
  
Opens a specified default collection in the Books app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Standard Collection | string | enum: `audiobooks`, `books`, `downloaded`, `finished`, `libraryAll`, `mySamples`, `pdfs`, `wantToRead` |

### Open Most Recent Book

`com.apple.iBooksX.OpenMostRecentBookIntent` · key `books_open_most_recent_book`
  
Opens the last book you were reading in the Books app.
  
Output:  `none`

### Open Specific Book

`com.apple.iBooksX.OpenSpecificBookIntent` · key `books_open_specific_book`
  
Opens a book you specify, in the Books app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Book | any | entity BookAppEntity |

### Open View in Books App

`com.apple.iBooksX.OpenTabBarItemIntent` · key `books_open_view_in_books_app`
  
Opens the Books app to the tab or sidebar view you specify.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | View | string | enum: `audiobookStore`, `bookStore`, `home`, `library`, `manga`, `search` |

### Open Table of Contents

`com.apple.iBooksX.OpenTableOfContentsIntent` · key `books_open_table_of_contents`
  
Opens the table of contents in the Books app for a book you specify.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Book | any | entity BookAppEntity |

### Pause Current Audiobook

`com.apple.iBooksX.PauseCurrentAudiobookIntent` · key `books_pause_current_audiobook`
  
Pauses the audiobook you are currently listening to in the Books app.
  
Output:  `none`

### Play Audio Item

`com.apple.iBooksX.PlayAudioIntent` · key `books_play_audio_item`
  
Play an audio item
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `warmupAudioQueueResult` | Warmup Audio Queue Result | any | entity WarmupAudioQueueResult |
| `audioEntity` | Audio Item | any | entity AudiobookEntity |
| `playbackAttributes` | Playback Attributes | string | enum: `repeat`, `shuffle` |
| `queueLocation` | Queue Location | string | enum: `later`, `next`, `tail` |

### Play Audiobook

`com.apple.iBooksX.PlayAudiobookIntent` · key `books_play_audiobook`
  
Plays the last audiobook you were listening to, or an audiobook you specify, in the Books app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `mode` | Type | string | enum: `mostRecent`, `specific` |
| `target` | Audiobook | any | entity AudiobookAppEntity |

### Play Most Recent Audiobook

`com.apple.iBooksX.PlayMostRecentAudiobookIntent` · key `books_play_most_recent_audiobook`
  
Plays the last audiobook you were listening to in the Books app.
  
Output:  `none`

### Play Specific Audiobook

`com.apple.iBooksX.PlaySpecificAudiobookIntent` · key `books_play_specific_audiobook`
  
Plays an audiobook you specify, in the Books app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Audiobook to play | any | entity AudiobookAppEntity |

### Search in the Books App

`com.apple.iBooksX.SearchBooksAppIntent` · key `books_search_in_the_books_app`
  
Searches the Books app for books and audiobooks in the store and your library by title or author.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Title or Author | text | string |

### Search in Books

`com.apple.iBooksX.SearchBooksIntent` · key `books_search_in_books`
  
Searches the Books app for books and audiobooks in the store and your library by title or author.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `searchPhrase` | Text | text | string |

### UpdateReaderIntent

`com.apple.iBooksX.UpdateBookSettingsIntent` · key `books_update_reader_intent`
  
UpdateReaderIntent
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Settings | any | entity BookSettingsEntity |
| `font` | Font | string | enum: `default` |
| `theme` | Theme | string | enum: `darkMode`, `lightMode`, `theme1`, `theme2`, `theme3`, `theme4`, `theme5`, `theme6` |
| `pageNavigationSetting` | Navigation Behavior | string | enum: `continuousScroll`, `pageTurning` |
| `isTextJustified` | Justify Text | bool | bool |
| `isAllowMultipleColumns` | Allow Multiple Columns | bool | bool |

### PlayAudio

`com.apple.siri.SiriAudioTools.SiriAudioTools.PlayAudioTool|com.apple.iBooksX` · key `-`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity AudiobookEntity |
| `playbackAttributes` | Playback Attributes | string | enum: `repeat`, `shuffle` |
| `queueLocation` | Queue Location | string | enum: `later`, `next`, `tail` |
| `destinations` | Destinations | any | entity MediaIntents.HomeDeviceGroupRepresentationEntity |

## Calculator (`com.apple.calculator`)

### Calculator

`com.apple.calculator.LaunchCalculatorOpenIntent` · key `calculator_calculator`
  
Opens calculator app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Calculator | string | enum: `app` |

## Calendar (`com.apple.iCal`)

### Create Calendar

`com.apple.iCal.CreateCalendarIntent` · key `calendar_create_calendar`
  
Creates a new calendar.
  
Output: Calendar `com.apple.iCal.CalendarEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | string |
| `source` | Account | any | entity SourceEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Create Event

`com.apple.iCal.CreateEventIntent` · key `calendar_create_event`
  
Creates a new event.
  
Output: Event `com.apple.iCal.EventEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `title` | Title | text | string |
| `startDate` | Start Date | any | date |
| `endDate` | End Date | any | date |
| `isAllDay` | All Day | bool | bool |
| `recurrence` | Recurrence Rule | any | recurrence |
| `calendar` | Calendar | any | entity CalendarEntity |
| `location` | Location | any | entity GeoToolbox.PlaceDescriptorEntity |
| `note` | Notes | text | richText |
| `alarms` | Alarms | any | date |
| `attendees` | Attendees | any | entity AttendeeEntity |
| `privacyLevel` | Privacy Level | string | enum: `0`, `1`, `2`, `3` |
| `availability` | Availability | string | enum: `0`, `1`, `2`, `3`, `4` |
| `travelTime` | Travel Time | number | double |
| `url` | URL | text | url |
| `floatingTimeZoneID` | Floating Time Zone ID | text | string |
| `virtualConferenceType` | Virtual Conference Type | any | entity VirtualConferenceTypeEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Delete Calendars

`com.apple.iCal.DeleteCalendarsIntent` · key `calendar_delete_calendars`
  
Deletes the given calendars.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Calendars | any | entity CalendarEntity |
| `reportJunk` | Report Junk | string | enum: `cancel`, `dontReport`, `report` |

### Delete Events

`com.apple.iCal.DeleteEventIntent` · key `calendar_delete_events`
  
Deletes the given events.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Event | any | entity EventEntity |
| `span` | Occurrence | string | enum: `all`, `future`, `this` |

### Edit Event

`com.apple.iCal.EditEventIntent` · key `calendar_edit_event`
  
Modifies the given event.
  
Output: Event `com.apple.iCal.EventEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `event` | Event | any | entity EventEntity |
| `title` | Title | text | string |
| `startDate` | Start Date | any | date |
| `endDate` | End Date | any | date |
| `isAllDay` | Is All Day | bool | bool |
| `calendar` | Calendar | any | entity CalendarEntity |
| `privacyLevel` | Privacy Level | string | enum: `0`, `1`, `2`, `3` |
| `status` | Status | string | enum: `cancelled`, `confirmed`, `tentative` |
| `availability` | Availability | string | enum: `0`, `1`, `2`, `3`, `4` |
| `location` | Location | any | entity GeoToolbox.PlaceDescriptorEntity |
| `note` | Notes | text | string |
| `recurrence` | Recurrence Rule | any | recurrence |
| `travelTime` | Travel Time | number | double |
| `alarms` | Alarms | any | date |
| `url` | URL | text | url |
| `participationStatus` | Participation Status | string | enum: `accepted`, `completed`, `declined`, `delegated`, `inProcess`, `pending`, `tentative` |
| `attendees` | Attendees | any | entity AttendeeEntity |
| `span` | Span | string | enum: `all`, `future`, `this` |
| `locationPredictionAction` | Location Prediction Action | number | int |
| `virtualConferenceType` | Virtual Conference Type | any | entity VirtualConferenceTypeEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Email Attendees

`com.apple.iCal.EmailAttendeesIntent` · key `calendar_email_attendees`
  
Starts an email addressed to the attendees of the given event.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Event | any | entity EventEntity |

### Email Organizer

`com.apple.iCal.EmailOrganizerIntent` · key `calendar_email_organizer`
  
Starts an email addressed to the organizer of the given event.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Event | any | entity EventEntity |

### Find Event

`com.apple.iCal.EventEntity` · key `calendar_find_event`
  
Output: Event `com.apple.iCal.EventEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `endDate`, `location`, `note`, `organizers`, `recurrence`, `startDate`, `title`, `virtualLocation` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | event | string | enum: `Library` |

### Highlight Event

`com.apple.iCal.HighlightEventIntent` · key `calendar_highlight_event`
  
Jumps to the date of the given event and highlights it.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Event | any | entity EventEntity |

### Find Inbox Item

`com.apple.iCal.InboxItemEntity` · key `calendar_find_inbox_item`
  
Output: Inbox Item `com.apple.iCal.InboxItemEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | inbox item | string | enum: `Library` |

### Join Event

`com.apple.iCal.JoinEventIntent` · key `calendar_join_event`
  
Joins or calls the virtual conference for the given event.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Event | any | entity EventEntity |

### Open Calendar Editor

`com.apple.iCal.OpenCalendarEditorIntent` · key `calendar_open_calendar_editor`
  
Shows an editor for the given calendar.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Calendar | any | entity CalendarEntity |
| `enableDoneInitially` | Enable Done <no loc> | bool | bool |

### Open Calendar View

`com.apple.iCal.OpenCalendarViewIntent` · key `calendar_open_calendar_view`
  
Opens the given view.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Calendar View | string | enum: `calendars`, `day`, `inbox`, `list`, `month`, `search`, `splitMonth`, `week`, `year` |

### Open Date

`com.apple.iCal.OpenDateIntent` · key `calendar_open_date`
  
Jumps to the given date.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Date | any | date |

### Open Event Details

`com.apple.iCal.OpenEventDetailsIntent` · key `calendar_open_event_details`
  
Shows the details for the given event.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `title` | Title | text | string |
| `caption` | Caption | text | string |
| `target` | Event | any | entity EventEntity |

### Open Event Editor

`com.apple.iCal.OpenEventEditorIntent` · key `calendar_open_event_editor`
  
Shows an editor for the given event.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Event | any | entity EventEntity |

### Respond to Inbox Item

`com.apple.iCal.RespondToInboxItemIntent` · key `calendar_respond_to_inbox_item`
  
Responds to the given inbox item.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Inbox Item | any | entity InboxItemEntity |
| `response` | Response | string | enum: `accept`, `addToCalendar`, `decline`, `delete`, `ignore`, `join`, `maybe`, `ok`, `reportJunk` |

### Find TransferableCalendarEntity <no loc>

`com.apple.iCal.TransferableCalendarEntity` · key `calendar_find_transferable_calendar_entity_no_loc`
  
Output: TransferableCalendarEntity <no loc> `com.apple.iCal.TransferableCalendarEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | transferablecalendarentity <no loc> | string | enum: `Library` |

### Find TransferableSourceEntity <no loc>

`com.apple.iCal.TransferableSourceEntity` · key `calendar_find_transferable_source_entity_no_loc`
  
Output: TransferableSourceEntity <no loc> `com.apple.iCal.TransferableSourceEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | transferablesourceentity <no loc> | string | enum: `Library` |

## Clock (`com.apple.clock`)

### Add City

`com.apple.clock.AddWorldClockIntent` · key `clock_add_city`
  
Adds the specified city to the Clock app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `city` | City | any | entity WorldClockCityEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Find Alarm

`com.apple.clock.AssistantAlarmEntity` · key `clock_find_alarm`
  
Output: Alarm `com.apple.clock.AssistantAlarmEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `canSnooze`, `isEnabled`, `label`, `recurrenceDays`, `time`, `triggerState` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | alarm | string | enum: `Library` |

### Cancel Timers

`com.apple.clock.AssistantCancelTimerIntent` · key `clock_cancel_timers`
  
Cancel timers
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Timers | any | entity TimerEntity |

### Add Alarm

`com.apple.clock.AssistantCreateAlarmIntent` · key `clock_add_alarm`
  
Create an alarm
  
Output: Alarm `com.apple.clock.AssistantAlarmEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `time` | Time | any | dateComponents |
| `label` | Label | text | string |
| `recurrenceDays` | Recurrence Days | any | recurrence |
| `canSnooze` | Can Snooze | bool | bool |

### Start Timer

`com.apple.clock.AssistantCreateTimerIntent` · key `clock_start_timer`
  
Create a timer
  
Output: Timer `com.apple.clock.TimerEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `duration` | Duration | any | location |
| `label` | Label | text | string |
| `isSleepTimer` | Is Sleep Timer | bool | bool |

### Delete Alarms

`com.apple.clock.AssistantDeleteAlarmIntent` · key `clock_delete_alarms`
  
Delete the alarms
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Alarms | any | entity AssistantAlarmEntity |

### Lap Stopwatch

`com.apple.clock.AssistantLapStopwatchIntent` · key `clock_lap_stopwatch`
  
Lap the stopwatch
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `stopwatch` | Stopwatch | any | entity StopwatchEntity |

### Pause Timer

`com.apple.clock.AssistantPauseTimerIntent` · key `clock_pause_timer`
  
Pause a timer
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `timer` | Timer | any | entity TimerEntity |

### Reset Stopwatch

`com.apple.clock.AssistantResetStopwatchIntent` · key `clock_reset_stopwatch`
  
Reset the stopwatch
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `stopwatch` | Stopwatch | any | entity StopwatchEntity |

### Resume Timer

`com.apple.clock.AssistantResumeTimerIntent` · key `clock_resume_timer`
  
Resume a timer
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `timer` | Timer | any | entity TimerEntity |

### Start Stopwatch

`com.apple.clock.AssistantStartStopwatchIntent` · key `clock_start_stopwatch`
  
Start the stopwatch
  
Output: Stopwatch `com.apple.clock.StopwatchEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `stopwatch` |  | any | entity StopwatchEntity |

### Stop Stopwatch

`com.apple.clock.AssistantStopStopwatchIntent` · key `clock_stop_stopwatch`
  
Stop the stopwatch
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `stopwatch` | Stopwatch | any | entity StopwatchEntity |

### Cancel Timer

`com.apple.clock.CancelTimerIntent` · key `clock_cancel_timer`
  
Cancels the Timer in the Clock app.
  
Output:  `none`

### Delete Alarms

`com.apple.clock.DeleteAlarmIntent` · key `clock_delete_alarms`
  
Deletes one or more alarms in the Clock app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Alarms | any | entity AlarmEntity |

### Dismiss Alarm

`com.apple.clock.DismissAlarmIntent` · key `clock_dismiss_alarm`
  
Dismiss a firing or snoozed alarm
  
Output: Alarm `com.apple.clock.AssistantAlarmEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `alarm` | Alarm | any | entity AssistantAlarmEntity |

### Get Current Timer

`com.apple.clock.GetCurrentTimerDetailsIntent` · key `clock_get_current_timer`
  
Returns the total duration or remaining time of the current Timer in the Clock app.
  
Output:  `measurement_duration`

| Key | Name | Kind | Type |
|---|---|---|---|
| `mode` | Mode | string | enum: `duration`, `remainingTime` |

### Get Time for City

`com.apple.clock.GetTimeForCityIntent` · key `clock_get_time_for_city`
  
Provides time for specified city
  
Output:  `string`

| Key | Name | Kind | Type |
|---|---|---|---|
| `city` | City | any | entity WorldClockCityEntity |

### Lap Stopwatch

`com.apple.clock.LapStopwatchIntent` · key `clock_lap_stopwatch`
  
Laps the Stopwatch in the Clock app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `OpenWhenRun` | Open When Run | bool | bool |

### Opens Alarm

`com.apple.clock.OpenAlarmIntent` · key `clock_opens_alarm`
  
Opens the given alarm in the Clock app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Alarm | any | entity AlarmEntity |

### Open Tab

`com.apple.clock.OpenTab` · key `clock_open_tab`
  
Opens the given tab in the Clock app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `tab` | Tab | string | enum: `alarm`, `clock`, `stopwatch`, `timer` |

### Pause Timer

`com.apple.clock.PauseTimerIntent` · key `clock_pause_timer`
  
Pauses the Timer in the Clock app.
  
Output:  `none`

### Remove City

`com.apple.clock.RemoveWorldClockIntent` · key `clock_remove_city`
  
Removes the specified city from the Clock app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | City | any | entity WorldClockCityEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Reset Stopwatch

`com.apple.clock.ResetStopwatchIntent` · key `clock_reset_stopwatch`
  
Resets the Stopwatch in the Clock app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `OpenWhenRun` | Open When Run | bool | bool |

### Resume Timer

`com.apple.clock.ResumeTimerIntent` · key `clock_resume_timer`
  
Resumes the Timer in the Clock app.
  
Output:  `none`

### Snooze Alarm

`com.apple.clock.SnoozeAlarmIntent` · key `clock_snooze_alarm`
  
Snooze the firing alarm
  
Output: Alarm `com.apple.clock.AssistantAlarmEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `alarm` | Alarm | any | entity AssistantAlarmEntity |
| `duration` | Duration | any | location |

### Start Stopwatch

`com.apple.clock.StartStopwatchIntent` · key `clock_start_stopwatch`
  
Starts the Stopwatch in the Clock app.
  
Output:  `none`

### Stop the Stopwatch

`com.apple.clock.StopStopwatchIntent` · key `clock_stop_the_stopwatch`
  
Stops the Stopwatch in the Clock app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `OpenWhenRun` | Open When Run | bool | bool |

### Find Timer

`com.apple.clock.TimerEntity` · key `clock_find_timer`
  
Output: Timer `com.apple.clock.TimerEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `duration`, `label` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | timer | string | enum: `Library` |

### Update Alarm

`com.apple.clock.UpdateAlarmIntent` · key `clock_update_alarm`
  
Update the alarm, for example, turn on / off the alarm, change the label, time, or repeating schedule
  
Output: Alarm `com.apple.clock.AssistantAlarmEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `alarm` | Alarm | any | entity AssistantAlarmEntity |
| `isEnabled` | Is Enabled | bool | bool |
| `time` | Time | any | dateComponents |
| `label` | Label | text | string |
| `recurrenceDays` | Recurrence Days | any | recurrence |
| `allowsSnooze` | Allows Snooze | bool | bool |

### Update Timer

`com.apple.clock.UpdateTimerIntent` · key `clock_update_timer`
  
Update the timer’s attributes
  
Output: Timer `com.apple.clock.TimerEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `timer` | Timer | any | entity TimerEntity |
| `duration` | Duration | any | location |
| `label` | Label | text | string |
| `isSleepTimer` | Is Sleep Timer | bool | bool |

### Add Alarm

`com.apple.mobiletimer-framework.MobileTimerIntents.MTCreateAlarmIntent` · key `clock_add_alarm`
  
Creates an Alarm in the Clock app.
  
Output: Alarm `com.apple.clock.AlarmEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `dateComponents` | Time | any | dateComponents |
| `name` | Name | text | string |
| `repeats` | Repeat | string | enum: `friday`, `monday`, `saturday`, `sunday`, `thursday`, `tuesday`, `wednesday` |
| `allowsSnooze` | Snooze | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Find Alarms

`com.apple.mobiletimer-framework.MobileTimerIntents.MTGetAlarmsIntent` · key `clock_find_alarms`
  
Search for alarms in the Clock app that match the given criteria.
  
Output: Alarms `com.apple.clock.AlarmEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `hours`, `label` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | alarms | string | enum: `Library` |

### Toggle Alarm

`com.apple.mobiletimer-framework.MobileTimerIntents.MTToggleAlarmIntent` · key `clock_toggle_alarm`
  
Enables or disables an Alarm in the Clock app.
  
Output: Alarm `com.apple.clock.AlarmEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `operation` | Operation | string | enum: `toggle`, `turn` |
| `state` | State | bool | bool |
| `alarm` | Alarm | any | entity AlarmEntity |
| `ShowWhenRun` | Show When Run | bool | bool |

### CancelTimer

`com.apple.siri.SiriTimeFlowTools.SiriTimeFlowTools.CancelTimerFlowTool|com.apple.clock` · key `-`
  
Cancel the timer
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Timers | any | entity TimerEntity |

### DismissAlarm

`com.apple.siri.SiriTimeFlowTools.SiriTimeFlowTools.DismissAlarmFlowTool|com.apple.clock` · key `-`
  
Dismiss an alarm
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `alarm` | Alarm | any | entity AssistantAlarmEntity |

### SnoozeAlarm

`com.apple.siri.SiriTimeFlowTools.SiriTimeFlowTools.SnoozeAlarmFlowTool|com.apple.clock` · key `-`
  
Snooze a firing alarm
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `alarm` | Alarm | any | entity AssistantAlarmEntity |
| `duration` | Duration | any | location |

## Contacts (`com.apple.AddressBook`)

### Find Contact

`com.apple.AddressBook.ContactEntity` · key `contacts_find_contact`
  
Output: Contact `com.apple.AddressBook.ContactEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | contact | string | enum: `Library` |

### Create Contact

`com.apple.AddressBook.CreateContactIntent` · key `contacts_create_contact`
  
Create a new contact and open the contact card in the Contacts app
  
Output: Contact `com.apple.AddressBook.ContactEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `contactType` | Contact Type | string | enum: `organization`, `person` |
| `personName` | Name Components | any | measurement |
| `organizationName` | Organization Name | text | string |
| `departmentName` | Department Name | text | string |
| `jobTitle` | Job Title | text | string |
| `phoneticOrganizationName` | Phonetic Organization Name | text | string |
| `phoneNumbers` | Phone Numbers | any | entity ContactLabeledValueEntity |
| `emailAddresses` | Email Addresses | any | entity ContactLabeledValueEntity |
| `postalAddresses` | Postal Addresses | any | entity ContactLabeledPostalAddressEntity |
| `contactRelations` | Contact Relations | any | entity ContactLabeledValueEntity |
| `birthday` | Birthday | any | dateComponents |
| `dates` | Dates | any | entity ContactLabeledDateEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Delete Contact

`com.apple.AddressBook.DeleteContactIntent` · key `contacts_delete_contact`
  
Delete a contact
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Contacts | any | entity ContactEntity |

### Search in Contacts App

`com.apple.AddressBook.SearchInContactsIntent` · key `contacts_search_in_contacts_app`
  
Search for a contact in the Contacts app
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Search Criteria | text | string |

### Update Contact Details

`com.apple.AddressBook.UpdateContactIntent` · key `contacts_update_contact_details`
  
Update contact details for a contact
  
Output: Contact `com.apple.AddressBook.ContactEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Contact | any | entity ContactEntity |
| `contactType` | Contact Type | string | enum: `organization`, `person` |
| `personName` | Name Components | any | measurement |
| `organizationName` | Organization Name | text | string |
| `departmentName` | Department Name | text | string |
| `jobTitle` | Job Title | text | string |
| `phoneticOrganizationName` | Phonetic Organization Name | text | string |
| `phoneNumbers` | Phone Numbers | any | entity ContactLabeledValueEntity |
| `emailAddresses` | Email Addresses | any | entity ContactLabeledValueEntity |
| `postalAddresses` | Postal Addresses | any | entity ContactLabeledPostalAddressEntity |
| `contactRelations` | Contact Relations | any | entity ContactLabeledValueEntity |
| `birthday` | Birthday | any | dateComponents |
| `dates` | Dates | any | entity ContactLabeledDateEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### View Contact Card

`com.apple.AddressBook.ViewContactCardIntent` · key `contacts_view_contact_card`
  
Open a contact card for a contact
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Target Contact | any | entity ContactEntity |
| `highlightedValue` | Highlighted Detail | any | entity HighlightedDetail |
| `highlightedPropertyType` | Highlighted Property Type | string | enum: `birthday`, `contactRelation`, `custom`, `emailAddress`, `note`, `phoneNumber`, `postalAddress` |
| `shouldEdit` | Should open for editing | bool | bool |

## ControlCenter (`com.apple.controlcenter`)

### Put Display to Sleep

`com.apple.controlcenter.DisplaySleepIntent` · key `com_apple_controlcenter_put_display_to_sleep`
  
Output:  `none`

### Lock the screen

`com.apple.controlcenter.LockScreenIntent` · key `com_apple_controlcenter_lock_the_screen`
  
Output:  `none`

### Start Screen Saver

`com.apple.controlcenter.ScreenSaverIntent` · key `com_apple_controlcenter_start_screen_saver`
  
Output:  `none`

### Enable or disable Dark Mode

`com.apple.controlcenter.SetDarkModeEnabledIntent` · key `com_apple_controlcenter_enable_or_disable_dark_mode`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | Dark Mode is enabled | bool | bool |

### Enable or disable Night Shift

`com.apple.controlcenter.SetNightShiftEnabledIntent` · key `com_apple_controlcenter_enable_or_disable_night_shift`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | Night Shift is enabled | bool | bool |

### Enable or disable True Tone

`com.apple.controlcenter.SetTrueToneEnabledIntent` · key `com_apple_controlcenter_enable_or_disable_true_tone`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | True Tone is enabled | bool | bool |

## Dock (`com.apple.dock`)

### Automatically hide and show the Dock

`com.apple.dock.SetDockAutoHideEnabledIntent` · key `com_apple_dock_automatically_hide_and_show_the_dock`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | Dock auto-hide is enabled | bool | bool |

## Find My (`com.apple.findmy`)

### Find Item

`com.apple.findmy.ItemEntity` · key `com_apple_findmy_find_item`
  
Output: Item `com.apple.findmy.ItemEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `isThisDevice`, `name`, `owner` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | item | string | enum: `Library` |

### Find Person

`com.apple.findmy.PersonEntity` · key `com_apple_findmy_find_person`
  
Output: Person `com.apple.findmy.PersonEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `contact` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | person | string | enum: `Library` |

### Find Item

`com.apple.findmy.WidgetItemEntity` · key `com_apple_findmy_find_item`
  
Output: Item `com.apple.findmy.WidgetItemEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `isThisDevice`, `name`, `owner` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | item | string | enum: `Library` |

### Find Person

`com.apple.findmy.WidgetPersonEntity` · key `com_apple_findmy_find_person`
  
Output: Person `com.apple.findmy.WidgetPersonEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `contact` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | person | string | enum: `Library` |

## Finder (`com.apple.finder`)

### Compress Items

`com.apple.finder.CompressItemsIntent` · key `finder_compress_items`
  
Compresses items into an archive
  
Output: File `com.apple.finder.FINodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `sources` | Items | any | entity FINodeEntity |
| `format` | Format | string | enum: `appleArchive`, `zip` |
| `destination` | Move Archive To | any | entity FINodeEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Copy and Move Items

`com.apple.finder.CopyItemsIntent` · key `finder_copy_and_move_items`
  
Copies items to another location
  
Output: File `com.apple.finder.FINodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `sources` | Items | any | entity FINodeEntity |
| `destination` | Folder | any | entity FINodeEntity |
| `overwriteConflicts` | Overwrite at Destination | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Create Folder

`com.apple.finder.CreateFolderIntent` · key `finder_create_folder`
  
Creates a new folder.
  
Output: File `com.apple.finder.FINodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `fileName` | Name | text | string |
| `target` | Parent Folder | any | entity FINodeEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Duplicate Items

`com.apple.finder.DuplicateItemsIntent` · key `finder_duplicate_items`
  
Duplicates items in their current locations
  
Output: File `com.apple.finder.FINodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `sources` | Items | any | entity FINodeEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Get Info

`com.apple.finder.GetInfoIntent` · key `finder_get_info`
  
Shows the Get Info window for an item or items
  
Output: File `com.apple.finder.FINodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `targets` | Items | any | entity FINodeEntity |

### Get Location

`com.apple.finder.GetLocationIntent` · key `finder_get_location`
  
Provides a well-known location on disk
  
Output: File `com.apple.finder.FINodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `location` | Location | string | enum: `airDrop`, `applications`, `computer`, `desktop`, `documents`, `downloads`, `home`, `iCloudDrive`, `iCloudDriveEDS`, `library`, `network`, `recents` … |

### Get Selected Items

`com.apple.finder.GetSelectedItemsIntent` · key `finder_get_selected_items`
  
Gets the selected Finder items
  
Output: File `com.apple.finder.FINodeEntity`

### Go To Enclosing Folder

`com.apple.finder.GoToEnclosingFolderIntent` · key `finder_go_to_enclosing_folder`
  
Navigates the front Finder window to its enclosing folder
  
Output: File `com.apple.finder.FINodeEntity`

### Go To Folder

`com.apple.finder.GoToFolderIntent` · key `finder_go_to_folder`
  
Shows the Finder’s Go To Folder… UI
  
Output:  `none`

### Go To Location

`com.apple.finder.GoToLocationIntent` · key `finder_go_to_location`
  
Navigates to a location in a Finder window
  
Output: File `com.apple.finder.FINodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `location` | Location | any | entity FINodeEntity |

### Move Items to Folder

`com.apple.finder.MoveItemsIntent` · key `finder_move_items_to_folder`
  
Moves existing files or folders.
  
Output: File `com.apple.finder.FINodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Items | any | entity FINodeEntity |
| `destinationFolder` | Folder | any | entity FINodeEntity |
| `overwriteConflicts` | Overwrite at Destination | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Open Item

`com.apple.finder.OpenItemIntent` · key `finder_open_item`
  
Opens a selected file or folder.
  
Output: File `com.apple.finder.FINodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Item | any | entity FINodeEntity |

### Rename Item

`com.apple.finder.RenameItemIntent` · key `finder_rename_item`
  
Renames an existing file or folder.
  
Output: File `com.apple.finder.FINodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Item | any | entity FINodeEntity |
| `newName` | Name | text | string |
| `overwriteExtension` | Overwrite Extensions | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Reveal Items

`com.apple.finder.RevealItemsIntent` · key `finder_reveal_items`
  
Shows the items in Finder windows
  
Output: File `com.apple.finder.FINodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `targets` | Items | any | entity FINodeEntity |
| `openInNewWindow` | Open in New Window | bool | bool |

### Search in Finder

`com.apple.finder.SearchInBrowserIntent` · key `finder_search_in_finder`
  
Search for files and folders in Finder
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Text | text | string |

### Trash Items

`com.apple.finder.TrashItemsIntent` · key `finder_trash_items`
  
Moves items to the Trash
  
Output: File `com.apple.finder.FINodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Items | any | entity FINodeEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

## Freeform (`com.apple.freeform`)

### Add Item to Board

`com.apple.freeform.CRLAddItemToBoardIntent` · key `freeform_add_item_to_board`
  
Adds an item to a board.
  
Output: Board `com.apple.freeform.CRLBoardEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Board | any | entity CRLBoardEntity |
| `itemType` | Item | string | enum: `circle`, `line`, `media`, `roundedRectangle`, `square`, `star`, `stickyNote`, `textBox`, `triangle`, `url` |
| `text` | Text | text | richText |
| `mediaItems` | Media | any | file |
| `url` | URL | text | url |
| `OpenWhenRun` | Open When Run | bool | bool |

### Find Board

`com.apple.freeform.CRLBoardEntity` · key `freeform_find_board`
  
Output: Board `com.apple.freeform.CRLBoardEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `creationDate`, `lastModificationDate`, `title` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | board | string | enum: `Library` |

### Show/Hide Dot Grid

`com.apple.freeform.CRLChangeBoardCanvasGridIntent` · key `freeform_show_hide_dot_grid`
  
Shows or hides the dot grid for a board.
  
Output: Board `com.apple.freeform.CRLBoardEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Board | any | entity CRLBoardEntity |
| `operation` | State | string | enum: `hide`, `show`, `toggle` |
| `OpenWhenRun` | Open When Run | bool | bool |

### Show/Hide Object Connectors

`com.apple.freeform.CRLChangeBoardObjectConnectorsIntent` · key `freeform_show_hide_object_connectors`
  
Shows or hides object connectors for a board.
  
Output: Board `com.apple.freeform.CRLBoardEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Board | any | entity CRLBoardEntity |
| `operation` | State | string | enum: `hide`, `show`, `toggle` |
| `OpenWhenRun` | Open When Run | bool | bool |

### Change Fill Color

`com.apple.freeform.CRLChangeSelectionColorIntent` · key `freeform_change_fill_color`
  
Changes the fill color of the shape, sticky note, or text box selected on the board.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `board` | Board | any | entity CRLBoardEntity |
| `color` | Color | string | enum: `black`, `blue`, `gray`, `green`, `orange`, `purple`, `red`, `yellow` |

### Change Font Size

`com.apple.freeform.CRLChangeSelectionFontSizeIntent` · key `freeform_change_font_size`
  
Changes the font size of the text selected on the board.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `board` | Board | any | entity CRLBoardEntity |
| `size` | Size | string | enum: `10`, `12`, `14`, `144`, `18`, `24`, `36`, `48`, `72`, `96` |

### Change Font Style

`com.apple.freeform.CRLChangeSelectionFontStyleIntent` · key `freeform_change_font_style`
  
Applies a font style to the text selected on the board.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `board` | Board | any | entity CRLBoardEntity |
| `style` | Style | string | enum: `bold`, `italic`, `strikethrough`, `underline` |

### Create Board

`com.apple.freeform.CRLCreateBoardIntent` · key `freeform_create_board`
  
Creates a new board.
  
Output: Board `com.apple.freeform.CRLBoardEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `title` | Name | text | string |
| `OpenWhenRun` | Open When Run | bool | bool |

### Delete Boards

`com.apple.freeform.CRLDeleteBoardIntent` · key `freeform_delete_boards`
  
Deletes one or more boards.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Boards | any | entity CRLBoardEntity |

### Favorite/Unfavorite Board

`com.apple.freeform.CRLFavoriteBoardIntent_v2` · key `freeform_favorite_unfavorite_board`
  
Adds a board to Favorites or removes a board from Favorites.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Board | any | entity CRLBoardEntity |
| `operation` | State | string | enum: `favorite`, `toggle`, `unfavorite` |

### Add Files to Board

`com.apple.freeform.CRLInsertFilesToBoardIntent` · key `freeform_add_files_to_board`
  
Adds one or more files to a board.
  
Output: Board `com.apple.freeform.CRLBoardEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `board` | Board | any | entity CRLBoardEntity |
| `files` | Files | any | file |
| `OpenWhenRun` | Open When Run | bool | bool |

### Add Photos to Board

`com.apple.freeform.CRLInsertPhotosToBoardIntent` · key `freeform_add_photos_to_board`
  
Adds one or more photos to a board.
  
Output: Board `com.apple.freeform.CRLBoardEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `board` | Board | any | entity CRLBoardEntity |
| `images` | Photos | any | file |
| `OpenWhenRun` | Open When Run | bool | bool |

### Open Board

`com.apple.freeform.CRLOpenBoardIntent` · key `freeform_open_board`
  
Opens an existing board.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Board | any | entity CRLBoardEntity |

### Resize Text

`com.apple.freeform.CRLResizeSelectionFontIntent_v2` · key `freeform_resize_text`
  
Increases or decreases the font size of the text selected on the board.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `board` | Board | any | entity CRLBoardEntity |
| `operation` | Change | string | enum: `decrease`, `increase` |

### Rename Board

`com.apple.freeform.CRLUpdateBoardIntent` · key `freeform_rename_board`
  
Renames a board.
  
Output: Board `com.apple.freeform.CRLBoardEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Board | any | entity CRLBoardEntity |
| `title` | Name | text | string |
| `OpenWhenRun` | Open When Run | bool | bool |

## GameCenterSettingsExtension (`com.apple.GameCenter.Settings.DeviceExpertExtension`)

### Open Game Center Settings

`com.apple.GameCenter.Settings.DeviceExpertExtension.OpenGameCenterSettingsDeepLinks` · key `settings_open_game_center_settings`
  
Opens all Game Center settings.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Game Center | string | enum: `activitySharing`, `allFriends`, `editProfile`, `friendRequests`, `inviteFriends`, `root`, `signIn`, `signOut`, `viewProfile` |

## GenerativeAssistantExtension (`com.apple.generativeassistanttools.GenerativeAssistantExtension`)

### Generate Knowledge Response

`com.apple.generativeassistanttools.GenerativeAssistantExtension.GenerateKnowledgeResponseIntent` · key `com_apple_generativeassistanttools_generative_assistant_extension_generate_knowledge_response`
  
This intent accepts a knowledge-seeking request and delegates the request to ChatGPT, which actually performs it and propagates back the generative result.
  
Output: GenerativeResponse AppEntity `com.apple.generativeassistanttools.GenerativeAssistantExtension.GenerativeResponseEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `explicitInvocation` | Explicit Invocation | bool | bool |
| `partner` | Partner | string | enum: `chatGPT`, `other` |
| `userQuery` | User Query | text | string |
| `additionalInfo` | Additional Information | text | string |
| `ShowWhenRun` | Show When Run | bool | bool |

### Generate Rich Content From Media

`com.apple.generativeassistanttools.GenerativeAssistantExtension.GenerateRichContentFromMediaIntent` · key `com_apple_generativeassistanttools_generative_assistant_extension_generate_rich_content_from_media`
  
This intent answers a user query about on screen content, e.g., image, pdf, webpage, by delegating the request to ChatGPT in order to provide a generative response.
  
Output: GenerativeResponse AppEntity `com.apple.generativeassistanttools.GenerativeAssistantExtension.GenerativeResponseEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `explicitInvocation` | Explicit Invocation | bool | bool |
| `partner` | Partner | string | enum: `chatGPT`, `other` |
| `directInvocationClient` | Direct Invocation Client | string | enum: `visualIntelligence` |
| `additionalInfo` | Additional Information | text | string |
| `userQuery` | User Query | text | string |
| `ShowWhenRun` | Show When Run | bool | bool |

### Generate Rich Content

`com.apple.generativeassistanttools.GenerativeAssistantExtension.GenerateRichContentIntent` · key `com_apple_generativeassistanttools_generative_assistant_extension_generate_rich_content`
  
This intent accepts a user request to generate a type of text content (for example ‘email’, ‘note’, ‘paragraph’) and delegates the request to ChatGPT, which actually performs it and propagates back the generative result.
  
Output: GenerativeResponse AppEntity `com.apple.generativeassistanttools.GenerativeAssistantExtension.GenerativeResponseEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `explicitInvocation` | Explicit Invocation | bool | bool |
| `partner` | Partner | string | enum: `chatGPT`, `other` |
| `userQuery` | User Query | text | string |
| `additionalInfo` | Additional Information | text | string |
| `ShowWhenRun` | Show When Run | bool | bool |

### On Screen Content Intent

`com.apple.generativeassistanttools.GenerativeAssistantExtension.OnScreenContentIntent` · key `com_apple_generativeassistanttools_generative_assistant_extension_on_screen_content_intent`
  
Output: GenerativeResponse AppEntity `com.apple.generativeassistanttools.GenerativeAssistantExtension.OnScreenContentEntity`

### Prewarm GenerativeAssistantExtension

`com.apple.generativeassistanttools.GenerativeAssistantExtension.PrewarmGenerativeAssistantExtensionIntent` · key `com_apple_generativeassistanttools_generative_assistant_extension_prewarm_generative_assistant_extension`
  
Output:  `bool`

## GenerativePartnerPrototypeExtension (`com.apple.gms.GenerativePartnerPrototypeExtension`)

### Generative Partner Prototype

`com.apple.gms.GenerativePartnerPrototypeExtension.GenerativePartnerPrototypeIntentChatGPT` · key `com_apple_gms_generative_partner_prototype_extension_generative_partner_prototype`
  
Output: Model Delegation Response `com.apple.AppIntents.AppIntents._ModelDelegationResultEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `prompt` | Prompt | any | entity AppIntents.IntentPromptEntity |
| `conversationIdentifier` | Conversation Identifier | text | string |
| `configuration` | Configuration | any | entity AppIntents._ModelDelegationConfigurationEntity |

## GetCurrentLocationFlowToolPlugin (`com.apple.intelligenceflow.GetCurrentLocationFlowToolPlugin`)

### GetCurrentLocationTool

`com.apple.intelligenceflow.GetCurrentLocationFlowToolPlugin.GetCurrentLocationFlowToolPlugin.GetCurrentLocationTool` · key `-`
  
A standalone tool to get the user's location.
  
Output:  `none`

## Home (`com.apple.Home`)

### Find 

`com.apple.Home.CameraClipEntity` · key `home_find`
  
Output: CameraClipEntity `com.apple.Home.CameraClipEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `startDate` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | cameraclipentity | string | enum: `Library` |

### Find Device

`com.apple.Home.DeviceEntity` · key `home_find_device`
  
Output: Device `com.apple.Home.DeviceEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `name` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | device | string | enum: `Library` |

### HomeAppIntentsExtensionTestAppIntent

`com.apple.Home.HomeAppIntentsExtensionTestAppIntent` · key `com_apple_home_app_intents_extension_home_app_intents_extension_test_app_intent`
  
Output:  `none`

### Find Room

`com.apple.Home.RoomEntity` · key `home_find_room`
  
Output: Room `com.apple.Home.RoomEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `name` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | room | string | enum: `Library` |

### Find Scene

`com.apple.Home.SceneEntity` · key `home_find_scene`
  
Output: Scene `com.apple.Home.SceneEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `name` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | scene | string | enum: `Library` |

### Find Selected Home

`com.apple.Home.SelectedHomeEntity` · key `home_find_selected_home`
  
Output: Selected Home `com.apple.Home.SelectedHomeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | selected home | string | enum: `Library` |

### Toggle Accessory or Scene

`com.apple.Home.ToggleIntent` · key `home_toggle_accessory_or_scene`
  
Toggles the state of the specified accessory or scene.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Toggle | any | entity AccessoryAndSceneEntity |

### Find Zone

`com.apple.Home.ZoneEntity` · key `home_find_zone`
  
Output: Zone `com.apple.Home.ZoneEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `name` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zone | string | enum: `Library` |

## Image Playground (`com.apple.GenerativePlaygroundApp`)

### Create Image

`com.apple.GenerativePlaygroundApp.CreateImageIntent` · key `com_apple_generative_playground_app_create_image`
  
Creates an image with the specified description.
  
Output: Image `com.apple.GenerativePlaygroundApp.GeneratedImageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `prompt` | Description | text | string |
| `style` | Style | any | entity ImagePlaygroundStyleEntity |
| `input_image_path` | Photo | any | file |
| `previously_generated_image_id` | Generated Image Identifier | text | string |
| `ShowWhenRun` | Show When Run | bool | bool |

### Create Image

`com.apple.GenerativePlaygroundApp.GenerateImageIntent` · key `com_apple_generative_playground_app_create_image`
  
Creates an image with the specified description.
  
Output: Image `file`

| Key | Name | Kind | Type |
|---|---|---|---|
| `prompt` | Description | text | string |
| `style` | Style | any | entity ImagePlaygroundStyleEntity |
| `image` | Photo | any | file |
| `saveToLibrary` | Save to Playground | string | enum: `always`, `askWhenRun`, `never` |

## IntelligenceFlowAppIntentsExtension (`com.apple.intelligenceflow.IntelligenceFlowAppIntentsExtension`)

### Open Application

`com.apple.intelligenceflow.IntelligenceFlowAppIntentsExtension.OpenApplication` · key `com_apple_intelligenceflow_intelligence_flow_app_intents_extension_open_application`
  
Open Application
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Application | any | app |

### Open File

`com.apple.intelligenceflow.IntelligenceFlowAppIntentsExtension.OpenFile` · key `com_apple_intelligenceflow_intelligence_flow_app_intents_extension_open_file`
  
Open File
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | File | any | file |

### Open URL

`com.apple.intelligenceflow.IntelligenceFlowAppIntentsExtension.OpenURL` · key `com_apple_intelligenceflow_intelligence_flow_app_intents_extension_open_url`
  
Open URL
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | URL | text | url |

## IntelligencePlatformDataActionsAppIntentsExtension (`com.apple.intelligenceplatform.IntelligencePlatform.IntelligencePlatformDataActionsAppIntentsExtension`)

### Get App & Website Activity

`com.apple.intelligenceplatform.IntelligencePlatform.IntelligencePlatformDataActionsAppIntentsExtension.CalculateAppUsageIntent` · key `com_apple_intelligenceplatform_intelligence_platform_intelligence_platform_data_actions_app_intents_extension_get_app_website_activity`
  
Gets app and website activity for the specified device and date range.
  
Output: Activity `com.apple.intelligenceplatform.IntelligencePlatform.IntelligencePlatformDataActionsAppIntentsExtension.AppUsageResultEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `during` | during | string | enum: `inBetween`, `lastWeek`, `specifiedDay`, `thisMonth`, `thisWeek`, `today`, `yesterday` |
| `selectedDevice` | Device | any | entity |
| `activityType` | Type | string | enum: `all`, `app`, `website` |
| `startTime` | Start Date | any | date |
| `endTime` | End Date | any | date |

### Get Upcoming Sports Events

`com.apple.intelligenceplatform.IntelligencePlatform.IntelligencePlatformDataActionsAppIntentsExtension.FindSportsEvents` · key `com_apple_sports_get_upcoming_sports_events`
  
Gets upcoming events for the specified team, ordered from nearest to farthest away in time.
  
Output: Events `com.apple.intelligenceplatform.IntelligencePlatform.IntelligencePlatformDataActionsAppIntentsExtension.SportsEventAppEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `sportsTeamAppEntity` | Team | any | entity SportsTeamAppEntity |

## Journal (`com.apple.journal`)

### Get Add Current Location

`com.apple.journal.AddCurrentLocationEntity` · key `com_apple_preferences_get_add_current_location`
  
Output: Add Current Location `com.apple.journal.AddCurrentLocationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | add current location | string | enum: `Library` |

### Update Add Current Location

`com.apple.journal.AddCurrentLocationEntity-UpdatableEntity` · key `com_apple_preferences_update_add_current_location`
  
Change the Add Current Location value of Add Current Location
  
Output: Add Current Location `com.apple.journal.AddCurrentLocationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Add Current Location | any | entity AddCurrentLocationEntity |
| `value` | Add Current Location to update on Add Current Location | bool | bool |

### Open Add Current Location Setting

`com.apple.journal.AddCurrentLocationIntent` · key `com_apple_preferences_open_add_current_location_setting`
  
Open the Add Current Location Setting in the Journal Settings pane.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Add Current Location | any | entity AddCurrentLocationEntity |

### Get Always Use Moment Date

`com.apple.journal.AlwaysUseMomentDateEntity` · key `com_apple_preferences_get_always_use_moment_date`
  
Output: Always Use Moment Date `com.apple.journal.AlwaysUseMomentDateEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | always use moment date | string | enum: `Library` |

### Update Always Use Moment Date

`com.apple.journal.AlwaysUseMomentDateEntity-UpdatableEntity` · key `com_apple_preferences_update_always_use_moment_date`
  
Change the Always Use Moment Date value of Always Use Moment Date
  
Output: Always Use Moment Date `com.apple.journal.AlwaysUseMomentDateEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Always Use Moment Date | any | entity AlwaysUseMomentDateEntity |
| `value` | Always Use Moment Date to update on Always Use Moment Date | bool | bool |

### Open Always Use Moment Date Setting

`com.apple.journal.AlwaysUseMomentDateIntent` · key `com_apple_preferences_open_always_use_moment_date_setting`
  
Open the Always Use Moment Date Setting in the Journal Settings pane.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Always Use Moment Date | any | entity AlwaysUseMomentDateEntity |

### Create Audio Entry

`com.apple.journal.CreateEntryAudioIntent` · key `com_apple_journal_create_audio_entry`
  
Creates a new audio journal entry.
  
Output:  `none`

### Create Entry

`com.apple.journal.CreateEntryIntent` · key `com_apple_journal_create_entry`
  
Creates a new journal entry.
  
Output: Journal Entry `com.apple.journal.JournalEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `message` | Message | text | richText |
| `title` | Title | text | string |
| `locationName` | Location Name | text | string |
| `mediaItems` | Media Items | any | file |
| `location` | Location | any | entity GeoToolbox.PlaceDescriptorEntity |
| `entryBookmark` | Add Bookmark | bool | bool |
| `entryDate` | Date | any | date |
| `OpenWhenRun` | Open When Run | bool | bool |

### Open Journal Settings

`com.apple.journal.OpenJournalSettingsDeeplinks` · key `com_apple_preferences_open_journal_settings`
  
Open Journal settings.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Journal Settings Deeplink | string | enum: `addEntryTitle`, `journalHealthData`, `lockJournal`, `notifications`, `root` |

### Get Save To Photos

`com.apple.journal.SaveToPhotosEntity` · key `com_apple_preferences_get_save_to_photos`
  
Output: Save To Photos `com.apple.journal.SaveToPhotosEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | save to photos | string | enum: `Library` |

### Update Save To Photos

`com.apple.journal.SaveToPhotosEntity-UpdatableEntity` · key `com_apple_preferences_update_save_to_photos`
  
Change the Save To Photos value of Save To Photos
  
Output: Save To Photos `com.apple.journal.SaveToPhotosEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Save To Photos | any | entity SaveToPhotosEntity |
| `value` | Save To Photos to update on Save To Photos | bool | bool |

### Open Save to Photos Setting

`com.apple.journal.SaveToPhotosIntent` · key `com_apple_preferences_open_save_to_photos_setting`
  
Open the Save to Photos Setting in the Journal Settings pane.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Save To Photos | any | entity SaveToPhotosEntity |

### Search Entries

`com.apple.journal.SearchEntriesIntent` · key `com_apple_journal_search_entries`
  
Searches journal entries.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Entry | text | string |

### Get Show Writing Prompts

`com.apple.journal.ShowWritingPromptsEntity` · key `com_apple_preferences_get_show_writing_prompts`
  
Output: Show Writing Prompts `com.apple.journal.ShowWritingPromptsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show writing prompts | string | enum: `Library` |

### Update Show Writing Prompts

`com.apple.journal.ShowWritingPromptsEntity-UpdatableEntity` · key `com_apple_preferences_update_show_writing_prompts`
  
Change the Show Writing Prompts value of Show Writing Prompts
  
Output: Show Writing Prompts `com.apple.journal.ShowWritingPromptsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show Writing Prompts | any | entity ShowWritingPromptsEntity |
| `value` | Show Writing Prompts to update on Show Writing Prompts | bool | bool |

### Open Show Writing Prompts Setting

`com.apple.journal.ShowWritingPromptsIntent` · key `com_apple_preferences_open_show_writing_prompts_setting`
  
Open the Show Writing Prompts Setting in the Journal Settings pane.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Show Writing Prompts | any | entity ShowWritingPromptsEntity |

### Get Show Suggested Moments

`com.apple.journal.SkipJournalingSuggestionsEntity` · key `com_apple_preferences_get_show_suggested_moments`
  
Output: Show Suggested Moments `com.apple.journal.SkipJournalingSuggestionsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show suggested moments | string | enum: `Library` |

### Update Show Suggested Moments

`com.apple.journal.SkipJournalingSuggestionsEntity-UpdatableEntity` · key `com_apple_preferences_update_show_suggested_moments`
  
Change the Show Suggested Moments value of Show Suggested Moments
  
Output: Show Suggested Moments `com.apple.journal.SkipJournalingSuggestionsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show Suggested Moments | any | entity SkipJournalingSuggestionsEntity |
| `value` | Show Suggested Moments to update on Show Suggested Moments | bool | bool |

### Open Show Suggested Moments Setting

`com.apple.journal.SkipJournalingSuggestionsIntent` · key `com_apple_preferences_open_show_suggested_moments_setting`
  
Open the Show Suggested Moments Setting in the Journal Settings pane.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Show Suggested Moments | any | entity SkipJournalingSuggestionsEntity |

## Keynote (`com.apple.iWork.Keynote`)

### Export Presentation in Background

`com.apple.iWork.Keynote.KNDocumentBackgroundExportIntent` · key `com_apple_i_work_keynote_export_presentation_in_background`
  
Exports a presentation to a specified file format. Does not open the presentation or bring it to the foreground.
  
Output:  `file`

| Key | Name | Kind | Type |
|---|---|---|---|
| `document` | Presentation | any | entity KNDocumentEntity |
| `format` | Format | string | enum: `pdf`, `powerpoint` |
| `sourcePassword` | Source Password | text | string |
| `password` | Export Password | text | string |

### Create New Presentation

`com.apple.iWork.Keynote.KNNewDocumentIntent` · key `com_apple_i_work_keynote_create_new_presentation`
  
Create a new presentation from the theme chooser in Keynote.
  
Output:  `none`

## Magnifier (`com.apple.Magnifier`)

### Ask a Question

`com.apple.Magnifier.AskVQAIntent` · key `com_apple_magnifier_ask_a_question`
  
Ask a question about the current camera view.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `prompt` | Prompt | text | string |

### Describe This

`com.apple.Magnifier.DescribeThisIntent` · key `com_apple_magnifier_describe_this`
  
Provide a description of what’s in the camera view.
  
Output:  `none`

### Detect Doors

`com.apple.Magnifier.DetectDoorsIntent` · key `com_apple_magnifier_detect_doors`
  
Use the camera to detect doors near you.
  
Output:  `none`

### Detect Furniture

`com.apple.Magnifier.DetectFurnitureIntent` · key `com_apple_magnifier_detect_furniture`
  
Use the camera to detect furniture around you. If people detection is also on, you can also get information about seat occupancy.
  
Output:  `none`

### Detect People

`com.apple.Magnifier.DetectPeopleIntent` · key `com_apple_magnifier_detect_people`
  
Use the camera to detect people near you.
  
Output:  `none`

### Detect Text

`com.apple.Magnifier.DetectTextIntent` · key `com_apple_magnifier_detect_text`
  
Use the camera to detect text around you.
  
Output:  `none`

### Find This

`com.apple.Magnifier.FindSessionAppIntent` · key `com_apple_magnifier_find_this`
  
FIND_SESSION_VQA_APP_INTENT_DESCRIPTION
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `searchTerm` | Search Term | text | string |

### Follow Up

`com.apple.Magnifier.FollowUpVQAAppIntent` · key `com_apple_magnifier_follow_up`
  
Ask a follow-up question about the current camera view.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `prompt` | Prompt | text | string |

### Start Point & Speak

`com.apple.Magnifier.PointAndSpeakIntent` · key `com_apple_magnifier_start_point_speak`
  
Detect text near your finger.
  
Output:  `none`

### Open Reader

`com.apple.Magnifier.ReaderModeIntent` · key `com_apple_magnifier_open_reader`
  
Open Reader in Magnifier
  
Output:  `none`

### Detect Items

`com.apple.Magnifier.StartDetectionTypeIntent` · key `com_apple_magnifier_detect_items`
  
Detect people, doors, text or furniture in Camera view
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `detectionType` | Items | string | enum: `doors`, `furniture`, `people`, `text` |

### What Color Is This

`com.apple.Magnifier.WhatColorIsThisIntent` · key `com_apple_magnifier_what_color_is_this`
  
Describe the color in the camera view.
  
Output:  `none`

## Mail (`com.apple.mail`)

### Archive Message

`com.apple.mail.ArchiveMessageIntent` · key `mail_archive_message`
  
Archives one or more email messages.
  
Output: Message `com.apple.mail.MailMessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Messages | any | entity MailMessageEntity |
| `ShowWhenRun` | Show When Run | bool | bool |

### Compose Message

`com.apple.mail.ComposeMessageIntent` · key `mail_compose_message`
  
Opens an email composer to draft an email. Does not send the email draft.
  
Output: Draft Message `com.apple.mail.DraftMessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `to` | Recipient | any | person |
| `cc` | Cc | any | person |
| `bcc` | Bcc | any | person |
| `subject` | Subject | text | string |
| `body` | Body | text | richText |
| `account` | From | any | entity AccountEntity |
| `attachments` | Attachments | any | file |

### Delete Draft

`com.apple.mail.DeleteDraftIntent` · key `mail_delete_draft`
  
Deletes one or more email drafts.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Draft | any | entity DraftMessageEntity |

### Delete Message

`com.apple.mail.DeleteMessageIntent` · key `mail_delete_message`
  
Deletes one or more email messages.
  
Output: Message `com.apple.mail.MailMessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Messages | any | entity MailMessageEntity |

### Find Draft Message

`com.apple.mail.DraftMessageEntity` · key `mail_find_draft_message`
  
Output: Draft Message `com.apple.mail.DraftMessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `bcc`, `body`, `cc`, `subject`, `to` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | draft message | string | enum: `Library` |

### Forward Message

`com.apple.mail.ForwardMessageIntent` · key `mail_forward_message`
  
Opens an email composer to forward an email. Does not send the email draft.
  
Output: Draft Message `com.apple.mail.DraftMessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `to` | Recipient | any | person |
| `cc` | Cc | any | person |
| `bcc` | Bcc | any | person |
| `subject` | Subject | text | string |
| `body` | Body | text | richText |
| `account` | From | any | entity AccountEntity |
| `attachments` | Attachments | any | file |
| `target` | Message | any | entity MailMessageEntity |

### Find Message

`com.apple.mail.MailMessage` · key `mail_find_message`
  
Output: Message `com.apple.mail.MailMessage`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `dateReceived` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | message | string | enum: `Library` |

### Find Message

`com.apple.mail.MailMessageEntity` · key `mail_find_message`
  
Output: Message `com.apple.mail.MailMessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `body`, `dateReceived`, `isRead`, `subject` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | message | string | enum: `Library` |

### Reply Message

`com.apple.mail.ReplyMessageIntent` · key `mail_reply_message`
  
Opens an email composer to reply to an email. Does not send the email draft.
  
Output: Draft Message `com.apple.mail.DraftMessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `to` | Recipient | any | person |
| `cc` | Cc | any | person |
| `bcc` | Bcc | any | person |
| `subject` | Subject | text | string |
| `body` | Body | text | richText |
| `account` | From | any | entity AccountEntity |
| `attachments` | Attachments | any | file |
| `isReplyAll` | Reply All | bool | bool |
| `target` | Message | any | entity MailMessageEntity |

### Save Draft

`com.apple.mail.SaveDraftIntent` · key `mail_save_draft`
  
Saves an email draft.
  
Output: Draft Message `com.apple.mail.DraftMessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Draft | any | entity DraftMessageEntity |
| `ShowWhenRun` | Show When Run | bool | bool |

### Show Siri Search Results

`com.apple.mail.SearchMailEntityIntent` · key `mail_show_siri_search_results`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Criteria | any | entity MailMessageEntity |

### Search

`com.apple.mail.SearchMailIntent` · key `mail_search`
  
Navigate to search results.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Text | text | string |

### Send Draft

`com.apple.mail.SendDraftIntent` · key `mail_send_draft`
  
Sends an email draft or schedules it to be sent later.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `sendLaterDate` | Schedule for Date | any | date |
| `target` | Draft | any | entity DraftMessageEntity |
| `ShowWhenRun` | Show When Run | bool | bool |

### Send an Email

`com.apple.mail.SendMail` · key `mail_send_an_email`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `to` | To | any | entity MailAddresseeEntity |
| `cc` | Cc | any | entity MailAddresseeEntity |
| `bcc` | Bcc | any | entity MailAddresseeEntity |
| `subject` | Subject | text | string |
| `body` | Body | text | richText |
| `account` | Account | any | entity MailAccountEntity |
| `attachments` | Attachments | any | file |
| `inReplyTo` | Reply Message | any | entity MailMessage |

### Mark Email Read

`com.apple.mail.SetMailMessageIsRead` · key `mail_mark_email_read`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `message` | Message | any | entity MailMessage |
| `read` | Read | bool | bool |

### Undo Send Message

`com.apple.mail.UndoSendMessageIntent` · key `mail_undo_send_message`
  
Undo an email message that has just been sent
  
Output:  `none`

### Unsubscribe Message

`com.apple.mail.UnsubscribeMessageIntent` · key `mail_unsubscribe_message`
  
Unsubscribe from one or more email messages
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `messages` | Messages | any | entity MailMessageEntity |
| `ShowWhenRun` | Show When Run | bool | bool |

### Update Message

`com.apple.mail.UpdateMessageIntent` · key `mail_update_message`
  
Makes updates to one or more existing email messages by modifying the status, flags, and location.
  
Output: Message `com.apple.mail.MailMessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Message | any | entity MailMessageEntity |
| `isRead` | Read | bool | bool |
| `isFlagged` | Flagged | bool | bool |
| `isJunk` | Junk | bool | bool |
| `flagColor` |  | string | enum: `blue`, `defaultColor`, `gray`, `green`, `orange`, `purple`, `red`, `yellow` |
| `mailbox` | Mailbox | any | entity MailboxEntity |

### CreateDraftMailTool

`com.apple.siri.SiriMailFlowTools.SiriMailFlowTools.CreateDraftMailTool|com.apple.mail` · key `-`
  
Create a new email draft.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `to` | Recipient | any | person |
| `cc` | Cc | any | person |
| `bcc` | Bcc | any | person |
| `subject` | Subject | text | string |
| `body` | Body | text | richText |
| `account` | From | any | entity AccountEntity |
| `attachments` | Attachments | any | file |

### ForwardDraftMailTool

`com.apple.siri.SiriMailFlowTools.SiriMailFlowTools.ForwardDraftMailTool|com.apple.mail` · key `-`
  
Create a forwarding email draft.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `to` | Recipient | any | person |
| `cc` | Cc | any | person |
| `bcc` | Bcc | any | person |
| `subject` | Subject | text | string |
| `body` | Body | text | richText |
| `account` | From | any | entity AccountEntity |
| `attachments` | Attachments | any | file |
| `target` | Message | any | entity MailMessageEntity |

### ReplyDraftMailTool

`com.apple.siri.SiriMailFlowTools.SiriMailFlowTools.ReplyDraftMailTool|com.apple.mail` · key `-`
  
Create a replying or replying all email draft.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `to` | Recipient | any | person |
| `cc` | Cc | any | person |
| `bcc` | Bcc | any | person |
| `subject` | Subject | text | string |
| `body` | Body | text | richText |
| `account` | From | any | entity AccountEntity |
| `attachments` | Attachments | any | file |
| `target` | Message | any | entity MailMessageEntity |
| `isReplyAll` | Reply All | bool | bool |

### SendDraftMailTool

`com.apple.siri.SiriMailFlowTools.SiriMailFlowTools.SendDraftMailTool|com.apple.mail` · key `-`
  
Send an email draft now or at a specified later time.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `sendLaterDate` | Schedule for Date | any | date |
| `target` | Draft | any | entity DraftMessageEntity |

### UpdateDraftMailTool

`com.apple.siri.SiriMailFlowTools.SiriMailFlowTools.UpdateDraftMailTool|com.apple.mail` · key `-`
  
Update an email draft.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `to` | Recipient | any | person |
| `cc` | Cc | any | person |
| `bcc` | Bcc | any | person |
| `subject` | Subject | text | string |
| `body` | Body | text | richText |
| `account` | From | any | entity AccountEntity |
| `attachments` | Attachments | any | file |
| `target` | Draft | any | entity DraftMessageEntity |

## Maps (`com.apple.Maps`)

### Calculate ETA

`com.apple.Maps.CalculateETAIntent` · key `maps_calculate_eta`
  
Calculate Estimated Time of Arrival
  
Output: ETA `com.apple.Maps.ETAEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `origin` | Origin | any | entity PlaceEntity |
| `destination` | Destination | any | entity PlaceEntity |
| `transportationType` | Transport Type | string | enum: `any`, `cycling`, `driving`, `transit`, `walking` |
| `departureTime` | Departure Time | any | date |
| `preferences` | Navigation Preferences | string | enum: `avoidBusyRoads`, `avoidHighways`, `avoidHills`, `avoidStairs`, `avoidTolls`, `disableBus`, `disableFerry`, `disableSubway`, `disableTrain` |
| `ShowWhenRun` | Show When Run | bool | bool |

### Get Current Location

`com.apple.Maps.CurrentLocationEntity` · key `maps_get_current_location`
  
Output: Current Location `com.apple.Maps.CurrentLocationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | current location | string | enum: `Library` |

### MapsIntents Debug Dispatch

`com.apple.Maps.MapsIntentsDebugDispatch` · key `maps_maps_intents_debug_dispatch`
  
Output: ETA `com.apple.Maps.ETAEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `testCase` | Test Case | string | enum: `calculateETACycling`, `calculateETADriving`, `calculateETADrivingAvoidHighways`, `calculateETADrivingAvoidHighwaysAndTolls`, `calculateETADrivingAvoidTolls`, `calculateETAExplicitPlaces`, `calculateETALongDistance`, `calculateETANoRoute`, `calculateETAOriginAsCurrentLocation`, `calculateETAOriginNearCurrentLocation`, `calculateETAOriginOutsideCurrentLocationThreshold`, `calculateETATransit` … |
| `ShowWhenRun` | Show When Run | bool | bool |

### Shows List of Places

`com.apple.Maps.MapsShowPlacesInAppIntent` · key `maps_shows_list_of_places`
  
Shows List of Places
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `places` | Places | any | entity CurrentLocationEntity |
| `attributes` | Attributes | string | enum: `address`, `businessHours`, `phoneNumber`, `postalCode`, `priceRange`, `rating`, `structuredAttribute` |
| `languageId` | Language Id | text | string |

### Get Current Route

`com.apple.Maps.NavigationSessionEntity` · key `maps_get_current_route`
  
Output: Current Route `com.apple.Maps.NavigationSessionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `estimatedArrivalDate`, `preferences`, `transportationType`, `waypoints` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | current route | string | enum: `Library` |

### Get Parking Location

`com.apple.Maps.ParkingLocationDataEntity` · key `maps_get_parking_location`
  
Output: Parking Location `com.apple.Maps.ParkingLocationDataEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `image`, `note`, `place`, `time` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | parking location | string | enum: `Library` |

### Search Places

`com.apple.Maps.SearchPlacesIntent` · key `maps_search_places`
  
Output: Location `com.apple.-GeoToolbox-AppIntents.GeoToolbox.PlaceDescriptorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `searchQuery` | Search Query | text | string |
| `deviceLocation` | Device Location | any | entity GeoToolbox.PlaceDescriptorEntity |
| `maxResults` | Max Results | number | int |
| `filterTypes` | Filter Types | string | enum: `address`, `physicalFeature`, `poi` |
| `appIdentifier` | App Identifier | text | string |
| `viewport` | Viewport | any | entity ViewportEntity |

### Start Navigation in Maps

`com.apple.Maps.StartNavigationIntent` · key `maps_start_navigation_in_maps`
  
Start Navigation
  
Output: Current Route `com.apple.Maps.NavigationSessionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `origin` | Origin | any | entity CurrentLocationEntity |
| `destinations` | Destinations | any | entity CurrentLocationEntity |
| `transportationType` | Transport Type | string | enum: `any`, `cycling`, `driving`, `transit`, `walking` |
| `preferences` | Navigation Preferences | string | enum: `avoidBusyRoads`, `avoidHighways`, `avoidHills`, `avoidStairs`, `avoidTolls`, `disableBus`, `disableFerry`, `disableSubway`, `disableTrain` |
| `OpenWhenRun` | Open When Run | bool | bool |

### Test: Drive to Apple Park

`com.apple.Maps.TestStartNavigationIntent` · key `maps_test_drive_to_apple_park`
  
Output: Current Route `com.apple.Maps.NavigationSessionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `OpenWhenRun` | Open When Run | bool | bool |

### Test: Update Navigation Waypoints

`com.apple.Maps.TestUpdateNavigationIntent` · key `maps_test_update_navigation_waypoints`
  
Output: Current Route `com.apple.Maps.NavigationSessionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `testCase` | Test Case | string | enum: `add`, `diagnose`, `insert`, `remove` |
| `OpenWhenRun` | Open When Run | bool | bool |

### Add stops

`com.apple.Maps.UpdateNavigationIntent` · key `maps_add_stops`
  
maps_MapsUpdateNavigationWaypointsIntent_1.0.0_intent_description
  
Output: Current Route `com.apple.Maps.NavigationSessionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `navigation` | Navigation Session | any | entity NavigationSessionEntity |
| `waypoints` | Waypoints | any | entity CurrentLocationEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Start Navigation

`com.apple.intelligenceflow.GeoFlowTools.GeoFlowTools.StartNavigationFlowTool|com.apple.Maps` · key `-`
  
Start navigation from origin to destinations
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `origin` | Origin | any | entity CurrentLocationEntity |
| `destinations` | Destinations | any | entity CurrentLocationEntity |
| `transportationType` | Transport Type | string | enum: `any`, `cycling`, `driving`, `transit`, `walking` |
| `preferences` | Navigation Preferences | string | enum: `avoidBusyRoads`, `avoidHighways`, `avoidHills`, `avoidStairs`, `avoidTolls`, `disableBus`, `disableFerry`, `disableSubway`, `disableTrain` |

### Update Navigation Waypoints

`com.apple.intelligenceflow.GeoFlowTools.GeoFlowTools.UpdateWayPointsFlowTool|com.apple.Maps` · key `-`
  
Replace the active navigation session's waypoints with the provided list.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `waypoints` | Waypoints | any | entity CurrentLocationEntity |
| `navigation` | Navigation Session | any | entity NavigationSessionEntity |

## MediaRemoteAppIntentsExtension (`com.apple.MediaRemoteAppIntentsExtension`)

### ConnectToSpeakerIntent

`com.apple.MediaRemoteAppIntentsExtension.ConnectToSpeakerIntent` · key `com_apple_media_remote_app_intents_extension_connect_to_speaker_intent`
  
Establish a connection with remote speakers to allow for starting playback on those speakers
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `application` | Application | any | app |
| `destinations` | Destinations | any | entity MediaControlsDevice |
| `requestIdentifierOverride` |  | text | string |

## Messages (`com.apple.MobileSMS`)

### Open Inbox

`com.apple.MobileSMS.ChangeFilterModeIntent` · key `messages_open_inbox`
  
Opens the specified inbox in Messages.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `filterMode` | Inbox | string | enum: `1`, `10`, `11`, `12`, `13`, `14`, `15`, `16`, `17`, `18`, `19`, `2` … |

### Find Conversation

`com.apple.MobileSMS.ConversationEntity` · key `messages_find_conversation`
  
Output: Conversation `com.apple.MobileSMS.ConversationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `dateLastActive`, `displayName` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | conversation | string | enum: `Library` |

### Delete Conversations

`com.apple.MobileSMS.DeleteConversationIntent` · key `messages_delete_conversations`
  
Deletes the specified conversations.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Conversations | any | entity ConversationEntity |

### Delete Messages

`com.apple.MobileSMS.DeleteMessageIntent` · key `messages_delete_messages`
  
Deletes the specified messages. To pass messages to this action, use the Find Message action or a Message automation.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Messages | any | entity MessageEntity |
| `WFLinkMessagesEntityVariablePickerKey` | Messages | any | entity WFContentItem |

### Draft Message

`com.apple.MobileSMS.DraftMessageIntent` · key `messages_draft_message`
  
Opens the Messages app with a new draft.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `destination` | To | any | entity ConversationEntity |
| `subject` | Subject | text | richText |
| `content` | Content | text | richText |
| `audioMessage` | Audio Message | any | file |
| `attachments` | Attachments | any | file |
| `locations` | Locations | any | entity GeoToolbox.PlaceDescriptorEntity |
| `links` | Links | text | url |
| `scheduledDate` | Date | any | date |

### Edit Sent Message

`com.apple.MobileSMS.EditSentMessageIntent` · key `messages_edit_sent_message`
  
Edit an already sent message with new content
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `message` | Message | any | entity MessageEntity |
| `content` | Content | text | richText |

### Mark as Read

`com.apple.MobileSMS.MarkConversationAsUnreadIntent` · key `messages_mark_as_read`
  
Marks a specific conversation as read or unread.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `operation` | Action | string | enum: `mark`, `toggle` |
| `conversation` | Conversation | any | entity ConversationEntity |
| `unreadState` | Read or Unread | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Find Message

`com.apple.MobileSMS.MessageEntity` · key `messages_find_message`
  
Output: Message `com.apple.MobileSMS.MessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `body`, `date`, `isRead`, `subject` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | message | string | enum: `Library` |

### Open Conversation

`com.apple.MobileSMS.OpenConversationIntent` · key `messages_open_conversation`
  
Opens a specific conversation in Messages.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Conversation | any | entity ConversationEntity |

### Reveal Message

`com.apple.MobileSMS.OpenMessageIntent` · key `messages_reveal_message`
  
Shows a specific message in Messages.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Message | any | entity MessageEntity |

### Remove Tapback

`com.apple.MobileSMS.RemoveTapbackIntent` · key `messages_remove_tapback`
  
Removes the Tapback on the specific message.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `message` | Message | any | entity MessageEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Search in Messages

`com.apple.MobileSMS.SearchMessagesIntent` · key `messages_search_in_messages`
  
Search messages and attachments for the provided search term.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Text | text | string |

### Send Collaboration Message

`com.apple.MobileSMS.SendCollaborationMessageIntent` · key `messages_send_collaboration_message`
  
Send a collaboration invitation message to recipients via Messages
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `destination` | To | any | entity ConversationEntity |

### Send Message

`com.apple.MobileSMS.SendMessageIntent` · key `messages_send_message`
  
Sends a message with the associated parameters
  
Output: Message `com.apple.MobileSMS.MessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `destination` | To | any | entity ConversationEntity |
| `subject` | Subject | text | richText |
| `content` | Content | text | richText |
| `audioMessage` | Audio Message | any | file |
| `attachments` | Attachments | any | file |
| `locations` | Locations | any | entity GeoToolbox.PlaceDescriptorEntity |
| `links` | Links | text | url |
| `scheduledDate` | Date | any | date |

### Send Tapback

`com.apple.MobileSMS.SendMessageReactionIntent` · key `messages_send_tapback`
  
React to the specified message with a Tapback. To pass a message to this action, use the Find Message action or a Message automation.
  
Output: Message `com.apple.MobileSMS.MessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `message` | Message | any | entity MessageEntity |
| `reaction` | Tapback | any | primitive208 |
| `WFLinkMessagesEntityVariablePickerKey` | Message | any | entity WFContentItem |

### Send Reply

`com.apple.MobileSMS.SendReplyIntent` · key `messages_send_reply`
  
Sends a reply to a specific message.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `content` | Message | text | richText |
| `message` | Message | any | entity MessageEntity |
| `subject` | Subject | text | richText |
| `OpenWhenRun` | Open When Run | bool | bool |

### Set Conversation Read Status

`com.apple.MobileSMS.SetConversationReadStatusIntent` · key `messages_set_conversation_read_status`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `conversation` | Conversation | any | entity ConversationEntity |
| `isRead` | Read Status | bool | bool |

### Set Message Read Status

`com.apple.MobileSMS.SetMessageReadStatusIntent` · key `messages_set_message_read_status`
  
Changes the message read status to a given value
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `message` | Message | any | entity MessageEntity |
| `isRead` | Read Status | bool | bool |

### Undo Send Message

`com.apple.MobileSMS.UnsendMessageIntent` · key `messages_undo_send_message`
  
Unsend a sent message
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `message` | Message | any | entity MessageEntity |

### Create Draft

`com.apple.siri.messages.SiriMessagesFlowTools.SiriMessagesFlowTools.CreateDraftMessageTool|com.apple.MobileSMS` · key `-`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `destination` | To | any | entity ConversationEntity |
| `subject` | Subject | text | richText |
| `content` | Content | text | richText |
| `attachments` | Attachments | any | file |
| `locations` | Locations | any | entity GeoToolbox.PlaceDescriptorEntity |
| `links` | Links | text | url |
| `audioMessage` | Audio Message | any | file |
| `isAudioMessage` | Is audio message | bool | bool |
| `scheduledDate` | Date | any | date |

### Prepare Conversation

`com.apple.siri.messages.SiriMessagesFlowTools.SiriMessagesFlowTools.PrepareToReadConversationTool|com.apple.MobileSMS` · key `-`
  
Takes a ConversationEntity and prepares it for reading.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `conversation` | conversation | any | entity ConversationEntity |

### Prepare Messages

`com.apple.siri.messages.SiriMessagesFlowTools.SiriMessagesFlowTools.PrepareToReadMessagesTool|com.apple.MobileSMS` · key `-`
  
Takes a list of MessageEntity objects and prepares them for reading.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `message` | messages | any | entity MessageEntity |

### Send Draft Message

`com.apple.siri.messages.SiriMessagesFlowTools.SiriMessagesFlowTools.SendDraftMessageTool|com.apple.MobileSMS` · key `-`
  
Send a message or text message that has already been drafted using a designated app. Requires an existing draft message id and the messaging app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `draft` | draft message | any | entity DraftMessageEntity |

### Send Message Reaction

`com.apple.siri.messages.SiriMessagesFlowTools.SiriMessagesFlowTools.SendMessageReactionTool|com.apple.MobileSMS` · key `-`
  
Send a reaction to a message.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `message` | Message | any | entity MessageEntity |
| `reaction` | Tapback | any | primitive208 |

### Update Draft

`com.apple.siri.messages.SiriMessagesFlowTools.SiriMessagesFlowTools.UpdateDraftMessageTool|com.apple.MobileSMS` · key `-`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `draft` | draft message | any | entity DraftMessageEntity |
| `destination` | To | any | entity ConversationEntity |
| `subject` | Subject | text | richText |
| `content` | Content | text | richText |
| `attachments` | Attachments | any | file |
| `locations` | Locations | any | entity GeoToolbox.PlaceDescriptorEntity |
| `links` | Links | text | url |
| `audioMessage` | Audio Message | any | file |
| `isAudioMessage` | Is audio message | bool | bool |
| `scheduledDate` | Date | any | date |

## Music (`com.apple.Music`)

### Add Music Items to Library

`com.apple.Music.AddMusicItemToLibrarySiriIntent` · key `music_add_music_items_to_library`
  
Adds the specified items to your Library
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity AlbumSiriEntity |
| `ShowWhenRun` | Show When Run | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Add Music Items to Playlist

`com.apple.Music.AddMusicItemToPlaylistSiriIntent` · key `music_add_music_items_to_playlist`
  
Adds the specified items to a playlist
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity AlbumSiriEntity |
| `playlist` | Playlist | any | entity PlaylistSiriEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Create station

`com.apple.Music.CreateStationSiriIntent` · key `music_create_station`
  
Start a station based on the current playlist item
  
Output:  `none`

### Open Music Item

`com.apple.Music.OpenMusicItemSiriIntent` · key `music_open_music_item`
  
Opens the specified item in Apple Music
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Target | any | entity AlbumSiriEntity |

### Play Audio

`com.apple.Music.PlayMusicItemSiriIntent` · key `music_play_audio`
  
Plays the specified item on the desired devices
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `warmupAudioQueueResult` | Warmup Audio Queue Result | any | entity WarmupMusicQueueResultSiriEntity |
| `audioEntity` | Audio Item | any | entity AlbumSiriEntity |
| `playbackAttributes` | Playback Attributes | string | enum: `repeat`, `shuffle` |
| `queueLocation` | Queue Location | string | enum: `next`, `tail` |

### SearchMusicSiriIntent_Title

`com.apple.Music.SearchMusicSiriIntent` · key `music_search_music_siri_intent_title`
  
SearchMusicSiriIntent_Description
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Text | text | string |

### Set Music Item Affinity

`com.apple.Music.UpdateMusicItemAffinitySiriIntent` · key `music_set_music_item_affinity`
  
Set the affinity of the specified item
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Target | any | entity AlbumSiriEntity |
| `affinityState` | Affinity State | string | enum: `dislike`, `like`, `unset` |
| `OpenWhenRun` | Open When Run | bool | bool |

### WarmupMusicQueueSiriIntent_Title

`com.apple.Music.WarmupMusicQueueSiriIntent` · key `music_warmup_music_queue_siri_intent_title`
  
WarmupMusicQueueSiriIntent_Description
  
Output: Warmup Audio Queue Result `com.apple.Music.WarmupMusicQueueResultSiriEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity AlbumSiriEntity |
| `playbackAttributes` | Playback Attributes | string | enum: `repeat`, `shuffle` |

### AddAudioToLibrary

`com.apple.siri.SiriAudioTools.SiriAudioTools.AddAudioToLibraryTool|com.apple.Music` · key `-`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity AlbumSiriEntity |

### AddAudioToPlaylist

`com.apple.siri.SiriAudioTools.SiriAudioTools.AddAudioToPlaylistTool|com.apple.Music` · key `-`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity AlbumSiriEntity |
| `playlist` | Playlist | any | entity PlaylistSiriEntity |

### PlayAudio

`com.apple.siri.SiriAudioTools.SiriAudioTools.PlayAudioTool|com.apple.Music` · key `-`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity AlbumSiriEntity |
| `playbackAttributes` | Playback Attributes | string | enum: `repeat`, `shuffle` |
| `queueLocation` | Queue Location | string | enum: `next`, `tail` |
| `destinations` | Destinations | any | entity MediaIntents.HomeDeviceGroupRepresentationEntity |

### UpdateAudioAffinity

`com.apple.siri.SiriAudioTools.SiriAudioTools.UpdateAudioAffinityTool|com.apple.Music` · key `-`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Target | any | entity AlbumSiriEntity |
| `affinityState` | Affinity State | string | enum: `dislike`, `like`, `unset` |

## Music Recognition (`com.apple.musicrecognition.mac`)

### Recognize Music

`com.apple.musicrecognition.mac.RecognizeAudioIntent` · key `com_apple_musicrecognition_mac_recognize_music`
  
Find out what song is playing nearby or on your Mac with Shazam.
  
Output: Song `com.apple.musicrecognition.mac.ShazamSongEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `addToLibrary` | Add to Library | bool | bool |
| `errorIfNotRecognized` | Error If Not Recognized | bool | bool |
| `ShowWhenRun` | Show When Run | bool | bool |

### Open Recognized Song

`com.apple.musicrecognition.mac.ShazamSongEntityOpenIntent` · key `com_apple_musicrecognition_mac_open_recognized_song`
  
Opens an item in the application.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Recognized Song to Open | any | entity ShazamSongEntity |

## News (`com.apple.news`)

### Get Automatically Download Audio Stories

`com.apple.news.AutoDownloadAudioStoriesEntity` · key `com_apple_preferences_get_automatically_download_audio_stories`
  
Output: Automatically Download Audio Stories `com.apple.news.AutoDownloadAudioStoriesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically download audio stories | string | enum: `Library` |

### Update Automatically Download Audio Stories

`com.apple.news.AutoDownloadAudioStoriesEntity-UpdatableEntity` · key `com_apple_preferences_update_automatically_download_audio_stories`
  
Change the Automatically Download Audio Stories value of Automatically Download Audio Stories
  
Output: Automatically Download Audio Stories `com.apple.news.AutoDownloadAudioStoriesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Automatically Download Audio Stories | any | entity AutoDownloadAudioStoriesEntity |
| `value` | Automatically Download Audio Stories to update on Automatically Download Audio Stories | bool | bool |

### Get Automatic Downloads

`com.apple.news.AutoDownloadEntity` · key `com_apple_preferences_get_automatic_downloads`
  
Output: Automatic Downloads `com.apple.news.AutoDownloadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatic downloads | string | enum: `Library` |

### Update Automatic Downloads

`com.apple.news.AutoDownloadEntity-UpdatableEntity` · key `com_apple_preferences_update_automatic_downloads`
  
Change the Automatic Downloads value of Automatic Downloads
  
Output: Automatic Downloads `com.apple.news.AutoDownloadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Automatic Downloads | any | entity AutoDownloadEntity |
| `value` | Automatic Downloads to update on Automatic Downloads | bool | bool |

### Get Automatically Download Magazine Issues

`com.apple.news.AutoDownloadMagazineIssuesEntity` · key `com_apple_preferences_get_automatically_download_magazine_issues`
  
Output: Automatically Download Magazine Issues `com.apple.news.AutoDownloadMagazineIssuesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically download magazine issues | string | enum: `Library` |

### Update Automatically Download Magazine Issues

`com.apple.news.AutoDownloadMagazineIssuesEntity-UpdatableEntity` · key `com_apple_preferences_update_automatically_download_magazine_issues`
  
Change the Automatically Download Magazine Issues value of Automatically Download Magazine Issues
  
Output: Automatically Download Magazine Issues `com.apple.news.AutoDownloadMagazineIssuesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Automatically Download Magazine Issues | any | entity AutoDownloadMagazineIssuesEntity |
| `value` | Automatically Download Magazine Issues to update on Automatically Download Magazine Issues | bool | bool |

### Get Automatically Download Puzzles

`com.apple.news.AutoDownloadPuzzlesEntity` · key `com_apple_preferences_get_automatically_download_puzzles`
  
Output: Automatically Download Puzzles `com.apple.news.AutoDownloadPuzzlesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically download puzzles | string | enum: `Library` |

### Update Automatically Download Puzzles

`com.apple.news.AutoDownloadPuzzlesEntity-UpdatableEntity` · key `com_apple_preferences_update_automatically_download_puzzles`
  
Change the Automatically Download Puzzles value of Automatically Download Puzzles
  
Output: Automatically Download Puzzles `com.apple.news.AutoDownloadPuzzlesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Automatically Download Puzzles | any | entity AutoDownloadPuzzlesEntity |
| `value` | Automatically Download Puzzles to update on Automatically Download Puzzles | bool | bool |

### Get Automatically Download Recipes

`com.apple.news.AutoDownloadRecipesEntity` · key `com_apple_preferences_get_automatically_download_recipes`
  
Output: Automatically Download Recipes `com.apple.news.AutoDownloadRecipesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically download recipes | string | enum: `Library` |

### Update Automatically Download Recipes

`com.apple.news.AutoDownloadRecipesEntity-UpdatableEntity` · key `com_apple_preferences_update_automatically_download_recipes`
  
Change the Automatically Download Recipes value of Automatically Download Recipes
  
Output: Automatically Download Recipes `com.apple.news.AutoDownloadRecipesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Automatically Download Recipes | any | entity AutoDownloadRecipesEntity |
| `value` | Automatically Download Recipes to update on Automatically Download Recipes | bool | bool |

### Get Automatically Download Saved Stories

`com.apple.news.AutoDownloadSavedStoriesEntity` · key `com_apple_preferences_get_automatically_download_saved_stories`
  
Output: Automatically Download Saved Stories `com.apple.news.AutoDownloadSavedStoriesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically download saved stories | string | enum: `Library` |

### Update Automatically Download Saved Stories

`com.apple.news.AutoDownloadSavedStoriesEntity-UpdatableEntity` · key `com_apple_preferences_update_automatically_download_saved_stories`
  
Change the Automatically Download Saved Stories value of Automatically Download Saved Stories
  
Output: Automatically Download Saved Stories `com.apple.news.AutoDownloadSavedStoriesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Automatically Download Saved Stories | any | entity AutoDownloadSavedStoriesEntity |
| `value` | Automatically Download Saved Stories to update on Automatically Download Saved Stories | bool | bool |

### Get Automatically Download Stories In Feeds

`com.apple.news.AutoDownloadStoriesInFeedsEntity` · key `com_apple_preferences_get_automatically_download_stories_in_feeds`
  
Output: Automatically Download Stories In Feeds `com.apple.news.AutoDownloadStoriesInFeedsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically download stories in feeds | string | enum: `Library` |

### Update Automatically Download Stories In Feeds

`com.apple.news.AutoDownloadStoriesInFeedsEntity-UpdatableEntity` · key `com_apple_preferences_update_automatically_download_stories_in_feeds`
  
Change the Automatically Download Stories In Feeds value of Automatically Download Stories In Feeds
  
Output: Automatically Download Stories In Feeds `com.apple.news.AutoDownloadStoriesInFeedsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Automatically Download Stories In Feeds | any | entity AutoDownloadStoriesInFeedsEntity |
| `value` | Automatically Download Stories In Feeds to update on Automatically Download Stories In Feeds | bool | bool |

### Block Channel or Topic

`com.apple.news.BlockIntent` · key `news_block_channel_or_topic`
  
Block a channel or topic from appearing, except in parts of the app curated by the Apple News editors
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Channel or Topic | any | entity FeedEntity |

### Follow Channel or Topic

`com.apple.news.FollowIntent` · key `news_follow_channel_or_topic`
  
Adds a channel or topic to your Following list
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Channel or Topic | any | entity FeedEntity |

### Get Game Center

`com.apple.news.GameCenterEntity` · key `com_apple_preferences_get_game_center`
  
Output: Game Center `com.apple.news.GameCenterEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | game center | string | enum: `Library` |

### Update Game Center

`com.apple.news.GameCenterEntity-UpdatableEntity` · key `com_apple_preferences_update_game_center`
  
Change the Game Center value of Game Center
  
Output: Game Center `com.apple.news.GameCenterEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Game Center | any | entity GameCenterEntity |
| `value` | Game Center to update on Game Center | bool | bool |

### Get Ingredients

`com.apple.news.GetIngredientsAppIntent` · key `news_get_ingredients`
  
Get the ingredients for a recipe.
  
Output: Recipe Ingredient `com.apple.news.IngredientEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |

### Get Recent Recipes

`com.apple.news.GetRecentRecipesAppIntent` · key `news_get_recent_recipes`
  
Get a list of recently viewed recipes.
  
Output: Recipe `com.apple.news.RecipeEntity`

### Get Saved Recipes

`com.apple.news.GetSavedRecipesAppIntent` · key `news_get_saved_recipes`
  
Get a list of saved recipes.
  
Output: Recipe `com.apple.news.RecipeEntity`

### Find News Automatic Download Settings

`com.apple.news.NewsSettingsAutomaticDownloadDynamicDeepLinks` · key `com_apple_preferences_find_news_automatic_download_settings`
  
Output: News Automatic Download Settings `com.apple.news.NewsSettingsAutomaticDownloadDynamicDeepLinks`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | news automatic download settings | string | enum: `Library` |

### Find News Settings

`com.apple.news.NewsSettingsDynamicDeepLinks` · key `com_apple_preferences_find_news_settings`
  
Output: News Settings `com.apple.news.NewsSettingsDynamicDeepLinks`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | news settings | string | enum: `Library` |

### Find News Tab Deep Links

`com.apple.news.NewsTabDeepLink` · key `news_find_news_tab_deep_links`
  
Output: News Tab Deep Links `com.apple.news.NewsTabDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | news tab deep links | string | enum: `Library` |

### Open Article

`com.apple.news.OpenArticleIntent` · key `news_open_article`
  
Open an article in the News app
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Article | any | entity ArticleEntity |

### Open Channel or Topic

`com.apple.news.OpenFeedIntent` · key `news_open_channel_or_topic`
  
Open a channel or topic feed in the News app
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Feed | any | entity FeedEntity |

### Open History Feed

`com.apple.news.OpenHistoryIntent` · key `news_open_history_feed`
  
Opens the History Feed
  
Output:  `none`

### Open Main Page of News Settings

`com.apple.news.OpenNewsSettingsDynamicDeepLinks` · key `com_apple_preferences_open_main_page_of_news_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | News Settings | any | entity NewsSettingsDynamicDeepLinks |

### Open Recipe

`com.apple.news.OpenRecipeIntent` · key `news_open_recipe`
  
Shows a recipe in the News app.
  
Output: Recipe `com.apple.news.NewsRecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Recipe | any | entity NewsRecipeEntity |

### Open Saved Feed

`com.apple.news.OpenSavedIntent` · key `news_open_saved_feed`
  
Opens the Saved Feed
  
Output:  `none`

### Open Saved Recipes

`com.apple.news.OpenSavedRecipesIntent` · key `news_open_saved_recipes`
  
Opens Saved Recipes
  
Output:  `none`

### Open News Feed

`com.apple.news.OpenStaticFeed` · key `news_open_news_feed`
  
Open a feed in the News app
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | News Tab Deep Links | any | entity NewsTabDeepLink |

### Get Optimize Storage

`com.apple.news.OptimizeStorageEntity` · key `com_apple_preferences_get_optimize_storage`
  
Output: Optimize Storage `com.apple.news.OptimizeStorageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | optimize storage | string | enum: `Library` |

### Update Optimize Storage

`com.apple.news.OptimizeStorageEntity-UpdatableEntity` · key `com_apple_preferences_update_optimize_storage`
  
Change the Optimize Storage value of Optimize Storage
  
Output: Optimize Storage `com.apple.news.OptimizeStorageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Optimize Storage | any | entity OptimizeStorageEntity |
| `value` | Optimize Storage to update on Optimize Storage | bool | bool |

### Play Article

`com.apple.news.PlayArticleIntent` · key `news_play_article`
  
Plays the audio story associated with the article.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `article` | Article | any | entity ArticleEntity |

### Get Restrict Stories in Today

`com.apple.news.RestrictStoriesInTodaySettingEntity` · key `com_apple_preferences_get_restrict_stories_in_today`
  
Output: Restrict Stories in Today `com.apple.news.RestrictStoriesInTodaySettingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | restrict stories in today | string | enum: `Library` |

### Update Restrict Stories in Today

`com.apple.news.RestrictStoriesInTodaySettingEntity-UpdatableEntity` · key `com_apple_preferences_update_restrict_stories_in_today`
  
Change the Restrict Stories in Today value of Restrict Stories in Today
  
Output: Restrict Stories in Today `com.apple.news.RestrictStoriesInTodaySettingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Restrict Stories in Today | any | entity RestrictStoriesInTodaySettingEntity |
| `value` | Restrict Stories in Today to update on Restrict Stories in Today | bool | bool |

### Save Article

`com.apple.news.SaveArticleIntent` · key `news_save_article`
  
Add the article to your Saved Stories list
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Article | any | entity ArticleEntity |

### Save Recipe

`com.apple.news.SaveRecipeAppIntent` · key `news_save_recipe`
  
Saves a recipe.
  
Output: Recipe `com.apple.news.RecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |

### Select Ingredient

`com.apple.news.SelectIngredientAppIntent` · key `news_select_ingredient`
  
Selects an ingredient in a recipe.
  
Output: Recipe `com.apple.news.RecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |
| `ingredient` | Ingredient | any | entity IngredientEntity |

### Show Details

`com.apple.news.ShowDetailsAppIntent` · key `news_show_details`
  
Shows details for a recipe.
  
Output: Recipe `com.apple.news.RecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |

### Show Ingredients

`com.apple.news.ShowIngredientsAppIntent` · key `news_show_ingredients`
  
Shows ingredients for a recipe.
  
Output: Recipe `com.apple.news.RecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |

### Show Instructions

`com.apple.news.ShowInstructionsAppIntent` · key `news_show_instructions`
  
Shows instructions for a recipe.
  
Output: Recipe `com.apple.news.RecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |

### Show Next Step

`com.apple.news.ShowNextStepAppIntent` · key `news_show_next_step`
  
Shows the next step for a recipe.
  
Output: Recipe `com.apple.news.RecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |

### Show Previous Step

`com.apple.news.ShowPreviousStepAppIntent` · key `news_show_previous_step`
  
Shows the previous step for a recipe.
  
Output: Recipe `com.apple.news.RecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |

### Show Specific Step

`com.apple.news.ShowSpecificStepIntent` · key `news_show_specific_step`
  
Shows a specific step for a recipe.
  
Output: Recipe `com.apple.news.RecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |
| `step` | Step | any | entity InstructionEntity |

### Start Cooking

`com.apple.news.StartCookingAppIntent` · key `news_start_cooking`
  
Starts Cook Mode.
  
Output: Recipe `com.apple.news.RecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |

### Stop Cooking

`com.apple.news.StopCookingAppIntent` · key `news_stop_cooking`
  
Stops Cook Mode.
  
Output: Recipe `com.apple.news.RecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |

### Unblock Channel or Topic

`com.apple.news.UnblockIntent` · key `news_unblock_channel_or_topic`
  
Unblock a channel or topic from appearing
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Channel or Topic | any | entity FeedEntity |

### Unsave Article

`com.apple.news.UnsaveArticleIntent` · key `news_unsave_article`
  
Delete the article from your Saved Stories list
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Article | any | entity ArticleEntity |

### Unsave Recipe

`com.apple.news.UnsaveRecipeAppIntent` · key `news_unsave_recipe`
  
Unsaves a recipe.
  
Output: Recipe `com.apple.news.RecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |

### Unselect Ingredient

`com.apple.news.UnselectIngredientAppIntent` · key `news_unselect_ingredient`
  
Unselects an ingredient in a recipe.
  
Output: Recipe `com.apple.news.RecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipe` | Recipe | any | entity RecipeEntity |
| `ingredient` | Ingredient | any | entity IngredientEntity |

### Change News Settings

`com.apple.news.WFAppSettingEntityUpdaterAction` · key `news_change_news_settings`
  
Changes the state of the selected News setting.
  
Output: Automatically Download Audio Stories `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` |  | string | enum: `AutoDownloadAudioStoriesEntity`, `AutoDownloadEntity`, `AutoDownloadMagazineIssuesEntity`, `AutoDownloadPuzzlesEntity`, `AutoDownloadRecipesEntity`, `AutoDownloadSavedStoriesEntity`, `AutoDownloadStoriesInFeedsEntity`, `GameCenterEntity`, `OptimizeStorageEntity`, `RestrictStoriesInTodaySettingEntity` |
| `AutoDownloadAudioStoriesEntity` | Value | bool | bool |
| `AutoDownloadEntity` | Value | bool | bool |
| `AutoDownloadMagazineIssuesEntity` | Value | bool | bool |
| `AutoDownloadPuzzlesEntity` | Value | bool | bool |
| `AutoDownloadRecipesEntity` | Value | bool | bool |
| `AutoDownloadSavedStoriesEntity` | Value | bool | bool |
| `AutoDownloadStoriesInFeedsEntity` | Value | bool | bool |
| `GameCenterEntity` | Value | bool | bool |
| `OptimizeStorageEntity` | Value | bool | bool |
| `RestrictStoriesInTodaySettingEntity` | Value | bool | bool |

### Get News Settings

`com.apple.news.WFGetAppSettingAction` · key `news_get_news_settings`
  
Gets the current state of the selected News setting.
  
Output: Automatically Download Audio Stories `bool`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` |  | string | enum: `AutoDownloadAudioStoriesEntity`, `AutoDownloadEntity`, `AutoDownloadMagazineIssuesEntity`, `AutoDownloadPuzzlesEntity`, `AutoDownloadRecipesEntity`, `AutoDownloadSavedStoriesEntity`, `AutoDownloadStoriesInFeedsEntity`, `GameCenterEntity`, `OptimizeStorageEntity`, `RestrictStoriesInTodaySettingEntity` |

## Notes (`com.apple.Notes`)

### Add File to Note

`com.apple.Notes.AddFileAttachmentLinkAction` · key `notes_add_file_to_note`
  
Adds an attachment into a note.
  
Output: Attachment `com.apple.Notes.AttachmentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | string |
| `file` | File | any | file |
| `note` | Note | any | entity NoteEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Add Link

`com.apple.Notes.AddLinkAttachmentLinkAction` · key `notes_add_link`
  
Adds a link into a note.
  
Output: Attachment `com.apple.Notes.AttachmentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | string |
| `url` | URL | text | url |
| `note` | Note | any | entity NoteEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Add or Remove Note Lock

`com.apple.Notes.AddOrRemoveNoteLockLinkAction` · key `notes_add_or_remove_note_lock`
  
Lock the given note so that viewing it requires a password, passcode, or biometric authentication, or remove the lock to allow unrestricted access.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `operation` | Operation | string | enum: `add`, `remove`, `toggle` |
| `target` | Note | any | entity NoteEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Add Tags to Notes

`com.apple.Notes.AddTagsToNotesLinkAction` · key `notes_add_tags_to_notes`
  
Adds tags to notes.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `notes` | Notes | any | entity NoteEntity |
| `tags` | Tags | any | entity TagEntity |

### Apply Formatting to Selected Text

`com.apple.Notes.ApplyFormattingLinkAction` · key `notes_apply_formatting_to_selected_text`
  
Formats selected text in a note.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `bold` | Bold | string | enum: `disable`, `enable`, `toggle` |
| `italic` | Italic | string | enum: `disable`, `enable`, `toggle` |
| `underline` | Underline | string | enum: `disable`, `enable`, `toggle` |
| `strikethrough` | Strikethrough | string | enum: `disable`, `enable`, `toggle` |

### Find Attachment

`com.apple.Notes.AttachmentEntity` · key `notes_find_attachment`
  
Output: Attachment `com.apple.Notes.AttachmentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Name`, `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | attachment | string | enum: `Library` |

### Change Folder View Setting

`com.apple.Notes.ChangeFolderSettingLinkAction` · key `notes_change_folder_view_setting`
  
Changes your folder view in Notes between Gallery and List views.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `changeOperation` | Operation | string | enum: `disable`, `enable`, `toggle` |
| `setting` | Setting | string | enum: `galleryView`, `listView` |

### Change Notes Setting

`com.apple.Notes.ChangeSettingLinkAction` · key `notes_change_notes_setting`
  
Change the settings of the Notes app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `changeOperation` | Operation | string | enum: `disable`, `enable`, `toggle` |
| `setting` | Setting | string | enum: `autoConvertToTag`, `autoSortCheckedItems`, `localAccount`, `mentionNotifications`, `resumeLastQuickNote` |

### Change Tag Selection

`com.apple.Notes.ChangeTagSelectionIntent` · key `notes_change_tag_selection`
  
Changes the selected tags in the tag browser.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `includedTags` | Included Tags | any | entity TagEntity |
| `excludedTags` | Excluded Tags | any | entity TagEntity |
| `selectionOperator` | Selection | string | enum: `all`, `any` |

### Close Notes View

`com.apple.Notes.CloseAppLocationLinkAction` · key `notes_close_notes_view`
  
Close or hide the provided view in the Notes app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Notes View | string | enum: `attachmentBrowser`, `folderList` |

### Close Note

`com.apple.Notes.CloseNoteLinkAction` · key `notes_close_note`
  
Closes an open note.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Note | any | entity NoteEntity |

### Append Checklist Item

`com.apple.Notes.CreateChecklistItemLinkAction` · key `notes_append_checklist_item`
  
Adds a checklist item to the end of a note.
  
Output: Checklist Item `com.apple.Notes.ChecklistItemEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | string |
| `noteEntity` | Note | any | entity NoteEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Create Folder

`com.apple.Notes.CreateFolderLinkAction` · key `notes_create_folder`
  
Creates a new folder.
  
Output: Folder `com.apple.Notes.FolderEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Folder Name | text | string |
| `OpenWhenRun` | Open When Run | bool | bool |

### Create Note

`com.apple.Notes.CreateNoteIntent` · key `notes_create_note`
  
Creates a new note.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | richText |
| `content` | Content | text | richText |
| `attachments` | Attachments | any | file |
| `isPinned` | Pinned | bool | bool |
| `folder` | Folder | any | entity FolderEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Add Table to Note

`com.apple.Notes.CreateTableLinkAction` · key `notes_add_table_to_note`
  
Adds a table into a note.
  
Output: Table `com.apple.Notes.TableEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | string |
| `csvString` | Values | text | string |
| `note` | Note | any | entity NoteEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Create Tag

`com.apple.Notes.CreateTagLinkAction` · key `notes_create_tag`
  
Creates a tag that can be used in notes.
  
Output: Tag `com.apple.Notes.TagEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Tag Name | text | string |
| `OpenWhenRun` | Open When Run | bool | bool |

### Delete Attachments

`com.apple.Notes.DeleteAttachmentsLinkAction` · key `notes_delete_attachments`
  
Deletes attachments from a note.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Attachment | any | entity AttachmentEntity |

### Delete Checklist Items

`com.apple.Notes.DeleteChecklistItemsLinkAction` · key `notes_delete_checklist_items`
  
Deletes checklist items from a note.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Checklist Item | any | entity ChecklistItemEntity |

### Delete Folders

`com.apple.Notes.DeleteFoldersLinkAction` · key `notes_delete_folders`
  
Deletes folders from Notes.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Folders | any | entity FolderEntity |

### Delete Notes

`com.apple.Notes.DeleteNotesLinkAction` · key `notes_delete_notes`
  
Delete notes.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Notes | any | entity NoteEntity |

### Delete Tables

`com.apple.Notes.DeleteTablesLinkAction` · key `notes_delete_tables`
  
Delete tables from a note.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Table | any | entity TableEntity |

### Delete Tags

`com.apple.Notes.DeleteTagsLinkAction` · key `notes_delete_tags`
  
Delete tags from Notes.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Tags | any | entity TagEntity |

### Apply Emphasis to Selected Text

`com.apple.Notes.EmphasisLinkAction` · key `notes_apply_emphasis_to_selected_text`
  
Sets the emphasis style
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `emphasisColor` | Emphasis Color | string | enum: `blue`, `body`, `mint`, `orange`, `pink`, `purple` |

### Get Linked Notes

`com.apple.Notes.GetLinkedNotesLinkAction` · key `notes_get_linked_notes`
  
Creates a list of notes that are linked to from the specified note.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Note | any | entity NoteEntity |

### Insert All Mention

`com.apple.Notes.InsertAllMentionLinkAction` · key `notes_insert_all_mention`
  
Insert an all mention into the provided target note, notifying all collaborators.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Note | any | entity NoteEntity |

### Insert Mention

`com.apple.Notes.InsertMentionLinkAction` · key `notes_insert_mention`
  
Mentions another participant or all participants in a shared note.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Note | any | entity NoteEntity |
| `mentionText` | Mention | text | string |

### Insert Note Link

`com.apple.Notes.InsertNoteLinkLinkAction` · key `notes_insert_note_link`
  
Adds a link to a note in a note.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `linkedNote` | Linked Note | any | entity NoteEntity |
| `target` | Note | any | entity NoteEntity |
| `useNoteTitleAsName` | Use Note Title | bool | bool |

### Move Notes to Folder

`com.apple.Notes.MoveNotesToFolderLinkAction` · key `notes_move_notes_to_folder`
  
Moves notes into a folder in Notes.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `container` | Folder | any | entity FolderEntity |
| `entities` | Notes | any | entity NoteEntity |

### Append to Note

`com.apple.Notes.NoteAppendTextIntent` · key `notes_append_to_note`
  
Adds text to the end of a note.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Note | any | entity NoteEntity |
| `content` | Text | text | richText |

### Open Account

`com.apple.Notes.OpenAccountLinkAction` · key `notes_open_account`
  
Opens an existing account in Notes.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Account | any | entity AccountEntity |

### Open Notes View

`com.apple.Notes.OpenAppLocationLinkAction` · key `notes_open_notes_view`
  
Opens the attachments browser or folder list in Notes.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Notes View | string | enum: `attachmentBrowser`, `folderList` |

### Open Attachment

`com.apple.Notes.OpenAttachmentLinkAction` · key `notes_open_attachment`
  
Opens an attachment that’s in a note.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Attachment | any | entity AttachmentEntity |

### Reveal Checklist Item

`com.apple.Notes.OpenChecklistItemLinkAction` · key `notes_reveal_checklist_item`
  
Opens the note that contains the specified checklist item.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Checklist Item | any | entity ChecklistItemEntity |

### Open Folder

`com.apple.Notes.OpenFolderLinkAction` · key `notes_open_folder`
  
Opens an existing folder in Notes.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Folder | any | entity FolderEntity |

### Reveal Table

`com.apple.Notes.OpenTableLinkAction` · key `notes_reveal_table`
  
Opens the note that contains the chosen table.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Table | any | entity TableEntity |

### Open Tag

`com.apple.Notes.OpenTagLinkAction` · key `notes_open_tag`
  
Opens a list of notes that contain a specific tag.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Tag | any | entity TagEntity |

### Open Top-Level Folder

`com.apple.Notes.OpenTopLevelFolderLinkAction` · key `notes_open_top_level_folder`
  
Opens the Shared, Call Recordings, Math Notes, or Quick Notes folder in Notes.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Notes Top-Level Folder | string | enum: `callNotes`, `mathNotes`, `quickNotes`, `sharedWithYou` |

### Pin Notes

`com.apple.Notes.PinNotesLinkAction` · key `notes_pin_notes`
  
Pins or unpins notes.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `operation` | Operation | string | enum: `add`, `remove` |
| `entities` | Note | any | entity NoteEntity |

### Remove Tags from Notes

`com.apple.Notes.RemoveTagsFromNotesLinkAction` · key `notes_remove_tags_from_notes`
  
Removes tags from notes.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `notes` | Notes | any | entity NoteEntity |
| `tags` | Tags | any | entity TagEntity |

### Rename Folder

`com.apple.Notes.RenameFolderLinkAction` · key `notes_rename_folder`
  
Renames a folder in Notes.
  
Output: Folder `com.apple.Notes.FolderEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Folder | any | entity FolderEntity |
| `name` | Name | text | string |

### Replace Selected Text

`com.apple.Notes.ReplaceSelectionLinkAction` · key `notes_replace_selected_text`
  
Replaces selected text with new text in a note.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `text` | Text | text | richText |

### Set Attachment Size

`com.apple.Notes.SetAttachmentSizeLinkAction` · key `notes_set_attachment_size`
  
Sets the size of an attachment in a note.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Attachment | any | entity AttachmentEntity |
| `attachmentSize` | Size | string | enum: `defaultSize`, `large`, `medium`, `small` |

### Set Checklist Items Checked

`com.apple.Notes.SetChecklistItemCheckedLinkActionv2` · key `notes_set_checklist_items_checked`
  
Checks or unchecks items in a checklist.
  
Output: Checklist Item `com.apple.Notes.ChecklistItemEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `changeOperation` | Change | string | enum: `check`, `toggle`, `uncheck` |
| `entities` | Checklist Item | any | entity ChecklistItemEntity |
| `note` | Note | any | entity NoteEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Set Paragraph Style

`com.apple.Notes.SetParagraphStyleLinkAction` · key `notes_set_paragraph_style`
  
Applies a paragraph style to text in a note.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `paragraphStyle` | Paragraph Style | string | enum: `body`, `caption`, `fixedWidth`, `heading`, `listBullet`, `listDash`, `listNumbered`, `listTodo`, `subheading`, `title` |

### Show Note and Attachment Search Result

`com.apple.Notes.ShowNotesAppSearchResultsLinkAction` · key `notes_show_note_and_attachment_search_result`
  
Searches for notes and attachments in Notes.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Criteria | text | string |

### Show Quick Note

`com.apple.Notes.ShowQuickNoteIntent` · key `notes_show_quick_note`
  
Opens the Quick Note editor view.
  
Output:  `none`

### Start Audio Recording

`com.apple.Notes.StartRecordingLinkAction` · key `notes_start_audio_recording`
  
Opens the audio details screen to record audio in Notes.
  
Output:  `none`

### Find Table

`com.apple.Notes.TableEntity` · key `notes_find_table`
  
Output: Table `com.apple.Notes.TableEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Name`, `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | table | string | enum: `Library` |

### Update Note

`com.apple.Notes.UpdateNoteIntent` · key `notes_update_note`
  
Updates a note in Notes.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | richText |
| `attachments` | Attachments | any | file |
| `isPinned` | Pinned | bool | bool |
| `target` | Note | any | entity NoteEntity |
| `folder` | Folder | any | entity FolderEntity |

### Create Note

`com.apple.mobilenotes.SharingExtension` · key `notes_create_note`
  
Creates a note using the content passed as input.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | string |
| `contents` | Contents | text | richText |
| `folder` | Folder | any | entity FolderEntity |
| `interpretAsMarkdown` | Interpret as Markdown | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Append to Note

`is.workflow.actions.appendnote` · key `notes_append_to_note`
  
Adds text to the end of a note.
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `operation` | Operation | string | enum: `append`, `prepend` |
| `entity` | Note | any | entity NoteEntity |
| `text` | Text | text | richText |
| `section` | Section Title | text | string |
| `ignoreWhitespace` | Ignore Empty Lines | bool | bool |
| `interpretAsMarkdown` | Interpret as Markdown | bool | bool |

### Find Notes

`is.workflow.actions.filter.notes` · key `notes_find_notes`
  
Output: Note `com.apple.Notes.NoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Creation Date`, `Folder`, `Last Modified Date`, `Name`, `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | note | string | enum: `Library` |

### Open Note

`is.workflow.actions.shownote` · key `notes_open_note`
  
Opens the specified note.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Note | any | entity NoteEntity |

## Numbers (`com.apple.iWork.Numbers`)

### Export Spreadsheet in Background

`com.apple.iWork.Numbers.TNDocumentBackgroundExportIntent` · key `com_apple_i_work_numbers_export_spreadsheet_in_background`
  
Exports a spreadsheet to a specified file format. Does not open the spreadsheet or bring it to the foreground.
  
Output:  `file`

| Key | Name | Kind | Type |
|---|---|---|---|
| `document` | Spreadsheet | any | entity TNDocumentEntity |
| `format` | Format | string | enum: `excel`, `pdf` |
| `sourcePassword` | Source Password | text | string |
| `password` | Export Password | text | string |

### Create New Spreadsheet

`com.apple.iWork.Numbers.TNNewDocumentIntent` · key `com_apple_i_work_numbers_create_new_spreadsheet`
  
Create a new spreadsheet from the template chooser in Numbers.
  
Output:  `none`

## Pages (`com.apple.iWork.Pages`)

### Export Document in Background

`com.apple.iWork.Pages.TPDocumentBackgroundExportIntent` · key `com_apple_i_work_pages_export_document_in_background`
  
Exports a document to a specified file format. Does not open the document or bring it to the foreground.
  
Output:  `file`

| Key | Name | Kind | Type |
|---|---|---|---|
| `document` | Document | any | entity TPDocumentEntity |
| `format` | Format | string | enum: `pdf`, `word` |
| `sourcePassword` | Source Password | text | string |
| `password` | Export Password | text | string |

### Create New Document

`com.apple.iWork.Pages.TPNewDocumentIntent` · key `com_apple_i_work_pages_create_new_document`
  
Create a new document from the template chooser in Pages.
  
Output:  `none`

## PhoneAppIntentsExtension (`com.apple.calls.PhoneAppIntentsExtension`)

### Answer the call

`com.apple.calls.PhoneAppIntentsExtension.AnswerCallIntent` · key `com_apple_calls_phone_app_intents_extension_answer_the_call`
  
Answers an incoming call
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `call` | Call | any | entity LiveCall |

### Find Emergency Destination

`com.apple.calls.PhoneAppIntentsExtension.CallEmergencyDestination` · key `com_apple_calls_phone_app_intents_extension_find_emergency_destination`
  
Output: Emergency Destination `com.apple.calls.PhoneAppIntentsExtension.CallEmergencyDestination`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `phoneNumber`, `type` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | emergency destination | string | enum: `Library` |

### Find Call Message

`com.apple.calls.PhoneAppIntentsExtension.CallMessage` · key `com_apple_calls_phone_app_intents_extension_find_call_message`
  
Output: Call Message `com.apple.calls.PhoneAppIntentsExtension.CallMessage`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `date`, `duration`, `isRead` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | call message | string | enum: `Library` |

### Find Call Record

`com.apple.calls.PhoneAppIntentsExtension.CallRecord` · key `com_apple_calls_phone_app_intents_extension_find_call_record`
  
Output: Call Record `com.apple.calls.PhoneAppIntentsExtension.CallRecord`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `date`, `duration`, `type` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | call record | string | enum: `Library` |

### Create a conference call

`com.apple.calls.PhoneAppIntentsExtension.CreateConferenceCallIntent` · key `face_time_create_a_conference_call`
  
Creates a conference call
  
Output: Conference Call `com.apple.calls.PhoneAppIntentsExtension.ConferenceCall`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioVisualMode` | Audio Visual Mode | string | enum: `audio`, `video` |
| `destination` | Destination | any | entity CallGroup |

### Ends the call

`com.apple.calls.PhoneAppIntentsExtension.EndCallIntent` · key `com_apple_calls_phone_app_intents_extension_ends_the_call`
  
Ends a call
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `call` | Call | any | entity LiveCall |

### Set audio route for an ongoing call

`com.apple.calls.PhoneAppIntentsExtension.SetCallAudioRouteIntent` · key `com_apple_calls_phone_app_intents_extension_set_audio_route_for_an_ongoing_call`
  
Set audio route for an ongoing call
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioRoute` | Audio Route | any | entity CallAudioRoute |

### Start an emergency call

`com.apple.calls.PhoneAppIntentsExtension.StartEmergencyCallIntent` · key `com_apple_calls_phone_app_intents_extension_start_an_emergency_call`
  
Starts an emergency call
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `destination` | Destination | any | entity CallEmergencyDestination |

### Start a FaceTime call

`com.apple.calls.PhoneAppIntentsExtension.StartFaceTimeCallIntent` · key `face_time_start_a_face_time_call`
  
Starts a FaceTime call to a person, handle, or named group
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioVisualMode` | Audio Visual Mode | string | enum: `audio`, `video` |
| `destination` | Destination | any | entity CallGroup |

### Start a Telephony call

`com.apple.calls.PhoneAppIntentsExtension.StartTelephonyCallIntent` · key `phone_start_a_telephony_call`
  
Starts a call to a person, handle, or named group
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioVisualMode` | Audio Visual Mode | string | enum: `audio`, `video` |
| `destination` | Destination | any | entity CallGroup |

### Answer an incoming call

`com.apple.siri.SiriPhoneFlowTools.SiriPhoneFlowTools.AnswerCallFlowTool|com.apple.calls.PhoneAppIntentsExtension` · key `-`
  
Answer an incoming call looked up in the context and routes the audio to the audio route if it was specified
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `call` | Call | any | entity LiveCall |
| `audioRoute` | Audio Route | any | entity CallAudioRoute |

### Start a call

`com.apple.siri.SiriPhoneFlowTools.SiriPhoneFlowTools.StartCallFlowTool|com.apple.FaceTime` · key `-`
  
Starts an audio or video call to a person, list of people, or group chat, using the default phone app, FaceTime, or a custom app
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `destination` | Destination | any | entity CallGroup |
| `audioVisualMode` | Audio Visual Mode | string | enum: `audio`, `video` |
| `audioRoute` | Audio Route | any | entity CallAudioRoute |

### Start a call

`com.apple.siri.SiriPhoneFlowTools.SiriPhoneFlowTools.StartCallFlowTool|com.apple.mobilephone` · key `-`
  
Starts an audio or video call to a person, list of people, or group chat, using the default phone app, FaceTime, or a custom app
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `destination` | Destination | any | entity CallGroup |
| `audioVisualMode` | Audio Visual Mode | string | enum: `audio`, `video` |
| `audioRoute` | Audio Route | any | entity CallAudioRoute |

### Start Emergency Call

`com.apple.siri.SiriPhoneFlowTools.SiriPhoneFlowTools.StartEmergencyCallFlowTool|com.apple.calls.PhoneAppIntentsExtension` · key `-`
  
Start an emergency call
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `destination` | Destination | any | entity CallEmergencyDestination |
| `audioRoute` | Audio Route | any | entity CallAudioRoute |

## Photos (`com.apple.Photos`)

### Add Photos To Album

`com.apple.Photos.AddAssetsToAlbumIntent` · key `photos_add_photos_to_album`
  
Adds photos to the specified album.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `assets` | Photos | any | entity AssetEntity |
| `album` | Album | any | entity AlbumEntity |

### Find Albums

`com.apple.Photos.AlbumEntity` · key `photos_find_albums`
  
Output: Album `com.apple.Photos.AlbumEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `creationDate`, `name` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | album | string | enum: `Library` |

### Apply Filter

`com.apple.Photos.ApplyFilterIntent` · key `photos_apply_filter`
  
Applies the specified filter.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `asset` | Photo | any | entity AssetEntity |
| `effect` | Filter | string | enum: `amber`, `blackAndWhite`, `bright`, `coolRose`, `cozy`, `dramatic`, `dramaticCool`, `dramaticWarm`, `ethereal`, `gold`, `luminous`, `mono` … |

### Apply Style

`com.apple.Photos.ApplyStyleIntent` · key `photos_apply_style`
  
Applies the specified style.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `asset` | The photo to apply style to | any | entity AssetEntity |
| `style` | Style | string | enum: `cloudCover`, `colorful`, `dreamyHues`, `earthy`, `original`, `starkBW`, `urbanCool`, `warmAuthentic` |

### Find Photo

`com.apple.Photos.AssetEntity` · key `photos_find_photo`
  
Output: Photo `com.apple.Photos.AssetEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `assetType`, `creationDate`, `hasSuggestedEdits`, `isFavorite`, `isHidden`, `location` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | photo | string | enum: `Library` |

### Clean Up

`com.apple.Photos.CleanupIntent` · key `photos_clean_up`
  
Opens the specified photo to Clean Up.
  
Output:  `none`

### Copy and Paste Edits

`com.apple.Photos.CopyPasteEditsIntent` · key `photos_copy_and_paste_edits`
  
Copies edits between the specified source and destination photos.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `sourceAsset` | Source Photo | any | entity AssetEntity |
| `destinationAssets` | Destination Photos | any | entity AssetEntity |

### Create Album

`com.apple.Photos.CreateAlbumIntent` · key `photos_create_album`
  
Creates an album with the specified name.
  
Output: Album `com.apple.Photos.AlbumEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `title` | Name | text | string |
| `OpenWhenRun` | Open When Run | bool | bool |

### Save to Photos

`com.apple.Photos.CreateAssetsIntent` · key `photos_save_to_photos`
  
Adds the specified photos to the photo library.
  
Output: Photo `com.apple.Photos.AssetEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `files` | Photos | any | file |
| `OpenWhenRun` | Open When Run | bool | bool |

### Crop

`com.apple.Photos.CropIntent` · key `photos_crop`
  
Opens the photo to Crop.
  
Output:  `none`

### Delete Albums

`com.apple.Photos.DeleteAlbumsIntent` · key `photos_delete_albums`
  
Deletes the specified albums.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Albums | any | entity AlbumEntity |

### Delete Photos

`com.apple.Photos.DeleteAssetsIntent` · key `photos_delete_photos`
  
Deletes the specified photos.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Photos | any | entity AssetEntity |

### Duplicate Photos

`com.apple.Photos.DuplicateAssetsIntent` · key `photos_duplicate_photos`
  
Duplicates the specified photos.
  
Output: Photo `com.apple.Photos.AssetEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `assets` | Photos | any | entity AssetEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Edit Photo

`com.apple.Photos.EditAssetIntent` · key `photos_edit_photo`
  
Opens the specified photo to Edit.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `asset` | Photo | any | entity AssetEntity |

### Portrait Mode

`com.apple.Photos.EnableDepthIntent` · key `photos_portrait_mode`
  
Enables or disables Portrait mode for the photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `enabled` | Enabled | bool | bool |
| `ShowWhenRun` | Show When Run | bool | bool |

### Auto Enhance Photo

`com.apple.Photos.EnhanceIntent` · key `photos_auto_enhance_photo`
  
Enables or disables auto-enhancement of the specified photos.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `assets` | Photos | any | entity AssetEntity |
| `enabled` | Enabled | bool | bool |

### Favorite Photos

`com.apple.Photos.FavoriteAssetsIntent` · key `photos_favorite_photos`
  
Favorites or unfavorites the specified photos.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `assets` | Photos | any | entity AssetEntity |
| `action` | Action | string | enum: `favorite`, `unfavorite` |

### Favorite Memories

`com.apple.Photos.FavoriteMemoriesIntent` · key `photos_favorite_memories`
  
Favorites or unfavorites the specified memories.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `memories` | Memories | any | entity MemoryEntity |
| `action` | Action | string | enum: `favorite`, `unfavorite` |

### Favorite People or Pets

`com.apple.Photos.FavoritePeopleIntent` · key `photos_favorite_people_or_pets`
  
Favorites or unfavorites the specified people or pets.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `people` | People or Pets | any | entity PersonEntity |
| `action` | Action | string | enum: `favorite`, `unfavorite` |

### Set Library View

`com.apple.Photos.FilterLibraryIntent` · key `photos_set_library_view`
  
Sets the specified library view.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `viewMode` | Library View | string | enum: `both`, `personal`, `shared` |

### Hide Photos

`com.apple.Photos.HideAssetsIntent` · key `photos_hide_photos`
  
Hides the specified photos.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `assets` | Photos | any | entity AssetEntity |
| `action` | Action | string | enum: `hide`, `unhide` |

### Hide People or Pets

`com.apple.Photos.HidePeopleIntent` · key `photos_hide_people_or_pets`
  
Hides the specified people or pets.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `people` | People or Pets | any | entity PersonEntity |
| `action` | Action | string | enum: `hide`, `unhide` |

### Markup

`com.apple.Photos.MarkupIntent` · key `photos_markup`
  
Opens the photo to Markup.
  
Output:  `none`

### Find Memory

`com.apple.Photos.MemoryEntity` · key `photos_find_memory`
  
Output: Memory `com.apple.Photos.MemoryEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `favorite` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | memory | string | enum: `Library` |

### Move to Personal Library

`com.apple.Photos.MoveAssetsToPersonalLibraryIntent` · key `photos_move_to_personal_library`
  
Moves the specified photos to the Personal Library.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `assets` | Photos | any | entity AssetEntity |

### Move to Shared Library

`com.apple.Photos.MoveAssetsToSharedLibraryIntent` · key `photos_move_to_shared_library`
  
Moves the specified photos to the Shared Library.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `assets` | Photos | any | entity AssetEntity |

### Open Album

`com.apple.Photos.OpenAlbumIntent` · key `photos_open_album`
  
Opens the specified album.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Album | any | entity AlbumEntity |

### Open Photo

`com.apple.Photos.OpenAssetIntent` · key `photos_open_photo`
  
Opens the specified photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |

### Open View

`com.apple.Photos.OpenDestinationIntent` · key `photos_open_view`
  
Opens the specified view.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | View | string | enum: `Albums`, `Animated`, `CapturedByMe`, `Cinematic`, `Duplicates`, `Events`, `Favorites`, `Featured`, `Hidden`, `Imports`, `Library`, `LivePhotos` … |

### Create Memory

`com.apple.Photos.OpenMemoryCreationViewIntent` · key `photos_create_memory`
  
Opens Photos to create a memory movie.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `query` | Description | text | string |

### Find Person

`com.apple.Photos.PersonEntity` · key `photos_find_person`
  
Output: Person `com.apple.Photos.PersonEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `isFavorite`, `name` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | person | string | enum: `Library` |

### Add Photos to Album

`com.apple.Photos.PhotosAddAssetsToAlbumAssistantIntent` · key `photos_add_photos_to_album`
  
Adds the provided photos to the provided album.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `assets` | Photos | any | entity AssetEntity |
| `album` | Album | any | entity AlbumEntity |

### Search Photos

`com.apple.Photos.PhotosAttributedSearchMediaAssistantIntent` · key `photos_search_photos`
  
Searches photos with the provided attributed string.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Criteria | any | file |

### Cleanup Photo

`com.apple.Photos.PhotosCleanupPhotoAssistantIntent` · key `photos_cleanup_photo`
  
Remove distracting objects in a photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |

### Copy Edits

`com.apple.Photos.PhotosCopyEditsAssistantIntent` · key `photos_copy_edits`
  
Copies edits from the provided photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |

### Create Album

`com.apple.Photos.PhotosCreateAlbumAssistantIntent` · key `photos_create_album`
  
Creates an album.
  
Output: Album `com.apple.Photos.AlbumEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | string |
| `OpenWhenRun` | Open When Run | bool | bool |

### Create Photos

`com.apple.Photos.PhotosCreateAssetsAssistantIntent` · key `photos_create_photos`
  
Creates photos from the provided files.
  
Output: Photo `com.apple.Photos.AssetEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `files` | Files | any | file |

### Crop Photo

`com.apple.Photos.PhotosCropAssistantIntent` · key `photos_crop_photo`
  
Crops a photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |

### Delete Albums

`com.apple.Photos.PhotosDeleteAlbumsAssistantIntent` · key `photos_delete_albums`
  
Deletes the provided albums.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Albums | any | entity AlbumEntity |

### Delete Photos

`com.apple.Photos.PhotosDeleteAssetsAssistantIntent` · key `photos_delete_photos`
  
Deletes the provided photos.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Photos | any | entity AssetEntity |

### Duplicate Photos

`com.apple.Photos.PhotosDuplicateAssetsAssistantIntent` · key `photos_duplicate_photos`
  
Duplicates the selected photos.
  
Output: Photo `com.apple.Photos.AssetEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Photos | any | entity AssetEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Edit Photo

`com.apple.Photos.PhotosEditAssetAssistantIntent` · key `photos_edit_photo`
  
Opens a photo for editing.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `asset` | Photo | any | entity AssetEntity |

### Present Search Results

`com.apple.Photos.PhotosEntityCollectionSearchAssistantIntent` · key `photos_present_search_results`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Criteria | any | entity AssetEntity |

### Favorite Memories

`com.apple.Photos.PhotosFavoriteMemoriesAssistantIntent` · key `photos_favorite_memories`
  
Favorites or unfavorites memories.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `memories` | Memories | any | entity MemoryEntity |
| `action` | Action | string | enum: `favorite`, `unfavorite` |

### Set Library View

`com.apple.Photos.PhotosFilterLibraryAssistantIntent` · key `photos_set_library_view`
  
Sets the library view.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `viewMode` | Library View | string | enum: `both`, `personal`, `shared` |

### Move to Personal Library

`com.apple.Photos.PhotosMoveAssetsToPersonalLibraryAssistantIntent` · key `photos_move_to_personal_library`
  
Moves photos to the Personal Library.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `assets` | Photos | any | entity AssetEntity |

### Move to Shared Library

`com.apple.Photos.PhotosMoveAssetsToSharedLibraryAssistantIntent` · key `photos_move_to_shared_library`
  
Moves photos to the Shared Library.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `assets` | Photos | any | entity AssetEntity |

### Create a Memory

`com.apple.Photos.PhotosOpenMemoryCreationViewAssistantIntent` · key `photos_create_a_memory`
  
Creates a Memory movie from a description.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `query` | Description | text | string |

### Paste Edits

`com.apple.Photos.PhotosPasteEditsAssistantIntent` · key `photos_paste_edits`
  
Pastes edits to the provided photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photos | any | entity AssetEntity |

### Remove Photos from Album

`com.apple.Photos.PhotosRemoveAssetsFromAlbumAssistantIntent` · key `photos_remove_photos_from_album`
  
Removes the provided photos from the provided album.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `album` | Album | any | entity AlbumEntity |
| `assets` | Photos | any | entity AssetEntity |

### Search

`com.apple.Photos.PhotosSearchAssistantIntent` · key `photos_search`
  
Navigate to search results.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Text | text | string |

### Set Depth

`com.apple.Photos.PhotosSetDepthAssistantIntent` · key `photos_set_depth`
  
Sets the depth value of a photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |
| `value` | Value | number | double |
| `ShowWhenRun` | Show When Run | bool | bool |

### Set Exposure

`com.apple.Photos.PhotosSetExposureAssistantIntent` · key `photos_set_exposure`
  
Configures the exposure for a photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |
| `value` | Value | number | double |
| `ShowWhenRun` | Show When Run | bool | bool |

### Apply Filter

`com.apple.Photos.PhotosSetFilterAssistantIntent` · key `photos_apply_filter`
  
Applies a filter to a photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |
| `filterType` | Filter | string | enum: `amber`, `blackAndWhite`, `bright`, `coolRose`, `cozy`, `dramatic`, `dramaticCool`, `dramaticWarm`, `ethereal`, `gold`, `luminous`, `mono` … |

### Rotate Photo

`com.apple.Photos.PhotosSetRotationAssistantIntent` · key `photos_rotate_photo`
  
Rotates a photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |
| `direction` | Direction | string | enum: `clockwise`, `counterClockwise` |

### Set Saturation

`com.apple.Photos.PhotosSetSaturationAssistantIntent` · key `photos_set_saturation`
  
Configures the saturation for a photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |
| `value` | Value | number | double |
| `ShowWhenRun` | Show When Run | bool | bool |

### Set Warmth

`com.apple.Photos.PhotosSetWarmthAssistantIntent` · key `photos_set_warmth`
  
Configures the warmth for a photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |
| `value` | Value | number | double |
| `ShowWhenRun` | Show When Run | bool | bool |

### Straighten Photo

`com.apple.Photos.PhotosStraightenAssistantIntent` · key `photos_straighten_photo`
  
Straightens a photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |

### Toggle Depth Effect

`com.apple.Photos.PhotosToggleDepthAssistantIntent` · key `photos_toggle_depth_effect`
  
Toggles depth effect for a photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |
| `isEnabled` | State | bool | bool |
| `ShowWhenRun` | Show When Run | bool | bool |

### Enhance Photo

`com.apple.Photos.PhotosToggleSuggestedEditsAssistantIntent` · key `photos_enhance_photo`
  
Enhances a photo.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |
| `isEnabled` | Enabled | bool | bool |

### Rename Album

`com.apple.Photos.PhotosUpdateAlbumAssistantIntent` · key `photos_rename_album`
  
Renames the provided album.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Album | any | entity AlbumEntity |
| `name` | Name | text | string |

### Update Photo

`com.apple.Photos.PhotosUpdateAssetAssistantIntent` · key `photos_update_photo`
  
Updates an existing photo’s properties.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photos | any | entity AssetEntity |
| `name` | Name | text | string |
| `isFavorite` | Favorite | bool | bool |
| `isHidden` | Hidden | bool | bool |

### Update Person

`com.apple.Photos.PhotosUpdateRecognizedPersonAssistantIntent` · key `photos_update_person`
  
Updates the provided person with new properties.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Person | any | entity PersonEntity |
| `isFavorite` | Favorite | bool | bool |
| `name` | Name | text | string |

### Remove Photos From Album

`com.apple.Photos.RemoveAssetsFromAlbumIntent` · key `photos_remove_photos_from_album`
  
Removes the photos from the specified album.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `album` | Album | any | entity AlbumEntity |
| `assets` | Photos | any | entity AssetEntity |

### Rename Album

`com.apple.Photos.RenameAlbumIntent` · key `photos_rename_album`
  
Renames the album with the specified name.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `album` | Album | any | entity AlbumEntity |
| `title` | Name | text | string |

### Rename Person

`com.apple.Photos.RenamePersonIntent` · key `photos_rename_person`
  
Renames the person with the specified name.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `person` | Person | any | entity PersonEntity |
| `name` | Name | text | string |

### REVEAL_ALBUMS_INTENT_TITLE

`com.apple.Photos.RevealAlbumsIntent` · key `photos_reveal_albums_intent_title`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `albums` | Albums | any | entity AlbumEntity |

### REVEAL_ASSETS_INTENT_TITLE

`com.apple.Photos.RevealAssetsIntent` · key `photos_reveal_assets_intent_title`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `assets` | Assets | any | entity AssetEntity |
| `pluralDestination` | Plural Destination | string | enum: `Albums`, `Animated`, `CapturedByMe`, `Cinematic`, `Duplicates`, `Events`, `Favorites`, `Featured`, `Hidden`, `Imports`, `Library`, `LivePhotos` … |

### Rotate

`com.apple.Photos.RotateIntent` · key `photos_rotate`
  
Rotates the photos in the specified direction.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `assets` | Photos | any | entity AssetEntity |
| `clockwise` | Clockwise | bool | bool |

### Set Aperture

`com.apple.Photos.SetApertureIntent` · key `photos_set_aperture`
  
Sets the aperture of the photo to the specified value.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | Value | number | double |
| `ShowWhenRun` | Show When Run | bool | bool |

### Set Audio Mix

`com.apple.Photos.SetAudioMixIntent` · key `photos_set_audio_mix`
  
Sets the specified audio mix.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioMix` | Audio Mix | string | enum: `camera`, `standard`, `studio`, `voice` |

### Set Exposure

`com.apple.Photos.SetExposureIntent` · key `photos_set_exposure`
  
Sets the exposure of the photo to the specified value.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | Value | number | double |
| `ShowWhenRun` | Show When Run | bool | bool |

### Set Playback Speed

`com.apple.Photos.SetPlaybackRateIntent` · key `photos_set_playback_speed`
  
Sets the specified playback speed.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `playbackRate` | Playback Speed | string | enum: `normal`, `slow` |

### Set Saturation

`com.apple.Photos.SetSaturationIntent` · key `photos_set_saturation`
  
Sets the saturation of the photo to the specified value.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | Value | number | double |
| `ShowWhenRun` | Show When Run | bool | bool |

### Set Warmth

`com.apple.Photos.SetWarmthIntent` · key `photos_set_warmth`
  
Set the warmth of the photo to the specified value.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | Value | number | double |
| `ShowWhenRun` | Show When Run | bool | bool |

### Straighten

`com.apple.Photos.StraightenIntent` · key `photos_straighten`
  
Straightens the photo.
  
Output:  `none`

### EditPhotoWarmth

`com.apple.siri.PhotosFlowTools.SiriPhotosFlowTools.EditPhotoWarmth|com.apple.Photos` · key `-`
  
Adjust the warmth/temperature of a photo to make it warmer or cooler.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Photo | any | entity AssetEntity |
| `adjustmentType` | Adjustment Type | string | enum: `warmth` |
| `value` | Value | number | double |
| `isPercentage` | Is Percentage | bool | bool |

### Delete Photos

`is.workflow.actions.deletephotos` · key `photos_delete_photos`
  
Deletes the specified photos.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Photos | any | entity AssetEntity |

## Podcasts (`com.apple.podcasts`)

### Add Audio to Library

`com.apple.podcasts.AddAudioToLibraryIntent` · key `podcasts_add_audio_to_library`
  
Adds audio item to the user's library
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity EpisodeEntity |

### Find Podcast Episode

`com.apple.podcasts.EpisodeEntity` · key `podcasts_find_podcast_episode`
  
Output: Podcast Episode `com.apple.podcasts.EpisodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `duration`, `releaseDate`, `showName`, `title` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | podcast episode | string | enum: `Library` |

### Follow Show

`com.apple.podcasts.FollowShowAppIntent` · key `podcasts_follow_show`
  
Follow the provided show, adding it to you library
  
Output: Podcast Show `com.apple.podcasts.ShowEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `show` | Show | any | entity ShowEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Open App Location

`com.apple.podcasts.OpenAppLocationAppIntent` · key `podcasts_open_app_location`
  
Open the Podcasts application to a specific location
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Location | string | enum: `browse`, `channels`, `downloaded`, `home`, `latestEpisodes`, `library`, `nowPlaying`, `recentlyUpdated`, `saved`, `search`, `shows`, `topCharts` |

### Open Audio Intent

`com.apple.podcasts.OpenAudioAppIntent` · key `podcasts_open_audio_intent`
  
Opens a audio item in the app UI (e.g., find <Artist>)
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Target | any | entity EpisodeEntity |

### Open Channel

`com.apple.podcasts.OpenChannelAppIntent` · key `podcasts_open_channel`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Channel | any | entity ChannelEntity |

### Open Episode

`com.apple.podcasts.OpenEpisodeAppIntent` · key `podcasts_open_episode`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Episode | any | entity EpisodeEntity |

### Open Show

`com.apple.podcasts.OpenShowAppIntent` · key `podcasts_open_show`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Show | any | entity ShowEntity |
| `notice` | Notice | string | enum: `follow` |

### Play Episode

`com.apple.podcasts.PlayAudioIntent` · key `podcasts_play_episode`
  
Play the provided episode immediately, clearing the playback queue
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `warmupAudioQueueResult` | Warmup Audio Queue Result | any | entity WarmupAudioQueueResult |
| `playbackAttributes` | Playback Attributes | string | enum: `repeat`, `shuffle` |
| `queueLocation` | Queue Location | string | enum: `next`, `tail` |
| `audioEntity` | Audio Item | any | entity EpisodeEntity |
| `requestIdentifierOverride` |  | text | string |

### Play or Pause Station

`com.apple.podcasts.PlayPauseStationAppIntent` · key `podcasts_play_or_pause_station`
  
Start playback of a station or pause playback if the station is currently playing.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `station` | Station | any | entity StationEntity |
| `firstEpisode` | First Episode | any | entity EpisodeEntity |

### Play or Pause Episode

`com.apple.podcasts.PlayPauseWidgetIntent` · key `podcasts_play_or_pause_episode`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `episode` |  | any | entity EpisodeEntity |
| `episodePlaylist` |  | string | enum: `downloaded`, `latestEpisodes`, `listenNow`, `saved` |
| `playbackAccountDSID` |  | text | string |

### Find Podcast Collection

`com.apple.podcasts.PodcastCollectionEntity` · key `podcasts_find_podcast_collection`
  
Output: Podcast Collection `com.apple.podcasts.PodcastCollectionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `title` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | podcast collection | string | enum: `Library` |

### Search Podcasts

`com.apple.podcasts.SearchPodcastsAppIntent` · key `podcasts_search_podcasts`
  
Searches for the specified content in Apple Podcasts
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Phrase | text | string |

### Find Podcast Show

`com.apple.podcasts.ShowEntity` · key `podcasts_find_podcast_show`
  
Output: Podcast Show `com.apple.podcasts.ShowEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `showDescription`, `title` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | podcast show | string | enum: `Library` |

### Warmup Audio Queue

`com.apple.podcasts.WarmupAudioQueueIntent` · key `podcasts_warmup_audio_queue`
  
Warmup a specific audio item to the queue
  
Output: Warmup Audio Queue Result `com.apple.podcasts.WarmupAudioQueueResult`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity EpisodeEntity |
| `requestIdentifierOverride` |  | text | string |
| `playbackAttributes` | Playback Attributes | string | enum: `repeat`, `shuffle` |

### AddAudioToLibrary

`com.apple.siri.SiriAudioTools.SiriAudioTools.AddAudioToLibraryTool|com.apple.podcasts` · key `-`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity EpisodeEntity |

### PlayAudio

`com.apple.siri.SiriAudioTools.SiriAudioTools.PlayAudioTool|com.apple.podcasts` · key `-`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioEntity` | Audio Item | any | entity EpisodeEntity |
| `playbackAttributes` | Playback Attributes | string | enum: `repeat`, `shuffle` |
| `queueLocation` | Queue Location | string | enum: `next`, `tail` |
| `destinations` | Destinations | any | entity MediaIntents.HomeDeviceGroupRepresentationEntity |

## Preview (`com.apple.Preview`)

### Enhance Documents

`com.apple.Preview.AutoEnhanceIntent` · key `com_apple_preview_enhance_documents`
  
Enhances the documents.
  
Output: Document `com.apple.Preview.DocumentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Documents | any | entity DocumentEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Bookmark Pages

`com.apple.Preview.BookmarkIntent` · key `com_apple_preview_bookmark_pages`
  
Bookmark the specified pages.
  
Output: Page `com.apple.Preview.PageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `pages` | Pages | any | entity PageEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Close Documents

`com.apple.Preview.CloseIntent` · key `com_apple_preview_close_documents`
  
Close the documents.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `documents` | Documents | any | entity DocumentEntity |

### Delete Pages

`com.apple.Preview.DeletePageIntent` · key `com_apple_preview_delete_pages`
  
Deletes the specified pages.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Pages | any | entity PageEntity |

### Find Document

`com.apple.Preview.DocumentEntity` · key `com_apple_preview_find_document`
  
Find documents in Preview, returning the items that match the specified search terms.
  
Output: Document `com.apple.Preview.DocumentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `kind`, `title` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | document | string | enum: `Library` |

### Export Documents

`com.apple.Preview.ExportIntent` · key `com_apple_preview_export_documents`
  
Export the documents.
  
Output:  `file`

| Key | Name | Kind | Type |
|---|---|---|---|
| `documents` | Documents | any | entity DocumentEntity |
| `type` | Type | string | enum: `heic`, `jpeg`, `pdf`, `png`, `tiff` |
| `folder` | Folder | any | file |
| `overwriteIfExists` | Overwrite If File Exists | bool | bool |

### Flip Documents

`com.apple.Preview.FlipIntent` · key `com_apple_preview_flip_documents`
  
Flip the documents horizontally or vertically.
  
Output: Document `com.apple.Preview.DocumentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `documents` | Documents | any | entity DocumentEntity |
| `horizontally` | Orientation | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Get Pages in Documents

`com.apple.Preview.GetPagesIntent` · key `com_apple_preview_get_pages_in_documents`
  
Get the pages in the documents.
  
Output: Pages in Documents `com.apple.Preview.PageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `pageSelector` | PageSelector | string | enum: `all`, `current`, `first`, `last`, `next`, `previous`, `specific` |
| `pages` | Pages | text | string |
| `documents` | Documents | any | entity DocumentEntity |

### Insert Page

`com.apple.Preview.InsertPageIntent` · key `com_apple_preview_insert_page`
  
Inserts pages from the specified files.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `files` | Documents | any | file |
| `isAfter` | Placement | bool | bool |
| `page` | Page | any | entity PageEntity |

### Open Documents

`com.apple.Preview.OpenIntent` · key `com_apple_preview_open_documents`
  
Opens the specified files in the reader.
  
Output: Document `com.apple.Preview.DocumentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `files` | Documents | any | file |

### Remove Image Background in Documents

`com.apple.Preview.RemoveBackgroundIntent` · key `com_apple_preview_remove_image_background_in_documents`
  
Remove the image background from the documents.
  
Output: Document `com.apple.Preview.DocumentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `documents` | Documents | any | entity DocumentEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Resize Documents

`com.apple.Preview.ResizeIntent` · key `com_apple_preview_resize_documents`
  
Resizes the documents to a particular width and height.
  
Output: Document `com.apple.Preview.DocumentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `documents` | Documents | any | entity DocumentEntity |
| `width` | Width | number | double |
| `height` | Height | number | double |
| `OpenWhenRun` | Open When Run | bool | bool |

### Reveal Document

`com.apple.Preview.RevealDocumentIntent` · key `com_apple_preview_reveal_document`
  
Reveal the specified document.
  
Output: Document `com.apple.Preview.DocumentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Document | any | entity DocumentEntity |

### Open Page

`com.apple.Preview.RevealPageIntent` · key `com_apple_preview_open_page`
  
Opens the app to the specified document page.
  
Output: Page `com.apple.Preview.PageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Page | any | entity PageEntity |

### Rotate Documents

`com.apple.Preview.RotateIntent` · key `com_apple_preview_rotate_documents`
  
Rotates the documents in the specified direction.
  
Output: Document `com.apple.Preview.DocumentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `documents` | Documents | any | entity DocumentEntity |
| `isClockwise` | Clockwise | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Rotate Pages

`com.apple.Preview.RotatePageIntent` · key `com_apple_preview_rotate_pages`
  
Rotates the pages in the specified direction.
  
Output: Page `com.apple.Preview.PageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `pages` | Pages | any | entity PageEntity |
| `isClockwise` | Clockwise | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Save Documents

`com.apple.Preview.SaveIntent` · key `com_apple_preview_save_documents`
  
Save the documents.
  
Output: Document `com.apple.Preview.DocumentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `documents` | Documents | any | entity DocumentEntity |

### Search Documents

`com.apple.Preview.SearchIntent` · key `com_apple_preview_search_documents`
  
Searches for text in the documents.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `documents` | Documents | any | entity DocumentEntity |
| `criteria` | Search Terms | text | string |

## Print Center (`com.apple.printcenter`)

### Cancel Print Job

`com.apple.printcenter.CancelPrintJob` · key `com_apple_printcenter_cancel_print_job`
  
Cancel Print Job
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `jobContextIdentifier` | Running Context Identifier | text | string |

### Open Print Center

`com.apple.printcenter.LaunchPrintCenterAppIntent` · key `com_apple_printcenter_open_print_center`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Open Print Center | string | enum: `launch` |

### Print Documents

`com.apple.printcenter.PrintDocuments` · key `com_apple_printcenter_print_documents`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `documents` | Documents | any | file |
| `printer` | Printer | any | entity PrinterEntity |

## Reminders (`com.apple.reminders`)

### Add or Remove Tags

`com.apple.reminders.AddOrRemoveTagsAppIntent` · key `reminders_add_or_remove_tags`
  
Add tags to or remove tags from reminders.
  
Output: Reminder `com.apple.reminders.ReminderEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `operation` | Operation | string | enum: `add`, `remove` |
| `reminders` | Reminders | any | entity ReminderEntity |
| `tags` | Tags | text | string |
| `OpenWhenRun` | Open When Run | bool | bool |

### Set Reminder completion state

`com.apple.reminders.CompleteReminderAppIntent` · key `reminders_set_reminder_completion_state`
  
Set the completion of a specific reminder and its subtasks.
  
Output: Reminder `com.apple.reminders.ReminderEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `reminder` | Reminder | any | entity ReminderEntity |
| `isCompleted` | Completed | bool | bool |
| `completeSubtasks` | Complete subtasks | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Open New Custom Smart List

`com.apple.reminders.CreateCustomSmartListAppIntent` · key `reminders_open_new_custom_smart_list`
  
Creates a list to automatically include reminders filtered by tags, dates, and more.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | string |

### Create Group

`com.apple.reminders.CreateGroupAppIntent` · key `reminders_create_group`
  
Creates a group in Reminders.
  
Output: Group `com.apple.reminders.GroupEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Group Name | text | string |
| `lists` | Lists | any | entity ListEntity |

### Create Section

`com.apple.reminders.CreateSectionAppIntent` · key `reminders_create_section`
  
Creates a section in a list.
  
Output: Section `com.apple.reminders.SectionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `list` | Parent List | any | entity ListEntity |
| `name` | Section Name | text | string |
| `OpenWhenRun` | Open When Run | bool | bool |

### Delete Lists

`com.apple.reminders.DeleteListsAppIntent` · key `reminders_delete_lists`
  
Delete lists from Reminders.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Lists | any | entity ListEntity |

### Delete Reminders and Subtasks

`com.apple.reminders.DeleteRemindersAppIntent` · key `reminders_delete_reminders_and_subtasks`
  
Delete reminders.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Reminders | any | entity ReminderEntity |
| `deleteSubtasks` | Delete Subtasks | bool | bool |
| `deleteRecurringReminders` | Delete Recurring Reminders | string | enum: `allFutureReminders`, `thisReminder` |

### Delete Groups

`com.apple.reminders.DeleteRemindersListGroupsAppIntent` · key `reminders_delete_groups`
  
Delete groups from Reminders.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Groups | any | entity GroupEntity |
| `deleteSublists` | Delete Sublists | bool | bool |

### Delete Sections

`com.apple.reminders.DeleteSectionsAppIntent` · key `reminders_delete_sections`
  
Delete sections from Reminders.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Sections | any | entity SectionEntity |
| `deleteReminders` | Delete Reminders | bool | bool |

### Find Group

`com.apple.reminders.GroupEntity` · key `reminders_find_group`
  
Output: Group `com.apple.reminders.GroupEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `name` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | group | string | enum: `Library` |

### Change Reminders Group Name

`com.apple.reminders.GroupEntity-UpdatableEntity` · key `reminders_change_reminders_group_name`
  
Update reminders group name.
  
Output: Group `com.apple.reminders.GroupEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Group | any | entity GroupEntity |
| `nameUpdatableProperty` | Group Name | text | string |

### Find List

`com.apple.reminders.ListEntity` · key `reminders_find_list`
  
Output: List `com.apple.reminders.ListEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `name`, `type` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | list | string | enum: `Library` |

### Edit List

`com.apple.reminders.ListEntity-UpdatableEntity` · key `reminders_edit_list`
  
Edit List
 • Auto-Categorize
 • Badge
 • Color
 • Pinned
 • List Layout
 • Name
 • Shared List Owner
 • Parent Group
 • Sharing Participants
 • Show Completed
 • Sorting Style
 • Type
  
Output: List `com.apple.reminders.ListEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `badge` | Badge | any | entity ListBadgeEntity |
| `color` | Color | any | entity ColorEntity |
| `entity` | List | any | entity ListEntity |
| `parent` | Parent Group | any | entity GroupEntity |

### Move Reminders

`com.apple.reminders.MoveRemindersAppIntent` · key `reminders_move_reminders`
  
Move reminders to a list or section, or make them a subtask of a parent reminder.
  
Output: Reminder `com.apple.reminders.ReminderEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `reminders` | Reminders | any | entity ReminderEntity |
| `position` | Position | string | enum: `bottom`, `top` |
| `targetType` | Target Type | string | enum: `list`, `parentReminder`, `section` |
| `list` | List | any | entity ListEntity |
| `section` | Section | any | entity SectionEntity |
| `parentReminder` | Parent Reminder | any | entity ReminderEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Open Group

`com.apple.reminders.OpenGroupAppIntent` · key `reminders_open_group`
  
Opens a Group in Reminders.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Group | any | entity GroupEntity |

### Open Reminder In List

`com.apple.reminders.OpenReminderAppIntent` · key `reminders_open_reminder_in_list`
  
Opens a reminder.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Reminder | any | entity ReminderEntity |
| `showDetail` | Open Details | bool | bool |
| `title` | Title | text | string |
| `caption` | Caption | text | string |
| `inSmartList` | In Smart List | string | enum: `all`, `assigned`, `completed`, `flagged`, `scheduled`, `today` |

### Open Smart List

`com.apple.reminders.OpenSmartListAppIntent` · key `reminders_open_smart_list`
  
Open a smart list in Reminders.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Smart List Type | string | enum: `all`, `assigned`, `completed`, `flagged`, `scheduled`, `today` |

### Find Reminder

`com.apple.reminders.ReminderEntity` · key `reminders_find_reminder`
  
Output: Reminder `com.apple.reminders.ReminderEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `completionDate`, `creationDate`, `dueDate`, `isCompleted`, `isFlagged`, `note`, `recurrence`, `tags`, `title`, `urls` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | reminder | string | enum: `Library` |

### Get User Defaults Entity

`com.apple.reminders.RemotePreferencesEntity` · key `reminders_get_user_defaults_entity`
  
Output: User Defaults Entity `com.apple.reminders.RemotePreferencesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `timeZoneOverride` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | user defaults entity | string | enum: `Library` |

### Find Section

`com.apple.reminders.SectionEntity` · key `reminders_find_section`
  
Output: Section `com.apple.reminders.SectionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `name` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | section | string | enum: `Library` |

### Update section collapsed state

`com.apple.reminders.SectionEntity-UpdatableEntity` · key `reminders_update_section_collapsed_state`
  
Update section collapsed state.
  
Output: Section `com.apple.reminders.SectionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Section | any | entity SectionEntity |
| `isCollapsed` | Collapse | bool | bool |

### Find Smart List

`com.apple.reminders.SmartListEntity` · key `reminders_find_smart_list`
  
Find a Reminders Smart List.
  
Output: Reminders Smart Lists `com.apple.reminders.SmartListEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `isHidden`, `type` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | smart list | string | enum: `Library` |

### Create List

`com.apple.reminders.TTRCreateListAppIntent` · key `reminders_create_list`
  
Creates a list in Reminders.
  
Output: List `com.apple.reminders.ListEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | List Name | text | string |
| `type` | Type | string | enum: `groceries`, `standard` |
| `group` | Parent Group | any | entity GroupEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Create Reminder

`com.apple.reminders.TTRCreateReminderAppIntent` · key `reminders_create_reminder`
  
Creates a new reminder.
  
Output: Reminder `com.apple.reminders.ReminderEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `title` | Title | text | string |
| `note` | Note | text | richText |
| `isFlagged` | Flag | bool | bool |
| `images` | Images | any | file |
| `tags` | Tags | text | string |
| `urls` | URLs | text | url |
| `dueDate` | Due Date | any | dateComponents |
| `recurrence` | Recurrence | any | recurrence |
| `locationTrigger` | Location | any | entity LocationTriggerEntity |
| `list` | Target List | any | entity ListEntity |
| `section` | List Section | any | entity SectionEntity |
| `isAllDay` | All-Day | bool | bool |
| `earlyAlert` | Early Reminder | any | entity EarlyAlertEntity |
| `vehicleTrigger` | Vehicle Trigger | string | enum: `connected`, `disconnected` |
| `priorityLevel` | Priority | string | enum: `high`, `low`, `medium`, `none` |
| `parentReminder` | Parent Reminder | any | entity ReminderEntity |
| `contactPerson` | Contact Person | any | person |
| `assignedPerson` | Assign Reminder | any | person |
| `subtasks` | Subtasks | text | string |

### Open List

`com.apple.reminders.TTROpenListAppIntent` · key `reminders_open_list`
  
Opens a list in Reminders.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | List | any | entity ListEntity |

### Open List

`com.apple.reminders.TTROpenSmartListAppIntent` · key `reminders_open_list`
  
Opens a list in Reminders.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | List | any | entity AnyListEntity |

### Search in Reminders

`com.apple.reminders.TTRSearchRemindersAppIntent` · key `reminders_search_in_reminders`
  
Search for a reminder.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `searchPhrase` | Text | text | string |

### Update reminders group properties

`com.apple.reminders.UpdateGroupAppIntent` · key `reminders_update_reminders_group_properties`
  
Update reminders group properties.
  
Output: Group `com.apple.reminders.GroupEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | string |
| `target` | Target | any | entity GroupEntity |
| `lists` | Lists | any | entity ListEntity |

### Edit List

`com.apple.reminders.UpdateListAppIntent` · key `reminders_edit_list`
  
Edit List
• Name
• Type
• Color
• Badge
• Parent Group
  
Output: List `com.apple.reminders.ListEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Reminders List | any | entity ListEntity |
| `name` | Name | text | string |
| `type` | Type | string | enum: `groceries`, `standard` |
| `color` | Color | any | entity ColorEntity |
| `badge` | Badge | any | entity ListBadgeEntity |
| `parent` | Parent Group | any | entity GroupEntity |
| `propertyToUpdate` | Property | string | enum: `badge`, `color`, `name`, `parent`, `type` |

### Auto-Categorize Reminders List

`com.apple.reminders.UpdateListAutoCategorizeAppIntent` · key `reminders_auto_categorize_reminders_list`
  
Auto-Categorize a reminders list.
  
Output: List `com.apple.reminders.ListEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | List | any | entity ListEntity |
| `autoCategorize` | Auto-Categorize | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Pin/Unpin Reminders List

`com.apple.reminders.UpdateListIsPinnedAppIntent` · key `reminders_pin_unpin_reminders_list`
  
Pin or unpin reminders list.
  
Output: List `com.apple.reminders.ListEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | List | any | entity ListEntity |
| `isPinned` | Pinned | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Change Reminders List Layout

`com.apple.reminders.UpdateListLayoutAppIntent` · key `reminders_change_reminders_list_layout`
  
Toggle reminders list layout.
  
Output: List `com.apple.reminders.ListEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | List | any | entity ListEntity |
| `listLayout` | List Layout | string | enum: `columns`, `list` |
| `OpenWhenRun` | Open When Run | bool | bool |

### Show/Hide Completed Reminders

`com.apple.reminders.UpdateListShowsCompletedAppIntent` · key `reminders_show_hide_completed_reminders`
  
Toggle show or hide completed reminders in list.
  
Output: List `com.apple.reminders.ListEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | List | any | entity ListEntity |
| `showsCompleted` | Show Completed | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Change Reminders List Sorting Style

`com.apple.reminders.UpdateListSortingStyleAppIntent` · key `reminders_change_reminders_list_sorting_style`
  
Change reminders list sorting style.
  
Output: List `com.apple.reminders.ListEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | List | any | entity ListEntity |
| `sortingStyle` | Sorting Style | string | enum: `creationDateNewestFirst`, `creationDateOldestFirst`, `default`, `displayDateNewestFirst`, `displayDateOldestFirst`, `manual`, `priorityHighestFirst`, `priorityLowestFirst`, `titleAscending`, `titleDescending` |
| `OpenWhenRun` | Open When Run | bool | bool |

### Update Reminder properties

`com.apple.reminders.UpdateReminderAppIntent` · key `reminders_update_reminder_properties`
  
Update Reminder properties.
  
Output: Reminder `com.apple.reminders.ReminderEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Reminder | any | entity ReminderEntity |
| `isCompleted` | Is Completed | bool | bool |
| `isFlagged` | Is Flagged | bool | bool |
| `title` | Title | text | string |
| `note` | Note | text | richText |
| `images` |  | any | file |
| `tags` | Tags | text | string |
| `urls` | URLs | text | url |
| `dueDate` | Due Date | any | dateComponents |
| `recurrence` | Recurrence | any | recurrence |
| `locationTrigger` | Location | any | entity LocationTriggerEntity |
| `subtasks` |  | any | entity ReminderEntity |
| `list` | List | any | entity ListEntity |
| `section` |  | any | entity SectionEntity |
| `earlyAlert` | UpdateReminderAppIntent_Early Reminder | any | entity EarlyAlertEntity |
| `vehicleTrigger` | UpdateReminderAppIntent_Vehicle Trigger | string | enum: `connected`, `disconnected` |
| `contactPerson` | UpdateReminderAppIntent_When Messaging | any | person |
| `assignedPerson` | UpdateReminderAppIntent_Assign Reminder | any | person |
| `priorityLevel` | UpdateReminderAppIntent_Priority | string | enum: `high`, `low`, `medium`, `none` |
| `parent` | UpdateReminderAppIntent_Parent Reminder | any | entity ReminderEntity |

### Update section properties

`com.apple.reminders.UpdateSectionAppIntent` · key `reminders_update_section_properties`
  
Update section properties.
  
Output: Section `com.apple.reminders.SectionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Target | any | entity SectionEntity |
| `name` | Name | text | string |
| `isCollapsed` | Collapse | bool | bool |

### Update reminders system smart list properties

`com.apple.reminders.UpdateSmartListAppIntent` · key `reminders_update_reminders_system_smart_list_properties`
  
Update reminders smart list properties.
  
Output: Smart List `com.apple.reminders.SmartListEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Reminders Smart List | any | entity SmartListEntity |
| `isHidden` | Hide | bool | bool |

### Show/Hide Reminders System Smart List

`com.apple.reminders.UpdateSmartListIsHiddenAppIntent` · key `reminders_show_hide_reminders_system_smart_list`
  
Show or hide reminders system smart list.
  
Output: Smart List `com.apple.reminders.SmartListEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | SmartList | string | enum: `all`, `assigned`, `completed`, `flagged`, `scheduled`, `today` |
| `property` | Hide | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Create List and Reminder

`com.apple.siri.notebook.SiriNotebookFlowTools.SiriNotebookFlowTools.CreateListAddReminderFlowTool|com.apple.reminders` · key `-`
  
Create a new list and add a new reminder to it
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `title` | Title | text | string |
| `note` | Note | text | richText |
| `tags` | Tags | text | string |
| `urls` | URLs | text | url |
| `dueDate` | Due Date | any | dateComponents |
| `recurrence` | Recurrence | any | recurrence |
| `list` | Target List | any | entity ListEntity |
| `isFlagged` | Flag | bool | bool |
| `locationTrigger` | Location | any | entity LocationTriggerEntity |
| `name` | List Name | text | string |
| `type` | Type | string | enum: `groceries`, `standard` |

### Create Reminder

`com.apple.siri.notebook.SiriNotebookFlowTools.SiriNotebookFlowTools.CreateReminderFlowTool|com.apple.reminders` · key `-`
  
Create a new reminder
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `title` | Title | text | string |
| `note` | Note | text | richText |
| `tags` | Tags | text | string |
| `urls` | URLs | text | url |
| `dueDate` | Due Date | any | dateComponents |
| `recurrence` | Recurrence | any | recurrence |
| `list` | Target List | any | entity ListEntity |
| `isFlagged` | Flag | bool | bool |
| `locationTrigger` | Location | any | entity LocationTriggerEntity |

### Prepare Read Reminders

`com.apple.siri.notebook.SiriNotebookFlowTools.SiriNotebookFlowTools.PrepareReadRemindersFlowTool|com.apple.reminders` · key `-`
  
Takes a list of reminders and prepares them for reading.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | entities | any | entity ReminderEntity |
| `list` | Target List | any | entity ListEntity |

### Update Reminder

`com.apple.siri.notebook.SiriNotebookFlowTools.SiriNotebookFlowTools.UpdateReminderFlowTool|com.apple.reminders` · key `-`
  
Update reminder
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Reminder | any | entity ReminderEntity |
| `isCompleted` | Is Completed | bool | bool |
| `title` | Title | text | string |
| `note` | Note | text | richText |
| `tags` | Tags | text | string |
| `urls` | URLs | text | url |
| `dueDate` | Due Date | any | dateComponents |
| `recurrence` | Recurrence | any | recurrence |
| `list` | List | any | entity ListEntity |
| `isFlagged` | Is Flagged | bool | bool |
| `locationTrigger` | Location | any | entity LocationTriggerEntity |

## Safari (`com.apple.Safari`)

### Find Bookmarks

`com.apple.Safari.BookmarkEntity` · key `safari_find_bookmarks`
  
Output: Bookmark `com.apple.Safari.BookmarkEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `name`, `title`, `url` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | bookmark | string | enum: `Library` |

### Bookmark Tab

`com.apple.Safari.BookmarkTabIntent` · key `safari_bookmark_tab`
  
Creates a new bookmark for this tab.
  
Output: Bookmark `com.apple.Safari.BookmarkEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `tab` | Tab | any | entity TabEntity |
| `name` | Title | text | string |

### Bookmark URL

`com.apple.Safari.BookmarkURLIntent` · key `safari_bookmark_url`
  
Creates a new bookmark for a given URL.
  
Output: Bookmark `com.apple.Safari.BookmarkEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `url` | URL | text | url |
| `name` | Name | text | string |

### Close Tab

`com.apple.Safari.CloseTab` · key `safari_close_tab`
  
Closes the selected tab.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Tab | any | entity TabEntity |

### Close View

`com.apple.Safari.CloseView` · key `safari_close_view`
  
Closes the view in Safari.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | View | string | enum: `bookmarks`, `history`, `localTabGroup`, `privateTabGroup`, `readingList`, `sharedWithYou`, `sidebar`, `startPage`, `tabOverview` |

### Close Windows

`com.apple.Safari.CloseWindowsIntent` · key `safari_close_windows`
  
Closes the selected windows.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Windows | any | entity WindowEntity |

### Add Bookmark

`com.apple.Safari.CreateNewBookmark` · key `safari_add_bookmark`
  
Adds the current page to Bookmarks.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Title | text | string |

### Create New Tab

`com.apple.Safari.CreateNewTab` · key `safari_create_new_tab`
  
Opens a new tab in the current Tab Group.
  
Output: Tab `com.apple.Safari.TabEntity`

### Create Tab Group

`com.apple.Safari.CreateNewTabGroup` · key `safari_create_tab_group`
  
Creates a new Tab Group, optionally with specified contents.
  
Output: Tab Group `com.apple.Safari.TabGroupEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `contents` | Contents | any | entity TabEntity |
| `name` | Tab Group Name | text | string |

### Create Window

`com.apple.Safari.CreateNewWindow` · key `safari_create_window`
  
Creates a new browser window.
  
Output: Window `com.apple.Safari.WindowEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `isPrivate` | Private Browsing | bool | bool |

### Add to Reading List

`com.apple.Safari.CreateReadingListItem` · key `safari_add_to_reading_list`
  
Adds the current page to Reading List.
  
Output: Reading List Item `com.apple.Safari.ReadingListItemEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Title | text | string |
| `title` | Title | text | string |
| `url` | Url | text | url |

### Delete Bookmarks

`com.apple.Safari.DeleteBookmarks` · key `safari_delete_bookmarks`
  
Deletes the selected bookmarks.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Bookmarks | any | entity BookmarkEntity |

### Delete Tab Groups

`com.apple.Safari.DeleteTabGroups` · key `safari_delete_tab_groups`
  
Delete one or more Safari Tab Groups.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Tab Groups | any | entity TabGroupEntity |

### Find on Page

`com.apple.Safari.FindOnPage` · key `safari_find_on_page`
  
Find the given text on the selected tab.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `searchPhrase` | Phrase | text | string |
| `tab` | Tab | any | entity TabEntity |

### Find History Entity

`com.apple.Safari.HistoryEntity` · key `safari_find_history_entity`
  
Output: History Entity `com.apple.Safari.HistoryEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `lastVisitedDate`, `name`, `textContentSnippet`, `title`, `url` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | history entity | string | enum: `Library` |

### Open Link

`com.apple.Safari.LoadURLInTab` · key `safari_open_link`
  
Navigates a tab to the given URL.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `url` | URL | text | url |
| `tab` | Tab | any | entity TabEntity |

### Move Tabs to Tab Group

`com.apple.Safari.MoveTabsToTabGroup` · key `safari_move_tabs_to_tab_group`
  
Move Safari tabs from their current Tab Group into a new one.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Tabs | any | entity TabEntity |
| `container` | Tab Group | any | entity TabGroupEntity |

### Move Tabs to Window

`com.apple.Safari.MoveTabsToWindowIntent` · key `safari_move_tabs_to_window`
  
Move Safari tabs from their current window into another window.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Tabs | any | entity TabEntity |
| `container` | Window | any | entity WindowEntity |

### Open Bookmark

`com.apple.Safari.OpenBookmark` · key `safari_open_bookmark`
  
Opens the selected bookmark.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Bookmark | any | entity BookmarkEntity |

### Open Reading List Item

`com.apple.Safari.OpenReadingListItem` · key `safari_open_reading_list_item`
  
Opens the selected Reading List item.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | List | any | entity ReadingListItemEntity |

### Switch Tab

`com.apple.Safari.OpenTab` · key `safari_switch_tab`
  
Switch to an existing tab.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Tab | any | entity TabEntity |

### Open Tab Group

`com.apple.Safari.OpenTabGroup` · key `safari_open_tab_group`
  
Opens the selected Tab Group.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Tab Group | any | entity TabGroupEntity |

### Open View

`com.apple.Safari.OpenView` · key `safari_open_view`
  
Opens the view in Safari.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | View | string | enum: `bookmarks`, `history`, `localTabGroup`, `privateTabGroup`, `readingList`, `sharedWithYou`, `sidebar`, `startPage`, `tabOverview` |

### Search Website

`com.apple.Safari.QuickWebsiteSearchIntent` · key `safari_search_website`
  
Opens browser to search given term on specified website.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `term` | Text | text | string |
| `website` | Website | any | entity QuickWebsiteSearchProviderEntity |

### Find Searchable Website

`com.apple.Safari.QuickWebsiteSearchProviderEntity` · key `safari_find_searchable_website`
  
Output: Searchable Website `com.apple.Safari.QuickWebsiteSearchProviderEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `sourcePageURLString`, `title`, `topDomain`, `url` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | searchable website | string | enum: `Library` |

### Find Reading List Items

`com.apple.Safari.ReadingListItemEntity` · key `safari_find_reading_list_items`
  
Output: Reading List Item `com.apple.Safari.ReadingListItemEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `title`, `url` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | reading list item | string | enum: `Library` |

### Search Tabs

`com.apple.Safari.SearchTabs` · key `safari_search_tabs`
  
Perform a search of tabs in Safari.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Keyword | text | string |

### Show Window

`com.apple.Safari.ShowWindowIntent` · key `safari_show_window`
  
Brings the given Safari window to the foreground.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Window | any | entity WindowEntity |

### Find Tabs

`com.apple.Safari.TabEntity` · key `safari_find_tabs`
  
Output: Tab `com.apple.Safari.TabEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `isPrivate`, `name`, `url` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | tab | string | enum: `Library` |

### Find Tab Groups

`com.apple.Safari.TabGroupEntity` · key `safari_find_tab_groups`
  
Output: Tab Group `com.apple.Safari.TabGroupEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `title` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | tab group | string | enum: `Library` |

### Find Window

`com.apple.Safari.WindowEntity` · key `safari_find_window`
  
Output: Window `com.apple.Safari.WindowEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `isPrivate`, `tabs`, `title` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | window | string | enum: `Library` |

## Screenshot (`com.apple.screenshot.launcher`)

### Capture Screen

`com.apple.screenshot.launcher.CaptureScreenIntent` · key `com_apple_screenshot_launcher_capture_screen`
  
Output:  `none`

### Capture Selection

`com.apple.screenshot.launcher.CaptureSelectionIntent` · key `com_apple_screenshot_launcher_capture_selection`
  
Output:  `none`

### Capture Selection with Visual Intelligence

`com.apple.screenshot.launcher.CaptureSelectionWithVisualIntelligenceIntent` · key `com_apple_screenshot_launcher_capture_selection_with_visual_intelligence`
  
Output:  `none`

### Custom Capture

`com.apple.screenshot.launcher.CustomCaptureIntent` · key `com_apple_screenshot_launcher_custom_capture`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `arguments` | Arguments | text | string |

### Custom Capture

`com.apple.screenshot.launcher.CustomRecordIntent` · key `com_apple_screenshot_launcher_custom_capture`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | Start or stop screen recording | bool | bool |
| `arguments` | Arguments | text | string |

### Record Screen

`com.apple.screenshot.launcher.RecordScreenIntent` · key `com_apple_screenshot_launcher_record_screen`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | Start or stop screen recording | bool | bool |

### Record Selection

`com.apple.screenshot.launcher.RecordSelectionIntent` · key `com_apple_screenshot_launcher_record_selection`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | Start or stop screen recording | bool | bool |

### Screenshot Toolbar

`com.apple.screenshot.launcher.ScreenshotToolbarIntent` · key `com_apple_screenshot_launcher_screenshot_toolbar`
  
Output:  `none`

## SearchToolExtension (`com.apple.omniSearch.SearchToolExtension`)

### Search

`com.apple.omniSearch.SearchToolExtension.SearchTool` · key `com_apple_omni_search_search_tool_extension_search`
  
Answer user's query
  
Output: Search results `com.apple.omniSearch.SearchToolExtension.SearchEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `rawQuery` | rawQuery | text | string |
| `rewrittenQuery` | rewrittenQuery | text | string |
| `simplifiedQuery` | simplifiedQuery | text | string |
| `structuredQuery` | structuredQueryEntity | any | entity StructuredQueryEntity |
| `typeIdentifiers` | typeIdentifiers | any | entity SearchEntityTypeIdentifier |
| `context` | context | any | entity SearchContext |
| `matchedEntities` | entities | any | entity EntityMatch |
| `isFirstToolInvocation` | isFirstToolInvocation | bool | bool |
| `isOnScreenReference` | isOnScreenReference | bool | bool |
| `isSingleStepSearch` | isSingleStepSearch | bool | bool |
| `invocationClient` | invocationClient | string | enum: `montaraWritingTool` |
| `requestedProperties` | requestedProperties | any | entity SearchPropertyRequest |
| `disambiguatedEntity` | disambiguatedEntity | any | entity SearchEntity |
| `ShowWhenRun` | Show When Run | bool | bool |

### SearchTool Control

`com.apple.omniSearch.SearchToolExtension.SearchToolControl` · key `com_apple_omni_search_search_tool_extension_search_tool_control`
  
Control interface for SearchTool Extension
  
Output: SearchTool control command result `bool`

| Key | Name | Kind | Type |
|---|---|---|---|
| `command` | command | text | string |
| `originatorPID` | originatorPID | number | int |
| `useMiniMC` | useMiniMC | bool | bool |

## SettingsPlaceholder (`com.apple.Settings`)

### Find Accessibility Settings

`com.apple.Settings.AccessibilitySettingsExtensionSettingsDeepLink` · key `com_apple_settings_find_accessibility_settings`
  
Output: Accessibility Settings `com.apple.Settings.AccessibilitySettingsExtensionSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | accessibility settings | string | enum: `Library` |

### Find Apple Account Settings

`com.apple.Settings.AppleAccountSettingsDeepLink` · key `com_apple_settings_find_apple_account_settings`
  
Output: Apple Account Settings `com.apple.Settings.AppleAccountSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | apple account settings | string | enum: `Library` |

### Find Application Notifications

`com.apple.Settings.ApplicationNotificationsSettings` · key `com_apple_settings_find_application_notifications`
  
Output: Application Notifications `com.apple.Settings.ApplicationNotificationsSettings`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `alertStyle`, `allowCriticalAlerts`, `allowNotifications`, `allowTimeSensitive`, `badgeAppIcon`, `notificationGrouping`, `playSounds`, `showInNotificationCenter`, `showOnLockScreen`, `showPreviews` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | application notifications | string | enum: `Library` |

### Edit Application Notifications

`com.apple.Settings.ApplicationNotificationsSettings-UpdatableEntity` · key `com_apple_settings_edit_application_notifications`
  
Edit Application Notifications
 • Alert style
 • Critical alerts
 • Allow notifications
 • Time sensitive notifications
 • Badge application icon
 • Notification grouping
 • Play sound for notification
 • Show in Notification Center
 • Show notifications on lock screen
 • Show previews
  
Output: Application Notifications `com.apple.Settings.ApplicationNotificationsSettings`

| Key | Name | Kind | Type |
|---|---|---|---|
| `alertStyle` | Alert style to update on Application Notifications | string | enum: `0`, `1`, `2` |
| `allowCriticalAlerts` | Critical alerts to update on Application Notifications | bool | bool |
| `allowNotifications` | Allow notifications to update on Application Notifications | bool | bool |
| `allowTimeSensitive` | Time sensitive notifications to update on Application Notifications | bool | bool |
| `badgeAppIcon` | Badge application icon to update on Application Notifications | bool | bool |
| `entity` | Application Notifications | any | entity ApplicationNotificationsSettings |
| `notificationGrouping` | Notification grouping to update on Application Notifications | string | enum: `0`, `1`, `2` |
| `playSounds` | Play sound for notification to update on Application Notifications | bool | bool |
| `showInNotificationCenter` | Show in Notification Center to update on Application Notifications | bool | bool |
| `showOnLockScreen` | Show notifications on lock screen to update on Application Notifications | bool | bool |
| `showPreviews` | Show previews to update on Application Notifications | string | enum: `0`, `1`, `2`, `3` |

### Get Automatically Set Date & Time

`com.apple.Settings.AutoDateTimeEntity` · key `settings_get_automatically_set_date_time`
  
Output: Automatically Set Date & Time `com.apple.Settings.AutoDateTimeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically set date & time | string | enum: `Library` |

### Get Automatically hide and show the menu bar

`com.apple.Settings.AutoHideMenuBarOptionEntity` · key `com_apple_settings_get_automatically_hide_and_show_the_menu_bar`
  
Output: Automatically hide and show the menu bar `com.apple.Settings.AutoHideMenuBarOptionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `autoHideMenuBar` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically hide and show the menu bar | string | enum: `Library` |

### Update Automatically hide and show the menu bar

`com.apple.Settings.AutoHideMenuBarOptionEntity-UpdatableEntity` · key `com_apple_settings_update_automatically_hide_and_show_the_menu_bar`
  
Change the Automatically hide and show the menu bar value of Automatically hide and show the menu bar
  
Output: Automatically hide and show the menu bar `com.apple.Settings.AutoHideMenuBarOptionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `autoHideMenuBar` | Automatically hide and show the menu bar to update on Automatically hide and show the menu bar | string | enum: `always`, `desktopOnly`, `fullscreenOnly`, `never` |
| `entity` | Automatically hide and show the menu bar | any | entity AutoHideMenuBarOptionEntity |

### Get Automatically Set Time Zone

`com.apple.Settings.AutoTimeZoneEntity` · key `settings_get_automatically_set_time_zone`
  
Output: Automatically Set Time Zone `com.apple.Settings.AutoTimeZoneEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically set time zone | string | enum: `Library` |

### Get Bluetooth Power

`com.apple.Settings.BluetoothPowerEntity` · key `settings_get_bluetooth_power`
  
Output: Bluetooth Power `com.apple.Settings.BluetoothPowerEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | bluetooth power | string | enum: `Library` |

### Update bluetooth_power

`com.apple.Settings.BluetoothPowerEntity-UpdatableEntity` · key `settings_update_bluetooth_power`
  
Change the bluetooth_power value of bluetooth_power
  
Output: Bluetooth Power `com.apple.Settings.BluetoothPowerEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Bluetooth Power | any | entity BluetoothPowerEntity |
| `value` | bluetooth_power to update on bluetooth_power | bool | bool |

### Find Bluetooth Settings

`com.apple.Settings.BluetoothSettingsDeepLink` · key `com_apple_settings_find_bluetooth_settings`
  
Output: Bluetooth Settings `com.apple.Settings.BluetoothSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | bluetooth settings | string | enum: `Library` |

### Find CDs & DVDs Settings

`com.apple.Settings.CDsAndDvDsSettingsExtensionSettingsDeepLink` · key `com_apple_settings_find_cds_dvds_settings`
  
Output: CDs & DVDs Settings `com.apple.Settings.CDsAndDvDsSettingsExtensionSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | cds & dvds settings | string | enum: `Library` |

### Change Mouse Tracking Speed

`com.apple.Settings.ChangeMouseTrackingSpeedIntent` · key `com_apple_settings_change_mouse_tracking_speed`
  
Increases or decreases mouse tracking speed
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `change` | Mouse Tracking Speed Adjustment | string | enum: `decrease`, `increase` |

### Change Trackpad Tracking Speed

`com.apple.Settings.ChangeTrackpadTrackingSpeedIntent` · key `com_apple_settings_change_trackpad_tracking_speed`
  
Increases or decreases trackpad tracking speed
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `change` | Trackpad Tracking Speed Adjustment | string | enum: `decrease`, `increase` |

### Find Class Progress Settings

`com.apple.Settings.ClassKitSettingsSettingsDeepLink` · key `com_apple_settings_find_class_progress_settings`
  
Output: Class Progress Settings `com.apple.Settings.ClassKitSettingsSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | class progress settings | string | enum: `Library` |

### Find Classroom Settings

`com.apple.Settings.ClassroomDynamicDeepLinks` · key `com_apple_settings_find_classroom_settings`
  
Output: Classroom Settings `com.apple.Settings.ClassroomDynamicDeepLinks`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | classroom settings | string | enum: `Library` |

### Edit Clock Options

`com.apple.Settings.ClockOptionsEntity-UpdatableEntity` · key `com_apple_settings_edit_clock_options`
  
Edit Clock Options
 • Announce the time
 • Style
 • Flash the time separators
 • Show AM/PM
 • Show date
 • Show the day of the week
 • Display the time with seconds
 • Interval
  
Output: Clock Options `com.apple.Settings.ClockOptionsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `announceTime` | Announce the time to update on Clock Options | bool | bool |
| `clockStyle` | Style to update on Clock Options | string | enum: `0`, `1` |
| `entity` | Clock Options | any | entity ClockOptionsEntity |
| `flashSeparators` | Flash the time separators to update on Clock Options | bool | bool |
| `showAMPM` | Show AM/PM to update on Clock Options | bool | bool |
| `showDate` | Show date to update on Clock Options | bool | bool |
| `showDayOfWeek` | Show the day of the week to update on Clock Options | bool | bool |
| `showSeconds` | Display the time with seconds to update on Clock Options | bool | bool |
| `timeAnnouncementsInterval` | Interval to update on Clock Options | string | enum: `EveryHalfHourInterval`, `EveryHourInterval`, `EveryQuarterHourInterval` |

### Edit Control Center Module

`com.apple.Settings.ControlCenterModule-UpdatableEntity` · key `com_apple_settings_edit_control_center_module`
  
Edit Control Center Module
 • Always Show in Menu Bar
 • Show in Menu Bar
  
Output: Control Center Module `com.apple.Settings.ControlCenterModule`

| Key | Name | Kind | Type |
|---|---|---|---|
| `alwaysShowInMenuBar` | Always Show in Menu Bar to update on Control Center Module | bool | bool |
| `entity` | Control Center Module | any | entity ControlCenterModule |
| `showInMenuBar` | Show in Menu Bar to update on Control Center Module | bool | bool |

### Find Menu Bar Settings

`com.apple.Settings.ControlCenterSettingsSettingsDeepLink` · key `com_apple_settings_find_menu_bar_settings`
  
Output: Menu Bar Settings `com.apple.Settings.ControlCenterSettingsSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | menu bar settings | string | enum: `Library` |

### Find Date & Time Settings

`com.apple.Settings.DateAndTimeExtensionSettingsDeepLink` · key `com_apple_settings_find_date_time_settings`
  
Output: Date & Time Settings `com.apple.Settings.DateAndTimeExtensionSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | date & time settings | string | enum: `Library` |

### Get The Current Date & Time

`com.apple.Settings.DateTimeEntity` · key `settings_get_the_current_date_time`
  
Output: The Current Date & Time `com.apple.Settings.DateTimeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | the current date & time | string | enum: `Library` |

### Get Desktop Settings

`com.apple.Settings.DesktopSettingsEntity` · key `com_apple_settings_get_desktop_settings`
  
Output: Desktop Settings `com.apple.Settings.DesktopSettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `clickWallpaperToRevealDesktop`, `showItemsInStageManager`, `showItemsOnDesktop`, `showRecentAppsInStageManager`, `showWindowsFromAnApplication`, `stageManager` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | desktop settings | string | enum: `Library` |

### Edit Desktop Settings

`com.apple.Settings.DesktopSettingsEntity-UpdatableEntity` · key `com_apple_settings_edit_desktop_settings`
  
Edit Desktop Settings
 • Click wallpaper to show desktop
 • Visible Items In Stage Manager
 • Visible Items On Desktop
 • Show recent apps in Stage Manager
 • Show windows from an application
 • Stage Manager
  
Output: Desktop Settings `com.apple.Settings.DesktopSettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `clickWallpaperToRevealDesktop` | Click wallpaper to show desktop to update on Desktop Settings | string | enum: `0`, `1` |
| `entity` | Desktop Settings | any | entity DesktopSettingsEntity |
| `showItemsInStageManager` | Visible Items In Stage Manager to update on Desktop Settings | bool | bool |
| `showItemsOnDesktop` | Visible Items On Desktop to update on Desktop Settings | bool | bool |
| `showRecentAppsInStageManager` | Show recent apps in Stage Manager to update on Desktop Settings | bool | bool |
| `showWindowsFromAnApplication` | Show windows from an application to update on Desktop Settings | string | enum: `0`, `1` |
| `stageManager` | Stage Manager to update on Desktop Settings | bool | bool |

### Find Desktop & Dock Settings

`com.apple.Settings.DesktopSettingsSettingsDeepLink` · key `com_apple_settings_find_desktop_dock_settings`
  
Output: Desktop & Dock Settings `com.apple.Settings.DesktopSettingsSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | desktop & dock settings | string | enum: `Library` |

### Find Device Management Settings

`com.apple.Settings.DeviceManagementSettingsDeepLink` · key `com_apple_settings_find_device_management_settings`
  
Output: Device Management Settings `com.apple.Settings.DeviceManagementSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | device management settings | string | enum: `Library` |

### Get Dock Settings

`com.apple.Settings.DockSettingsEntity` · key `com_apple_settings_get_dock_settings`
  
Output: Dock Settings `com.apple.Settings.DockSettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `animateOpeningApplications`, `automaticallyHideAndShowTheDock`, `doubleClickAWindowsTitleBarTo`, `magnification`, `minimizeWindowsIntoApplicationIcon`, `minimizeWindowsUsing`, `positionOnScreen`, `showIndicatorsForOpenApplications`, `showSuggestedAndRecentAppsInDock`, `size` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | dock settings | string | enum: `Library` |

### Edit Dock Settings

`com.apple.Settings.DockSettingsEntity-UpdatableEntity` · key `com_apple_settings_edit_dock_settings`
  
Edit Dock Settings
 • Animate opening applications
 • Automatically hide and show the Dock
 • Window title bar double-click action
 • Magnification
 • Minimize windows into application icon
 • Minimized window animation
 • Dock position on screen
 • Show indicators for open applications
 • Show suggested and recent apps in Dock
 • Size
  
Output: Dock Settings `com.apple.Settings.DockSettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `animateOpeningApplications` | Animate opening applications to update on Dock Settings | bool | bool |
| `automaticallyHideAndShowTheDock` | Automatically hide and show the Dock to update on Dock Settings | bool | bool |
| `doubleClickAWindowsTitleBarTo` | Window title bar double-click action to update on Dock Settings | string | enum: `0`, `1`, `2`, `3` |
| `entity` | Dock Settings | any | entity DockSettingsEntity |
| `magnification` | Magnification to update on Dock Settings | number | double |
| `minimizeWindowsIntoApplicationIcon` | Minimize windows into application icon to update on Dock Settings | bool | bool |
| `minimizeWindowsUsing` | Minimized window animation to update on Dock Settings | string | enum: `0`, `1` |
| `positionOnScreen` | Dock position on screen to update on Dock Settings | string | enum: `0`, `1`, `2` |
| `showIndicatorsForOpenApplications` | Show indicators for open applications to update on Dock Settings | bool | bool |
| `showSuggestedAndRecentAppsInDock` | Show suggested and recent apps in Dock to update on Dock Settings | bool | bool |
| `size` | Size to update on Dock Settings | number | double |

### Find FamilyMemberDetailsDeepLink

`com.apple.Settings.FamilyMemberDetailsDeepLink` · key `com_apple_settings_find_family_member_details_deep_link`
  
Output: FamilyMemberDetailsDeepLink `com.apple.Settings.FamilyMemberDetailsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | familymemberdetailsdeeplink | string | enum: `Library` |

### Find FamilySettingsDeepLink

`com.apple.Settings.FamilySettingsDeepLink` · key `com_apple_settings_find_family_settings_deep_link`
  
Output: FamilySettingsDeepLink `com.apple.Settings.FamilySettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | familysettingsdeeplink | string | enum: `Library` |

### Find Family Settings

`com.apple.Settings.FamilySettingsSettingsDeepLink` · key `com_apple_settings_find_family_settings`
  
Output: Family Settings `com.apple.Settings.FamilySettingsSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | family settings | string | enum: `Library` |

### Find FamilySubscriptionsDeepLink

`com.apple.Settings.FamilySubscriptionsDeepLink` · key `com_apple_settings_find_family_subscriptions_deep_link`
  
Output: FamilySubscriptionsDeepLink `com.apple.Settings.FamilySubscriptionsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | familysubscriptionsdeeplink | string | enum: `Library` |

### Find FOCUS

`com.apple.Settings.FocusEntity` · key `com_apple_settings_find_focus`
  
Output: FOCUS `com.apple.Settings.FocusEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | focus | string | enum: `Library` |

### Get Swipe between full-screen applications

`com.apple.Settings.FullScreenSwipeEntity` · key `com_apple_settings_get_swipe_between_full_screen_applications`
  
Output: Swipe between full-screen applications `com.apple.Settings.FullScreenSwipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | swipe between full-screen applications | string | enum: `Library` |

### Update Swipe between full-screen applications

`com.apple.Settings.FullScreenSwipeEntity-UpdatableEntity` · key `com_apple_settings_update_swipe_between_full_screen_applications`
  
Change the Swipe between full-screen applications value of Swipe between full-screen applications
  
Output: Swipe between full-screen applications `com.apple.Settings.FullScreenSwipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Swipe between full-screen applications | any | entity FullScreenSwipeEntity |
| `value` | Swipe between full-screen applications to update on Swipe between full-screen applications | bool | bool |

### Find Game Center Settings

`com.apple.Settings.GameCenterMacOsSettingsExtensionSettingsDeepLink` · key `com_apple_settings_find_game_center_settings`
  
Output: Game Center Settings `com.apple.Settings.GameCenterMacOsSettingsExtensionSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | game center settings | string | enum: `Library` |

### Find Game Controllers Settings

`com.apple.Settings.GameControllerMacSettingsSettingsDeepLink` · key `com_apple_settings_find_game_controllers_settings`
  
Output: Game Controllers Settings `com.apple.Settings.GameControllerMacSettingsSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | game controllers settings | string | enum: `Library` |

### Get Startup Disk

`com.apple.Settings.GetStartupDiskIntent` · key `com_apple_settings_get_startup_disk`
  
This will return the name of the current startup disk.
  
Output: Name of the current startup disk `string`

### Get 24-Hour Time

`com.apple.Settings.HourFormatEntity` · key `settings_get_24_hour_time`
  
Output: 24-Hour Time `com.apple.Settings.HourFormatEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | 24-hour time | string | enum: `Library` |

### Update 24-Hour Time

`com.apple.Settings.HourFormatEntity-UpdatableEntity` · key `settings_update_24_hour_time`
  
Change the 24-Hour Time value of 24-Hour Time
  
Output: 24-Hour Time `com.apple.Settings.HourFormatEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | 24-Hour Time | any | entity HourFormatEntity |
| `value` | 24-Hour Time to update on 24-Hour Time | bool | bool |

### Find Keyboard Settings

`com.apple.Settings.KeyboardSettingsSettingsDeepLink` · key `com_apple_settings_find_keyboard_settings`
  
Output: Keyboard Settings `com.apple.Settings.KeyboardSettingsSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | keyboard settings | string | enum: `Library` |

### Find Language & Region Settings

`com.apple.Settings.LocalizationSettingsDeepLink` · key `com_apple_settings_find_language_region_settings`
  
Output: Language & Region Settings `com.apple.Settings.LocalizationSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | language & region settings | string | enum: `Library` |

### Get Mission Control

`com.apple.Settings.MissionControlEntity` · key `com_apple_settings_get_mission_control`
  
Output: Mission Control `com.apple.Settings.MissionControlEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | mission control | string | enum: `Library` |

### Update Mission Control

`com.apple.Settings.MissionControlEntity-UpdatableEntity` · key `com_apple_settings_update_mission_control`
  
Change the Mission Control value of Mission Control
  
Output: Mission Control `com.apple.Settings.MissionControlEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Mission Control | any | entity MissionControlEntity |
| `value` | Mission Control to update on Mission Control | bool | bool |

### Get Mission Control Settings

`com.apple.Settings.MissionControlSettingsEntity` · key `com_apple_settings_get_mission_control_settings`
  
Output: Mission Control Settings `com.apple.Settings.MissionControlSettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `automaticallyRearrangeSpacesBasedOnMostRecentUse`, `displaysHaveSeparateSpaces`, `enterMissionControlByTopWindowDrag`, `groupWindowsByApplication`, `whenSwitchingToAnApplicationSwitchToASpaceWithOpenWindowsForTheApplication` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | mission control settings | string | enum: `Library` |

### Edit Mission Control Settings

`com.apple.Settings.MissionControlSettingsEntity-UpdatableEntity` · key `com_apple_settings_edit_mission_control_settings`
  
Edit Mission Control Settings
 • Automatically rearrange Spaces based on most recent use
 • Displays have separate Spaces
 • Drag windows to top of screen to enter Mission Control
 • Group windows by application
 • When switching to an application, switch to a Space with open windows for the application
  
Output: Mission Control Settings `com.apple.Settings.MissionControlSettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `automaticallyRearrangeSpacesBasedOnMostRecentUse` | Automatically rearrange Spaces based on most recent use to update on Mission Control Settings | bool | bool |
| `displaysHaveSeparateSpaces` | Displays have separate Spaces to update on Mission Control Settings | bool | bool |
| `enterMissionControlByTopWindowDrag` | Drag windows to top of screen to enter Mission Control to update on Mission Control Settings | bool | bool |
| `entity` | Mission Control Settings | any | entity MissionControlSettingsEntity |
| `groupWindowsByApplication` | Group windows by application to update on Mission Control Settings | bool | bool |
| `whenSwitchingToAnApplicationSwitchToASpaceWithOpenWindowsForTheApplication` | When switching to an application, switch to a Space with open windows for the application to update on Mission Control Settings | bool | bool |

### Find Mouse Settings

`com.apple.Settings.MouseExtensionSettingsDeepLink` · key `com_apple_settings_find_mouse_settings`
  
Output: Mouse Settings `com.apple.Settings.MouseExtensionSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | mouse settings | string | enum: `Library` |

### Get Tracking speed

`com.apple.Settings.MouseTrackingSpeedEntity` · key `com_apple_settings_get_tracking_speed`
  
Output: Tracking speed `com.apple.Settings.MouseTrackingSpeedEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | tracking speed | string | enum: `Library` |

### Update Tracking speed

`com.apple.Settings.MouseTrackingSpeedEntity-UpdatableEntity` · key `com_apple_settings_update_tracking_speed`
  
Change the Tracking speed value of Tracking speed
  
Output: Tracking speed `com.apple.Settings.MouseTrackingSpeedEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Tracking speed | any | entity MouseTrackingSpeedEntity |
| `value` | Tracking speed to update on Tracking speed | string | enum: `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8` |

### Get Notification Center

`com.apple.Settings.NotificationCenterEntity` · key `com_apple_settings_get_notification_center`
  
Output: Notification Center `com.apple.Settings.NotificationCenterEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `allowWhenLocked`, `allowWhenSharing`, `allowWhenSleeping`, `showPreviews`, `summarizePreviews` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | notification center | string | enum: `Library` |

### Edit Notification Center

`com.apple.Settings.NotificationCenterEntity-UpdatableEntity` · key `com_apple_settings_edit_notification_center`
  
Edit Notification Center
 • Allow notifications when the screen is locked
 • Allow notifications when mirroring or sharing the display
 • Allow notifications when the display is sleeping
 • Show previews
 • Summarize notifications
  
Output: Notification Center `com.apple.Settings.NotificationCenterEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `allowWhenLocked` | Allow notifications when the screen is locked to update on Notification Center | bool | bool |
| `allowWhenSharing` | Allow notifications when mirroring or sharing the display to update on Notification Center | bool | bool |
| `allowWhenSleeping` | Allow notifications when the display is sleeping to update on Notification Center | bool | bool |
| `entity` | Notification Center | any | entity NotificationCenterEntity |
| `showPreviews` | Show previews to update on Notification Center | string | enum: `0`, `1`, `2` |
| `summarizePreviews` | Summarize notifications to update on Notification Center | bool | bool |

### Find Notifications Settings

`com.apple.Settings.NotificationsSettingsSettingsDeepLink` · key `com_apple_settings_find_notifications_settings`
  
Output: Notifications Settings `com.apple.Settings.NotificationsSettingsSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | notifications settings | string | enum: `Library` |

### Open Accessibility Settings

`com.apple.Settings.OpenAccessibilitySettingsExtensionSettingsDeepLink` · key `com_apple_settings_open_accessibility_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Accessibility Settings | any | entity AccessibilitySettingsExtensionSettingsDeepLink |

### Open Apple Account Settings

`com.apple.Settings.OpenAppleAccountSettingsDeepLink` · key `com_apple_settings_open_apple_account_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Apple Account Settings | any | entity AppleAccountSettingsDeepLink |

### Open Application Notifications Settings

`com.apple.Settings.OpenApplicationNotificationsSettings` · key `com_apple_settings_open_application_notifications_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Application Notifications | any | entity ApplicationNotificationsSettings |

### Open Automatically Set Date & Time Setting

`com.apple.Settings.OpenAutomaticallySetDateTimeSetting` · key `settings_open_automatically_set_date_time_setting`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Automatically Set Date & Time | any | entity AutoDateTimeEntity |

### Open Automatically Set Time Zone Setting

`com.apple.Settings.OpenAutomaticallySetTimeZoneSetting` · key `settings_open_automatically_set_time_zone_setting`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Automatically Set Time Zone | any | entity AutoTimeZoneEntity |

### Open Touch ID & Password Settings

`com.apple.Settings.OpenBiometricsAndPasswordSettingsEntityDeepLinks` · key `com_apple_settings_open_touch_id_password_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Touch ID & Password Settings | any | entity SettingsEntity |

### Open Bluetooth Power Setting

`com.apple.Settings.OpenBluetoothPowerDeepLink` · key `settings_open_bluetooth_power_setting`
  
Toggles the bluetooth power setting on or off
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Bluetooth Power | any | entity BluetoothPowerEntity |

### Open Bluetooth Settings

`com.apple.Settings.OpenBluetoothSettingsDeepLink` · key `com_apple_settings_open_bluetooth_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Bluetooth Settings | any | entity BluetoothSettingsDeepLink |

### Open CDs & DVDs Settings

`com.apple.Settings.OpenCDsAndDvDsSettingsExtensionSettingsDeepLink` · key `com_apple_settings_open_cds_dvds_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | CDs & DVDs Settings | any | entity CDsAndDvDsSettingsExtensionSettingsDeepLink |

### Open Class Progress Settings

`com.apple.Settings.OpenClassKitSettingsSettingsDeepLink` · key `com_apple_settings_open_class_progress_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Class Progress Settings | any | entity ClassKitSettingsSettingsDeepLink |

### Open Classroom Settings

`com.apple.Settings.OpenClassroomDynamicDeepLinks` · key `com_apple_settings_open_classroom_settings`
  
Opens a destination in Classroom Settings
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Classroom Settings | any | entity ClassroomDynamicDeepLinks |

### Open Clock Options

`com.apple.Settings.OpenClockOptionsEntity` · key `com_apple_settings_open_clock_options`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Clock Options | any | entity ClockOptionsEntity |

### Open an Internet Accountʼs Settings

`com.apple.Settings.OpenConfiguredInternetAccountSettings` · key `com_apple_settings_open_an_internet_accountʼs_settings`
  
Go to a specific Internet Accountʼs settings
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Internet Accounts | any | entity InternetAccountEntity |

### Open Control Center module setting

`com.apple.Settings.OpenControlCenterModule` · key `com_apple_settings_open_control_center_module_setting`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Control Center Module | any | entity ControlCenterModule |

### Open Menu Bar Settings

`com.apple.Settings.OpenControlCenterSettingsSettingsDeepLink` · key `com_apple_settings_open_menu_bar_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Menu Bar Settings | any | entity ControlCenterSettingsSettingsDeepLink |

### Open the Current Time Zone Setting

`com.apple.Settings.OpenCurrentTimeZoneSetting` · key `settings_open_the_current_time_zone_setting`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | The Current Time Zone | any | entity TimeZoneEntity |

### Open Date & Time Settings

`com.apple.Settings.OpenDateAndTimeExtensionSettingsDeepLink` · key `com_apple_settings_open_date_time_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Date & Time Settings | any | entity DateAndTimeExtensionSettingsDeepLink |

### Open Desktop Settings

`com.apple.Settings.OpenDesktopSettingsEntity` · key `com_apple_settings_open_desktop_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Desktop Settings | any | entity DesktopSettingsEntity |

### Open Desktop & Dock Settings

`com.apple.Settings.OpenDesktopSettingsSettingsDeepLink` · key `com_apple_settings_open_desktop_dock_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Desktop & Dock Settings | any | entity DesktopSettingsSettingsDeepLink |

### Open Device Management Settings

`com.apple.Settings.OpenDeviceManagementSettingsDeepLink` · key `com_apple_settings_open_device_management_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Device Management Settings | any | entity DeviceManagementSettingsDeepLink |

### Open Dock Settings

`com.apple.Settings.OpenDockSettingsEntity` · key `com_apple_settings_open_dock_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Dock Settings | any | entity DockSettingsEntity |

### Open Family Member Settings

`com.apple.Settings.OpenFamilyMemberSettings` · key `com_apple_settings_open_family_member_settings`
  
See what family members can access and share, and manage child account settings and parental controls.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | FamilyMemberDetailsDeepLink | any | entity FamilyMemberDetailsDeepLink |

### Open Family Settings

`com.apple.Settings.OpenFamilySettings` · key `com_apple_settings_open_family_settings`
  
See what family members can access and share, and manage child account settings and parental controls.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | FamilySettingsDeepLink | any | entity FamilySettingsDeepLink |

### Open Family Settings

`com.apple.Settings.OpenFamilySettingsSettingsDeepLink` · key `com_apple_settings_open_family_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Family Settings | any | entity FamilySettingsSettingsDeepLink |

### Set Up Family Sharing

`com.apple.Settings.OpenFamilySetup` · key `com_apple_settings_set_up_family_sharing`
  
Share your subscriptions and music, movie and other media purchases with up to five people.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | SetupFamilyDeepLink | any | entity SetupFamilyDeepLink |

### Open Family Subscriptions

`com.apple.Settings.OpenFamilySubscriptions` · key `com_apple_settings_open_family_subscriptions`
  
Manage all your Apple and App Store subscriptions.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | FamilySubscriptionsDeepLink | any | entity FamilySubscriptionsDeepLink |

### Open Focus Settings

`com.apple.Settings.OpenFocusSettingsExtensionSettingsDeepLink` · key `com_apple_settings_open_focus_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | FOCUS | any | entity FocusEntity |

### Open Game Center Settings

`com.apple.Settings.OpenGameCenterMacOsSettingsExtensionSettingsDeepLink` · key `com_apple_settings_open_game_center_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Game Center Settings | any | entity GameCenterMacOsSettingsExtensionSettingsDeepLink |

### Open Game Controllers Settings

`com.apple.Settings.OpenGameControllerMacSettingsSettingsDeepLink` · key `com_apple_settings_open_game_controllers_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Game Controllers Settings | any | entity GameControllerMacSettingsSettingsDeepLink |

### Open List of Internet Accounts

`com.apple.Settings.OpenInternetAccountsSettings` · key `com_apple_settings_open_list_of_internet_accounts`
  
Open List of Internet Accounts
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Internet Accounts | string | enum: `addAccount`, `root` |

### Open Keyboard Settings

`com.apple.Settings.OpenKeyboardSettingsSettingsDeepLink` · key `com_apple_settings_open_keyboard_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Keyboard Settings | any | entity KeyboardSettingsSettingsDeepLink |

### Open Language & Region Settings

`com.apple.Settings.OpenLocalizationSettingsDeepLink` · key `com_apple_settings_open_language_region_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Language & Region Settings | any | entity LocalizationSettingsDeepLink |

### Open Mission Control Settings

`com.apple.Settings.OpenMissionControlSettingsEntity` · key `com_apple_settings_open_mission_control_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Mission Control Settings | any | entity MissionControlSettingsEntity |

### Open Mouse Settings

`com.apple.Settings.OpenMouseExtensionSettingsDeepLink` · key `com_apple_settings_open_mouse_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Mouse Settings | any | entity MouseExtensionSettingsDeepLink |

### Open Notification Center Settings

`com.apple.Settings.OpenNotificationCenterEntity` · key `com_apple_settings_open_notification_center_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Notification Center | any | entity NotificationCenterEntity |

### Open Notification Summarization Settings

`com.apple.Settings.OpenNotificationSummarizationEntity` · key `com_apple_settings_open_notification_summarization_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Notification Summarization | any | entity NotificationSummarizationEntity |

### Open Notifications Settings

`com.apple.Settings.OpenNotificationsSettingsSettingsDeepLink` · key `com_apple_settings_open_notifications_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Notifications Settings | any | entity NotificationsSettingsSettingsDeepLink |

### Open Passwords Settings

`com.apple.Settings.OpenPasswordsSettingsExtensionSettingsDeepLink` · key `com_apple_settings_open_passwords_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Passwords Settings | any | entity PasswordsSettingsExtensionSettingsDeepLink |

### Open Screen Time Settings

`com.apple.Settings.OpenScreenTimeDeepLinksIntent` · key `com_apple_settings_open_screen_time_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Screen Time | any | entity ScreenTimeDeepLinks |

### Open Siri Settings

`com.apple.Settings.OpenSiriSetupSettingsDeepLink` · key `com_apple_settings_open_siri_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Siri Settings | any | entity SiriSetupSettingsDeepLink |

### Open Software Update Settings

`com.apple.Settings.OpenSoftwareUpdateSettingsExtensionSettingsDeepLink` · key `com_apple_settings_open_software_update_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Software Update Settings | any | entity SoftwareUpdateSettingsExtensionSettingsDeepLink |

### Open Search Settings

`com.apple.Settings.OpenSpotlightSettingsDeepLinks` · key `com_apple_settings_open_search_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Search Settings | any | entity SpotlightSettingsDeepLinks |

### Open Startup Disk Settings

`com.apple.Settings.OpenStartupDiskSettingsDeepLink` · key `com_apple_settings_open_startup_disk_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Startup Disk Settings | any | entity StartupDiskSettingsDeepLink |

### Open Startup Disk Settings

`com.apple.Settings.OpenStartupDiskStaticDeepLinks` · key `com_apple_settings_open_startup_disk_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Startup Disk | string | enum: `root` |

### Open Storage Settings

`com.apple.Settings.OpenStorageSettingsDeepLink` · key `com_apple_settings_open_storage_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Storage Settings | any | entity StorageSettingsDeepLink |

### Open the Current Date & Time Setting

`com.apple.Settings.OpenTheCurrentDateTimeSetting` · key `settings_open_the_current_date_time_setting`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | The Current Date & Time | any | entity DateTimeEntity |

### Open Time Machine Settings

`com.apple.Settings.OpenTimeMachineSettingsSettingsDeepLink` · key `com_apple_settings_open_time_machine_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Time Machine Settings | any | entity TimeMachineSettingsSettingsDeepLink |

### Open Trackpad Settings

`com.apple.Settings.OpenTrackpadExtensionSettingsDeepLink` · key `com_apple_settings_open_trackpad_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Trackpad Settings | any | entity TrackpadExtensionSettingsDeepLink |

### Open 24-Hour Time Setting

`com.apple.Settings.OpenTwentyFourHourTimeSetting` · key `settings_open_24_hour_time_setting`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | 24-Hour Time | any | entity HourFormatEntity |

### Open VPN Settings

`com.apple.Settings.OpenVpnSettingsDeepLink` · key `com_apple_settings_open_vpn_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | VPN Settings | any | entity VpnSettingsDeepLink |

### Open Wallpaper Settings

`com.apple.Settings.OpenWallpaperSettingsDeepLink` · key `com_apple_settings_open_wallpaper_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Wallpaper Settings | any | entity WallpaperSettingsDeepLink |

### Open Wi‑Fi Settings

`com.apple.Settings.OpenWiFiSettingsDeepLink` · key `com_apple_settings_open_wi_fi_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Wi‑Fi Settings | any | entity WiFiSettingsDeepLink |

### Open Widget Settings

`com.apple.Settings.OpenWidgetSettingsEntity` · key `com_apple_settings_open_widget_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Widget Settings | any | entity WidgetSettingsEntity |

### Open Windows Settings

`com.apple.Settings.OpenWindowsSettingsEntity` · key `com_apple_settings_open_windows_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Windows Settings | any | entity WindowsSettingsEntity |

### Find Passwords Settings

`com.apple.Settings.PasswordsSettingsExtensionSettingsDeepLink` · key `com_apple_settings_find_passwords_settings`
  
Output: Passwords Settings `com.apple.Settings.PasswordsSettingsExtensionSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | passwords settings | string | enum: `Library` |

### Find About Settings

`com.apple.Settings.PlaceholderAboutExtensionSettingsDeepLink` · key `com_apple_settings_find_about_settings`
  
Output: About Settings `com.apple.Settings.PlaceholderAboutExtensionSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | about settings | string | enum: `Library` |

### Find AirDrop & Continuity Settings

`com.apple.Settings.PlaceholderAirDropHandoffExtensionSettingsDeepLink` · key `com_apple_settings_find_air_drop_continuity_settings`
  
Output: AirDrop & Continuity Settings `com.apple.Settings.PlaceholderAirDropHandoffExtensionSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | airdrop & continuity settings | string | enum: `Library` |

### Find Appearance Settings

`com.apple.Settings.PlaceholderAppearanceSettingsDeepLink` · key `com_apple_settings_find_appearance_settings`
  
Output: Appearance Settings `com.apple.Settings.PlaceholderAppearanceSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | appearance settings | string | enum: `Library` |

### Find Displays Settings

`com.apple.Settings.PlaceholderDisplaysExtSettingsDeepLink` · key `com_apple_settings_find_displays_settings`
  
Output: Displays Settings `com.apple.Settings.PlaceholderDisplaysExtSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | displays settings | string | enum: `Library` |

### Find Lock Screen Settings

`com.apple.Settings.PlaceholderLockScreenSettingsDeepLink` · key `com_apple_settings_find_lock_screen_settings`
  
Output: Lock Screen Settings `com.apple.Settings.PlaceholderLockScreenSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | lock screen settings | string | enum: `Library` |

### Find Login Items Settings

`com.apple.Settings.PlaceholderLoginItemsSettingsDeepLink` · key `com_apple_settings_find_login_items_settings`
  
Output: Login Items Settings `com.apple.Settings.PlaceholderLoginItemsSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | login items settings | string | enum: `Library` |

### Find Network Settings

`com.apple.Settings.PlaceholderNetworkSettingsDeepLink` · key `com_apple_settings_find_network_settings`
  
Output: Network Settings `com.apple.Settings.PlaceholderNetworkSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | network settings | string | enum: `Library` |

### Open About Settings

`com.apple.Settings.PlaceholderOpenAboutExtensionSettingsDeepLink` · key `com_apple_settings_open_about_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | About Settings | any | entity PlaceholderAboutExtensionSettingsDeepLink |

### Open AirDrop & Continuity Settings

`com.apple.Settings.PlaceholderOpenAirDropHandoffExtensionSettingsDeepLink` · key `com_apple_settings_open_air_drop_continuity_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | AirDrop & Continuity Settings | any | entity PlaceholderAirDropHandoffExtensionSettingsDeepLink |

### Open Appearance Settings

`com.apple.Settings.PlaceholderOpenAppearanceSettingsDeepLink` · key `com_apple_settings_open_appearance_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Appearance Settings | any | entity PlaceholderAppearanceSettingsDeepLink |

### Open Displays Settings

`com.apple.Settings.PlaceholderOpenDisplaysExtSettingsDeepLink` · key `com_apple_settings_open_displays_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Displays Settings | any | entity PlaceholderDisplaysExtSettingsDeepLink |

### Open Lock Screen Settings

`com.apple.Settings.PlaceholderOpenLockScreenSettingsDeepLink` · key `com_apple_settings_open_lock_screen_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Lock Screen Settings | any | entity PlaceholderLockScreenSettingsDeepLink |

### Open Login Items Settings

`com.apple.Settings.PlaceholderOpenLoginItemsSettingsDeepLink` · key `com_apple_settings_open_login_items_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Login Items Settings | any | entity PlaceholderLoginItemsSettingsDeepLink |

### Open Network Settings

`com.apple.Settings.PlaceholderOpenNetworkSettingsDeepLink` · key `com_apple_settings_open_network_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Network Settings | any | entity PlaceholderNetworkSettingsDeepLink |

### Open Printers & Scanners Settings

`com.apple.Settings.PlaceholderOpenPrinterScannerSettingsSettingsDeepLink` · key `com_apple_settings_open_printers_scanners_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Printers & Scanners Settings | any | entity PlaceholderPrinterScannerSettingsSettingsDeepLink |

### Open Privacy & Security Settings

`com.apple.Settings.PlaceholderOpenSecurityPrivacyExtensionSettingsDeepLink` · key `com_apple_settings_open_privacy_security_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Privacy & Security Settings | any | entity PlaceholderSecurityPrivacyExtensionSettingsDeepLink |

### Open Sharing Settings

`com.apple.Settings.PlaceholderOpenSharingSettingsDeepLink` · key `com_apple_settings_open_sharing_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Sharing Settings | any | entity PlaceholderSharingSettingsDeepLink |

### Open Sound Settings

`com.apple.Settings.PlaceholderOpenSoundSettingsDeepLink` · key `com_apple_settings_open_sound_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Sound Settings | any | entity PlaceholderSoundSettingsDeepLink |

### Open Transfer or Reset Settings

`com.apple.Settings.PlaceholderOpenTransferResetExtensionSettingsDeepLink` · key `com_apple_settings_open_transfer_or_reset_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Transfer or Reset Settings | any | entity PlaceholderTransferResetExtensionSettingsDeepLink |

### Open Users & Groups Settings

`com.apple.Settings.PlaceholderOpenUsersGroupsSettingsDeepLink` · key `com_apple_settings_open_users_groups_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Users & Groups Settings | any | entity PlaceholderUsersGroupsSettingsDeepLink |

### Find Printers & Scanners Settings

`com.apple.Settings.PlaceholderPrinterScannerSettingsSettingsDeepLink` · key `com_apple_settings_find_printers_scanners_settings`
  
Output: Printers & Scanners Settings `com.apple.Settings.PlaceholderPrinterScannerSettingsSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | printers & scanners settings | string | enum: `Library` |

### Find Privacy & Security Settings

`com.apple.Settings.PlaceholderSecurityPrivacyExtensionSettingsDeepLink` · key `com_apple_settings_find_privacy_security_settings`
  
Output: Privacy & Security Settings `com.apple.Settings.PlaceholderSecurityPrivacyExtensionSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | privacy & security settings | string | enum: `Library` |

### Find Sharing Settings

`com.apple.Settings.PlaceholderSharingSettingsDeepLink` · key `com_apple_settings_find_sharing_settings`
  
Output: Sharing Settings `com.apple.Settings.PlaceholderSharingSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | sharing settings | string | enum: `Library` |

### Find Sound Settings

`com.apple.Settings.PlaceholderSoundSettingsDeepLink` · key `com_apple_settings_find_sound_settings`
  
Output: Sound Settings `com.apple.Settings.PlaceholderSoundSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | sound settings | string | enum: `Library` |

### Find Transfer or Reset Settings

`com.apple.Settings.PlaceholderTransferResetExtensionSettingsDeepLink` · key `com_apple_settings_find_transfer_or_reset_settings`
  
Output: Transfer or Reset Settings `com.apple.Settings.PlaceholderTransferResetExtensionSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | transfer or reset settings | string | enum: `Library` |

### Find Users & Groups Settings

`com.apple.Settings.PlaceholderUsersGroupsSettingsDeepLink` · key `com_apple_settings_find_users_groups_settings`
  
Output: Users & Groups Settings `com.apple.Settings.PlaceholderUsersGroupsSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | users & groups settings | string | enum: `Library` |

### Find Legacy Preference Pane Settings

`com.apple.Settings.PrefPanesDeepLink` · key `com_apple_settings_find_legacy_preference_pane_settings`
  
Output: Legacy Preference Pane Settings `com.apple.Settings.PrefPanesDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | legacy preference pane settings | string | enum: `Library` |

### Open Legacy Preference Panes Settings

`com.apple.Settings.PrefPanesOpenDeepLink` · key `com_apple_settings_open_legacy_preference_panes_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Legacy Preference Pane Settings | any | entity PrefPanesDeepLink |

### Get Recent documents, applications, and servers

`com.apple.Settings.RecentDocumentsOptionEntity` · key `com_apple_settings_get_recent_documents_applications_and_servers`
  
Output: Recent documents, applications, and servers `com.apple.Settings.RecentDocumentsOptionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `recentDocuments` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | recent documents, applications, and servers | string | enum: `Library` |

### Update Recent documents, applications, and servers

`com.apple.Settings.RecentDocumentsOptionEntity-UpdatableEntity` · key `com_apple_settings_update_recent_documents_applications_and_servers`
  
Change the Recent documents, applications, and servers value of Recent documents, applications, and servers
  
Output: Recent documents, applications, and servers `com.apple.Settings.RecentDocumentsOptionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Recent documents, applications, and servers | any | entity RecentDocumentsOptionEntity |
| `recentDocuments` | Recent documents, applications, and servers to update on Recent documents, applications, and servers | string | enum: `0`, `10`, `15`, `20`, `30`, `5`, `50` |

### Main Display Screen Saver Name

`com.apple.Settings.ScreenSaverNameIntent` · key `com_apple_settings_main_display_screen_saver_name`
  
Get the name of screen saver on the main display
  
Output: Screen Saver Name `string`

### Find Screen Time

`com.apple.Settings.ScreenTimeDeepLinks` · key `com_apple_settings_find_screen_time`
  
Output: Screen Time `com.apple.Settings.ScreenTimeDeepLinks`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | screen time | string | enum: `Library` |

### Get Natural scrolling

`com.apple.Settings.ScrollDirectionEntity` · key `com_apple_settings_get_natural_scrolling`
  
Output: Natural scrolling `com.apple.Settings.ScrollDirectionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | natural scrolling | string | enum: `Library` |

### Update Natural scrolling

`com.apple.Settings.ScrollDirectionEntity-UpdatableEntity` · key `com_apple_settings_update_natural_scrolling`
  
Change the Natural scrolling value of Natural scrolling
  
Output: Natural scrolling `com.apple.Settings.ScrollDirectionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Natural scrolling | any | entity ScrollDirectionEntity |
| `value` | Natural scrolling to update on Natural scrolling | bool | bool |

### Get Secondary click

`com.apple.Settings.SecondaryClickEntity` · key `com_apple_settings_get_secondary_click`
  
Output: Secondary click `com.apple.Settings.SecondaryClickEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | secondary click | string | enum: `Library` |

### Update Secondary click

`com.apple.Settings.SecondaryClickEntity-UpdatableEntity` · key `com_apple_settings_update_secondary_click`
  
Change the Secondary click value of Secondary click
  
Output: Secondary click `com.apple.Settings.SecondaryClickEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Secondary click | any | entity SecondaryClickEntity |
| `value` | Secondary click to update on Secondary click | string | enum: `0`, `1`, `2`, `3` |

### Set Focus

`com.apple.Settings.SetFocusState` · key `com_apple_settings_set_focus`
  
Turn a specific Focus on or off
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `enable` | Enable | bool | bool |
| `focus` | Focus | any | entity FocusEntity |
| `ShowWhenRun` | Show When Run | bool | bool |

### Find Touch ID & Password Settings

`com.apple.Settings.SettingsEntity` · key `com_apple_settings_find_touch_id_password_settings`
  
Output: Touch ID & Password Settings `com.apple.Settings.SettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | touch id & password settings | string | enum: `Library` |

### Find SetupFamilyDeepLink

`com.apple.Settings.SetupFamilyDeepLink` · key `com_apple_settings_find_setup_family_deep_link`
  
Output: SetupFamilyDeepLink `com.apple.Settings.SetupFamilyDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | setupfamilydeeplink | string | enum: `Library` |

### Get Show wallpaper as screen saver on main display

`com.apple.Settings.ShowAsScreenSaverEntity` · key `com_apple_settings_get_show_wallpaper_as_screen_saver_on_main_display`
  
Output: Show wallpaper as screen saver on main display `com.apple.Settings.ShowAsScreenSaverEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show wallpaper as screen saver on main display | string | enum: `Library` |

### Update Show wallpaper as screen saver on main display

`com.apple.Settings.ShowAsScreenSaverEntity-UpdatableEntity` · key `com_apple_settings_update_show_wallpaper_as_screen_saver_on_main_display`
  
Change the Show wallpaper as screen saver on main display value of Show wallpaper as screen saver on main display
  
Output: Show wallpaper as screen saver on main display `com.apple.Settings.ShowAsScreenSaverEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show wallpaper as screen saver on main display | any | entity ShowAsScreenSaverEntity |
| `value` | Show wallpaper as screen saver on main display to update on Show wallpaper as screen saver on main display | bool | bool |

### Get Show screen saver as wallpaper on main display

`com.apple.Settings.ShowAsWallpaperEntity` · key `com_apple_settings_get_show_screen_saver_as_wallpaper_on_main_display`
  
Output: Show screen saver as wallpaper on main display `com.apple.Settings.ShowAsWallpaperEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show screen saver as wallpaper on main display | string | enum: `Library` |

### Update Show screen saver as wallpaper on main display

`com.apple.Settings.ShowAsWallpaperEntity-UpdatableEntity` · key `com_apple_settings_update_show_screen_saver_as_wallpaper_on_main_display`
  
Change the Show screen saver as wallpaper on main display value of Show screen saver as wallpaper on main display
  
Output: Show screen saver as wallpaper on main display `com.apple.Settings.ShowAsWallpaperEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show screen saver as wallpaper on main display | any | entity ShowAsWallpaperEntity |
| `value` | Show screen saver as wallpaper on main display to update on Show screen saver as wallpaper on main display | bool | bool |

### Get Show Battery Percentage

`com.apple.Settings.ShowBatteryPercentageEntity` · key `com_apple_settings_get_show_battery_percentage`
  
Output: Show Battery Percentage `com.apple.Settings.ShowBatteryPercentageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `showBatteryPercentage` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show battery percentage | string | enum: `Library` |

### Update Show Battery Percentage

`com.apple.Settings.ShowBatteryPercentageEntity-UpdatableEntity` · key `com_apple_settings_update_show_battery_percentage`
  
Change the Show Battery Percentage value of Show Battery Percentage
  
Output: Show Battery Percentage `com.apple.Settings.ShowBatteryPercentageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show Battery Percentage | any | entity ShowBatteryPercentageEntity |
| `showBatteryPercentage` | Show Battery Percentage to update on Show Battery Percentage | bool | bool |

### Update Show menu bar background

`com.apple.Settings.ShowMenuBarBackgroundEntity-UpdatableEntity` · key `com_apple_settings_update_show_menu_bar_background`
  
Change the Show menu bar background value of Show menu bar background
  
Output: Show menu bar background `com.apple.Settings.ShowMenuBarBackgroundEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show menu bar background | any | entity ShowMenuBarBackgroundEntity |
| `showMenuBarBackground` | Show menu bar background to update on Show menu bar background | bool | bool |

### Get Show screen saver on all Spaces

`com.apple.Settings.ShowScreenSaverOnAllSpacesEntity` · key `com_apple_settings_get_show_screen_saver_on_all_spaces`
  
Output: Show screen saver on all Spaces `com.apple.Settings.ShowScreenSaverOnAllSpacesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show screen saver on all spaces | string | enum: `Library` |

### Update Show screen saver on all Spaces

`com.apple.Settings.ShowScreenSaverOnAllSpacesEntity-UpdatableEntity` · key `com_apple_settings_update_show_screen_saver_on_all_spaces`
  
Change the Show screen saver on all Spaces value of Show screen saver on all Spaces
  
Output: Show screen saver on all Spaces `com.apple.Settings.ShowScreenSaverOnAllSpacesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show screen saver on all Spaces | any | entity ShowScreenSaverOnAllSpacesEntity |
| `value` | Show screen saver on all Spaces to update on Show screen saver on all Spaces | bool | bool |

### Get Show wallpaper on all Spaces

`com.apple.Settings.ShowWallpaperOnAllSpacesEntity` · key `com_apple_settings_get_show_wallpaper_on_all_spaces`
  
Output: Show wallpaper on all Spaces `com.apple.Settings.ShowWallpaperOnAllSpacesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show wallpaper on all spaces | string | enum: `Library` |

### Update Show wallpaper on all Spaces

`com.apple.Settings.ShowWallpaperOnAllSpacesEntity-UpdatableEntity` · key `com_apple_settings_update_show_wallpaper_on_all_spaces`
  
Change the Show wallpaper on all Spaces value of Show wallpaper on all Spaces
  
Output: Show wallpaper on all Spaces `com.apple.Settings.ShowWallpaperOnAllSpacesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show wallpaper on all Spaces | any | entity ShowWallpaperOnAllSpacesEntity |
| `value` | Show wallpaper on all Spaces to update on Show wallpaper on all Spaces | bool | bool |

### Find Siri Settings

`com.apple.Settings.SiriSetupSettingsDeepLink` · key `com_apple_settings_find_siri_settings`
  
Output: Siri Settings `com.apple.Settings.SiriSetupSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | siri settings | string | enum: `Library` |

### Get Smart zoom

`com.apple.Settings.SmartZoomEntity` · key `com_apple_settings_get_smart_zoom`
  
Output: Smart zoom `com.apple.Settings.SmartZoomEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | smart zoom | string | enum: `Library` |

### Update Smart zoom

`com.apple.Settings.SmartZoomEntity-UpdatableEntity` · key `com_apple_settings_update_smart_zoom`
  
Change the Smart zoom value of Smart zoom
  
Output: Smart zoom `com.apple.Settings.SmartZoomEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Smart zoom | any | entity SmartZoomEntity |
| `value` | Smart zoom to update on Smart zoom | bool | bool |

### SoftwareUpdateSettingsExtensionIntents

`com.apple.Settings.SoftwareUpdateSettingsExtensionIntents` · key `com_apple_settings_software_update_settings_extension_intents`
  
Output:  `none`

### Find Software Update Settings

`com.apple.Settings.SoftwareUpdateSettingsExtensionSettingsDeepLink` · key `com_apple_settings_find_software_update_settings`
  
Output: Software Update Settings `com.apple.Settings.SoftwareUpdateSettingsExtensionSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | software update settings | string | enum: `Library` |

### Find Search Settings

`com.apple.Settings.SpotlightSettingsDeepLinks` · key `com_apple_settings_find_search_settings`
  
Output: Search Settings `com.apple.Settings.SpotlightSettingsDeepLinks`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | search settings | string | enum: `Library` |

### Find Startup Disk Settings

`com.apple.Settings.StartupDiskSettingsDeepLink` · key `com_apple_settings_find_startup_disk_settings`
  
Output: Startup Disk Settings `com.apple.Settings.StartupDiskSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | startup disk settings | string | enum: `Library` |

### Find Storage Settings

`com.apple.Settings.StorageSettingsDeepLink` · key `com_apple_settings_find_storage_settings`
  
Output: Storage Settings `com.apple.Settings.StorageSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | storage settings | string | enum: `Library` |

### Get Swipe between pages

`com.apple.Settings.SwipeBetweenPagesEntity` · key `com_apple_settings_get_swipe_between_pages`
  
Output: Swipe between pages `com.apple.Settings.SwipeBetweenPagesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | swipe between pages | string | enum: `Library` |

### Update Swipe between pages

`com.apple.Settings.SwipeBetweenPagesEntity-UpdatableEntity` · key `com_apple_settings_update_swipe_between_pages`
  
Change the Swipe between pages value of Swipe between pages
  
Output: Swipe between pages `com.apple.Settings.SwipeBetweenPagesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Swipe between pages | any | entity SwipeBetweenPagesEntity |
| `value` | Swipe between pages to update on Swipe between pages | string | enum: `0`, `1`, `2`, `3` |

### Find Time Machine Settings

`com.apple.Settings.TimeMachineSettingsSettingsDeepLink` · key `com_apple_settings_find_time_machine_settings`
  
Output: Time Machine Settings `com.apple.Settings.TimeMachineSettingsSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | time machine settings | string | enum: `Library` |

### Get The Current Time Zone

`com.apple.Settings.TimeZoneEntity` · key `settings_get_the_current_time_zone`
  
Output: The Current Time Zone `com.apple.Settings.TimeZoneEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | the current time zone | string | enum: `Library` |

### Get App Exposé

`com.apple.Settings.TrackpadAppExposeEntity` · key `com_apple_settings_get_app_exposé`
  
Output: App Exposé `com.apple.Settings.TrackpadAppExposeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | app exposé | string | enum: `Library` |

### Update App Exposé

`com.apple.Settings.TrackpadAppExposeEntity-UpdatableEntity` · key `com_apple_settings_update_app_exposé`
  
Change the App Exposé value of App Exposé
  
Output: App Exposé `com.apple.Settings.TrackpadAppExposeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | App Exposé | any | entity TrackpadAppExposeEntity |
| `value` | App Exposé to update on App Exposé | string | enum: `0`, `1`, `2` |

### Get Click pressure

`com.apple.Settings.TrackpadClickPressureEntity` · key `com_apple_settings_get_click_pressure`
  
Output: Click pressure `com.apple.Settings.TrackpadClickPressureEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | click pressure | string | enum: `Library` |

### Update Click pressure

`com.apple.Settings.TrackpadClickPressureEntity-UpdatableEntity` · key `com_apple_settings_update_click_pressure`
  
Change the Click pressure value of Click pressure
  
Output: Click pressure `com.apple.Settings.TrackpadClickPressureEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Click pressure | any | entity TrackpadClickPressureEntity |
| `value` | Click pressure to update on Click pressure | string | enum: `0`, `1`, `2` |

### Find Trackpad Settings

`com.apple.Settings.TrackpadExtensionSettingsDeepLink` · key `com_apple_settings_find_trackpad_settings`
  
Output: Trackpad Settings `com.apple.Settings.TrackpadExtensionSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | trackpad settings | string | enum: `Library` |

### Get Force click and haptic feedback

`com.apple.Settings.TrackpadForceClickEntity` · key `com_apple_settings_get_force_click_and_haptic_feedback`
  
Output: Force click and haptic feedback `com.apple.Settings.TrackpadForceClickEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | force click and haptic feedback | string | enum: `Library` |

### Update Force click and haptic feedback

`com.apple.Settings.TrackpadForceClickEntity-UpdatableEntity` · key `com_apple_settings_update_force_click_and_haptic_feedback`
  
Change the Force click and haptic feedback value of Force click and haptic feedback
  
Output: Force click and haptic feedback `com.apple.Settings.TrackpadForceClickEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Force click and haptic feedback | any | entity TrackpadForceClickEntity |
| `value` | Force click and haptic feedback to update on Force click and haptic feedback | bool | bool |

### Get Launchpad

`com.apple.Settings.TrackpadLaunchpadEntity` · key `com_apple_settings_get_launchpad`
  
Output: Launchpad `com.apple.Settings.TrackpadLaunchpadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | launchpad | string | enum: `Library` |

### Update Launchpad

`com.apple.Settings.TrackpadLaunchpadEntity-UpdatableEntity` · key `com_apple_settings_update_launchpad`
  
Change the Launchpad value of Launchpad
  
Output: Launchpad `com.apple.Settings.TrackpadLaunchpadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Launchpad | any | entity TrackpadLaunchpadEntity |
| `value` | Launchpad to update on Launchpad | bool | bool |

### Get Force Click and haptic feedback

`com.apple.Settings.TrackpadLookUpAndDataDetectorsEntity` · key `com_apple_settings_get_force_click_and_haptic_feedback`
  
Output: Force Click and haptic feedback `com.apple.Settings.TrackpadLookUpAndDataDetectorsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | force click and haptic feedback | string | enum: `Library` |

### Update Force Click and haptic feedback

`com.apple.Settings.TrackpadLookUpAndDataDetectorsEntity-UpdatableEntity` · key `com_apple_settings_update_force_click_and_haptic_feedback`
  
Change the Force Click and haptic feedback value of Force Click and haptic feedback
  
Output: Force Click and haptic feedback `com.apple.Settings.TrackpadLookUpAndDataDetectorsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Force Click and haptic feedback | any | entity TrackpadLookUpAndDataDetectorsEntity |
| `value` | Force Click and haptic feedback to update on Force Click and haptic feedback | string | enum: `0`, `1`, `2` |

### Get Mission Control

`com.apple.Settings.TrackpadMissionControlEntity` · key `com_apple_settings_get_mission_control`
  
Output: Mission Control `com.apple.Settings.TrackpadMissionControlEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | mission control | string | enum: `Library` |

### Update Mission Control

`com.apple.Settings.TrackpadMissionControlEntity-UpdatableEntity` · key `com_apple_settings_update_mission_control`
  
Change the Mission Control value of Mission Control
  
Output: Mission Control `com.apple.Settings.TrackpadMissionControlEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Mission Control | any | entity TrackpadMissionControlEntity |
| `value` | Mission Control to update on Mission Control | string | enum: `0`, `1`, `2` |

### Get Notification Center

`com.apple.Settings.TrackpadNotificiationCenterEntity` · key `com_apple_settings_get_notification_center`
  
Output: Notification Center `com.apple.Settings.TrackpadNotificiationCenterEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | notification center | string | enum: `Library` |

### Update Notification Center

`com.apple.Settings.TrackpadNotificiationCenterEntity-UpdatableEntity` · key `com_apple_settings_update_notification_center`
  
Change the Notification Center value of Notification Center
  
Output: Notification Center `com.apple.Settings.TrackpadNotificiationCenterEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Notification Center | any | entity TrackpadNotificiationCenterEntity |
| `value` | Notification Center to update on Notification Center | bool | bool |

### Get Quiet click

`com.apple.Settings.TrackpadQuietClickEntity` · key `com_apple_settings_get_quiet_click`
  
Output: Quiet click `com.apple.Settings.TrackpadQuietClickEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | quiet click | string | enum: `Library` |

### Update Quiet click

`com.apple.Settings.TrackpadQuietClickEntity-UpdatableEntity` · key `com_apple_settings_update_quiet_click`
  
Change the Quiet click value of Quiet click
  
Output: Quiet click `com.apple.Settings.TrackpadQuietClickEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Quiet click | any | entity TrackpadQuietClickEntity |
| `value` | Quiet click to update on Quiet click | bool | bool |

### Get Rotate

`com.apple.Settings.TrackpadRotateEntity` · key `com_apple_settings_get_rotate`
  
Output: Rotate `com.apple.Settings.TrackpadRotateEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | rotate | string | enum: `Library` |

### Update Rotate

`com.apple.Settings.TrackpadRotateEntity-UpdatableEntity` · key `com_apple_settings_update_rotate`
  
Change the Rotate value of Rotate
  
Output: Rotate `com.apple.Settings.TrackpadRotateEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Rotate | any | entity TrackpadRotateEntity |
| `value` | Rotate to update on Rotate | bool | bool |

### Get Trackpad secondary click

`com.apple.Settings.TrackpadSecondaryClickEntity` · key `com_apple_settings_get_trackpad_secondary_click`
  
Output: Trackpad secondary click `com.apple.Settings.TrackpadSecondaryClickEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | trackpad secondary click | string | enum: `Library` |

### Update Trackpad secondary click

`com.apple.Settings.TrackpadSecondaryClickEntity-UpdatableEntity` · key `com_apple_settings_update_trackpad_secondary_click`
  
Change the Trackpad secondary click value of Trackpad secondary click
  
Output: Trackpad secondary click `com.apple.Settings.TrackpadSecondaryClickEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Trackpad secondary click | any | entity TrackpadSecondaryClickEntity |
| `value` | Trackpad secondary click to update on Trackpad secondary click | string | enum: `0`, `1`, `2`, `3` |

### Get Show Desktop

`com.apple.Settings.TrackpadShowDesktopEntity` · key `com_apple_settings_get_show_desktop`
  
Output: Show Desktop `com.apple.Settings.TrackpadShowDesktopEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show desktop | string | enum: `Library` |

### Update Show Desktop

`com.apple.Settings.TrackpadShowDesktopEntity-UpdatableEntity` · key `com_apple_settings_update_show_desktop`
  
Change the Show Desktop value of Show Desktop
  
Output: Show Desktop `com.apple.Settings.TrackpadShowDesktopEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show Desktop | any | entity TrackpadShowDesktopEntity |
| `value` | Show Desktop to update on Show Desktop | bool | bool |

### Get Smart zoom

`com.apple.Settings.TrackpadSmartZoomEntity` · key `com_apple_settings_get_smart_zoom`
  
Output: Smart zoom `com.apple.Settings.TrackpadSmartZoomEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | smart zoom | string | enum: `Library` |

### Update Smart zoom

`com.apple.Settings.TrackpadSmartZoomEntity-UpdatableEntity` · key `com_apple_settings_update_smart_zoom`
  
Change the Smart zoom value of Smart zoom
  
Output: Smart zoom `com.apple.Settings.TrackpadSmartZoomEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Smart zoom | any | entity TrackpadSmartZoomEntity |
| `value` | Smart zoom to update on Smart zoom | bool | bool |

### Get Swipe between pages

`com.apple.Settings.TrackpadSwipeBetweenAppsEntity` · key `com_apple_settings_get_swipe_between_pages`
  
Output: Swipe between pages `com.apple.Settings.TrackpadSwipeBetweenAppsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | swipe between pages | string | enum: `Library` |

### Update Swipe between pages

`com.apple.Settings.TrackpadSwipeBetweenAppsEntity-UpdatableEntity` · key `com_apple_settings_update_swipe_between_pages`
  
Change the Swipe between pages value of Swipe between pages
  
Output: Swipe between pages `com.apple.Settings.TrackpadSwipeBetweenAppsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Swipe between pages | any | entity TrackpadSwipeBetweenAppsEntity |
| `value` | Swipe between pages to update on Swipe between pages | string | enum: `0`, `1`, `2` |

### Get Swipe between pages

`com.apple.Settings.TrackpadSwipeBetweenPagesEntity` · key `com_apple_settings_get_swipe_between_pages`
  
Output: Swipe between pages `com.apple.Settings.TrackpadSwipeBetweenPagesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | swipe between pages | string | enum: `Library` |

### Update Swipe between pages

`com.apple.Settings.TrackpadSwipeBetweenPagesEntity-UpdatableEntity` · key `com_apple_settings_update_swipe_between_pages`
  
Change the Swipe between pages value of Swipe between pages
  
Output: Swipe between pages `com.apple.Settings.TrackpadSwipeBetweenPagesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Swipe between pages | any | entity TrackpadSwipeBetweenPagesEntity |
| `value` | Swipe between pages to update on Swipe between pages | string | enum: `0`, `1`, `2`, `3` |

### Get Tap to click

`com.apple.Settings.TrackpadTapToClickEntity` · key `com_apple_settings_get_tap_to_click`
  
Output: Tap to click `com.apple.Settings.TrackpadTapToClickEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | tap to click | string | enum: `Library` |

### Update Tap to click

`com.apple.Settings.TrackpadTapToClickEntity-UpdatableEntity` · key `com_apple_settings_update_tap_to_click`
  
Change the Tap to click value of Tap to click
  
Output: Tap to click `com.apple.Settings.TrackpadTapToClickEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Tap to click | any | entity TrackpadTapToClickEntity |
| `value` | Tap to click to update on Tap to click | bool | bool |

### Get Trackpad tracking speed

`com.apple.Settings.TrackpadTrackingSpeedEntity` · key `com_apple_settings_get_trackpad_tracking_speed`
  
Output: Trackpad tracking speed `com.apple.Settings.TrackpadTrackingSpeedEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | trackpad tracking speed | string | enum: `Library` |

### Update Trackpad tracking speed

`com.apple.Settings.TrackpadTrackingSpeedEntity-UpdatableEntity` · key `com_apple_settings_update_trackpad_tracking_speed`
  
Change the Trackpad tracking speed value of Trackpad tracking speed
  
Output: Trackpad tracking speed `com.apple.Settings.TrackpadTrackingSpeedEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Trackpad tracking speed | any | entity TrackpadTrackingSpeedEntity |
| `value` | Trackpad tracking speed to update on Trackpad tracking speed | string | enum: `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9` |

### Get Zoom in or out

`com.apple.Settings.TrackpadZoomInOutEntity` · key `com_apple_settings_get_zoom_in_or_out`
  
Output: Zoom in or out `com.apple.Settings.TrackpadZoomInOutEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom in or out | string | enum: `Library` |

### Update Zoom in or out

`com.apple.Settings.TrackpadZoomInOutEntity-UpdatableEntity` · key `com_apple_settings_update_zoom_in_or_out`
  
Change the Zoom in or out value of Zoom in or out
  
Output: Zoom in or out `com.apple.Settings.TrackpadZoomInOutEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom in or out | any | entity TrackpadZoomInOutEntity |
| `value` | Zoom in or out to update on Zoom in or out | bool | bool |

### Update Fast User Switching menu style

`com.apple.Settings.UserSwitcherMenuStyleEntity-UpdatableEntity` · key `com_apple_settings_update_fast_user_switching_menu_style`
  
Change the Fast User Switching menu style value of Fast User Switching menu style
  
Output: Fast User Switching menu style `com.apple.Settings.UserSwitcherMenuStyleEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Fast User Switching menu style | any | entity UserSwitcherMenuStyleEntity |
| `userSwitcherMenuStyle` | Fast User Switching menu style to update on Fast User Switching menu style | string | enum: `accountName`, `fullName`, `icon` |

### Find VPN Settings

`com.apple.Settings.VpnSettingsDeepLink` · key `com_apple_settings_find_vpn_settings`
  
Output: VPN Settings `com.apple.Settings.VpnSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | vpn settings | string | enum: `Library` |

### Find Wallpaper Settings

`com.apple.Settings.WallpaperSettingsDeepLink` · key `com_apple_settings_find_wallpaper_settings`
  
Output: Wallpaper Settings `com.apple.Settings.WallpaperSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | wallpaper settings | string | enum: `Library` |

### Find Wi‑Fi Settings

`com.apple.Settings.WiFiSettingsDeepLink` · key `com_apple_settings_find_wi_fi_settings`
  
Output: Wi‑Fi Settings `com.apple.Settings.WiFiSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | wi‑fi settings | string | enum: `Library` |

### Get Widget Settings

`com.apple.Settings.WidgetSettingsEntity` · key `com_apple_settings_get_widget_settings`
  
Output: Widget Settings `com.apple.Settings.WidgetSettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `showWidgetsInStageManager`, `showWidgetsOnDesktop`, `widgetAppearance` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | widget settings | string | enum: `Library` |

### Edit Widget Settings

`com.apple.Settings.WidgetSettingsEntity-UpdatableEntity` · key `com_apple_settings_edit_widget_settings`
  
Edit Widget Settings
 • Show Widgets In Stage Manager
 • Show Widgets On Desktop
 • Dim widgets on desktop
  
Output: Widget Settings `com.apple.Settings.WidgetSettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Widget Settings | any | entity WidgetSettingsEntity |
| `showWidgetsInStageManager` | Show Widgets In Stage Manager to update on Widget Settings | bool | bool |
| `showWidgetsOnDesktop` | Show Widgets On Desktop to update on Widget Settings | bool | bool |
| `widgetAppearance` | Dim widgets on desktop to update on Widget Settings | string | enum: `0`, `1`, `2` |

### Get Windows Settings

`com.apple.Settings.WindowsSettingsEntity` · key `com_apple_settings_get_windows_settings`
  
Output: Windows Settings `com.apple.Settings.WindowsSettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `askToKeepChangesWhenClosingDocuments`, `closeWindowsWhenQuittingAnApplication`, `preferTabsWhenOpeningDocuments` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | windows settings | string | enum: `Library` |

### Edit Windows Settings

`com.apple.Settings.WindowsSettingsEntity-UpdatableEntity` · key `com_apple_settings_edit_windows_settings`
  
Edit Windows Settings
 • Ask to keep changes when closing documents
 • Close windows when quitting an application
 • Prefer tabs when opening documents
  
Output: Windows Settings `com.apple.Settings.WindowsSettingsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `askToKeepChangesWhenClosingDocuments` | Ask to keep changes when closing documents to update on Windows Settings | bool | bool |
| `closeWindowsWhenQuittingAnApplication` | Close windows when quitting an application to update on Windows Settings | bool | bool |
| `entity` | Windows Settings | any | entity WindowsSettingsEntity |
| `preferTabsWhenOpeningDocuments` | Prefer tabs when opening documents to update on Windows Settings | string | enum: `0`, `1`, `2` |

## SharingIntents (`com.apple.systempreferences.SharingSettingsIntents`)

### Open Sharing

`com.apple.systempreferences.SharingSettingsIntents.OpenSharingDeepLinks` · key `settings_open_sharing`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Sharing | string | enum: `bluetoothSharing`, `contentSharing`, `fileSharing`, `internetSharing`, `localHostname`, `mediaSharing`, `printerSharing`, `remoteAppSharing`, `remoteLogin`, `remoteManagement`, `root`, `screenSharing` |

### SharingIntents

`com.apple.systempreferences.SharingSettingsIntents.SharingIntents` · key `com_apple_systempreferences_sharing_settings_intents_sharing_intents`
  
Output:  `none`

## Shortcuts (`com.apple.shortcuts`)

### Add Shortcut to Home Screen

`com.apple.shortcuts.AddShortcutToHomeScreenAction` · key `com_apple_shortcuts_add_shortcut_to_home_screen`
  
Adds a shortcut to your Home Screen as an icon.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `shortcut` | Shortcut | any | entity WFWorkflowReference |
| `title` | Custom Title | text | string |
| `image` | Image | any | file |

### Change Shortcut Icon

`com.apple.shortcuts.ChangeShortcutIconAction` · key `com_apple_shortcuts_change_shortcut_icon`
  
Opens the icon editor for a shortcut
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `shortcut` | Shortcut | any | entity WFWorkflowReference |

### Create Folder

`com.apple.shortcuts.CreateFolderAction` · key `com_apple_shortcuts_create_folder`
  
Creates a new Shortcuts folder
  
Output: Folder `com.apple.shortcuts.RootNavigationDestination`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | string |
| `OpenWhenRun` | Open When Run | bool | bool |

### Create iCloud Link for Shortcut

`com.apple.shortcuts.CreateShortcutiCloudLinkAction` · key `com_apple_shortcuts_create_icloud_link_for_shortcut`
  
Creates an iCloud link for a shortcut that can be shared
  
Output:  `url`

| Key | Name | Kind | Type |
|---|---|---|---|
| `shortcut` | Shortcut | any | entity WFWorkflowReference |

### Create Shortcut

`com.apple.shortcuts.CreateWorkflowAction` · key `com_apple_shortcuts_create_shortcut`
  
Creates a new empty shortcut
  
Output: Shortcut `com.apple.shortcuts.WFWorkflowReference`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Shortcut Name | text | string |
| `OpenWhenRun` | Open When Run | bool | bool |

### Delete Shortcuts

`com.apple.shortcuts.DeleteWorkflowAction` · key `com_apple_shortcuts_delete_shortcuts`
  
Deletes shortcuts from your library
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Shortcuts | any | entity WFWorkflowReference |

### Generate Shortcut

`com.apple.shortcuts.GenerateShortcutAction` · key `com_apple_shortcuts_generate_shortcut`
  
Generates a new shortcut from a text description using Apple Intelligence.
  
Output: Shortcut `com.apple.shortcuts.WFWorkflowReference`

| Key | Name | Kind | Type |
|---|---|---|---|
| `prompt` | Description | text | string |
| `answer` | Answer | text | string |

### Get Shortcut Attributes

`com.apple.shortcuts.GetShortcutAttributesAction` · key `com_apple_shortcuts_get_shortcut_attributes`
  
Get a shortcut’s settings.
  
Output:  `bool`

| Key | Name | Kind | Type |
|---|---|---|---|
| `attribute` | Attribute | string | enum: `allowWhenLocked`, `onScreenContent`, `pinInMenuBar`, `quickActions`, `receivesInputFromSearch`, `showInShareSheet`, `showOnWatch` |
| `shortcut` | Shortcut | any | entity WFWorkflowReference |
| `OpenWhenRun` | Open When Run | bool | bool |

### Move Shortcut

`com.apple.shortcuts.MoveShortcutToFolderAction` · key `com_apple_shortcuts_move_shortcut`
  
Move shortcuts to a specified folder.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `shortcuts` | Shortcuts | any | entity WFWorkflowReference |
| `folder` | Folder | any | entity RootNavigationDestination |
| `OpenWhenRun` | Open When Run | bool | bool |

### Open Folder

`com.apple.shortcuts.OpenNavigationDestinationAction` · key `com_apple_shortcuts_open_folder`
  
Opens a page within the Shortcuts app
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Folder | any | entity RootNavigationDestination |

### Open Shortcuts Settings

`com.apple.shortcuts.OpenShortcutsStaticDeepLinks` · key `com_apple_preferences_open_shortcuts_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Shortcuts | string | enum: `advanced`, `legalNotices`, `root` |

### Open Shortcut

`com.apple.shortcuts.OpenWorkflowAction` · key `com_apple_shortcuts_open_shortcut`
  
Opens the editor for a shortcut
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Shortcut | any | entity WFWorkflowReference |

### Rename Shortcut

`com.apple.shortcuts.RenameShortcutAction` · key `com_apple_shortcuts_rename_shortcut`
  
Renames a shortcut to the specified name.
  
Output: Shortcut `com.apple.shortcuts.WFWorkflowReference`

| Key | Name | Kind | Type |
|---|---|---|---|
| `shortcut` | Shortcut | any | entity WFWorkflowReference |
| `name` | Name | text | string |
| `OpenWhenRun` | Open When Run | bool | bool |

### Search Shortcuts Actions

`com.apple.shortcuts.SearchActionDrawerAction` · key `com_apple_shortcuts_search_shortcuts_actions`
  
Search for an available Shortcuts action.
  
Output: Shortcuts Action `com.apple.shortcuts.ShortcutsActionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `query` | Query | text | string |

### Search in Shortcuts

`com.apple.shortcuts.SearchShortcutsAction` · key `com_apple_shortcuts_search_in_shortcuts`
  
Searches your shortcuts library
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `searchPhrase` | Text | text | string |
| `folder` | Folder | any | entity RootNavigationDestination |

### Set Shortcut Attributes

`com.apple.shortcuts.SetShortcutAttributesAction` · key `com_apple_shortcuts_set_shortcut_attributes`
  
Modify a shortcut’s settings
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `operation` | Operation | string | enum: `toggle`, `turn` |
| `attribute` | Attribute | string | enum: `allowWhenLocked`, `onScreenContent`, `pinInMenuBar`, `quickActions`, `receivesInputFromSearch`, `showInShareSheet`, `showOnWatch` |
| `shortcut` | Shortcut | any | entity WFWorkflowReference |
| `state` | State | bool | bool |
| `OpenWhenRun` | Open When Run | bool | bool |

### Stop Shortcut

`com.apple.shortcuts.StopWorkflowAction` · key `com_apple_shortcuts_stop_shortcut`
  
Stops the shortcut if it is currently running.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `runningContextIdentifier` | Running Context Identifier | text | string |

## ShortcutsActions (`com.apple.ShortcutsActions`)

### Find Cellular Plan

`com.apple.ShortcutsActions.CellularPlanEntity` · key `com_apple_shortcuts_actions_find_cellular_plan`
  
Output: Cellular Plan `com.apple.ShortcutsActions.CellularPlanEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `carrierName`, `label`, `phoneNumber` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | cellular plan | string | enum: `Library` |

### Find Charge Limit

`com.apple.ShortcutsActions.ChargeLimit` · key `com_apple_shortcuts_actions_find_charge_limit`
  
Output: Charge Limit `com.apple.ShortcutsActions.ChargeLimit`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | charge limit | string | enum: `Library` |

### Get Multitasking Mode

`com.apple.ShortcutsActions.GetMultitaskingModeAction` · key `com_apple_shortcuts_actions_get_multitasking_mode`
  
Returns the current multitasking mode of the device.
  
Output: Multitasking Mode `com.apple.ShortcutsActions.MultitaskingMode`

### Get Orientation

`com.apple.ShortcutsActions.GetOrientationAction` · key `settings_get_orientation`
  
Returns the device’s current orientation on iPhone and iPad.

A result of “Unknown” indicates that the device is not supported.
  
Output: Orientation `com.apple.ShortcutsActions.Orientation`

### Get Physical Activity

`com.apple.ShortcutsActions.GetPhysicalActivity` · key `health_get_physical_activity`
  
Returns a Physical Activity that describes your apparent movement (for example, Stationary, Running, or In a Moving Vehicle). On iPhone, iPad, and Apple Watch, the system uses the device’s sensors to determine your physical activity.

A result of “Moving” indicates that the motion doesn’t seem to fit a known pattern. You may observe higher accuracy by adjusting the device’s placement.

A result of “Unknown” indicates that the device is not supported.
  
Output: Physical Activity `com.apple.ShortcutsActions.PhysicalActivity`

### Reset Cellular Data Statistics

`com.apple.ShortcutsActions.ResetCellularDataStatisticsAction` · key `com_apple_shortcuts_actions_reset_cellular_data_statistics`
  
Resets the cellular data usage counters for the current Data line in Settings.
  
Output:  `none`

### Set Battery Charge Limit

`com.apple.ShortcutsActions.SetBatteryChargeLimitAction` · key `settings_set_battery_charge_limit`
  
Sets the battery charge limit of the device.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `limit` | Charge Limit | any | entity ChargeLimit |
| `setUntilTomorrow` | Set Until Tomorrow | bool | bool |

### Set Data Roaming

`com.apple.ShortcutsActions.SetDataRoamingAction` · key `com_apple_shortcuts_actions_set_data_roaming`
  
Sets the Data Roaming setting for a given cellular plan.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `plan` | Cellular Plan | any | entity CellularPlanEntity |
| `operation` | Operation | string | enum: `toggle`, `turn` |
| `state` | State | bool | bool |

### Set Default Line

`com.apple.ShortcutsActions.SetDefaultCellularPlanAction` · key `com_apple_shortcuts_actions_set_default_line`
  
Sets the cellular plan used by default for voice calls or data.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `type` | Line Type | string | enum: `data`, `voice` |
| `plan` | Cellular Plan | any | entity CellularPlanEntity |
| `allowCellularDataSwitching` | Allow Cellular Data Switching | bool | bool |

### Set Multitasking Mode

`com.apple.ShortcutsActions.SetMultitaskingModeAction` · key `com_apple_shortcuts_actions_set_multitasking_mode`
  
Sets the multitasking mode of the device.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `mode` | Multitasking Mode | string | enum: `fullScreenApps`, `stageManager`, `windowedApps` |
| `automaticallyShowAndHideDock` | Automatically Show and Hide Dock | bool | bool |
| `showRecentApps` | Show Recent Apps | bool | bool |

### Set Silent Mode

`com.apple.ShortcutsActions.SetSilentModeAction` · key `com_apple_shortcuts_actions_set_silent_mode`
  
Switch between Silent and Ring for calls and alerts.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `operation` | Operation | string | enum: `toggle`, `turn` |
| `state` | Silent Mode | bool | bool |

### Set Voice & Data

`com.apple.ShortcutsActions.SetVoiceDataModeAction` · key `com_apple_shortcuts_actions_set_voice_data`
  
Sets the Voice & Data mode.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `sim` | Cellular Plan | any | entity CellularPlanEntity |
| `ratMode` | Radio Access Technology | text | string |

### Show Control Center

`com.apple.ShortcutsActions.ShowControlCenterAction` · key `com_apple_shortcuts_actions_show_control_center`
  
Shows, hides, or toggles Control Center.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `operation` | Operation | string | enum: `hide`, `show`, `toggle` |

### Start Time Machine Backup

`com.apple.ShortcutsActions.TimeMachineAction` · key `com_apple_backup_launcher_start_time_machine_backup`
  
Initiates or interrupts a Time Machine backup to the given destination.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `mode` | Mode | string | enum: `start`, `stop` |
| `destination` | Destination | any | entity TimeMachineDestination |

### Toggle Cellular Plan

`com.apple.ShortcutsActions.ToggleCellularPlanAction` · key `com_apple_shortcuts_actions_toggle_cellular_plan`
  
Enables or disables a cellular plan on this iPhone.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `plan` | Cellular Plan | any | entity CellularPlanEntity |
| `operation` | Operation | string | enum: `toggle`, `turn` |
| `state` | State | bool | bool |

### Transcribe Audio

`com.apple.ShortcutsActions.TranscribeAudioAction` · key `com_apple_shortcuts_actions_transcribe_audio`
  
Transcribes an audio file to text.
  
Output: Transcribed Audio `string`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioFile` | Audio File | any | file |

## Siri AI (`com.apple.campo`)

### Clear Current Search

`com.apple.campo.ClearSpotlightIntent` · key `com_apple_campo_clear_current_search`
  
Clear current search and return to recents and suggestions
  
Output:  `none`

### Resume Conversation

`com.apple.campo.ResumeConversationIntent` · key `com_apple_campo_resume_conversation`
  
Resume the specified conversation.
  
Output: Conversation `com.apple.campo.ConversationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Conversation | any | entity ConversationEntity |

### Get Current Search Query

`com.apple.campo.SearchFieldEntity` · key `com_apple_campo_get_current_search_query`
  
Output: Current Search Query `com.apple.campo.SearchFieldEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `searchString` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | current search query | string | enum: `Library` |

### Open Search

`com.apple.campo.SearchSpotlightIntent` · key `com_apple_campo_open_search`
  
Opens Search and performs a search for the specified text.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Search | text | string |

### Continue Search in App

`com.apple.campo.SearchUIContinuationIntent` · key `com_apple_campo_continue_search_in_app`
  
Continue Search with the same search query in another app
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | App | any | entity SearchUIContinuationEntity |

### Open Siri Knowledge Page

`com.apple.campo.SearchUIOpenKnowledgeIntent` · key `com_apple_campo_open_siri_knowledge_page`
  
Navigate to Siri Knowledge Page
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Siri Knowledge Page | any | entity SearchUIKnowledgeEntity |

### Show Search

`com.apple.campo.ToggleSpotlightIntent` · key `com_apple_campo_show_search`
  
Shows or hides Search.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `action` | Action | string | enum: `close`, `open`, `toggle` |

## SiriAppLaunchFlowTools (`com.apple.siri.SiriAppLaunchFlowTools`)

### InteractiveInstallApplicationTool

`com.apple.siri.SiriAppLaunchFlowTools.SiriAppLaunchFlowTools.InteractiveInstallApplicationTool` · key `-`
  
A standalone tool to interactively install or update marketplace applications.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `applications` | Applications | any | unknown |
| `isUpdate` | Is Update | bool | bool |

## SiriCrisisFlowTools (`com.apple.siri.SiriCrisisFlowTools`)

### CrisisDialog

`com.apple.siri.SiriCrisisFlowTools.SiriCrisisFlowTools.CrisisDialogFlowTool` · key `-`
  
Handles crisis dialog for emergency and CSAM situations
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `situation` | Situation | string | enum: `abuse`, `activeShooting`, `assault`, `bullying`, `carAccident`, `crisisSupport`, `csamExplicit`, `csamHelpBadActor`, `csamHelpForContent`, `csamHelpVictim`, `danger`, `domesticViolence` … |

## SiriGeoAppIntentsExtension (`com.apple.siri.SiriGeo.SiriGeoAppIntentExtension`)

### Get Current Location

`com.apple.siri.SiriGeo.SiriGeoAppIntentExtension.CurrentLocationEntity` · key `com_apple_siri_siri_geo_siri_geo_app_intent_extension_get_current_location`
  
Output: Current Location `com.apple.siri.SiriGeo.SiriGeoAppIntentExtension.CurrentLocationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | current location | string | enum: `Library` |

### Get Current Route

`com.apple.siri.SiriGeo.SiriGeoAppIntentExtension.NavigationSessionEntity` · key `com_apple_siri_siri_geo_siri_geo_app_intent_extension_get_current_route`
  
Output: Current Route `com.apple.siri.SiriGeo.SiriGeoAppIntentExtension.NavigationSessionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `estimatedArrivalDate`, `preferences`, `transportationType`, `waypoints` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | current route | string | enum: `Library` |

### SiriGeoAppIntent

`com.apple.siri.SiriGeo.SiriGeoAppIntentExtension.SiriGeoAppIntent` · key `com_apple_siri_siri_geo_siri_geo_app_intent_extension_siri_geo_app_intent`
  
Output:  `none`

### Start Navigation for Third Party Apps

`com.apple.siri.SiriGeo.SiriGeoAppIntentExtension.ThirdPartyStartNavigationIntent` · key `com_apple_siri_siri_geo_siri_geo_app_intent_extension_start_navigation_for_third_party_apps`
  
Start Navigation
  
Output: Current Route `com.apple.siri.SiriGeo.SiriGeoAppIntentExtension.NavigationSessionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `origin` | Origin | any | entity CurrentLocationEntity |
| `destinations` | Destinations | any | entity CurrentLocationEntity |
| `transportationType` | Transportation Type | string | enum: `cycling`, `driving`, `transit`, `walking` |
| `preferences` | Preferences | string | enum: `avoidBusyRoads`, `avoidHighways`, `avoidHills`, `avoidStairs`, `avoidTolls` |
| `ShowWhenRun` | Show When Run | bool | bool |

## SiriIdentityInternal (`com.apple.siri.SiriIdentityInternal`)

### WhoAmITool

`com.apple.siri.SiriIdentityInternal.SiriIdentityInternal.WhoAmITool` · key `-`
  
Who am I Flow Tool
  
Output:  `none`

## SiriMessagesAppIntentsExtension (`com.apple.siri.messages.SiriMessagesAppIntentsExtension`)

### Messages Post Reading Action Tool

`com.apple.siri.messages.SiriMessagesAppIntentsExtension.MessagesPostReadActionAppIntent` · key `com_apple_siri_messages_siri_messages_app_intents_extension_messages_post_reading_action_tool`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `readableMessages` | Readable Messages | any | entity ReadableMessageAppEntity |

### Prepare To Read Conversation Tool

`com.apple.siri.messages.SiriMessagesAppIntentsExtension.PrepareToReadConversationAppIntent` · key `com_apple_siri_messages_siri_messages_app_intents_extension_prepare_to_read_conversation_tool`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `conversation` | conversation | any | entity ConversationEntity |

### SiriKitEditLastMessageIntent

`com.apple.siri.messages.SiriMessagesAppIntentsExtension.SiriKitEditLastMessageIntent` · key `com_apple_siri_messages_siri_messages_app_intents_extension_siri_kit_edit_last_message_intent`
  
Edit an already sent message with new content
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `content` | Content | text | richText |
| `message` | Message | any | entity SiriKitMessageEntity |

### Prepare Messages for Reading

`com.apple.siri.messages.SiriMessagesAppIntentsExtension.SiriKitPrepareMessagesForReadingIntent` · key `com_apple_siri_messages_siri_messages_app_intents_extension_prepare_messages_for_reading`
  
Prepares and processes messages to be read aloud by Siri
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `message` | Message | any | entity SiriKitMessageEntity |
| `isRead` | Is Read | bool | bool |

### SiriKitSendMessageIntent

`com.apple.siri.messages.SiriMessagesAppIntentsExtension.SiriKitSendMessageIntent` · key `com_apple_siri_messages_siri_messages_app_intents_extension_siri_kit_send_message_intent`
  
Sends a message with the associated parameters
  
Output: Message `com.apple.siri.messages.SiriMessagesAppIntentsExtension.SiriKitMessageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `destination` | To | any | entity ConversationEntity |
| `subject` | Subject | text | richText |
| `content` | Content | text | richText |
| `audioMessage` | Audio Message | any | file |
| `attachments` | Attachments | any | file |
| `locations` | Locations | any | entity GeoToolbox.PlaceDescriptorEntity |
| `links` | Links | text | url |
| `scheduledDate` | Date | any | date |

### SiriKitUnsendLastMessageIntent

`com.apple.siri.messages.SiriMessagesAppIntentsExtension.SiriKitUnsendLastMessageIntent` · key `com_apple_siri_messages_siri_messages_app_intents_extension_siri_kit_unsend_last_message_intent`
  
Unsend a sent message
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `message` | Message | any | entity SiriKitMessageEntity |

### Update a Draft

`com.apple.siri.messages.SiriMessagesAppIntentsExtension.UpdateDraftTool` · key `com_apple_siri_messages_siri_messages_app_intents_extension_update_a_draft`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `draft` | draft message | any | entity DraftMessageEntity |
| `recipients` | recipients | any | person |
| `subject` | subject | text | richText |
| `content` | content | text | richText |
| `isAudioMessage` | Is audio message | bool | bool |

### Prepare Conversation

`com.apple.siri.messages.SiriMessagesFlowTools.SiriMessagesFlowTools.PrepareToReadConversationTool|com.apple.siri.messages.SiriMessagesAppIntentsExtension` · key `-`
  
Takes a ConversationEntity and prepares it for reading.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `conversation` | conversation | any | entity ConversationEntity |

## SiriMessagesFlowTools (`com.apple.siri.messages.SiriMessagesFlowTools`)

### Edit Last Message Sent With Siri

`com.apple.siri.messages.SiriMessagesFlowTools.SiriMessagesFlowTools.EditLastMessageSentWithSiriTool` · key `-`
  
Edit the content of the last message that was sent with Siri.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `content` | content | text | string |

### PerformMessagesPostReadActionFlowTool

`com.apple.siri.messages.SiriMessagesFlowTools.SiriMessagesFlowTools.PerformMessagesPostReadActionFlowTool` · key `-`
  
Post-read action messages Flow Tool
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `readableMessages` | Readable Messages | any | entity ReadableMessageAppEntity |

### Unsend Last Message Sent With Siri

`com.apple.siri.messages.SiriMessagesFlowTools.SiriMessagesFlowTools.UnsendLastMessageSentWithSiriTool` · key `-`
  
Unsend the last message that was sent with Siri.
  
Output:  `none`

## SiriNotificationsAppIntentsExtension (`com.apple.siri.SiriNotificationsAppIntentsExtension`)

### Prepare notifications

`com.apple.siri.SiriNotificationsAppIntentsExtension.PrepareNotificationsIntent` · key `com_apple_siri_siri_notifications_app_intents_extension_prepare_notifications`
  
Prepare notifications
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `notifications` | Notifications | any | entity UserNotificationEntity |
| `isReadLatest` | Is Read Latest | bool | bool |
| `isCatchMeUp` | Is Catch Me Up | bool | bool |
| `app` | App | any | app |

### SiriNotificationsAppIntentsExtension

`com.apple.siri.SiriNotificationsAppIntentsExtension.SiriNotificationsAppIntentsExtension` · key `com_apple_siri_siri_notifications_app_intents_extension_siri_notifications_app_intents_extension`
  
Output:  `none`

## SiriNotificationsFlowTools (`com.apple.siri.SiriNotificationsFlowTools`)

### Prepare Notifications

`com.apple.siri.SiriNotificationsFlowTools.SiriNotificationsFlowTools.PrepareNotificationsTool` · key `-`
  
Prepare notifications for reading
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `notifications` | Notifications | any | entity UserNotificationEntity |
| `isReadLatest` | Is Read Latest | bool | bool |
| `isCatchMeUp` | Is Catch Me Up | bool | bool |

## SiriPhoneAppIntentsExtension (`com.apple.siri.SiriPhoneAppIntentsExtension`)

### SiriPhonePunchoutIntent

`com.apple.siri.SiriPhoneAppIntentsExtension.SiriPhonePunchoutIntent` · key `phone_siriphone_punchout_intent`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `url` | Url | text | string |
| `uniqueID` | Unique ID | text | string |
| `OpenWhenRun` | Open When Run | bool | bool |

## SiriPhoneFlowTools (`com.apple.siri.SiriPhoneFlowTools`)

### Call Emergency Contact Flow Tool

`com.apple.siri.SiriPhoneFlowTools.SiriPhoneFlowTools.CallEmergencyContactFlowTool` · key `-`
  
Call the emergency contact.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `audioRoute` | Audio Route | any | entity CallAudioRoute |

### Callback Flow Tool

`com.apple.siri.SiriPhoneFlowTools.SiriPhoneFlowTools.CallbackFlowTool` · key `-`
  
Callback the previous caller.
  
Output:  `none`

### Prepare Call Messages Flow Tool

`com.apple.siri.SiriPhoneFlowTools.SiriPhoneFlowTools.PrepareCallMessagesFlowTool` · key `-`
  
Prepare call messages (voicemails).
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `messages` | Messages | any | entity CallMessage |

### Prepare Read Call Records

`com.apple.siri.SiriPhoneFlowTools.SiriPhoneFlowTools.PrepareReadCallRecordsFlowTool` · key `-`
  
Prepare Read call records.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `records` | Records | any | entity CallRecord |

### Read Call Message Flow Tool

`com.apple.siri.SiriPhoneFlowTools.SiriPhoneFlowTools.ReadCallMessageFlowTool` · key `-`
  
Read call message.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `message` | Message | any | entity ReadableCallMessageAppEntity |

### Redial Flow Tool

`com.apple.siri.SiriPhoneFlowTools.SiriPhoneFlowTools.RedialFlowTool` · key `-`
  
Redial last caller.
  
Output:  `none`

### Start Crisis Helpline Call Flow Tool

`com.apple.siri.SiriPhoneFlowTools.SiriPhoneFlowTools.StartCrisisHelplineCallFlowTool` · key `-`
  
Start a crisis helpline call.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `crisisResourceType` | Crisis Resource Type | string | enum: `domesticViolence`, `poisonControl`, `sexualAssault`, `suicidePrevention` |
| `audioRoute` | Audio Route | any | entity CallAudioRoute |

## SiriPhotosAppIntentsExtension (`com.apple.siri.SiriPhotosAppIntentsExtension`)

### SiriPhotosAppIntentsExtension

`com.apple.siri.SiriPhotosAppIntentsExtension.SiriPhotosAppIntentsExtension` · key `com_apple_siri_siri_photos_app_intents_extension_siri_photos_app_intents_extension`
  
Output:  `none`

### Update Photo Warmth

`com.apple.siri.SiriPhotosAppIntentsExtension.UpdatePhotoWarmthTool` · key `com_apple_siri_siri_photos_app_intents_extension_update_photo_warmth`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Target | text | string |
| `adjustmentType` | Adjustment Type | string | enum: `warmth` |
| `value` | Value | number | double |
| `isPercentage` | Is Percentage | bool | bool |

## SiriTranslationFlowTools (`com.apple.siri.SiriTranslationFlowTools`)

### Translate Text

`com.apple.siri.SiriTranslationFlowTools.SiriTranslationFlowTools.TranslateTextFlowTool` · key `-`
  
Translate text from one language to another
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `phrase` | Phrase | text | string |
| `targetLanguage` | Target Language | text | string |
| `sourceLanguage` | Source Language | text | string |

## SiriVideoAppIntents (`com.apple.siri.SiriVideoAppIntents`)

### Cross Device Placeholder Intent

`com.apple.siri.SiriVideoAppIntents.CrossDevicePlaceholderIntent` · key `com_apple_siri_siri_video_app_intents_cross_device_placeholder_intent`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `route` | Route | any | entity MediaIntents.HomeDeviceGroupRepresentationEntity |

### Finds a freeform video

`com.apple.siri.SiriVideoAppIntents.InternalFindFreeformVideoIntent` · key `com_apple_siri_siri_video_app_intents_finds_a_freeform_video`
  
Finds a freeform video
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Entity | any | entity GenericVideoEntity |

### Finds a video

`com.apple.siri.SiriVideoAppIntents.InternalFindVideoIntent` · key `com_apple_siri_siri_video_app_intents_finds_a_video`
  
Finds a video
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `content` | Content | any | entity SiriVideoMovieEntity |

### Plays a video

`com.apple.siri.SiriVideoAppIntents.InternalPlayContentIntent` · key `com_apple_siri_siri_video_app_intents_plays_a_video`
  
Plays a video
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `content` | Content | any | entity GenericVideoEntity |

## SiriVideoFlowTools (`com.apple.siri.SiriVideoFlowTools`)

### Find Video content

`com.apple.siri.SiriVideoFlowTools.SiriVideoFlowTools.FindVideoContentTool` · key `-`
  
Find Video content
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `content` | Content | any | entity SiriVideoMovieEntity |

## Spotlight (`com.apple.Spotlight`)

### Clear Current Search

`com.apple.Spotlight.ClearSpotlightIntent` · key `spotlight_clear_current_search`
  
Clear current search and return to recents and suggestions
  
Output:  `none`

### Get Current Search Query

`com.apple.Spotlight.SearchFieldEntity` · key `spotlight_get_current_search_query`
  
Output: Current Search Query `com.apple.Spotlight.SearchFieldEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `searchString` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | current search query | string | enum: `Library` |

### Open Search

`com.apple.Spotlight.SearchSpotlightIntent` · key `spotlight_open_search`
  
Opens Search and performs a search for the specified text.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `criteria` | Search | text | string |

### Continue Search in App

`com.apple.Spotlight.SearchUIContinuationIntent` · key `spotlight_continue_search_in_app`
  
Continue Search with the same search query in another app
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | App | any | entity SearchUIContinuationEntity |

### Open Siri Knowledge Page

`com.apple.Spotlight.SearchUIOpenKnowledgeIntent` · key `spotlight_open_siri_knowledge_page`
  
Navigate to Siri Knowledge Page
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Siri Knowledge Page | any | entity SearchUIKnowledgeEntity |

### Show Search

`com.apple.Spotlight.ToggleSpotlightIntent` · key `spotlight_show_search`
  
Shows or hides Search.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `action` | Action | string | enum: `close`, `open`, `toggle` |

## Stocks (`com.apple.stocks`)

### Add Symbol to Watchlist

`com.apple.stocks.AddSymbolToWatchlistIntent` · key `stocks_add_symbol_to_watchlist`
  
Adds a symbol to a watchlist.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `symbol` | Symbol | any | entity SymbolEntity |
| `watchlist` | Watchlist | any | entity WatchlistEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Block Channel or Topic

`com.apple.stocks.BlockIntent` · key `stocks_block_channel_or_topic`
  
Block a channel or topic from appearing, except in parts of the app curated by the Apple News editors
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Channel or Topic | any | entity FeedEntity |

### Delete Symbol from Watchlist

`com.apple.stocks.DeleteSymbolFromWatchlistIntent` · key `stocks_delete_symbol_from_watchlist`
  
Delete a symbol from a watchlist.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `symbol` | Symbol | any | entity SymbolEntity |
| `watchlist` | Watchlist | any | entity WatchlistEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Delete Watchlist

`com.apple.stocks.DeleteWatchlistsIntent` · key `stocks_delete_watchlist`
  
Deletes the selected watchlists.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Watchlist | any | entity WatchlistEntity |

### Follow Channel or Topic

`com.apple.stocks.FollowIntent` · key `stocks_follow_channel_or_topic`
  
Adds a channel or topic to your Following list
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Channel or Topic | any | entity FeedEntity |

### Get Symbol Quote

`com.apple.stocks.GetSymbolQuoteIntent` · key `stocks_get_symbol_quote`
  
Shows a price quote and performance for the symbol.
  
Output: Symbol Quote `com.apple.stocks.SymbolQuoteEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `symbol` | Symbol | any | entity SymbolEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Create Watchlist

`com.apple.stocks.NewWatchlistIntent` · key `stocks_create_watchlist`
  
Creates a new list of symbols you are interested in.
  
Output: Watchlist `com.apple.stocks.WatchlistEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | string |
| `symbols` | Symbols | any | entity SymbolEntity |
| `OpenWhenRun` | Open When Run | bool | bool |

### Find News Tab Deep Links

`com.apple.stocks.NewsTabDeepLink` · key `news_find_news_tab_deep_links`
  
Output: News Tab Deep Links `com.apple.stocks.NewsTabDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | news tab deep links | string | enum: `Library` |

### Open Article

`com.apple.stocks.OpenArticleIntent` · key `stocks_open_article`
  
Open an article in the News app
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Article | any | entity ArticleEntity |

### Open Business News

`com.apple.stocks.OpenBusinessNewsIntent` · key `stocks_open_business_news`
  
Shows news about the symbols in your watchlists and stories driving the market.
  
Output:  `none`

### Open Channel or Topic

`com.apple.stocks.OpenFeedIntent` · key `stocks_open_channel_or_topic`
  
Open a channel or topic feed in the News app
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Feed | any | entity FeedEntity |

### Open History Feed

`com.apple.stocks.OpenHistoryIntent` · key `stocks_open_history_feed`
  
Opens the History Feed
  
Output:  `none`

### Open Recipe

`com.apple.stocks.OpenRecipeIntent` · key `stocks_open_recipe`
  
Shows a recipe in the News app.
  
Output: Recipe `com.apple.stocks.NewsRecipeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Recipe | any | entity NewsRecipeEntity |

### Open Saved Feed

`com.apple.stocks.OpenSavedIntent` · key `stocks_open_saved_feed`
  
Opens the Saved Feed
  
Output:  `none`

### Open Saved Recipes

`com.apple.stocks.OpenSavedRecipesIntent` · key `stocks_open_saved_recipes`
  
Opens Saved Recipes
  
Output:  `none`

### Open News Feed

`com.apple.stocks.OpenStaticFeed` · key `news_open_news_feed`
  
Open a feed in the News app
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | News Tab Deep Links | any | entity NewsTabDeepLink |

### Open Symbol

`com.apple.stocks.OpenSymbolIntent` · key `stocks_open_symbol`
  
Shows price quotes, trends, and performance data for the symbol you choose.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Symbol | any | entity SymbolEntity |

### Open Watchlist

`com.apple.stocks.OpenWatchlistIntent` · key `stocks_open_watchlist`
  
Shows the watchlist you choose.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Watchlist | any | entity WatchlistEntity |
| `symbol` | Symbol | any | entity SymbolEntity |

### Play Article

`com.apple.stocks.PlayArticleIntent` · key `stocks_play_article`
  
Plays the audio story associated with the article.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `article` | Article | any | entity ArticleEntity |

### Save Article

`com.apple.stocks.SaveArticleIntent` · key `stocks_save_article`
  
Add the article to your Saved Stories list
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Article | any | entity ArticleEntity |

### Find Symbol

`com.apple.stocks.SymbolEntity` · key `stocks_find_symbol`
  
Find Symbols
  
Output: Symbol `com.apple.stocks.SymbolEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `exchange`, `name`, `symbol` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | symbol | string | enum: `Library` |

### Find Symbol

`com.apple.stocks.SymbolWidgetEntity` · key `stocks_find_symbol`
  
Output: Symbol `com.apple.stocks.SymbolWidgetEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `exchange`, `name`, `symbol` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | symbol | string | enum: `Library` |

### Unblock Channel or Topic

`com.apple.stocks.UnblockIntent` · key `stocks_unblock_channel_or_topic`
  
Unblock a channel or topic from appearing
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Channel or Topic | any | entity FeedEntity |

### Unsave Article

`com.apple.stocks.UnsaveArticleIntent` · key `stocks_unsave_article`
  
Delete the article from your Saved Stories list
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Article | any | entity ArticleEntity |

### Find Watchlist

`com.apple.stocks.WatchlistEntity` · key `stocks_find_watchlist`
  
Find Watchlist
  
Output: Watchlist `com.apple.stocks.WatchlistEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `name` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | watchlist | string | enum: `Library` |

## System Settings (`com.apple.systempreferences`)

### Get Accent color

`com.apple.systempreferences.AccentColorEntity` · key `settings_get_accent_color`
  
Output: Accent color `com.apple.systempreferences.AccentColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | accent color | string | enum: `Library` |

### Update Accent color

`com.apple.systempreferences.AccentColorEntity-UpdatableEntity` · key `settings_update_accent_color`
  
Change the Accent color value of Accent color
  
Output: Accent color `com.apple.systempreferences.AccentColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Accent color | any | entity AccentColorEntity |
| `value` | Accent color to update on Accent color | any | enum:  |

### Get AirDrop

`com.apple.systempreferences.AirDropEntity` · key `settings_get_air_drop`
  
Output: AirDrop `com.apple.systempreferences.AirDropEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | airdrop | string | enum: `Library` |

### Update AirDrop

`com.apple.systempreferences.AirDropEntity-UpdatableEntity` · key `settings_update_air_drop`
  
Change the AirDrop value of AirDrop
  
Output: AirDrop `com.apple.systempreferences.AirDropEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | AirDrop | any | entity AirDropEntity |
| `value` | AirDrop to update on AirDrop | string | enum: `contactsOnly`, `everyone`, `off` |

### Check who can AirPlay to this computer

`com.apple.systempreferences.AirPlayIntent` · key `settings_check_who_can_air_play_to_this_computer`
  
Check who can AirPlay to this computer
  
Output: Allow AirPlay for `com.apple.systempreferences.AirPlayAccessEntity`

### Get AirPlay Receiver Status

`com.apple.systempreferences.AirPlayReceiverIntent` · key `settings_get_air_play_receiver_status`
  
Allow nearby Apple devices to send video and audio content to your Mac with AirPlay.
  
Output: AirPlay Receiver Enabled `bool`

### Get AirPlay Password Status

`com.apple.systempreferences.AirPlayRequiresPasswordIntent` · key `settings_get_air_play_password_status`
  
Ask for password when starting AirPlay.
  
Output: AirPlay Password Enabled `bool`

### Get Tint window background with wallpaper color

`com.apple.systempreferences.AllowWallPaperTintingEntity` · key `settings_get_tint_window_background_with_wallpaper_color`
  
Output: Tint window background with wallpaper color `com.apple.systempreferences.AllowWallPaperTintingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | tint window background with wallpaper color | string | enum: `Library` |

### Update Tint window background with wallpaper color

`com.apple.systempreferences.AllowWallPaperTintingEntity-UpdatableEntity` · key `settings_update_tint_window_background_with_wallpaper_color`
  
Change the Tint window background with wallpaper color value of Tint window background with wallpaper color
  
Output: Tint window background with wallpaper color `com.apple.systempreferences.AllowWallPaperTintingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Tint window background with wallpaper color | any | entity AllowWallPaperTintingEntity |
| `value` | Tint window background with wallpaper color to update on Tint window background with wallpaper color | bool | bool |

### Get Appearance

`com.apple.systempreferences.AppearanceEntity` · key `settings_get_appearance`
  
Output: Appearance `com.apple.systempreferences.AppearanceEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | appearance | string | enum: `Library` |

### Update Appearance

`com.apple.systempreferences.AppearanceEntity-UpdatableEntity` · key `settings_update_appearance`
  
Change the Appearance value of Appearance
  
Output: Appearance `com.apple.systempreferences.AppearanceEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Appearance | any | entity AppearanceEntity |
| `value` | Appearance to update on Appearance | string | enum: `auto`, `dark`, `light` |

### Find Mouse setting

`com.apple.systempreferences.AppearanceSettingsDeepLink` · key `settings_find_mouse_setting`
  
Output: Mouse setting `com.apple.systempreferences.AppearanceSettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | mouse setting | string | enum: `Library` |

### Get Automatically adjust brightness on the main display

`com.apple.systempreferences.AutoBrightnessEntity` · key `settings_get_automatically_adjust_brightness_on_the_main_display`
  
Output: Automatically adjust brightness on the main display `com.apple.systempreferences.AutoBrightnessEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically adjust brightness on the main display | string | enum: `Library` |

### Update Automatically adjust brightness on the main display

`com.apple.systempreferences.AutoBrightnessEntity-UpdatableEntity` · key `settings_update_automatically_adjust_brightness_on_the_main_display`
  
Change the Automatically adjust brightness on the main display value of Automatically adjust brightness on the main display
  
Output: Automatically adjust brightness on the main display `com.apple.systempreferences.AutoBrightnessEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Automatically adjust brightness on the main display | any | entity AutoBrightnessEntity |
| `value` | Automatically adjust brightness on the main display to update on Automatically adjust brightness on the main display | bool | bool |

### Get Automatically Log In Status

`com.apple.systempreferences.AutoLoginIntent` · key `settings_get_automatically_log_in_status`
  
Get the user automatically log in as.
  
Output: Automatically Login Status `com.apple.systempreferences.AccountEntity`

### Get Automatically reconnect to any nearby Mac or iPad

`com.apple.systempreferences.AutomaticReconnectEntity` · key `settings_get_automatically_reconnect_to_any_nearby_mac_or_ipad`
  
Output: Automatically reconnect to any nearby Mac or iPad `com.apple.systempreferences.AutomaticReconnectEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically reconnect to any nearby mac or ipad | string | enum: `Library` |

### Update Automatically reconnect to any nearby Mac or iPad

`com.apple.systempreferences.AutomaticReconnectEntity-UpdatableEntity` · key `settings_update_automatically_reconnect_to_any_nearby_mac_or_ipad`
  
Change the Automatically reconnect to any nearby Mac or iPad value of Automatically reconnect to any nearby Mac or iPad
  
Output: Automatically reconnect to any nearby Mac or iPad `com.apple.systempreferences.AutomaticReconnectEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Automatically reconnect to any nearby Mac or iPad | any | entity AutomaticReconnectEntity |
| `value` | Automatically reconnect to any nearby Mac or iPad to update on Automatically reconnect to any nearby Mac or iPad | bool | bool |

### Get Available Displays

`com.apple.systempreferences.AvailableDisplaysEntity` · key `settings_get_available_displays`
  
Output: Available Displays `com.apple.systempreferences.AvailableDisplaysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | available displays | string | enum: `Library` |

### Get Enable Vocal Shortcuts

`com.apple.systempreferences.AxAdaptiveVoiceShortcutsEntity` · key `settings_get_enable_vocal_shortcuts`
  
Output: Enable Vocal Shortcuts `com.apple.systempreferences.AxAdaptiveVoiceShortcutsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | enable vocal shortcuts | string | enum: `Library` |

### Update AX.VocalShortcuts.axAdaptiveVoiceShortcuts.title

`com.apple.systempreferences.AxAdaptiveVoiceShortcutsEntity-UpdatableEntity` · key `settings_update_ax_vocal_shortcuts_ax_adaptive_voice_shortcuts_title`
  
Vocal Shortcuts
  
Output: Enable Vocal Shortcuts `com.apple.systempreferences.AxAdaptiveVoiceShortcutsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Enable Vocal Shortcuts | any | entity AxAdaptiveVoiceShortcutsEntity |
| `value` | AX.VocalShortcuts.axAdaptiveVoiceShortcuts.title to update on AX.VocalShortcuts.axAdaptiveVoiceShortcuts.title | bool | bool |

### Get Alternate Pointer Actions

`com.apple.systempreferences.AxAltMouseButtonsEntity` · key `settings_get_alternate_pointer_actions`
  
Output: Alternate Pointer Actions `com.apple.systempreferences.AxAltMouseButtonsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | alternate pointer actions | string | enum: `Library` |

### Update AX.PointerControl.axAltMouseButtons.title

`com.apple.systempreferences.AxAltMouseButtonsEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_alt_mouse_buttons_title`
  
Allows a switch or facial expression to be used in place of mouse buttons or pointer actions like left-click and right-click.
  
Output: Alternate Pointer Actions `com.apple.systempreferences.AxAltMouseButtonsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Alternate Pointer Actions | any | entity AxAltMouseButtonsEntity |
| `value` | AX.PointerControl.axAltMouseButtons.title to update on AX.PointerControl.axAltMouseButtons.title | bool | bool |

### Get Play sounds for alternative pointer actions

`com.apple.systempreferences.AxAltMouseEnableSoundsEntity` · key `settings_get_play_sounds_for_alternative_pointer_actions`
  
Output: Play sounds for alternative pointer actions `com.apple.systempreferences.AxAltMouseEnableSoundsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | play sounds for alternative pointer actions | string | enum: `Library` |

### Update AX.PointerControl.axAltMouseEnableSounds.title

`com.apple.systempreferences.AxAltMouseEnableSoundsEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_alt_mouse_enable_sounds_title`
  
Play sounds for alternative pointer actions
  
Output: Play sounds for alternative pointer actions `com.apple.systempreferences.AxAltMouseEnableSoundsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Play sounds for alternative pointer actions | any | entity AxAltMouseEnableSoundsEntity |
| `value` | AX.PointerControl.axAltMouseEnableSounds.title to update on AX.PointerControl.axAltMouseEnableSounds.title | bool | bool |

### Get Show alternative pointer actions visually

`com.apple.systempreferences.AxAltMouseEnableVisualsEntity` · key `settings_get_show_alternative_pointer_actions_visually`
  
Output: Show alternative pointer actions visually `com.apple.systempreferences.AxAltMouseEnableVisualsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show alternative pointer actions visually | string | enum: `Library` |

### Update AX.PointerControl.axAltMouseEnableVisuals.title

`com.apple.systempreferences.AxAltMouseEnableVisualsEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_alt_mouse_enable_visuals_title`
  
Show alternative pointer actions visually
  
Output: Show alternative pointer actions visually `com.apple.systempreferences.AxAltMouseEnableVisualsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show alternative pointer actions visually | any | entity AxAltMouseEnableVisualsEntity |
| `value` | AX.PointerControl.axAltMouseEnableVisuals.title to update on AX.PointerControl.axAltMouseEnableVisuals.title | bool | bool |

### Get Auto-play animated images

`com.apple.systempreferences.AxAnimatedImagesEntity` · key `settings_get_auto_play_animated_images`
  
Output: Auto-play animated images `com.apple.systempreferences.AxAnimatedImagesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | auto-play animated images | string | enum: `Library` |

### Update AX.Motion.axAnimatedImages.title

`com.apple.systempreferences.AxAnimatedImagesEntity-UpdatableEntity` · key `settings_update_ax_motion_ax_animated_images_title`
  
Auto-play animated images
  
Output: Auto-play animated images `com.apple.systempreferences.AxAnimatedImagesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Auto-play animated images | any | entity AxAnimatedImagesEntity |
| `value` | AX.Motion.axAnimatedImages.title to update on AX.Motion.axAnimatedImages.title | bool | bool |

### Get Enable Background Sounds

`com.apple.systempreferences.AxBackgroundSoundsEntity` · key `settings_get_enable_background_sounds`
  
Output: Enable Background Sounds `com.apple.systempreferences.AxBackgroundSoundsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | enable background sounds | string | enum: `Library` |

### Update AX.Audio.axBackgroundSounds.title

`com.apple.systempreferences.AxBackgroundSoundsEntity-UpdatableEntity` · key `settings_update_ax_audio_ax_background_sounds_title`
  
Plays background sounds to mask unwanted environmental noise. These sounds can minimize distractions and help you to focus, calm, or rest.
  
Output: Enable Background Sounds `com.apple.systempreferences.AxBackgroundSoundsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Enable Background Sounds | any | entity AxBackgroundSoundsEntity |
| `value` | AX.Audio.axBackgroundSounds.title to update on AX.Audio.axBackgroundSounds.title | bool | bool |

### Get Turn off background sounds when your Mac is not in use

`com.apple.systempreferences.AxBackgroundSoundsLockScreenEntity` · key `settings_get_turn_off_background_sounds_when_your_mac_is_not_in_use`
  
Output: Turn off background sounds when your Mac is not in use `com.apple.systempreferences.AxBackgroundSoundsLockScreenEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | turn off background sounds when your mac is not in use | string | enum: `Library` |

### Update AX.Audio.axBackgroundSoundsLockScreen.title

`com.apple.systempreferences.AxBackgroundSoundsLockScreenEntity-UpdatableEntity` · key `settings_update_ax_audio_ax_background_sounds_lock_screen_title`
  
Turn off background sounds when your Mac is not in use
  
Output: Turn off background sounds when your Mac is not in use `com.apple.systempreferences.AxBackgroundSoundsLockScreenEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Turn off background sounds when your Mac is not in use | any | entity AxBackgroundSoundsLockScreenEntity |
| `value` | AX.Audio.axBackgroundSoundsLockScreen.title to update on AX.Audio.axBackgroundSoundsLockScreen.title | bool | bool |

### Get Prefer closed captions and SDH

`com.apple.systempreferences.AxCaptioningPreferSdhEntity` · key `settings_get_prefer_closed_captions_and_sdh`
  
Output: Prefer closed captions and SDH `com.apple.systempreferences.AxCaptioningPreferSdhEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | prefer closed captions and sdh | string | enum: `Library` |

### Update AX.SubtitlesandCaptioning.axCaptioningPreferSdh.title

`com.apple.systempreferences.AxCaptioningPreferSdhEntity-UpdatableEntity` · key `settings_update_ax_subtitlesand_captioning_ax_captioning_prefer_sdh_title`
  
Prefer closed captions and SDH
  
Output: Prefer closed captions and SDH `com.apple.systempreferences.AxCaptioningPreferSdhEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Prefer closed captions and SDH | any | entity AxCaptioningPreferSdhEntity |
| `value` | AX.SubtitlesandCaptioning.axCaptioningPreferSdh.title to update on AX.SubtitlesandCaptioning.axCaptioningPreferSdh.title | bool | bool |

### Get Differentiate without color

`com.apple.systempreferences.AxDifferentiateWithoutColorEntity` · key `settings_get_differentiate_without_color`
  
Output: Differentiate without color `com.apple.systempreferences.AxDifferentiateWithoutColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | differentiate without color | string | enum: `Library` |

### Update AX.Display.axDifferentiateWithoutColor.title

`com.apple.systempreferences.AxDifferentiateWithoutColorEntity-UpdatableEntity` · key `settings_update_ax_display_ax_differentiate_without_color_title`
  
Differentiate without color
  
Output: Differentiate without color `com.apple.systempreferences.AxDifferentiateWithoutColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Differentiate without color | any | entity AxDifferentiateWithoutColorEntity |
| `value` | AX.Display.axDifferentiateWithoutColor.title to update on AX.Display.axDifferentiateWithoutColor.title | bool | bool |

### Get Dim Flashing Lights

`com.apple.systempreferences.AxDimFlashingEntity` · key `settings_get_dim_flashing_lights`
  
Output: Dim Flashing Lights `com.apple.systempreferences.AxDimFlashingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | dim flashing lights | string | enum: `Library` |

### Update AX.Motion.axDimFlashing.title

`com.apple.systempreferences.AxDimFlashingEntity-UpdatableEntity` · key `settings_update_ax_motion_ax_dim_flashing_title`
  
Dim flashing lights
  
Output: Dim Flashing Lights `com.apple.systempreferences.AxDimFlashingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Dim Flashing Lights | any | entity AxDimFlashingEntity |
| `value` | AX.Motion.axDimFlashing.title to update on AX.Motion.axDimFlashing.title | bool | bool |

### Get Enable Color Filters

`com.apple.systempreferences.AxDisplayFilterEnabledEntity` · key `settings_get_enable_color_filters`
  
Output: Enable Color Filters `com.apple.systempreferences.AxDisplayFilterEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | enable color filters | string | enum: `Library` |

### Update AX.Display.axDisplayFilterEnabled.title

`com.apple.systempreferences.AxDisplayFilterEnabledEntity-UpdatableEntity` · key `settings_update_ax_display_ax_display_filter_enabled_title`
  
Color filters
  
Output: Enable Color Filters `com.apple.systempreferences.AxDisplayFilterEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Enable Color Filters | any | entity AxDisplayFilterEnabledEntity |
| `value` | AX.Display.axDisplayFilterEnabled.title to update on AX.Display.axDisplayFilterEnabled.title | bool | bool |

### Get Filter type

`com.apple.systempreferences.AxDisplayFilterTypeEntity` · key `settings_get_filter_type`
  
Output: Filter type `com.apple.systempreferences.AxDisplayFilterTypeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | filter type | string | enum: `Library` |

### Update AX.Display.axDisplayFilterType.title

`com.apple.systempreferences.AxDisplayFilterTypeEntity-UpdatableEntity` · key `settings_update_ax_display_ax_display_filter_type_title`
  
Filter type
  
Output: Filter type `com.apple.systempreferences.AxDisplayFilterTypeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Filter type | any | entity AxDisplayFilterTypeEntity |
| `value` | AX.Display.axDisplayFilterType.title to update on AX.Display.axDisplayFilterType.title | string | enum: `0`, `1`, `2`, `3`, `4` |

### Get Default dwell action

`com.apple.systempreferences.AxDwellActionEntity` · key `settings_get_default_dwell_action`
  
Output: Default dwell action `com.apple.systempreferences.AxDwellActionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | default dwell action | string | enum: `Library` |

### Update AX.Keyboard.axDwellAction.title

`com.apple.systempreferences.AxDwellActionEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_dwell_action_title`
  
Default dwell action
  
Output: Default dwell action `com.apple.systempreferences.AxDwellActionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Default dwell action | any | entity AxDwellActionEntity |
| `value` | AX.Keyboard.axDwellAction.title to update on AX.Keyboard.axDwellAction.title | string | enum: `0`, `1`, `2`, `3`, `4`, `5`, `6` |

### Get Dwell auto revert

`com.apple.systempreferences.AxDwellAutoRevertEntity` · key `settings_get_dwell_auto_revert`
  
Output: Dwell auto revert `com.apple.systempreferences.AxDwellAutoRevertEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | dwell auto revert | string | enum: `Library` |

### Update AX.Keyboard.axDwellAutoRevert.title

`com.apple.systempreferences.AxDwellAutoRevertEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_dwell_auto_revert_title`
  
Dwell auto revert
  
Output: Dwell auto revert `com.apple.systempreferences.AxDwellAutoRevertEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Dwell auto revert | any | entity AxDwellAutoRevertEntity |
| `value` | AX.Keyboard.axDwellAutoRevert.title to update on AX.Keyboard.axDwellAutoRevert.title | bool | bool |

### Get Dwell color

`com.apple.systempreferences.AxDwellCursorColorEntity` · key `settings_get_dwell_color`
  
Output: Dwell color `com.apple.systempreferences.AxDwellCursorColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | dwell color | string | enum: `Library` |

### Update AX.Keyboard.axDwellCursorColor.title

`com.apple.systempreferences.AxDwellCursorColorEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_dwell_cursor_color_title`
  
Dwell color
  
Output: Dwell color `com.apple.systempreferences.AxDwellCursorColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Dwell color | any | entity AxDwellCursorColorEntity |
| `value` | AX.Keyboard.axDwellCursorColor.title to update on AX.Keyboard.axDwellCursorColor.title | string | enum: `0`, `1`, `2`, `3`, `4`, `5`, `6` |

### Get Always dwell in menu extras

`com.apple.systempreferences.AxDwellInMenuExtraEntity` · key `settings_get_always_dwell_in_menu_extras`
  
Output: Always dwell in menu extras `com.apple.systempreferences.AxDwellInMenuExtraEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | always dwell in menu extras | string | enum: `Library` |

### Update AX.Keyboard.axDwellInMenuExtra.title

`com.apple.systempreferences.AxDwellInMenuExtraEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_dwell_in_menu_extra_title`
  
Always dwell in menu extras
  
Output: Always dwell in menu extras `com.apple.systempreferences.AxDwellInMenuExtraEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Always dwell in menu extras | any | entity AxDwellInMenuExtraEntity |
| `value` | AX.Keyboard.axDwellInMenuExtra.title to update on AX.Keyboard.axDwellInMenuExtra.title | bool | bool |

### Get Always dwell in panels

`com.apple.systempreferences.AxDwellInPanelsEntity` · key `settings_get_always_dwell_in_panels`
  
Output: Always dwell in panels `com.apple.systempreferences.AxDwellInPanelsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | always dwell in panels | string | enum: `Library` |

### Update AX.Keyboard.axDwellInPanels.title

`com.apple.systempreferences.AxDwellInPanelsEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_dwell_in_panels_title`
  
Always dwell in panels
  
Output: Always dwell in panels `com.apple.systempreferences.AxDwellInPanelsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Always dwell in panels | any | entity AxDwellInPanelsEntity |
| `value` | AX.Keyboard.axDwellInPanels.title to update on AX.Keyboard.axDwellInPanels.title | bool | bool |

### Get Hide dwell time indicators

`com.apple.systempreferences.AxDwellProgressIndicatorEntity` · key `settings_get_hide_dwell_time_indicators`
  
Output: Hide dwell time indicators `com.apple.systempreferences.AxDwellProgressIndicatorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | hide dwell time indicators | string | enum: `Library` |

### Update AX.Keyboard.axDwellProgressIndicator.title

`com.apple.systempreferences.AxDwellProgressIndicatorEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_dwell_progress_indicator_title`
  
Hide dwell time indicators
  
Output: Hide dwell time indicators `com.apple.systempreferences.AxDwellProgressIndicatorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Hide dwell time indicators | any | entity AxDwellProgressIndicatorEntity |
| `value` | AX.Keyboard.axDwellProgressIndicator.title to update on AX.Keyboard.axDwellProgressIndicator.title | bool | bool |

### Get Enable zoom when using dwell

`com.apple.systempreferences.AxDwellZoomEntity` · key `settings_get_enable_zoom_when_using_dwell`
  
Output: Enable zoom when using dwell `com.apple.systempreferences.AxDwellZoomEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | enable zoom when using dwell | string | enum: `Library` |

### Update AX.Keyboard.axDwellZoom.title

`com.apple.systempreferences.AxDwellZoomEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_dwell_zoom_title`
  
Enable zoom when using dwell
  
Output: Enable zoom when using dwell `com.apple.systempreferences.AxDwellZoomEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Enable zoom when using dwell | any | entity AxDwellZoomEntity |
| `value` | AX.Keyboard.axDwellZoom.title to update on AX.Keyboard.axDwellZoom.title | bool | bool |

### Get Live Captions in FaceTime

`com.apple.systempreferences.AxFacetimeTranscriptionsEntity` · key `settings_get_live_captions_in_face_time`
  
Output: Live Captions in FaceTime `com.apple.systempreferences.AxFacetimeTranscriptionsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | live captions in facetime | string | enum: `Library` |

### Update AX.LiveCaptions.axFacetimeTranscriptions.title

`com.apple.systempreferences.AxFacetimeTranscriptionsEntity-UpdatableEntity` · key `settings_update_ax_live_captions_ax_facetime_transcriptions_title`
  
Live Captions in FaceTime
  
Output: Live Captions in FaceTime `com.apple.systempreferences.AxFacetimeTranscriptionsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Live Captions in FaceTime | any | entity AxFacetimeTranscriptionsEntity |
| `value` | AX.LiveCaptions.axFacetimeTranscriptions.title to update on AX.LiveCaptions.axFacetimeTranscriptions.title | bool | bool |

### Get Live Speech

`com.apple.systempreferences.AxFeatureLivespeechEntity` · key `settings_get_live_speech`
  
Output: Live Speech `com.apple.systempreferences.AxFeatureLivespeechEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | live speech | string | enum: `Library` |

### Update AX.LiveSpeech.axFeatureLivespeech.title

`com.apple.systempreferences.AxFeatureLivespeechEntity-UpdatableEntity` · key `settings_update_ax_live_speech_ax_feature_livespeech_title`
  
Live Speech
  
Output: Live Speech `com.apple.systempreferences.AxFeatureLivespeechEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Live Speech | any | entity AxFeatureLivespeechEntity |
| `value` | AX.LiveSpeech.axFeatureLivespeech.title to update on AX.LiveSpeech.axFeatureLivespeech.title | bool | bool |

### Get Switch Control

`com.apple.systempreferences.AxFeatureSwitchcontrolEntity` · key `settings_get_switch_control`
  
Output: Switch Control `com.apple.systempreferences.AxFeatureSwitchcontrolEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | switch control | string | enum: `Library` |

### Update AX.SwitchControl.axFeatureSwitchcontrol.title

`com.apple.systempreferences.AxFeatureSwitchcontrolEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_feature_switchcontrol_title`
  
Switch Control allows the computer to be controlled using one or more switches. These can be mouse, keyboard, gamepad buttons or dedicated devices.
  
Output: Switch Control `com.apple.systempreferences.AxFeatureSwitchcontrolEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Switch Control | any | entity AxFeatureSwitchcontrolEntity |
| `value` | AX.SwitchControl.axFeatureSwitchcontrol.title to update on AX.SwitchControl.axFeatureSwitchcontrol.title | bool | bool |

### Get Voice Control

`com.apple.systempreferences.AxFeatureVoicecontrolEntity` · key `settings_get_voice_control`
  
Output: Voice Control `com.apple.systempreferences.AxFeatureVoicecontrolEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | voice control | string | enum: `Library` |

### Update AX.VoiceControl.axFeatureVoicecontrol.title

`com.apple.systempreferences.AxFeatureVoicecontrolEntity-UpdatableEntity` · key `settings_update_ax_voice_control_ax_feature_voicecontrol_title`
  
Voice Control allows you to use your voice to edit text and interact with your computer even when you are on calls.
  
Output: Voice Control `com.apple.systempreferences.AxFeatureVoicecontrolEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Voice Control | any | entity AxFeatureVoicecontrolEntity |
| `value` | AX.VoiceControl.axFeatureVoicecontrol.title to update on AX.VoiceControl.axFeatureVoicecontrol.title | bool | bool |

### Get VoiceOver

`com.apple.systempreferences.AxFeatureVoiceoverEntity` · key `settings_get_voice_over`
  
Output: VoiceOver `com.apple.systempreferences.AxFeatureVoiceoverEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | voiceover | string | enum: `Library` |

### Update AX.VoiceOver.axFeatureVoiceover.title

`com.apple.systempreferences.AxFeatureVoiceoverEntity-UpdatableEntity` · key `settings_update_ax_voice_over_ax_feature_voiceover_title`
  
VoiceOver
  
Output: VoiceOver `com.apple.systempreferences.AxFeatureVoiceoverEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | VoiceOver | any | entity AxFeatureVoiceoverEntity |
| `value` | AX.VoiceOver.axFeatureVoiceover.title to update on AX.VoiceOver.axFeatureVoiceover.title | bool | bool |

### Get Zoom

`com.apple.systempreferences.AxFeatureZoomEntity` · key `settings_get_zoom`
  
Output: Zoom `com.apple.systempreferences.AxFeatureZoomEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom | string | enum: `Library` |

### Update AX.Zoom.axFeatureZoom.title

`com.apple.systempreferences.AxFeatureZoomEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_feature_zoom_title`
  
Zoom
  
Output: Zoom `com.apple.systempreferences.AxFeatureZoomEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom | any | entity AxFeatureZoomEntity |
| `value` | AX.Zoom.axFeatureZoom.title to update on AX.Zoom.axFeatureZoom.title | bool | bool |

### Get Shake mouse pointer to locate

`com.apple.systempreferences.AxFindCursorEntity` · key `settings_get_shake_mouse_pointer_to_locate`
  
Output: Shake mouse pointer to locate `com.apple.systempreferences.AxFindCursorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | shake mouse pointer to locate | string | enum: `Library` |

### Update AX.Display.axFindCursor.title

`com.apple.systempreferences.AxFindCursorEntity-UpdatableEntity` · key `settings_update_ax_display_ax_find_cursor_title`
  
Shake mouse pointer to locate
  
Output: Shake mouse pointer to locate `com.apple.systempreferences.AxFindCursorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Shake mouse pointer to locate | any | entity AxFindCursorEntity |
| `value` | AX.Display.axFindCursor.title to update on AX.Display.axFindCursor.title | bool | bool |

### Get Auto-hide full keyboard access

`com.apple.systempreferences.AxFkaAutoHideCheckboxEntity` · key `settings_get_auto_hide_full_keyboard_access`
  
Output: Auto-hide full keyboard access `com.apple.systempreferences.AxFkaAutoHideCheckboxEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | auto-hide full keyboard access | string | enum: `Library` |

### Update AX.Keyboard.axFkaAutoHideCheckbox.title

`com.apple.systempreferences.AxFkaAutoHideCheckboxEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_fka_auto_hide_checkbox_title`
  
Auto-hide full keyboard access
  
Output: Auto-hide full keyboard access `com.apple.systempreferences.AxFkaAutoHideCheckboxEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Auto-hide full keyboard access | any | entity AxFkaAutoHideCheckboxEntity |
| `value` | AX.Keyboard.axFkaAutoHideCheckbox.title to update on AX.Keyboard.axFkaAutoHideCheckbox.title | bool | bool |

### Get Full Keyboard Access

`com.apple.systempreferences.AxFkaEnableCheckboxEntity` · key `settings_get_full_keyboard_access`
  
Output: Full Keyboard Access `com.apple.systempreferences.AxFkaEnableCheckboxEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | full keyboard access | string | enum: `Library` |

### Update AX.Keyboard.axFkaEnableCheckbox.title

`com.apple.systempreferences.AxFkaEnableCheckboxEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_fka_enable_checkbox_title`
  
Full Keyboard Access allows the computer to be controlled with a keyboard. Use keyboard shortcuts to navigate through all controls and perform actions.
  
Output: Full Keyboard Access `com.apple.systempreferences.AxFkaEnableCheckboxEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Full Keyboard Access | any | entity AxFkaEnableCheckboxEntity |
| `value` | AX.Keyboard.axFkaEnableCheckbox.title to update on AX.Keyboard.axFkaEnableCheckbox.title | bool | bool |

### Get full keyboard access high contrast

`com.apple.systempreferences.AxFkaHighContrastCheckboxEntity` · key `settings_get_full_keyboard_access_high_contrast`
  
Output: full keyboard access high contrast `com.apple.systempreferences.AxFkaHighContrastCheckboxEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | full keyboard access high contrast | string | enum: `Library` |

### Update AX.Keyboard.axFkaHighContrastCheckbox.title

`com.apple.systempreferences.AxFkaHighContrastCheckboxEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_fka_high_contrast_checkbox_title`
  
full keyboard access high contrast
  
Output: full keyboard access high contrast `com.apple.systempreferences.AxFkaHighContrastCheckboxEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | full keyboard access high contrast | any | entity AxFkaHighContrastCheckboxEntity |
| `value` | AX.Keyboard.axFkaHighContrastCheckbox.title to update on AX.Keyboard.axFkaHighContrastCheckbox.title | bool | bool |

### Get Increase full keyboard access border size

`com.apple.systempreferences.AxFkaIncreaseSizeCheckboxEntity` · key `settings_get_increase_full_keyboard_access_border_size`
  
Output: Increase full keyboard access border size `com.apple.systempreferences.AxFkaIncreaseSizeCheckboxEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | increase full keyboard access border size | string | enum: `Library` |

### Update AX.Keyboard.axFkaIncreaseSizeCheckbox.title

`com.apple.systempreferences.AxFkaIncreaseSizeCheckboxEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_fka_increase_size_checkbox_title`
  
Increase full keyboard access border size
  
Output: Increase full keyboard access border size `com.apple.systempreferences.AxFkaIncreaseSizeCheckboxEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Increase full keyboard access border size | any | entity AxFkaIncreaseSizeCheckboxEntity |
| `value` | AX.Keyboard.axFkaIncreaseSizeCheckbox.title to update on AX.Keyboard.axFkaIncreaseSizeCheckbox.title | bool | bool |

### Get Flash the screen when an alert sound occurs

`com.apple.systempreferences.AxFlashScreenEntity` · key `settings_get_flash_the_screen_when_an_alert_sound_occurs`
  
Output: Flash the screen when an alert sound occurs `com.apple.systempreferences.AxFlashScreenEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | flash the screen when an alert sound occurs | string | enum: `Library` |

### Update AX.Audio.axFlashScreen.title

`com.apple.systempreferences.AxFlashScreenEntity-UpdatableEntity` · key `settings_update_ax_audio_ax_flash_screen_title`
  
Flash the screen when an alert sound occurs
  
Output: Flash the screen when an alert sound occurs `com.apple.systempreferences.AxFlashScreenEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Flash the screen when an alert sound occurs | any | entity AxFlashScreenEntity |
| `value` | AX.Audio.axFlashScreen.title to update on AX.Audio.axFlashScreen.title | bool | bool |

### Get Head Pointer

`com.apple.systempreferences.AxHeadMouseEntity` · key `settings_get_head_pointer`
  
Output: Head Pointer `com.apple.systempreferences.AxHeadMouseEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | head pointer | string | enum: `Library` |

### Update AX.PointerControl.axHeadMouse.title

`com.apple.systempreferences.AxHeadMouseEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_head_mouse_title`
  
Allows the pointer to be controlled using the movement of your head captured by the camera.
  
Output: Head Pointer `com.apple.systempreferences.AxHeadMouseEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Head Pointer | any | entity AxHeadMouseEntity |
| `value` | AX.PointerControl.axHeadMouse.title to update on AX.PointerControl.axHeadMouse.title | bool | bool |

### Get Allow dwell actions toolbar in panels

`com.apple.systempreferences.AxHomePanelDwellActionsEntity` · key `settings_get_allow_dwell_actions_toolbar_in_panels`
  
Output: Allow dwell actions toolbar in panels `com.apple.systempreferences.AxHomePanelDwellActionsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | allow dwell actions toolbar in panels | string | enum: `Library` |

### Update AX.Keyboard.axHomePanelDwellActions.title

`com.apple.systempreferences.AxHomePanelDwellActionsEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_home_panel_dwell_actions_title`
  
Allow dwell actions toolbar in panels
  
Output: Allow dwell actions toolbar in panels `com.apple.systempreferences.AxHomePanelDwellActionsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Allow dwell actions toolbar in panels | any | entity AxHomePanelDwellActionsEntity |
| `value` | AX.Keyboard.axHomePanelDwellActions.title to update on AX.Keyboard.axHomePanelDwellActions.title | bool | bool |

### Get Bottom left dwell corner

`com.apple.systempreferences.AxHotCornerBottomLeftEntity` · key `settings_get_bottom_left_dwell_corner`
  
Output: Bottom left dwell corner `com.apple.systempreferences.AxHotCornerBottomLeftEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | bottom left dwell corner | string | enum: `Library` |

### Update AX.Keyboard.axHotCornerBottomLeft.title

`com.apple.systempreferences.AxHotCornerBottomLeftEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_hot_corner_bottom_left_title`
  
Assigns the bottom left dwell corner of the accessibility keyboard
  
Output: Bottom left dwell corner `com.apple.systempreferences.AxHotCornerBottomLeftEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Bottom left dwell corner | any | entity AxHotCornerBottomLeftEntity |
| `value` | AX.Keyboard.axHotCornerBottomLeft.title to update on AX.Keyboard.axHotCornerBottomLeft.title | string | enum: `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8` |

### Get Bottom right dwell corner

`com.apple.systempreferences.AxHotCornerBottomRightEntity` · key `settings_get_bottom_right_dwell_corner`
  
Output: Bottom right dwell corner `com.apple.systempreferences.AxHotCornerBottomRightEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | bottom right dwell corner | string | enum: `Library` |

### Update AX.Keyboard.axHotCornerBottomRight.title

`com.apple.systempreferences.AxHotCornerBottomRightEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_hot_corner_bottom_right_title`
  
Assigns the bottom right dwell corner of the accessibility keyboard
  
Output: Bottom right dwell corner `com.apple.systempreferences.AxHotCornerBottomRightEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Bottom right dwell corner | any | entity AxHotCornerBottomRightEntity |
| `value` | AX.Keyboard.axHotCornerBottomRight.title to update on AX.Keyboard.axHotCornerBottomRight.title | string | enum: `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8` |

### Get Show accessibility keyboard near activated screen corner

`com.apple.systempreferences.AxHotCornerMoveHomePanelEntity` · key `settings_get_show_accessibility_keyboard_near_activated_screen_corner`
  
Output: Show accessibility keyboard near activated screen corner `com.apple.systempreferences.AxHotCornerMoveHomePanelEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show accessibility keyboard near activated screen corner | string | enum: `Library` |

### Update AX.Keyboard.axHotCornerMoveHomePanel.title

`com.apple.systempreferences.AxHotCornerMoveHomePanelEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_hot_corner_move_home_panel_title`
  
Show accessibility keyboard near activated screen corner
  
Output: Show accessibility keyboard near activated screen corner `com.apple.systempreferences.AxHotCornerMoveHomePanelEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show accessibility keyboard near activated screen corner | any | entity AxHotCornerMoveHomePanelEntity |
| `value` | AX.Keyboard.axHotCornerMoveHomePanel.title to update on AX.Keyboard.axHotCornerMoveHomePanel.title | bool | bool |

### Get Top left dwell corner

`com.apple.systempreferences.AxHotCornerTopLeftEntity` · key `settings_get_top_left_dwell_corner`
  
Output: Top left dwell corner `com.apple.systempreferences.AxHotCornerTopLeftEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | top left dwell corner | string | enum: `Library` |

### Update AX.Keyboard.axHotCornerTopLeft.title

`com.apple.systempreferences.AxHotCornerTopLeftEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_hot_corner_top_left_title`
  
Assigns the top left dwell corner of the accessibility keyboard
  
Output: Top left dwell corner `com.apple.systempreferences.AxHotCornerTopLeftEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Top left dwell corner | any | entity AxHotCornerTopLeftEntity |
| `value` | AX.Keyboard.axHotCornerTopLeft.title to update on AX.Keyboard.axHotCornerTopLeft.title | string | enum: `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8` |

### Get Top right dwell corner

`com.apple.systempreferences.AxHotCornerTopRightEntity` · key `settings_get_top_right_dwell_corner`
  
Output: Top right dwell corner `com.apple.systempreferences.AxHotCornerTopRightEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | top right dwell corner | string | enum: `Library` |

### Update AX.Keyboard.axHotCornerTopRight.title

`com.apple.systempreferences.AxHotCornerTopRightEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_hot_corner_top_right_title`
  
Assigns the top right dwell corner of the accessibility keyboard
  
Output: Top right dwell corner `com.apple.systempreferences.AxHotCornerTopRightEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Top right dwell corner | any | entity AxHotCornerTopRightEntity |
| `value` | AX.Keyboard.axHotCornerTopRight.title to update on AX.Keyboard.axHotCornerTopRight.title | string | enum: `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8` |

### Get Triple-press modifier to set Hover Text activation lock

`com.apple.systempreferences.AxHoverTextActivationLockModeEntity` · key `settings_get_triple_press_modifier_to_set_hover_text_activation_lock`
  
Output: Triple-press modifier to set Hover Text activation lock `com.apple.systempreferences.AxHoverTextActivationLockModeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | triple-press modifier to set hover text activation lock | string | enum: `Library` |

### Update AX.HoverText.axHoverTextActivationLockMode.title

`com.apple.systempreferences.AxHoverTextActivationLockModeEntity-UpdatableEntity` · key `settings_update_ax_hover_text_ax_hover_text_activation_lock_mode_title`
  
Triple-press modifier to set Hover Text activation lock
  
Output: Triple-press modifier to set Hover Text activation lock `com.apple.systempreferences.AxHoverTextActivationLockModeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Triple-press modifier to set Hover Text activation lock | any | entity AxHoverTextActivationLockModeEntity |
| `value` | AX.HoverText.axHoverTextActivationLockMode.title to update on AX.HoverText.axHoverTextActivationLockMode.title | bool | bool |

### Get Enable Hover Text

`com.apple.systempreferences.AxHoverTextEnableEntity` · key `settings_get_enable_hover_text`
  
Output: Enable Hover Text `com.apple.systempreferences.AxHoverTextEnableEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | enable hover text | string | enum: `Library` |

### Update AX.HoverText.axHoverTextEnable.title

`com.apple.systempreferences.AxHoverTextEnableEntity-UpdatableEntity` · key `settings_update_ax_hover_text_ax_hover_text_enable_title`
  
Hover Text
  
Output: Enable Hover Text `com.apple.systempreferences.AxHoverTextEnableEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Enable Hover Text | any | entity AxHoverTextEnableEntity |
| `value` | AX.HoverText.axHoverTextEnable.title to update on AX.HoverText.axHoverTextEnable.title | bool | bool |

### Get Hover Text modifier

`com.apple.systempreferences.AxHoverTextModifierEntity` · key `settings_get_hover_text_modifier`
  
Output: Hover Text modifier `com.apple.systempreferences.AxHoverTextModifierEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | hover text modifier | string | enum: `Library` |

### Update AX.HoverText.axHoverTextModifier.title

`com.apple.systempreferences.AxHoverTextModifierEntity-UpdatableEntity` · key `settings_update_ax_hover_text_ax_hover_text_modifier_title`
  
Hover Text modifier
  
Output: Hover Text modifier `com.apple.systempreferences.AxHoverTextModifierEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Hover Text modifier | any | entity AxHoverTextModifierEntity |
| `value` | AX.HoverText.axHoverTextModifier.title to update on AX.HoverText.axHoverTextModifier.title | string | enum: `0`, `1`, `2` |

### Get Hover Typing

`com.apple.systempreferences.AxHoverTypingEnableEntity` · key `settings_get_hover_typing`
  
Output: Hover Typing `com.apple.systempreferences.AxHoverTypingEnableEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | hover typing | string | enum: `Library` |

### Update AX.HoverText.axHoverTypingEnable.title

`com.apple.systempreferences.AxHoverTypingEnableEntity-UpdatableEntity` · key `settings_update_ax_hover_text_ax_hover_typing_enable_title`
  
Hover Typing
  
Output: Hover Typing `com.apple.systempreferences.AxHoverTypingEnableEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Hover Typing | any | entity AxHoverTypingEnableEntity |
| `value` | AX.HoverText.axHoverTypingEnable.title to update on AX.HoverText.axHoverTypingEnable.title | bool | bool |

### Get Hover Typing location

`com.apple.systempreferences.AxHoverTypingEntryLocationEntity` · key `settings_get_hover_typing_location`
  
Output: Hover Typing location `com.apple.systempreferences.AxHoverTypingEntryLocationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | hover typing location | string | enum: `Library` |

### Update AX.HoverText.axHoverTypingEntryLocation.title

`com.apple.systempreferences.AxHoverTypingEntryLocationEntity-UpdatableEntity` · key `settings_update_ax_hover_text_ax_hover_typing_entry_location_title`
  
Hover Typing location
  
Output: Hover Typing location `com.apple.systempreferences.AxHoverTypingEntryLocationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Hover Typing location | any | entity AxHoverTypingEntryLocationEntity |
| `value` | AX.HoverText.axHoverTypingEntryLocation.title to update on AX.HoverText.axHoverTypingEntryLocation.title | string | enum: `0`, `1`, `2`, `3`, `4`, `5` |

### Get Ignore built-in trackpad when mouse or wireless trackpad is present

`com.apple.systempreferences.AxIgnoreTrackpadEntity` · key `settings_get_ignore_built_in_trackpad_when_mouse_or_wireless_trackpad_is_present`
  
Output: Ignore built-in trackpad when mouse or wireless trackpad is present `com.apple.systempreferences.AxIgnoreTrackpadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | ignore built-in trackpad when mouse or wireless trackpad is present | string | enum: `Library` |

### Update AX.PointerControl.axIgnoreTrackpad.title

`com.apple.systempreferences.AxIgnoreTrackpadEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_ignore_trackpad_title`
  
Ignore built-in trackpad when mouse or wireless trackpad is present
  
Output: Ignore built-in trackpad when mouse or wireless trackpad is present `com.apple.systempreferences.AxIgnoreTrackpadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Ignore built-in trackpad when mouse or wireless trackpad is present | any | entity AxIgnoreTrackpadEntity |
| `value` | AX.PointerControl.axIgnoreTrackpad.title to update on AX.PointerControl.axIgnoreTrackpad.title | bool | bool |

### Get Increase Contrast

`com.apple.systempreferences.AxIncreaseContrastEntity` · key `settings_get_increase_contrast`
  
Output: Increase Contrast `com.apple.systempreferences.AxIncreaseContrastEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | increase contrast | string | enum: `Library` |

### Update AX.Display.axIncreaseContrast.title

`com.apple.systempreferences.AxIncreaseContrastEntity-UpdatableEntity` · key `settings_update_ax_display_ax_increase_contrast_title`
  
Increase contrast
  
Output: Increase Contrast `com.apple.systempreferences.AxIncreaseContrastEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Increase Contrast | any | entity AxIncreaseContrastEntity |
| `value` | AX.Display.axIncreaseContrast.title to update on AX.Display.axIncreaseContrast.title | bool | bool |

### Get Invert Colors

`com.apple.systempreferences.AxInvertColorEntity` · key `settings_get_invert_colors`
  
Output: Invert Colors `com.apple.systempreferences.AxInvertColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | invert colors | string | enum: `Library` |

### Update AX.Display.axInvertColor.title

`com.apple.systempreferences.AxInvertColorEntity-UpdatableEntity` · key `settings_update_ax_display_ax_invert_color_title`
  
Invert colors
  
Output: Invert Colors `com.apple.systempreferences.AxInvertColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Invert Colors | any | entity AxInvertColorEntity |
| `value` | AX.Display.axInvertColor.title to update on AX.Display.axInvertColor.title | bool | bool |

### Get Smart Invert

`com.apple.systempreferences.AxInvertColorModeEntity` · key `settings_get_smart_invert`
  
Output: Smart Invert `com.apple.systempreferences.AxInvertColorModeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | smart invert | string | enum: `Library` |

### Update AX.Display.axInvertColorMode.title

`com.apple.systempreferences.AxInvertColorModeEntity-UpdatableEntity` · key `settings_update_ax_display_ax_invert_color_mode_title`
  
Smart Invert
  
Output: Smart Invert `com.apple.systempreferences.AxInvertColorModeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Smart Invert | any | entity AxInvertColorModeEntity |
| `value` | AX.Display.axInvertColorMode.title to update on AX.Display.axInvertColorMode.title | bool | bool |

### Get Appearance (Keyboard)

`com.apple.systempreferences.AxKbAppearanceTypeEntity` · key `settings_get_appearance_keyboard`
  
Output: Appearance (Keyboard) `com.apple.systempreferences.AxKbAppearanceTypeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | appearance (keyboard) | string | enum: `Library` |

### Update AX.Keyboard.axKbAppearanceType.title

`com.apple.systempreferences.AxKbAppearanceTypeEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_kb_appearance_type_title`
  
Accessibility keyboard appearance
  
Output: Appearance (Keyboard) `com.apple.systempreferences.AxKbAppearanceTypeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Appearance (Keyboard) | any | entity AxKbAppearanceTypeEntity |
| `value` | AX.Keyboard.axKbAppearanceType.title to update on AX.Keyboard.axKbAppearanceType.title | string | enum: `0`, `1` |

### Get Capitalize sentences automatically when using the Accessibility Keyboard

`com.apple.systempreferences.AxKbAutoCapitalizationEntity` · key `settings_get_capitalize_sentences_automatically_when_using_the_accessibility_keyboard`
  
Output: Capitalize sentences automatically when using the Accessibility Keyboard `com.apple.systempreferences.AxKbAutoCapitalizationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | capitalize sentences automatically when using the accessibility keyboard | string | enum: `Library` |

### Update AX.Keyboard.axKbAutoCapitalization.title

`com.apple.systempreferences.AxKbAutoCapitalizationEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_kb_auto_capitalization_title`
  
Capitalize sentences automatically when using the Accessibility Keyboard
  
Output: Capitalize sentences automatically when using the Accessibility Keyboard `com.apple.systempreferences.AxKbAutoCapitalizationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Capitalize sentences automatically when using the Accessibility Keyboard | any | entity AxKbAutoCapitalizationEntity |
| `value` | AX.Keyboard.axKbAutoCapitalization.title to update on AX.Keyboard.axKbAutoCapitalization.title | bool | bool |

### Get Insert and remove spaces automatically when using the Accessibility Keyboard

`com.apple.systempreferences.AxKbAutoSpacingEntity` · key `settings_get_insert_and_remove_spaces_automatically_when_using_the_accessibility_keyboard`
  
Output: Insert and remove spaces automatically when using the Accessibility Keyboard `com.apple.systempreferences.AxKbAutoSpacingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | insert and remove spaces automatically when using the accessibility keyboard | string | enum: `Library` |

### Update AX.Keyboard.axKbAutoSpacing.title

`com.apple.systempreferences.AxKbAutoSpacingEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_kb_auto_spacing_title`
  
Insert and remove spaces automatically when using the Accessibility Keyboard
  
Output: Insert and remove spaces automatically when using the Accessibility Keyboard `com.apple.systempreferences.AxKbAutoSpacingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Insert and remove spaces automatically when using the Accessibility Keyboard | any | entity AxKbAutoSpacingEntity |
| `value` | AX.Keyboard.axKbAutoSpacing.title to update on AX.Keyboard.axKbAutoSpacing.title | bool | bool |

### Get Fade accessibility keyboard after inactivity

`com.apple.systempreferences.AxKbHideEntity` · key `settings_get_fade_accessibility_keyboard_after_inactivity`
  
Output: Fade accessibility keyboard after inactivity `com.apple.systempreferences.AxKbHideEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | fade accessibility keyboard after inactivity | string | enum: `Library` |

### Update AX.Keyboard.axKbHide.title

`com.apple.systempreferences.AxKbHideEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_kb_hide_title`
  
Fade accessibility keyboard after inactivity
  
Output: Fade accessibility keyboard after inactivity `com.apple.systempreferences.AxKbHideEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Fade accessibility keyboard after inactivity | any | entity AxKbHideEntity |
| `value` | AX.Keyboard.axKbHide.title to update on AX.Keyboard.axKbHide.title | bool | bool |

### Get Keys should be entered on

`com.apple.systempreferences.AxKbKeyAcceptedMouseEntity` · key `settings_get_keys_should_be_entered_on`
  
Output: Keys should be entered on `com.apple.systempreferences.AxKbKeyAcceptedMouseEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | keys should be entered on | string | enum: `Library` |

### Update AX.Keyboard.axKbKeyAcceptedMouse.title

`com.apple.systempreferences.AxKbKeyAcceptedMouseEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_kb_key_accepted_mouse_title`
  
Accessibility keyboard keys accepted on
  
Output: Keys should be entered on `com.apple.systempreferences.AxKbKeyAcceptedMouseEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Keys should be entered on | any | entity AxKbKeyAcceptedMouseEntity |
| `value` | AX.Keyboard.axKbKeyAcceptedMouse.title to update on AX.Keyboard.axKbKeyAcceptedMouse.title | string | enum: `0`, `1` |

### Get Keys on accessibility keyboard can be activated with right-click

`com.apple.systempreferences.AxKbRightClickEntity` · key `settings_get_keys_on_accessibility_keyboard_can_be_activated_with_right_click`
  
Output: Keys on accessibility keyboard can be activated with right-click `com.apple.systempreferences.AxKbRightClickEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | keys on accessibility keyboard can be activated with right-click | string | enum: `Library` |

### Update AX.Keyboard.axKbRightClick.title

`com.apple.systempreferences.AxKbRightClickEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_kb_right_click_title`
  
Keys on accessibility keyboard can be activated with right-click
  
Output: Keys on accessibility keyboard can be activated with right-click `com.apple.systempreferences.AxKbRightClickEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Keys on accessibility keyboard can be activated with right-click | any | entity AxKbRightClickEntity |
| `value` | AX.Keyboard.axKbRightClick.title to update on AX.Keyboard.axKbRightClick.title | bool | bool |

### Get Accessibility keyboard sounds

`com.apple.systempreferences.AxKbUseClickSoundsEntity` · key `settings_get_accessibility_keyboard_sounds`
  
Output: Accessibility keyboard sounds `com.apple.systempreferences.AxKbUseClickSoundsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | accessibility keyboard sounds | string | enum: `Library` |

### Update AX.Keyboard.axKbUseClickSounds.title

`com.apple.systempreferences.AxKbUseClickSoundsEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_kb_use_click_sounds_title`
  
Accessibility keyboard sounds
  
Output: Accessibility keyboard sounds `com.apple.systempreferences.AxKbUseClickSoundsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Accessibility keyboard sounds | any | entity AxKbUseClickSoundsEntity |
| `value` | AX.Keyboard.axKbUseClickSounds.title to update on AX.Keyboard.axKbUseClickSounds.title | bool | bool |

### Get Show dwell actions in menu bar

`com.apple.systempreferences.AxMenubarDwellActionsEntity` · key `settings_get_show_dwell_actions_in_menu_bar`
  
Output: Show dwell actions in menu bar `com.apple.systempreferences.AxMenubarDwellActionsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show dwell actions in menu bar | string | enum: `Library` |

### Update AX.Keyboard.axMenubarDwellActions.title

`com.apple.systempreferences.AxMenubarDwellActionsEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_menubar_dwell_actions_title`
  
Show dwell actions in menu bar
  
Output: Show dwell actions in menu bar `com.apple.systempreferences.AxMenubarDwellActionsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show dwell actions in menu bar | any | entity AxMenubarDwellActionsEntity |
| `value` | AX.Keyboard.axMenubarDwellActions.title to update on AX.Keyboard.axMenubarDwellActions.title | bool | bool |

### Get Play stereo audio as mono

`com.apple.systempreferences.AxMonoAudioEntity` · key `settings_get_play_stereo_audio_as_mono`
  
Output: Play stereo audio as mono `com.apple.systempreferences.AxMonoAudioEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | play stereo audio as mono | string | enum: `Library` |

### Update AX.Audio.axMonoAudio.title

`com.apple.systempreferences.AxMonoAudioEntity-UpdatableEntity` · key `settings_update_ax_audio_ax_mono_audio_title`
  
Make the left and right speakers play the same content.
  
Output: Play stereo audio as mono `com.apple.systempreferences.AxMonoAudioEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Play stereo audio as mono | any | entity AxMonoAudioEntity |
| `value` | AX.Audio.axMonoAudio.title to update on AX.Audio.axMonoAudio.title | bool | bool |

### Get Vehicle Motion Cues

`com.apple.systempreferences.AxMotionCuesEnabledEntity` · key `settings_get_vehicle_motion_cues`
  
Output: Vehicle Motion Cues `com.apple.systempreferences.AxMotionCuesEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | vehicle motion cues | string | enum: `Library` |

### Update AX.Motion.axMotionCuesEnabled.title

`com.apple.systempreferences.AxMotionCuesEnabledEntity-UpdatableEntity` · key `settings_update_ax_motion_ax_motion_cues_enabled_title`
  
When turned On, the dots will display until you turn them Off.
  
Output: Vehicle Motion Cues `com.apple.systempreferences.AxMotionCuesEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Vehicle Motion Cues | any | entity AxMotionCuesEnabledEntity |
| `value` | AX.Motion.axMotionCuesEnabled.title to update on AX.Motion.axMotionCuesEnabled.title | bool | bool |

### Get Mouse Keys

`com.apple.systempreferences.AxMouseKeysEntity` · key `settings_get_mouse_keys`
  
Output: Mouse Keys `com.apple.systempreferences.AxMouseKeysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | mouse keys | string | enum: `Library` |

### Update AX.PointerControl.axMouseKeys.title

`com.apple.systempreferences.AxMouseKeysEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_mouse_keys_title`
  
Allows the pointer to be controlled using the keyboard keys or number pad.
  
Output: Mouse Keys `com.apple.systempreferences.AxMouseKeysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Mouse Keys | any | entity AxMouseKeysEntity |
| `value` | AX.PointerControl.axMouseKeys.title to update on AX.PointerControl.axMouseKeys.title | bool | bool |

### Get Ignore built-in trackpad when using Mouse Keys

`com.apple.systempreferences.AxMouseKeysIgnoreTrackpadEntity` · key `settings_get_ignore_built_in_trackpad_when_using_mouse_keys`
  
Output: Ignore built-in trackpad when using Mouse Keys `com.apple.systempreferences.AxMouseKeysIgnoreTrackpadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | ignore built-in trackpad when using mouse keys | string | enum: `Library` |

### Update AX.PointerControl.axMouseKeysIgnoreTrackpad.title

`com.apple.systempreferences.AxMouseKeysIgnoreTrackpadEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_mouse_keys_ignore_trackpad_title`
  
Ignore built-in trackpad when using Mouse Keys
  
Output: Ignore built-in trackpad when using Mouse Keys `com.apple.systempreferences.AxMouseKeysIgnoreTrackpadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Ignore built-in trackpad when using Mouse Keys | any | entity AxMouseKeysIgnoreTrackpadEntity |
| `value` | AX.PointerControl.axMouseKeysIgnoreTrackpad.title to update on AX.PointerControl.axMouseKeysIgnoreTrackpad.title | bool | bool |

### Get Press the Option key five times to toggle Mouse Keys

`com.apple.systempreferences.AxMouseKeysShortcutEntity` · key `settings_get_press_the_option_key_five_times_to_toggle_mouse_keys`
  
Output: Press the Option key five times to toggle Mouse Keys `com.apple.systempreferences.AxMouseKeysShortcutEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | press the option key five times to toggle mouse keys | string | enum: `Library` |

### Update AX.PointerControl.axMouseKeysShortcut.title

`com.apple.systempreferences.AxMouseKeysShortcutEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_mouse_keys_shortcut_title`
  
Press the Option key five times to toggle Mouse Keys
  
Output: Press the Option key five times to toggle Mouse Keys `com.apple.systempreferences.AxMouseKeysShortcutEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Press the Option key five times to toggle Mouse Keys | any | entity AxMouseKeysShortcutEntity |
| `value` | AX.PointerControl.axMouseKeysShortcut.title to update on AX.PointerControl.axMouseKeysShortcut.title | bool | bool |

### Get Use inertia when scrolling with mouse

`com.apple.systempreferences.AxMouseScrollBehaviorEntity` · key `settings_get_use_inertia_when_scrolling_with_mouse`
  
Output: Use inertia when scrolling with mouse `com.apple.systempreferences.AxMouseScrollBehaviorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | use inertia when scrolling with mouse | string | enum: `Library` |

### Update AX.PointerControl.axMouseScrollBehavior.title

`com.apple.systempreferences.AxMouseScrollBehaviorEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_mouse_scroll_behavior_title`
  
Use inertia when scrolling with mouse
  
Output: Use inertia when scrolling with mouse `com.apple.systempreferences.AxMouseScrollBehaviorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Use inertia when scrolling with mouse | any | entity AxMouseScrollBehaviorEntity |
| `value` | AX.PointerControl.axMouseScrollBehavior.title to update on AX.PointerControl.axMouseScrollBehavior.title | bool | bool |

### Get Use mouse for scrolling

`com.apple.systempreferences.AxMouseScrollEntity` · key `settings_get_use_mouse_for_scrolling`
  
Output: Use mouse for scrolling `com.apple.systempreferences.AxMouseScrollEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | use mouse for scrolling | string | enum: `Library` |

### Update AX.PointerControl.axMouseScroll.title

`com.apple.systempreferences.AxMouseScrollEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_mouse_scroll_title`
  
Use mouse for scrolling
  
Output: Use mouse for scrolling `com.apple.systempreferences.AxMouseScrollEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Use mouse for scrolling | any | entity AxMouseScrollEntity |
| `value` | AX.PointerControl.axMouseScroll.title to update on AX.PointerControl.axMouseScroll.title | bool | bool |

### Get Prefer horizontal text

`com.apple.systempreferences.AxPrefersHorizTextLayoutEntity` · key `settings_get_prefer_horizontal_text`
  
Output: Prefer horizontal text `com.apple.systempreferences.AxPrefersHorizTextLayoutEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | prefer horizontal text | string | enum: `Library` |

### Update AX.Display.axPrefersHorizTextLayout.title

`com.apple.systempreferences.AxPrefersHorizTextLayoutEntity-UpdatableEntity` · key `settings_update_ax_display_ax_prefers_horiz_text_layout_title`
  
Prefer horizontal text
  
Output: Prefer horizontal text `com.apple.systempreferences.AxPrefersHorizTextLayoutEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Prefer horizontal text | any | entity AxPrefersHorizTextLayoutEntity |
| `value` | AX.Display.axPrefersHorizTextLayout.title to update on AX.Display.axPrefersHorizTextLayout.title | bool | bool |

### Get Prefer non-blinking cursor

`com.apple.systempreferences.AxReduceCursorModulationEntity` · key `settings_get_prefer_non_blinking_cursor`
  
Output: Prefer non-blinking cursor `com.apple.systempreferences.AxReduceCursorModulationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | prefer non-blinking cursor | string | enum: `Library` |

### Update AX.Motion.axReduceCursorModulation.title

`com.apple.systempreferences.AxReduceCursorModulationEntity-UpdatableEntity` · key `settings_update_ax_motion_ax_reduce_cursor_modulation_title`
  
Prefer non-blinking cursor
  
Output: Prefer non-blinking cursor `com.apple.systempreferences.AxReduceCursorModulationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Prefer non-blinking cursor | any | entity AxReduceCursorModulationEntity |
| `value` | AX.Motion.axReduceCursorModulation.title to update on AX.Motion.axReduceCursorModulation.title | bool | bool |

### Get Reduce Motion

`com.apple.systempreferences.AxReduceMotionEntity` · key `settings_get_reduce_motion`
  
Output: Reduce Motion `com.apple.systempreferences.AxReduceMotionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | reduce motion | string | enum: `Library` |

### Update AX.Motion.axReduceMotion.title

`com.apple.systempreferences.AxReduceMotionEntity-UpdatableEntity` · key `settings_update_ax_motion_ax_reduce_motion_title`
  
Reduce motion
  
Output: Reduce Motion `com.apple.systempreferences.AxReduceMotionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Reduce Motion | any | entity AxReduceMotionEntity |
| `value` | AX.Motion.axReduceMotion.title to update on AX.Motion.axReduceMotion.title | bool | bool |

### Get Reduce Transparency

`com.apple.systempreferences.AxReduceTransparencyEntity` · key `settings_get_reduce_transparency`
  
Output: Reduce Transparency `com.apple.systempreferences.AxReduceTransparencyEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | reduce transparency | string | enum: `Library` |

### Update AX.Display.axReduceTransparency.title

`com.apple.systempreferences.AxReduceTransparencyEntity-UpdatableEntity` · key `settings_update_ax_display_ax_reduce_transparency_title`
  
Reduce transparency
  
Output: Reduce Transparency `com.apple.systempreferences.AxReduceTransparencyEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Reduce Transparency | any | entity AxReduceTransparencyEntity |
| `value` | AX.Display.axReduceTransparency.title to update on AX.Display.axReduceTransparency.title | bool | bool |

### Get Enable RTT

`com.apple.systempreferences.AxRttEnableEntity` · key `settings_get_enable_rtt`
  
Output: Enable RTT `com.apple.systempreferences.AxRttEnableEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | enable rtt | string | enum: `Library` |

### Update AX.RTT.axRttEnable.title

`com.apple.systempreferences.AxRttEnableEntity-UpdatableEntity` · key `settings_update_ax_rtt_ax_rtt_enable_title`
  
RTT
  
Output: Enable RTT `com.apple.systempreferences.AxRttEnableEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Enable RTT | any | entity AxRttEnableEntity |
| `value` | AX.RTT.axRttEnable.title to update on AX.RTT.axRttEnable.title | bool | bool |

### Get Send RTT immediately

`com.apple.systempreferences.AxRttSendImmediatelyEntity` · key `settings_get_send_rtt_immediately`
  
Output: Send RTT immediately `com.apple.systempreferences.AxRttSendImmediatelyEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | send rtt immediately | string | enum: `Library` |

### Update AX.RTT.axRttSendImmediately.title

`com.apple.systempreferences.AxRttSendImmediatelyEntity-UpdatableEntity` · key `settings_update_ax_rtt_ax_rtt_send_immediately_title`
  
Send RTT immediately
  
Output: Send RTT immediately `com.apple.systempreferences.AxRttSendImmediatelyEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Send RTT immediately | any | entity AxRttSendImmediatelyEntity |
| `value` | AX.RTT.axRttSendImmediately.title to update on AX.RTT.axRttSendImmediately.title | bool | bool |

### Get Show Borders

`com.apple.systempreferences.AxShowBordersEntity` · key `settings_get_show_borders`
  
Output: Show Borders `com.apple.systempreferences.AxShowBordersEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show borders | string | enum: `Library` |

### Update AX.Display.axShowBorders.title

`com.apple.systempreferences.AxShowBordersEntity-UpdatableEntity` · key `settings_update_ax_display_ax_show_borders_title`
  
Show borders
  
Output: Show Borders `com.apple.systempreferences.AxShowBordersEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show Borders | any | entity AxShowBordersEntity |
| `value` | AX.Display.axShowBorders.title to update on AX.Display.axShowBorders.title | bool | bool |

### Get Show toolbar button shapes

`com.apple.systempreferences.AxShowToolbarButtonShapesEntity` · key `settings_get_show_toolbar_button_shapes`
  
Output: Show toolbar button shapes `com.apple.systempreferences.AxShowToolbarButtonShapesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show toolbar button shapes | string | enum: `Library` |

### Update AX.Display.axShowToolbarButtonShapes.title

`com.apple.systempreferences.AxShowToolbarButtonShapesEntity-UpdatableEntity` · key `settings_update_ax_display_ax_show_toolbar_button_shapes_title`
  
Show toolbar button shapes
  
Output: Show toolbar button shapes `com.apple.systempreferences.AxShowToolbarButtonShapesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show toolbar button shapes | any | entity AxShowToolbarButtonShapesEntity |
| `value` | AX.Display.axShowToolbarButtonShapes.title to update on AX.Display.axShowToolbarButtonShapes.title | bool | bool |

### Get Show window title icons

`com.apple.systempreferences.AxShowWindowTitlebarIconsEntity` · key `settings_get_show_window_title_icons`
  
Output: Show window title icons `com.apple.systempreferences.AxShowWindowTitlebarIconsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show window title icons | string | enum: `Library` |

### Update AX.Display.axShowWindowTitlebarIcons.title

`com.apple.systempreferences.AxShowWindowTitlebarIconsEntity-UpdatableEntity` · key `settings_update_ax_display_ax_show_window_titlebar_icons_title`
  
Show window title icons
  
Output: Show window title icons `com.apple.systempreferences.AxShowWindowTitlebarIconsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show window title icons | any | entity AxShowWindowTitlebarIconsEntity |
| `value` | AX.Display.axShowWindowTitlebarIcons.title to update on AX.Display.axShowWindowTitlebarIcons.title | bool | bool |

### Get Listen for atypical speech

`com.apple.systempreferences.AxSiriAtypicalSpeechEntity` · key `settings_get_listen_for_atypical_speech`
  
Output: Listen for atypical speech `com.apple.systempreferences.AxSiriAtypicalSpeechEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | listen for atypical speech | string | enum: `Library` |

### Update AX.Siri.axSiriAtypicalSpeech.title

`com.apple.systempreferences.AxSiriAtypicalSpeechEntity-UpdatableEntity` · key `settings_update_ax_siri_ax_siri_atypical_speech_title`
  
Allow Siri to listen for atypical speech
  
Output: Listen for atypical speech `com.apple.systempreferences.AxSiriAtypicalSpeechEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Listen for atypical speech | any | entity AxSiriAtypicalSpeechEntity |
| `value` | AX.Siri.axSiriAtypicalSpeech.title to update on AX.Siri.axSiriAtypicalSpeech.title | bool | bool |

### Get Slow Keys

`com.apple.systempreferences.AxSlowKeysEntity` · key `settings_get_slow_keys`
  
Output: Slow Keys `com.apple.systempreferences.AxSlowKeysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | slow keys | string | enum: `Library` |

### Update AX.Keyboard.axSlowKeys.title

`com.apple.systempreferences.AxSlowKeysEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_slow_keys_title`
  
Slow Keys adjusts the amount of time between when a key is pressed and when it is activated.
  
Output: Slow Keys `com.apple.systempreferences.AxSlowKeysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Slow Keys | any | entity AxSlowKeysEntity |
| `value` | AX.Keyboard.axSlowKeys.title to update on AX.Keyboard.axSlowKeys.title | bool | bool |

### Get Slow keys sounds

`com.apple.systempreferences.AxSlowKeysSoundEntity` · key `settings_get_slow_keys_sounds`
  
Output: Slow keys sounds `com.apple.systempreferences.AxSlowKeysSoundEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | slow keys sounds | string | enum: `Library` |

### Update AX.Keyboard.axSlowKeysSound.title

`com.apple.systempreferences.AxSlowKeysSoundEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_slow_keys_sound_title`
  
Slow keys sounds
  
Output: Slow keys sounds `com.apple.systempreferences.AxSlowKeysSoundEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Slow keys sounds | any | entity AxSlowKeysSoundEntity |
| `value` | AX.Keyboard.axSlowKeysSound.title to update on AX.Keyboard.axSlowKeysSound.title | bool | bool |

### Get Spatial audio follows head movements

`com.apple.systempreferences.AxSpatialAudioFollowsHeadEntity` · key `settings_get_spatial_audio_follows_head_movements`
  
Output: Spatial audio follows head movements `com.apple.systempreferences.AxSpatialAudioFollowsHeadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | spatial audio follows head movements | string | enum: `Library` |

### Update AX.Audio.axSpatialAudioFollowsHead.title

`com.apple.systempreferences.AxSpatialAudioFollowsHeadEntity-UpdatableEntity` · key `settings_update_ax_audio_ax_spatial_audio_follows_head_title`
  
Spatial audio follows head movements
  
Output: Spatial audio follows head movements `com.apple.systempreferences.AxSpatialAudioFollowsHeadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Spatial audio follows head movements | any | entity AxSpatialAudioFollowsHeadEntity |
| `value` | AX.Audio.axSpatialAudioFollowsHead.title to update on AX.Audio.axSpatialAudioFollowsHead.title | bool | bool |

### Get Speak announcements

`com.apple.systempreferences.AxSpokenAlertsEntity` · key `settings_get_speak_announcements`
  
Output: Speak announcements `com.apple.systempreferences.AxSpokenAlertsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | speak announcements | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenAlerts.title

`com.apple.systempreferences.AxSpokenAlertsEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_alerts_title`
  
Speak announcements
  
Output: Speak announcements `com.apple.systempreferences.AxSpokenAlertsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Speak announcements | any | entity AxSpokenAlertsEntity |
| `value` | AX.SpokenContent.axSpokenAlerts.title to update on AX.SpokenContent.axSpokenAlerts.title | bool | bool |

### Get Detect languages for Spoken Content

`com.apple.systempreferences.AxSpokenDetectLanguagesEntity` · key `settings_get_detect_languages_for_spoken_content`
  
Output: Detect languages for Spoken Content `com.apple.systempreferences.AxSpokenDetectLanguagesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | detect languages for spoken content | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenDetectLanguages.title

`com.apple.systempreferences.AxSpokenDetectLanguagesEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_detect_languages_title`
  
Detect languages for Spoken Content
  
Output: Detect languages for Spoken Content `com.apple.systempreferences.AxSpokenDetectLanguagesEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Detect languages for Spoken Content | any | entity AxSpokenDetectLanguagesEntity |
| `value` | AX.SpokenContent.axSpokenDetectLanguages.title to update on AX.SpokenContent.axSpokenDetectLanguages.title | bool | bool |

### Get Speak selection

`com.apple.systempreferences.AxSpokenHotkeyEntity` · key `settings_get_speak_selection`
  
Output: Speak selection `com.apple.systempreferences.AxSpokenHotkeyEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | speak selection | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenHotkey.title

`com.apple.systempreferences.AxSpokenHotkeyEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_hotkey_title`
  
Speak selection
  
Output: Speak selection `com.apple.systempreferences.AxSpokenHotkeyEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Speak selection | any | entity AxSpokenHotkeyEntity |
| `value` | AX.SpokenContent.axSpokenHotkey.title to update on AX.SpokenContent.axSpokenHotkey.title | bool | bool |

### Get Speak item under the pointer

`com.apple.systempreferences.AxSpokenPointerElementEntity` · key `settings_get_speak_item_under_the_pointer`
  
Output: Speak item under the pointer `com.apple.systempreferences.AxSpokenPointerElementEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | speak item under the pointer | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenPointerElement.title

`com.apple.systempreferences.AxSpokenPointerElementEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_pointer_element_title`
  
Speak item under the pointer
  
Output: Speak item under the pointer `com.apple.systempreferences.AxSpokenPointerElementEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Speak item under the pointer | any | entity AxSpokenPointerElementEntity |
| `value` | AX.SpokenContent.axSpokenPointerElement.title to update on AX.SpokenContent.axSpokenPointerElement.title | bool | bool |

### Get Speak item under the pointer (mode)

`com.apple.systempreferences.AxSpokenPointerElementModeEntity` · key `settings_get_speak_item_under_the_pointer_mode`
  
Output: Speak item under the pointer (mode) `com.apple.systempreferences.AxSpokenPointerElementModeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | speak item under the pointer (mode) | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenPointerElementMode.title

`com.apple.systempreferences.AxSpokenPointerElementModeEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_pointer_element_mode_title`
  
Speak item under the pointer
  
Output: Speak item under the pointer (mode) `com.apple.systempreferences.AxSpokenPointerElementModeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Speak item under the pointer (mode) | any | entity AxSpokenPointerElementModeEntity |
| `value` | AX.SpokenContent.axSpokenPointerElementMode.title to update on AX.SpokenContent.axSpokenPointerElementMode.title | string | enum: `0`, `1` |

### Get Speak item under the pointer verbosity

`com.apple.systempreferences.AxSpokenPointerElementVerbosityEntity` · key `settings_get_speak_item_under_the_pointer_verbosity`
  
Output: Speak item under the pointer verbosity `com.apple.systempreferences.AxSpokenPointerElementVerbosityEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | speak item under the pointer verbosity | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenPointerElementVerbosity.title

`com.apple.systempreferences.AxSpokenPointerElementVerbosityEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_pointer_element_verbosity_title`
  
Speak item under the pointer verbosity
  
Output: Speak item under the pointer verbosity `com.apple.systempreferences.AxSpokenPointerElementVerbosityEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Speak item under the pointer verbosity | any | entity AxSpokenPointerElementVerbosityEntity |
| `value` | AX.SpokenContent.axSpokenPointerElementVerbosity.title to update on AX.SpokenContent.axSpokenPointerElementVerbosity.title | string | enum: `0`, `1`, `2` |

### Get Pronunciations for Spoken Content

`com.apple.systempreferences.AxSpokenPronunciationsEntity` · key `settings_get_pronunciations_for_spoken_content`
  
Output: Pronunciations for Spoken Content `com.apple.systempreferences.AxSpokenPronunciationsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | pronunciations for spoken content | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenPronunciations.title

`com.apple.systempreferences.AxSpokenPronunciationsEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_pronunciations_title`
  
Pronunciations for Spoken Content
  
Output: Pronunciations for Spoken Content `com.apple.systempreferences.AxSpokenPronunciationsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Pronunciations for Spoken Content | any | entity AxSpokenPronunciationsEntity |
| `value` | AX.SpokenContent.axSpokenPronunciations.title to update on AX.SpokenContent.axSpokenPronunciations.title | bool | bool |

### Get Speak selection highlight

`com.apple.systempreferences.AxSpokenSelectionHighlightContentEntity` · key `settings_get_speak_selection_highlight`
  
Output: Speak selection highlight `com.apple.systempreferences.AxSpokenSelectionHighlightContentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | speak selection highlight | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenSelectionHighlightContent.title

`com.apple.systempreferences.AxSpokenSelectionHighlightContentEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_selection_highlight_content_title`
  
Speak selection highlight
  
Output: Speak selection highlight `com.apple.systempreferences.AxSpokenSelectionHighlightContentEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Speak selection highlight | any | entity AxSpokenSelectionHighlightContentEntity |
| `value` | AX.SpokenContent.axSpokenSelectionHighlightContent.title to update on AX.SpokenContent.axSpokenSelectionHighlightContent.title | string | enum: `0`, `1`, `2`, `3` |

### Get Speak selection sentence highlight color

`com.apple.systempreferences.AxSpokenSelectionHighlightSentenceColorEntity` · key `settings_get_speak_selection_sentence_highlight_color`
  
Output: Speak selection sentence highlight color `com.apple.systempreferences.AxSpokenSelectionHighlightSentenceColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | speak selection sentence highlight color | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenSelectionHighlightSentenceColor.title

`com.apple.systempreferences.AxSpokenSelectionHighlightSentenceColorEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_selection_highlight_sentence_color_title`
  
Speak selection sentence highlight color
  
Output: Speak selection sentence highlight color `com.apple.systempreferences.AxSpokenSelectionHighlightSentenceColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Speak selection sentence highlight color | any | entity AxSpokenSelectionHighlightSentenceColorEntity |
| `value` | AX.SpokenContent.axSpokenSelectionHighlightSentenceColor.title to update on AX.SpokenContent.axSpokenSelectionHighlightSentenceColor.title | string | enum: `0`, `1`, `2`, `3`, `4`, `5` |

### Get Speak selection highlight style for sentences

`com.apple.systempreferences.AxSpokenSelectionHighlightSentenceStyleEntity` · key `settings_get_speak_selection_highlight_style_for_sentences`
  
Output: Speak selection highlight style for sentences `com.apple.systempreferences.AxSpokenSelectionHighlightSentenceStyleEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | speak selection highlight style for sentences | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenSelectionHighlightSentenceStyle.title

`com.apple.systempreferences.AxSpokenSelectionHighlightSentenceStyleEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_selection_highlight_sentence_style_title`
  
Speak selection highlight style for sentences
  
Output: Speak selection highlight style for sentences `com.apple.systempreferences.AxSpokenSelectionHighlightSentenceStyleEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Speak selection highlight style for sentences | any | entity AxSpokenSelectionHighlightSentenceStyleEntity |
| `value` | AX.SpokenContent.axSpokenSelectionHighlightSentenceStyle.title to update on AX.SpokenContent.axSpokenSelectionHighlightSentenceStyle.title | string | enum: `0`, `1` |

### Get Speak selection word highlight color

`com.apple.systempreferences.AxSpokenSelectionHighlightWordColorEntity` · key `settings_get_speak_selection_word_highlight_color`
  
Output: Speak selection word highlight color `com.apple.systempreferences.AxSpokenSelectionHighlightWordColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | speak selection word highlight color | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenSelectionHighlightWordColor.title

`com.apple.systempreferences.AxSpokenSelectionHighlightWordColorEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_selection_highlight_word_color_title`
  
Speak selection word highlight color
  
Output: Speak selection word highlight color `com.apple.systempreferences.AxSpokenSelectionHighlightWordColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Speak selection word highlight color | any | entity AxSpokenSelectionHighlightWordColorEntity |
| `value` | AX.SpokenContent.axSpokenSelectionHighlightWordColor.title to update on AX.SpokenContent.axSpokenSelectionHighlightWordColor.title | string | enum: `0`, `1`, `2`, `3`, `4`, `5` |

### Get Show speak selection controller

`com.apple.systempreferences.AxSpokenSelectionShowControllerEntity` · key `settings_get_show_speak_selection_controller`
  
Output: Show speak selection controller `com.apple.systempreferences.AxSpokenSelectionShowControllerEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show speak selection controller | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenSelectionShowController.title

`com.apple.systempreferences.AxSpokenSelectionShowControllerEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_selection_show_controller_title`
  
Show speak selection controller
  
Output: Show speak selection controller `com.apple.systempreferences.AxSpokenSelectionShowControllerEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show speak selection controller | any | entity AxSpokenSelectionShowControllerEntity |
| `value` | AX.SpokenContent.axSpokenSelectionShowController.title to update on AX.SpokenContent.axSpokenSelectionShowController.title | string | enum: `0`, `1`, `2` |

### Get Echo characters for typing feedback

`com.apple.systempreferences.AxSpokenTypingEchoCharsEntity` · key `settings_get_echo_characters_for_typing_feedback`
  
Output: Echo characters for typing feedback `com.apple.systempreferences.AxSpokenTypingEchoCharsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | echo characters for typing feedback | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenTypingEchoChars.title

`com.apple.systempreferences.AxSpokenTypingEchoCharsEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_typing_echo_chars_title`
  
Echo characters for typing feedback
  
Output: Echo characters for typing feedback `com.apple.systempreferences.AxSpokenTypingEchoCharsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Echo characters for typing feedback | any | entity AxSpokenTypingEchoCharsEntity |
| `value` | AX.SpokenContent.axSpokenTypingEchoChars.title to update on AX.SpokenContent.axSpokenTypingEchoChars.title | bool | bool |

### Get Speak typing feedback

`com.apple.systempreferences.AxSpokenTypingEchoEntity` · key `settings_get_speak_typing_feedback`
  
Output: Speak typing feedback `com.apple.systempreferences.AxSpokenTypingEchoEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | speak typing feedback | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenTypingEcho.title

`com.apple.systempreferences.AxSpokenTypingEchoEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_typing_echo_title`
  
Speak typing feedback
  
Output: Speak typing feedback `com.apple.systempreferences.AxSpokenTypingEchoEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Speak typing feedback | any | entity AxSpokenTypingEchoEntity |
| `value` | AX.SpokenContent.axSpokenTypingEcho.title to update on AX.SpokenContent.axSpokenTypingEcho.title | bool | bool |

### Get Echo modifier keys for typing feedback

`com.apple.systempreferences.AxSpokenTypingEchoModifierKeysEntity` · key `settings_get_echo_modifier_keys_for_typing_feedback`
  
Output: Echo modifier keys for typing feedback `com.apple.systempreferences.AxSpokenTypingEchoModifierKeysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | echo modifier keys for typing feedback | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenTypingEchoModifierKeys.title

`com.apple.systempreferences.AxSpokenTypingEchoModifierKeysEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_typing_echo_modifier_keys_title`
  
Echo modifier keys for typing feedback
  
Output: Echo modifier keys for typing feedback `com.apple.systempreferences.AxSpokenTypingEchoModifierKeysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Echo modifier keys for typing feedback | any | entity AxSpokenTypingEchoModifierKeysEntity |
| `value` | AX.SpokenContent.axSpokenTypingEchoModifierKeys.title to update on AX.SpokenContent.axSpokenTypingEchoModifierKeys.title | bool | bool |

### Get Echo selection changes for typing feedback

`com.apple.systempreferences.AxSpokenTypingEchoSelectionEntity` · key `settings_get_echo_selection_changes_for_typing_feedback`
  
Output: Echo selection changes for typing feedback `com.apple.systempreferences.AxSpokenTypingEchoSelectionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | echo selection changes for typing feedback | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenTypingEchoSelection.title

`com.apple.systempreferences.AxSpokenTypingEchoSelectionEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_typing_echo_selection_title`
  
Echo selection changes for typing feedback
  
Output: Echo selection changes for typing feedback `com.apple.systempreferences.AxSpokenTypingEchoSelectionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Echo selection changes for typing feedback | any | entity AxSpokenTypingEchoSelectionEntity |
| `value` | AX.SpokenContent.axSpokenTypingEchoSelection.title to update on AX.SpokenContent.axSpokenTypingEchoSelection.title | bool | bool |

### Get Echo words for typing feedback

`com.apple.systempreferences.AxSpokenTypingEchoWordsEntity` · key `settings_get_echo_words_for_typing_feedback`
  
Output: Echo words for typing feedback `com.apple.systempreferences.AxSpokenTypingEchoWordsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | echo words for typing feedback | string | enum: `Library` |

### Update AX.SpokenContent.axSpokenTypingEchoWords.title

`com.apple.systempreferences.AxSpokenTypingEchoWordsEntity-UpdatableEntity` · key `settings_update_ax_spoken_content_ax_spoken_typing_echo_words_title`
  
Echo words for typing feedback
  
Output: Echo words for typing feedback `com.apple.systempreferences.AxSpokenTypingEchoWordsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Echo words for typing feedback | any | entity AxSpokenTypingEchoWordsEntity |
| `value` | AX.SpokenContent.axSpokenTypingEchoWords.title to update on AX.SpokenContent.axSpokenTypingEchoWords.title | bool | bool |

### Get Spring-loading

`com.apple.systempreferences.AxSpringLoadingEntity` · key `settings_get_spring_loading`
  
Output: Spring-loading `com.apple.systempreferences.AxSpringLoadingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | spring-loading | string | enum: `Library` |

### Update AX.PointerControl.axSpringLoading.title

`com.apple.systempreferences.AxSpringLoadingEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_spring_loading_title`
  
Spring-loading
  
Output: Spring-loading `com.apple.systempreferences.AxSpringLoadingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Spring-loading | any | entity AxSpringLoadingEntity |
| `value` | AX.PointerControl.axSpringLoading.title to update on AX.PointerControl.axSpringLoading.title | bool | bool |

### Get Beep when a modifier key is set with Sticky Keys

`com.apple.systempreferences.AxStickyKeysBeepEntity` · key `settings_get_beep_when_a_modifier_key_is_set_with_sticky_keys`
  
Output: Beep when a modifier key is set with Sticky Keys `com.apple.systempreferences.AxStickyKeysBeepEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | beep when a modifier key is set with sticky keys | string | enum: `Library` |

### Update AX.Keyboard.axStickyKeysBeep.title

`com.apple.systempreferences.AxStickyKeysBeepEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_sticky_keys_beep_title`
  
Beep when a modifier key is set with Sticky Keys
  
Output: Beep when a modifier key is set with Sticky Keys `com.apple.systempreferences.AxStickyKeysBeepEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Beep when a modifier key is set with Sticky Keys | any | entity AxStickyKeysBeepEntity |
| `value` | AX.Keyboard.axStickyKeysBeep.title to update on AX.Keyboard.axStickyKeysBeep.title | bool | bool |

### Get Display Sticky Keys on screen

`com.apple.systempreferences.AxStickyKeysDisplayEntity` · key `settings_get_display_sticky_keys_on_screen`
  
Output: Display Sticky Keys on screen `com.apple.systempreferences.AxStickyKeysDisplayEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | display sticky keys on screen | string | enum: `Library` |

### Update AX.Keyboard.axStickyKeysDisplay.title

`com.apple.systempreferences.AxStickyKeysDisplayEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_sticky_keys_display_title`
  
Display Sticky Keys on screen
  
Output: Display Sticky Keys on screen `com.apple.systempreferences.AxStickyKeysDisplayEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Display Sticky Keys on screen | any | entity AxStickyKeysDisplayEntity |
| `value` | AX.Keyboard.axStickyKeysDisplay.title to update on AX.Keyboard.axStickyKeysDisplay.title | bool | bool |

### Get Sticky keys display location

`com.apple.systempreferences.AxStickyKeysDisplayLocationEntity` · key `settings_get_sticky_keys_display_location`
  
Output: Sticky keys display location `com.apple.systempreferences.AxStickyKeysDisplayLocationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | sticky keys display location | string | enum: `Library` |

### Update AX.Keyboard.axStickyKeysDisplayLocation.title

`com.apple.systempreferences.AxStickyKeysDisplayLocationEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_sticky_keys_display_location_title`
  
Sticky keys display location
  
Output: Sticky keys display location `com.apple.systempreferences.AxStickyKeysDisplayLocationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Sticky keys display location | any | entity AxStickyKeysDisplayLocationEntity |
| `value` | AX.Keyboard.axStickyKeysDisplayLocation.title to update on AX.Keyboard.axStickyKeysDisplayLocation.title | string | enum: `0`, `1`, `2`, `3` |

### Get Sticky Keys

`com.apple.systempreferences.AxStickyKeysEntity` · key `settings_get_sticky_keys`
  
Output: Sticky Keys `com.apple.systempreferences.AxStickyKeysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | sticky keys | string | enum: `Library` |

### Update AX.Keyboard.axStickyKeys.title

`com.apple.systempreferences.AxStickyKeysEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_sticky_keys_title`
  
Sticky Keys allows modifier keys to be set without having to hold the key down.
  
Output: Sticky Keys `com.apple.systempreferences.AxStickyKeysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Sticky Keys | any | entity AxStickyKeysEntity |
| `value` | AX.Keyboard.axStickyKeys.title to update on AX.Keyboard.axStickyKeys.title | bool | bool |

### Get Press the Shift key five times to toggle Sticky Keys

`com.apple.systempreferences.AxStickyKeysShortcutEntity` · key `settings_get_press_the_shift_key_five_times_to_toggle_sticky_keys`
  
Output: Press the Shift key five times to toggle Sticky Keys `com.apple.systempreferences.AxStickyKeysShortcutEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | press the shift key five times to toggle sticky keys | string | enum: `Library` |

### Update AX.Keyboard.axStickyKeysShortcut.title

`com.apple.systempreferences.AxStickyKeysShortcutEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_sticky_keys_shortcut_title`
  
Press the Shift key five times to toggle Sticky Keys
  
Output: Press the Shift key five times to toggle Sticky Keys `com.apple.systempreferences.AxStickyKeysShortcutEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Press the Shift key five times to toggle Sticky Keys | any | entity AxStickyKeysShortcutEntity |
| `value` | AX.Keyboard.axStickyKeysShortcut.title to update on AX.Keyboard.axStickyKeysShortcut.title | bool | bool |

### Get Capitalize sentences automatically when using Switch Control

`com.apple.systempreferences.AxSwitchAutoCapitalizationEntity` · key `settings_get_capitalize_sentences_automatically_when_using_switch_control`
  
Output: Capitalize sentences automatically when using Switch Control `com.apple.systempreferences.AxSwitchAutoCapitalizationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | capitalize sentences automatically when using switch control | string | enum: `Library` |

### Update AX.SwitchControl.axSwitchAutoCapitalization.title

`com.apple.systempreferences.AxSwitchAutoCapitalizationEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_switch_auto_capitalization_title`
  
Capitalize sentences automatically when using Switch Control
  
Output: Capitalize sentences automatically when using Switch Control `com.apple.systempreferences.AxSwitchAutoCapitalizationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Capitalize sentences automatically when using Switch Control | any | entity AxSwitchAutoCapitalizationEntity |
| `value` | AX.SwitchControl.axSwitchAutoCapitalization.title to update on AX.SwitchControl.axSwitchAutoCapitalization.title | bool | bool |

### Get Insert and remove spaces automatically when using the Switch Control

`com.apple.systempreferences.AxSwitchAutoSpacingEntity` · key `settings_get_insert_and_remove_spaces_automatically_when_using_the_switch_control`
  
Output: Insert and remove spaces automatically when using the Switch Control `com.apple.systempreferences.AxSwitchAutoSpacingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | insert and remove spaces automatically when using the switch control | string | enum: `Library` |

### Update AX.SwitchControl.axSwitchAutoSpacing.title

`com.apple.systempreferences.AxSwitchAutoSpacingEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_switch_auto_spacing_title`
  
Insert and remove spaces automatically when using the Switch Control
  
Output: Insert and remove spaces automatically when using the Switch Control `com.apple.systempreferences.AxSwitchAutoSpacingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Insert and remove spaces automatically when using the Switch Control | any | entity AxSwitchAutoSpacingEntity |
| `value` | AX.SwitchControl.axSwitchAutoSpacing.title to update on AX.SwitchControl.axSwitchAutoSpacing.title | bool | bool |

### Get Switch Control auto scanning

`com.apple.systempreferences.AxSwitchAutoscanEntity` · key `settings_get_switch_control_auto_scanning`
  
Output: Switch Control auto scanning `com.apple.systempreferences.AxSwitchAutoscanEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | switch control auto scanning | string | enum: `Library` |

### Update AX.SwitchControl.axSwitchAutoscan.title

`com.apple.systempreferences.AxSwitchAutoscanEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_switch_autoscan_title`
  
Switch Control auto scanning
  
Output: Switch Control auto scanning `com.apple.systempreferences.AxSwitchAutoscanEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Switch Control auto scanning | any | entity AxSwitchAutoscanEntity |
| `value` | AX.SwitchControl.axSwitchAutoscan.title to update on AX.SwitchControl.axSwitchAutoscan.title | bool | bool |

### Get Switch Control appearance

`com.apple.systempreferences.AxSwitchControlAppearanceTypeEntity` · key `settings_get_switch_control_appearance`
  
Output: Switch Control appearance `com.apple.systempreferences.AxSwitchControlAppearanceTypeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | switch control appearance | string | enum: `Library` |

### Update AX.SwitchControl.axSwitchControlAppearanceType.title

`com.apple.systempreferences.AxSwitchControlAppearanceTypeEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_switch_control_appearance_type_title`
  
Switch Control appearance
  
Output: Switch Control appearance `com.apple.systempreferences.AxSwitchControlAppearanceTypeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Switch Control appearance | any | entity AxSwitchControlAppearanceTypeEntity |
| `value` | AX.SwitchControl.axSwitchControlAppearanceType.title to update on AX.SwitchControl.axSwitchControlAppearanceType.title | string | enum: `0`, `1` |

### Get Switch Control cursor size

`com.apple.systempreferences.AxSwitchCursorSizeEntity` · key `settings_get_switch_control_cursor_size`
  
Output: Switch Control cursor size `com.apple.systempreferences.AxSwitchCursorSizeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | switch control cursor size | string | enum: `Library` |

### Update AX.SwitchControl.axSwitchCursorSize.title

`com.apple.systempreferences.AxSwitchCursorSizeEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_switch_cursor_size_title`
  
Switch Control cursor size
  
Output: Switch Control cursor size `com.apple.systempreferences.AxSwitchCursorSizeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Switch Control cursor size | any | entity AxSwitchCursorSizeEntity |
| `value` | AX.SwitchControl.axSwitchCursorSize.title to update on AX.SwitchControl.axSwitchCursorSize.title | string | enum: `0`, `1`, `2` |

### Get Fade Switch Control overlay after inactivity

`com.apple.systempreferences.AxSwitchHideAfterDelayEntity` · key `settings_get_fade_switch_control_overlay_after_inactivity`
  
Output: Fade Switch Control overlay after inactivity `com.apple.systempreferences.AxSwitchHideAfterDelayEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | fade switch control overlay after inactivity | string | enum: `Library` |

### Update AX.SwitchControl.axSwitchHideAfterDelay.title

`com.apple.systempreferences.AxSwitchHideAfterDelayEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_switch_hide_after_delay_title`
  
Fade Switch Control overlay after inactivity
  
Output: Fade Switch Control overlay after inactivity `com.apple.systempreferences.AxSwitchHideAfterDelayEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Fade Switch Control overlay after inactivity | any | entity AxSwitchHideAfterDelayEntity |
| `value` | AX.SwitchControl.axSwitchHideAfterDelay.title to update on AX.SwitchControl.axSwitchHideAfterDelay.title | bool | bool |

### Get Show current text in the Switch Control keyboard panel

`com.apple.systempreferences.AxSwitchHoverTextToolbarEntity` · key `settings_get_show_current_text_in_the_switch_control_keyboard_panel`
  
Output: Show current text in the Switch Control keyboard panel `com.apple.systempreferences.AxSwitchHoverTextToolbarEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show current text in the switch control keyboard panel | string | enum: `Library` |

### Update AX.SwitchControl.axSwitchHoverTextToolbar.title

`com.apple.systempreferences.AxSwitchHoverTextToolbarEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_switch_hover_text_toolbar_title`
  
Show current text in the Switch Control keyboard panel
  
Output: Show current text in the Switch Control keyboard panel `com.apple.systempreferences.AxSwitchHoverTextToolbarEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show current text in the Switch Control keyboard panel | any | entity AxSwitchHoverTextToolbarEntity |
| `value` | AX.SwitchControl.axSwitchHoverTextToolbar.title to update on AX.SwitchControl.axSwitchHoverTextToolbar.title | bool | bool |

### Get Switch control reverse cursor direction after hitting edge

`com.apple.systempreferences.AxSwitchMouseCursorEdgeEntity` · key `settings_get_switch_control_reverse_cursor_direction_after_hitting_edge`
  
Output: Switch control reverse cursor direction after hitting edge `com.apple.systempreferences.AxSwitchMouseCursorEdgeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | switch control reverse cursor direction after hitting edge | string | enum: `Library` |

### Update AX.SwitchControl.axSwitchMouseCursorEdge.title

`com.apple.systempreferences.AxSwitchMouseCursorEdgeEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_switch_mouse_cursor_edge_title`
  
Switch control reverse cursor direction after hitting edge
  
Output: Switch control reverse cursor direction after hitting edge `com.apple.systempreferences.AxSwitchMouseCursorEdgeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Switch control reverse cursor direction after hitting edge | any | entity AxSwitchMouseCursorEdgeEntity |
| `value` | AX.SwitchControl.axSwitchMouseCursorEdge.title to update on AX.SwitchControl.axSwitchMouseCursorEdge.title | bool | bool |

### Get Pointer precision

`com.apple.systempreferences.AxSwitchMouseMoveStyleEntity` · key `settings_get_pointer_precision`
  
Output: Pointer precision `com.apple.systempreferences.AxSwitchMouseMoveStyleEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | pointer precision | string | enum: `Library` |

### Update AX.SwitchControl.axSwitchMouseMoveStyle.title

`com.apple.systempreferences.AxSwitchMouseMoveStyleEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_switch_mouse_move_style_title`
  
Pointer precision
  
Output: Pointer precision `com.apple.systempreferences.AxSwitchMouseMoveStyleEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Pointer precision | any | entity AxSwitchMouseMoveStyleEntity |
| `value` | AX.SwitchControl.axSwitchMouseMoveStyle.title to update on AX.SwitchControl.axSwitchMouseMoveStyle.title | string | enum: `0`, `1` |

### Get While navigating

`com.apple.systempreferences.AxSwitchNavFeedbackEntity` · key `settings_get_while_navigating`
  
Output: While navigating `com.apple.systempreferences.AxSwitchNavFeedbackEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | while navigating | string | enum: `Library` |

### Update AX.SwitchControl.axSwitchNavFeedback.title

`com.apple.systempreferences.AxSwitchNavFeedbackEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_switch_nav_feedback_title`
  
While navigating
  
Output: While navigating `com.apple.systempreferences.AxSwitchNavFeedbackEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | While navigating | any | entity AxSwitchNavFeedbackEntity |
| `value` | AX.SwitchControl.axSwitchNavFeedback.title to update on AX.SwitchControl.axSwitchNavFeedback.title | string | enum: `0`, `1`, `2`, `3` |

### Get Switch Control resume auto scanning after selection

`com.apple.systempreferences.AxSwitchResumeAutoScanningEntity` · key `settings_get_switch_control_resume_auto_scanning_after_selection`
  
Output: Switch Control resume auto scanning after selection `com.apple.systempreferences.AxSwitchResumeAutoScanningEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | switch control resume auto scanning after selection | string | enum: `Library` |

### Update AX.SwitchControl.axSwitchResumeAutoScanning.title

`com.apple.systempreferences.AxSwitchResumeAutoScanningEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_switch_resume_auto_scanning_title`
  
Switch Control resume auto scanning after selection
  
Output: Switch Control resume auto scanning after selection `com.apple.systempreferences.AxSwitchResumeAutoScanningEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Switch Control resume auto scanning after selection | any | entity AxSwitchResumeAutoScanningEntity |
| `value` | AX.SwitchControl.axSwitchResumeAutoScanning.title to update on AX.SwitchControl.axSwitchResumeAutoScanning.title | bool | bool |

### Get Restart action position

`com.apple.systempreferences.AxSwitchScanRestartEntity` · key `settings_get_restart_action_position`
  
Output: Restart action position `com.apple.systempreferences.AxSwitchScanRestartEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | restart action position | string | enum: `Library` |

### Update AX.SwitchControl.axSwitchScanRestart.title

`com.apple.systempreferences.AxSwitchScanRestartEntity-UpdatableEntity` · key `settings_update_ax_switch_control_ax_switch_scan_restart_title`
  
Restart action position
  
Output: Restart action position `com.apple.systempreferences.AxSwitchScanRestartEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Restart action position | any | entity AxSwitchScanRestartEntity |
| `value` | AX.SwitchControl.axSwitchScanRestart.title to update on AX.SwitchControl.axSwitchScanRestart.title | string | enum: `0`, `1`, `2` |

### Get Live Captions

`com.apple.systempreferences.AxSystemTranscriptionEnabledEntity` · key `settings_get_live_captions`
  
Output: Live Captions `com.apple.systempreferences.AxSystemTranscriptionEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | live captions | string | enum: `Library` |

### Update AX.LiveCaptions.axSystemTranscriptionEnabled.title

`com.apple.systempreferences.AxSystemTranscriptionEnabledEntity-UpdatableEntity` · key `settings_update_ax_live_captions_ax_system_transcription_enabled_title`
  
Live Captions
  
Output: Live Captions `com.apple.systempreferences.AxSystemTranscriptionEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Live Captions | any | entity AxSystemTranscriptionEnabledEntity |
| `value` | AX.LiveCaptions.axSystemTranscriptionEnabled.title to update on AX.LiveCaptions.axSystemTranscriptionEnabled.title | bool | bool |

### Get Touch Bar zoom

`com.apple.systempreferences.AxTouchBarZoomEnableEntity` · key `settings_get_touch_bar_zoom`
  
Output: Touch Bar zoom `com.apple.systempreferences.AxTouchBarZoomEnableEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | touch bar zoom | string | enum: `Library` |

### Update AX.Zoom.axTouchBarZoomEnable.title

`com.apple.systempreferences.AxTouchBarZoomEnableEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_touch_bar_zoom_enable_title`
  
Touch Bar zoom
  
Output: Touch Bar zoom `com.apple.systempreferences.AxTouchBarZoomEnableEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Touch Bar zoom | any | entity AxTouchBarZoomEnableEntity |
| `value` | AX.Zoom.axTouchBarZoomEnable.title to update on AX.Zoom.axTouchBarZoomEnable.title | bool | bool |

### Get Use inertia when scrolling with trackpad

`com.apple.systempreferences.AxTrackpadScrollBehaviorEntity` · key `settings_get_use_inertia_when_scrolling_with_trackpad`
  
Output: Use inertia when scrolling with trackpad `com.apple.systempreferences.AxTrackpadScrollBehaviorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | use inertia when scrolling with trackpad | string | enum: `Library` |

### Update AX.PointerControl.axTrackpadScrollBehavior.title

`com.apple.systempreferences.AxTrackpadScrollBehaviorEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_trackpad_scroll_behavior_title`
  
Use inertia when scrolling with trackpad
  
Output: Use inertia when scrolling with trackpad `com.apple.systempreferences.AxTrackpadScrollBehaviorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Use inertia when scrolling with trackpad | any | entity AxTrackpadScrollBehaviorEntity |
| `value` | AX.PointerControl.axTrackpadScrollBehavior.title to update on AX.PointerControl.axTrackpadScrollBehavior.title | bool | bool |

### Get Use trackpad for scrolling

`com.apple.systempreferences.AxTrackpadScrollEntity` · key `settings_get_use_trackpad_for_scrolling`
  
Output: Use trackpad for scrolling `com.apple.systempreferences.AxTrackpadScrollEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | use trackpad for scrolling | string | enum: `Library` |

### Update AX.PointerControl.axTrackpadScroll.title

`com.apple.systempreferences.AxTrackpadScrollEntity-UpdatableEntity` · key `settings_update_ax_pointer_control_ax_trackpad_scroll_title`
  
Use trackpad for scrolling
  
Output: Use trackpad for scrolling `com.apple.systempreferences.AxTrackpadScrollEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Use trackpad for scrolling | any | entity AxTrackpadScrollEntity |
| `value` | AX.PointerControl.axTrackpadScroll.title to update on AX.PointerControl.axTrackpadScroll.title | bool | bool |

### Get Type to Siri

`com.apple.systempreferences.AxTypeToSiriEnabledEntity` · key `settings_get_type_to_siri`
  
Output: Type to Siri `com.apple.systempreferences.AxTypeToSiriEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | type to siri | string | enum: `Library` |

### Update AX.Siri.axTypeToSiriEnabled.title

`com.apple.systempreferences.AxTypeToSiriEnabledEntity-UpdatableEntity` · key `settings_update_ax_siri_ax_type_to_siri_enabled_title`
  
Turn on or off typing requests to Siri instead of speaking them
  
Output: Type to Siri `com.apple.systempreferences.AxTypeToSiriEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Type to Siri | any | entity AxTypeToSiriEnabledEntity |
| `value` | AX.Siri.axTypeToSiriEnabled.title to update on AX.Siri.axTypeToSiriEnabled.title | bool | bool |

### Get Play audio descriptions when available

`com.apple.systempreferences.AxVideoDescriptionEntity` · key `settings_get_play_audio_descriptions_when_available`
  
Output: Play audio descriptions when available `com.apple.systempreferences.AxVideoDescriptionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | play audio descriptions when available | string | enum: `Library` |

### Update AX.AudioDescriptions.axVideoDescription.title

`com.apple.systempreferences.AxVideoDescriptionEntity-UpdatableEntity` · key `settings_update_ax_audio_descriptions_ax_video_description_title`
  
Play audio descriptions when available
  
Output: Play audio descriptions when available `com.apple.systempreferences.AxVideoDescriptionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Play audio descriptions when available | any | entity AxVideoDescriptionEntity |
| `value` | AX.AudioDescriptions.axVideoDescription.title to update on AX.AudioDescriptions.axVideoDescription.title | bool | bool |

### Get Accessibility Keyboard

`com.apple.systempreferences.AxVirtualKeyboardEntity` · key `settings_get_accessibility_keyboard`
  
Output: Accessibility Keyboard `com.apple.systempreferences.AxVirtualKeyboardEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | accessibility keyboard | string | enum: `Library` |

### Update AX.Keyboard.axVirtualKeyboard.title

`com.apple.systempreferences.AxVirtualKeyboardEntity-UpdatableEntity` · key `settings_update_ax_keyboard_ax_virtual_keyboard_title`
  
The Accessibility Keyboard lets you type and interact with macOS without using a hardware keyboard
  
Output: Accessibility Keyboard `com.apple.systempreferences.AxVirtualKeyboardEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Accessibility Keyboard | any | entity AxVirtualKeyboardEntity |
| `value` | AX.Keyboard.axVirtualKeyboard.title to update on AX.Keyboard.axVirtualKeyboard.title | bool | bool |

### Get Overlay

`com.apple.systempreferences.AxVoiceControlOverlayEntity` · key `settings_get_overlay`
  
Output: Overlay `com.apple.systempreferences.AxVoiceControlOverlayEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | overlay | string | enum: `Library` |

### Update AX.VoiceControl.axVoiceControlOverlay.title

`com.apple.systempreferences.AxVoiceControlOverlayEntity-UpdatableEntity` · key `settings_update_ax_voice_control_ax_voice_control_overlay_title`
  
Overlay
  
Output: Overlay `com.apple.systempreferences.AxVoiceControlOverlayEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Overlay | any | entity AxVoiceControlOverlayEntity |
| `value` | AX.VoiceControl.axVoiceControlOverlay.title to update on AX.VoiceControl.axVoiceControlOverlay.title | string | enum: `0`, `1`, `2`, `3` |

### Get Fade Voice Control overlay after inactivity

`com.apple.systempreferences.AxVoiceControlOverlayFadingEnabledEntity` · key `settings_get_fade_voice_control_overlay_after_inactivity`
  
Output: Fade Voice Control overlay after inactivity `com.apple.systempreferences.AxVoiceControlOverlayFadingEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | fade voice control overlay after inactivity | string | enum: `Library` |

### Update AX.VoiceControl.axVoiceControlOverlayFadingEnabled.title

`com.apple.systempreferences.AxVoiceControlOverlayFadingEnabledEntity-UpdatableEntity` · key `settings_update_ax_voice_control_ax_voice_control_overlay_fading_enabled_title`
  
Fade Voice Control overlay after inactivity
  
Output: Fade Voice Control overlay after inactivity `com.apple.systempreferences.AxVoiceControlOverlayFadingEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Fade Voice Control overlay after inactivity | any | entity AxVoiceControlOverlayFadingEnabledEntity |
| `value` | AX.VoiceControl.axVoiceControlOverlayFadingEnabled.title to update on AX.VoiceControl.axVoiceControlOverlayFadingEnabled.title | bool | bool |

### Get Voice Control command recognized sound

`com.apple.systempreferences.AxVoiceControlPlaySoundEnabledEntity` · key `settings_get_voice_control_command_recognized_sound`
  
Output: Voice Control command recognized sound `com.apple.systempreferences.AxVoiceControlPlaySoundEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | voice control command recognized sound | string | enum: `Library` |

### Update AX.VoiceControl.axVoiceControlPlaySoundEnabled.title

`com.apple.systempreferences.AxVoiceControlPlaySoundEnabledEntity-UpdatableEntity` · key `settings_update_ax_voice_control_ax_voice_control_play_sound_enabled_title`
  
Play a sound when a Voice Control command is recognized
  
Output: Voice Control command recognized sound `com.apple.systempreferences.AxVoiceControlPlaySoundEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Voice Control command recognized sound | any | entity AxVoiceControlPlaySoundEnabledEntity |
| `value` | AX.VoiceControl.axVoiceControlPlaySoundEnabled.title to update on AX.VoiceControl.axVoiceControlPlaySoundEnabled.title | bool | bool |

### Get Voice Control show hints

`com.apple.systempreferences.AxVoiceControlShowHintsEnabledEntity` · key `settings_get_voice_control_show_hints`
  
Output: Voice Control show hints `com.apple.systempreferences.AxVoiceControlShowHintsEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | voice control show hints | string | enum: `Library` |

### Update AX.VoiceControl.axVoiceControlShowHintsEnabled.title

`com.apple.systempreferences.AxVoiceControlShowHintsEnabledEntity-UpdatableEntity` · key `settings_update_ax_voice_control_ax_voice_control_show_hints_enabled_title`
  
Voice Control show hints
  
Output: Voice Control show hints `com.apple.systempreferences.AxVoiceControlShowHintsEnabledEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Voice Control show hints | any | entity AxVoiceControlShowHintsEnabledEntity |
| `value` | AX.VoiceControl.axVoiceControlShowHintsEnabled.title to update on AX.VoiceControl.axVoiceControlShowHintsEnabled.title | bool | bool |

### Get Disable Universal Control while zoomed in

`com.apple.systempreferences.AxZoomDisableUniversalControlEntity` · key `settings_get_disable_universal_control_while_zoomed_in`
  
Output: Disable Universal Control while zoomed in `com.apple.systempreferences.AxZoomDisableUniversalControlEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | disable universal control while zoomed in | string | enum: `Library` |

### Update AX.Zoom.axZoomDisableUniversalControl.title

`com.apple.systempreferences.AxZoomDisableUniversalControlEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_disable_universal_control_title`
  
Disable Universal Control while zoomed in
  
Output: Disable Universal Control while zoomed in `com.apple.systempreferences.AxZoomDisableUniversalControlEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Disable Universal Control while zoomed in | any | entity AxZoomDisableUniversalControlEntity |
| `value` | AX.Zoom.axZoomDisableUniversalControl.title to update on AX.Zoom.axZoomDisableUniversalControl.title | bool | bool |

### Get Use scroll gesture with modifier keys to zoom

`com.apple.systempreferences.AxZoomEnableGestureEntity` · key `settings_get_use_scroll_gesture_with_modifier_keys_to_zoom`
  
Output: Use scroll gesture with modifier keys to zoom `com.apple.systempreferences.AxZoomEnableGestureEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | use scroll gesture with modifier keys to zoom | string | enum: `Library` |

### Update AX.Zoom.axZoomEnableGesture.title

`com.apple.systempreferences.AxZoomEnableGestureEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_enable_gesture_title`
  
Use scroll gesture with modifier keys to zoom
  
Output: Use scroll gesture with modifier keys to zoom `com.apple.systempreferences.AxZoomEnableGestureEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Use scroll gesture with modifier keys to zoom | any | entity AxZoomEnableGestureEntity |
| `value` | AX.Zoom.axZoomEnableGesture.title to update on AX.Zoom.axZoomEnableGesture.title | bool | bool |

### Get Zoom keyboard shortcuts

`com.apple.systempreferences.AxZoomEnableHotkeysEntity` · key `settings_get_zoom_keyboard_shortcuts`
  
Output: Zoom keyboard shortcuts `com.apple.systempreferences.AxZoomEnableHotkeysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom keyboard shortcuts | string | enum: `Library` |

### Update AX.Zoom.axZoomEnableHotkeys.title

`com.apple.systempreferences.AxZoomEnableHotkeysEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_enable_hotkeys_title`
  
Zoom keyboard shortcuts
  
Output: Zoom keyboard shortcuts `com.apple.systempreferences.AxZoomEnableHotkeysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom keyboard shortcuts | any | entity AxZoomEnableHotkeysEntity |
| `value` | AX.Zoom.axZoomEnableHotkeys.title to update on AX.Zoom.axZoomEnableHotkeys.title | bool | bool |

### Get Flash screen when notification banner appears outside zoom view

`com.apple.systempreferences.AxZoomFlashEntity` · key `settings_get_flash_screen_when_notification_banner_appears_outside_zoom_view`
  
Output: Flash screen when notification banner appears outside zoom view `com.apple.systempreferences.AxZoomFlashEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | flash screen when notification banner appears outside zoom view | string | enum: `Library` |

### Update AX.Zoom.axZoomFlash.title

`com.apple.systempreferences.AxZoomFlashEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_flash_title`
  
Flash screen when notification banner appears outside zoom view
  
Output: Flash screen when notification banner appears outside zoom view `com.apple.systempreferences.AxZoomFlashEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Flash screen when notification banner appears outside zoom view | any | entity AxZoomFlashEntity |
| `value` | AX.Zoom.axZoomFlash.title to update on AX.Zoom.axZoomFlash.title | bool | bool |

### Get Zoom keyboard focus movement amount

`com.apple.systempreferences.AxZoomFocusMovementEntity` · key `settings_get_zoom_keyboard_focus_movement_amount`
  
Output: Zoom keyboard focus movement amount `com.apple.systempreferences.AxZoomFocusMovementEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom keyboard focus movement amount | string | enum: `Library` |

### Update AX.Zoom.axZoomFocusMovement.title

`com.apple.systempreferences.AxZoomFocusMovementEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_focus_movement_title`
  
Zoom keyboard focus movement amount
  
Output: Zoom keyboard focus movement amount `com.apple.systempreferences.AxZoomFocusMovementEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom keyboard focus movement amount | any | entity AxZoomFocusMovementEntity |
| `value` | AX.Zoom.axZoomFocusMovement.title to update on AX.Zoom.axZoomFocusMovement.title | string | enum: `0`, `1` |

### Get Zoom keyboard focus movement style

`com.apple.systempreferences.AxZoomFollowFocusActivationEntity` · key `settings_get_zoom_keyboard_focus_movement_style`
  
Output: Zoom keyboard focus movement style `com.apple.systempreferences.AxZoomFollowFocusActivationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom keyboard focus movement style | string | enum: `Library` |

### Update AX.Zoom.axZoomFollowFocusActivation.title

`com.apple.systempreferences.AxZoomFollowFocusActivationEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_follow_focus_activation_title`
  
Move the zoomed screen image when keyboard focus moves to a specific location
  
Output: Zoom keyboard focus movement style `com.apple.systempreferences.AxZoomFollowFocusActivationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom keyboard focus movement style | any | entity AxZoomFollowFocusActivationEntity |
| `value` | AX.Zoom.axZoomFollowFocusActivation.title to update on AX.Zoom.axZoomFollowFocusActivation.title | string | enum: `0`, `1`, `2` |

### Get Zoom follow keyboard focus

`com.apple.systempreferences.AxZoomFollowFocusModeEntity` · key `settings_get_zoom_follow_keyboard_focus`
  
Output: Zoom follow keyboard focus `com.apple.systempreferences.AxZoomFollowFocusModeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom follow keyboard focus | string | enum: `Library` |

### Update AX.Zoom.axZoomFollowFocusMode.title

`com.apple.systempreferences.AxZoomFollowFocusModeEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_follow_focus_mode_title`
  
Zoom follow keyboard focus
  
Output: Zoom follow keyboard focus `com.apple.systempreferences.AxZoomFollowFocusModeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom follow keyboard focus | any | entity AxZoomFollowFocusModeEntity |
| `value` | AX.Zoom.axZoomFollowFocusMode.title to update on AX.Zoom.axZoomFollowFocusMode.title | string | enum: `0`, `1`, `2` |

### Get Zoom panning shortcut

`com.apple.systempreferences.AxZoomFreezePanningEntity` · key `settings_get_zoom_panning_shortcut`
  
Output: Zoom panning shortcut `com.apple.systempreferences.AxZoomFreezePanningEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom panning shortcut | string | enum: `Library` |

### Update AX.Zoom.axZoomFreezePanning.title

`com.apple.systempreferences.AxZoomFreezePanningEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_freeze_panning_title`
  
Zoom panning shortcut
  
Output: Zoom panning shortcut `com.apple.systempreferences.AxZoomFreezePanningEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom panning shortcut | any | entity AxZoomFreezePanningEntity |
| `value` | AX.Zoom.axZoomFreezePanning.title to update on AX.Zoom.axZoomFreezePanning.title | bool | bool |

### Get Zoom each display independently

`com.apple.systempreferences.AxZoomIndividualDisplaysEntity` · key `settings_get_zoom_each_display_independently`
  
Output: Zoom each display independently `com.apple.systempreferences.AxZoomIndividualDisplaysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom each display independently | string | enum: `Library` |

### Update AX.Zoom.axZoomIndividualDisplays.title

`com.apple.systempreferences.AxZoomIndividualDisplaysEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_individual_displays_title`
  
Zoom each display independently
  
Output: Zoom each display independently `com.apple.systempreferences.AxZoomIndividualDisplaysEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom each display independently | any | entity AxZoomIndividualDisplaysEntity |
| `value` | AX.Zoom.axZoomIndividualDisplays.title to update on AX.Zoom.axZoomIndividualDisplays.title | bool | bool |

### Get Invert colors when using picture-in-picture zoom

`com.apple.systempreferences.AxZoomInvertEntity` · key `settings_get_invert_colors_when_using_picture_in_picture_zoom`
  
Output: Invert colors when using picture-in-picture zoom `com.apple.systempreferences.AxZoomInvertEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | invert colors when using picture-in-picture zoom | string | enum: `Library` |

### Update AX.Zoom.axZoomInvert.title

`com.apple.systempreferences.AxZoomInvertEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_invert_title`
  
Invert colors when using picture-in-picture zoom
  
Output: Invert colors when using picture-in-picture zoom `com.apple.systempreferences.AxZoomInvertEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Invert colors when using picture-in-picture zoom | any | entity AxZoomInvertEntity |
| `value` | AX.Zoom.axZoomInvert.title to update on AX.Zoom.axZoomInvert.title | bool | bool |

### Get Keep picture-in-picture zoom window stationary

`com.apple.systempreferences.AxZoomKeepStationaryEntity` · key `settings_get_keep_picture_in_picture_zoom_window_stationary`
  
Output: Keep picture-in-picture zoom window stationary `com.apple.systempreferences.AxZoomKeepStationaryEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | keep picture-in-picture zoom window stationary | string | enum: `Library` |

### Update AX.Zoom.axZoomKeepStationary.title

`com.apple.systempreferences.AxZoomKeepStationaryEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_keep_stationary_title`
  
Keep picture-in-picture zoom window stationary
  
Output: Keep picture-in-picture zoom window stationary `com.apple.systempreferences.AxZoomKeepStationaryEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Keep picture-in-picture zoom window stationary | any | entity AxZoomKeepStationaryEntity |
| `value` | AX.Zoom.axZoomKeepStationary.title to update on AX.Zoom.axZoomKeepStationary.title | bool | bool |

### Get Zoom move cursor to next monitor shortcut

`com.apple.systempreferences.AxZoomMonitorSelectionEntity` · key `settings_get_zoom_move_cursor_to_next_monitor_shortcut`
  
Output: Zoom move cursor to next monitor shortcut `com.apple.systempreferences.AxZoomMonitorSelectionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom move cursor to next monitor shortcut | string | enum: `Library` |

### Update AX.Zoom.axZoomMonitorSelection.title

`com.apple.systempreferences.AxZoomMonitorSelectionEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_monitor_selection_title`
  
Zoom move cursor to next monitor shortcut
  
Output: Zoom move cursor to next monitor shortcut `com.apple.systempreferences.AxZoomMonitorSelectionEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom move cursor to next monitor shortcut | any | entity AxZoomMonitorSelectionEntity |
| `value` | AX.Zoom.axZoomMonitorSelection.title to update on AX.Zoom.axZoomMonitorSelection.title | bool | bool |

### Get Use trackpad gesture to move cursor between monitors when using zoom

`com.apple.systempreferences.AxZoomMonitorSelectionTrackpadEntity` · key `settings_get_use_trackpad_gesture_to_move_cursor_between_monitors_when_using_zoom`
  
Output: Use trackpad gesture to move cursor between monitors when using zoom `com.apple.systempreferences.AxZoomMonitorSelectionTrackpadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | use trackpad gesture to move cursor between monitors when using zoom | string | enum: `Library` |

### Update AX.Zoom.axZoomMonitorSelectionTrackpad.title

`com.apple.systempreferences.AxZoomMonitorSelectionTrackpadEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_monitor_selection_trackpad_title`
  
Use trackpad gesture to move cursor between monitors when using zoom
  
Output: Use trackpad gesture to move cursor between monitors when using zoom `com.apple.systempreferences.AxZoomMonitorSelectionTrackpadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Use trackpad gesture to move cursor between monitors when using zoom | any | entity AxZoomMonitorSelectionTrackpadEntity |
| `value` | AX.Zoom.axZoomMonitorSelectionTrackpad.title to update on AX.Zoom.axZoomMonitorSelectionTrackpad.title | string | enum: `0`, `1`, `2`, `3` |

### Get Zoom panning mode

`com.apple.systempreferences.AxZoomMoveEntity` · key `settings_get_zoom_panning_mode`
  
Output: Zoom panning mode `com.apple.systempreferences.AxZoomMoveEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom panning mode | string | enum: `Library` |

### Update AX.Zoom.axZoomMove.title

`com.apple.systempreferences.AxZoomMoveEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_move_title`
  
Zoom panning mode
  
Output: Zoom panning mode `com.apple.systempreferences.AxZoomMoveEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom panning mode | any | entity AxZoomMoveEntity |
| `value` | AX.Zoom.axZoomMove.title to update on AX.Zoom.axZoomMove.title | string | enum: `0`, `1`, `2` |

### Get Use keyboard shortcuts to adjust zoom window

`com.apple.systempreferences.AxZoomResizeShortcutsEntity` · key `settings_get_use_keyboard_shortcuts_to_adjust_zoom_window`
  
Output: Use keyboard shortcuts to adjust zoom window `com.apple.systempreferences.AxZoomResizeShortcutsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | use keyboard shortcuts to adjust zoom window | string | enum: `Library` |

### Update AX.Zoom.axZoomResizeShortcuts.title

`com.apple.systempreferences.AxZoomResizeShortcutsEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_resize_shortcuts_title`
  
Use keyboard shortcuts to adjust zoom window
  
Output: Use keyboard shortcuts to adjust zoom window `com.apple.systempreferences.AxZoomResizeShortcutsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Use keyboard shortcuts to adjust zoom window | any | entity AxZoomResizeShortcutsEntity |
| `value` | AX.Zoom.axZoomResizeShortcuts.title to update on AX.Zoom.axZoomResizeShortcuts.title | bool | bool |

### Get Restore zoom factor on startup

`com.apple.systempreferences.AxZoomRestoreEntity` · key `settings_get_restore_zoom_factor_on_startup`
  
Output: Restore zoom factor on startup `com.apple.systempreferences.AxZoomRestoreEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | restore zoom factor on startup | string | enum: `Library` |

### Update AX.Zoom.axZoomRestore.title

`com.apple.systempreferences.AxZoomRestoreEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_restore_title`
  
Restore zoom factor on startup
  
Output: Restore zoom factor on startup `com.apple.systempreferences.AxZoomRestoreEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Restore zoom factor on startup | any | entity AxZoomRestoreEntity |
| `value` | AX.Zoom.axZoomRestore.title to update on AX.Zoom.axZoomRestore.title | bool | bool |

### Get Show zoomed image while screen sharing

`com.apple.systempreferences.AxZoomScreenShareEntity` · key `settings_get_show_zoomed_image_while_screen_sharing`
  
Output: Show zoomed image while screen sharing `com.apple.systempreferences.AxZoomScreenShareEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show zoomed image while screen sharing | string | enum: `Library` |

### Update AX.Zoom.axZoomScreenShare.title

`com.apple.systempreferences.AxZoomScreenShareEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_screen_share_title`
  
While zoomed in and sharing your screen, show viewers the zoomed view rather than the unzoomed full display.
  
Output: Show zoomed image while screen sharing `com.apple.systempreferences.AxZoomScreenShareEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show zoomed image while screen sharing | any | entity AxZoomScreenShareEntity |
| `value` | AX.Zoom.axZoomScreenShare.title to update on AX.Zoom.axZoomScreenShare.title | bool | bool |

### Get Zoom smooth images

`com.apple.systempreferences.AxZoomSmoothEntity` · key `settings_get_zoom_smooth_images`
  
Output: Zoom smooth images `com.apple.systempreferences.AxZoomSmoothEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom smooth images | string | enum: `Library` |

### Update AX.Zoom.axZoomSmooth.title

`com.apple.systempreferences.AxZoomSmoothEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_smooth_title`
  
Zoom smooth images
  
Output: Zoom smooth images `com.apple.systempreferences.AxZoomSmoothEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom smooth images | any | entity AxZoomSmoothEntity |
| `value` | AX.Zoom.axZoomSmooth.title to update on AX.Zoom.axZoomSmooth.title | bool | bool |

### Get Zoom style

`com.apple.systempreferences.AxZoomStylePopupEntity` · key `settings_get_zoom_style`
  
Output: Zoom style `com.apple.systempreferences.AxZoomStylePopupEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom style | string | enum: `Library` |

### Update AX.Zoom.axZoomStylePopup.title

`com.apple.systempreferences.AxZoomStylePopupEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_style_popup_title`
  
Zoom style
  
Output: Zoom style `com.apple.systempreferences.AxZoomStylePopupEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom style | any | entity AxZoomStylePopupEntity |
| `value` | AX.Zoom.axZoomStylePopup.title to update on AX.Zoom.axZoomStylePopup.title | string | enum: `0`, `1`, `2` |

### Get Detach zoom from pointer shortcut

`com.apple.systempreferences.AxZoomTempDetachEntity` · key `settings_get_detach_zoom_from_pointer_shortcut`
  
Output: Detach zoom from pointer shortcut `com.apple.systempreferences.AxZoomTempDetachEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | detach zoom from pointer shortcut | string | enum: `Library` |

### Update AX.Zoom.axZoomTempDetach.title

`com.apple.systempreferences.AxZoomTempDetachEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_temp_detach_title`
  
Detach zoom from pointer shortcut
  
Output: Detach zoom from pointer shortcut `com.apple.systempreferences.AxZoomTempDetachEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Detach zoom from pointer shortcut | any | entity AxZoomTempDetachEntity |
| `value` | AX.Zoom.axZoomTempDetach.title to update on AX.Zoom.axZoomTempDetach.title | bool | bool |

### Get Zoom quick toggle shortcut

`com.apple.systempreferences.AxZoomTempToggleEntity` · key `settings_get_zoom_quick_toggle_shortcut`
  
Output: Zoom quick toggle shortcut `com.apple.systempreferences.AxZoomTempToggleEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom quick toggle shortcut | string | enum: `Library` |

### Update AX.Zoom.axZoomTempToggle.title

`com.apple.systempreferences.AxZoomTempToggleEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_temp_toggle_title`
  
Zoom quick toggle shortcut
  
Output: Zoom quick toggle shortcut `com.apple.systempreferences.AxZoomTempToggleEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom quick toggle shortcut | any | entity AxZoomTempToggleEntity |
| `value` | AX.Zoom.axZoomTempToggle.title to update on AX.Zoom.axZoomTempToggle.title | bool | bool |

### Get Toggle between full screen and picture-in-picture zoom shortcut

`com.apple.systempreferences.AxZoomToggleFsAndPipEntity` · key `settings_get_toggle_between_full_screen_and_picture_in_picture_zoom_shortcut`
  
Output: Toggle between full screen and picture-in-picture zoom shortcut `com.apple.systempreferences.AxZoomToggleFsAndPipEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | toggle between full screen and picture-in-picture zoom shortcut | string | enum: `Library` |

### Update AX.Zoom.axZoomToggleFsAndPip.title

`com.apple.systempreferences.AxZoomToggleFsAndPipEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_toggle_fs_and_pip_title`
  
Toggle between full screen and picture-in-picture zoom shortcut
  
Output: Toggle between full screen and picture-in-picture zoom shortcut `com.apple.systempreferences.AxZoomToggleFsAndPipEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Toggle between full screen and picture-in-picture zoom shortcut | any | entity AxZoomToggleFsAndPipEntity |
| `value` | AX.Zoom.axZoomToggleFsAndPip.title to update on AX.Zoom.axZoomToggleFsAndPip.title | bool | bool |

### Get Zoom trackpad gestures

`com.apple.systempreferences.AxZoomTrackpadEntity` · key `settings_get_zoom_trackpad_gestures`
  
Output: Zoom trackpad gestures `com.apple.systempreferences.AxZoomTrackpadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | zoom trackpad gestures | string | enum: `Library` |

### Update AX.Zoom.axZoomTrackpad.title

`com.apple.systempreferences.AxZoomTrackpadEntity-UpdatableEntity` · key `settings_update_ax_zoom_ax_zoom_trackpad_title`
  
Zoom trackpad gestures
  
Output: Zoom trackpad gestures `com.apple.systempreferences.AxZoomTrackpadEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Zoom trackpad gestures | any | entity AxZoomTrackpadEntity |
| `value` | AX.Zoom.axZoomTrackpad.title to update on AX.Zoom.axZoomTrackpad.title | bool | bool |

### Get Background Login Items

`com.apple.systempreferences.BackgroundLoginItemsIntent` · key `settings_get_background_login_items`
  
Background Login Items
  
Output: Background login items `com.apple.systempreferences.LoginItemEntity`

### Find Battery Health Settings

`com.apple.systempreferences.BatteryHealthPaneDynamicDeepLinks` · key `settings_find_battery_health_settings`
  
Output: Battery Health Settings `com.apple.systempreferences.BatteryHealthPaneDynamicDeepLinks`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | battery health settings | string | enum: `Library` |

### Find Battery Settings Options Pane

`com.apple.systempreferences.BatteryOptionsPaneDynamicDeepLinks` · key `settings_find_battery_settings_options_pane`
  
Output: Battery Settings Options Pane `com.apple.systempreferences.BatteryOptionsPaneDynamicDeepLinks`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | battery settings options pane | string | enum: `Library` |

### Find Battery Settings

`com.apple.systempreferences.BatterySettingsDeepLink` · key `com_apple_settings_find_battery_settings`
  
Output: Battery Settings `com.apple.systempreferences.BatterySettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | battery settings | string | enum: `Library` |

### Find Battery Settings

`com.apple.systempreferences.BatterySettingsPaneDynamicDeepLinks` · key `settings_find_battery_settings`
  
Output: Battery Settings `com.apple.systempreferences.BatterySettingsPaneDynamicDeepLinks`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | battery settings | string | enum: `Library` |

### Get Click in the scroll bar to

`com.apple.systempreferences.ClickScrollBarToEntity` · key `settings_get_click_in_the_scroll_bar_to`
  
Output: Click in the scroll bar to `com.apple.systempreferences.ClickScrollBarToEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | click in the scroll bar to | string | enum: `Library` |

### Update Click in the scroll bar to

`com.apple.systempreferences.ClickScrollBarToEntity-UpdatableEntity` · key `settings_update_click_in_the_scroll_bar_to`
  
Change the Click in the scroll bar to value of Click in the scroll bar to
  
Output: Click in the scroll bar to `com.apple.systempreferences.ClickScrollBarToEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Click in the scroll bar to | any | entity ClickScrollBarToEntity |
| `value` | Click in the scroll bar to to update on Click in the scroll bar to | string | enum: `0`, `1` |

### Get Computer Name

`com.apple.systempreferences.ComputerNameEntity` · key `settings_get_computer_name`
  
Output: Computer Name `com.apple.systempreferences.ComputerNameEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | computer name | string | enum: `Library` |

### Get the Current User

`com.apple.systempreferences.CurrentUserIntent` · key `settings_get_the_current_user`
  
Get info of the current user.
  
Output: The Current User `com.apple.systempreferences.AccountEntity`

### Get Current VPN

`com.apple.systempreferences.CurrentlyConnectedVPN` · key `settings_get_current_vpn`
  
Output: Current VPN `com.apple.systempreferences.CurrentlyConnectedVPN`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | current vpn | string | enum: `Library` |

### Update a Current VPN's Connected VPN

`com.apple.systempreferences.CurrentlyConnectedVPN-UpdatableEntity` · key `settings_update_a_current_vpn_s_connected_vpn`
  
Change the Connected VPN value of Current VPN
  
Output: Current VPN `com.apple.systempreferences.CurrentlyConnectedVPN`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Current VPN | any | entity CurrentlyConnectedVPN |
| `value` | Connected VPN to update on Current VPN | any | entity VPNConfigurationEntity |

### Get Device Graphics

`com.apple.systempreferences.DeviceGraphicsEntity` · key `settings_get_device_graphics`
  
Output: Device Graphics `com.apple.systempreferences.DeviceGraphicsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | device graphics | string | enum: `Library` |

### Get Device Memory

`com.apple.systempreferences.DeviceMemoryEntity` · key `settings_get_device_memory`
  
Output: Device Memory `com.apple.systempreferences.DeviceMemoryEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | device memory | string | enum: `Library` |

### Get Device Model Name

`com.apple.systempreferences.DeviceModelNameEntity` · key `settings_get_device_model_name`
  
Output: Device Model Name `com.apple.systempreferences.DeviceModelNameEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | device model name | string | enum: `Library` |

### Get Operating System Information

`com.apple.systempreferences.DeviceOSInfoEntity` · key `settings_get_operating_system_information`
  
Output: Operating System Information `com.apple.systempreferences.DeviceOSInfoEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | operating system information | string | enum: `Library` |

### Get Device Processor

`com.apple.systempreferences.DeviceProcessorEntity` · key `settings_get_device_processor`
  
Output: Device Processor `com.apple.systempreferences.DeviceProcessorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | device processor | string | enum: `Library` |

### Get Device Platform Single Sign-on Status

`com.apple.systempreferences.DeviceSSOIntent` · key `settings_get_device_platform_single_sign_on_status`
  
Get the current platform single sign-on status of this Mac.
  
Output: Platform Single Sign-on Status `com.apple.systempreferences.SSOStatusEntity`

### Get Device Serial Number

`com.apple.systempreferences.DeviceSerialNumberEntity` · key `settings_get_device_serial_number`
  
Output: Device Serial Number `com.apple.systempreferences.DeviceSerialNumberEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | device serial number | string | enum: `Library` |

### Get Storage Information

`com.apple.systempreferences.DeviceStorageEntity` · key `settings_get_storage_information`
  
Output: Storage Information `com.apple.systempreferences.DeviceStorageEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | storage information | string | enum: `Library` |

### Find Energy Saver Settings

`com.apple.systempreferences.EnergySaverPaneDynamicDeepLinks` · key `settings_find_energy_saver_settings`
  
Output: Energy Saver Settings `com.apple.systempreferences.EnergySaverPaneDynamicDeepLinks`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | energy saver settings | string | enum: `Library` |

### Find Energy Settings

`com.apple.systempreferences.EnergySettingsDeepLink` · key `com_apple_settings_find_energy_settings`
  
Output: Energy Settings `com.apple.systempreferences.EnergySettingsDeepLink`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | energy settings | string | enum: `Library` |

### Get Automatically allow downloaded signed software to receive incoming connections

`com.apple.systempreferences.FirewallAllowDownloadedSignedEntity` · key `settings_get_automatically_allow_downloaded_signed_software_to_receive_incoming_connections`
  
Output: Automatically allow downloaded signed software to receive incoming connections `com.apple.systempreferences.FirewallAllowDownloadedSignedEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically allow downloaded signed software to receive incoming connections | string | enum: `Library` |

### Get Automatically allow built-in software to receive incoming connections

`com.apple.systempreferences.FirewallAllowSignedEntity` · key `settings_get_automatically_allow_built_in_software_to_receive_incoming_connections`
  
Output: Automatically allow built-in software to receive incoming connections `com.apple.systempreferences.FirewallAllowSignedEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | automatically allow built-in software to receive incoming connections | string | enum: `Library` |

### Get Firewall State

`com.apple.systempreferences.FirewallStateEntity` · key `settings_get_firewall_state`
  
Output: Firewall State `com.apple.systempreferences.FirewallStateEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | firewall state | string | enum: `Library` |

### Get Enable stealth mode

`com.apple.systempreferences.FirewallStealthModeEntity` · key `settings_get_enable_stealth_mode`
  
Output: Enable stealth mode `com.apple.systempreferences.FirewallStealthModeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | enable stealth mode | string | enum: `Library` |

### Get Group’s Members

`com.apple.systempreferences.GroupMembershipIntent` · key `settings_get_group_s_members`
  
Get members of the specified group.
  
Output: Members of the Specified Group `com.apple.systempreferences.AccountEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `groupEntity` | Group | any | entity AccountEntity |

### Get the Guest User

`com.apple.systempreferences.GuestIntent` · key `settings_get_the_guest_user`
  
Get info for the guest user.
  
Output: The Guest User `com.apple.systempreferences.AccountEntity`

### Get Guest User’s Parental Control Status

`com.apple.systempreferences.GuestParentalControlStatusIntent` · key `settings_get_guest_user_s_parental_control_status`
  
Get parental control status of the guest user. If enabled, the guest user have limited or no access to adult websites.
  
Output: Parental Control Status of Guest User `bool`

### Get Guest User’s Shared Folders Access Status

`com.apple.systempreferences.GuestSharedAccessStatusIntent` · key `settings_get_guest_user_s_shared_folders_access_status`
  
Get shared folders access status of the guest user. If enabled, the guest user can access shared folders.
  
Output: Shared Folders Access Status of the Guest User `bool`

### Get Guest User’s Status

`com.apple.systempreferences.GuestStatusIntent` · key `settings_get_guest_user_s_status`
  
Get the status of the guest user.
  
Output: The Status of Guest User `bool`

### Get Handoff Status

`com.apple.systempreferences.HandoffIntent` · key `settings_get_handoff_status`
  
Allow Handoff between this Mac and your iCloud devices
  
Output: Handoff Enabled `bool`

### Get Highlight color

`com.apple.systempreferences.HighlightColorEntity` · key `settings_get_highlight_color`
  
Output: Highlight color `com.apple.systempreferences.HighlightColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | highlight color | string | enum: `Library` |

### Update Highlight color

`com.apple.systempreferences.HighlightColorEntity-UpdatableEntity` · key `settings_update_highlight_color`
  
Change the Highlight color value of Highlight color
  
Output: Highlight color `com.apple.systempreferences.HighlightColorEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Highlight color | any | entity HighlightColorEntity |
| `value` | Highlight color to update on Highlight color | any | enum:  |

### Get Account’s Identifier

`com.apple.systempreferences.IdentifierIntent` · key `settings_get_account_s_identifier`
  
Get the identifier of the specified account. For a user, this value is user identifier (UID); for a group, this value is group identifier (GID).
  
Output: Account Identifier `int`

| Key | Name | Kind | Type |
|---|---|---|---|
| `accountEntity` | Account | any | entity AccountEntity |

### Get List of Accounts

`com.apple.systempreferences.ListOfAccountsIntent` · key `settings_get_list_of_accounts`
  
Get a list of local accounts on this Mac.
  
Output: Local Accounts `com.apple.systempreferences.AccountEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `type` | Account Type | string | enum: `group`, `user` |

### Get List of Network Servers

`com.apple.systempreferences.ListOfNetworkServersIntent` · key `settings_get_list_of_network_servers`
  
Get a list of network servers linked to this Mac.
  
Output: Server Information `com.apple.systempreferences.NetworkServerStatusEntity`

### Get Lock Message

`com.apple.systempreferences.LockMessageIntent` · key `settings_get_lock_message`
  
Show message when locked
  
Output: Lock Message `string`

### Get Login Window Mode

`com.apple.systempreferences.LoginWindowModeIntent` · key `settings_get_login_window_mode`
  
Login window shows
  
Output: Login Window Option `string`

### Login Window Shows Buttons

`com.apple.systempreferences.LoginWindowShowsButtonsIntent` · key `settings_login_window_shows_buttons`
  
Login Window Shows the Sleep, Restart, and Shut Down Buttons
  
Output: Login Window Shows Buttons `bool`

### Get Push through the edge of a display to connect a nearby Mac or iPad

`com.apple.systempreferences.MagicEdgeEntity` · key `settings_get_push_through_the_edge_of_a_display_to_connect_a_nearby_mac_or_ipad`
  
Output: Push through the edge of a display to connect a nearby Mac or iPad `com.apple.systempreferences.MagicEdgeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | push through the edge of a display to connect a nearby mac or ipad | string | enum: `Library` |

### Update Push through the edge of a display to connect a nearby Mac or iPad

`com.apple.systempreferences.MagicEdgeEntity-UpdatableEntity` · key `settings_update_push_through_the_edge_of_a_display_to_connect_a_nearby_mac_or_ipad`
  
Change the Push through the edge of a display to connect a nearby Mac or iPad value of Push through the edge of a display to connect a nearby Mac or iPad
  
Output: Push through the edge of a display to connect a nearby Mac or iPad `com.apple.systempreferences.MagicEdgeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Push through the edge of a display to connect a nearby Mac or iPad | any | entity MagicEdgeEntity |
| `value` | Push through the edge of a display to connect a nearby Mac or iPad to update on Push through the edge of a display to connect a nearby Mac or iPad | bool | bool |

### Open About

`com.apple.systempreferences.OpenAboutSettingsStaticDeepLinks` · key `settings_open_about`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | About | string | enum: `computerName`, `deviceCoverage`, `deviceDisplays`, `deviceGraphics`, `deviceLegalNotices`, `deviceMemory`, `deviceModelName`, `deviceOSInfo`, `deviceProcessor`, `deviceSerialNumber`, `deviceStorage`, `incompatibleApps` … |

### Open Accessibility Audio Descriptions Settings

`com.apple.systempreferences.OpenAccessibilityAudioDescriptionsStaticDeepLinks` · key `settings_open_accessibility_audio_descriptions_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_DESCRIPTIONS`, `AX_VIDEO_DESCRIPTION` |

### Open Accessibility Audio Settings

`com.apple.systempreferences.OpenAccessibilityAudioStaticDeepLinks` · key `settings_open_accessibility_audio_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_BACKGROUND_SOUNDS`, `AX_BACKGROUND_SOUNDS_LOCK_SCREEN`, `AX_BACKGROUND_SOUNDS_TIMER_OPTIONS`, `AX_BACKGROUND_SOUNDS_TIMER_TOGGLE`, `AX_BACKGROUND_SOUNDS_VOLUME`, `AX_BACKGROUND_SOUND_FILTER_CHOOSE`, `AX_BACKGROUND_SOUND_TIMER_CHOOSE`, `AX_BG_SOUND_SELECT_HEADER`, `AX_FEATURE_AUDIO`, `AX_FLASH_SCREEN`, `AX_HEADPHONE_HOLD_DURATION`, `AX_HEADPHONE_NOISE_CANCEL` … |

### Open Accessibility Display Settings

`com.apple.systempreferences.OpenAccessibilityDisplayStaticDeepLinks` · key `settings_open_accessibility_display_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_CURSOR_SIZE`, `AX_DIFFERENTIATE_WITHOUT_COLOR`, `AX_DISPLAY_FILTER_ENABLED`, `AX_DISPLAY_FILTER_INTENSITY`, `AX_DISPLAY_FILTER_TINT_COLOR`, `AX_DISPLAY_FILTER_TYPE`, `AX_ENHANCE_CONTRAST`, `AX_FEATURE_DISPLAY`, `AX_FIND_CURSOR`, `AX_FONT_SIZE`, `AX_INCREASE_CONTRAST`, `AX_INVERT_COLOR` … |

### Open Accessibility Hearing Devices Settings

`com.apple.systempreferences.OpenAccessibilityHearingDevicesStaticDeepLinks` · key `settings_open_accessibility_hearing_devices_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_HEARINGAIDS` |

### Open Accessibility Hover Text Settings

`com.apple.systempreferences.OpenAccessibilityHoverTextStaticDeepLinks` · key `settings_open_accessibility_hover_text_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_HOVERTEXT`, `AX_HOVER_TEXT_ACTIVATION_LOCK_MODE`, `AX_HOVER_TEXT_BG_COLOR`, `AX_HOVER_TEXT_BORDER_COLOR`, `AX_HOVER_TEXT_ELEMENT_COLOR`, `AX_HOVER_TEXT_ENABLE`, `AX_HOVER_TEXT_FG_COLOR`, `AX_HOVER_TEXT_FONT_FAMILY`, `AX_HOVER_TEXT_FONT_SIZE`, `AX_HOVER_TEXT_MODIFIER`, `AX_HOVER_TYPING_BG_COLOR`, `AX_HOVER_TYPING_BORDER_COLOR` … |

### Open Accessibility Keyboard Settings

`com.apple.systempreferences.OpenAccessibilityKeyboardStaticDeepLinks` · key `settings_open_accessibility_keyboard_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_DWELL_ACTION`, `AX_DWELL_AUTO_REVERT`, `AX_DWELL_CURSOR_COLOR`, `AX_DWELL_IN_MENU_EXTRA`, `AX_DWELL_IN_PANELS`, `AX_DWELL_PROGRESS_INDICATOR`, `AX_DWELL_RETRIGGER_TOLERANCE`, `AX_DWELL_TOLERANCE`, `AX_DWELL_WAIT_TIME`, `AX_DWELL_WAIT_TIME_HOME`, `AX_DWELL_ZOOM`, `AX_DWELL_ZOOM_WAIT` … |

### Open Accessibility Live Captions Settings

`com.apple.systempreferences.OpenAccessibilityLiveCaptionsStaticDeepLinks` · key `settings_open_accessibility_live_captions_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FACETIME_TRANSCRIPTIONS`, `AX_IN_APP`, `AX_SYSTEM_TRANSCRIPTION_BACKGROUND_COLOR_MAIN`, `AX_SYSTEM_TRANSCRIPTION_ENABLED`, `AX_SYSTEM_TRANSCRIPTION_LANGUAGE`, `AX_SYSTEM_TRANSCRIPTION_TEXT_COLOR_MAIN`, `AX_SYSTEM_TRANSCRIPTION_TEXT_FONT_FAMILY_MAIN`, `AX_SYSTEM_TRANSCRIPTION_TEXT_FONT_SIZE_MAIN` |

### Open Accessibility Live Speech Settings

`com.apple.systempreferences.OpenAccessibilityLiveSpeechStaticDeepLinks` · key `settings_open_accessibility_live_speech_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_LIVESPEECH`, `AX_LIVE_SPEECH_ADD_CATEGORY`, `AX_LIVE_SPEECH_CATEGORIES`, `AX_LIVE_SPEECH_CATEGORY_DETAIL.Recent`, `AX_LIVE_SPEECH_CATEGORY_DETAIL.Saved`, `AX_LIVE_SPEECH_ENABLED`, `AX_LIVE_SPEECH_FONT_SIZE`, `AX_LIVE_SPEECH_PREFERRED_LANGUAGE`, `AX_LIVE_SPEECH_SAVED_PHRASES`, `AX_LIVE_SPEECH_VOICE_SELECTION` |

### Open Accessibility Motion Settings

`com.apple.systempreferences.OpenAccessibilityMotionStaticDeepLinks` · key `settings_open_accessibility_motion_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_ANIMATED_IMAGES`, `AX_DIM_FLASHING`, `AX_FEATURE_MOTION`, `AX_MOTION_CUES_ENABLED`, `AX_REDUCE_CURSOR_MODULATION`, `AX_REDUCE_MOTION` |

### Open Accessibility Name Recognition Settings

`com.apple.systempreferences.OpenAccessibilityNameRecognitionStaticDeepLinks` · key `settings_open_accessibility_name_recognition_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_NAME_RECOGNITION`, `AX_NAME_RECOGNITION_ONBOARDING` |

### Open Accessibility Personal Voice Settings

`com.apple.systempreferences.OpenAccessibilityPersonalVoiceStaticDeepLinks` · key `settings_open_accessibility_personal_voice_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_PERSONALVOICE` |

### Open Accessibility Pointer Control Settings

`com.apple.systempreferences.OpenAccessibilityPointerControlStaticDeepLinks` · key `settings_open_accessibility_pointer_control_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_ALT_MOUSE_BUTTONS`, `AX_ALT_MOUSE_ENABLE_SOUNDS`, `AX_ALT_MOUSE_ENABLE_VISUALS`, `AX_CONFIGURE_CAMERA`, `AX_FEATURE_POINTERCONTROL`, `AX_HEAD_MOUSE`, `AX_HEAD_MOUSE_BUTTON`, `AX_HEAD_MOUSE_MODE`, `AX_HEAD_MOUSE_PAUSE_RESUME`, `AX_HEAD_MOUSE_RECALIBRATE`, `AX_HEAD_MOUSE_SENSITIVITY`, `AX_HEAD_MOUSE_TOLERANCE` … |

### Open Accessibility RTT Settings

`com.apple.systempreferences.OpenAccessibilityRTTStaticDeepLinks` · key `settings_open_accessibility_rtt_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_RTT`, `AX_RTT_ENABLE`, `AX_RTT_RELAY_NUMBER`, `AX_RTT_SEND_IMMEDIATELY` |

### Open Accessibility  Settings

`com.apple.systempreferences.OpenAccessibilityRootStaticDeepLinks` · key `settings_open_accessibility_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `root` |

### Open Accessibility Shortcut Settings

`com.apple.systempreferences.OpenAccessibilityShortcutStaticDeepLinks` · key `settings_open_accessibility_shortcut_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_SHORTCUT`, `AX_feature.accessibilityReader`, `AX_feature.backgroundSounds`, `AX_feature.displayFilters`, `AX_feature.fullKeyboardAccess`, `AX_feature.headMouse`, `AX_feature.hoverText`, `AX_feature.hoverTyping`, `AX_feature.increaseContrast`, `AX_feature.invertDisplayColor`, `AX_feature.liveSpeech`, `AX_feature.motionCues` … |

### Open Accessibility Siri Settings

`com.apple.systempreferences.OpenAccessibilitySiriStaticDeepLinks` · key `settings_open_accessibility_siri_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_SIRI`, `AX_SIRI_ATYPICAL_SPEECH`, `AX_TYPE_TO_SIRI_ENABLED` |

### Open Accessibility Spoken Content Settings

`com.apple.systempreferences.OpenAccessibilitySpokenContentStaticDeepLinks` · key `settings_open_accessibility_spoken_content_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_SPOKENCONTENT`, `AX_READER_AUTO_SPEAK`, `AX_READER_HOTKEY_ENABLED`, `AX_READER_HOTKEY_VIEW_IN_READER`, `AX_SPEECH_DELAY`, `AX_SPEECH_PHRASE`, `AX_SPEECH_TEST`, `AX_SPEECH_VOICES`, `AX_SPOKEN_ALERTS`, `AX_SPOKEN_DETECT_LANGUAGES`, `AX_SPOKEN_HOTKEY`, `AX_SPOKEN_LANGUAGE` … |

### Open Accessibility Subtitles and Captioning Settings

`com.apple.systempreferences.OpenAccessibilitySubtitlesandCaptioningStaticDeepLinks` · key `settings_open_accessibility_subtitles_and_captioning_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_CAPTIONING_LANGUAGE_MISMATCH`, `AX_CAPTIONING_PREFER_SDH`, `AX_FEATURE_CAPTIONS` |

### Open Accessibility Switch Control Settings

`com.apple.systempreferences.OpenAccessibilitySwitchControlStaticDeepLinks` · key `settings_open_accessibility_switch_control_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_SWITCHCONTROL`, `AX_NAVIGATION_TIMING`, `AX_SWITCH_AUTOSCAN`, `AX_SWITCH_AUTO_CAPITALIZATION`, `AX_SWITCH_AUTO_SPACING`, `AX_SWITCH_COALESCE`, `AX_SWITCH_CONTROL_APPEARANCE_TYPE`, `AX_SWITCH_CONTROL_PLATFORM_SWITCHING`, `AX_SWITCH_CURSOR_SIZE`, `AX_SWITCH_CURSOR_SPEED`, `AX_SWITCH_ELEMENT_SPEED`, `AX_SWITCH_FIRST_ITEM_DELAY` … |

### Open Accessibility Vocal Shortcuts Settings

`com.apple.systempreferences.OpenAccessibilityVocalShortcutsStaticDeepLinks` · key `settings_open_accessibility_vocal_shortcuts_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_ADAPTIVE_VOICE_SHORTCUTS`, `AX_ADAPTIVE_VOICE_SHORTCUTS_ONBOARDING`, `AX_FEATURE_AVS` |

### Open Accessibility Voice Control Settings

`com.apple.systempreferences.OpenAccessibilityVoiceControlStaticDeepLinks` · key `settings_open_accessibility_voice_control_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_VOICECONTROL`, `AX_VOICE_CONTROL_AUDIO_DONATION_ENABLED`, `AX_VOICE_CONTROL_COMMANDS`, `AX_VOICE_CONTROL_LANGUAGE`, `AX_VOICE_CONTROL_MIC`, `AX_VOICE_CONTROL_OPEN_TRAINING`, `AX_VOICE_CONTROL_OVERLAY`, `AX_VOICE_CONTROL_OVERLAY_FADING_ENABLED`, `AX_VOICE_CONTROL_PLAY_SOUND_ENABLED`, `AX_VOICE_CONTROL_SHOW_HINTS_ENABLED`, `AX_VOICE_CONTROL_VOCABULARY`, `AX_VOICE_OPTION_COMMANDS_DELETE_ALL` … |

### Open Accessibility VoiceOver Settings

`com.apple.systempreferences.OpenAccessibilityVoiceOverStaticDeepLinks` · key `settings_open_accessibility_voice_over_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_VOICEOVER`, `AX_VO_OPEN_TRAINING`, `AX_VO_OPEN_UTILITY` |

### Open Accessibility Zoom Settings

`com.apple.systempreferences.OpenAccessibilityZoomStaticDeepLinks` · key `settings_open_accessibility_zoom_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | __ENTRY_PANE__ | string | enum: `AX_FEATURE_ZOOM`, `AX_TOUCH_BAR_ZOOM_ENABLE`, `AX_ZOOM_ADJUST_SIZE`, `AX_ZOOM_CHOOSE_DISPLAY`, `AX_ZOOM_DISABLE_UNIVERSAL_CONTROL`, `AX_ZOOM_ENABLE_GESTURE`, `AX_ZOOM_ENABLE_HOTKEYS`, `AX_ZOOM_FLASH`, `AX_ZOOM_FOCUS_MOVEMENT`, `AX_ZOOM_FOCUS_MOVEMENT_DELAY`, `AX_ZOOM_FOLLOW_FOCUS_ACTIVATION`, `AX_ZOOM_FOLLOW_FOCUS_MODE` … |

### Open AirDrop & Continuity

`com.apple.systempreferences.OpenAirDropHandoffDeepLinks` · key `settings_open_air_drop_continuity`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | AirDrop & Continuity | string | enum: `root` |

### Open Appearance Settings

`com.apple.systempreferences.OpenAppearanceSettingsDeepLink` · key `settings_open_appearance_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Mouse setting | any | entity AppearanceSettingsDeepLink |

### Open Automatically adjust brightness

`com.apple.systempreferences.OpenAutoBrightnessEntityDeepLink` · key `settings_open_automatically_adjust_brightness`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Automatically adjust brightness on the main display | any | entity AutoBrightnessEntity |

### Open Automatically reconnect

`com.apple.systempreferences.OpenAutomaticReconnectEntityDeepLink` · key `settings_open_automatically_reconnect`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Automatically reconnect to any nearby Mac or iPad | any | entity AutomaticReconnectEntity |

### Open Battery Settings

`com.apple.systempreferences.OpenBatterSettingsDeepLink` · key `com_apple_settings_open_battery_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Battery Settings | any | entity BatterySettingsDeepLink |

### Open Battery Health Settings

`com.apple.systempreferences.OpenBatteryHealthPaneDynamicDeepLinks` · key `settings_open_battery_health_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Battery Health Settings | any | entity BatteryHealthPaneDynamicDeepLinks |

### Open Battery Settings Options Pane

`com.apple.systempreferences.OpenBatteryOptionsPaneDynamicDeepLinks` · key `settings_open_battery_settings_options_pane`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Battery Settings Options Pane | any | entity BatteryOptionsPaneDynamicDeepLinks |

### Open Battery Settings

`com.apple.systempreferences.OpenBatterySettingsPaneDynamicDeepLinks` · key `settings_open_battery_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Battery Settings | any | entity BatterySettingsPaneDynamicDeepLinks |

### Open Displays

`com.apple.systempreferences.OpenDisplaysSettingsDeepLinks` · key `settings_open_displays`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Displays | string | enum: `arrangement`, `brightness`, `colorProfiles`, `edr`, `hdr`, `nightShift`, `overscan`, `presets`, `refreshRate`, `resolution`, `root`, `rotation` … |

### Open Energy Saver Settings

`com.apple.systempreferences.OpenEnergySaverPaneDynamicDeepLinks` · key `settings_open_energy_saver_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Energy Saver Settings | any | entity EnergySaverPaneDynamicDeepLinks |

### Open Energy Settings

`com.apple.systempreferences.OpenEnergySettingsDeepLink` · key `com_apple_settings_open_energy_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Energy Settings | any | entity EnergySettingsDeepLink |

### Lock Screen Settings

`com.apple.systempreferences.OpenLockScreenDeepLinks` · key `settings_lock_screen_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Lock Screen | string | enum: `root` |

### Open Login Items

`com.apple.systempreferences.OpenLoginItemsDeepLinks` · key `settings_open_login_items`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Login Items | string | enum: `backgroundItems`, `extensionItems`, `root`, `userItems` |

### Open Push through to connect

`com.apple.systempreferences.OpenMagicEdgeEntityDeepLink` · key `settings_open_push_through_to_connect`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Push through the edge of a display to connect a nearby Mac or iPad | any | entity MagicEdgeEntity |

### Open Network

`com.apple.systempreferences.OpenNetworkSettingsDeepLinks` · key `settings_open_network`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Network | string | enum: `advancedEthernet`, `advancedModem`, `advancedVPN`, `advancedWifi`, `bluetooth`, `bond`, `bridge`, `dns`, `ethernet`, `fireWire`, `firewall`, `hardware` … |

### Open AppleCare & Warranty

`com.apple.systempreferences.OpenNewDeviceOutreachStaticDeepLinks` · key `com_apple_preferences_open_apple_care_warranty`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | AppleCare & Warranty | string | enum: `root` |

### Open Printers & Scanners

`com.apple.systempreferences.OpenPrinterScannerDeepLinks` · key `settings_open_printers_scanners`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Printers & Scanners | string | enum: `root` |

### Open Privacy & Security

`com.apple.systempreferences.OpenPrivacySecurityDeepLinks` · key `settings_open_privacy_security`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Privacy & Security | string | enum: `accessibility`, `advanced`, `advertising`, `allFiles`, `analytics`, `appBundles`, `audioCapture`, `automation`, `bluetooth`, `calendars`, `camera`, `contacts` … |

### Open Share keyboard and mouse

`com.apple.systempreferences.OpenShareKeyboardEntityDeepLink` · key `settings_open_share_keyboard_and_mouse`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Allow your pointer and keyboard to move between any nearby Mac or iPad | any | entity ShareKeyboardEntity |

### Open Sound

`com.apple.systempreferences.OpenSoundSettingsDeepLinks` · key `settings_open_sound`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Sound | string | enum: `balance`, `effects`, `input`, `mute`, `output`, `root`, `volume` |

### Open Feedback Sound Settings

`com.apple.systempreferences.OpenSoundSettingsFeedbackSoundEntity` · key `settings_open_feedback_sound_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Feedback Sound Settings | any | entity SoundSettingsFeedbackSoundEntity |

### Open User Interface Sound Effects Settings

`com.apple.systempreferences.OpenSoundSettingsInterfaceEffectsEntity` · key `settings_open_user_interface_sound_effects_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | User Interface Sound Effects Settings | any | entity SoundSettingsInterfaceEffectsEntity |

### Open Startup Sound Settings

`com.apple.systempreferences.OpenSoundSettingsStartupSoundEntity` · key `settings_open_startup_sound_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Startup Sound Settings | any | entity SoundSettingsStartupSoundEntity |

### Open Transfer or Reset

`com.apple.systempreferences.OpenTransferResetDeepLinks` · key `settings_open_transfer_or_reset`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Transfer or Reset | string | enum: `root` |

### Open True Tone

`com.apple.systempreferences.OpenTrueToneEntityDeepLink` · key `settings_open_true_tone`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | True Tone | any | entity TrueToneEntity |

### Open Users & Groups

`com.apple.systempreferences.OpenUsersGroupsDeepLinks` · key `settings_open_users_groups`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Users & Groups | string | enum: `changeMyPassword`, `root`, `showGuest`, `showMe` |

### Open VPN Settings

`com.apple.systempreferences.OpenVPNDeepLink` · key `settings_open_vpn_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | VPN Configuration | any | entity VPNConfigurationEntity |

### Get Printer Paper Size

`com.apple.systempreferences.PaperSizeEntity` · key `settings_get_printer_paper_size`
  
Output: Printer Paper Size `com.apple.systempreferences.PaperSizeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | printer paper size | string | enum: `Library` |

### Update Printer Paper Size

`com.apple.systempreferences.PaperSizeEntity-UpdatableEntity` · key `settings_update_printer_paper_size`
  
Change the Printer Paper Size value of Printer Paper Size
  
Output: Printer Paper Size `com.apple.systempreferences.PaperSizeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Printer Paper Size | any | entity PaperSizeEntity |
| `value` | Printer Paper Size to update on Printer Paper Size | any | entity PrinterPaperSize |

### Get Password Delay

`com.apple.systempreferences.RequirePasswordDelayIntent` · key `settings_get_password_delay`
  
Require password after screen saver begins or display is turned off
  
Output: Password Delay `string`

### Get Start Screen Saver

`com.apple.systempreferences.ScreenSaverDelayEntity` · key `settings_get_start_screen_saver`
  
Output: Start Screen Saver `com.apple.systempreferences.ScreenSaverDelayEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | start screen saver | string | enum: `Library` |

### Update Start Screen Saver

`com.apple.systempreferences.ScreenSaverDelayEntity-UpdatableEntity` · key `settings_update_start_screen_saver`
  
Change the Start Screen Saver value of Start Screen Saver
  
Output: Start Screen Saver `com.apple.systempreferences.ScreenSaverDelayEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Start Screen Saver | any | entity ScreenSaverDelayEntity |
| `value` | Start Screen Saver to update on Start Screen Saver | any | entity ScreenSaverDelay |

### Setting Navigation

`com.apple.systempreferences.SettingsNavigationEventDonationIntent` · key `settings_setting_navigation`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Settings Location | any | entity SettingsNavigationLocationEntity |

### Get Allow your pointer and keyboard to move between any nearby Mac or iPad

`com.apple.systempreferences.ShareKeyboardEntity` · key `settings_get_allow_your_pointer_and_keyboard_to_move_between_any_nearby_mac_or_ipad`
  
Output: Allow your pointer and keyboard to move between any nearby Mac or iPad `com.apple.systempreferences.ShareKeyboardEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | allow your pointer and keyboard to move between any nearby mac or ipad | string | enum: `Library` |

### Update Allow your pointer and keyboard to move between any nearby Mac or iPad

`com.apple.systempreferences.ShareKeyboardEntity-UpdatableEntity` · key `settings_update_allow_your_pointer_and_keyboard_to_move_between_any_nearby_mac_or_ipad`
  
Change the Allow your pointer and keyboard to move between any nearby Mac or iPad value of Allow your pointer and keyboard to move between any nearby Mac or iPad
  
Output: Allow your pointer and keyboard to move between any nearby Mac or iPad `com.apple.systempreferences.ShareKeyboardEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Allow your pointer and keyboard to move between any nearby Mac or iPad | any | entity ShareKeyboardEntity |
| `value` | Allow your pointer and keyboard to move between any nearby Mac or iPad to update on Allow your pointer and keyboard to move between any nearby Mac or iPad | bool | bool |

### Show Large Clock

`com.apple.systempreferences.ShowLargeClockIntent` · key `settings_show_large_clock`
  
Show large clock
  
Output: Large Clock Option `string`

### Show Password Hints

`com.apple.systempreferences.ShowPasswordHintsIntent` · key `settings_show_password_hints`
  
Show password hints
  
Output: Show Password Hints `bool`

### Get Show scroll bars

`com.apple.systempreferences.ShowScrollBarsEntity` · key `settings_get_show_scroll_bars`
  
Output: Show scroll bars `com.apple.systempreferences.ShowScrollBarsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | show scroll bars | string | enum: `Library` |

### Update Show scroll bars

`com.apple.systempreferences.ShowScrollBarsEntity-UpdatableEntity` · key `settings_update_show_scroll_bars`
  
Change the Show scroll bars value of Show scroll bars
  
Output: Show scroll bars `com.apple.systempreferences.ShowScrollBarsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Show scroll bars | any | entity ShowScrollBarsEntity |
| `value` | Show scroll bars to update on Show scroll bars | string | enum: `0`, `1`, `2` |

### Get Sidebar icon size

`com.apple.systempreferences.SidebarIconSizeEntity` · key `settings_get_sidebar_icon_size`
  
Output: Sidebar icon size `com.apple.systempreferences.SidebarIconSizeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | sidebar icon size | string | enum: `Library` |

### Update Sidebar icon size

`com.apple.systempreferences.SidebarIconSizeEntity-UpdatableEntity` · key `settings_update_sidebar_icon_size`
  
Change the Sidebar icon size value of Sidebar icon size
  
Output: Sidebar icon size `com.apple.systempreferences.SidebarIconSizeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Sidebar icon size | any | entity SidebarIconSizeEntity |
| `value` | Sidebar icon size to update on Sidebar icon size | string | enum: `1`, `2`, `3` |

### Get Feedback Sound Settings

`com.apple.systempreferences.SoundSettingsFeedbackSoundEntity` · key `settings_get_feedback_sound_settings`
  
Output: Feedback Sound Settings `com.apple.systempreferences.SoundSettingsFeedbackSoundEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | feedback sound settings | string | enum: `Library` |

### Update a Feedback Sound Settings's Play feedback when volume is changed

`com.apple.systempreferences.SoundSettingsFeedbackSoundEntity-UpdatableEntity` · key `settings_update_a_feedback_sound_settings_s_play_feedback_when_volume_is_changed`
  
Change the Play feedback when volume is changed value of Feedback Sound Settings
  
Output: Feedback Sound Settings `com.apple.systempreferences.SoundSettingsFeedbackSoundEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Feedback Sound Settings | any | entity SoundSettingsFeedbackSoundEntity |
| `value` | Play feedback when volume is changed to update on Feedback Sound Settings | bool | bool |

### Get User Interface Sound Effects Settings

`com.apple.systempreferences.SoundSettingsInterfaceEffectsEntity` · key `settings_get_user_interface_sound_effects_settings`
  
Output: User Interface Sound Effects Settings `com.apple.systempreferences.SoundSettingsInterfaceEffectsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | user interface sound effects settings | string | enum: `Library` |

### Update a User Interface Sound Effects Settings's Play user interface sound effects

`com.apple.systempreferences.SoundSettingsInterfaceEffectsEntity-UpdatableEntity` · key `settings_update_a_user_interface_sound_effects_settings_s_play_user_interface_sound_effects`
  
Change the Play user interface sound effects value of User Interface Sound Effects Settings
  
Output: User Interface Sound Effects Settings `com.apple.systempreferences.SoundSettingsInterfaceEffectsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | User Interface Sound Effects Settings | any | entity SoundSettingsInterfaceEffectsEntity |
| `value` | Play user interface sound effects to update on User Interface Sound Effects Settings | bool | bool |

### Get Startup Sound Settings

`com.apple.systempreferences.SoundSettingsStartupSoundEntity` · key `settings_get_startup_sound_settings`
  
Output: Startup Sound Settings `com.apple.systempreferences.SoundSettingsStartupSoundEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | startup sound settings | string | enum: `Library` |

### Update a Startup Sound Settings's Play sound on startup

`com.apple.systempreferences.SoundSettingsStartupSoundEntity-UpdatableEntity` · key `settings_update_a_startup_sound_settings_s_play_sound_on_startup`
  
Change the Play sound on startup value of Startup Sound Settings
  
Output: Startup Sound Settings `com.apple.systempreferences.SoundSettingsStartupSoundEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Startup Sound Settings | any | entity SoundSettingsStartupSoundEntity |
| `value` | Play sound on startup to update on Startup Sound Settings | bool | bool |

### High Power Mode

`com.apple.systempreferences.ToggleHighPowerModeBatteryNoBatteryIntent` · key `settings_high_power_mode`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | High Power Mode | bool | bool |

### High Power Mode

`com.apple.systempreferences.ToggleHighPowerModeOnBatteryIntent` · key `settings_high_power_mode`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | High Power Mode | bool | bool |

### Low Power Mode

`com.apple.systempreferences.ToggleLowPowerModeIntent` · key `settings_low_power_mode`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | Low Power Mode | bool | bool |

### Get True Tone

`com.apple.systempreferences.TrueToneEntity` · key `settings_get_true_tone`
  
Output: True Tone `com.apple.systempreferences.TrueToneEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | true tone | string | enum: `Library` |

### Update True Tone

`com.apple.systempreferences.TrueToneEntity-UpdatableEntity` · key `settings_update_true_tone`
  
Change the True Tone value of True Tone
  
Output: True Tone `com.apple.systempreferences.TrueToneEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | True Tone | any | entity TrueToneEntity |
| `value` | True Tone to update on True Tone | bool | bool |

### Get User’s Group

`com.apple.systempreferences.UserGroupIntent` · key `settings_get_user_s_group`
  
Get primary group name of the specified user.
  
Output: Primary Group Name `string`

| Key | Name | Kind | Type |
|---|---|---|---|
| `userEntity` | User | any | entity AccountEntity |

### Get User’s Home Folder

`com.apple.systempreferences.UserHomeFolderIntent` · key `settings_get_user_s_home_folder`
  
Get URL to home folder of the specified user.
  
Output: Home Folder URL `file`

| Key | Name | Kind | Type |
|---|---|---|---|
| `userEntity` | User | any | entity AccountEntity |

### Get User’s Admin Status

`com.apple.systempreferences.UserIsAdminIntent` · key `settings_get_user_s_admin_status`
  
Get admin status of the specified user.
  
Output: Admin Status of the Specified User `bool`

| Key | Name | Kind | Type |
|---|---|---|---|
| `userEntity` | User | any | entity AccountEntity |

### Get User Login Items

`com.apple.systempreferences.UserLoginItemsIntent` · key `settings_get_user_login_items`
  
User Login Items
  
Output: User login items `com.apple.systempreferences.LoginItemEntity`

### Get User’s Platform Single Sign-on Status

`com.apple.systempreferences.UserSSOIntent` · key `settings_get_user_s_platform_single_sign_on_status`
  
Get platform single sign-on status of the specified user.
  
Output: Platform Single Sign-on Status of the Specified User `string`

| Key | Name | Kind | Type |
|---|---|---|---|
| `userEntity` | User | any | entity AccountEntity |

### Update a VPN Configuration's Connect On Demand

`com.apple.systempreferences.VPNConfigurationEntity-UpdatableEntity` · key `settings_update_a_vpn_configuration_s_connect_on_demand`
  
Change the Connect On Demand value of VPN Configuration
  
Output: VPN Configuration `com.apple.systempreferences.VPNConfigurationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `connectOnDemand` | Connect On Demand to update on VPN Configuration | bool | bool |
| `entity` | VPN Configuration | any | entity VPNConfigurationEntity |

### Get iPhone Widgets

`com.apple.systempreferences.WidgetsAndOnenessEntity` · key `settings_get_iphone_widgets`
  
Output: iPhone Widgets `com.apple.systempreferences.WidgetsAndOnenessEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `useiPhoneWidgets` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | iphone widgets | string | enum: `Library` |

### Update iPhone Widgets

`com.apple.systempreferences.WidgetsAndOnenessEntity-UpdatableEntity` · key `settings_update_iphone_widgets`
  
Change the iPhone Widgets value of iPhone Widgets
  
Output: iPhone Widgets `com.apple.systempreferences.WidgetsAndOnenessEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | iPhone Widgets | any | entity WidgetsAndOnenessEntity |
| `useiPhoneWidgets` | iPhone Widgets to update on iPhone Widgets | bool | bool |

## SystemIntents (`com.apple.SystemIntents`)

### Close an App

`com.apple.SystemIntents.CloseApplicationIntent` · key `com_apple_system_intents_close_an_app`
  
Closes an app matching the provided application parameter.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `application` | Application | any | app |

### Launch an App

`com.apple.SystemIntents.LaunchApplicationIntent` · key `com_apple_system_intents_launch_an_app`
  
Opens an app matching the provided application parameter.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `application` | Application | any | app |
| `url` |  | text | url |

### Show Desktop

`com.apple.SystemIntents.ShowHomeScreenIntent` · key `com_apple_system_intents_show_desktop`
  
Shows the user's Desktop.
  
Output:  `none`

## Tips (`com.apple.helpviewer`)

### Open Collection

`com.apple.helpviewer.CollectionOpenIntent` · key `com_apple_helpviewer_open_collection`
  
Opens a Tip collection in the Tips app.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `collection` | Collection | any | entity TipCollection |

## TransparencySettingsIntents (`com.apple.TransparencySettingsIntents`)

### Open Contact Key Verification Public Verification Code Settings

`com.apple.TransparencySettingsIntents.OpenTransparencyPublicVerificationCodeDeepLink` · key `settings_open_contact_key_verification_public_verification_code_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Contact Key Verification Public Verification Code | any | entity TransparencyPublicVerificationCodeEntity |

### Open Contact Key Verification Status Settings

`com.apple.TransparencySettingsIntents.OpenTransparencyStatusDeepLink` · key `settings_open_contact_key_verification_status_settings`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Contact Key Verification Status | any | entity TransparencyStatusEntity |

### Get Contact Key Verification Public Verification Code

`com.apple.TransparencySettingsIntents.TransparencyPublicVerificationCodeEntity` · key `settings_get_contact_key_verification_public_verification_code`
  
Output: Contact Key Verification Public Verification Code `com.apple.TransparencySettingsIntents.TransparencyPublicVerificationCodeEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | contact key verification public verification code | string | enum: `Library` |

### TransparencySettingsIntents

`com.apple.TransparencySettingsIntents.TransparencySettingsIntents` · key `com_apple_transparency_settings_intents_transparency_settings_intents`
  
Output:  `none`

### Get Contact Key Verification Status

`com.apple.TransparencySettingsIntents.TransparencyStatusEntity` · key `settings_get_contact_key_verification_status`
  
Output: Contact Key Verification Status `com.apple.TransparencySettingsIntents.TransparencyStatusEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | contact key verification status | string | enum: `Library` |

## USDAppIntents (`com.apple.HydraUSDAppIntents`)

### Convert to USDZ

`com.apple.HydraUSDAppIntents.ConvertToUSDZ` · key `com_apple_hydra_usd_app_intents_convert_to_usdz`
  
Creates a USDZ file from other 3D file formats
  
Output: USDZ File `file`

| Key | Name | Kind | Type |
|---|---|---|---|
| `file` | File | any | file |

## VisionAppIntents (`com.apple.VisionAppIntents`)

### Scan QR or Barcode

`com.apple.VisionAppIntents.DetectBarcodesIntent` · key `com_apple_vision_app_intents_scan_qr_or_barcode`
  
Detect barcodes from an image
  
Output: QR/Barcodes `string`

| Key | Name | Kind | Type |
|---|---|---|---|
| `imageFile` | Image | any | file |

### Find Similar Images

`com.apple.VisionAppIntents.FindSimilarImagesIntent` · key `com_apple_vision_app_intents_find_similar_images`
  
Find similar images to this image
  
Output: Image `file`

| Key | Name | Kind | Type |
|---|---|---|---|
| `referenceImageFile` | Image | any | file |
| `imageFiles` | From Images | any | file |
| `maxImages` | Maximum Number of Matches | number | int |
| `threshold` | Threshold | number | double |

### Extract Text from Image

`com.apple.VisionAppIntents.RecognizeDocumentIntent` · key `com_apple_vision_app_intents_extract_text_from_image`
  
Uses OCR to extract text from the provided image.
  
Output: Extracted Text `string`

| Key | Name | Kind | Type |
|---|---|---|---|
| `imageFile` | Image | any | file |
| `contentType` | Content Type | string | enum: `allText`, `lists`, `tables` |

### Remove Background from Image

`com.apple.VisionAppIntents.RemoveBackgroundIntent` · key `com_apple_vision_app_intents_remove_background_from_image`
  
Remove the background from the specified image, keeping the subject.
  
Output: Images without Background `file`

| Key | Name | Kind | Type |
|---|---|---|---|
| `imageFiles` | Image | any | file |
| `crop` | Crop to Fit | bool | bool |

### Extract Text from Image

`is.workflow.actions.extracttextfromimage` · key `com_apple_vision_app_intents_extract_text_from_image`
  
Uses OCR to extract text from an image.
  
Output: Extracted Text `string`

| Key | Name | Kind | Type |
|---|---|---|---|
| `imageFile` | Image | any | file |
| `contentType` | Content Type | string | enum: `allText`, `lists`, `tables` |

### Remove Image Background

`is.workflow.actions.image.removebackground` · key `com_apple_vision_app_intents_remove_image_background`
  
Removes the background from an image, keeping the subjects.
  
Output: Images without Background `file`

| Key | Name | Kind | Type |
|---|---|---|---|
| `imageFiles` | Image | any | file |
| `crop` | Crop | bool | bool |

### Scan QR or Barcode

`is.workflow.actions.scanbarcode` · key `com_apple_vision_app_intents_scan_qr_or_barcode`
  
Scans for QR codes and barcodes and returns the text or URL that is found. Select Scan to present the camera when the action runs, or select Extract to read a code from an image.
  
Output: QR/Barcodes `file`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFScanCodeActionMode` | Mode | bool | bool |
| `imageFile` | Image | any | file |

## Voice Memos (`com.apple.VoiceMemos`)

### Get Audio Quality

`com.apple.VoiceMemos.AudioQualityEntity` · key `settings_get_audio_quality`
  
Output: Audio Quality `com.apple.VoiceMemos.AudioQualityEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | audio quality | string | enum: `Library` |

### Edit Audio Quality

`com.apple.VoiceMemos.AudioQualityEntity-UpdatableEntity` · key `settings_edit_audio_quality`
  
Change the “recording quality” value of Audio Quality
  
Output: Audio Quality `com.apple.VoiceMemos.AudioQualityEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Audio Quality | any | entity AudioQualityEntity |
| `value` | Audio Quality | string | enum: `0`, `1` |

### Change Recording Playback Setting

`com.apple.VoiceMemos.ChangeRecordingPlaybackSetting` · key `voice_memos_change_recording_playback_setting`
  
Changes playback settings in Voice Memos.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `changeOperation` | Operation | string | enum: `disable`, `enable`, `toggle` |
| `setting` | Setting | string | enum: `enhanceRecording`, `skipSilence`, `studioVoice` |

### Get Clear Deleted

`com.apple.VoiceMemos.ClearDeletedEntity` · key `settings_get_clear_deleted`
  
Output: Clear Deleted `com.apple.VoiceMemos.ClearDeletedEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | clear deleted | string | enum: `Library` |

### Edit Clear Deleted

`com.apple.VoiceMemos.ClearDeletedEntity-UpdatableEntity` · key `settings_edit_clear_deleted`
  
Change the “duration of how long deleted Voice Memos are kept” value of Clear Deleted
  
Output: Clear Deleted `com.apple.VoiceMemos.ClearDeletedEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Clear Deleted | any | entity ClearDeletedEntity |
| `value` | Clear Deleted | string | enum: `0`, `1`, `2`, `3`, `4` |

### Create Folder

`com.apple.VoiceMemos.CreateFolder` · key `voice_memos_create_folder`
  
Creates a new folder in Voice Memos.
  
Output: Folders `com.apple.VoiceMemos.RCFolderEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Folder Name | text | string |
| `ShowWhenRun` | Show When Run | bool | bool |

### Delete Folders

`com.apple.VoiceMemos.DeleteFolder` · key `voice_memos_delete_folders`
  
Deletes the specified folders.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Folders | any | entity RCFolderEntity |

### Delete Recordings

`com.apple.VoiceMemos.DeleteRecording` · key `voice_memos_delete_recordings`
  
Deletes the specified recordings.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Recordings | any | entity RCRecordingEntity |

### Get Location-based Naming

`com.apple.VoiceMemos.LocationBasedNamingEntity` · key `settings_get_location_based_naming`
  
Output: Location-based Naming `com.apple.VoiceMemos.LocationBasedNamingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `value` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | location-based naming | string | enum: `Library` |

### Edit Location-based Naming

`com.apple.VoiceMemos.LocationBasedNamingEntity-UpdatableEntity` · key `settings_edit_location_based_naming`
  
Change the “naming” value of Location-based Naming
  
Output: Location-based Naming `com.apple.VoiceMemos.LocationBasedNamingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` | Location-based Naming | any | entity LocationBasedNamingEntity |
| `value` | Location-based Naming | bool | bool |

### Open Folder

`com.apple.VoiceMemos.OpenFolder` · key `voice_memos_open_folder`
  
Opens a specific folder in Voice Memos.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Folder | any | entity RCFolderEntity |

### Play Recording

`com.apple.VoiceMemos.PlaybackVoiceMemoIntent` · key `voice_memos_play_recording`
  
Plays a recording.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `playbackType` | Playback Type | string | enum: `mostRecent`, `specific` |
| `entity` | Recording | any | entity RCRecordingEntity |

### Find Recordings

`com.apple.VoiceMemos.RCRecordingEntity` · key `voice_memos_find_recordings`
  
Output: Recordings `com.apple.VoiceMemos.RCRecordingEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `creationDate`, `duration`, `name` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | recordings | string | enum: `Library` |

### Create Recording

`com.apple.VoiceMemos.RecordVoiceMemoIntent` · key `voice_memos_create_recording`
  
Creates a new recording in Voice Memos.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `name` | Name | text | string |

### Get Reset Identifier

`com.apple.VoiceMemos.ResetAnalyticsIdentifierEntity` · key `settings_get_reset_identifier`
  
Output: Reset Identifier `com.apple.VoiceMemos.ResetAnalyticsIdentifierEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | reset identifier | string | enum: `Library` |

### Search in Voice Memos

`com.apple.VoiceMemos.SearchRecordings` · key `voice_memos_search_in_voice_memos`
  
Opens Voice Memos and performs a search for the specified text.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `searchPhrase` | Text | text | string |

### Select Recording

`com.apple.VoiceMemos.SelectRecording` · key `voice_memos_select_recording`
  
Opens a specific recording in Voice Memos.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `target` | Recording | any | entity RCRecordingEntity |

### Stop Recording

`com.apple.VoiceMemos.StopRecording` · key `voice_memos_stop_recording`
  
Stops the current recording.
  
Output:  `none`

### Change Voice Memos Settings

`com.apple.VoiceMemos.WFAppSettingEntityUpdaterAction` · key `voice_memos_change_voice_memos_settings`
  
Changes the state of the selected Voice Memos setting.
  
Output: Audio Quality `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` |  | string | enum: `AudioQualityEntity`, `ClearDeletedEntity`, `LocationBasedNamingEntity` |
| `AudioQualityEntity` | Value | string | enum: `0`, `1` |
| `ClearDeletedEntity` | Value | string | enum: `0`, `1`, `2`, `3`, `4` |
| `LocationBasedNamingEntity` | Value | bool | bool |

### Get Voice Memos Settings

`com.apple.VoiceMemos.WFGetAppSettingAction` · key `voice_memos_get_voice_memos_settings`
  
Gets the current state of the selected Voice Memos setting.
  
Output: Audio Quality `com.apple.VoiceMemos.IntentAudioQuality`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entity` |  | string | enum: `AudioQualityEntity`, `ClearDeletedEntity`, `LocationBasedNamingEntity` |

## WallpaperAgent (`com.apple.wallpaper.agent`)

### Set Wallpaper

`com.apple.wallpaper.agent.SetWallpaperIntent` · key `com_apple_wallpaper_agent_set_wallpaper`
  
Sets the wallpaper from the list of available system wallpapers.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `wallpaper` | Wallpaper | any | entity WallpaperEntity |
| `showOnAllSpaces` | Show on All Spaces | bool | bool |
| `showAsScreenSaver` | Show As Screen Saver | bool | bool |

### Set Wallpaper Photo

`com.apple.wallpaper.agent.SetWallpaperPhotoIntent` · key `com_apple_wallpaper_agent_set_wallpaper_photo`
  
Sets the wallpaper to the specified image.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `photo` | Image | any | file |
| `showOnAllSpaces` | Show on All Spaces | bool | bool |

### Skip Wallpaper

`com.apple.wallpaper.agent.SkipShuffledContentAction` · key `com_apple_wallpaper_agent_skip_wallpaper`
  
Output:  `none`

### Find Wallpapers

`com.apple.wallpaper.agent.WallpaperEntity` · key `com_apple_wallpaper_agent_find_wallpapers`
  
Output: Wallpapers `com.apple.wallpaper.agent.WallpaperEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `isDownloaded`, `name` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | wallpapers | string | enum: `Library` |

## Weather (`com.apple.weather`)

### Add Location to List

`com.apple.weather.AddSavedLocationIntent` · key `weather_add_location_to_list`
  
Adds a location to the list of saved locations.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `placemark` | Location | any | primitive120 |
| `OpenWhenRun` | Open When Run | bool | bool |

### Find Location

`com.apple.weather.LocationEntity` · key `weather_find_location`
  
Find a saved location.
  
Output: Location `com.apple.weather.LocationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `locationOfInterestType`, `name`, `placemark`, `secondaryName`, `timeZoneIdentifier` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | location | string | enum: `Library` |

### Find Location of Interest

`com.apple.weather.LocationOfInterestEntity` · key `weather_find_location_of_interest`
  
Output: Location of Interest `com.apple.weather.LocationOfInterestEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `fullAddress`, `isFromMeCard`, `placemark`, `searchDisplayAddress`, `shortAddress`, `type` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | location of interest | string | enum: `Library` |

### Find Location

`com.apple.weather.LocationSearchEntity` · key `weather_find_location`
  
Output: Location `com.apple.weather.LocationSearchEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `name` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | location | string | enum: `Library` |

### Open Moon Details

`com.apple.weather.OpenMoonIntent` · key `weather_open_moon_details`
  
Opens Weather and shows moon details
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `location` | Location | any | entity LocationSearchEntity |

### Open Notifications Configuration

`com.apple.weather.OpenNotificationsConfigurationIntent` · key `weather_open_notifications_configuration`
  
Opens Weather to the Notifications panel to configure severe weather and next-hour precipitation notifications.
  
Output:  `none`

### Open Sunrise and Sunset Details

`com.apple.weather.OpenSunriseSunsetIntent` · key `weather_open_sunrise_and_sunset_details`
  
Opens Weather and shows sunrise and sunset details
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `location` | Location | any | entity LocationSearchEntity |

### Open Units Configuration

`com.apple.weather.OpenUnitsConfigurationIntent` · key `weather_open_units_configuration`
  
Opens the Units panel to change temperature, wind, precipitation, pressure and distance unit settings used by Weather.
  
Output:  `none`

### Open Air Quality Details

`com.apple.weather.OpenWeatherAirQualityIntent` · key `weather_open_air_quality_details`
  
Opens Weather and shows air quality
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `location` | Location | any | entity LocationSearchEntity |
| `position` | Position | string | enum: `details`, `top` |

### Open Weather Condition Details

`com.apple.weather.OpenWeatherSpecificConditionIntent` · key `weather_open_weather_condition_details`
  
Opens Weather and shows a specific weather detail
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `location` | Location | any | entity LocationSearchEntity |
| `specificCondition` | Detail | string | enum: `conditions`, `humidity`, `precipitation`, `pressure`, `uvi`, `visibility`, `wind` |
| `temperatureKind` | Temperature | string | enum: `actual`, `apparent` |
| `date` | Date | any | date |

### Find Preferred Weather Units

`com.apple.weather.PreferredUnitsEntity` · key `weather_find_preferred_weather_units`
  
Output: Preferred Weather Units `com.apple.weather.PreferredUnitsEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `distanceUnit`, `precipitationUnit`, `pressureUnit`, `temperatureUnit`, `windUnit` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | preferred weather units | string | enum: `Library` |

### Remove Locations from List

`com.apple.weather.RemoveSavedLocationIntent` · key `weather_remove_locations_from_list`
  
Removes locations from the list of saved locations.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `entities` | Location | any | entity LocationEntity |

### Reset Unit

`com.apple.weather.ResetUnitsIntent` · key `weather_reset_unit`
  
Resets the unit for a weather detail to the system default
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `unit` | Detail | string | enum: `all`, `distance`, `precipitation`, `pressure`, `temperature`, `wind` |

### Set Distance Unit

`com.apple.weather.SetDistanceUnitIntent` · key `weather_set_distance_unit`
  
Sets the unit used for distance
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `unit` | Unit | string | enum: `km`, `miles` |

### Set Precipitation Unit

`com.apple.weather.SetPrecipitationUnitIntent` · key `weather_set_precipitation_unit`
  
Sets the unit used for precipitation
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `unit` | Unit | string | enum: `in`, `mm` |

### Set Pressure Unit

`com.apple.weather.SetPressureUnitIntent` · key `weather_set_pressure_unit`
  
Sets the unit used for barometric pressure
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `unit` | Unit | string | enum: `hPa`, `inHg`, `kPa`, `mbar`, `mmHg` |

### Set Temperature Unit

`com.apple.weather.SetTemperatureUnitIntent` · key `weather_set_temperature_unit`
  
Sets the unit used for temperature
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `unit` | Unit | string | enum: `celsius`, `fahrenheit`, `mirrorSystem` |

### Set Wind Unit

`com.apple.weather.SetWindUnitIntent` · key `weather_set_wind_unit`
  
Sets the unit used for wind
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `unit` | Unit | string | enum: `bft`, `kph`, `kts`, `mph`, `ms` |

### Find Synced Data

`com.apple.weather.SyncedDataEntity` · key `weather_find_synced_data`
  
Output: Synced Data `com.apple.weather.SyncedDataEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `encodedSyncedData` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | synced data | string | enum: `Library` |

## WindowManager (`com.apple.WindowManager`)

### Application Windows

`com.apple.WindowManager.AppExposeAction` · key `com_apple_window_manager_application_windows`
  
Output:  `none`

### Tile Windows to Corners

`com.apple.WindowManager.CornersTileAction` · key `com_apple_window_manager_tile_windows_to_corners`
  
Output:  `none`

### Mission Control

`com.apple.WindowManager.MissionControlAction` · key `com_apple_window_manager_mission_control`
  
Output:  `none`

### Show Desktop

`com.apple.WindowManager.ShowDesktopAction` · key `com_apple_window_manager_show_desktop`
  
Output:  `none`

### Enable Stage Manager

`com.apple.WindowManager.StageManagerToggleIntent` · key `com_apple_window_manager_enable_stage_manager`
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `value` | Stage Manager is enabled | bool | bool |

### Tile Windows Left & Corners

`com.apple.WindowManager.ThreeUpTileAction` · key `com_apple_window_manager_tile_windows_left_corners`
  
Output:  `none`

### Tile Windows Left & Right

`com.apple.WindowManager.TwoUpTileAction` · key `com_apple_window_manager_tile_windows_left_right`
  
Output:  `none`

## Writing Tools App Intents (`com.apple.WritingTools.WritingToolsAppIntentsExtension`)

### Adjust Tone of Text

`com.apple.WritingTools.WritingToolsAppIntentsExtension.AdjustToneIntent` · key `com_apple_writing_tools_writing_tools_app_intents_extension_adjust_tone_of_text`
  
Adjusts the tone of the provided text using Apple Intelligence.
  
Output: Text `attributedString`

| Key | Name | Kind | Type |
|---|---|---|---|
| `text` | Text | text | richText |
| `tone` | Tone | string | enum: `concise`, `friendly`, `professional` |

### Compose Text

`com.apple.WritingTools.WritingToolsAppIntentsExtension.ComposeIntent` · key `com_apple_writing_tools_writing_tools_app_intents_extension_compose_text`
  
Composes text given a prompt and context using Apple Intelligence.
  
Output: Text `attributedString`

| Key | Name | Kind | Type |
|---|---|---|---|
| `prompt` | Prompt | text | string |
| `selectedText` | Selected Text | text | richText |
| `context` | Context | any | entity WTIntentContext |

### Make List from Text

`com.apple.WritingTools.WritingToolsAppIntentsExtension.FormatListIntent` · key `com_apple_writing_tools_writing_tools_app_intents_extension_make_list_from_text`
  
Organizes the provided text in a list using Apple Intelligence.
  
Output: List `attributedString`

| Key | Name | Kind | Type |
|---|---|---|---|
| `text` | Text | text | richText |

### Make Table from Text

`com.apple.WritingTools.WritingToolsAppIntentsExtension.FormatTableIntent` · key `com_apple_writing_tools_writing_tools_app_intents_extension_make_table_from_text`
  
Organizes the provided text in a table using Apple Intelligence.
  
Output: Table `attributedString`

| Key | Name | Kind | Type |
|---|---|---|---|
| `text` | Text | text | richText |

### Proofread Text

`com.apple.WritingTools.WritingToolsAppIntentsExtension.ProofreadIntent` · key `com_apple_writing_tools_writing_tools_app_intents_extension_proofread_text`
  
Corrects grammatical and spelling errors in the provided text using Apple Intelligence.
  
Output: Text `attributedString`

| Key | Name | Kind | Type |
|---|---|---|---|
| `text` | Text | text | richText |

### Ask a Question about Text

`com.apple.WritingTools.WritingToolsAppIntentsExtension.QuestionAnswerIntent` · key `com_apple_writing_tools_writing_tools_app_intents_extension_ask_a_question_about_text`
  
Provides an answer given a question about a given text using Apple Intelligence.
  
Output: Answer `attributedString`

| Key | Name | Kind | Type |
|---|---|---|---|
| `question` | Question | text | string |
| `selectedText` | Selected Text | text | richText |
| `context` | Context | any | entity WTIntentContext |

### Rewrite Text

`com.apple.WritingTools.WritingToolsAppIntentsExtension.RewriteTextIntent` · key `com_apple_writing_tools_writing_tools_app_intents_extension_rewrite_text`
  
Rewrites the provided text using Apple Intelligence.
  
Output: Text `attributedString`

| Key | Name | Kind | Type |
|---|---|---|---|
| `text` | Text | text | richText |

### Summarize Text

`com.apple.WritingTools.WritingToolsAppIntentsExtension.SummarizeTextIntent` · key `com_apple_writing_tools_writing_tools_app_intents_extension_summarize_text`
  
Generates a summary of the provided text using Apple Intelligence.
  
Output: Text `attributedString`

| Key | Name | Kind | Type |
|---|---|---|---|
| `text` | Text | text | richText |
| `summaryType` | Summary Style | string | enum: `createKeyPoints`, `summarize` |

## com.apple.AppKit (`com.apple.AppKit`)

### Fetch Intelligence Commands

`com.apple.AppKit.FetchIntelligenceCommands` · key `com_apple_app_kit_fetch_intelligence_commands`
  
Fetch Intelligence Commands
  
Output: IntelligenceCommand Entities `com.apple.AppKit.IntelligenceCommandEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |
| `cachedIfAvailable` | Cached if Available | bool | bool |
| `includeUntitled` | Include Untitled | bool | bool |
| `includeNonPerformable` | Include Non-Performable | bool | bool |

### Insert Intelligence Text

`com.apple.AppKit.InsertIntelligenceText` · key `com_apple_app_kit_insert_intelligence_text`
  
Insert Intelligence Text
  
Output: Insertion Result `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |
| `text` | Text | text | string |
| `replaceExisting` | Replace Existing | bool | bool |
| `targetWindowIdentifier` | Target Window Identifier | text | string |
| `targetFrame` | Target Frame | text | string |

### Present Writing Tools Result

`com.apple.AppKit.PresentWritingToolsResult` · key `com_apple_app_kit_present_writing_tools_result`
  
Present Writing Tools Result
  
Output: Presentation Result `bool`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `text` | Text | text | string |
| `replaceExisting` | Replace Existing | bool | bool |
| `targetWindowIdentifier` | Target Window Identifier | text | string |
| `targetFrame` | Target Frame | text | string |
| `precomputedCitationsJSON` | Precomputed Citations JSON | text | string |
| `precomputedContentAdvisoriesJSON` | Precomputed Content Advisories JSON | text | string |

### Request Editing Context

`com.apple.AppKit.RequestEditingContext` · key `com_apple_app_kit_request_editing_context`
  
Request editing context from Writing Tools
  
Output: Editing Context Result `com.apple.AppKit.EditingContextResult`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `targetWindowIdentifier` | Target Window Identifier | text | string |
| `targetFrame` | Target Frame | text | string |

### Run Intelligence Command

`com.apple.AppKit.RunIntelligenceCommand` · key `com_apple_app_kit_run_intelligence_command`
  
Execute an Intelligence Command
  
Output: Execution Status `com.apple.AppKit.RunIntelligenceCommandResultEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |
| `command` | Command | any | entity IntelligenceCommandEntity |

### Run Intelligence Command For Key

`com.apple.AppKit.RunIntelligenceCommandForKey` · key `com_apple_app_kit_run_intelligence_command_for_key`
  
Execute an Intelligence Command matching an identifier or title
  
Output: Execution Status `com.apple.AppKit.RunIntelligenceCommandResultEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |
| `identifier` | Command Identifier | text | string |
| `command` | Command Name | text | string |
| `hierarchyComponents` | Command Hierarchy Components | text | string |

### Activate Tab

`com.apple.AppKit.WindowTabActivateIntent` · key `com_apple_app_kit_activate_tab`
  
Activates a window tab.
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |
| `windowTab` | WindowTab | any | entity WindowTabEntity |

### Find Window Tab

`com.apple.AppKit.WindowTabEntity` · key `com_apple_app_kit_find_window_tab`
  
Output: Window Tab `com.apple.AppKit.WindowTabEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `active`, `appName`, `groupIdentifier`, `title` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | window tab | string | enum: `Library` |

### Can Perform Writing Tools

`com.apple.AppKit.WritingToolsCanPerformIntent` · key `com_apple_app_kit_can_perform_writing_tools`
  
Writing Tools need a focused text view to work. This intent checks if Writing Tools can be used with the current environment.
  
Output:  `bool`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |

### Text Compose

`com.apple.AppKit.WritingToolsComposeIntent` · key `com_apple_app_kit_text_compose`
  
Invoke Writing Tools and compose text.
  
Output: Writing Tools Result `com.apple.AppKit.WritingToolsResult`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |
| `prompt` | Prompt | text | string |

### Open Ended

`com.apple.AppKit.WritingToolsOpenEndedIntent` · key `com_apple_app_kit_open_ended`
  
Invoke Writing Tools and rewrite or compose text with the given prompt.
  
Output: Writing Tools Result `com.apple.AppKit.WritingToolsResult`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |
| `prompt` | Prompt | text | string |

### Text Compose

`com.apple.AppKit.WritingToolsPartnerIntent` · key `com_apple_app_kit_text_compose`
  
Invoke Writing Tools and compose text.
  
Output: Writing Tools Result `com.apple.AppKit.WritingToolsResult`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |
| `prompt` | Prompt | text | string |
| `externalProviderID` | ExternalProviderID | text | string |

### Proofread

`com.apple.AppKit.WritingToolsProofreadIntent` · key `com_apple_app_kit_proofread`
  
Invoke Writing Tools and proofread the current text.
  
Output: Writing Tools Result `com.apple.AppKit.WritingToolsResult`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |

### Rewrite

`com.apple.AppKit.WritingToolsRewriteIntent` · key `com_apple_app_kit_rewrite`
  
Invoke Writing Tools and rewrite the current text.
  
Output: Writing Tools Result `com.apple.AppKit.WritingToolsResult`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |
| `type` | Type | string | enum: `WTUIRequestedToolCompose`, `WTUIRequestedToolProofreading`, `WTUIRequestedToolRewriteConcise`, `WTUIRequestedToolRewriteFriendly`, `WTUIRequestedToolRewriteOpenEnded`, `WTUIRequestedToolRewriteProfessional`, `WTUIRequestedToolRewriting`, `WTUIRequestedToolSummary`, `WTUIRequestedToolTransformKeyPoints`, `WTUIRequestedToolTransformList`, `WTUIRequestedToolTransformTable` |
| `prompt` | Prompt | text | string |

### Summarize

`com.apple.AppKit.WritingToolsSummarizeIntent` · key `com_apple_app_kit_summarize`
  
Invoke Writing Tools and summarize the current text.
  
Output: Writing Tools Result `com.apple.AppKit.WritingToolsResult`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |

### Key Points

`com.apple.AppKit.WritingToolsTransformKeyPointsIntent` · key `com_apple_app_kit_key_points`
  
Invoke Writing Tools and transform the current text into key points.
  
Output: Writing Tools Result `com.apple.AppKit.WritingToolsResult`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |

### List

`com.apple.AppKit.WritingToolsTransformListIntent` · key `com_apple_app_kit_list`
  
Invoke Writing Tools and transform the current text into a list.
  
Output: Writing Tools Result `com.apple.AppKit.WritingToolsResult`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |

### Table

`com.apple.AppKit.WritingToolsTransformTableIntent` · key `com_apple_app_kit_table`
  
Invoke Writing Tools and transform the current text into a table.
  
Output: Writing Tools Result `com.apple.AppKit.WritingToolsResult`

| Key | Name | Kind | Type |
|---|---|---|---|
| `app` | App | any | app |
| `processInstanceIdentifier` | Process Identifier | text | string |

## sociallayerd (`com.apple.sociallayerd`)

### Share and Collaborate

`com.apple.sociallayerd.CollaborationIntent` · key `com_apple_sociallayerd_share_and_collaborate`
  
Share or collaborate on a document, note, reminder, or file with one or more people
  
Output:  `none`

| Key | Name | Kind | Type |
|---|---|---|---|
| `recipients` | Recipients | any | person |

## usernotificationsd (`com.apple.usernotificationsd`)

### Find User Notification Type

`com.apple.usernotificationsd.UserNotificationEntity` · key `com_apple_usernotificationsd_find_user_notification_type`
  
Output: User Notification Type `com.apple.usernotificationsd.UserNotificationEntity`

| Key | Name | Kind | Type |
|---|---|---|---|
| `WFContentItemFilter` |  | any | type |
| `WFContentItemSortProperty` | Sort by | string | enum: `Random`, `application`, `body`, `date`, `recipients`, `sender`, `summary`, `threadIdentifier` |
| `WFContentItemSortOrder` | Order | text | string |
| `WFContentItemLimitEnabled` | Limit | bool | bool |
| `WFContentItemLimitNumber` | Get | number | double |
| `WFCompoundType` |  | string | enum: `0`, `1` |
| `WFContentItemInputParameter` | user notification type | string | enum: `Library` |
