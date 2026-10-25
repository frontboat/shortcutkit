// bun tools/linkd/build-loader.ts [outdir]: writes and signs the loader shortcut, "SK <hash>", whose
// one action runs tools/linkd/loader.js as JavaScript for Mac Automation. Import the file into
// Shortcuts and run it once from the app (that run asks for the JavaScript permission); after that
// run-payload.sh runs it from the terminal.
//
// The name is the first 7 hex digits of the script's SHA-256, so a changed loader gets a new name:
// re-importing a shortcut under an existing name confuses the app's run queue.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Shortcut, actions, ref } from "../../src/index.js";

const here = dirname(fileURLToPath(import.meta.url));
const script = readFileSync(join(here, "loader.js"), "utf8");
const name = "SK " + createHash("sha256").update(script).digest("hex").slice(0, 7);
const outdir = process.argv[2] ?? ".";
const s = new Shortcut(name, { color: "Gray" });
const r = s.action(actions.runjavascriptforautomation, { Script: script });
s.action(actions.output, { WFOutput: ref(r) } as never);
const unsigned = await s.write(join(outdir, `${name}.unsigned.shortcut`));
const signed = join(outdir, `${name}.shortcut`);
const sign = spawnSync("shortcuts", ["sign", "--mode", "anyone", "--input", unsigned, "--output", signed], { encoding: "utf8" });
if (sign.status !== 0) throw new Error(sign.stderr);
console.log(`${signed}\nimport it into Shortcuts and run "${name}" once from the app`);
