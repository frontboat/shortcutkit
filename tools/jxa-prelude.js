// Shared prelude for the JXA extraction probes (concatenated in front of each script by
// extract-builtin-actions.sh; osascript has no module system).
//
// Why JXA: about a quarter of the built-in actions (Ask for Input, Show Alert, Count, URL, ...)
// live in ActionKit.framework, whose +[WFActionKitStaticInitializer load] asserts that the host
// is an Apple platform binary. osascript is one, has no library validation, and can dlopen
// frameworks and call Objective-C through the bridge. A platform process refuses to map any
// non-platform code, so the probes cannot be compiled; they are written in JavaScript.
ObjC.import("Foundation");
ObjC.import("AppKit");
ObjC.bindFunction("dlopen", ["void *", ["string", "int"]]);
ObjC.bindFunction("objc_getClass", ["void *", ["string"]]);
ObjC.bindFunction("class_getSuperclass", ["void *", ["void *"]]);
ObjC.bindFunction("class_getName", ["string", ["void *"]]);
ObjC.bindFunction("class_copyMethodList", ["void **", ["void *", "unsigned int *"]]);
ObjC.bindFunction("method_getName", ["void *", ["void *"]]);
ObjC.bindFunction("sel_getName", ["string", ["void *"]]);
ObjC.bindFunction("free", ["void", ["void *"]]);

const RTLD_NOW = 2;
function loadEngine() {
  // ActionKit first: its +load registers the actions it owns with WorkflowKit's provider.
  // dlopen hands back a raw pointer the bridge cannot test for NULL, so success is checked
  // by the presence of a class each framework defines.
  $.dlopen("/System/Library/PrivateFrameworks/ActionKit.framework/ActionKit", RTLD_NOW);
  $.dlopen("/System/Library/PrivateFrameworks/WorkflowKit.framework/WorkflowKit", RTLD_NOW);
  if (!hasClass("WFBundledActionProvider")) throw new Error("WorkflowKit did not load or its internals changed");
  if (!hasClass("WFAskForInputAction")) throw new Error("ActionKit did not load; is this process a platform binary (osascript)?");
}
const str = (v) => ObjC.unwrap(v);
const cls = (v) => str(v.className);
const isNil = (v) => v === null || v === undefined || ((typeof v === "object" || typeof v === "function") && typeof v.isNil === "function" && v.isNil());
// The bridge hands some return values back as JavaScript primitives or raw pointers.
// Bridged Objective-C objects are callable proxies, so typeof reports "function" for them.
const isObj = (v) => v !== null && (typeof v === "object" || typeof v === "function") && typeof v.isKindOfClass === "function";
const count = (v) => Number(v.count); // Swift-backed arrays hand count back as a string
const isA = (v, name) => isObj(v) && v.isKindOfClass($[name]);
const klass = (name) => $.NSClassFromString(name);
const hasClass = (name) => !klass(name).isNil();
const items = (v) => (isA(v, "NSArray") ? v : isA(v, "NSSet") ? v.allObjects : v.array); // NSOrderedSet -> array
// Direct message sends on raw pointers. The bridge's own `Class.alloc.initWith...` chain does not
// resolve initializers of these private classes, so instances are created through objc_msgSend.
ObjC.bindFunction("sel_registerName", ["void *", ["string"]]);
const toRef = (v) => (typeof v === "object" || typeof v === "function") && typeof v.isKindOfClass === "function" ? ObjC.castObjectToRef(v) : ObjC.castObjectToRef($(v));
const NIL = () => ObjC.castObjectToRef($());
function sendObjects(targetRef, selector, ...args) {
  const sig = ["void *", ["void *", "void *"].concat(args.map(() => "void *"))];
  ObjC.bindFunction("objc_msgSend", sig);
  return $.objc_msgSend(targetRef, $.sel_registerName(selector), ...args.map((a) => (a === null ? NIL() : toRef(a))));
}
const allocRef = (className) => sendObjects($.objc_getClass(className), "alloc");
// [[cls alloc] selector:args...] with object arguments; null passes nil.
function make(className, selector, ...args) { return ObjC.castRefToObject(sendObjects(allocRef(className), selector, ...args)); }
function makeBool(className, selector, b) {
  ObjC.bindFunction("objc_msgSend", ["void *", ["void *", "void *", "bool"]]);
  return ObjC.castRefToObject($.objc_msgSend(allocRef(className), $.sel_registerName(selector), b));
}
function makeUInts(className, selector, a, b) {
  ObjC.bindFunction("objc_msgSend", ["void *", ["void *", "void *", "unsigned long", "unsigned short"]]);
  return ObjC.castRefToObject($.objc_msgSend(allocRef(className), $.sel_registerName(selector), a, b));
}
// WFIntentActionProvider also lists SiriKit intents of whatever App Store apps are installed
// (Keynote, Pages, ...). Only intents whose app ships with macOS belong in committed data:
// those resolve to /System or to no app at all (Apple Watch settings, Accessibility).
function isSystemBundle(bundleId) {
  if (!bundleId) return true;
  const url = $.NSWorkspace.sharedWorkspace.URLForApplicationWithBundleIdentifier(bundleId);
  if (isNil(url)) return true;
  return str(url.path).startsWith("/System/");
}
function methodNames(className) {
  const out = [];
  for (let c = $.objc_getClass(className); ; c = $.class_getSuperclass(c)) {
    const name = $.class_getName(c); // the runtime returns "nil" for a NULL class
    if (name === "NSObject" || name === "nil") break;
    const n = Ref("unsigned int"); const ms = $.class_copyMethodList(c, n);
    for (let i = 0; i < n[0]; i++) out.push($.sel_getName($.method_getName(ms[i])));
    $.free(ms);
  }
  return out;
}
// Plain JSON view of Foundation values: strings, numbers, dictionaries, arrays; anything else by class name.
function plain(v, depth) {
  if (isNil(v) || isA(v, "NSNull")) return null;
  if (!isObj(v)) return typeof v === "object" || typeof v === "function" ? String(v) : v;
  if (depth > 8) return str(v.description);
  if (isA(v, "NSString") || isA(v, "NSNumber")) return str(v);
  if (isA(v, "NSDictionary")) { const d = {}; const keys = v.allKeys; for (let i = 0; i < keys.count; i++) { const k = keys.objectAtIndex(i); d[str(k.description)] = plain(v.objectForKey(k), depth + 1); } return d; }
  if (isA(v, "NSArray")) { const a = []; for (let i = 0; i < count(v); i++) a.push(plain(v.objectAtIndex(i), depth + 1)); return a; }
  return "<" + cls(v) + ">";
}
function writeJSON(path, value) {
  const err = Ref();
  const json = $.NSJSONSerialization.dataWithJSONObjectOptionsError($(value), 1 | 2, err); // pretty | sortedKeys
  if (json.isNil()) throw new Error("JSON error: " + str(err[0].description));
  if (!json.writeToFileAtomically(path, true)) throw new Error("write failed: " + path);
}
function readJSON(path) {
  const s = $.NSString.stringWithContentsOfFileEncodingError(path, 4, null);
  if (s.isNil()) throw new Error("cannot read " + path);
  return JSON.parse(str(s));
}
