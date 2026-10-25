function run(input, parameters) {
  // Loader: evaluates ~/.shortcutkit-dev/payload.js (a user-only directory) inside ShortcutsMacHelper and returns main()'s result.
  ObjC.import("Foundation");
  const path = ObjC.unwrap($("~/.shortcutkit-dev/payload.js").stringByExpandingTildeInPath);
  const src = $.NSString.stringWithContentsOfFileEncodingError(path, 4, null);
  if (src.isNil()) return "no payload at " + path;
  try { return String(eval(ObjC.unwrap(src) + "\n;main();")); } catch (e) { return "payload error: " + e; }
}
