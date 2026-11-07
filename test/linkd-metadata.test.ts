import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";

type ActionMetadata = {
  discoverable: boolean;
  assistantOnly?: boolean;
  availability: Record<string, { introduced: string | null; deprecated: string | null; obsoleted: string | null }>;
  deprecated?: string;
};
type BundleMetadata = Record<string, Record<string, ActionMetadata> | null>;
const payload = readFileSync(join(import.meta.dir, "..", "tools/linkd/action-metadata.js"), "utf8");
// Evaluate exactly the standalone script the loader uses, without calling its private-framework main().
const normalize = runInNewContext(payload + "\nnormalizeActionMetadata;") as (metadata: BundleMetadata) => BundleMetadata;
const metadata = (address: string, message = "Use option 0xBEEF", replacement = "ReplacementIntent"): BundleMetadata => ({
  "test.empty": {},
  "test.unavailable": null,
  "test.app": {
    OldIntent: {
      discoverable: false,
      assistantOnly: true,
      availability: { macOS: { introduced: "27", deprecated: "28", obsoleted: null } },
      deprecated: `<LNActionDeprecationMetadata: ${address}, message: <LNStaticDeferredLocalizedString: ${address}, key: ${message}>, replacedByIntentIdentifier: ${replacement}>`,
    },
    CurrentIntent: {
      discoverable: true,
      availability: { macOS: { introduced: "28", deprecated: null, obsoleted: null } },
    },
  },
});

describe("linkd action metadata normalization", () => {
  test("process addresses are volatile while deprecation messages and replacements remain evidence", () => {
    const first = normalize(metadata("0x123a"));
    expect(first).toEqual(normalize(metadata("0xB456")));
    expect(first).not.toEqual(normalize(metadata("0x123a", "Use option 0xCAFE")));
    expect(first).not.toEqual(normalize(metadata("0x123a", "Use option 0xBEEF", "DifferentIntent")));
    expect(first["test.app"]!.OldIntent!.deprecated).toBe("<LNActionDeprecationMetadata, message: <LNStaticDeferredLocalizedString, key: Use option 0xBEEF>, replacedByIntentIdentifier: ReplacementIntent>");
    expect(normalize(first)).toEqual(first);
  });

  test("empty successful bundles are omitted, unknown bundles retained, and action metadata unchanged", () => {
    const source = metadata("0x123a");
    const before = structuredClone(source);
    const result = normalize(source);
    expect(Object.hasOwn(result, "test.empty")).toBe(false);
    expect(Object.hasOwn(result, "test.unavailable")).toBe(true);
    expect(result["test.unavailable"]).toBeNull();
    expect(Object.keys(result["test.app"]!)).toEqual(["OldIntent", "CurrentIntent"]);
    expect(result["test.app"]!.CurrentIntent).toEqual(source["test.app"]!.CurrentIntent);
    const old = { ...result["test.app"]!.OldIntent! };
    const expected = { ...source["test.app"]!.OldIntent! };
    delete old.deprecated;
    delete expected.deprecated;
    expect(old).toEqual(expected);
    expect(source).toEqual(before);
  });

  test("the saved snapshot is normalized and retains known discovery and availability facts", () => {
    const snapshot = JSON.parse(readFileSync(join(import.meta.dir, "..", "data/linkd-actions.json"), "utf8")) as BundleMetadata;
    expect(normalize(snapshot)).toEqual(snapshot);
    expect(snapshot["com.apple.freeform"]!.CRLAddStickyNoteToBoardIntent!.deprecated).toContain("replacedByIntentIdentifier: CRLAddItemToBoardIntent");
    expect(snapshot["com.apple.AddressBook"]!.CreateContactIntent!.discoverable).toBe(false);
    expect(snapshot["com.apple.AddressBook"]!.CreateContactIntent!.availability.LNPlatformNameMACOS!.introduced).toBe("27");
  });
});
