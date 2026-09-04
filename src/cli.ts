import { Shortcut, actions, ref, text } from "./index.js";

export async function demo(out: string): Promise<void> {
  const name = out.replace(/^.*\//, "").replace(/\.shortcut$/, "");
  const s = new Shortcut(name, { color: "Teal" });
  s.action(actions.setstoredcontent, { WFInput: "hello from typescript", WFStoredContentKey: "demo-greeting", WFStoredContentGlobalValue: false });
  const got = s.action(actions.getstoredcontent, { WFStoredContentKey: "demo-greeting" });
  const gid = s.if(ref(got), "has_any_value");
  s.action(actions.showresult, { Text: text("Stored value: ", ref(got)) });
  s.otherwise(gid);
  s.action(actions.showresult, { Text: text("Nothing stored") });
  s.endIf(gid);
  const unsigned = out.replace(/\.shortcut$/, ".unsigned.shortcut");
  await s.write(unsigned);
  Shortcut.sign(unsigned, out);
  console.log(`wrote ${out} (${s.actions.length} actions)`);
}

if (import.meta.main) {
  const [cmd, out] = process.argv.slice(2);
  if (cmd === "demo" && out) await demo(out);
  else console.error("usage: bun run src/cli.ts demo OUT.shortcut");
}
