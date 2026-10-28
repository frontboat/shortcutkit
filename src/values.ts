// Value types accepted by parameter keys, grouped by the WorkflowKit state class that
// serializes them (see docs/parameter-encodings.md and data/encoding-table.json).
// Substitutable states accept a plain value or a run-time reference, so every plain
// type here is unioned with Attachment.
import type { PlistValue } from "./plist.js";

/** The variable kinds a reference can name, as the engine spells them. */
export type VariableType = "ActionOutput" | "ExtensionInput" | "Variable" | "Clipboard" | "CurrentDate" | "Ask" | "DeviceDetails" | "CurrentApp";
/** A run-time reference. Each helper returns the narrow type (ref() an Attachment<"ActionOutput">), so a key the
 *  engine reads only some references for (PARAM_VARIABLE_TYPES) can say which at compile time. */
export type Attachment<T extends VariableType = VariableType> = { WFSerializationType: "WFTextTokenAttachment"; Value: { Type: T } & Record<string, PlistValue> };
export type AskAttachment = Attachment<"Ask">;
export type TokenString = { WFSerializationType: "WFTextTokenString"; Value: { string: string; attachmentsByRange: Record<string, Record<string, PlistValue>> } };
/** The subject of an If condition (`WFInput` on `is.workflow.actions.conditional`): an attachment wrapped as the app writes it. Not the variable-picker form, which is the bare attachment. */
export type ConditionSubject = { Type: "Variable"; Variable: Attachment };
/** @deprecated Misnamed: this is the If-subject form. Variable-picker parameters take a bare `Attachment`. */
export type Picker = ConditionSubject;
/** Names the app that provides an App Intents action; written as the AppIntentDescriptor parameter (`action()` adds `ActionRequiresAppInstallation`). */
export type AppIntentDescriptor = { BundleIdentifier: string; Name: string; TeamIdentifier: string; AppIntentIdentifier: string; ActionRequiresAppInstallation?: boolean };
/** One value of a `dictionary()`: text (a string, `text()` or a reference), a number, a boolean, a list, or a nested dictionary. */
export type DictionaryItem = string | number | boolean | TokenString | Attachment | readonly DictionaryItem[] | DictionaryItems;
/** A dictionary's keys and values before encoding; `dictionary()` and `action()` encode them. */
export type DictionaryItems = { readonly [key: string]: DictionaryItem };
/** Item type codes the dictionary state class reads: text, dictionary, array, number, boolean (docs/shortcut-file-format.md). */
export type DictionaryItemType = 0 | 1 | 2 | 3 | 4;
/** An item's value, by type: a token string for text and numbers, a number-substitutable state for booleans, a wrapped dictionary, or an array. */
export type DictionaryFieldValue = TokenString | { WFSerializationType: "WFNumberSubstitutableState"; Value: boolean | Attachment } | { WFSerializationType: "WFDictionaryFieldValue"; Value: DictionaryValue } | ArrayValue;
/** An array item: plain text as the bare string, anything else typed, without a key. */
export type ArrayValue = { WFSerializationType: "WFArrayParameterState"; Value: Array<string | { WFItemType: DictionaryItemType; WFValue: DictionaryFieldValue }> };
/** An encoded dictionary (`WFDictionaryFieldValue`), as `dictionary()` writes it and the engine serializes it back. */
export type DictionaryValue = { WFSerializationType: "WFDictionaryFieldValue"; Value: { WFDictionaryFieldValueItems: Array<{ WFKey: TokenString; WFItemType: DictionaryItemType; WFValue: DictionaryFieldValue }> } };
/** What a dictionary parameter takes: an encoded dictionary, or the items for `action()` to encode. */
export type DictionaryParam = DictionaryValue | DictionaryItems;
export type QuantityValue = { WFSerializationType: "WFQuantityFieldValue"; Value: { Unit: string; Magnitude?: number | TokenString } };
export type FilterTemplateValue = { WFSerializationType: "WFContentPredicateTableTemplate"; Value: { WFActionParameterFilterPrefix: 0 | 1; WFContentPredicateBoundedDate?: boolean; WFActionParameterFilterTemplates: Array<{ Property: string; Operator: number; Removable?: boolean; Bounded?: boolean; Values: Record<string, PlistValue | TokenString> }> } };
/** One condition of a Find filter: `[property, operator, ...values]`. FilterRows (generated) lists the rows each Find action takes. */
export type FilterRow = readonly [string, string, ...unknown[]];
/** Find conditions from `where()` or `whereAny()`; `action()` encodes them for the Find action's entity. */
export type Where<R extends FilterRow = FilterRow> = { readonly match: "all" | "any"; readonly rows: readonly R[] };
export type Value = PlistValue | Attachment | TokenString | ConditionSubject | DictionaryValue | DictionaryItems | QuantityValue | FilterTemplateValue | Where;

/** Keeps literal suggestions in editors while still accepting any string. */
export type Loose<T extends string> = T | (string & {});

export type BoolValue = boolean | Attachment;                       // WFBooleanSubstitutableState
export type NumberValue = number | Attachment;                      // WFNumberSubstitutableState, WFNumberStringSubstitutableState
export type StringValue = string | Attachment;                      // WFStringSubstitutableState (enumerations, pickers)
export type EnumValue<T extends string> = Loose<T> | Attachment;    // WFStringSubstitutableState with a choice list
export type DateValue = Date | Attachment;                          // WFDateSubstitutableState (filter rows): a plist date
export type TextValue = string | TokenString | Attachment;          // WFVariableStringParameterState, WFURLStringParameterState, WFDateFieldParameterState
export type PickerValue = Attachment;                               // WFVariableParameterState: a bare reference (engine, gallery and library agree)
export type SubjectValue = ConditionSubject | Attachment;           // If's WFInput; action() wraps a bare attachment
export type PlainString = string;                                   // WFStringParameterState (scripts, variable names)
export type PlainNumber = number;                                   // WFNumberParameterState
export type AnyValue = Value;                                       // everything else
