// Apple's App Intents entity types: their properties, and the filters their Find actions take.
//
// Input is dump-toolkit-registry.py --entities: the Shortcuts app's index stores each entity's
// properties and filter templates as protobuf blobs. ToolKit's own classes decode them here
// (CCToolKitToolTypeInstance, CCToolKitToolTypeDefinitionVersion1QueryPredicateTemplates).
//
// WorkflowKit then builds each entity's content item class from those properties, as it does from
// linkd's metadata (entityContentClass() in the prelude). That class says, per property, whether a
// property aggrandizement finds it (and what content it yields), which parameter edits a filter
// row's value, whether it compares contact handles, and which calendar units "is in the last" offers.
// A Find action on the class then loads one row per property and operator with a sample value,
// and the row state the engine parses must have the operator and the value key that were written.
//
//   cat tools/jxa-prelude.js tools/extract-entities.js > /tmp/x.js
//   osascript -l JavaScript /tmp/x.js entities.json data/encoding-table.json data/apple-entities.json

// ToolKit's comparison kinds, by the engine's name for the operator each one is
// (filterOperators in encoding-table.json gives the code for each name).
const KIND_NAMES = {
  equalTo: "is", notEqualTo: "is not", greaterThan: "is greater than", greaterThanOrEqualTo: "is greater than or equal to",
  lessThan: "is less than", lessThanOrEqualTo: "is less than or equal to", contains: "contains", notContains: "does not contain",
  beginsWith: "begins with", endsWith: "ends with", isBetween: "is between", hasValue: "has any value", hasNoValue: "does not have any value",
  isToday: "is today", inTheLast: "is in the last", inTheNext: "is in the next",
};
// ToolKit primitive names -> the names apple-app-intents.json uses.
const PRIMITIVE = { attributedString: "richText", boolType: "bool", intType: "int", number: "double", placemark: "location" };
// The parameter that edits a row's value -> the row value key it fills (WFRowTemplateValue's
// string, number, boolean and date). Rows on other parameters (a variable picker for rich text,
// URLs, durations) are listed with their operators but no value kind.
const VALUE_KINDS = { WFTextInputParameter: "text", WFNumberFieldParameter: "number", WFSwitchParameter: "bool", WFDateFieldParameter: "date" };

function decode(className, b64) {
  const data = $.NSData.alloc.initWithBase64EncodedStringOptions(b64, 0);
  const o = make(className, "initWithData:error:", data, null);
  return isNil(o) ? null : ObjC.deepUnwrap(o.jsonDictionary);
}

// ToolKit type instance -> { kind, primitive | type, optional?, of? }.
function simplify(t, types) {
  if (t.optionalVariant) return Object.assign(simplify(t.optionalVariant.value, types), { optional: true });
  if (t.deferred) return simplify(t.deferred.identifier, types); // fetched lazily; same value type
  if (t.collection) return { kind: "array", of: simplify(t.collection, types) };
  if (t.unionType) return { kind: "union", of: t.unionType.items.map((x) => simplify(x, types)) };
  if (t.type && t.type.primitive) { const p = Object.keys(t.type.primitive)[0]; return { kind: "primitive", primitive: PRIMITIVE[p] || p }; }
  if (t.type && t.type.custom) {
    const id = t.type.custom.bundleIdentifier + "." + t.type.custom.typeName;
    return { kind: (types[id] && types[id].kind) || "unknown", type: id, typeName: t.type.custom.typeName, bundleIdentifier: t.type.custom.bundleIdentifier };
  }
  return { kind: "unknown" };
}

// A sample for each row value key, as the library writes it.
const token = (s) => ({ WFSerializationType: "WFTextTokenString", Value: { string: s, attachmentsByRange: {} } });
function sampleValues(kind, opName, units) {
  if (opName === "is today") return {};
  if (opName === "is in the last" || opName === "is in the next") return { Number: 1, Unit: units[0] };
  const date = $.NSDate.dateWithTimeIntervalSince1970(1767225600);
  if (opName === "is between") return kind === "date" ? { Date: date, AnotherDate: date } : null;
  return { text: { String: token("x") }, number: { Number: 1 }, bool: { Bool: true }, date: { Date: date },
    contactHandle: { ContactHandle: { WFSerializationType: "WFTokenStringParameterState", Value: "x" } } }[kind] || {};
}

function run(argv) {
  if (argv.length < 3) throw new Error("usage: extract-entities.js entities.json encoding-table.json out.json");
  loadEngine(); loadLinkMetadata();
  const input = readJSON(argv[0]), table = readJSON(argv[1]);
  const codeOf = {}; for (const [code, name] of Object.entries(table.filterOperators)) codeOf[name] = Number(code);
  for (const [kind, name] of Object.entries(KIND_NAMES)) if (!(name in codeOf)) throw new Error("no operator code named " + JSON.stringify(name) + " (ToolKit kind " + kind + ")");
  // Each comparator type must map to the operator it stands for.
  const P = klass("LNPrimitiveValueType");
  for (const [code, type] of Object.entries(COMPARATOR_FOR_OPERATOR)) {
    const p = make("LNQueryParameterMetadata", "initWithPropertyIdentifier:localizedTitle:comparators:", "p", "p", $([linkComparator(type, P.stringValueType)]));
    const got = integers(p.wf_supportedContentOperators);
    if (got.length !== 1 || got[0] !== Number(code)) throw new Error("comparator " + type + " maps to " + JSON.stringify(got) + ", expected " + code);
  }

  const entities = {}, problems = [];
  let filterable = 0, parsed = 0, readable = 0;
  for (const [id, e] of Object.entries(input.entities)) {
    const props = {};
    for (const p of e.properties) {
      const t = decode("CCToolKitToolTypeInstance", p.typeInstance);
      props[p.id] = { name: p.name, type: t ? simplify(t, input.types) : { kind: "undecodable" } };
    }
    const tpl = e.comparison ? decode("CCToolKitToolTypeDefinitionVersion1QueryPredicateTemplates", e.comparison) : null;
    for (const c of (tpl && tpl.comparison) || []) {
      const pid = c.property.id;
      props[pid] = props[pid] || { name: c.property.displayName, type: simplify(c.property.type, input.types) };
      const op = codeOf[KIND_NAMES[Object.keys(c.comparisonTemplate)[0]]];
      props[pid].operators = props[pid].operators || [];
      if (!props[pid].operators.includes(op)) props[pid].operators.push(op);
    }
    const out = { name: e.name, app: e.app, typeName: e.typeName, bundleIdentifier: e.bundleIdentifier, find: e.find, properties: {} };
    entities[id] = out;
    const built = entityContentClass(e, props);
    for (const [pid, p] of Object.entries(props)) {
      const o = { name: p.name, type: p.type };
      out.properties[pid] = o;
      const prop = built && built.included.has(pid) ? klass(built.name).propertyForName(pid) : null;
      if (built && built.included.has(pid)) {
        const yields = propertyContentClasses(built.name, { Type: "WFPropertyVariableAggrandizement", PropertyName: pid });
        if (yields.length) { o.contentClasses = yields; readable++; }
      }
      if (!p.operators) continue;
      filterable++;
      const filter = { operators: p.operators };
      o.filter = filter;
      if (!prop || isNil(prop) || !prop.filterable) {
        filter.engine = !linkValueType(p.type) ? "not built: no LinkMetadata value type for this property's type" : "not built: WorkflowKit made no filterable property of it";
        continue;
      }
      const def = prop.parameterDefinition;
      filter.parameterClass = isNil(def) ? null : str(def.objectForKey("Class"));
      const info = prop.userInfo;
      const isHandle = isNil(info) ? null : info.objectForKey("WFLinkEntityContentPropertyUserInfoIsContactHandleKey");
      const kind = !isNil(isHandle) && isHandle.boolValue ? "contactHandle" : VALUE_KINDS[filter.parameterClass];
      if (kind) filter.values = kind;
      // "is in the last/next" take a count and a calendar unit; the editor offers the units in this
      // NSCalendarUnit mask (WorkflowKit.CalendarUnitPickerParameter lists them).
      if (p.operators.some((o) => table.filterOperators[o] === "is in the last" || table.filterOperators[o] === "is in the next")) {
        const mask = Number(prop.timeUnits);
        filter.timeUnits = [...Array(20).keys()].map((b) => 2 ** b).filter((u) => mask & u);
      }
      const engineOps = integers(prop.allowedOperators);
      const notOffered = p.operators.filter((o) => !engineOps.includes(o));
      if (notOffered.length) filter.notFromComparators = notOffered; // listed by the index, not produced from the query's comparators
      // Each operator, loaded as a row with a sample value: the engine must keep the row, read the same operator, and read every value key.
      const rows = p.operators.map((o) => ({ Property: pid, Operator: o, Removable: true, Values: kind ? sampleValues(kind, table.filterOperators[o], filter.timeUnits || []) : {} }));
      const got = loadFilter(built.name, { WFSerializationType: "WFContentPredicateTableTemplate", Value: { WFActionParameterFilterPrefix: 1, WFContentPredicateBoundedDate: false, WFActionParameterFilterTemplates: rows } }).rows;
      for (const [i, o] of p.operators.entries()) {
        const r = got[i], missing = r ? Object.keys(rows[i].Values).filter((k) => !(k in r.values)) : [];
        if (!r || r.property !== pid || r.operator !== table.filterOperators[o] || missing.length) problems.push(id + "." + pid + " operator " + o + ": wrote " + JSON.stringify(Object.keys(rows[i].Values)) + ", engine read " + JSON.stringify(r));
        else parsed++;
      }
    }
  }
  writeJSON(argv[2], { entities });
  const n = Object.keys(entities).length;
  console.log(n + " entity types, " + Object.values(entities).reduce((s, e) => s + Object.keys(e.properties).length, 0) + " properties (" + readable + " a property aggrandizement finds); " +
    filterable + " filterable, " + parsed + " property/operator rows read back by the engine" + (problems.length ? "; " + problems.length + " problems:\n  " + problems.slice(0, 20).join("\n  ") : "") + " -> " + argv[2]);
  if (problems.length) throw new Error(problems.length + " filter rows the engine did not read as written");
}
