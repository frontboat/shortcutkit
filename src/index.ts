// shortcutkit: build, validate and sign Apple Shortcuts files.
// Format reference: docs/shortcut-file-format.md. Definitions: data/builtin-actions.json.
import { spawnSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { toXmlPlist, type PlistValue } from "./plist.js";
import { getDefinition, type ActionDefinition } from "./definitions.js";
import { ACTIONS, PARAM_KINDS } from "./generated/actions.js";
import type { ActionId, MetaParams, ParamTypes } from "./generated/actions.js";
import type { Attachment, Picker, TokenString, Value } from "./values.js";

export { actions, ACTIONS, PARAM_KINDS, type ActionId, type ActionKey, type ParamKey, type ParamTypes, type MetaParams } from "./generated/actions.js";
export type { PlistValue } from "./plist.js";
export type * from "./values.js";
export { getDefinition, allDefinitions, type ActionDefinition, type ParameterDefinition, type Localized } from "./definitions.js";
export { provenance, type Provenance } from "./provenance.js";
export type * from "./generated/params.js";

/** Parameters accepted for an identifier: typed per key for built-in actions, open for anything else. */
export type ParamsFor<I extends string> = I extends ActionId ? Partial<ParamTypes[I] & MetaParams> : Record<string, Value>;

export type Action = { WFWorkflowActionIdentifier: string; WFWorkflowActionParameters: Record<string, Value>; outputName?: string; outputTypes?: readonly string[] };
/** Content types an action's output can be (`WFStringContentItem`, `NSURL`, an App Intents entity, …). Shortcuts coerces between many of them at run time, so this describes, it does not restrict. */
export type OutputTypes<I extends ActionId> = (typeof ACTIONS)[I]["outputTypes"];
/** What the catalogue knows about an identifier: built-in or App Intent, engine definition or not. */
export type CatalogEntry = {
  identifier: string;
  /** Display name, as the editor shows it. */
  name: string;
  /** Parameter keys the action accepts, in the editor's order. */
  params: readonly string[];
  /** Value kind per key: bool, number, string, text, picker, plainString, plainNumber, dictionary, quantity, filter, any. */
  kinds: Record<string, string>;
  /** Output name, or null when the action produces nothing. */
  output: string | null;
  /** Content types the output can be; empty when the action produces nothing. */
  outputTypes: readonly string[];
  /** Present for App Intents actions; written as the AppIntentDescriptor parameter. */
  descriptor?: AppIntentDescriptor;
  /** The engine's definition, for built-ins only. */
  definition?: ActionDefinition;
};

/**
 * Look up any catalogue identifier, built-in or App Intent. getDefinition() only knows built-ins
 * (App Intents have no engine definition); this covers both with the same shape.
 */
export function getAction(identifier: string): CatalogEntry | undefined {
  const entry = (ACTIONS as Record<string, { name: string; params: readonly string[]; output: string | null; outputTypes: readonly string[]; descriptor?: AppIntentDescriptor }>)[identifier];
  if (!entry) return undefined;
  const kinds = { ...((PARAM_KINDS as Record<string, Record<string, string>>)[identifier] ?? {}) };
  const definition = getDefinition(identifier);
  return { identifier, name: entry.name, params: entry.params, kinds, output: entry.output, outputTypes: entry.outputTypes, ...(entry.descriptor ? { descriptor: entry.descriptor } : {}), ...(definition ? { definition } : {}) };
}

/** Names the app that provides an App Intents action; written as the AppIntentDescriptor parameter. */
export type AppIntentDescriptor = { BundleIdentifier: string; Name: string; TeamIdentifier: string; AppIntentIdentifier: string };


/** WFWorkflowIcon.backgroundColorValue for palette colors 0-14, unsigned as the plist stores it. */
export const ICON_COLORS = {
  Red: 4282601983, DarkOrange: 4251333119, Orange: 4271458815, Yellow: 4274264319, Green: 4292093695,
  Teal: 431817727, LightBlue: 1440408063, Blue: 463140863, DarkBlue: 946986751, Violet: 2071128575,
  Purple: 3679049983, Pink: 3980825855, Taupe: 255, Gray: 3031607807, DarkGray: 2846468607,
} as const;
export type IconColor = keyof typeof ICON_COLORS;
export const DEFAULT_GLYPH = 61440;

/** Legacy WFCondition codes. Marked (v) = verified on this Mac or in Apple's gallery; others follow community docs. */
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
const attachment = (value: Record<string, PlistValue>): Attachment => ({ WFSerializationType: "WFTextTokenAttachment", Value: value });

/** Reference another action's output. */
export const ref = (action: Action, outputName?: string): Attachment =>
  attachment({ Type: "ActionOutput", OutputUUID: action.WFWorkflowActionParameters.UUID as string, OutputName: outputName ?? action.outputName ?? "Output" });
export const variable = (name: string): Attachment => attachment({ Type: "Variable", VariableName: name });
export const shortcutInput = (): Attachment => attachment({ Type: "ExtensionInput" });
export const clipboard = (): Attachment => attachment({ Type: "Clipboard" });
export const currentDate = (): Attachment => attachment({ Type: "CurrentDate" });
export const ask = (prompt?: string): Attachment => attachment(prompt ? { Type: "Ask", Prompt: prompt } : { Type: "Ask" });
/** Wrap an attachment for WFVariablePickerParameter keys (Repeat with Each, If). */
export const picker = (a: Attachment): Picker => ({ Type: "Variable", Variable: a });

const isAttachment = (v: unknown): v is Attachment =>
  typeof v === "object" && v !== null && (v as Attachment).WFSerializationType === "WFTextTokenAttachment";

/** A WFTextTokenString: strings and attachments interleaved; each attachment becomes U+FFFC. */
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

export interface ShortcutOptions { color?: IconColor | number; glyph?: number; inputClasses?: string[] }

export class Shortcut {
  readonly name: string;
  readonly actions: Action[] = [];
  private readonly color: number;
  private readonly glyph: number;
  private readonly inputClasses: string[];

  constructor(name: string, options: ShortcutOptions = {}) {
    this.name = name;
    this.color = typeof options.color === "number" ? options.color : ICON_COLORS[options.color ?? "Blue"];
    this.glyph = options.glyph ?? DEFAULT_GLYPH;
    this.inputClasses = options.inputClasses ?? [];
  }

  /**
   * Append an action. With an identifier from `actions`, parameter keys are checked at compile
   * time; any identifier is also validated at run time against the bundled definitions.
   */
  action<I extends string>(identifier: I, params: ParamsFor<I> = {} as ParamsFor<I>): Action {
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
    const normalized: Record<string, Value> = {};
    for (const [k, v] of Object.entries(params as Record<string, Value>)) normalized[k] = kinds[k] === "text" && isAttachment(v) ? text(v) : v;
    // App Intents actions carry a descriptor naming the app that provides them (see docs/shortcut-file-format.md §2).
    const descriptor: Record<string, Value> = catalog?.descriptor ? { AppIntentDescriptor: { ...catalog.descriptor, ActionRequiresAppInstallation: true } } : {};
    const entry: Action = {
      WFWorkflowActionIdentifier: identifier,
      WFWorkflowActionParameters: { UUID: uuid(), ...descriptor, ...normalized },
      outputName: definition?.Output?.OutputName ?? catalog?.output ?? undefined,
      outputTypes: catalog?.outputTypes ?? definition?.Output?.Types,
    };
    this.actions.push(entry);
    return entry;
  }

  // Control flow: a block is a group sharing GroupingIdentifier; WFControlFlowMode 0 opens, 1 is a middle branch, 2 closes.
  if(subject: Attachment, condition: Condition | number, value?: string | number): string {
    const gid = uuid();
    const params: Record<string, Value> = { GroupingIdentifier: gid, WFControlFlowMode: 0, WFInput: picker(subject), WFCondition: typeof condition === "number" ? condition : CONDITION[condition] };
    if (typeof value === "number") params.WFNumberValue = value;
    else if (value !== undefined) params.WFConditionalActionString = value;
    this.action("is.workflow.actions.conditional", params);
    return gid;
  }
  otherwise(gid: string): void { this.action("is.workflow.actions.conditional", { GroupingIdentifier: gid, WFControlFlowMode: 1 }); }
  endIf(gid: string): void { this.action("is.workflow.actions.conditional", { GroupingIdentifier: gid, WFControlFlowMode: 2 }); }
  repeatEach(items: Attachment): string {
    const gid = uuid();
    this.action("is.workflow.actions.repeat.each", { GroupingIdentifier: gid, WFControlFlowMode: 0, WFInput: picker(items) });
    return gid;
  }
  endRepeatEach(gid: string): void { this.action("is.workflow.actions.repeat.each", { GroupingIdentifier: gid, WFControlFlowMode: 2 }); }
  /** Open a Repeat block that runs `count` times; returns the grouping identifier for endRepeatCount(). */
  repeatCount(count: number | Attachment): string {
    const gid = uuid();
    this.action("is.workflow.actions.repeat.count", { GroupingIdentifier: gid, WFControlFlowMode: 0, WFRepeatCount: count });
    return gid;
  }
  endRepeatCount(gid: string): void { this.action("is.workflow.actions.repeat.count", { GroupingIdentifier: gid, WFControlFlowMode: 2 }); }
  /**
   * Open a Choose from Menu block. Follow with one menuItem() per title, in order, each with the
   * actions of that branch, then endMenu(). Returns the grouping identifier.
   */
  chooseFromMenu(prompt: string | TokenString, items: string[]): string {
    const gid = uuid();
    this.action("is.workflow.actions.choosefrommenu", { GroupingIdentifier: gid, WFControlFlowMode: 0, WFMenuPrompt: prompt, WFMenuItems: items });
    return gid;
  }
  menuItem(gid: string, title: string): void { this.action("is.workflow.actions.choosefrommenu", { GroupingIdentifier: gid, WFControlFlowMode: 1, WFMenuItemTitle: title }); }
  endMenu(gid: string): void { this.action("is.workflow.actions.choosefrommenu", { GroupingIdentifier: gid, WFControlFlowMode: 2 }); }

  toPlist(): Record<string, PlistValue> {
    const actions = this.actions.map(({ outputName: _o, outputTypes: _t, ...a }) => a as unknown as PlistValue);
    return {
      WFWorkflowClientVersion: "4018.0.4",
      WFWorkflowMinimumClientVersion: 900,
      WFWorkflowMinimumClientVersionString: "900",
      WFWorkflowIcon: { WFWorkflowIconStartColor: this.color, WFWorkflowIconGlyphNumber: this.glyph },
      WFWorkflowTypes: [],
      WFQuickActionSurfaces: [],
      WFWorkflowInputContentItemClasses: this.inputClasses,
      WFWorkflowOutputContentItemClasses: [],
      WFWorkflowImportQuestions: [],
      WFWorkflowHasShortcutInputVariables: JSON.stringify(actions).includes('"ExtensionInput"'),
      WFWorkflowHasOutputFallback: false,
      WFWorkflowActions: actions,
    };
  }

  toXml(): string { return toXmlPlist(this.toPlist()); }

  /** Write the unsigned file. Shortcuts names an import after the file, so the default is "<name>.shortcut". Converts to binary plist via plutil when present. */
  async write(path = `${this.name}.shortcut`): Promise<string> {
    await writeFile(path, this.toXml());
    const plutil = spawnSync("plutil", ["-convert", "binary1", path], { encoding: "utf8" });
    const missing = (plutil.error as NodeJS.ErrnoException | undefined)?.code === "ENOENT";
    if (!missing && plutil.status !== 0) throw new Error(`plutil failed: ${plutil.stderr}`);
    return path;
  }

  /** Sign with the macOS `shortcuts` command so Shortcuts will import the file. */
  static sign(input: string, output: string, mode: "anyone" | "people-who-know-me" = "anyone"): string {
    const r = spawnSync("shortcuts", ["sign", "--mode", mode, "--input", input, "--output", output], { encoding: "utf8" });
    if (r.error) throw new Error(`shortcuts sign failed: ${r.error.message}`);
    if (r.status !== 0) throw new Error(`shortcuts sign failed: ${r.stderr}`);
    return output;
  }
}
