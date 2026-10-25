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
// Dates cross JSON as { $date: "2026-01-01T00:00:00Z" } (test/verify/fixture.ts writes them so); revive() turns them back into NSDate.
function isoDate(d) { const f = $.NSISO8601DateFormatter.alloc.init; return str(f.stringFromDate(d)); }
function revive(v) {
  if (Array.isArray(v)) return v.map(revive);
  if (v && typeof v === "object") {
    if (typeof v.$date === "string" && Object.keys(v).length === 1) return $.NSISO8601DateFormatter.alloc.init.dateFromString(v.$date);
    const o = {}; for (const [k, x] of Object.entries(v)) o[k] = revive(x); return o;
  }
  return v;
}
// Plain JSON view of Foundation values: strings, numbers, dictionaries, arrays; anything else by class name.
function plain(v, depth) {
  if (isNil(v) || isA(v, "NSNull")) return null;
  if (!isObj(v)) return typeof v === "object" || typeof v === "function" ? String(v) : v;
  if (depth > 8) return str(v.description);
  if (isA(v, "NSString") || isA(v, "NSNumber")) return str(v);
  if (isA(v, "NSDate")) return { $date: isoDate(v) };
  if (isA(v, "NSDictionary")) { const d = {}; const keys = v.allKeys; for (let i = 0; i < keys.count; i++) { const k = keys.objectAtIndex(i); d[str(k.description)] = plain(v.objectForKey(k), depth + 1); } return d; }
  if (isA(v, "NSArray")) { const a = []; for (let i = 0; i < count(v); i++) a.push(plain(v.objectAtIndex(i), depth + 1)); return a; }
  return "<" + cls(v) + ">";
}
// JSON with object keys sorted at every level, for comparing serializations.
function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object") { const o = {}; for (const k of Object.keys(v).sort()) o[k] = sortKeys(v[k]); return o; }
  return v;
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

// App Intents entities without linkd: from an entity's properties (as data/apple-entities.json
// records them) build the LinkMetadata objects linkd would hand the editor, and let
// -[LNEntityMetadata wf_contentItemClassWithEntityValueType:queryMetadata:appBundleIdentifier:
// displayedAppBundleIdentifier:] make the entity's content item class, as it does for the real
// metadata. Used by extract-entities.js and verify-library-output.js.
function loadLinkMetadata() { $.dlopen("/System/Library/PrivateFrameworks/LinkMetadata.framework/LinkMetadata", RTLD_NOW); }
// The App Intents comparator type (LNQueryParameterComparatorMetadata.comparatorType) whose
// operator, by -[LNQueryParameterMetadata wf_supportedContentOperators], is each code; the other
// codes have no comparator (WorkflowKit adds the date ones itself). extract-entities.js checks it.
const COMPARATOR_FOR_OPERATOR = { 4: 0, 5: 1, 2: 2, 3: 3, 0: 4, 1: 5, 99: 6, 8: 7, 9: 8, 1003: 9 };
// A property type (apple-entities.json's simplified form) -> the LinkMetadata value type linkd would describe it with, or null.
function linkValueType(s) {
  const P = klass("LNPrimitiveValueType");
  const intents = (id) => { ObjC.bindFunction("objc_msgSend", ["void *", ["void *", "void *", "unsigned long", "void *"]]); return ObjC.castRefToObject($.objc_msgSend(allocRef("LNIntentsValueType"), $.sel_registerName("initWithTypeIdentifier:contentType:"), id, NIL())); };
  if (s.kind === "primitive") {
    const m = { string: P.stringValueType, richText: P.attributedStringValueType, bool: P.boolValueType, int: P.intValueType, double: P.doubleValueType,
      date: P.dateValueType, dateComponents: P.dateComponentsValueType, url: P.URLValueType, location: P.placemarkValueType };
    if (m[s.primitive]) return m[s.primitive];
    // SiriKit-era types take the numeric identifiers extract-encoding-table.js documents.
    const n = { app: 0, person: 3, file: 12, currencyAmount: 14 }[s.primitive];
    return n === undefined ? null : intents(n);
  }
  if (s.kind === "entity") return make("LNEntityValueType", "initWithIdentifier:", s.typeName);
  if (s.kind === "enum") return make("LNLinkEnumerationValueType", "initWithEnumerationIdentifier:", s.typeName);
  if (s.kind === "array") { const m = linkValueType(s.of); return m && make("LNArrayValueType", "initWithMemberValueType:", m); }
  return null;
}
const linkTitle = (s) => make("LNStaticDeferredLocalizedString", "initWithKey:defaultValue:table:bundleURL:", s, s, null, null);
function linkComparator(type, vt) {
  ObjC.bindFunction("objc_msgSend", ["void *", ["void *", "void *", "long", "void *", "void *"]]);
  return ObjC.castRefToObject($.objc_msgSend(allocRef("LNQueryParameterComparatorMetadata"), $.sel_registerName("initWithComparatorType:valueType:resolvableInputTypes:"), type, toRef(vt), toRef($([]))));
}
function integers(list) { const r = []; if (isNil(list)) return r; for (let i = 0; i < count(list); i++) r.push(Number(list.objectAtIndex(i).integerValue)); return r; }
// entity: { typeName, name, bundleIdentifier }; properties: { id: { name, type, operators? } }, where
// a property with operators is a query parameter (filterable). Returns { name, included } (the class
// name and the property ids that had a value type), or null when no property has one.
function entityContentClass(entity, properties) {
  const props = [], params = [], included = new Set();
  for (const [pid, p] of Object.entries(properties)) {
    const vt = linkValueType(p.type);
    if (!vt || isNil(vt)) continue;
    included.add(pid);
    // Titled by identifier: some entities list a property twice under one title (Notes' creationDate and the
    // query's "Creation Date"), and the class keeps one property per title.
    props.push(make("LNPropertyMetadata", "initWithIdentifier:valueType:title:", pid, vt, linkTitle(pid)));
    if (!p.operators) continue;
    const comps = p.operators.filter((o) => o in COMPARATOR_FOR_OPERATOR).map((o) => linkComparator(COMPARATOR_FOR_OPERATOR[o], vt));
    params.push(make("LNQueryParameterMetadata", "initWithPropertyIdentifier:localizedTitle:comparators:", pid, p.name || pid, $(comps)));
  }
  if (!props.length) return null;
  const ent = make("LNEntityMetadata", "initWithTypeName:mangledTypeName:mangledTypeNameByBundleIdentifier:effectiveBundleIdentifiers:displayTypeName:properties:customIntentTypeClassName:",
    entity.typeName, entity.typeName, $({}), $.NSOrderedSet.orderedSet, linkTitle(entity.name || entity.typeName), $(props), null);
  ObjC.bindFunction("objc_msgSend", ["void *", ["void *", "void *", "void *", "long", "void *", "void *", "void *", "void *", "void *", "void *"]]);
  const q = ObjC.castRefToObject($.objc_msgSend(allocRef("LNQueryMetadata"), $.sel_registerName("initWithIdentifier:queryType:entityType:mangledTypeName:mangledTypeNameByBundleIdentifier:effectiveBundleIdentifiers:parameters:sortingOptions:"),
    toRef(entity.typeName + "Query"), 0, toRef(entity.typeName), toRef(entity.typeName + "Query"), toRef($({})), toRef($.NSOrderedSet.orderedSet), toRef($(params)), toRef($([]))));
  const evt = make("LNEntityValueType", "initWithIdentifier:", entity.typeName);
  const ref = sendObjects(ObjC.castObjectToRef(ent), "wf_contentItemClassWithEntityValueType:queryMetadata:appBundleIdentifier:displayedAppBundleIdentifier:", evt, q, entity.bundleIdentifier, entity.bundleIdentifier);
  return { name: $.class_getName(ref), included };
}
// Load a WFContentItemFilter value through a Find action on a content item class. Returns the rows
// the engine parsed ({ property, operator, values: { key: state class } }) and the filter as the
// engine serializes it again.
function loadFilter(className, filter) {
  const def = make("WFActionDefinition", "initWithDictionary:", $({ ActionClass: "WFContentItemFilterAction", WFContentItemClass: className, Name: "Find" }));
  const a = make("WFContentItemFilterAction", "initWithIdentifier:definition:serializedParameters:", "find", def, $({ WFContentItemFilter: filter }));
  const state = a.parameterStateForKey("WFContentItemFilter");
  if (isNil(state)) return { rows: [], serialized: null };
  const d = str(state.debugDescription), rows = [];
  const re = /RowTemplateFindFilterParameterState\(contentItemClass: [^,]+, contentProperty: <WFContentProperty: [^,]+,(?: keyPath: [^,]+, block: [^,]+,)? name: ([^,]+),[\s\S]*?selectedOperator: ([^,]+?), parameterStates: \[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(d))) rows.push({ property: m[1], operator: m[2], values: Object.fromEntries((m[3].match(/"(\w+)": <(\w+)/g) || []).map((x) => x.match(/"(\w+)": <(\w+)/).slice(1))) });
  return { rows, serialized: plain(state.serializedRepresentation, -8) }; // filters nest deeper than plain()'s usual limit
}
// The content item classes a property aggrandizement yields on a class; empty when the engine finds no such property.
function propertyContentClasses(className, aggrandizement) {
  const ag = make("WFPropertyVariableAggrandizement", "initWithDictionary:", $(aggrandizement));
  const pc = ag.processedContentClasses($.NSOrderedSet.orderedSetWithObject(klass(className)));
  const out = []; const arr = isObj(pc) ? items(pc) : null;
  if (arr) for (let i = 0; i < count(arr); i++) out.push(str($.NSStringFromClass(arr.objectAtIndex(i))));
  return out;
}
