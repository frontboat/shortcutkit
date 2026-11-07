// Generate every prepared source artifact from the saved Apple snapshot, without private APIs.
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { renderCatalog } from "./render-catalog";
import type { CatalogModel } from "../src/catalog";

const root = join(import.meta.dir, "..");
const check = process.argv.slice(2).includes("--check");
if (process.argv.slice(2).some((arg) => arg !== "--check")) throw new Error("usage: bun run tools/generate.ts [--check]");
const work = mkdtempSync(join(tmpdir(), "shortcutkit-generate-"));
const outputs = [
  "src/generated/actions.ts", "src/generated/params.ts", "src/generated/entities.ts", "src/generated/catalog.json",
  "python/src/shortcutkit/actions.py", "python/src/shortcutkit/entities.py",
  "python/src/shortcutkit/data/builtin-actions.json", "python/src/shortcutkit/data/provenance.json",
  "python/src/shortcutkit/data/catalog.json", "docs/catalog.txt", "python/src/shortcutkit/data/catalog.txt",
];
try {
  const generated = spawnSync(process.env.PYTHON ?? "python3", [join(root, "tools/generate-action-catalog.py"), "--output-root", work], { stdio: "inherit" });
  if (generated.status !== 0) throw generated.error ?? new Error(`metadata generation exited ${generated.status}`);
  const model = JSON.parse(readFileSync(join(work, "src/generated/catalog.json"), "utf8")) as CatalogModel;
  const catalog = renderCatalog(model);
  mkdirSync(join(work, "docs"), { recursive: true });
  writeFileSync(join(work, "docs/catalog.txt"), catalog);
  writeFileSync(join(work, "python/src/shortcutkit/data/catalog.txt"), catalog);
  const stale: string[] = [];
  for (const path of outputs) {
    const expected = readFileSync(join(work, path));
    const file = Bun.file(join(root, path));
    if (await file.exists() && expected.equals(Buffer.from(await file.arrayBuffer()))) continue;
    stale.push(path);
    if (!check) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), expected);
    }
  }
  if (check && stale.length) {
    console.error(`Generated files are stale; run bun run generate:\n${stale.join("\n")}`);
    process.exitCode = 1;
  } else console.log(check ? "Generated files are current." : `Updated ${stale.length} generated files.`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
