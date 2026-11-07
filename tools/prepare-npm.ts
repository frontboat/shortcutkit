import { copyFileSync } from "node:fs";
import { join } from "node:path";

// Builds consume prepared sources; they do not rewrite tracked generated files.
const root = join(import.meta.dir, "..");
copyFileSync(join(root, "docs/catalog.txt"), join(root, "dist/catalog.txt"));
copyFileSync(join(root, "src/generated/catalog.json"), join(root, "dist/catalog.json"));
