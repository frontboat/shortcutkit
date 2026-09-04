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
export type DictionaryValue = { WFSerializationType: "WFDictionaryFieldValue"; Value: { WFDictionaryFieldValueItems: Array<{ WFItemType: number; WFKey: TokenString; WFValue: TokenString | DictionaryValue }> } };
export type QuantityValue = { WFSerializationType: "WFQuantityFieldValue"; Value: { Unit: string; Magnitude?: number | TokenString } };
export type FilterTemplateValue = { WFSerializationType: "WFContentPredicateTableTemplate"; Value: { WFActionParameterFilterPrefix: 0 | 1; WFContentPredicateBoundedDate?: boolean; WFActionParameterFilterTemplates: Array<{ Property: string; Operator: number; Removable?: boolean; Bounded?: boolean; Values: Record<string, PlistValue | TokenString> }> } };
export type Value = PlistValue | Attachment | TokenString | ConditionSubject | DictionaryValue | QuantityValue | FilterTemplateValue;

/** Keeps literal suggestions in editors while still accepting any string. */
export type Loose<T extends string> = T | (string & {});

export type BoolValue = boolean | Attachment;                       // WFBooleanSubstitutableState
export type NumberValue = number | Attachment;                      // WFNumberSubstitutableState, WFNumberStringSubstitutableState
export type StringValue = string | Attachment;                      // WFStringSubstitutableState (enumerations, pickers)
export type EnumValue<T extends string> = Loose<T> | Attachment;    // WFStringSubstitutableState with a choice list
export type TextValue = string | TokenString | Attachment;          // WFVariableStringParameterState, WFURLStringParameterState, WFDateFieldParameterState
export type PickerValue = Attachment;                               // WFVariableParameterState: a bare reference (engine, gallery and library agree)
export type SubjectValue = ConditionSubject | Attachment;           // If's WFInput; action() wraps a bare attachment
export type PlainString = string;                                   // WFStringParameterState (scripts, variable names)
export type PlainNumber = number;                                   // WFNumberParameterState
export type AnyValue = Value;                                       // everything else
