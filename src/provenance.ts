// Which macOS and Shortcuts build the bundled data was extracted from (data/provenance.json).
import provenanceJson from "../data/provenance.json";

export interface Provenance {
  extractedAt: string;
  macOS: { version: string; build: string; arch: string };
  shortcutsApp: { version: string; build: string };
  workflowKit: string;
  counts: { builtinActions: number; identifierStrings: number; appProvidedActions: number };
  note?: string;
}

/** Provenance of the bundled action data. */
export const provenance: Provenance = provenanceJson as Provenance;
