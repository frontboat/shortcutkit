import lldb, re
def strs(debugger, command, result, d):
    t = debugger.GetSelectedTarget(); p = t.GetProcess()
    mod = [m for m in t.module_iter() if m.GetFileSpec().GetFilename() == "WorkflowKit"][0]
    pat = re.compile(command.strip())
    out = []
    for sec in mod.section_iter():
        for sub in sec:
            if sub.GetName() not in ("__cstring", "__oslogstring"): continue
            a = sub.GetLoadAddress(t); n = sub.GetByteSize()
            err = lldb.SBError(); data = p.ReadMemory(a, n, err)
            if not err.Success(): out.append("read failed " + sub.GetName()); continue
            for s in data.split(b"\0"):
                try: s = s.decode()
                except Exception: continue
                if pat.search(s): out.append(s)
    result.AppendMessage("\n".join(sorted(set(out))))
def __lldb_init_module(debugger, d):
    debugger.HandleCommand("command script add -f strs.strs strs")
