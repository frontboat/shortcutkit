# Changelog

Versions follow semver for the whole repository: the TypeScript package, the Python package,
and the data they bundle are released together. Because the generated action catalogue is part
of the type surface, a data refresh is a **minor** release when it only adds actions or
parameters and a **major** release when it removes or retypes any. `bun run changelog` prints
the section for a fresh extraction from the diff against the committed data.

## 0.1.0 (2026-09-04)

First release, published to npm and PyPI.

- TypeScript package for Node 20+ and Bun: typed `actions.*` catalogue, value helpers,
  control flow, `write()` and `sign()`.
- Python package for 3.9+ with the same API and run-time kind checks.
- Format reference, action reference, encoding reference and extraction notes in `docs/`.

### Data: macOS 27.0 (26A5421a), Shortcuts 10.0 build 5037.0.17, extracted 2026-09-04T09:32:49Z

Initial extraction: 339 built-in actions, 870 parameters, 52 parameter classes.
