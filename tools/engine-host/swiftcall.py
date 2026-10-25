# swiftstr <regex>: call every static String getter matching regex (no arguments) and print the result
import lldb, re, struct

def decode_swift_string(proc, a, b):
    # Swift String on arm64: (countAndFlags, object). Small string: bit 61 of b set (discriminator 0xE / 0xA)
    disc = b >> 56
    if disc & 0x20:  # small
        raw = struct.pack("<QQ", a, b & 0x00ffffffffffffff)
        n = disc & 0x0f
        return raw[:n].decode("utf-8", "replace")
    count = a & 0x0000ffffffffffff
    obj = b & 0x0fffffffffffffff
    err = lldb.SBError()
    data = proc.ReadMemory(obj + 32, count, err)  # native large string: chars at object + 32
    return data.decode("utf-8", "replace") if err.Success() else f"<large {hex(a)} {hex(b)}>"

def swiftstr(debugger, command, result, d):
    t = debugger.GetSelectedTarget(); p = t.GetProcess(); fr = p.GetSelectedThread().GetSelectedFrame()
    pat = re.compile(command.strip())
    seen = set(); out = []
    mod = [m for m in t.module_iter() if m.GetFileSpec().GetFilename() == "WorkflowKit"][0]
    for s in mod:
        name = s.GetName() or ""
        if not pat.search(name) or name in seen: continue
        seen.add(name)
        addr = s.GetStartAddress().GetLoadAddress(t)
        opts = lldb.SBExpressionOptions(); opts.SetLanguage(lldb.eLanguageTypeC); opts.SetTimeoutInMicroSeconds(5_000_000)
        v = fr.EvaluateExpression(f"struct R {{ unsigned long a; unsigned long b; }}; ((struct R (*)(void)){addr:#x})()", opts)
        if v.GetError().Fail(): out.append(f"{name}: ERROR {v.GetError()}"); continue
        a = v.GetChildMemberWithName("a").GetValueAsUnsigned(); b = v.GetChildMemberWithName("b").GetValueAsUnsigned()
        out.append(f"{name.split('.')[-2] if '.rawValue' in name else name}: {decode_swift_string(p, a, b)!r}")
    result.AppendMessage("\n".join(out))

def __lldb_init_module(debugger, d):
    debugger.HandleCommand("command script add -f swiftcall.swiftstr swiftstr")
