# lldb script for run.sh: while skhost is stopped in sk_addresses_ready(), find WorkflowKit's private
# Swift symbols in the loaded shared cache and hand their addresses to the process.
import lldb, re, struct

# In the order of sk_addresses[] in skhost.m.
WANT = {
    "filterableProperties": r"^static WorkflowKit\.RowTemplateFindFilterParameterState\.filterableProperties\(for:",
    "possibleOperators": r"^static WorkflowKit\.RowTemplateFindFilterParameterState\.possibleOperators\(contentItemClass:",
    "subjectType": r"^static WorkflowKit\.RowTemplateFindFilterParameterState\.subjectType\(contentProperty:",
    "comparisonContentOperator": r"^dispatch thunk of WorkflowKit\.RowTemplateComparisonOperator\.contentOperator\.getter",
    "comparisonOperatorProtocol": r"^protocol descriptor for WorkflowKit\.RowTemplateComparisonOperator$",
    "operatorContentOperator": r"^dispatch thunk of WorkflowKit\.RowTemplateOperator\.contentOperator\.getter",
    "operatorProtocol": r"^protocol descriptor for WorkflowKit\.RowTemplateOperator$",
    "predicateForRow": r"^_?WFContentPredicateForRowTemplateValue$",
}


def set_addresses(frame, bp_loc, internal_dict):
    target = frame.GetThread().GetProcess().GetTarget()
    found = {}
    for m in target.module_iter():
        if m.GetFileSpec().GetFilename() != "WorkflowKit":
            continue
        for s in m:
            n = s.GetName() or ""
            for k, rx in WANT.items():
                if k not in found and re.search(rx, n):
                    found[k] = s.GetStartAddress().GetLoadAddress(target)
    missing = [k for k in WANT if k not in found]
    if missing:
        print("addresses.py: WorkflowKit no longer has " + ", ".join(missing) + "; see docs/extraction.md")
        frame.GetThread().GetProcess().Kill()
        return False
    process = frame.GetThread().GetProcess()
    slot = target.FindSymbols("sk_addresses")[0].GetSymbol().GetStartAddress().GetLoadAddress(target)
    err = lldb.SBError()
    process.WriteMemory(slot, struct.pack("<" + "Q" * len(WANT), *(found[k] for k in WANT)), err)
    if err.Fail():
        print("addresses.py: " + str(err))
        process.Kill()
    return False  # keep going


def __lldb_init_module(debugger, internal_dict):
    pass
