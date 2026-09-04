// Value types accepted by parameter keys, grouped by the WorkflowKit state class that
// serializes them (see docs/parameter-encodings.md and data/encoding-table.json).
// Substitutable states accept a plain value or a run-time reference, so every plain
// type here is unioned with Attachment.
import type { PlistValue } from "./plist.js";

export type Attachment = { WFSerializationType: "WFTextTokenAttachment"; Value: Record<string, PlistValue> };
export type TokenString = { WFSerializationType: "WFTextTokenString"; Value: { string: string; attachmentsByRange: Record<string, Record<string, PlistValue>> } };
export type Picker = { Type: "Variable"; Variable: Attachment };
export type DictionaryValue = { WFSerializationType: "WFDictionaryFieldValue"; Value: { WFDictionaryFieldValueItems: Array<{ WFItemType: number; WFKey: TokenString; WFValue: TokenString | DictionaryValue }> } };
export type QuantityValue = { WFSerializationType: "WFQuantityFieldValue"; Value: { Unit: string; Magnitude?: number | TokenString } };
export type FilterTemplateValue = { WFSerializationType: "WFContentPredicateTableTemplate"; Value: { WFActionParameterFilterPrefix: 0 | 1; WFContentPredicateBoundedDate?: boolean; WFActionParameterFilterTemplates: Array<{ Property: string; Operator: number; Removable?: boolean; Bounded?: boolean; Values: Record<string, PlistValue | TokenString> }> } };
export type Value = PlistValue | Attachment | TokenString | Picker | DictionaryValue | QuantityValue | FilterTemplateValue;

/** Keeps literal suggestions in editors while still accepting any string. */
export type Loose<T extends string> = T | (string & {});

export type BoolValue = boolean | Attachment;                       // WFBooleanSubstitutableState
export type NumberValue = number | Attachment;                      // WFNumberSubstitutableState, WFNumberStringSubstitutableState
export type StringValue = string | Attachment;                      // WFStringSubstitutableState (enumerations, pickers)
export type EnumValue<T extends string> = Loose<T> | Attachment;    // WFStringSubstitutableState with a choice list
export type TextValue = string | TokenString | Attachment;          // WFVariableStringParameterState, WFURLStringParameterState, WFDateFieldParameterState
export type PickerValue = Picker | Attachment;                      // WFVariableParameterState
export type PlainString = string;                                   // WFStringParameterState (scripts, variable names)
export type PlainNumber = number;                                   // WFNumberParameterState
export type AnyValue = Value;                                       // everything else
