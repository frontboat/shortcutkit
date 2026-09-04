# Changelog

Versions follow semver for the whole repository: the TypeScript package, the Python package,
and the data they bundle are released together. Because the generated action catalogue is part
of the type surface, a data refresh is a **minor** release when it only adds actions or
parameters and a **major** release when it removes or retypes any. `bun run changelog` prints
the section for a fresh extraction from the diff against the committed data.

## 0.1.0

First release.

### Data: macOS 27.0 (26A5421a), Shortcuts 10.0 build 5037.0.17, extracted 2026-09-04T08:40:04Z

Initial extraction: 339 built-in actions, 870 parameters, 52 parameter classes.
