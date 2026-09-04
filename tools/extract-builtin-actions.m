// Dumps every built-in Shortcuts action definition to JSON by loading
// WorkflowKit (Apple's private Shortcuts engine) and asking its bundled
// action provider, the same object Shortcuts.app uses to build the action list.
//
// Build & run via ./extract-builtin-actions.sh, or by hand:
//   xcrun clang -fobjc-arc -framework Foundation -o /tmp/extract extract-builtin-actions.m
//   /tmp/extract out.json
//
// Requires: macOS with Xcode or Command Line Tools. No SIP changes, no extraction
// of the dyld shared cache: dlopen resolves the framework from the cache directly.
#import <Foundation/Foundation.h>
#import <objc/runtime.h>
#import <objc/message.h>
#include <dlfcn.h>

static id call0(id target, const char* sel) { return ((id (*)(id, SEL))objc_msgSend)(target, sel_registerName(sel)); }
static id call1(id target, const char* sel, id arg) { return ((id (*)(id, SEL, id))objc_msgSend)(target, sel_registerName(sel), arg); }

// First NSDictionary-typed ivar of an object. WFActionDefinition, WFParameterDefinition
// and WFActionDescriptionDefinition are all thin wrappers around one dictionary.
static id backingDict(id v) {
  unsigned n; Ivar* ivs = class_copyIvarList([v class], &n);
  for (unsigned i = 0; i < n; i++) {
    id x = object_getIvar(v, ivs[i]);
    if ([x isKindOfClass:[NSDictionary class]]) { free(ivs); return x; }
  }
  free(ivs); return nil;
}

// Human-readable fields are LocalizedStringResource values bridged into ObjC.
// Their -description embeds the key and the English default; take the default.
static id resolveLocalized(id v) {
  if ([v respondsToSelector:sel_registerName("localizedString")]) {
    id s = call0(v, "localizedString");
    if ([s isKindOfClass:[NSString class]]) return s;
  }
  NSString* desc = [v description];
  NSRegularExpression* re = [NSRegularExpression regularExpressionWithPattern:
    @"defaultValue: [^\\n]*?key: \\\"((?:[^\\\"\\\\]|\\\\.)*)\\\"" options:0 error:nil];
  NSTextCheckingResult* m = [re firstMatchInString:desc options:0 range:NSMakeRange(0, desc.length)];
  return m ? [desc substringWithRange:[m rangeAtIndex:1]] : desc;
}

static id sanitize(id v, int depth) {
  if (!v || v == [NSNull null]) return [NSNull null];
  if (depth > 16) return [v description];
  const char* cn = class_getName([v class]);
  if (strncmp(cn, "WF", 2) == 0 && strstr(cn, "Definition")) {
    id d = backingDict(v); return d ? sanitize(d, depth + 1) : [v description];
  }
  if (strcmp(cn, "WFParameterSummaryValue") == 0) {
    NSMutableDictionary* d = [NSMutableDictionary new];
    id key = call0(v, "key"), fmtL = call0(v, "localizedSummaryString"), fmt = call0(v, "summaryString"), req = call0(v, "requiredValues");
    if (key) d[@"key"] = sanitize(key, depth + 1);
    if (fmtL) d[@"format"] = sanitize(fmtL, depth + 1); else if (fmt) d[@"format"] = sanitize(fmt, depth + 1);
    if (req && [req count]) d[@"requiredValues"] = sanitize(req, depth + 1);
    return d;
  }
  if (strcmp(cn, "WFParameterSummary") == 0) {
    NSMutableDictionary* d = [NSMutableDictionary new];
    id fmtL = call0(v, "singleFormatLocalizedString"), fmt = call0(v, "singleFormatString"), title = call0(v, "title"), vals = call0(v, "possibleValues");
    if (fmtL) d[@"format"] = sanitize(fmtL, depth + 1); else if (fmt) d[@"format"] = sanitize(fmt, depth + 1);
    if (title) d[@"title"] = sanitize(title, depth + 1);
    if (vals) d[@"possibleValues"] = sanitize(vals, depth + 1);
    return d;
  }
  if (strstr(cn, "LocalizationResource") || strstr(cn, "LocalizedStringResource")) return resolveLocalized(v);
  // RequiredResources entries (device idiom, capability, Apple Intelligence access, ...)
  // have no dictionary form; emit the class name plus any plain-valued ivars, never a pointer.
  if (strstr(cn, "Resource") && (strncmp(cn, "WF", 2) == 0 || strstr(cn, ".WF"))) {
    NSMutableDictionary* d = [NSMutableDictionary new];
    const char* dot = strrchr(cn, '.');
    d[@"resource"] = [NSString stringWithUTF8String:dot ? dot + 1 : cn];
    unsigned n; Ivar* ivs = class_copyIvarList([v class], &n);
    for (unsigned i = 0; i < n; i++) {
      const char* enc = ivar_getTypeEncoding(ivs[i]);
      if (!enc || enc[0] != '@') continue;
      id x = object_getIvar(v, ivs[i]);
      if ([x isKindOfClass:[NSString class]] || [x isKindOfClass:[NSNumber class]] || [x isKindOfClass:[NSArray class]] || [x isKindOfClass:[NSDictionary class]])
        d[[NSString stringWithUTF8String:ivar_getName(ivs[i])]] = sanitize(x, depth + 1);
    }
    free(ivs);
    return d;
  }
  if ([v isKindOfClass:[NSString class]] || [v isKindOfClass:[NSNumber class]]) return v;
  if ([v isKindOfClass:[NSDictionary class]]) {
    NSMutableDictionary* d = [NSMutableDictionary new];
    for (id k in v) d[[k description]] = sanitize(v[k], depth + 1);
    return d;
  }
  if ([v isKindOfClass:[NSArray class]] || [v isKindOfClass:[NSSet class]] || [v isKindOfClass:[NSOrderedSet class]]) {
    NSMutableArray* a = [NSMutableArray new];
    for (id x in v) [a addObject:sanitize(x, depth + 1)];
    return a;
  }
  if ([v isKindOfClass:[NSData class]]) return [NSString stringWithFormat:@"<data %lu bytes>", (unsigned long)[v length]];
  // Swift arrays of LocalizedStringResource (enum parameter Items) arrive boxed as
  // __SwiftValue with no ObjC element access; render-builtin-actions.py parses these.
  return [v description];
}

int main(int argc, char** argv) {
  if (argc < 2) { fprintf(stderr, "usage: %s out.json\n", argv[0]); return 2; }
  if (!dlopen("/System/Library/PrivateFrameworks/WorkflowKit.framework/WorkflowKit", RTLD_NOW)) {
    fprintf(stderr, "dlopen WorkflowKit failed: %s\n", dlerror()); return 1;
  }
  Class providerClass = objc_getClass("WFBundledActionProvider");
  if (!providerClass) { fprintf(stderr, "WFBundledActionProvider not found; WorkflowKit internals changed\n"); return 1; }
  id provider = [[providerClass alloc] init];
  id ids = call0(provider, "availableActionIdentifiers");
  id defs = call1(provider, "actionDefinitionsWithIdentifiers:", ids);
  if (![defs isKindOfClass:[NSDictionary class]]) { fprintf(stderr, "unexpected definitions type %s\n", class_getName([defs class])); return 1; }
  id out = sanitize(defs, 0);
  NSError* err = nil;
  NSData* json = [NSJSONSerialization dataWithJSONObject:out options:NSJSONWritingPrettyPrinted | NSJSONWritingSortedKeys error:&err];
  if (!json) { fprintf(stderr, "JSON error: %s\n", err.description.UTF8String); return 1; }
  if (![json writeToFile:[NSString stringWithUTF8String:argv[1]] atomically:YES]) { fprintf(stderr, "write failed\n"); return 1; }
  fprintf(stderr, "%lu actions -> %s\n", (unsigned long)[defs count], argv[1]);
  return 0;
}
