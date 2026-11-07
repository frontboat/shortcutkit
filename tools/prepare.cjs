// npm 10 can run prepare during pack despite --ignore-scripts. CI and release
// packaging already built and checked dist/, so they explicitly skip this hook.
if (process.env.SHORTCUTKIT_SKIP_PREPARE !== "1") {
  require("node:child_process").execFileSync("bun", ["run", "build"], { stdio: "inherit" });
}
