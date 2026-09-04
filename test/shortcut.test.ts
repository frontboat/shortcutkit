import { describe, expect, test } from "bun:test";
import { Shortcut, actions, ACTIONS, PARAM_KINDS, getDefinition, getAction, allDefinitions, ref, text, variable, shortcutInput, CONDITION, type ShowresultParams, type RemindersCreateReminderParams, type OutputTypes } from "../src/index";

describe("shortcutkit", () => {
  test("validates identifiers and parameter keys against the definitions", () => {
    const s = new Shortcut("T");
    expect(() => s.action("is.workflow.actions.nope")).toThrow("unknown built-in action");
    // @ts-expect-error Nope is not a parameter of Show Result; the runtime check catches it too
    expect(() => s.action("is.workflow.actions.showresult", { Nope: 1 })).toThrow("unknown parameter");
    expect(() => s.action("is.workflow.actions.showresult", { Text: "ok" })).not.toThrow();
  });

  test("encodes references and token strings exactly as WorkflowKit does", () => {
    const s = new Shortcut("T");
    const got = s.action("is.workflow.actions.getstoredcontent", { WFStoredContentKey: "k" });
    const r = ref(got);
    expect(r.Value).toEqual({ Type: "ActionOutput", OutputUUID: got.WFWorkflowActionParameters.UUID as string, OutputName: "Stored Content" });
    const t = text("Hello ", variable("MyVar"), "!");
    expect(t.Value.string).toBe("Hello ￼!");
    expect(t.Value.attachmentsByRange).toEqual({ "{6, 1}": { Type: "Variable", VariableName: "MyVar" } });
    // Offsets are NSRange values, i.e. UTF-16 code units: WorkflowKit serializes "😀 " + variable as {3, 1}.
    expect(Object.keys(text("😀 ", variable("V")).Value.attachmentsByRange)).toEqual(["{3, 1}"]);
    expect(Object.keys(text("👨‍👩‍👧 ", variable("V")).Value.attachmentsByRange)).toEqual(["{9, 1}"]);
  });

  test("control flow shares a grouping identifier with modes 0, 1, 2", () => {
    const s = new Shortcut("T");
    const gid = s.if(shortcutInput(), "has_any_value");
    s.otherwise(gid);
    s.endIf(gid);
    const modes = s.actions.map((a) => [a.WFWorkflowActionParameters.GroupingIdentifier, a.WFWorkflowActionParameters.WFControlFlowMode]);
    expect(modes).toEqual([[gid, 0], [gid, 1], [gid, 2]]);
    expect(s.actions[0]!.WFWorkflowActionParameters.WFCondition).toBe(CONDITION.has_any_value);
  });

  test("envelope carries every key Apple's gallery files carry", () => {
    const p = new Shortcut("T", { color: "Red", inputClasses: ["WFURLContentItem"] }).toPlist();
    for (const k of ["WFWorkflowClientVersion", "WFWorkflowMinimumClientVersion", "WFWorkflowMinimumClientVersionString", "WFWorkflowIcon", "WFWorkflowTypes", "WFQuickActionSurfaces", "WFWorkflowInputContentItemClasses", "WFWorkflowOutputContentItemClasses", "WFWorkflowImportQuestions", "WFWorkflowHasShortcutInputVariables", "WFWorkflowHasOutputFallback", "WFWorkflowActions"]) {
      expect(p).toHaveProperty(k);
    }
    expect((p.WFWorkflowIcon as Record<string, number>).WFWorkflowIconStartColor).toBe(4282601983);
  });

  test("xml plist round-trips through plutil", async () => {
    const s = new Shortcut("Round Trip");
    s.action("is.workflow.actions.showresult", { Text: text("a & b <c>") });
    const path = `/tmp/shortcutkit-test-${Date.now()}.shortcut`;
    await s.write(path);
    const lint = Bun.spawnSync(["plutil", "-lint", path]);
    expect(lint.exitCode).toBe(0);
    const json = Bun.spawnSync(["plutil", "-convert", "json", "-o", "-", path]).stdout.toString();
    expect(JSON.parse(json).WFWorkflowActions[0].WFWorkflowActionParameters.Text.Value.string).toBe("a & b <c>");
  });
});

describe("typed catalogue", () => {
  test("every built-in action has a key and parameter keys are typed", () => {
    expect(Object.keys(ACTIONS).length).toBe(1875);
    expect(actions.setstoredcontent).toBe("is.workflow.actions.setstoredcontent");
    const s = new Shortcut("T");
    s.action(actions.setstoredcontent, { WFInput: "x", WFStoredContentKey: "k", WFStoredContentGlobalValue: true });
    // @ts-expect-error WFNope is not a parameter of Store Content
    expect(() => s.action(actions.setstoredcontent, { WFNope: 1 })).toThrow("unknown parameter");
    // untyped identifiers (app intents) still accept any keys
    s.action("com.example.app.SomeIntent", { anything: "goes", AppIntentDescriptor: { BundleIdentifier: "com.example.app" } });
  });
});

describe("typed parameter values", () => {
  test("value shapes are checked per key", () => {
    const s = new Shortcut("T");
    s.action(actions.setstoredcontent, { WFInput: text("x"), WFStoredContentKey: "k", WFStoredContentGlobalValue: true });
    s.action(actions.setstoredcontent, { WFStoredContentGlobalValue: variable("Flag") }); // attachments are always allowed
    // @ts-expect-error a switch takes a boolean or an attachment, not a string
    s.action(actions.setstoredcontent, { WFStoredContentGlobalValue: "yes" });
    s.action(actions.additemtolist, { WFInsertPosition: "End" });                 // literal choice
    s.action(actions.additemtolist, { WFInsertPosition: "SomethingNew" });        // still a string: choice lists are not proven exhaustive
    // @ts-expect-error a stepper takes a number or an attachment
    s.action(actions.repeat_count, { WFRepeatCount: "3" });
    s.action(actions.repeat_each, { WFInput: { Type: "Variable", Variable: shortcutInput() } });
    expect(s.actions.length).toBe(7);
  });
});

describe("definitions", () => {
  test("typed access to the full definition record", () => {
    const d = getDefinition(actions.setstoredcontent);
    expect(d.Name).toBe("Store Content");
    expect(d.Description?.DescriptionSummary).toContain("persisted between shortcut runs");
    expect(d.Parameters?.map((p) => p.Class)).toEqual(["WFTextInputParameter", "WFStoredValueVariableFieldParameter", "WFSwitchParameter"]);
    expect(d.IconSymbol).toBe("cylinder.split.1x2.fill");
    expect(getDefinition("com.example.Nope")).toBeUndefined();
    expect(Object.keys(allDefinitions()).length).toBe(434);
  });
});

describe("share sheet shortcuts", () => {
  test("carry their surfaces and input classes in the envelope", () => {
    const s = new Shortcut("Page Links", { types: ["ActionExtension"], inputClasses: ["WFSafariWebPageContentItem"] });
    s.action(actions.runjavascriptonwebpage, { WFInput: shortcutInput(), WFJavaScript: "completion(document.links.length)" });
    const p = s.toPlist();
    expect(p.WFWorkflowTypes).toEqual(["ActionExtension"]);
    expect(p.WFWorkflowInputContentItemClasses).toEqual(["WFSafariWebPageContentItem"]);
    expect(p.WFWorkflowHasShortcutInputVariables).toBe(true);
    expect(new Shortcut("Plain").toPlist().WFWorkflowTypes).toEqual([]);
  });
});

describe("named parameter types and output types", () => {
  test("every action has a Params alias and output content types", () => {
    const p: ShowresultParams = { Text: text("hi") };
    const r: RemindersCreateReminderParams = { title: "x", priorityLevel: "high" };
    // @ts-expect-error not a key of Show Result
    const bad: ShowresultParams = { Nope: 1 };
    void p; void r; void bad;
    const s = new Shortcut("Out");
    const js = s.action(actions.runjavascriptonwebpage, { WFJavaScript: "completion(1)" });
    expect(js.outputTypes).toEqual(["WFDictionaryContentItem", "WFStringContentItem", "WFBooleanContentItem", "WFNumberContentItem"]);
    expect(ACTIONS[actions.safari_create_new_tab].outputTypes).toEqual(["com.apple.Safari.TabEntity"]);
    const o: OutputTypes<"is.workflow.actions.safari.geturl"> = ["WFSafariWebPage"];
    void o;
    expect(getAction(actions.showresult)!.outputTypes).toEqual([]);
    const written = (s.toPlist().WFWorkflowActions as unknown as Record<string, unknown>[])[0]!;
    expect(Object.keys(written)).not.toContain("outputTypes");
  });
});

describe("getAction", () => {
  test("covers built-ins and App Intents with one shape", () => {
    const b = getAction(actions.runjavascriptonwebpage)!;
    expect(b.name).toBe("Run JavaScript on Active Safari Tab");
    expect(b.kinds.WFJavaScript).toBe("text");
    expect(b.definition?.Input?.ParameterKey).toBe("WFInput");
    expect(b.descriptor).toBeUndefined();
    const a = getAction(actions.safari_create_new_tab)!;
    expect(a.name).toBe("Create New Tab");
    expect(a.descriptor?.BundleIdentifier).toBe("com.apple.Safari");
    expect(a.definition).toBeUndefined();
    expect(getAction("nope")).toBeUndefined();
  });
});

describe("text parameters", () => {
  test("wrap a bare attachment into a token string, as the engine does", () => {
    const s = new Shortcut("Wrap");
    const got = s.action(actions.getstoredcontent, { WFStoredContentKey: "k" });
    const shown = s.action(actions.showresult, { Text: ref(got) });
    const v = shown.WFWorkflowActionParameters.Text as { WFSerializationType: string; Value: { string: string; attachmentsByRange: Record<string, unknown> } };
    expect(v.WFSerializationType).toBe("WFTextTokenString");
    expect(v.Value.string).toBe("\ufffc");
    expect(Object.keys(v.Value.attachmentsByRange)).toEqual(["{0, 1}"]);
    // a string-kind parameter (enumeration) keeps the bare attachment, which is its encoding
    const enumd = s.action(actions.ask, { WFInputType: ref(got) as never });
    expect((enumd.WFWorkflowActionParameters.WFInputType as { WFSerializationType: string }).WFSerializationType).toBe("WFTextTokenAttachment");
    expect(PARAM_KINDS["is.workflow.actions.showresult"].Text).toBe("text");
  });
});

describe("repeat count and menu blocks", () => {
  test("share a grouping identifier with modes 0/1/2", () => {
    const s = new Shortcut("Blocks");
    const r = s.repeatCount(3);
    s.action(actions.showresult, { Text: text("tick") });
    s.endRepeatCount(r);
    const m = s.chooseFromMenu("Pick one", ["A", "B"]);
    s.menuItem(m, "A"); s.action(actions.showresult, { Text: text("a") });
    s.menuItem(m, "B"); s.action(actions.showresult, { Text: text("b") });
    s.endMenu(m);
    const p = s.actions.map((a) => a.WFWorkflowActionParameters);
    expect(p[0]).toMatchObject({ GroupingIdentifier: r, WFControlFlowMode: 0, WFRepeatCount: 3 });
    expect(p[2]).toMatchObject({ GroupingIdentifier: r, WFControlFlowMode: 2 });
    expect(p[3]).toMatchObject({ GroupingIdentifier: m, WFControlFlowMode: 0, WFMenuPrompt: "Pick one", WFMenuItems: ["A", "B"] });
    expect(p[4]).toMatchObject({ GroupingIdentifier: m, WFControlFlowMode: 1, WFMenuItemTitle: "A" });
    expect(p[6]).toMatchObject({ GroupingIdentifier: m, WFControlFlowMode: 1, WFMenuItemTitle: "B" });
    expect(p[8]).toMatchObject({ GroupingIdentifier: m, WFControlFlowMode: 2 });
    expect(s.actions.filter((a) => a.WFWorkflowActionIdentifier === "is.workflow.actions.choosefrommenu").length).toBe(4);
  });
});

describe("App Intents actions", () => {
  test("carry the app descriptor and typed parameters", () => {
    const s = new Shortcut("Reminders");
    const r = s.action(actions.reminders_create_reminder, { title: text("Buy milk"), isFlagged: true, priorityLevel: "high" });
    const p = r.WFWorkflowActionParameters as Record<string, unknown>;
    expect(p.AppIntentDescriptor).toEqual({ BundleIdentifier: "com.apple.reminders", Name: "Reminders", TeamIdentifier: "0000000000", AppIntentIdentifier: "TTRCreateReminderAppIntent", ActionRequiresAppInstallation: true });
    expect(ACTIONS[actions.reminders_create_reminder].descriptor.BundleIdentifier).toBe("com.apple.reminders");
    expect(ref(r).Value).toMatchObject({ Type: "ActionOutput", OutputName: "Reminder" });
    // @ts-expect-error a bool parameter does not take a string
    s.action(actions.reminders_create_reminder, { isFlagged: "yes" });
    expect(() => s.action(actions.reminders_create_reminder, { nope: 1 } as never)).toThrow(/unknown parameter/);
  });
  test("every App Intent has a descriptor and a unique key", () => {
    const withDescriptor = Object.values(ACTIONS).filter((a) => "descriptor" in a).length;
    expect(withDescriptor).toBe(1441);
    expect(new Set(Object.keys(actions)).size).toBe(Object.keys(ACTIONS).length);
  });
});
