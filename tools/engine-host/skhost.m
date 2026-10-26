// skhost <script.js> [args...]: a host process for engine probes that osascript cannot run.
//
// It loads ActionKit, WorkflowKit and LinkMetadata, then runs a JavaScript for Automation script in
// this process (OSAKit; the script sees the same ObjC bridge as under osascript, plus the C
// functions below). It exists for two things osascript cannot do:
//
// 1. Call WorkflowKit's Swift-only Find-filter rules (RowTemplateFindFilterParameterState:
//    filterableProperties, possibleOperators, subjectType). They are not exported, so lldb looks
//    their addresses up in the shared cache and hands them in at launch (tools/engine-host/run.sh,
//    addresses.py); sk_describe() calls them with the Swift calling convention (trampoline.s).
// 2. Serve linkd's metadata to WorkflowKit without the com.apple.linkd.registry entitlement:
//    with SK_LINKD_DIR set, LNMetadataProvider's lookups answer from keyed archives that a shortcut
//    saved from inside ShortcutsMacHelper (tools/linkd/archive-metadata.js), so entity classes are
//    built from Apple's real metadata (enums included) instead of the index's reconstruction.
//
// ActionKit's +load asserts that the host is an Apple platform binary (SecTaskGetCodeSignStatus),
// which this binary is not; run.sh runs skhost under lldb with a breakpoint that returns from that
// initializer at once. Everything else runs natively.
#import <Foundation/Foundation.h>
#import <OSAKit/OSAKit.h>
#import <dlfcn.h>
#import <objc/runtime.h>

extern long sk_call_self(void *fn, void *self, void *meta, void *wt, void *result);
typedef struct { const char *s; uintptr_t n; } TypeName;
static void *(*getObjCClassMetadata)(Class);
static TypeName (*getTypeName)(void *, bool);
static void *(*conformsToProtocol)(void *, void *);
static void *(*filterableProperties)(void *);
static void *(*possibleOperators)(void *, id, bool);
static long (*subjectType)(id);
static id (*predicateForRow)(id); // WFContentPredicateForRowTemplateValue: the run-time comparison a row stands for
static void *contentOperatorThunk, *comparisonOperatorProtocol, *operatorContentOperatorThunk, *operatorProtocol;

// lldb fills this in (addresses.py) while the process is stopped in sk_addresses_ready(); the
// order is the one addresses.py uses.
void *sk_addresses[8];
static void takeAddresses(void) {
  filterableProperties = sk_addresses[0]; possibleOperators = sk_addresses[1]; subjectType = sk_addresses[2];
  contentOperatorThunk = sk_addresses[3]; comparisonOperatorProtocol = sk_addresses[4];
  operatorContentOperatorThunk = sk_addresses[5]; operatorProtocol = sk_addresses[6];
  predicateForRow = sk_addresses[7];
}
// The breakpoint site: the frameworks are loaded, nothing has run yet.
__attribute__((noinline)) void sk_addresses_ready(void) { __asm__ volatile(""); }

// A Swift Array of class references: native storage (count at +16, elements at +32) or a bridged NSArray.
static NSArray *objectsOfArray(void *a) {
  uintptr_t p = (uintptr_t)a & 0x0FFFFFFFFFFFFFF8ULL;
  const char *cn = object_getClassName((__bridge id)(void *)p);
  if (strstr(cn, "ArrayStorage")) {
    long n = *(long *)(p + 16); NSMutableArray *out = [NSMutableArray array];
    for (long i = 0; i < n; i++) [out addObject:(__bridge id)(*(void **)(p + 32 + 8 * i))];
    return out;
  }
  return (__bridge NSArray *)(void *)p;
}
static NSString *typeName(void *md) { TypeName t = getTypeName(md, true); return [[NSString alloc] initWithBytes:t.s length:t.n encoding:NSUTF8StringEncoding]; }

// The value inside an existential container's 3-word buffer, by the type's value witness flags.
static void *projectExistential(void *buffer, void *md) {
  uint8_t *vwt = *(uint8_t **)((uint8_t *)md - 8);
  uint32_t flags = *(uint32_t *)(vwt + 0x50);
  if (!(flags & 0x00020000)) return buffer;
  uintptr_t mask = flags & 0xff, box = *(uintptr_t *)buffer;
  return (void *)(box + ((16 + mask) & ~mask));
}

// possibleOperators returns [any RowTemplateFindFilterOperator]: 40-byte existentials. Each one's
// operator code comes from its contentOperator getter (RowTemplateComparisonOperator for the value
// comparisons, RowTemplateOperator for the rest), called through the protocol's dispatch thunk.
static NSArray *operators(void *meta, id prop, bool bounded) {
  void *arr = possibleOperators(meta, prop, bounded);
  uintptr_t p = (uintptr_t)arr; long n = *(long *)(p + 16); NSMutableArray *out = [NSMutableArray array];
  for (long i = 0; i < n; i++) {
    uint8_t *e = (uint8_t *)(p + 32 + 40 * i);
    void *md = *(void **)(e + 24), *value = projectExistential(e, md);
    NSMutableDictionary *o = [@{ @"type": typeName(md) } mutableCopy];
    long code = 0; void *wt = conformsToProtocol(md, comparisonOperatorProtocol);
    if (wt) o[@"code"] = @(sk_call_self(contentOperatorThunk, value, md, wt, NULL));
    else if ((wt = conformsToProtocol(md, operatorProtocol))) { sk_call_self(operatorContentOperatorThunk, value, md, wt, &code); o[@"code"] = @(code); }
    [out addObject:o];
  }
  return out;
}

// JSON { property name: { subjectType, operators: [{ type, code }], bounded: [...] } }: the engine's
// own Find-filter rules for a content item class, or "null" when the class does not exist.
const char *sk_describe(const char *className) {
  @autoreleasepool {
    if (!filterableProperties) { fprintf(stderr, "skhost: addresses were not set; run through run.sh\n"); exit(6); }
    Class c = NSClassFromString(@(className));
    if (!c) return strdup("null");
    void *meta = getObjCClassMetadata(c);
    NSMutableDictionary *out = [NSMutableDictionary dictionary];
    for (id prop in objectsOfArray(filterableProperties(meta))) {
      NSString *name = [prop valueForKey:@"name"];
      out[name] = @{ @"subjectType": @(subjectType(prop)), @"operators": operators(meta, prop, false), @"bounded": operators(meta, prop, true) };
    }
    NSData *d = [NSJSONSerialization dataWithJSONObject:out options:NSJSONWritingSortedKeys error:nil];
    return strdup([[NSString alloc] initWithData:d encoding:NSUTF8StringEncoding].UTF8String);
  }
}

// JSON { comparisonType, valueClass, value, byteCount?, timeInterval? }: what the engine compares with at
// run time for a WFRowTemplateValue (the editor's row model), through the same C function the Find
// action uses. Tells which of a row's fields a property reads (Email Addresses reads `email`, not
// `string`) and what a byte-count unit code or calendar unit means.
const char *sk_row_predicate(void *row) {
  @autoreleasepool {
    if (!predicateForRow) { fprintf(stderr, "skhost: addresses were not set; run through run.sh\n"); exit(6); }
    id p = predicateForRow((__bridge id)row);
    NSMutableDictionary *out = [NSMutableDictionary dictionary];
    out[@"predicateClass"] = p ? NSStringFromClass([p class]) : [NSNull null];
    if ([p respondsToSelector:@selector(comparisonType)]) out[@"comparisonType"] = @((long)[p performSelector:@selector(comparisonType)]);
    if ([p respondsToSelector:@selector(value)]) {
      id v = [p performSelector:@selector(value)];
      out[@"valueClass"] = v ? NSStringFromClass([v class]) : [NSNull null];
      out[@"value"] = v ? [v description] : [NSNull null];
      if ([v respondsToSelector:@selector(byteCount)]) out[@"byteCount"] = @([[v valueForKey:@"byteCount"] longLongValue]);
      if ([v respondsToSelector:@selector(formattedString)]) out[@"formatted"] = [v valueForKey:@"formattedString"];
      if ([v respondsToSelector:@selector(timeInterval)]) out[@"timeInterval"] = [v valueForKey:@"timeInterval"];
    }
    NSData *d = [NSJSONSerialization dataWithJSONObject:out options:NSJSONWritingSortedKeys error:nil];
    return strdup([[NSString alloc] initWithData:d encoding:NSUTF8StringEncoding].UTF8String);
  }
}

// linkd's metadata from archives: <dir>/<bundle>.archive holds { entities: [LNEntityMetadata],
// enums: [LNEnumMetadata] } and <dir>/queries.archive holds linkd's queriesWithError: dictionary.
static NSString *linkdDir;
static NSMutableDictionary *linkdCache;
static NSMutableDictionary<NSString *, NSNumber *> *linkdCalls;
static id unarchive(NSString *path) {
  NSData *d = [NSData dataWithContentsOfFile:path];
  if (!d) return nil;
  NSKeyedUnarchiver *u = [[NSKeyedUnarchiver alloc] initForReadingFromData:d error:nil];
  u.requiresSecureCoding = NO;
  id o = [u decodeObjectForKey:NSKeyedArchiveRootObjectKey];
  [u finishDecoding];
  return o;
}
static NSDictionary *bundleArchive(NSString *bundle) {
  @synchronized (linkdCache) {
    id o = linkdCache[bundle];
    if (!o) { o = unarchive([linkdDir stringByAppendingFormat:@"/%@.archive", bundle]) ?: [NSNull null]; linkdCache[bundle] = o; }
    return o == [NSNull null] ? @{} : o;
  }
}
static void counted(SEL s) { @synchronized (linkdCalls) { NSString *k = NSStringFromSelector(s); linkdCalls[k] = @(linkdCalls[k].integerValue + 1); } }
static id sk_entities(id self, SEL _cmd, NSString *b, NSError **e) { counted(_cmd); return bundleArchive(b)[@"entities"] ?: @[]; }
static id sk_enums(id self, SEL _cmd, NSString *b, NSError **e) { counted(_cmd); return bundleArchive(b)[@"enums"] ?: @[]; }
static id sk_entity(id self, SEL _cmd, NSString *b, NSString *ident, NSError **e) {
  counted(_cmd);
  for (id x in bundleArchive(b)[@"entities"]) if ([[x valueForKey:@"identifier"] isEqual:ident]) return x;
  return nil;
}
static id sk_entityWaiting(id self, SEL _cmd, NSString *b, NSString *ident, BOOL wait, NSError **e) { return sk_entity(self, _cmd, b, ident, e); }
static id allQueries(void) { return bundleArchive(@"queries"); }
static id sk_queries(id self, SEL _cmd, NSError **e) { counted(_cmd); return allQueries(); }
static id sk_queriesOfType(id self, SEL _cmd, NSString *b, long type, NSError **e) { counted(_cmd); return @[]; } // linkd itself answers none for every type
static id sk_queryNamed(id self, SEL _cmd, NSString *b, NSString *ident, NSError **e) {
  counted(_cmd);
  // queriesWithError: maps bundle -> (query identifier -> LNQueryMetadata); older archives held arrays.
  id qs = allQueries()[b];
  if ([qs isKindOfClass:[NSDictionary class]]) qs = [qs allValues];
  for (id q in qs) { NSString *qi = [q valueForKey:@"identifier"]; if ([qi isEqual:ident] || [ident hasSuffix:[@"." stringByAppendingString:qi]]) return q; }
  return nil;
}
static void replace(Class c, SEL s, IMP imp) {
  Method m = class_getInstanceMethod(c, s);
  if (!m) { fprintf(stderr, "skhost: LNMetadataProvider has no %s; LinkMetadata changed\n", sel_getName(s)); exit(5); }
  method_setImplementation(m, imp);
}
// Any other LNMetadataProvider method: counted under "unserved <selector>" and answered nil, so a
// lookup the archives do not cover shows up in sk_linkd_calls() instead of reaching linkd.
static id sk_unserved(id self, SEL _cmd, ...) { counted(sel_registerName([[@"unserved " stringByAppendingString:NSStringFromSelector(_cmd)] UTF8String])); return nil; }
static void serveLinkd(NSString *dir) {
  linkdDir = dir; linkdCache = [NSMutableDictionary dictionary]; linkdCalls = [NSMutableDictionary dictionary];
  Class c = NSClassFromString(@"LNMetadataProvider");
  unsigned int n = 0; Method *ms = class_copyMethodList(c, &n);
  for (unsigned int i = 0; i < n; i++) {
    const char *name = sel_getName(method_getName(ms[i]));
    if (name[0] == '.' || !strcmp(name, "init") || !strcmp(name, "dealloc") || !strcmp(name, "connection") || !strcmp(name, "initWithOptions:")) continue;
    method_setImplementation(ms[i], (IMP)sk_unserved);
  }
  free(ms);
  replace(c, @selector(entitiesForBundleIdentifier:error:), (IMP)sk_entities);
  replace(c, @selector(enumsForBundleIdentifier:error:), (IMP)sk_enums);
  replace(c, @selector(entityForBundleIdentifier:withEntityIdentifier:error:), (IMP)sk_entity);
  replace(c, @selector(entityForBundleIdentifier:withEntityIdentifier:waitForIndexing:error:), (IMP)sk_entityWaiting);
  replace(c, @selector(queriesWithError:), (IMP)sk_queries);
  replace(c, @selector(queriesForBundleIdentifier:ofType:error:), (IMP)sk_queriesOfType);
  replace(c, @selector(queryForBundleIdentifier:withFullyQualifiedIdentifier:error:), (IMP)sk_queryNamed);
}
// JSON of how many times each served lookup was called (empty when not serving).
const char *sk_linkd_calls(void) {
  NSData *d = [NSJSONSerialization dataWithJSONObject:linkdCalls ?: @{} options:NSJSONWritingSortedKeys error:nil];
  return strdup([[NSString alloc] initWithData:d encoding:NSUTF8StringEncoding].UTF8String);
}

int main(int argc, const char **argv) {
  @autoreleasepool {
    if (argc < 2) { fprintf(stderr, "usage: skhost script.js [args...]\n"); return 2; }
    dlopen("/System/Library/PrivateFrameworks/ActionKit.framework/ActionKit", RTLD_NOW);
    dlopen("/System/Library/PrivateFrameworks/WorkflowKit.framework/WorkflowKit", RTLD_NOW);
    dlopen("/System/Library/PrivateFrameworks/LinkMetadata.framework/LinkMetadata", RTLD_NOW);
    if (!NSClassFromString(@"WFAskForInputAction")) { fprintf(stderr, "skhost: ActionKit did not load (run through run.sh)\n"); return 4; }
    getObjCClassMetadata = dlsym(RTLD_DEFAULT, "swift_getObjCClassMetadata");
    getTypeName = dlsym(RTLD_DEFAULT, "swift_getTypeName");
    conformsToProtocol = dlsym(RTLD_DEFAULT, "swift_conformsToProtocol");
    const char *ld = getenv("SK_LINKD_DIR");
    if (ld && *ld) serveLinkd(@(ld));
    sk_addresses_ready();
    takeAddresses();
    NSMutableArray *args = [NSMutableArray array]; for (int i = 2; i < argc; i++) [args addObject:@(argv[i])];
    setenv("SK_ARGS", [[NSString alloc] initWithData:[NSJSONSerialization dataWithJSONObject:args options:0 error:nil] encoding:NSUTF8StringEncoding].UTF8String, 1);
    NSString *src = [NSString stringWithContentsOfFile:@(argv[1]) encoding:NSUTF8StringEncoding error:nil];
    if (!src) { fprintf(stderr, "skhost: cannot read %s\n", argv[1]); return 2; }
    OSAScript *s = [[OSAScript alloc] initWithSource:src language:[OSALanguage languageForName:@"JavaScript"]];
    NSDictionary *err = nil;
    NSAppleEventDescriptor *r = [s executeAndReturnError:&err];
    if (err) { fprintf(stderr, "%s\n", err.description.UTF8String); return 1; }
    if (r.stringValue) printf("%s\n", r.stringValue.UTF8String);
    // run() reports an exception inside main() as "error: ..." (OSAKit drops the message otherwise).
    if ([r.stringValue hasPrefix:@"error:"]) return 1;
  }
  return 0;
}
