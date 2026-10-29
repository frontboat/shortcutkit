// Produces the definitive value-encoding table for .shortcut files by asking
// WorkflowKit's own classes to serialize:
//   - every WFVariable kind (action output, named variable, shortcut input, ...)
//   - a WFVariableString with embedded variables (the WFTextTokenString form)
//   - every parameter state class, constructed with a plain value and with a variable
//   - the 15 icon palette colors as WFWorkflowIcon reports them
//   - the operator codes each conditional subject type supports, and what each code means
// See jxa-prelude.js for why this is JXA.
//
//   cat tools/jxa-prelude.js tools/extract-encoding-table.js > /tmp/x.js
//   osascript -l JavaScript /tmp/x.js data/encoding-table.json [data/parameter-encodings.json]
// The optional second argument supplies the state class names (from
// extract-parameter-encodings.js); without it a built-in list is used. Scanning every
// class in the process is avoided on purpose: +initialize on unrelated classes crashes.
function attempt(fn) { try { return fn(); } catch (e) { return "threw: " + e.message; } }
function serialized(state) { return isNil(state) ? "nil" : plain(state.serializedRepresentation, 0); }
function run(argv) {
  if (argv.length < 1) { throw new Error("usage: extract-encoding-table.js out.json [parameter-encodings.json]"); }
  loadEngine();
  const out = {};
  // Variables
  const named = make("WFUserDefinedVariable", "initWithName:variableProvider:aggrandizements:", "MyVar", null, null);
  const output = make("WFActionOutputVariable", "initWithOutputUUID:outputName:variableProvider:aggrandizements:", "11111111-2222-3333-4444-555555555555", "Stored Content", null, null);
  const vars = {};
  vars["WFUserDefinedVariable(MyVar)"] = plain(named.serializedRepresentation, 0);
  vars["WFActionOutputVariable"] = plain(output.serializedRepresentation, 0);
  vars["WFShortcutInputVariable"] = plain(make("WFShortcutInputVariable", "initWithVariableProvider:aggrandizements:", null, null).serializedRepresentation, 0);
  for (const cn of ["WFClipboardVariable", "WFCurrentDateVariable", "WFDeviceDetailsVariable", "WFCurrentAppVariable"])
    vars[cn] = plain(make(cn, "initWithAggrandizements:", null).serializedRepresentation, 0);
  vars["WFAskEachTimeVariable(prompt)"] = plain(make("WFAskEachTimeVariable", "initWithPrompt:", "Which one?").serializedRepresentation, 0);
  out.variables = vars;

  // Text with embedded variables
  const vs = make("WFVariableString", "initWithStringsAndVariables:", $(["Hello ", named, "!"]));
  out["variableString(Hello <MyVar>!)"] = plain(vs.serializedRepresentation, 0);

  // State classes: plain value and variable forms
  const states = {};
  const stateNames = new Set(["WFStringSubstitutableState", "WFBooleanSubstitutableState", "WFNumberSubstitutableState", "WFNumberStringSubstitutableState", "WFVariableStringParameterState", "WFVariableParameterState", "WFURLStringParameterState", "WFDateFieldParameterState", "WFStringParameterState", "WFNumberParameterState", "WFDictionaryParameterState", "WFAppDescriptorParameterState", "WFColorParameterState", "WFFileParameterState", "WFLocationParameterState", "WFINObjectSubstitutableState", "WFCalendarSubstitutableState", "WFWorkflowParameterState", "WFQuantityParameterState", "WFContactFieldEntry", "WFFontParameterState", "WFNSUnitSubstitutableState", "WFIntentDescriptorParameterState", "WFMediaItemState", "WFLinkEnumerationSubstitutableState", "WFLinkDynamicOptionSubstitutableState"]);
  if (argv.length > 1) {
    const enc = readJSON(argv[1]);
    for (const e of Object.values(enc.parameterClasses)) if (typeof e.stateClass === "string" && !e.stateClass.startsWith("_TtGC")) stateNames.add(e.stateClass);
  }
  const respondsTo = (c, sel) => c.instancesRespondToSelector(sel);
  for (const cn of [...stateNames].sort()) {
    if (!hasClass(cn)) continue;
    const c = klass(cn);
    const relevant = respondsTo(c, "serializedRepresentation") && (
      respondsTo(c, "initWithValue:") || respondsTo(c, "initWithVariable:") || respondsTo(c, "initWithNumber:") || respondsTo(c, "initWithString:") ||
      respondsTo(c, "initWithVariableString:") || respondsTo(c, "initWithKeyValuePairs:"));
    if (!relevant) continue;
    const e = {};
    if (respondsTo(c, "initWithValue:")) {
      const cands = { "value:string": "hello", "value:number": 5, "value:bool": true };
      for (const k of Object.keys(cands)) { const r = attempt(() => serialized(make(cn, "initWithValue:", cands[k]))); if (!(typeof r === "string" && r.startsWith("threw"))) e[k] = r; }
    }
    if (respondsTo(c, "initWithNumber:")) e["number:5"] = attempt(() => serialized(make(cn, "initWithNumber:", 5)));
    if (respondsTo(c, "initWithBoolValue:")) e["bool:YES"] = attempt(() => serialized(makeBool(cn, "initWithBoolValue:", true)));
    if (respondsTo(c, "initWithString:")) e["string:hello"] = attempt(() => serialized(make(cn, "initWithString:", "hello")));
    if (respondsTo(c, "initWithVariableString:")) e["variableString:Hello <MyVar>!"] = attempt(() => serialized(make(cn, "initWithVariableString:", vs)));
    if (respondsTo(c, "initWithVariable:")) {
      e["variable:MyVar"] = attempt(() => serialized(make(cn, "initWithVariable:", named)));
      e["variable:ActionOutput"] = attempt(() => serialized(make(cn, "initWithVariable:", output)));
    }
    if (respondsTo(c, "initWithKeyValuePairs:")) e["keyValuePairs:[]"] = attempt(() => serialized(make(cn, "initWithKeyValuePairs:", $([]))));
    if (Object.keys(e).length) states[cn] = e;
  }
  out.stateClasses = states;

  // Icon palette
  const palette = []; const icon = klass("WFWorkflowIcon");
  for (let i = 0; i < 15; i++) {
    const ic = makeUInts("WFWorkflowIcon", "initWithPaletteColor:glyphCharacter:", i, 61440);
    const v = Number(ic.backgroundColorValue); // the bridge returns 64-bit integers as strings
    palette.push({ palette: i, WFWorkflowIconStartColor: v >>> 0, signed: v, color: str(ic.backgroundColor.description) || "" });
  }
  out.iconPalette = palette;
  out.defaultGlyphCharacter = icon.defaultGlyphCharacter;

  // Conditional subject operator codes
  const ops = {};
  for (const cn of ["WFConditionalSubjectParameterState", "WFVariableConditionalSubjectState", "WFHomeAccessoryConditionalSubjectState"]) {
    if (!hasClass(cn)) continue;
    const c = klass(cn);
    const st = attempt(() => make(cn, "init"));
    const o = typeof st === "string" ? st : attempt(() => plain(st.supportedComparisonOperators, 0));
    ops[cn] = { subjectType: plain(attempt(() => c.subjectType), 0), operators: o === undefined ? null : o };
  }
  out.conditionalSubjectOperators = ops;

  // What each operator code means: load a Filter Files row with the code and read the name the
  // engine's row state gives it (`selectedOperator`). Only the codes it names are listed; any
  // other code traps the process (6 and 1004 were tried).
  const reg = klass("WFActionRegistry").sharedRegistry;
  const filterOperators = {};
  for (const code of [0, 1, 2, 3, 4, 5, 8, 9, 99, 100, 101, 999, 1000, 1001, 1002, 1003]) {
    filterOperators[code] = attempt(() => {
      const row = { Property: "Name", Operator: code, Removable: true, Values: { String: "x", Unit: 4 } };
      const t = { WFSerializationType: "WFContentPredicateTableTemplate", Value: { WFActionParameterFilterPrefix: 1, WFContentPredicateBoundedDate: false, WFActionParameterFilterTemplates: [row] } };
      const a = reg.createActionWithIdentifierSerializedParameters("is.workflow.actions.filter.files", $({ WFContentItemFilter: t }));
      const m = str(a.parameterStateForKey("WFContentItemFilter").debugDescription).match(/selectedOperator: ([^,]+?), parameterStates/);
      return m ? m[1] : null;
    });
  }
  out.filterOperators = filterOperators;

  // App Intents parameters. WorkflowKit maps each LinkMetadata value type to one of its own
  // parameter classes (-[LNValueType wf_parameterDefinitionWithParameterMetadata:]), whose
  // state class is the encoding. The metadata daemon is not involved, so this is observable
  // here; the parameter is then built from the definition to read its state class and default.
  $.dlopen("/System/Library/PrivateFrameworks/LinkMetadata.framework/LinkMetadata", RTLD_NOW);
  const appIntentValueTypes = {};
  if (hasClass("LNPrimitiveValueType") && hasClass("LNActionParameterMetadata")) {
    const P = klass("LNPrimitiveValueType");
    const metadataFor = (name, vt) => {
      ObjC.bindFunction("objc_msgSend", ["void *", ["void *", "void *", "void *", "void *", "bool", "void *", "void *", "void *"]]);
      return ObjC.castRefToObject($.objc_msgSend(allocRef("LNActionParameterMetadata"), $.sel_registerName("initWithName:valueType:optional:title:resolvableInputTypes:typeSpecificMetadata:"), toRef(name), toRef(vt), true, toRef(name), toRef($([])), toRef($({}))));
    };
    const entity = (id) => make("LNEntityValueType", "initWithIdentifier:", id);
    const enumeration = (id) => make("LNLinkEnumerationValueType", "initWithEnumerationIdentifier:", id);
    const array = (member) => make("LNArrayValueType", "initWithMemberValueType:", member);
    // SiriKit-era value types (IntentFile, IntentPerson, the app type, …) take a numeric type
    // identifier, the one the apps' extract.actionsdata uses: 0 app, 3 person, 12 file, 13 payment
    // method, 14 currency amount. Person and the entity-like ones have no WorkflowKit parameter class.
    const intents = (id) => { ObjC.bindFunction("objc_msgSend", ["void *", ["void *", "void *", "unsigned long", "void *"]]); return ObjC.castRefToObject($.objc_msgSend(allocRef("LNIntentsValueType"), $.sel_registerName("initWithTypeIdentifier:contentType:"), id, NIL())); };
    const valueTypes = {
      string: P.stringValueType, richText: P.attributedStringValueType, bool: P.boolValueType, int: P.intValueType, double: P.doubleValueType,
      url: P.URLValueType, date: P.dateValueType, dateComponents: P.dateComponentsValueType, location: P.placemarkValueType,
      entity: entity("com.apple.reminders.ListEntity"), enum: enumeration("com.apple.reminders.PriorityLevel"),
      "array<string>": array(P.stringValueType), "array<bool>": array(P.boolValueType), "array<entity>": array(entity("com.apple.reminders.ReminderEntity")), "array<enum>": array(enumeration("com.apple.reminders.PriorityLevel")),
      app: intents(0), person: intents(3), file: intents(12), paymentMethod: intents(13), currencyAmount: intents(14), "array<file>": array(intents(12)),
    };
    for (const [name, vt] of Object.entries(valueTypes)) {
      appIntentValueTypes[name] = attempt(() => {
        const d = vt.wf_parameterDefinitionWithParameterMetadata(metadataFor("p", vt));
        if (isNil(d)) return { definitionClass: "(none)", parameterClass: "(none: WorkflowKit has no parameter class for this value type)" };
        const pcls = d.parameterClass;
        const e = { definitionClass: cls(d), parameterClass: isNil(pcls) ? "(none: WorkflowKit has no parameter class for this value type)" : str($.NSStringFromClass(pcls)) };
        if (isNil(pcls)) return e;
        try {
          const p = klass(e.parameterClass).parameterWithDefinition(d.parameterDefinitionDictionary);
          e.stateClass = str($.NSStringFromClass(p.singleStateClass)); e.default = plain(p.defaultSerializedRepresentation, 0);
        } catch (err) { e.stateClass = null; e.note = "parameter could not be built: " + err.message; }
        return e;
      });
    }
  }
  out.appIntentValueTypes = appIntentValueTypes;

  // Content item classes: every WFContentItem subclass the engine defines (94 on macOS 27), with the type name the
  // editor shows. `coercible` marks the ones a coercion aggrandizement can name, +[WFContentItem allSupportedItemClasses],
  // the editor's variable "Type" menu (22); the aggrandizement's parser takes any class name, so the library checks
  // against that list. `ownedTypes` (+ownedTypes) are the object classes and file types the class wraps: what a
  // definition's output type such as NSDecimalNumber or public.folder means in content item terms (a type several
  // classes own resolves to their common ancestor, else to none). The class's properties (+allProperties,
  // WFContentProperty objects) are the editor's "Get" list under its "Type" menu, and the names a property
  // aggrandizement resolves (PropertyName is the property's `name`, case-sensitive; `userInfo` is what the editor adds
  // as PropertyUserInfo, which the parser does not need). `yields` is the class the aggrandizement reads through
  // (-processedContentClasses:); an unknown name yields nothing, so it is the check. `coercesTo` is
  // +supportedItemClasses: the classes this one coerces to.
  const contentItemClasses = {};
  const coercible = new Set(); { const l = items(klass("WFContentItem").allSupportedItemClasses); for (let i = 0; i < count(l); i++) coercible.add($.class_getName(ObjC.castObjectToRef(l.objectAtIndex(i)))); }
  const typeList = (list) => { const r = []; if (isNil(list)) return r; const a = items(list); for (let i = 0; i < count(a); i++) { const t = a.objectAtIndex(i); const m = /^<(WF\w+): 0x[0-9a-f]+>: (.*)$/.exec(str(t.description)); r.push(m ? { kind: m[1] === "WFFileType" ? "file" : "class", name: m[2] } : { kind: cls(t), name: str(t.description) }); } return r; };
  const subclasses = contentItemSubclasses();
  for (const className of Object.keys(subclasses).sort()) {
    const c = klass(className);
    const tryOr = (fn, fallback) => { try { const v = fn(); return isNil(v) ? fallback : v; } catch (e) { return fallback; } }; // a few classes raise on class methods (WFLinkCodableValueContentItem)
    const rec = { name: tryOr(() => str(c.localizedTypeDescription), null), plural: tryOr(() => str(c.localizedPluralTypeDescription), null), superclass: subclasses[className], coercible: coercible.has(className), ownedTypes: tryOr(() => typeList(c.ownedTypes), []), properties: [], coercesTo: [] };
    const all = tryOr(() => items(c.allProperties), null);
    if (all) for (let j = 0; j < count(all); j++) {
      const p = all.objectAtIndex(j);
      const yields = propertyContentClasses(className, { Type: "WFPropertyVariableAggrandizement", PropertyName: str(p.name) });
      rec.properties.push({ name: str(p.name), userInfo: plain(p.userInfo, 0), valueClass: isNil(p.valueItemClass) ? null : str($.NSStringFromClass(p.valueItemClass)), yields, multiple: !!p.multipleValues, filterable: !!p.isFilterable, sortable: !!p.isSortable, gettable: !!p.isGettable });
    }
    const targets = tryOr(() => c.supportedItemClasses, null);
    if (targets) { const a = items(targets); for (let j = 0; j < count(a); j++) rec.coercesTo.push(str($.NSStringFromClass(a.objectAtIndex(j)))); }
    contentItemClasses[className] = rec;
  }
  out.contentItemClasses = contentItemClasses;

  // Dictionary items: what WFDictionaryParameterState writes back for a dictionary holding every form the
  // library writes (text, nested dictionary, array, number, boolean; a key and values holding a reference).
  // The engine names only the codes (WFItemType); text/dictionary/array/number/boolean are the editor's
  // names for them. A code outside 0-4 raises in the parser; the value forms it accepts but rewrites are
  // recorded as `rewritten` (a nested dictionary given without the outer wrapper, a number given bare).
  const token = (s, att) => ({ WFSerializationType: "WFTextTokenString", Value: att ? { string: s + "\uFFFC", attachmentsByRange: { ["{" + s.length + ", 1}"]: att } } : { string: s, attachmentsByRange: {} } });
  const myVar = { Type: "Variable", VariableName: "MyVar" };
  const dict = (items) => ({ WFSerializationType: "WFDictionaryFieldValue", Value: { WFDictionaryFieldValueItems: items } });
  const nested = (items) => ({ WFSerializationType: "WFDictionaryFieldValue", Value: dict(items) });
  const array = (items) => ({ WFSerializationType: "WFArrayParameterState", Value: items });
  const bool = (v) => ({ WFSerializationType: "WFNumberSubstitutableState", Value: v });
  const dictionarySample = dict([
    { WFKey: token("text"), WFItemType: 0, WFValue: token("hello") },
    { WFKey: token("textWithReference"), WFItemType: 0, WFValue: token("Hi ", myVar) },
    { WFKey: token("", myVar), WFItemType: 0, WFValue: token("key from a reference") },
    { WFKey: token("dictionary"), WFItemType: 1, WFValue: nested([{ WFKey: token("k"), WFItemType: 0, WFValue: token("v") }]) },
    { WFKey: token("array"), WFItemType: 2, WFValue: array(["plain text", { WFItemType: 0, WFValue: token("with ", myVar) }, { WFItemType: 3, WFValue: token("7") }, { WFItemType: 4, WFValue: bool(false) }, { WFItemType: 1, WFValue: nested([]) }, { WFItemType: 2, WFValue: array(["z"]) }]) },
    { WFKey: token("number"), WFItemType: 3, WFValue: token("5") },
    { WFKey: token("numberFromReference"), WFItemType: 3, WFValue: token("", myVar) },
    { WFKey: token("boolean"), WFItemType: 4, WFValue: bool(true) },
    { WFKey: token("booleanFromReference"), WFItemType: 4, WFValue: bool({ WFSerializationType: "WFTextTokenAttachment", Value: myVar }) },
  ]);
  const dictionaryState = (d) => make("WFDictionaryParameterState", "initWithSerializedRepresentation:variableProvider:parameter:", $(d), null, null);
  const reserialized = (d) => attempt(() => { const st = dictionaryState(d); return isNil(st) ? "rejected" : plain(st.serializedRepresentation, -40); });
  out.dictionaryItems = {
    sample: dictionarySample,
    serialized: reserialized(dictionarySample),
    rewritten: {
      nestedWithoutWrapper: reserialized(dict([{ WFKey: token("d"), WFItemType: 1, WFValue: dict([{ WFKey: token("k"), WFItemType: 0, WFValue: token("v") }]) }])),
      bareNumber: reserialized(dict([{ WFKey: token("n"), WFItemType: 3, WFValue: 5 }])),
      bareStrings: reserialized(dict([{ WFKey: "t", WFItemType: 0, WFValue: "hello" }])),
      booleanState: reserialized(dict([{ WFKey: token("b"), WFItemType: 4, WFValue: { WFSerializationType: "WFBooleanSubstitutableState", Value: true } }])),
    },
    itemType9: reserialized(dict([{ WFKey: token("x"), WFItemType: 9, WFValue: token("y") }])),
  };

  writeJSON(argv[0], out);
  console.log(Object.keys(states).length + " state classes, " + Object.keys(vars).length + " variables, " + Object.keys(appIntentValueTypes).length + " App Intents value types, " + Object.keys(contentItemClasses).length + " content item classes (" + Object.values(contentItemClasses).filter((c) => c.coercible).length + " coercible) -> " + argv[0]);
}
