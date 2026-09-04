// Produces the definitive value-encoding table for .shortcut files by asking
// WorkflowKit's own classes to serialize:
//   - every WFVariable kind (action output, named variable, shortcut input, ...)
//   - a WFVariableString with embedded variables (the WFTextTokenString form)
//   - every parameter state class, constructed with a plain value and with a variable
//   - the 15 icon palette colors as WFWorkflowIcon reports them
//   - the operator codes each conditional subject type supports
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

  writeJSON(argv[0], out);
  console.log(Object.keys(states).length + " state classes, " + Object.keys(vars).length + " variables, " + Object.keys(appIntentValueTypes).length + " App Intents value types -> " + argv[0]);
}
