// Maps every built-in action parameter to the class that defines how its value is
// serialized in a .shortcut file. Each WFParameter subclass names a "state" class via
// -singleStateClass; that class implements -serializedRepresentation and
// -initWithSerializedRepresentation:variableProvider:parameter:, which is the encoding.
// Also records each parameter's -defaultSerializedRepresentation as a worked example.
//
// Run via ./extract-builtin-actions.sh, or by hand:
//   xcrun clang -fobjc-arc -fobjc-exceptions -framework Foundation -o /tmp/enc extract-parameter-encodings.m
//   /tmp/enc out.json
//
// @try/@catch is used only at the boundary with private API: a few parameter classes
// throw "must implement -singleStateClass" (they are containers, not values).
#import <Foundation/Foundation.h>
#import <objc/runtime.h>
#import <objc/message.h>
#include <dlfcn.h>
static id c0(id t, const char* s) { return ((id (*)(id, SEL))objc_msgSend)(t, sel_registerName(s)); }
static id c1(id t, const char* s, id a) { return ((id (*)(id, SEL, id))objc_msgSend)(t, sel_registerName(s), a); }
static id plain(id v, int depth) {
  if (!v) return [NSNull null];
  if (depth > 8) return [v description];
  if ([v isKindOfClass:[NSString class]] || [v isKindOfClass:[NSNumber class]]) return v;
  if ([v isKindOfClass:[NSDictionary class]]) { NSMutableDictionary* d = [NSMutableDictionary new]; for (id k in v) d[[k description]] = plain(v[k], depth+1); return d; }
  if ([v isKindOfClass:[NSArray class]]) { NSMutableArray* a = [NSMutableArray new]; for (id x in v) [a addObject:plain(x, depth+1)]; return a; }
  return [NSString stringWithFormat:@"<%s>", class_getName([v class])];
}
int main(int argc, char** argv) {
  if (argc < 2) { fprintf(stderr, "usage: %s out.json\n", argv[0]); return 2; }
  setvbuf(stdout, NULL, _IONBF, 0);
  dlopen("/System/Library/PrivateFrameworks/WorkflowKit.framework/WorkflowKit", RTLD_NOW);
  id provider = [[objc_getClass("WFBundledActionProvider") alloc] init];
  id ids = c0(provider, "availableActionIdentifiers");
  id defs = c1(provider, "actionDefinitionsWithIdentifiers:", ids);
  NSMutableDictionary* byParamClass = [NSMutableDictionary new]; int actions = 0, params = 0, failed = 0;
  NSMutableDictionary* actionParameters = [NSMutableDictionary new];
  id allActions = nil;
  @try { allActions = ((id (*)(id, SEL, BOOL))objc_msgSend)(provider, sel_registerName("createAllAvailableActionsIncludingMissingActions:"), YES); }
  @catch (NSException* e) { fprintf(stderr, "createAll threw: %s\n", e.reason.UTF8String); }
  fprintf(stderr, "createAllAvailableActionsIncludingMissingActions: %lu actions\n", (unsigned long)[allActions count]);
  // Walk in identifier order so usedBy/defaultExamples are deterministic across runs.
  allActions = [allActions sortedArrayUsingComparator:^NSComparisonResult(id a, id b) { return [(NSString*)c0(a, "identifier") compare:(NSString*)c0(b, "identifier")]; }];
  for (id action in allActions) {
    NSString* ident = c0(action, "identifier"); id plist = nil;
    @try { plist = c0(action, "parameters"); } @catch (NSException* e) { failed++; continue; }
    actions++;
    NSMutableArray* keys = [NSMutableArray new];
    for (id p in plist) {
      params++;
      { id key = c0(p, "key"); NSString* pcn = [NSString stringWithUTF8String:class_getName([p class])];
        if ([key isKindOfClass:[NSString class]]) [keys addObject:@{@"key": key, @"class": pcn}]; }
      NSString* pc = [NSString stringWithUTF8String:class_getName([p class])];
      Class sc = nil; id dflt = nil;
      @try { sc = (Class)c0(p, "singleStateClass"); dflt = c0(p, "defaultSerializedRepresentation"); } @catch (NSException* e) { /* container parameter without a value state */ }
      NSMutableDictionary* entry = byParamClass[pc] ?: [NSMutableDictionary new];
      entry[@"stateClass"] = sc ? [NSString stringWithUTF8String:class_getName(sc)] : [NSNull null];
      NSMutableArray* ex = entry[@"defaultExamples"] ?: [NSMutableArray new];
      id pd = plain(dflt, 0);
      if (dflt && ![ex containsObject:pd] && ex.count < 3) [ex addObject:pd];
      entry[@"defaultExamples"] = ex;
      entry[@"count"] = @([entry[@"count"] intValue] + 1);
      NSMutableArray* used = entry[@"usedBy"] ?: [NSMutableArray new];
      if (used.count < 5 && ![used containsObject:ident]) [used addObject:ident];
      entry[@"usedBy"] = used;
      byParamClass[pc] = entry;
    }
    actionParameters[ident] = keys;
  }
  fprintf(stderr, "actions created: %d failed: %d parameters: %d parameter classes: %lu\n", actions, failed, params, (unsigned long)byParamClass.count);
  // state classes: their serialization selectors
  NSMutableDictionary* stateSel = [NSMutableDictionary new];
  for (NSString* pc in byParamClass) {
    id scn = byParamClass[pc][@"stateClass"]; if (![scn isKindOfClass:[NSString class]]) continue;
    Class sc = objc_getClass([scn UTF8String]); if (!sc || stateSel[scn]) continue;
    NSMutableArray* sels = [NSMutableArray new];
    for (Class c = sc; c && c != [NSObject class]; c = class_getSuperclass(c)) {
      unsigned n; Method* ms = class_copyMethodList(c, &n);
      for (unsigned i = 0; i < n; i++) { NSString* s = [NSString stringWithUTF8String:sel_getName(method_getName(ms[i]))]; if ([s containsString:@"erializ"] || [s containsString:@"init"]) [sels addObject:s]; }
      free(ms);
    }
    stateSel[scn] = sels;
  }
  NSData* json = [NSJSONSerialization dataWithJSONObject:@{@"parameterClasses": byParamClass, @"stateClassSelectors": stateSel, @"actionParameters": actionParameters} options:NSJSONWritingPrettyPrinted | NSJSONWritingSortedKeys error:nil];
  [json writeToFile:[NSString stringWithUTF8String:argv[1]] atomically:YES];
  return 0;
}
