// Check the archive consumers install, including its declarations and shared catalogue.
import { copyFileSync, mkdtempSync, readFileSync, readdirSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const root = join(import.meta.dir, "..");
const work = mkdtempSync(join(tmpdir(), "shortcutkit-npm-"));
try {
  const packed = JSON.parse(execFileSync("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", work], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, SHORTCUTKIT_SKIP_PREPARE: "1" },
  }));
  const packages = Array.isArray(packed) ? packed : Object.values(packed);
  if (packages.length !== 1) throw new Error("expected one packed npm distribution");
  execFileSync("tar", ["-xzf", join(work, packages[0].filename), "-C", work]);
  const archive = join(work, "package");
  const manifest = JSON.parse(readFileSync(join(archive, "package.json"), "utf8"));
  for (const hook of ["preinstall", "install", "postinstall"]) {
    if (manifest.scripts?.[hook]) throw new Error(`npm distribution must not contain a ${hook} hook`);
  }
  if (!readFileSync(join(archive, "dist/catalog.txt")).equals(readFileSync(join(root, "docs/catalog.txt")))) throw new Error("npm catalogue differs from the shared snapshot");
  if (!readFileSync(join(archive, "dist/catalog.json")).equals(readFileSync(join(root, "src/generated/catalog.json")))) throw new Error("npm catalogue JSON differs from the shared snapshot");
  const skillFiles = readdirSync(join(root, "skills/shortcutkit"), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => join(entry.parentPath, entry.name).slice(join(root, "skills/shortcutkit").length + 1));
  const packagedSkillFiles = readdirSync(join(archive, "dist/skills/shortcutkit"), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => join(entry.parentPath, entry.name).slice(join(archive, "dist/skills/shortcutkit").length + 1));
  if (JSON.stringify(skillFiles.sort()) !== JSON.stringify(packagedSkillFiles.sort())) throw new Error("npm skill file list differs from source");
  for (const file of skillFiles) {
    if (!readFileSync(join(archive, "dist/skills/shortcutkit", file)).equals(readFileSync(join(root, "skills/shortcutkit", file)))) throw new Error(`npm skill differs from source: ${file}`);
  }
  execFileSync("node", ["--input-type=module", "-e", `
    import { Shortcut, actions, CATALOG, ACTIONS } from ${JSON.stringify(join(archive, "dist/index.js"))};
    if (CATALOG.schemaVersion !== 1 || Object.keys(CATALOG.actions).length !== Object.keys(ACTIONS).length) throw new Error("npm metadata mismatch");
    new Shortcut("Package").action(actions.showresult, { Text: "hello" });
  `], { cwd: work, stdio: "inherit" });
  const consumer = join(work, "consumer");
  mkdirSync(consumer);
  writeFileSync(join(consumer, "package.json"), '{"type":"module"}\n');
  writeFileSync(join(consumer, "check.ts"), `import { Shortcut, actions, CATALOG, type CatalogModel } from "../package/dist/index.js";
const catalog: CatalogModel = CATALOG;
new Shortcut(catalog.actions[actions.showresult]!.name).action(actions.showresult, { Text: "hello" });
// @ts-expect-error Unknown parameter keys must remain rejected in the distributed declarations.
new Shortcut("Invalid").action(actions.showresult, { UnknownParameter: true });
`);
  execFileSync("node", [join(root, "node_modules/typescript/bin/tsc"), "--noEmit", "--strict", "--skipLibCheck", "--module", "NodeNext", "--target", "ES2022", "check.ts"], { cwd: consumer, stdio: "inherit" });
  // Retain these exact bytes only after every archive check succeeds.
  if (process.argv.includes("--retain")) {
    const output = join(root, ".release-artifacts", "npm");
    mkdirSync(output, { recursive: true });
    copyFileSync(join(work, packages[0].filename), join(output, "shortcutkit.tgz"));
  }
  console.log("npm tarball: skill files, catalogue bytes, Node import, action construction and declarations verified.");
} finally {
  rmSync(work, { recursive: true, force: true });
}
