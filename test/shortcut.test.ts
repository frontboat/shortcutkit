import { describe, expect, test } from "bun:test";
import { Shortcut, actions, ACTIONS, getDefinition, allDefinitions, ref, text, variable, shortcutInput, CONDITION } from "../src/index";

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
    expect(Object.keys(ACTIONS).length).toBe(2015);
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
    expect(withDescriptor).toBe(1581);
    expect(new Set(Object.keys(actions)).size).toBe(Object.keys(ACTIONS).length);
  });
});
