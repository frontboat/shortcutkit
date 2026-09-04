# Changelog

Versions follow semver for the whole repository: the TypeScript package, the Python package,
and the data they bundle are released together. Because the generated action catalogue is part
of the type surface, a data refresh is a **minor** release when it only adds actions or
parameters and a **major** release when it removes or retypes any. `bun run changelog` prints
the section for a fresh extraction from the diff against the committed data.

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
