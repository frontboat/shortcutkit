# lldb command: calls <symbol>  -> the selectors, functions and strings a function uses, in order
import lldb, re

def page_ref(target, insts, idx):
    """adrp xN, P / (ldr|add) xM, [xN, #off] at idx -> (address, is_load)"""
    return None

def read_ptr(proc, addr):
    err = lldb.SBError(); p = proc.ReadPointerFromMemory(addr, err)
    return (p & 0x0000ffffffffffff) if err.Success() else None

def read_str(proc, addr):
    err = lldb.SBError(); s = proc.ReadCStringFromMemory(addr, 300, err)
    return s if err.Success() and s and re.match(r"^[ -~]+$", s) else None

def sym_at(target, addr):
    a = target.ResolveLoadAddress(addr); s = a.GetSymbol()
    return s.GetName() if s and s.IsValid() else None

def walk(target, insts):
    """yield ('adrp-load'|'adrp-add', reg, address) and ('bl', target)"""
    proc, pages = target.GetProcess(), {}
    for i in insts:
        mn, ops = i.GetMnemonic(target), i.GetOperands(target)
        pc = i.GetAddress().GetLoadAddress(target)
        if mn == "adrp":
            m = re.match(r"(x\d+), (-?\d+)", ops)
            if m: pages[m.group(1)] = (pc & ~0xfff) + int(m.group(2)) * 0x1000
            continue
        m = re.match(r"([xwd]\d+), \[(x\d+), #(0x[0-9a-f]+)\]", ops) if mn == "ldr" else re.match(r"(x\d+), (x\d+), #(0x[0-9a-f]+)", ops) if mn == "add" else None
        if m and m.group(2) in pages:
            yield (mn, m.group(1), pages.pop(m.group(2)) + int(m.group(3), 16), pc)
            continue
        if mn in ("bl", "b", "br", "braa", "blraa") and ops.startswith("0x"):
            yield ("call", None, int(ops.split()[0], 16), pc)

def stub_name(target, addr):
    s = sym_at(target, addr)
    if s and not s.startswith("___lldb_unnamed"): return s
    insts = target.ReadInstructions(target.ResolveLoadAddress(addr), 6)
    sel = got = None
    for kind, reg, a, pc in walk(target, insts):
        if kind == "add" and reg == "x1": sel = read_str(target.GetProcess(), a)
        if kind == "ldr" and reg == "x1": sel = read_str(target.GetProcess(), read_ptr(target.GetProcess(), a) or 0)
        if kind == "ldr" and reg == "x16": got = sym_at(target, read_ptr(target.GetProcess(), a) or 0)
    if sel: return "-" + sel
    return got or hex(addr)

def describe(target, kind, a):
    proc = target.GetProcess()
    if kind == "call": return "call " + stub_name(target, a)
    if kind == "ldr":
        p = read_ptr(proc, a)
        if p is None: return None
        s = read_str(proc, p)
        if s: return "sel  " + s
        n = sym_at(target, p) or sym_at(target, a)
        return ("ref  " + n) if n else None
    # add: a literal address; CFString is {isa, flags, cstr, len}
    n = sym_at(target, a)
    cstr = read_ptr(proc, a + 16)
    s = read_str(proc, cstr) if cstr else None
    if s and len(s) > 1: return "cfstr " + repr(s)
    s = read_str(proc, a)
    if s and len(s) > 2: return "cstr " + repr(s)
    return ("addr " + n) if n else None

def calls(debugger, command, result, internal_dict):
    target = debugger.GetSelectedTarget()
    syms = [c.GetSymbol() for c in target.FindSymbols(command.strip()) if c.GetSymbol().IsValid()]
    if not syms:
        syms = [c.GetSymbol() for c in target.FindFunctions(command.strip()) if c.GetSymbol().IsValid()]
    if not syms:
        want = command.strip()
        for m in target.module_iter():
            for sy in m:
                if (sy.GetName() or "").startswith(want): syms.append(sy); break
            if syms: break
    if not syms: result.AppendMessage("== not found: " + command); return
    for sym in syms[:1]:
        out = ["== " + sym.GetName()]
        for kind, reg, a, pc in walk(target, sym.GetInstructions(target)):
            d = describe(target, kind, a)
            if d and not d.startswith("call 0x"): out.append("  " + d)
        result.AppendMessage("\n".join(out))

def __lldb_init_module(debugger, d):
    debugger.HandleCommand("command script add -f calls.calls calls")
