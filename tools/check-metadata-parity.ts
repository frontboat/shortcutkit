// Portable parity of public metadata and action records; no installed Apple frameworks needed.
import { spawnSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import { join } from "node:path";
import * as ts from "../src/index";

const tables = ["ACTIONS", "PARAM_KINDS", "PARAM_CHOICES", "PARAM_CHOICE_TITLES", "PARAM_LABELS", "PARAM_DESCRIPTIONS", "PARAM_VARIABLE_TYPES", "PARAM_ENTITY_TYPES", "OUTPUT_CLASSES_BY", "FILTERS", "FILTER_OPERATORS", "CALENDAR_UNITS", "BYTE_COUNT_UNITS", "BOUNDED_FILTERS", "ENTITIES", "ENTITY_PROPERTIES", "CONTENT_ITEM_CLASSES", "CONTENT_ITEM_PROPERTIES", "CONTENT_ITEM_TYPES", "CATALOG"] as const;
const root = join(import.meta.dir, "..");
const python = spawnSync(process.env.PYTHON ?? "python3", ["-c", `
import json, sys
sys.path.insert(0, sys.argv[1])
import shortcutkit as s
tables = json.loads(sys.argv[2])
out = {name: getattr(s, name) for name in tables}
out["provenance"] = s.PROVENANCE
out["records"] = {identifier: s.get_action(identifier) for identifier in s.ACTIONS}
types = sorted(set(t for e in s.ACTIONS.values() for t in e.get("inputTypes", []) + e.get("outputTypes", []) + e.get("outputClasses", [])) | set(s.ENTITIES))
out["accepted"] = {t: [{"identifier": i, "key": k} for i, k in s.accepted_by(t)] for t in types}
out["produced"] = {t: s.produced_by(t) for t in types}
print(json.dumps(out))
`, join(root, "python/src"), JSON.stringify(tables)], { encoding: "utf8", maxBuffer: 100 * 1024 * 1024 });
if (python.status !== 0) throw python.error ?? new Error(python.stderr);
const py = JSON.parse(python.stdout);
const problems: string[] = [];
for (const name of tables) if (!isDeepStrictEqual(ts[name], py[name])) problems.push(name);
if (!isDeepStrictEqual(ts.provenance, py.provenance)) problems.push("provenance");
for (const id of Object.keys(ts.ACTIONS)) {
  // JSON serialization drops absent JS optional fields, as Python does.
  const record = JSON.parse(JSON.stringify(ts.getAction(id)));
  if (!isDeepStrictEqual(record, py.records[id])) problems.push(`getAction: ${id}`);
}
for (const type of Object.keys(py.accepted)) {
  if (!isDeepStrictEqual(ts.acceptedBy(type), py.accepted[type])) problems.push(`acceptedBy: ${type}`);
  if (!isDeepStrictEqual(ts.producedBy(type), py.produced[type])) problems.push(`producedBy: ${type}`);
}
if (problems.length) throw new Error(`Metadata parity failed:\n${problems.join("\n")}`);
console.log(`${tables.length} metadata tables, provenance, ${Object.keys(ts.ACTIONS).length} action records and ${Object.keys(py.accepted).length} relationship types match.`);
