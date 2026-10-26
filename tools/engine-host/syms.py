# lldb command: syms <regex>  -> WorkflowKit's symbol names matching the regex (demangled when lldb can)
import re
import lldb


def syms(debugger, command, result, internal_dict):
    t = debugger.GetSelectedTarget()
    mod = [m for m in t.module_iter() if m.GetFileSpec().GetFilename() == "WorkflowKit"][0]
    pat = re.compile(command.strip())
    seen = set()
    for i in range(mod.GetNumSymbols()):
        s = mod.GetSymbolAtIndex(i)
        name = s.GetDisplayName() or s.GetName() or ""
        if pat.search(name) and name not in seen:
            seen.add(name)
            print(name, file=result)
    print(f"{len(seen)} symbols", file=result)


def __lldb_init_module(debugger, internal_dict):
    debugger.HandleCommand("command script add -f syms.syms syms")
