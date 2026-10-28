import { describe, expect, spyOn, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Shortcut, actions, ACTIONS, PARAM_KINDS, FILTERS, ENTITY_PROPERTIES, CONTENT_ITEM_CLASSES, getDefinition, getAction, allDefinitions, ref, text, variable, shortcutInput, ask, repeatItem, property, where, whereAny, coerce, dictionary, appIntent, CONDITION, type ShowresultParams, type RemindersCreateReminderParams, type OutputTypes } from "../src/index";
import * as readmeExamples from "./readme-examples";

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

  // plutil is macOS only; the release workflow runs this suite on Ubuntu, where write() keeps the XML form.
  test.skipIf(Bun.which("plutil") === null)("xml plist round-trips through plutil", async () => {
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
    expect(Object.keys(ACTIONS).length).toBe(1714);
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
    s.action(actions.repeat_each, { WFInput: shortcutInput() });                 // a picker takes the bare reference
    // The same rule at run time, from PARAM_VARIABLE_TYPES: what the engine reads for the key.
    // @ts-expect-error the engine reads no Ask reference for a variable picker
    expect(() => s.action(actions.repeat_each, { WFInput: ask() })).toThrow("does not read a Ask reference");
    // @ts-expect-error Filter's sort key reads no reference at all
    expect(() => s.action(actions.filter_images, { WFContentItemSortProperty: shortcutInput() })).toThrow("only a plain value");
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
    expect(Object.keys(allDefinitions()).length).toBe(449);
  });
});

describe("variable pickers and the If subject", () => {
  test("pickers take the bare reference; only the If subject is wrapped", () => {
    const s = new Shortcut("Pick");
    const list = s.action(actions.getstoredcontent, { WFStoredContentKey: "k" });
    const gid = s.repeatEach(ref(list));
    expect(s.actions[1]!.WFWorkflowActionParameters.WFInput).toEqual(ref(list));
    s.endRepeatEach(gid);
    const look = s.action(actions.previewdocument, { WFInput: ref(list) });
    expect((look.WFWorkflowActionParameters.WFInput as { WFSerializationType: string }).WFSerializationType).toBe("WFTextTokenAttachment");
    const cond = s.if(ref(list), "has_any_value");
    const opened = s.actions.find((a) => a.WFWorkflowActionParameters.GroupingIdentifier === cond)!;
    expect(opened.WFWorkflowActionParameters.WFInput).toEqual({ Type: "Variable", Variable: ref(list) });
    // a bare reference given directly to the If subject key is wrapped, like text keys
    const raw = s.action("is.workflow.actions.conditional", { WFInput: ref(list), WFCondition: 100, GroupingIdentifier: "X", WFControlFlowMode: 0 });
    expect(raw.WFWorkflowActionParameters.WFInput).toEqual({ Type: "Variable", Variable: ref(list) });
    expect(PARAM_KINDS["is.workflow.actions.repeat.each"].WFInput).toBe("picker");
    expect(PARAM_KINDS["is.workflow.actions.conditional"].WFInput).toBe("subject");
  });
});

describe("repeat results", () => {
  test("closing a block returns the action whose output is Repeat Results", () => {
    const s = new Shortcut("Loop");
    const list = s.action(actions.getstoredcontent, { WFStoredContentKey: "urls" });
    const gid = s.repeatEach(ref(list));
    s.action(actions.downloadurl, { WFURL: repeatItem() });
    const done = s.endRepeatEach(gid);
    const r = ref(done);
    expect(r.Value).toMatchObject({ Type: "ActionOutput", OutputName: "Repeat Results", OutputUUID: done.WFWorkflowActionParameters.UUID });
    const dl = s.actions[2]!.WFWorkflowActionParameters.WFURL as { WFSerializationType: string; Value: { attachmentsByRange: Record<string, { VariableName: string }> } };
    expect(dl.WFSerializationType).toBe("WFTextTokenString");
    expect(dl.Value.attachmentsByRange["{0, 1}"]!.VariableName).toBe("Repeat Item");
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
    expect(withDescriptor).toBe(1265);
    expect(new Set(Object.keys(actions)).size).toBe(Object.keys(ACTIONS).length);
  });
  test("the catalogue holds what the editor offers: no Siri-only intent, and the preinstalled apps' SiriKit intents", () => {
    // An intent linkd marks not discoverable is refused by the app's import sheet (docs/extraction.md,
    // "What the editor shows that the catalogue does not"); data/linkd-actions.json is linkd's word.
    const linkd = JSON.parse(readFileSync(join(import.meta.dir, "../data/linkd-actions.json"), "utf8")) as Record<string, Record<string, { discoverable: boolean; assistantOnly?: boolean }>>;
    const notDiscoverable = Object.entries(linkd).flatMap(([bundle, acts]) => Object.entries(acts).filter(([, a]) => !a.discoverable).map(([id]) => `${bundle}.${id}`));
    expect(notDiscoverable.length).toBe(265);
    expect(notDiscoverable.filter((id) => id in ACTIONS)).toEqual([]);
    expect(ACTIONS["com.apple.Photos.PhotosCropAssistantIntent" as keyof typeof ACTIONS]).toBeUndefined();
    expect(ACTIONS[actions.photos_crop].name).toBe("Crop");
    // Keynote, Numbers and Pages come preinstalled but update through the App Store; their SiriKit intents stay in.
    expect(getDefinition("com.apple.iWork.Keynote.TSADocumentOpenIntent")?.Name).toBe("Open Presentation");
    expect(getDefinition("com.apple.iWork.Numbers.TSADocumentCreateIntent")?.Name).toBe("Create Spreadsheet from Template");
  });
  test("Find filters encode each row under the key its value kind uses", () => {
    const s = new Shortcut("Messages");
    const who = s.action(actions.ask, { WFAskActionPrompt: "Who?" });
    const found = s.action(actions.messages_find_message, {
      WFContentItemFilter: where(["author", "is", ref(who)], ["author", "is_not", "+15555550100"], ["date", "is_in_the_last", 7, "days"], ["date", "is_between", new Date("2026-01-01T00:00:00Z"), ref(who)], ["date", "is_today"]),
    });
    const f = found.WFWorkflowActionParameters.WFContentItemFilter as { Value: { WFActionParameterFilterPrefix: number; WFActionParameterFilterTemplates: Array<{ Property: string; Operator: number; Values: Record<string, unknown> }> } };
    expect(f.Value.WFActionParameterFilterPrefix).toBe(1);
    const [author, plainAuthor, last7, between, today] = f.Value.WFActionParameterFilterTemplates;
    expect(author).toMatchObject({ Property: "author", Operator: 4, Values: { ContactHandle: { WFSerializationType: "WFTokenStringParameterState", Value: text(ref(who)) } } });
    expect(plainAuthor!.Values).toEqual({ ContactHandle: { WFSerializationType: "WFTokenStringParameterState", Value: "+15555550100" } });
    expect(last7).toMatchObject({ Operator: 1001, Values: { Number: 7, Unit: 16 } });
    expect(between!.Values).toEqual({ Date: new Date("2026-01-01T00:00:00Z"), AnotherDate: ref(who) });
    expect(today).toMatchObject({ Operator: 1002, Values: {} });
    expect(s.toXml()).toContain("<date>2026-01-01T00:00:00Z</date>");
    const convo = s.action(actions.messages_find_conversation, { WFContentItemFilter: whereAny(["displayName", "is", "Heather"], ["displayName", "contains", ref(who)]) });
    const c = convo.WFWorkflowActionParameters.WFContentItemFilter as typeof f;
    expect(c.Value.WFActionParameterFilterPrefix).toBe(0);
    expect(c.Value.WFActionParameterFilterTemplates.map((r) => r.Values)).toEqual([{ String: "Heather" }, { String: text(ref(who)) }]);
    // @ts-expect-error contains is not offered for the sender
    expect(() => s.action(actions.messages_find_message, { WFContentItemFilter: where(["author", "contains", "x"]) })).toThrow(/no operator contains; offered: is, is_not/);
    // @ts-expect-error not a calendar unit
    expect(() => s.action(actions.messages_find_message, { WFContentItemFilter: where(["date", "is_in_the_last", 7, "fortnights"]) })).toThrow(/one of years/);
    // @ts-expect-error not a filterable property
    expect(() => s.action(actions.messages_find_message, { WFContentItemFilter: where(["attachments", "contains", "x"]) })).toThrow(/no filterable property attachments/);
    // @ts-expect-error where() rows only go in a Find filter
    expect(() => s.action(actions.showresult, { Text: where(["a", "is", "b"]) })).toThrow(/only in a Find action/);
    expect(Object.keys(FILTERS).length).toBe(150);
  });
  test("built-in Find actions take rows typed from the engine's own rules", () => {
    const s = new Shortcut("Files");
    const rows = (a: ReturnType<Shortcut["action"]>) => (a.WFWorkflowActionParameters.WFContentItemFilter as { Value: { WFActionParameterFilterTemplates: Array<{ Property: string; Operator: number; Values: Record<string, unknown> }> } }).Value.WFActionParameterFilterTemplates;
    // File sizes: a number and a byte-count unit code; durations: a number and a calendar unit; Photos' Album is a free enumeration.
    const files = s.action(actions.filter_files, { WFContentItemFilter: where(["File Size", "greater_than", 5, "MB"], ["Name", "contains", "report"], ["Creation Date", "is_in_the_last", 2, "weeks"]) });
    expect(rows(files).map((r) => r.Values)).toEqual([{ Number: 5, ByteCountUnit: 4 }, { String: "report" }, { Number: 2, Unit: 8192 }]);
    const photos = s.action(actions.filter_photos, { WFContentItemFilter: where(["Duration", "greater_than", 30, "seconds"], ["Album", "is", "Recents"], ["Frame Rate", "greater_than", 59]) });
    expect(rows(photos).map((r) => r.Values)).toEqual([{ Number: 30, Unit: 128 }, { Enumeration: { WFSerializationType: "WFStringSubstitutableState", Value: "Recents" } }, { Number: 59 }]);
    // The row key follows the property's value class: email addresses and phone numbers have their own.
    const contacts = s.action(actions.filter_contacts, { WFContentItemFilter: where(["Email Addresses", "contains", "@example.com"], ["Phone Numbers", "begins_with", "+1505"], ["Group", "is", "Family"]) });
    expect(rows(contacts).map((r) => r.Values)).toEqual([{ Email: "@example.com" }, { Phone: "+1505" }, { Enumeration: { WFSerializationType: "WFStringSubstitutableState", Value: "Family" } }]);
    // Reminders' Priority lists its choices; an App Intents enumeration holds the case identifier in its own state class.
    const reminders = s.action(actions.filter_reminders, { WFContentItemFilter: where(["Priority", "is", "High"]) });
    expect(rows(reminders)[0]!.Values).toEqual({ Enumeration: { WFSerializationType: "WFStringSubstitutableState", Value: "High" } });
    const assets = s.action(actions.photos_find_photo, { WFContentItemFilter: where(["assetType", "is", "video"]) });
    expect(rows(assets)[0]!.Values).toEqual({ Enumeration: { WFSerializationType: "WFLinkEnumerationSubstitutableState", Value: "video" } });
    // @ts-expect-error a file size needs a unit
    expect(() => s.action(actions.filter_files, { WFContentItemFilter: where(["File Size", "greater_than", 5]) })).toThrow(/takes 2 value/);
    // @ts-expect-error not a byte-count unit
    expect(() => s.action(actions.filter_files, { WFContentItemFilter: where(["File Size", "greater_than", 5, "MiB"]) })).toThrow(/one of bytes, KB, MB/);
    // @ts-expect-error seconds are not a unit Date Taken offers
    expect(() => s.action(actions.filter_photos, { WFContentItemFilter: where(["Date Taken", "is_in_the_last", 5, "seconds"]) })).toThrow(/one of years, months, weeks, days/);
    expect(FILTERS["is.workflow.actions.filter.reminders"].Priority.choices).toEqual(["None", "Low", "Medium", "High"]);
    // Find Calendar Events needs a bounded Start Date row, which is marked as such; without one the engine would discard the filter.
    const events = s.action(actions.filter_calendarevents, { WFContentItemFilter: where(["Calendar", "is", "Work"], ["Start Date", "is_in_the_next", 7, "days"]) });
    const ev = events.WFWorkflowActionParameters.WFContentItemFilter as { Value: { WFContentPredicateBoundedDate: boolean; WFActionParameterFilterTemplates: Array<{ Bounded?: boolean }> } };
    expect(ev.Value.WFContentPredicateBoundedDate).toBe(true);
    expect(ev.Value.WFActionParameterFilterTemplates.map((r) => r.Bounded)).toEqual([undefined, true]);
    expect(() => s.action(actions.filter_calendarevents, { WFContentItemFilter: where(["Calendar", "is", "Work"]) })).toThrow(/needs a Start Date row with one of/);
    expect(Object.keys(FILTERS).filter((k) => k.startsWith("is.workflow.")).length).toBe(14);
  });
  test("property() references one property of an output, checked against the entity", () => {
    const s = new Shortcut("Messages");
    const found = s.action(actions.messages_find_message, {});
    const body = property(found, "body");
    expect(body.Value).toMatchObject({ Type: "ActionOutput", OutputName: "Message", Aggrandizements: [{ Type: "WFPropertyVariableAggrandizement", PropertyName: "body" }] });
    expect(property(repeatItem(), "date").Value).toEqual({ Type: "Variable", VariableName: "Repeat Item", Aggrandizements: [{ Type: "WFPropertyVariableAggrandizement", PropertyName: "date" }] });
    expect(property(body, "length").Value.Aggrandizements).toHaveLength(2);
    // @ts-expect-error not a property of Message
    expect(() => property(found, "bodyy")).toThrow(/has no property bodyy/);
    expect(Object.values(ENTITY_PROPERTIES).flat().length).toBe(752);
  });
  test("the engine's own filter rules cover every class and entity type", () => {
    // data/engine-filters.json and data/linkd-properties.json come from `bun run extract-filters`
    // (docs/extraction.md, "The engine's own filter rules"); the packages do not type from them yet.
    const engine = JSON.parse(readFileSync(new URL("../data/engine-filters.json", import.meta.url), "utf8"));
    expect(Object.keys(engine.subjectTypes).length).toBe(95);
    expect(Object.keys(engine.builtin).length).toBe(30);
    expect(Object.keys(engine.entities).length).toBe(Object.keys(ENTITY_PROPERTIES).length);
    const linkd = JSON.parse(readFileSync(new URL("../data/linkd-properties.json", import.meta.url), "utf8"));
    expect(Object.keys(linkd.entities).length).toBe(Object.keys(ENTITY_PROPERTIES).length);
    expect(linkd.alternatesRemaining).toBe(0);
    const yields = Object.values(linkd.entities as Record<string, { yields?: Record<string, string[]> }>).flatMap((e) => Object.values(e.yields ?? {}));
    expect(yields.length).toBe(752);
    expect(yields.filter((y) => y.length).length).toBe(729);
    // Every type with several queries carries the class built with each.
    for (const e of Object.values(linkd.entities as Record<string, { queries?: string[]; byQuery?: Record<string, unknown> }>)) if (e.queries) expect(Object.keys(e.byQuery ?? {}).sort()).toEqual([...e.queries].sort());
    // Row value forms: one sample per row value type the engine names, each read back, plus the byte-count unit codes.
    expect(Object.keys(engine.rowValues.forms).sort()).toEqual(["DateIsTodayOperator", "RowTemplateCompoundNumberByteCountUnitValueType", "RowTemplateCompoundNumberCalendarUnitValueType", "RowTemplateDateValueType", "RowTemplateEnumerationValueType<EnumerationStringValueKey, NSString, NSString>", "RowTemplateNumberValueType", "RowTemplateStringValueType"]);
    expect(Object.keys(linkd.rowValues.forms).sort()).toEqual(["RowTemplateContactHandleValueType", "RowTemplateEnumerationValueType<EnumerationLinkValueKey, LNDynamicOption, LNValue>"]);
    expect(Object.entries(engine.rowValues.byteCountUnits as Record<string, { label: string; decimalExponent: number }>).map(([c, u]) => `${c}:${u.label}:${u.decimalExponent}`)).toEqual(["1:bytes:0", "2:KB:3", "4:MB:6", "8:GB:9", "16:TB:12", "32:PB:15", "64:EB:18"]);
    const filters = Object.values(linkd.entities as Record<string, { filters?: Record<string, { cases?: string[] }> }>).flatMap((e) => Object.values(e.filters ?? {}));
    expect(filters.filter((f) => f.cases).length).toBe(84);
    expect(filters.filter((f) => f.cases && f.cases.length).length).toBe(82);
  });
  test("the README's examples are test/readme-examples.ts, and they run", async () => {
    const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
    const copy = readFileSync(new URL("./readme-examples.ts", import.meta.url), "utf8");
    const blocks = [...readme.matchAll(/```ts\n([\s\S]*?)```/g)].map((m) => m[1]!.replace(/^import .*\n\n?/gm, ""));
    expect(blocks.length).toBe(Object.keys(readmeExamples).length);
    for (const b of blocks) expect(copy).toContain(b);

    const cwd = process.cwd(), dir = mkdtempSync(join(tmpdir(), "shortcutkit-readme-"));
    const sign = spyOn(Shortcut, "sign").mockImplementation((_input, output) => output);
    process.chdir(dir);
    try {
      await readmeExamples.greeting();
      expect(existsSync("Greeting.shortcut")).toBe(true);
      expect(sign).toHaveBeenCalledWith("Greeting.shortcut", "Greeting-signed.shortcut");
    } finally {
      process.chdir(cwd);
      sign.mockRestore();
    }
    readmeExamples.shareSheet();
    const s = new Shortcut("T");
    const name = s.action(actions.ask, {});
    readmeExamples.controlFlow(s, name);
    readmeExamples.applesApps(s);
    readmeExamples.findingThings(s);
    readmeExamples.builtInFind(s);
    readmeExamples.dictionariesAndTypes(s, name);
    readmeExamples.otherApps(s, name);
    expect(s.actions.length).toBe(1 + 5 + 2 + 2 + 1 + 3 + 2);
  });
});

describe("dictionaries, coercions and other apps' intents", () => {
  test("dictionary() writes each item under its type code, as the engine serializes them back", () => {
    const d = dictionary({ t: "hello", n: 5, b: true, r: variable("V"), d: { k: "v" }, a: ["x", 7, false, { k: "v" }, ["z"]] });
    const items = d.Value.WFDictionaryFieldValueItems;
    expect(items.map((i) => i.WFItemType)).toEqual([0, 3, 4, 0, 1, 2]);
    expect(items[0]).toEqual({ WFKey: text("t"), WFItemType: 0, WFValue: text("hello") });
    expect(items[1]!.WFValue).toEqual(text("5"));
    expect(items[2]!.WFValue).toEqual({ WFSerializationType: "WFNumberSubstitutableState", Value: true });
    expect(items[3]!.WFValue).toEqual(text(variable("V")));
    // A nested dictionary is wrapped once more than the outer one; array items carry no key, and plain text is the bare string.
    expect(items[4]!.WFValue).toEqual({ WFSerializationType: "WFDictionaryFieldValue", Value: dictionary({ k: "v" }) });
    expect(items[5]!.WFValue).toEqual({ WFSerializationType: "WFArrayParameterState", Value: ["x", { WFItemType: 3, WFValue: text("7") }, { WFItemType: 4, WFValue: { WFSerializationType: "WFNumberSubstitutableState", Value: false } }, { WFItemType: 1, WFValue: { WFSerializationType: "WFDictionaryFieldValue", Value: dictionary({ k: "v" }) } }, { WFItemType: 2, WFValue: { WFSerializationType: "WFArrayParameterState", Value: ["z"] } }] });
    // A plain object given for a dictionary key is encoded; an encoded value passes through; other kinds refuse an object.
    const s = new Shortcut("D");
    expect(s.action(actions.dictionary, { WFItems: { k: "v" } }).WFWorkflowActionParameters.WFItems).toEqual(dictionary({ k: "v" }));
    const headers = dictionary({ apikey: variable("Key") });
    expect(s.action(actions.downloadurl, { WFURL: "https://example.com", WFHTTPHeaders: headers }).WFWorkflowActionParameters.WFHTTPHeaders).toBe(headers);
    // @ts-expect-error a Date is not a dictionary item
    expect(() => dictionary({ when: new Date() })).toThrow(/dictionary\(\)/);
  });
  test("coerce() names one of the engine's content item classes", () => {
    const s = new Shortcut("C");
    const got = s.action(actions.getstoredcontent, {});
    expect(coerce(got, "WFStringContentItem").Value).toEqual({ Type: "ActionOutput", OutputUUID: got.WFWorkflowActionParameters.UUID as string, OutputName: "Stored Content", Aggrandizements: [{ Type: "WFCoercionVariableAggrandizement", CoercionItemClass: "WFStringContentItem" }] });
    expect(coerce(property(repeatItem(), "title"), "WFNumberContentItem").Value.Aggrandizements).toHaveLength(2);
    expect(CONTENT_ITEM_CLASSES.WFDictionaryContentItem).toBe("Dictionary");
    expect(Object.keys(CONTENT_ITEM_CLASSES).length).toBe(22);
    // @ts-expect-error not a content item class
    expect(() => coerce(got, "WFNoSuchContentItem")).toThrow(/no content item class/);
    const gid = s.if(coerce(got, "WFStringContentItem"), "is", "x");
    s.endIf(gid);
    expect(s.actions[1]!.WFWorkflowActionParameters.WFInput).toEqual({ Type: "Variable", Variable: coerce(got, "WFStringContentItem") });
  });
  test("appIntent() names another app's action as the catalogue names Apple's", () => {
    const app = { BundleIdentifier: "com.example.app", Name: "Example", TeamIdentifier: "ABCDE12345" };
    const s = new Shortcut("Other");
    const made = s.action(appIntent(app, "CreateNoteIntent", "Note"), { title: text("Hi"), pinned: false });
    expect(made.WFWorkflowActionIdentifier).toBe("com.example.app.CreateNoteIntent");
    expect(made.WFWorkflowActionParameters.AppIntentDescriptor).toEqual({ ...app, AppIntentIdentifier: "CreateNoteIntent", ActionRequiresAppInstallation: true });
    expect(ref(made).Value.OutputName).toBe("Note");
    expect(ref(s.action(appIntent(app, "OpenIntent"))).Value.OutputName).toBe("Output");
    // An app's own intents are identified as appIntent() composes it, bundle identifier then intent name: 1,254 of the
    // 1,265 catalogue entries. The other 11 are intents hosted in a framework or extension (Clock's MobileTimerIntents,
    // Notes' SharingExtension), whose identifiers the catalogue carries.
    const entries = Object.entries(ACTIONS).filter(([, e]) => "descriptor" in e) as Array<[string, { descriptor: { BundleIdentifier: string; AppIntentIdentifier: string } }]>;
    const composed = entries.filter(([id, e]) => id === `${e.descriptor.BundleIdentifier}.${e.descriptor.AppIntentIdentifier}`);
    expect([entries.length, composed.length]).toEqual([1265, 1254]);
    // An Apple app's intent named this way gets the catalogue's checks.
    const reminders = { BundleIdentifier: "com.apple.reminders", Name: "Reminders", TeamIdentifier: "0000000000" };
    expect(() => s.action(appIntent(reminders, "TTRCreateReminderAppIntent"), { nope: 1 })).toThrow(/unknown parameter/);
  });
});

describe("release", () => {
  test("the three version strings agree", () => {
    const root = join(import.meta.dir, "..");
    const npm = (JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as { version: string }).version;
    const pyproject = /^version = "([^"]+)"/m.exec(readFileSync(join(root, "python/pyproject.toml"), "utf8"))![1];
    const module = /^__version__ = "([^"]+)"/m.exec(readFileSync(join(root, "python/src/shortcutkit/__init__.py"), "utf8"))![1];
    expect(pyproject).toBe(npm);
    expect(module).toBe(npm);
  });
});
