// Produces the definitive value-encoding table for .shortcut files by asking
// WorkflowKit's own classes to serialize:
//   - every WFVariable kind (action output, named variable, shortcut input, ...)
//   - a WFVariableString with embedded variables (the WFTextTokenString form)
//   - every parameter state class, constructed with a plain value and with a variable
//   - the 15 icon palette colors as WFWorkflowIcon reports them
//   - the operator codes each conditional subject type supports
//
//   xcrun clang -fobjc-arc -fobjc-exceptions -framework Foundation -o /tmp/enc extract-encoding-table.m
//   /tmp/enc out.json [data/parameter-encodings.json]
// The optional second argument supplies the state class names (from
// extract-parameter-encodings.m); without it a built-in list is used. Scanning every
// class in the process is avoided on purpose: +initialize on unrelated classes crashes.
#import <Foundation/Foundation.h>
#import <objc/runtime.h>
#import <objc/message.h>
#include <dlfcn.h>

static id c0(id t, const char* s) { return ((id (*)(id, SEL))objc_msgSend)(t, sel_registerName(s)); }
static id c1(id t, const char* s, id a) { return ((id (*)(id, SEL, id))objc_msgSend)(t, sel_registerName(s), a); }
static id plain(id v, int d) {
  if (!v) return [NSNull null];
  if (d > 8) return [v description];
  if ([v isKindOfClass:[NSString class]] || [v isKindOfClass:[NSNumber class]]) return v;
  if ([v isKindOfClass:[NSDictionary class]]) { NSMutableDictionary* o = [NSMutableDictionary new]; for (id k in v) o[[k description]] = plain(v[k], d + 1); return o; }
  if ([v isKindOfClass:[NSArray class]]) { NSMutableArray* a = [NSMutableArray new]; for (id x in v) [a addObject:plain(x, d + 1)]; return a; }
  return [NSString stringWithFormat:@"<%s>", class_getName([v class])];
}
static id attempt(id (^block)(void)) { @try { return block(); } @catch (NSException* e) { return [NSString stringWithFormat:@"threw: %@", e.reason]; } }
static id serialized(id state) { return state ? plain(c0(state, "serializedRepresentation"), 0) : @"nil"; }

int main(int argc, char** argv) {
  if (argc < 2) { fprintf(stderr, "usage: %s out.json\n", argv[0]); return 2; }
  if (!dlopen("/System/Library/PrivateFrameworks/WorkflowKit.framework/WorkflowKit", RTLD_NOW)) { fprintf(stderr, "dlopen failed\n"); return 1; }
  NSMutableDictionary* out = [NSMutableDictionary new];

  // Variables
  id named = ((id (*)(id, SEL, id, id, id))objc_msgSend)([objc_getClass("WFUserDefinedVariable") alloc], sel_registerName("initWithName:variableProvider:aggrandizements:"), @"MyVar", nil, nil);
  id output = ((id (*)(id, SEL, id, id, id, id))objc_msgSend)([objc_getClass("WFActionOutputVariable") alloc], sel_registerName("initWithOutputUUID:outputName:variableProvider:aggrandizements:"), @"11111111-2222-3333-4444-555555555555", @"Stored Content", nil, nil);
  NSMutableDictionary* vars = [NSMutableDictionary new];
  vars[@"WFUserDefinedVariable(MyVar)"] = plain(c0(named, "serializedRepresentation"), 0);
  vars[@"WFActionOutputVariable"] = plain(c0(output, "serializedRepresentation"), 0);
  vars[@"WFShortcutInputVariable"] = plain(c0(((id (*)(id, SEL, id, id))objc_msgSend)([objc_getClass("WFShortcutInputVariable") alloc], sel_registerName("initWithVariableProvider:aggrandizements:"), nil, nil), "serializedRepresentation"), 0);
  for (NSString* cls in @[@"WFClipboardVariable", @"WFCurrentDateVariable", @"WFDeviceDetailsVariable", @"WFCurrentAppVariable"])
    vars[cls] = plain(c0(c1([objc_getClass(cls.UTF8String) alloc], "initWithAggrandizements:", nil), "serializedRepresentation"), 0);
  vars[@"WFAskEachTimeVariable(prompt)"] = plain(c0(c1([objc_getClass("WFAskEachTimeVariable") alloc], "initWithPrompt:", @"Which one?"), "serializedRepresentation"), 0);
  out[@"variables"] = vars;

  // Text with embedded variables
  id vs = c1([objc_getClass("WFVariableString") alloc], "initWithStringsAndVariables:", @[@"Hello ", named, @"!"]);
  out[@"variableString(Hello <MyVar>!)"] = plain(c0(vs, "serializedRepresentation"), 0);

  // State classes: plain value and variable forms
  NSMutableDictionary* states = [NSMutableDictionary new];
  NSMutableSet* stateNames = [NSMutableSet setWithArray:@[@"WFStringSubstitutableState", @"WFBooleanSubstitutableState", @"WFNumberSubstitutableState", @"WFNumberStringSubstitutableState", @"WFVariableStringParameterState", @"WFVariableParameterState", @"WFURLStringParameterState", @"WFDateFieldParameterState", @"WFStringParameterState", @"WFNumberParameterState", @"WFDictionaryParameterState", @"WFAppDescriptorParameterState", @"WFColorParameterState", @"WFFileParameterState", @"WFLocationParameterState", @"WFINObjectSubstitutableState", @"WFCalendarSubstitutableState", @"WFWorkflowParameterState", @"WFQuantityParameterState", @"WFContactFieldEntry", @"WFFontParameterState", @"WFNSUnitSubstitutableState", @"WFIntentDescriptorParameterState", @"WFMediaItemState"]];
  if (argc > 2) { NSDictionary* enc = [NSJSONSerialization JSONObjectWithData:[NSData dataWithContentsOfFile:[NSString stringWithUTF8String:argv[2]]] options:0 error:nil];
    for (NSDictionary* e in [enc[@"parameterClasses"] allValues]) { id sc = e[@"stateClass"]; if ([sc isKindOfClass:[NSString class]] && ![sc hasPrefix:@"_TtGC"]) [stateNames addObject:sc]; } }
  for (NSString* cn0 in [[stateNames allObjects] sortedArrayUsingSelector:@selector(compare:)]) {
    const char* cn = cn0.UTF8String; Class c = objc_getClass(cn); if (!c) continue;
    BOOL relevant = [c instancesRespondToSelector:sel_registerName("serializedRepresentation")] && (
      [c instancesRespondToSelector:sel_registerName("initWithValue:")] || [c instancesRespondToSelector:sel_registerName("initWithVariable:")] ||
      [c instancesRespondToSelector:sel_registerName("initWithNumber:")] || [c instancesRespondToSelector:sel_registerName("initWithString:")] ||
      [c instancesRespondToSelector:sel_registerName("initWithVariableString:")] || [c instancesRespondToSelector:sel_registerName("initWithKeyValuePairs:")]);
    if (!relevant) continue;
    NSMutableDictionary* e = [NSMutableDictionary new];
    if ([c instancesRespondToSelector:sel_registerName("initWithValue:")]) {
      NSDictionary* cands = @{@"value:string": @"hello", @"value:number": @5, @"value:bool": @YES};
      for (NSString* k in cands) { id r = attempt(^{ return serialized(c1([c alloc], "initWithValue:", cands[k])); }); if (!([r isKindOfClass:[NSString class]] && [r hasPrefix:@"threw"])) e[k] = r; }
    }
    if ([c instancesRespondToSelector:sel_registerName("initWithNumber:")]) e[@"number:5"] = attempt(^{ return serialized(c1([c alloc], "initWithNumber:", @5)); });
    if ([c instancesRespondToSelector:sel_registerName("initWithBoolValue:")]) e[@"bool:YES"] = attempt(^{ return serialized(((id (*)(id, SEL, BOOL))objc_msgSend)([c alloc], sel_registerName("initWithBoolValue:"), YES)); });
    if ([c instancesRespondToSelector:sel_registerName("initWithString:")]) e[@"string:hello"] = attempt(^{ return serialized(c1([c alloc], "initWithString:", @"hello")); });
    if ([c instancesRespondToSelector:sel_registerName("initWithVariableString:")]) e[@"variableString:Hello <MyVar>!"] = attempt(^{ return serialized(c1([c alloc], "initWithVariableString:", vs)); });
    if ([c instancesRespondToSelector:sel_registerName("initWithVariable:")]) {
      e[@"variable:MyVar"] = attempt(^{ return serialized(c1([c alloc], "initWithVariable:", named)); });
      e[@"variable:ActionOutput"] = attempt(^{ return serialized(c1([c alloc], "initWithVariable:", output)); });
    }
    if ([c instancesRespondToSelector:sel_registerName("initWithKeyValuePairs:")]) e[@"keyValuePairs:[]"] = attempt(^{ return serialized(c1([c alloc], "initWithKeyValuePairs:", @[])); });
    if (e.count) states[[NSString stringWithUTF8String:cn]] = e;
  }
  out[@"stateClasses"] = states;

  // Icon palette
  NSMutableArray* palette = [NSMutableArray new]; Class icon = objc_getClass("WFWorkflowIcon");
  for (unsigned long i = 0; i < 15; i++) {
    id ic = ((id (*)(id, SEL, unsigned long, unsigned short))objc_msgSend)([icon alloc], sel_registerName("initWithPaletteColor:glyphCharacter:"), i, 61440);
    long long v = ((long long (*)(id, SEL))objc_msgSend)(ic, sel_registerName("backgroundColorValue"));
    [palette addObject:@{@"palette": @(i), @"WFWorkflowIconStartColor": @((unsigned int)(v & 0xffffffff)), @"signed": @(v), @"color": [c0(ic, "backgroundColor") description] ?: @""}];
  }
  out[@"iconPalette"] = palette;
  out[@"defaultGlyphCharacter"] = @(((unsigned long (*)(id, SEL))objc_msgSend)(icon, sel_registerName("defaultGlyphCharacter")));

  // Conditional subject operator codes
  NSMutableDictionary* ops = [NSMutableDictionary new];
  for (NSString* cn0 in @[@"WFConditionalSubjectParameterState", @"WFVariableConditionalSubjectState", @"WFHomeAccessoryConditionalSubjectState"]) { Class c = objc_getClass(cn0.UTF8String); if (!c) continue;
    id st = attempt(^{ return [[c alloc] init]; }); id o = [st isKindOfClass:[NSString class]] ? st : attempt(^{ return plain(c0(st, "supportedComparisonOperators"), 0); });
    ops[cn0] = @{@"subjectType": plain(attempt(^{ return c0(c, "subjectType"); }), 0), @"operators": o ?: [NSNull null]}; }
  out[@"conditionalSubjectOperators"] = ops;

  NSData* json = [NSJSONSerialization dataWithJSONObject:out options:NSJSONWritingPrettyPrinted | NSJSONWritingSortedKeys error:nil];
  [json writeToFile:[NSString stringWithUTF8String:argv[1]] atomically:YES];
  fprintf(stderr, "%lu state classes, %lu variables -> %s\n", (unsigned long)states.count, (unsigned long)vars.count, argv[1]);
  return 0;
}
