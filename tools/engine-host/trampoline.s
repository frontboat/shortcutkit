// sk_call_self(fn, self, metadata, witnessTable, indirectResult): call a Swift protocol requirement
// with self in x20 (swiftself) and an indirect result buffer in x8.
.globl _sk_call_self
.p2align 2
_sk_call_self:
  stp x29, x30, [sp, #-32]!
  mov x29, sp
  stp x20, x19, [sp, #16]
  mov x16, x0
  mov x20, x1
  mov x0, x2
  mov x1, x3
  mov x8, x4
  blr x16
  ldp x20, x19, [sp, #16]
  ldp x29, x30, [sp], #32
  ret
