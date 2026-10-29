// shortcutkit: build, validate and sign Apple Shortcuts files.
// Format reference: docs/shortcut-file-format.md. Definitions: data/builtin-actions.json.
import { spawnSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { toXmlPlist, type PlistValue } from "./plist.js";
import { getDefinition, type ActionDefinition } from "./definitions.js";
import { ACTIONS, PARAM_KINDS, PARAM_VARIABLE_TYPES, PARAM_ENTITY_TYPES } from "./generated/actions.js";
import type { ActionId, MetaParams, ParamTypes } from "./generated/actions.js";
import { BOUNDED_FILTERS, BYTE_COUNT_UNITS, CALENDAR_UNITS, CONTENT_ITEM_CLASSES, CONTENT_ITEM_PROPERTIES, ENTITY_PROPERTIES, FILTERS, FILTER_OPERATORS, type ContentItemClass, type ContentItemProperty, type EntityId, type EntityProperty } from "./generated/entities.js";
import type { AppIntentDescriptor, AskAttachment, Attachment, Coerced, ConditionSubject, DictionaryFieldValue, DictionaryItem, DictionaryItems, DictionaryItemType, DictionaryValue, FilterRow, FilterTemplateValue, TokenString, Uncoerced, Value, VariableType, Where } from "./values.js";

export { actions, ACTIONS, PARAM_KINDS, PARAM_CHOICES, PARAM_VARIABLE_TYPES, PARAM_ENTITY_TYPES, type ActionId, type ActionKey, type ParamKey, type ParamTypes, type MetaParams } from "./generated/actions.js";
export type { PlistValue } from "./plist.js";
export type * from "./values.js";
export { getDefinition, allDefinitions, type ActionDefinition, type ParameterDefinition, type Localized } from "./definitions.js";
export { provenance, type Provenance } from "./provenance.js";
export type * from "./generated/params.js";
export { FILTERS, FILTER_OPERATORS, CALENDAR_UNITS, BYTE_COUNT_UNITS, BOUNDED_FILTERS, ENTITY_PROPERTIES, CONTENT_ITEM_CLASSES, CONTENT_ITEM_PROPERTIES, type FilterRows, type EntityId, type EntityProperty, type ContentItemClass, type ContentItemProperty } from "./generated/entities.js";

/** Parameters accepted for an identifier: typed per key for built-in actions, open for anything else. */
export type ParamsFor<I extends string> = I extends ActionId ? Partial<ParamTypes[I] & MetaParams> : Record<string, Value>;

/** An action as `action()` returns it; pass it to `ref()` to use its output, or to `property()` for one of its properties. */
export type Action<I extends string = string> = { WFWorkflowActionIdentifier: I; WFWorkflowActionParameters: Record<string, Value>; outputName?: string; outputTypes?: readonly string[] };
/** Content types an action's output can be (`WFStringContentItem`, `NSURL`, an App Intents entity, …). Shortcuts converts between many of them at run time, so this is a description, not a restriction. */
export type OutputTypes<I extends ActionId> = (typeof ACTIONS)[I]["outputTypes"];
/** What the catalog knows about an identifier, built-in or App Intent. */
export type CatalogEntry = {
  identifier: string;
  /** Display name, as the editor shows it. */
  name: string;
  /** Parameter keys the action accepts, in the editor's order. */
  params: readonly string[];
  /** Value kind per key: bool, number, string, text, picker, subject, plainString, plainNumber, dictionary, quantity, filter, any. */
  kinds: Record<string, string>;
  /** Output name, or null when the action produces nothing. */
  output: string | null;
  /** Content types the output can be; empty when the action produces nothing. */
  outputTypes: readonly string[];
  /** Content types the action takes as input (the definition's `Input.Types`); empty when it takes none or is an App Intent. */
  inputTypes: readonly string[];
  /** The parameter key the input lands in, for a built-in that takes one. */
  inputKey?: string;
  /** Whether the input is required. */
  inputRequired?: boolean;
  /** Search terms the editor matches (`ActionKeywords`, the registry's keywords). */
  keywords: readonly string[];
  /** The editor's description of the action, with its note and what it returns, where the definition has them. */
  description?: string;
  descriptionNote?: string;
  descriptionResult?: string;
  /** Flags from the definition: discontinued, loaded as missing, needs the device unlocked, hidden on these platforms. */
  discontinued?: boolean;
  unavailable?: boolean;
  requiresUnlock?: boolean;
  disabledOn?: readonly string[];
  /** Parameters the editor shows only for a value of another: per key, the rules (`WFParameterRelationResource`; relation `=`, `!=`, `??` or `nil`). */
  requires?: Readonly<Record<string, readonly ParameterRule[]>>;
  /** Present for App Intents actions; written as the AppIntentDescriptor parameter. */
  descriptor?: AppIntentDescriptor;
  /** The engine's definition, for built-ins only. */
  definition?: ActionDefinition;
};
/** One rule under which the editor shows a parameter: the other key's value must (`=`), must not (`!=`), ... be one of `values`. */
export type ParameterRule = { key: string; relation: string; values: readonly PlistValue[] };
type CardFields = Pick<CatalogEntry, "inputTypes" | "inputKey" | "inputRequired" | "keywords" | "description" | "descriptionNote" | "descriptionResult" | "discontinued" | "unavailable" | "requiresUnlock" | "disabledOn" | "requires">;

/**
 * Look up any catalog identifier, built-in or App Intent. Unlike getDefinition(), which knows
 * only built-ins, this covers both in one shape.
 */
export function getAction(identifier: string): CatalogEntry | undefined {
  const entry = (ACTIONS as Record<string, { name: string; params: readonly string[]; output: string | null; outputTypes: readonly string[]; descriptor?: AppIntentDescriptor } & Partial<CardFields>>)[identifier];
  if (!entry) return undefined;
  const kinds = { ...((PARAM_KINDS as Record<string, Record<string, string>>)[identifier] ?? {}) };
  const definition = getDefinition(identifier);
  const { name, params, output, outputTypes, descriptor, inputTypes, keywords, ...card } = entry;
  return { identifier, name, params, kinds, output, outputTypes, inputTypes: inputTypes ?? [], keywords: keywords ?? [], ...card, ...(descriptor ? { descriptor } : {}), ...(definition ? { definition } : {}) };
}

/** Where a value of one content type can go: every built-in whose input takes it (with the key the input lands in) and every App
 *  Intents parameter typed as that entity. Declared types only; Shortcuts converts between many types at run time, so this is
 *  what the editor would list, not everything that works. */
export function acceptedBy(type: string): { identifier: string; key: string }[] {
  const out: { identifier: string; key: string }[] = [];
  for (const [identifier, e] of Object.entries(ACTIONS as Record<string, { inputTypes?: readonly string[]; inputKey?: string }>)) if (e.inputTypes?.includes(type)) out.push({ identifier, key: e.inputKey ?? "WFInput" });
  for (const [identifier, keys] of Object.entries(PARAM_ENTITY_TYPES as Record<string, Record<string, string>>)) for (const [key, t] of Object.entries(keys)) if (t === type) out.push({ identifier, key });
  return out;
}

/** Every action whose output is declared as this content type (`ACTIONS[id].outputTypes`). */
export function producedBy(type: string): string[] {
  return Object.entries(ACTIONS as Record<string, { outputTypes: readonly string[] }>).filter(([, e]) => e.outputTypes.includes(type)).map(([id]) => id);
}

/** A third-party app, for `appIntent()`: its bundle identifier, display name and team identifier (the bundle's Info.plist and `codesign -dv`). */
export type AppDescriptor = { BundleIdentifier: string; Name: string; TeamIdentifier: string };
/** An App Intents action of an app the catalogue does not cover, from `appIntent()`; `action()` takes it in place of an identifier. */
export type AppIntentRef = { readonly identifier: string; readonly descriptor: AppIntentDescriptor; readonly output?: string };
/**
 * Name an App Intents action of an app the catalogue does not cover: `s.action(appIntent(app, "CreateNoteIntent", "Note"), { title: text("Hi") })`.
 * The identifier is the bundle identifier followed by the intent's name, as the catalogue identifies an app's own intents, and
 * the descriptor is written as the catalogue's are; an intent hosted in a framework or extension has another identifier, which
 * `action()` still takes by hand with an `AppIntentDescriptor`. `output` names the result for `ref()` (the intent's output title;
 * "Output" when left out). The parameters are untyped: their keys are the intent's parameter names, as
 * `Metadata.appintents/extract.actionsdata` in the app bundle lists them.
 */
export const appIntent = (app: AppDescriptor, intent: string, output?: string): AppIntentRef =>
  ({ identifier: `${app.BundleIdentifier}.${intent}`, descriptor: { ...app, AppIntentIdentifier: intent }, ...(output ? { output } : {}) });


/** The icon palette, in picker order, as the file stores each color. */
export const ICON_COLORS = {
  Red: 4282601983, DarkOrange: 4251333119, Orange: 4271458815, Yellow: 4274264319, Green: 4292093695,
  Teal: 431817727, LightBlue: 1440408063, Blue: 463140863, DarkBlue: 946986751, Violet: 2071128575,
  Purple: 3679049983, Pink: 3980825855, Taupe: 255, Gray: 3031607807, DarkGray: 2846468607,
} as const;
export type IconColor = keyof typeof ICON_COLORS;
export const DEFAULT_GLYPH = 61440;

/** If condition codes. Each code's meaning is the engine's own (`filterOperators` in data/encoding-table.json). */
export const CONDITION = {
  less_than: 0, less_or_equal: 1, greater_than: 2, greater_or_equal: 3, is: 4, is_not: 5, begins_with: 8, ends_with: 9,
  contains: 99, has_any_value: 100, has_no_value: 101, does_not_contain: 999, is_between: 1003,
} as const;
export type Condition = keyof typeof CONDITION;

const META_KEYS = new Set(["UUID", "GroupingIdentifier", "WFControlFlowMode", "CustomOutputName"]);
const LEGACY_KEYS: Record<string, string[]> = {
  "is.workflow.actions.conditional": ["WFInput", "WFCondition", "WFConditionalActionString", "WFNumberValue", "WFConditionalLegacyComparisonBehavior", "WFEnumerationValue", "WFBooleanValue", "WFDate", "WFAnotherDate", "WFDuration", "WFConditions"],
  "is.workflow.actions.choosefrommenu": ["WFMenuPrompt", "WFMenuItems", "WFMenuItemTitle", "WFMenuItemAttributedTitle"],
};

const uuid = () => crypto.randomUUID().toUpperCase();
const attachment = <T extends VariableType>(value: { Type: T } & Record<string, PlistValue>): Attachment<T> => ({ WFSerializationType: "WFTextTokenAttachment", Value: value });

/** Reference another action's output. */
export const ref = (action: Action, outputName?: string): Attachment<"ActionOutput"> =>
  attachment({ Type: "ActionOutput", OutputUUID: action.WFWorkflowActionParameters.UUID as string, OutputName: outputName ?? action.outputName ?? "Output" });
/** A named variable, as set by Set Variable or Add to Variable. */
export const variable = (name: string): Attachment<"Variable"> => attachment({ Type: "Variable", VariableName: name });
/** The shortcut's input, from the share sheet, Quick Actions, or Run Shortcut. */
export const shortcutInput = (): Attachment<"ExtensionInput"> => attachment({ Type: "ExtensionInput" });
/** The clipboard's contents. */
export const clipboard = (): Attachment<"Clipboard"> => attachment({ Type: "Clipboard" });
/** The date and time the shortcut runs. */
export const currentDate = (): Attachment<"CurrentDate"> => attachment({ Type: "CurrentDate" });
/** A value the user is asked for each time the shortcut runs. */
export const ask = (prompt?: string): AskAttachment => attachment(prompt ? { Type: "Ask", Prompt: prompt } : { Type: "Ask" });
/** Device Details (name, model, OS version, …); the app usually adds a property aggrandizement. */
export const deviceDetails = (): Attachment<"DeviceDetails"> => attachment({ Type: "DeviceDetails" });
/** The app the shortcut was run from. */
export const currentApp = (): Attachment<"CurrentApp"> => attachment({ Type: "CurrentApp" });
/** The If-subject form of a reference. `if()` and `action()` apply it for you. */
export const subject = (a: Attachment): ConditionSubject => ({ Type: "Variable", Variable: a });
/** @deprecated Misnamed: this produces the If-subject form. Pass a bare `ref()` to variable-picker parameters; use `subject()` for If. */
export const picker = subject;
/** The current item inside a Repeat with Each block. */
export const repeatItem = (): Attachment<"Variable"> => attachment({ Type: "Variable", VariableName: "Repeat Item" });
/** The current index (1-based) inside a Repeat block. */
export const repeatIndex = (): Attachment<"Variable"> => attachment({ Type: "Variable", VariableName: "Repeat Index" });

/** The entity type an action outputs, when it is one of Apple's (ENTITY_PROPERTIES). */
type OutputEntity<I extends string> = I extends ActionId ? Extract<OutputTypes<I>[number], EntityId> : never;
/** The content item class an action outputs, when it is one the engine lists (CONTENT_ITEM_PROPERTIES). */
type OutputClass<I extends string> = I extends ActionId ? Extract<OutputTypes<I>[number], ContentItemClass> : never;
type KnownProperty<I extends string> = EntityProperty<OutputEntity<I>> | ContentItemProperty<OutputClass<I>>;
/** What `property()` takes for an action's output: the property names of its entity type or content item class when the catalog knows them, else any name. */
export type PropertyName<I extends string> = [KnownProperty<I>] extends [never] ? string : KnownProperty<I>;

/** The content item class a reference was last coerced to, when it is one the engine lists; null for any other reference. */
function coercedClass(a: Attachment): ContentItemClass | null {
  const ags = a.Value.Aggrandizements;
  const last = Array.isArray(ags) ? ags[ags.length - 1] : undefined;
  const cls = last && typeof last === "object" && !Array.isArray(last) && (last as Record<string, unknown>).Type === "WFCoercionVariableAggrandizement" ? (last as Record<string, unknown>).CoercionItemClass : null;
  return typeof cls === "string" && cls in CONTENT_ITEM_PROPERTIES ? (cls as ContentItemClass) : null;
}

/**
 * One property of an action's output or of any reference, as the editor's property picker (the "Get" list
 * under a variable's "Type") writes it (a `WFPropertyVariableAggrandizement`): `property(found, "body")`,
 * `property(repeatItem(), "date")`, `property(coerce(file, "WFGenericFileContentItem"), "File Size")`.
 * When the output's type is known, one of Apple's entity types (ENTITY_PROPERTIES) or a content item class
 * (CONTENT_ITEM_PROPERTIES, also what a `coerce()`d reference has), the name must be one of its properties,
 * which the compiler also checks.
 */
export function property<I extends string>(source: Action<I>, name: PropertyName<I>): Attachment<"ActionOutput">;
export function property<C extends ContentItemClass, T extends VariableType>(source: Coerced<C, T>, name: ContentItemProperty<C>): Attachment<T>;
export function property<T extends VariableType>(source: Uncoerced<T>, name: string): Attachment<T>;
export function property(source: Action | Attachment, name: string): Attachment {
  const types: string[] = isAttachment(source) ? [coercedClass(source)].filter((c): c is ContentItemClass => c !== null) : (source.outputTypes ?? []).filter((t) => t in ENTITY_PROPERTIES || t in CONTENT_ITEM_PROPERTIES);
  const known = new Set<string>(types.flatMap((t) => (t in ENTITY_PROPERTIES ? ENTITY_PROPERTIES[t as EntityId] : CONTENT_ITEM_PROPERTIES[t as ContentItemClass]) as readonly string[]));
  if (types.length && !known.has(name)) throw new Error(`${types.join(" / ")} has no property ${name}; it has ${[...known].sort().join(", ")}`);
  return aggrandize(source, { Type: "WFPropertyVariableAggrandizement", PropertyName: name });
}
/** `source` with one more aggrandizement; an action stands for its output. */
function aggrandize(source: Action | Attachment, aggrandizement: Record<string, PlistValue>): Attachment {
  const a = isAttachment(source) ? source : ref(source);
  const prior = Array.isArray(a.Value.Aggrandizements) ? a.Value.Aggrandizements : [];
  return attachment({ ...a.Value, Aggrandizements: [...prior, aggrandizement] });
}

/**
 * `source` read as one content type, as the editor's variable "Type" menu writes it (a `WFCoercionVariableAggrandizement`):
 * `coerce(ref(json), "WFDictionaryContentItem")`, `coerce(repeatItem(), "WFStringContentItem")`. The classes are the engine's own
 * list (CONTENT_ITEM_CLASSES, each with the name the editor shows). An If whose subject's type the engine cannot tell (a
 * dictionary value, a repeat item) needs one: without it "is" has nothing to compare against and the run fails (a downstream
 * user's observation; docs/extraction.md, run-time observations).
 */
export function coerce<I extends string, C extends ContentItemClass>(source: Action<I>, to: C): Coerced<C, "ActionOutput">;
export function coerce<T extends VariableType, C extends ContentItemClass>(source: Attachment<T>, to: C): Coerced<C, T>;
export function coerce(source: Action | Attachment, to: ContentItemClass): Attachment {
  if (!(to in CONTENT_ITEM_CLASSES)) throw new Error(`no content item class ${to}; the engine coerces to ${Object.keys(CONTENT_ITEM_CLASSES).join(", ")}`);
  return aggrandize(source, { Type: "WFCoercionVariableAggrandizement", CoercionItemClass: to });
}

/**
 * A dictionary parameter: Dictionary's items, Get Contents of URL's headers, form and JSON bodies. Strings, `text()` and
 * references are text items; numbers, booleans, arrays and nested objects keep their type, as the editor's item type menu
 * sets it: `dictionary({ apikey: variable("Key"), count: 5, nested: { ok: true }, tags: ["a", "b"] })`. `action()` encodes a
 * plain object given for a dictionary key itself, so the call is needed only where the key is untyped.
 */
export function dictionary(items: DictionaryItems): DictionaryValue {
  return { WFSerializationType: "WFDictionaryFieldValue", Value: { WFDictionaryFieldValueItems: Object.entries(items).map(([k, v]) => ({ WFKey: text(k), ...dictionaryItem(v) })) } };
}
const isTokenString = (v: unknown): v is TokenString => typeof v === "object" && v !== null && (v as TokenString).WFSerializationType === "WFTextTokenString";
const isEncodedDictionary = (v: unknown): v is DictionaryValue => typeof v === "object" && v !== null && (v as DictionaryValue).WFSerializationType === "WFDictionaryFieldValue";
/** A plain object of items for a dictionary parameter: not an encoded value, an If subject, an array, or a class instance such as a Date. */
const isDictionaryItems = (v: unknown): v is DictionaryItems =>
  typeof v === "object" && v !== null && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null) && !("WFSerializationType" in v) && !((v as ConditionSubject).Type === "Variable" && "Variable" in v);
/** One item's type code and value, as the dictionary state class writes them back (docs/shortcut-file-format.md §3). */
function dictionaryItem(v: DictionaryItem): { WFItemType: DictionaryItemType; WFValue: DictionaryFieldValue } {
  if (typeof v === "string") return { WFItemType: 0, WFValue: text(v) };
  if (isTokenString(v)) return { WFItemType: 0, WFValue: v };
  if (isAttachment(v)) return { WFItemType: 0, WFValue: text(v) };
  if (typeof v === "number") return { WFItemType: 3, WFValue: text(String(v)) };
  if (typeof v === "boolean") return { WFItemType: 4, WFValue: { WFSerializationType: "WFNumberSubstitutableState", Value: v } };
  // Array items carry no key; plain text is the bare string, as the engine writes it back.
  if (Array.isArray(v)) return { WFItemType: 2, WFValue: { WFSerializationType: "WFArrayParameterState", Value: v.map((x) => (typeof x === "string" ? x : dictionaryItem(x))) } };
  // A nested dictionary is wrapped once more than the outer one (the engine serializes it so, and reads the unwrapped form into that).
  if (isEncodedDictionary(v)) return { WFItemType: 1, WFValue: { WFSerializationType: "WFDictionaryFieldValue", Value: v } };
  if (isDictionaryItems(v)) return { WFItemType: 1, WFValue: { WFSerializationType: "WFDictionaryFieldValue", Value: dictionary(v) } };
  throw new Error(`dictionary(): a value must be a string, text(), a reference, a number, a boolean, an array or an object, got ${JSON.stringify(v)}`);
}

/** Find conditions that must all hold. Each row is `[property, operator, ...values]`, typed per Find action (FilterRows):
 *  `where(["date", "is_in_the_last", 7, "days"], ["author", "is", ref(contact)])`; durations and file sizes take a
 *  number and a unit, `where(["File Size", "greater_than", 5, "MB"])`. */
export const where = <const R extends FilterRow>(...rows: R[]): Where<R> => ({ match: "all", rows });
/** Find conditions of which any one must hold; rows as for `where()`. */
export const whereAny = <const R extends FilterRow>(...rows: R[]): Where<R> => ({ match: "any", rows });
const isWhere = (v: unknown): v is Where => typeof v === "object" && v !== null && Array.isArray((v as Where).rows) && ((v as Where).match === "all" || (v as Where).match === "any");

type FilterProperty = { operators: readonly number[]; values: string; units?: readonly number[]; choices?: readonly string[] };
/** Encode where() rows for a Find action: each value goes under the row key its kind uses (see docs/shortcut-file-format.md). */
function encodeFilter(identifier: string, w: Where): FilterTemplateValue {
  const table = (FILTERS as Record<string, Record<string, FilterProperty>>)[identifier];
  if (!table) throw new Error(`${identifier}: where() rows need a Find action with typed filters (FILTERS); pass a WFContentPredicateTableTemplate here`);
  const codes = FILTER_OPERATORS as Record<string, number>;
  const rows: Array<{ Property: string; Operator: number; Removable: boolean; Bounded?: boolean; Values: Record<string, PlistValue> }> = w.rows.map(([prop, op, ...args]) => {
    const p = table[prop];
    if (!p) throw new Error(`${identifier}: no filterable property ${prop}; filterable: ${Object.keys(table).join(", ")}`);
    const at = `${identifier} ${prop} ${op}`;
    const offered = Object.keys(codes).filter((n) => p.operators.includes(codes[n]!));
    if (!offered.includes(op)) throw new Error(`${identifier} ${prop}: no operator ${op}; offered: ${offered.join(", ")}`);
    const arity = op === "is_today" ? 0 : op === "is_between" || op === "is_in_the_last" || op === "is_in_the_next" || p.values === "duration" || p.values === "fileSize" ? 2 : 1;
    if (args.length !== arity) throw new Error(`${at}: takes ${arity} value(s), got ${args.length}`);
    return { Property: prop, Operator: codes[op]!, Removable: true, Values: rowValues(at, p, op, args) };
  });
  // Some Find actions need a bounded date row (Find Calendar Events: Start Date in a range), or the engine
  // replaces the whole filter with its default; the row is marked Bounded, and the filter says it has one.
  const bounded = (BOUNDED_FILTERS as Record<string, { property: string; operators: readonly number[] }>)[identifier];
  let hasBounded = false;
  if (bounded) {
    for (const r of rows) if (r.Property === bounded.property && bounded.operators.includes(r.Operator)) { r.Bounded = true; hasBounded = true; }
    if (!hasBounded) {
      const names = Object.keys(codes).filter((n) => bounded.operators.includes(codes[n]!));
      throw new Error(`${identifier}: needs a ${bounded.property} row with one of ${names.join(", ")} (the engine replaces a filter without one with its default)`);
    }
  }
  return { WFSerializationType: "WFContentPredicateTableTemplate", Value: { WFActionParameterFilterPrefix: w.match === "all" ? 1 : 0, WFContentPredicateBoundedDate: hasBounded, WFActionParameterFilterTemplates: rows } };
}
function rowValues(at: string, p: FilterProperty, op: string, args: unknown[]): Record<string, PlistValue> {
  const check = (ok: boolean, v: unknown, what: string) => { if (!ok) throw new Error(`${at}: expected ${what}, got ${JSON.stringify(v)}`); };
  const one = (v: unknown, kind: string): [string, PlistValue] => {
    switch (kind) {
      case "number": check(typeof v === "number" || isAttachment(v), v, "a number or a reference"); return ["Number", v as PlistValue];
      case "bool": check(typeof v === "boolean" || isAttachment(v), v, "a boolean or a reference"); return ["Bool", v as PlistValue];
      case "date": check(v instanceof Date || isAttachment(v), v, "a Date or a reference"); return ["Date", v as PlistValue];
      // An enumeration's state class holds one of the property's choices or a reference (a bare reference is read as a different state class).
      case "enumeration": check(typeof v === "string" || isAttachment(v), v, "a string or a reference"); return ["Enumeration", { WFSerializationType: "WFStringSubstitutableState", Value: v as PlistValue }];
      case "enumCase": check(typeof v === "string" || isAttachment(v), v, "a case identifier or a reference"); return ["Enumeration", { WFSerializationType: "WFLinkEnumerationSubstitutableState", Value: v as PlistValue }];
      case "text": case "email": case "phone": case "contactHandle": {
        const isToken = typeof v === "object" && v !== null && (v as TokenString).WFSerializationType === "WFTextTokenString";
        check(typeof v === "string" || isToken || isAttachment(v), v, "a string, text() or a reference");
        // The engine drops a bare reference in a text row; it reads the token string the editor writes.
        const t = isAttachment(v) ? text(v) : (v as string | TokenString);
        // The key follows the property's value class: Email for email addresses, Phone for phone numbers, String for the rest.
        if (kind === "text") return ["String", t as PlistValue];
        if (kind === "email") return ["Email", t as PlistValue];
        if (kind === "phone") return ["Phone", t as PlistValue];
        // A handle is wrapped in its state class, holding the plain string when there is no reference in it (as the engine writes it).
        const plainHandle = typeof t === "string" ? t : Object.keys(t.Value.attachmentsByRange).length ? null : t.Value.string;
        return ["ContactHandle", { WFSerializationType: "WFTokenStringParameterState", Value: (plainHandle ?? t) as PlistValue }];
      }
    }
    throw new Error(`${at}: no row key for values of kind ${kind}`);
  };
  if (op === "is_today") return {};
  if (op === "is_in_the_last" || op === "is_in_the_next") {
    const [n, unit] = args;
    check(typeof n === "number" || isAttachment(n), n, "a number or a reference");
    const units = Object.keys(CALENDAR_UNITS).filter((u) => (p.units ?? []).includes(CALENDAR_UNITS[u as keyof typeof CALENDAR_UNITS]));
    check(isAttachment(unit) || units.includes(unit as string), unit, `a reference or one of ${units.join(", ")}`);
    return { Number: n as PlistValue, Unit: isAttachment(unit) ? unit : CALENDAR_UNITS[unit as keyof typeof CALENDAR_UNITS] };
  }
  if (op === "is_between") return { Date: one(args[0], p.values)[1], AnotherDate: one(args[1], p.values)[1] };
  // Durations compare a number of calendar units (Unit, an NSCalendarUnit); file sizes a number of byte-count units.
  if (p.values === "duration" || p.values === "fileSize") {
    const [n, unit] = args;
    check(typeof n === "number" || isAttachment(n), n, "a number or a reference");
    const table: Record<string, number> = p.values === "duration" ? CALENDAR_UNITS : BYTE_COUNT_UNITS;
    const units = Object.keys(table).filter((u) => !p.units || p.units.includes(table[u]!));
    check(isAttachment(unit) || units.includes(unit as string), unit, `a reference or one of ${units.join(", ")}`);
    return { Number: n as PlistValue, [p.values === "duration" ? "Unit" : "ByteCountUnit"]: isAttachment(unit) ? unit : table[unit as string]! };
  }
  const [k, v] = one(args[0], p.values);
  return { [k]: v };
}

/** The variable types (Ask, ActionOutput, Variable, …) referenced anywhere in a value: a bare attachment, a token string's attachments, or a wrapped If subject. */
function referenceTypes(v: unknown): string[] {
  if (isAttachment(v)) return [String(v.Value.Type)];
  if (v && typeof v === "object" && (v as TokenString).WFSerializationType === "WFTextTokenString") {
    return Object.values((v as TokenString).Value.attachmentsByRange ?? {}).map((a) => String(a.Type));
  }
  if (v && typeof v === "object" && (v as ConditionSubject).Type === "Variable" && isAttachment((v as ConditionSubject).Variable)) return referenceTypes((v as ConditionSubject).Variable);
  return [];
}
const isAttachment = (v: unknown): v is Attachment =>
  typeof v === "object" && v !== null && (v as Attachment).WFSerializationType === "WFTextTokenAttachment";

/** Text with references in it: `text("Hello, ", ref(name), "!")`. */
export function text(...parts: Array<string | number | Attachment>): TokenString {
  let string = "";
  const attachmentsByRange: Record<string, Record<string, PlistValue>> = {};
  for (const part of parts) {
    if (isAttachment(part)) {
      // NSRange offsets: UTF-16 code units, which is what JS string length counts.
      attachmentsByRange[`{${string.length}, 1}`] = part.Value;
      string += "￼";
    } else {
      string += String(part);
    }
  }
  return { WFSerializationType: "WFTextTokenString", Value: { string, attachmentsByRange } };
}

/** Where a shortcut is offered beyond the app: `ActionExtension` is the share sheet, `QuickActions` the Finder and Services menus, `MenuBar`, `NCWidget`, `WatchKit`, `Sleep`, `ReceivesOnScreenContent`. */
export type WorkflowType = "ActionExtension" | "QuickActions" | "MenuBar" | "NCWidget" | "WatchKit" | "Sleep" | "ReceivesOnScreenContent";
export interface ShortcutOptions {
  /** Icon color: a palette name (`"Teal"`) or a raw value. Default `"Blue"`. */
  color?: IconColor | number;
  /** Icon glyph, a codepoint from Shortcuts' icon font. Default 61440. */
  glyph?: number;
  /** Content item classes accepted as input (`WFSafariWebPageContentItem`, `WFURLContentItem`, …); what the share sheet offers this shortcut for. */
  inputClasses?: string[];
  /** Surfaces the shortcut appears in (`WFWorkflowTypes`); `["ActionExtension"]` puts it in the share sheet. Default none. */
  types?: WorkflowType[];
}

/** A shortcut. Add actions, then `write()` and `sign()`; Shortcuts names the import after the file, which defaults to `<name>.shortcut`. */
export class Shortcut {
  readonly name: string;
  readonly actions: Action[] = [];
  private readonly color: number;
  private readonly glyph: number;
  private readonly inputClasses: string[];
  private readonly types: WorkflowType[];

  constructor(name: string, options: ShortcutOptions = {}) {
    this.name = name;
    this.color = typeof options.color === "number" ? options.color : ICON_COLORS[options.color ?? "Blue"];
    this.glyph = options.glyph ?? DEFAULT_GLYPH;
    this.inputClasses = options.inputClasses ?? [];
    this.types = options.types ?? [];
  }

  /**
   * Append an action and return it; `ref()` it to use its output. Catalog identifiers are checked:
   * wrong keys and values don't compile, and unknown keys or unreadable references throw. Other
   * identifiers pass through unchecked; `appIntent()` names another app's action with its descriptor.
   */
  action<I extends string>(identifier: I, params?: ParamsFor<I>): Action<I>;
  action(intent: AppIntentRef, params?: Record<string, Value>): Action<string>;
  action(target: string | AppIntentRef, params: Record<string, Value> = {}): Action<string> {
    const intent = typeof target === "string" ? undefined : target;
    const identifier = intent ? intent.identifier : (target as string);
    const definition = getDefinition(identifier);
    const catalog = (ACTIONS as Record<string, { params: readonly string[]; output: string | null; outputTypes?: readonly string[]; descriptor?: AppIntentDescriptor }>)[identifier];
    if (!definition && !catalog && identifier.startsWith("is.workflow.")) throw new Error(`unknown built-in action ${identifier}`);
    if (definition || catalog?.descriptor) {
      const known = new Set<string>(META_KEYS);
      for (const p of definition?.Parameters ?? []) if (p.Key) known.add(p.Key);
      if (definition?.Input?.ParameterKey) known.add(definition.Input.ParameterKey);
      for (const k of LEGACY_KEYS[identifier] ?? []) known.add(k);
      for (const k of catalog?.params ?? []) known.add(k);
      if (catalog?.descriptor) known.add("AppIntentDescriptor");
      const unknown = Object.keys(params as Record<string, Value>).filter((k) => !known.has(k));
      if (unknown.length > 0 && known.size > META_KEYS.size) {
        throw new Error(`${identifier}: unknown parameter(s) ${unknown.join(", ")}; known: ${[...known].sort().join(", ")}`);
      }
    }
    // Text parameters (WFVariableStringParameterState, WFURLStringParameterState, WFDateFieldParameterState)
    // never hold a bare attachment: the engine writes a lone variable as a token string with one
    // placeholder. Wrap it here so ref() works for text keys as it does everywhere else.
    const kinds = (PARAM_KINDS as Record<string, Record<string, string>>)[identifier] ?? {};
    const restricted = (PARAM_VARIABLE_TYPES as Record<string, Record<string, readonly string[]>>)[identifier] ?? {};
    const normalized: Record<string, Value> = {};
    for (const [k, v] of Object.entries(params as Record<string, Value>)) {
      // Keys the engine reads no reference for (or only Ask): the same rule the compiler applies, at run time.
      const allowed = restricted[k];
      if (allowed) {
        const bad = referenceTypes(v).filter((t) => !allowed.includes(t));
        if (bad.length > 0) throw new Error(`${identifier}.${k}: the engine does not read a ${bad.join("/")} reference here (it reads ${allowed.length ? allowed.join(", ") : "only a plain value"})`);
      }
      // where() rows belong to a Find action's filter key; an action the catalogue types otherwise refuses them here, and
      // an untyped one (another app's Find action) is refused by encodeFilter(), which names the missing FILTERS entry.
      if (isWhere(v) && k in kinds && kinds[k] !== "filter") throw new Error(`${identifier}.${k}: where() rows go only in a Find action's WFContentItemFilter`);
      normalized[k] = kinds[k] === "text" && isAttachment(v) ? text(v) : kinds[k] === "subject" && isAttachment(v) ? subject(v) : kinds[k] === "dictionary" && isDictionaryItems(v) ? dictionary(v) : isWhere(v) ? encodeFilter(identifier, v) : v;
    }
    // App Intents actions carry a descriptor naming the app that provides them (see docs/shortcut-file-format.md §2).
    const app = catalog?.descriptor ?? intent?.descriptor;
    const descriptor: Record<string, Value> = app ? { AppIntentDescriptor: { ...app, ActionRequiresAppInstallation: true } } : {};
    const entry: Action<string> = {
      WFWorkflowActionIdentifier: identifier,
      WFWorkflowActionParameters: { UUID: uuid(), ...descriptor, ...normalized },
      outputName: definition?.Output?.OutputName ?? catalog?.output ?? intent?.output ?? undefined,
      outputTypes: catalog?.outputTypes ?? definition?.Output?.Types,
    };
    this.actions.push(entry);
    return entry;
  }

  // Control flow: a block is a group sharing GroupingIdentifier; WFControlFlowMode 0 opens, 1 is a middle branch, 2 closes.
  /** Open an If block on `subject`. `condition` is a `CONDITION` name or code; `value` is what it compares with, if anything. Returns the id for `otherwise()` and `endIf()`. */
  if(subject: Attachment, condition: Condition | number, value?: string | number): string {
    const gid = uuid();
    const params: Record<string, Value> = { GroupingIdentifier: gid, WFControlFlowMode: 0, WFInput: { Type: "Variable", Variable: subject }, WFCondition: typeof condition === "number" ? condition : CONDITION[condition] };
    if (typeof value === "number") params.WFNumberValue = value;
    else if (value !== undefined) params.WFConditionalActionString = value;
    this.action("is.workflow.actions.conditional", params);
    return gid;
  }
  /** Start the Otherwise branch of If block `gid`. */
  otherwise(gid: string): void { this.action("is.workflow.actions.conditional", { GroupingIdentifier: gid, WFControlFlowMode: 1 }); }
  /** Close If block `gid`. */
  endIf(gid: string): void { this.action("is.workflow.actions.conditional", { GroupingIdentifier: gid, WFControlFlowMode: 2 }); }
  /** Open a Repeat with Each block over `items`; returns the id for `endRepeatEach()`. Inside, use `repeatItem()` and `repeatIndex()`. */
  repeatEach(items: ParamTypes["is.workflow.actions.repeat.each"]["WFInput"]): string {
    const gid = uuid();
    this.action("is.workflow.actions.repeat.each", { GroupingIdentifier: gid, WFControlFlowMode: 0, WFInput: items });
    return gid;
  }
  /** Close a Repeat with Each block and return it; `ref()` it for the Repeat Results. */
  endRepeatEach(gid: string): Action {
    const a = this.action("is.workflow.actions.repeat.each", { GroupingIdentifier: gid, WFControlFlowMode: 2 });
    a.outputName = "Repeat Results";
    return a;
  }
  /** Open a Repeat block that runs `count` times; returns the id for `endRepeatCount()`. */
  repeatCount(count: ParamTypes["is.workflow.actions.repeat.count"]["WFRepeatCount"]): string {
    const gid = uuid();
    this.action("is.workflow.actions.repeat.count", { GroupingIdentifier: gid, WFControlFlowMode: 0, WFRepeatCount: count });
    return gid;
  }
  /** Close a Repeat block and return it; `ref()` it for the Repeat Results. */
  endRepeatCount(gid: string): Action {
    const a = this.action("is.workflow.actions.repeat.count", { GroupingIdentifier: gid, WFControlFlowMode: 2 });
    a.outputName = "Repeat Results";
    return a;
  }
  /**
   * Open a Choose from Menu block; returns the id for `menuItem()` and `endMenu()`. Follow with one
   * `menuItem()` per title, in order, each followed by that branch's actions.
   */
  chooseFromMenu(prompt: string | TokenString, items: string[]): string {
    const gid = uuid();
    this.action("is.workflow.actions.choosefrommenu", { GroupingIdentifier: gid, WFControlFlowMode: 0, WFMenuPrompt: prompt, WFMenuItems: items });
    return gid;
  }
  /** Start the branch for `title` in menu `gid`. */
  menuItem(gid: string, title: string): void { this.action("is.workflow.actions.choosefrommenu", { GroupingIdentifier: gid, WFControlFlowMode: 1, WFMenuItemTitle: title }); }
  /** Close menu `gid`. */
  endMenu(gid: string): void { this.action("is.workflow.actions.choosefrommenu", { GroupingIdentifier: gid, WFControlFlowMode: 2 }); }

  /** The shortcut as a plist object. */
  toPlist(): Record<string, PlistValue> {
    const actions = this.actions.map(({ outputName: _o, outputTypes: _t, ...a }) => a as unknown as PlistValue);
    return {
      WFWorkflowClientVersion: "4018.0.4",
      WFWorkflowMinimumClientVersion: 900,
      WFWorkflowMinimumClientVersionString: "900",
      WFWorkflowIcon: { WFWorkflowIconStartColor: this.color, WFWorkflowIconGlyphNumber: this.glyph },
      WFWorkflowTypes: this.types,
      WFQuickActionSurfaces: [],
      WFWorkflowInputContentItemClasses: this.inputClasses,
      WFWorkflowOutputContentItemClasses: [],
      WFWorkflowImportQuestions: [],
      WFWorkflowHasShortcutInputVariables: JSON.stringify(actions).includes('"ExtensionInput"'),
      WFWorkflowHasOutputFallback: false,
      WFWorkflowActions: actions,
    };
  }

  /** The shortcut as an XML plist. */
  toXml(): string { return toXmlPlist(this.toPlist()); }

  /** Write the unsigned file, `<name>.shortcut` by default, and return its path. Binary if `plutil` is installed, XML otherwise. */
  async write(path = `${this.name}.shortcut`): Promise<string> {
    await writeFile(path, this.toXml());
    const plutil = spawnSync("plutil", ["-convert", "binary1", path], { encoding: "utf8" });
    const missing = (plutil.error as NodeJS.ErrnoException | undefined)?.code === "ENOENT";
    if (!missing && plutil.status !== 0) throw new Error(`plutil failed: ${plutil.stderr}`);
    return path;
  }

  /** Sign `input` into `output`, which Shortcuts will import, and return `output`. Needs a Mac with an iCloud login. */
  static sign(input: string, output: string, mode: "anyone" | "people-who-know-me" = "anyone"): string {
    const r = spawnSync("shortcuts", ["sign", "--mode", mode, "--input", input, "--output", output], { encoding: "utf8" });
    if (r.error) throw new Error(`shortcuts sign failed for ${input}: ${r.error.message}`);
    if (r.status !== 0) throw new Error(`shortcuts sign failed for ${input}: ${r.stderr.trim()}`);
    return output;
  }
}
