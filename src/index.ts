// shortcutkit: build, validate and sign Apple Shortcuts files.
// Format reference: docs/shortcut-file-format.md. Definitions: data/builtin-actions.json.
import { spawnSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { toXmlPlist, type PlistValue } from "./plist.js";
import { getDefinition, type ActionDefinition } from "./definitions.js";
import { ACTIONS, PARAM_KINDS, PARAM_VARIABLE_TYPES } from "./generated/actions.js";
import type { ActionId, MetaParams, ParamTypes } from "./generated/actions.js";
import type { AskAttachment, Attachment, ConditionSubject, TokenString, Value, VariableType } from "./values.js";

export { actions, ACTIONS, PARAM_KINDS, PARAM_CHOICES, PARAM_VARIABLE_TYPES, type ActionId, type ActionKey, type ParamKey, type ParamTypes, type MetaParams } from "./generated/actions.js";
export type { PlistValue } from "./plist.js";
export type * from "./values.js";
export { getDefinition, allDefinitions, type ActionDefinition, type ParameterDefinition, type Localized } from "./definitions.js";
export { provenance, type Provenance } from "./provenance.js";
export type * from "./generated/params.js";

/** Parameters accepted for an identifier: typed per key for built-in actions, open for anything else. */
export type ParamsFor<I extends string> = I extends ActionId ? Partial<ParamTypes[I] & MetaParams> : Record<string, Value>;

/** An action as `action()` returns it; pass it to `ref()` to use its output. */
export type Action = { WFWorkflowActionIdentifier: string; WFWorkflowActionParameters: Record<string, Value>; outputName?: string; outputTypes?: readonly string[] };
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
  /** Present for App Intents actions; written as the AppIntentDescriptor parameter. */
  descriptor?: AppIntentDescriptor;
  /** The engine's definition, for built-ins only. */
  definition?: ActionDefinition;
};

/**
 * Look up any catalog identifier, built-in or App Intent. Unlike getDefinition(), which knows
 * only built-ins, this covers both in one shape.
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


/** The icon palette, in picker order, as the file stores each color. */
export const ICON_COLORS = {
  Red: 4282601983, DarkOrange: 4251333119, Orange: 4271458815, Yellow: 4274264319, Green: 4292093695,
  Teal: 431817727, LightBlue: 1440408063, Blue: 463140863, DarkBlue: 946986751, Violet: 2071128575,
  Purple: 3679049983, Pink: 3980825855, Taupe: 255, Gray: 3031607807, DarkGray: 2846468607,
} as const;
export type IconColor = keyof typeof ICON_COLORS;
export const DEFAULT_GLYPH = 61440;

/** If condition codes. less_than, greater_than, contains, has_any_value, and has_no_value are verified against the engine or Apple's files; the rest follow community documentation. */
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
   * identifiers pass through unchecked.
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
    const restricted = (PARAM_VARIABLE_TYPES as Record<string, Record<string, readonly string[]>>)[identifier] ?? {};
    const normalized: Record<string, Value> = {};
    for (const [k, v] of Object.entries(params as Record<string, Value>)) {
      // Keys the engine reads no reference for (or only Ask): the same rule the compiler applies, at run time.
      const allowed = restricted[k];
      if (allowed) {
        const bad = referenceTypes(v).filter((t) => !allowed.includes(t));
        if (bad.length > 0) throw new Error(`${identifier}.${k}: the engine does not read a ${bad.join("/")} reference here (it reads ${allowed.length ? allowed.join(", ") : "only a plain value"})`);
      }
      normalized[k] = kinds[k] === "text" && isAttachment(v) ? text(v) : kinds[k] === "subject" && isAttachment(v) ? subject(v) : v;
    }
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
