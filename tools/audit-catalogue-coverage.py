"""Every action the Shortcuts editor offers on this Mac, against the catalogue.

    python3 tools/audit-catalogue-coverage.py [data dir]

The editor's action list is the app's ToolKit index (`data/toolkit-registry.json`, a local-only
dump written by `bun run extract`), so this needs no scrolling through the app: every indexed
tool the editor shows (`visibilityFlags` other than 0) that the generated catalogue lacks is
listed with the rule that left it out. A visible tool no rule explains fails the audit.

The rules, as of macOS 27 (see docs/extraction.md, "What the editor shows that the catalogue
does not"):
  third-party     the catalogue covers Apple's apps; `action()` takes these untyped
  siri-only       intents linkd marks not discoverable (`data/linkd-actions.json`); the index
                  shows them but the app's import sheet refuses any file that uses one
  interchange     legacy actions of third-party apps served by WFInterchangeActionProvider,
                  which no probe enumerates; shown only when the app is installed (Add PDF to
                  Books names the iOS bundle id, so never on a Mac)
  sirikit         SiriKit intents of Apple apps the definition probe did not serve; empty since
                  the probe accepts Apple bundle identifiers (Keynote, Numbers and Pages come
                  preinstalled but live outside /System), so a hit here means the probe ran on a
                  Mac without the app or the rule regressed
"""
import collections
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
data = Path(sys.argv[1]) if len(sys.argv) > 1 else root / "data"
sys.path.insert(0, str(root / "python" / "src"))
from shortcutkit.actions import ACTIONS  # noqa: E402

registry = json.load(open(data / "toolkit-registry.json"))
tools = registry["tools"]
catalogue = set(ACTIONS)
# linkd's per-action visibility (tools/linkd/action-metadata.js): the intents it marks not
# discoverable (assistant-only) are refused by the app's import sheet. Among the tools that have
# action metadata this is exactly visibilityFlags 2, but synthesized entity tools and flow tools
# share that value and do import, so the index alone cannot name them.
linkd = {f"{b}.{a}": m for b, acts in json.load(open(data / "linkd-actions.json")).items() for a, m in (acts or {}).items()}
siri_only = {i for i, m in linkd.items() if not m["discoverable"]}


def rule(t):
    app = (t.get("app") or {}).get("bundleIdentifier") or ""
    if not app.startswith("com.apple."):
        return "third-party"
    if t["identifier"] in siri_only:
        return "siri-only"
    if t["provider"] == "WFInterchangeActionProvider":
        return "interchange"
    if t["provider"] == "WFIntentActionProvider":
        return "sirikit"
    return "unexplained"


shown = [t for t in tools if not t["hidden"]]
missing = [t for t in shown if t["identifier"] not in catalogue]
by_rule = collections.defaultdict(list)
for t in missing:
    by_rule[rule(t)].append(t)
hidden_in = sum(1 for t in tools if t["hidden"] and t["identifier"] in catalogue)
hidden_out = collections.Counter(t["provider"] for t in tools if t["hidden"] and t["identifier"] not in catalogue)

print(f"index {registry['provenance']['osVersion']}: {len(tools)} tools, {len(shown)} shown in the editor; catalogue {len(catalogue)} entries")
print(f"shown and not in the catalogue: {len(missing)}")
for name in ("third-party", "siri-only", "interchange", "sirikit", "unexplained"):
    group = by_rule.get(name, [])
    if not group:
        continue
    apps = collections.Counter((t.get("app") or {}).get("name") or (t.get("app") or {}).get("bundleIdentifier") for t in group)
    print(f"  {len(group):4} {name:14} " + ", ".join(f"{a} ({n})" for a, n in apps.most_common()))
    if name in ("sirikit", "unexplained"):
        for t in group:
            print(f"       {t['identifier']}  {t['name']}")
print(f"hidden from the editor: {hidden_in} in the catalogue (every hidden built-in), "
      + ", ".join(f"{n} {p}" for p, n in hidden_out.most_common()) + " left out")

refused = sorted(i for i in catalogue if i in siri_only)
print(f"linkd action metadata: {sum(1 for i in catalogue if i in linkd)} catalogue entries have it, "
      f"{len(refused)} are not discoverable and will not import" + (": " + ", ".join(refused) if refused else ""))
if by_rule.get("unexplained"):
    sys.exit("visible tools no rule explains")
