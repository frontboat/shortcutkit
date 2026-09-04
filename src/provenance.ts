// Which macOS and Shortcuts build the bundled data was extracted from (data/provenance.json).
import provenanceJson from "../data/provenance.json";

export interface Provenance {
  extractedAt: string;
  macOS: { version: string; build: string; arch: string };
  shortcutsApp: { version: string; build: string };
  workflowKit: string;
  /** ActionKit.framework version; it defines the built-in actions WorkflowKit does not (Ask for Input, Show Alert, Count, ...). */
  actionKit?: string;
  /** The Shortcuts app's action index the App Intents catalogue was read from. */
  toolKit?: { source: string; osVersion: string; indexerSource: string; toolkitVersion: string; launchServicesSequence: number };
  counts: { builtinActions: number; appleAppIntents?: number; identifierStrings: number; appProvidedActions: number };
  note?: string;
}

/** Provenance of the bundled action data. */
export const provenance: Provenance = provenanceJson as Provenance;
