import catalogJson from "./generated/catalog.json";
import type { AppIntentDescriptor } from "./values.js";
import type { Provenance } from "./provenance.js";

/** JSON values in extracted defaults, descriptions and parameter visibility rules. */
export type CatalogValue = null | boolean | number | string | CatalogValue[] | { [key: string]: CatalogValue };

/** A parameter's accepted form and the evidence supporting it. Broad typing is not proof that every reference works. */
export interface CatalogParameter {
  kind: string;
  kindSource: string;
  choices: readonly string[];
  choiceTitles: Readonly<Record<string, string>>;
  label: string | null;
  description: string | null;
  default?: CatalogValue;
  refs: { status: "measured" | "not-probed"; allowed?: readonly string[] };
  entityType?: string;
  entityStatus: "resolved" | "unresolved" | "not-applicable";
}

/** One action joined from the saved extraction data, shared by both language packages. */
export interface CatalogAction {
  key: string;
  identifier: string;
  origin: "builtin" | "app-intent";
  app: { name: string | null; bundleIdentifier: string | null };
  name: string;
  description: string;
  descriptionNote: string;
  descriptionResult: string;
  descriptionEvidence: {
    source: "definition" | "registry";
    summary: "present" | "absent";
    note: "present" | "absent";
    result: "present" | "absent";
  };
  params: readonly string[];
  parameters: Readonly<Record<string, CatalogParameter>>;
  output: string | null;
  outputTypes: readonly string[];
  outputClasses: readonly string[];
  outputClassesBy: Readonly<Record<string, Readonly<Record<string, readonly string[]>>>>;
  outputEvidence: { status: "measured" | "not-probed" };
  inputTypes: readonly string[];
  inputKey: string | null;
  inputRequired: boolean;
  inputStatus: "declared" | "not-declared" | "named-parameters";
  keywords: readonly string[];
  summary: CatalogValue;
  unavailable?: boolean;
  discontinued: boolean;
  requiresUnlock: boolean;
  disabledOn: readonly string[];
  requires: Readonly<Record<string, readonly { key: string; relation: string; values: readonly CatalogValue[] }[]>>;
  descriptor?: AppIntentDescriptor;
  filterStatus: "available" | "unresolved" | "not-applicable";
  filterClass?: string;
}

/** Extracted entity-property types, including alternatives and list element types. */
export interface CatalogTypeInfo {
  kind: string;
  type?: string;
  typeName?: string;
  bundleIdentifier?: string;
  primitive?: string;
  optional?: boolean;
  of?: CatalogTypeInfo | CatalogTypeInfo[];
}

export interface CatalogEntity {
  name: string;
  app: string;
  bundleIdentifier: string;
  find?: string;
  properties: Readonly<Record<string, { name: string; type: string; typeInfo?: CatalogTypeInfo }>>;
}

export interface CatalogFilterRow {
  operators: readonly number[];
  values: string;
  units?: readonly number[];
  choices?: readonly string[];
}

export interface CatalogContentItemClass {
  name: string | null;
  plural?: string | null;
  superclass: string | null;
  coercible: boolean;
  coercesTo: readonly string[];
  ownedTypes: readonly { kind: string; name: string }[];
  properties: readonly {
    name: string;
    valueClass: string | null;
    yields: readonly string[];
    gettable: boolean;
    filterable: boolean;
    sortable: boolean;
    multiple: boolean;
    userInfo: CatalogValue;
  }[];
}

/** Stable structural surface; declarations do not repeat every extracted action as an inferred JSON type. */
export interface CatalogModel {
  schemaVersion: 1;
  provenance: Provenance;
  actions: Readonly<Record<string, CatalogAction>>;
  entities: Readonly<Record<string, CatalogEntity>>;
  filters: Readonly<Record<string, Readonly<Record<string, CatalogFilterRow>>>>;
  filterOperators: Readonly<Record<string, number>>;
  calendarUnits: Readonly<Record<string, number>>;
  byteCountUnits: Readonly<Record<string, number>>;
  boundedFilters: Readonly<Record<string, { property: string; operators: readonly number[] }>>;
  contentItemClasses: Readonly<Record<string, CatalogContentItemClass>>;
  contentItemTypes: Readonly<Record<string, string>>;
}

/** The complete joined extraction snapshot, identical in the TypeScript and Python distributions. */
export const CATALOG: CatalogModel = catalogJson as CatalogModel;
