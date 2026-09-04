// Dumps every built-in Shortcuts action definition to JSON by asking WorkflowKit's bundled
// action provider, the same object Shortcuts.app uses to build the action list, with
// ActionKit loaded so its actions are included. See jxa-prelude.js for why this is JXA.
//
//   cat tools/jxa-prelude.js tools/extract-builtin-actions.js > /tmp/x.js
//   osascript -l JavaScript /tmp/x.js data/builtin-actions.json

// Human-readable fields are LocalizedStringResource values bridged into ObjC.
// Their -description embeds the key and the English default; take the default.
function resolveLocalized(v) {
  if (v.respondsToSelector("localizedString")) {
    const s = v.localizedString;
    if (!s.isNil() && isA(s, "NSString")) return str(s);
  }
  const desc = str(v.description);
  const m = /defaultValue: [^\n]*?key: "((?:[^"\\]|\\.)*)"/.exec(desc);
  return m ? m[1] : desc;
}

function sanitize(v, depth) {
  if (isNil(v) || isA(v, "NSNull")) return null;
  if (!isObj(v)) return typeof v === "object" || typeof v === "function" ? String(v) : v;
  if (depth > 16) return str(v.description);
  const cn = cls(v);
  if (cn.startsWith("WF") && cn.includes("Definition")) {
    // WFActionDefinition, WFParameterDefinition and WFActionDescriptionDefinition are thin
    // wrappers around one NSDictionary ivar, _definition.
    const d = v.valueForKey("_definition");
    return d.isNil() ? str(v.description) : sanitize(d, depth + 1);
  }
  if (cn === "WFParameterSummaryValue") {
    const d = {};
    const key = v.key, fmtL = v.localizedSummaryString, fmt = v.summaryString, req = v.requiredValues;
    if (!key.isNil()) d.key = sanitize(key, depth + 1);
    if (!fmtL.isNil()) d.format = sanitize(fmtL, depth + 1); else if (!fmt.isNil()) d.format = sanitize(fmt, depth + 1);
    if (!req.isNil() && req.count > 0) d.requiredValues = sanitize(req, depth + 1);
    return d;
  }
  if (cn === "WFParameterSummary") {
    const d = {};
    const fmtL = v.singleFormatLocalizedString, fmt = v.singleFormatString, title = v.title, vals = v.possibleValues;
    if (!fmtL.isNil()) d.format = sanitize(fmtL, depth + 1); else if (!fmt.isNil()) d.format = sanitize(fmt, depth + 1);
    if (!title.isNil()) d.title = sanitize(title, depth + 1);
    if (!vals.isNil()) d.possibleValues = sanitize(vals, depth + 1);
    return d;
  }
  // A Swift array of localized strings carries the element type in its runtime class name;
  // it must be walked as an array, not resolved as one string.
  const container = isA(v, "NSArray") || isA(v, "NSSet") || isA(v, "NSOrderedSet") || isA(v, "NSDictionary");
  if (!container && (cn.includes("LocalizationResource") || cn.includes("LocalizedStringResource"))) return resolveLocalized(v);
  // RequiredResources entries (device idiom, capability, Apple Intelligence access, ...)
  // have no dictionary form; emit the class name, never a pointer.
  if (cn.includes("Resource") && (cn.startsWith("WF") || cn.includes(".WF"))) {
    const dot = cn.lastIndexOf(".");
    return { resource: dot >= 0 ? cn.slice(dot + 1) : cn };
  }
  if (isA(v, "NSString") || isA(v, "NSNumber")) return str(v);
  if (isA(v, "NSDictionary")) {
    const d = {}; const keys = v.allKeys;
    for (let i = 0; i < count(keys); i++) { const k = keys.objectAtIndex(i); d[str(k.description)] = sanitize(v.objectForKey(k), depth + 1); }
    return d;
  }
  if (isA(v, "NSArray") || isA(v, "NSSet") || isA(v, "NSOrderedSet")) {
    const a = []; const xs = items(v);
    for (let i = 0; i < count(xs); i++) a.push(sanitize(xs.objectAtIndex(i), depth + 1));
    return a;
  }
  if (isA(v, "NSData")) return "<data " + v.length + " bytes>";
  // Swift arrays of LocalizedStringResource (enum parameter Items) arrive boxed as
  // __SwiftValue with no ObjC element access; render-builtin-actions.py parses these.
  return str(v.description);
}

function run(argv) {
  if (argv.length < 1) { throw new Error("usage: extract-builtin-actions.js out.json"); }
  loadEngine();
  if (!hasClass("WFBundledActionProvider")) { throw new Error("WFBundledActionProvider not found; WorkflowKit internals changed"); }
  const provider = klass("WFBundledActionProvider").alloc.init;
  const ids = provider.availableActionIdentifiers;
  const defs = provider.actionDefinitionsWithIdentifiers(ids);
  if (!isA(defs, "NSDictionary")) { throw new Error("unexpected definitions type " + cls(defs)); }
  writeJSON(argv[0], sanitize(defs, 0));
  console.log(defs.count + " actions -> " + argv[0]);
}
