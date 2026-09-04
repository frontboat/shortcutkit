// Typed access to the bundled action definitions (data/builtin-actions.json), the
// dictionaries WorkflowKit's WFBundledActionProvider hands out. Field names are Apple's.
import definitions from "../data/builtin-actions.json";
import type { ActionId } from "./generated/actions.js";

/** A localized string as the dumper resolves it: the English default. Parameter summaries keep their format string. */
export type Localized = string | { format?: string; title?: string; possibleValues?: ParameterSummaryValue[] };
export interface ParameterSummaryValue { key?: string; format?: string; requiredValues?: Record<string, unknown> }

export interface ParameterDefinition {
  Key: string;
  /** WorkflowKit parameter class, e.g. "WFSwitchParameter"; decides the value encoding (see values.ts). */
  Class: string;
  Label?: string;
  Placeholder?: string;
  Description?: string;
  DefaultValue?: unknown;
  /** Choice labels for enumeration parameters. */
  Items?: string[];
  Hidden?: boolean;
  RequiredResources?: unknown[];
  [key: string]: unknown;
}

export interface ActionDefinition {
  ActionClass?: string;
  Name?: string;
  Description?: { DescriptionSummary?: string; DescriptionInput?: string; DescriptionResult?: string; DescriptionNote?: string };
  ActionKeywords?: string;
  IconSymbol?: string;
  IconColor?: string;
  Parameters?: ParameterDefinition[];
  ParameterSummary?: Localized;
  Input?: { ParameterKey?: string; Types?: string[]; Required?: boolean; Multiple?: boolean; InputTypeDeterminesOutputType?: boolean };
  Output?: { OutputName?: string; Types?: string[]; Multiple?: boolean; DisclosureLevel?: string };
  InputPassthrough?: boolean;
  ResidentCompatible?: boolean;
  RequiresUserInteraction?: boolean;
  RequiredResources?: Array<string | { resource: string; [key: string]: unknown }>;
  FillingProvider?: string;
  AppIdentifier?: string;
  [key: string]: unknown;
}

const DEFINITIONS = definitions as unknown as Record<string, ActionDefinition>;

/** The full definition record for a built-in action, or undefined for identifiers the engine does not know. */
export function getDefinition(identifier: ActionId): ActionDefinition;
export function getDefinition(identifier: string): ActionDefinition | undefined;
export function getDefinition(identifier: string): ActionDefinition | undefined {
  return DEFINITIONS[identifier];
}

/** Every built-in definition, keyed by identifier. */
export function allDefinitions(): Readonly<Record<string, ActionDefinition>> {
  return DEFINITIONS;
}
