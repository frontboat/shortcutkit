// README.md's TypeScript examples, verbatim apart from imports. tsc checks that they compile;
// test/shortcut.test.ts checks that they match the README and runs them. Later examples continue
// the first one, so they take its `s` and `name`.
import { Shortcut, actions, ref, text, shortcutInput, where, property, type Action } from "../src/index";

export async function greeting() {
const s = new Shortcut("Greeting");
const name = s.action(actions.ask, { WFAskActionPrompt: "What's your name?" });
s.action(actions.showresult, { Text: text("Hello, ", ref(name), "!") });

await s.write(); // Greeting.shortcut
Shortcut.sign("Greeting.shortcut", "Greeting-signed.shortcut");
}

export function shareSheet() {
const s = new Shortcut("Page Links", { types: ["ActionExtension"], inputClasses: ["WFSafariWebPageContentItem"] });
const links = s.action(actions.runjavascriptonwebpage, { WFInput: shortcutInput(), WFJavaScript: "completion(document.links.length)" });
s.action(actions.showresult, { Text: text("Links: ", ref(links)) });
}

export function controlFlow(s: Shortcut, name: Action) {
const gid = s.if(ref(name), "has_any_value");
s.action(actions.showresult, { Text: text("Hello, ", ref(name)) });
s.otherwise(gid);
s.action(actions.showresult, { Text: text("Hello, stranger") });
s.endIf(gid);
}

export function applesApps(s: Shortcut) {
const r = s.action(actions.reminders_create_reminder, { title: text("Buy milk"), priorityLevel: "high" });
s.action(actions.notes_create_note, { name: "Shopping", content: text("Added ", ref(r)) });
}

export function findingThings(s: Shortcut) {
const found = s.action(actions.messages_find_message, {
  WFContentItemFilter: where(["author", "is", "+15055550100"], ["date", "is_in_the_last", 7, "days"]),
});
s.action(actions.showresult, { Text: text(property(found, "body")) });
}

export function otherApps(s: Shortcut, name: Action) {
s.action("com.example.app.CreateNoteIntent", {
  AppIntentDescriptor: {
    BundleIdentifier: "com.example.app", Name: "Example", TeamIdentifier: "ABCDE12345",
    AppIntentIdentifier: "CreateNoteIntent", ActionRequiresAppInstallation: true,
  },
  title: text("Hello"),
  body: ref(name),
});
}
