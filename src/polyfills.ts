/**
 * Runtime-method polyfills for old mini-program JS engines.
 *
 * tsup lowers *syntax* to ES2018 but never polyfills built-in *methods*. The
 * bundled `marked` lexer emits `Array.prototype.at` (`.at(-1)` in ~17 spots),
 * which throws `x.at is not a function` on iOS < 15.4 / older 基础库 → the whole
 * bundle blanks. `es-check` only catches syntax, so it can't see this hole; the
 * guard lives here instead and `scripts/check-bundle.mjs` verifies it survived
 * bundling (and fails on any *other* runtime method we haven't covered yet).
 *
 * Notes on safety — this mutates a global prototype, so it is written to be
 * inert wherever the method already exists:
 *   - guarded (`if (!…at)`), so modern engines keep their native impl;
 *   - defined via `Object.defineProperty` with `enumerable: false`, so it never
 *     leaks into anyone's `for…in` (a plain `proto.at = fn` would);
 *   - spec-conformant `.at` semantics (negative index, out-of-range → undefined).
 */

// Shared implementation for both Array#at and String#at (identical algorithm).
function at(this: { length: number; [i: number]: unknown }, index: number): unknown {
  const len = this.length;
  let relative = Math.trunc(index) || 0;
  if (relative < 0) relative += len;
  return relative < 0 || relative >= len ? undefined : this[relative];
}

// `Array.prototype.at` / `String.prototype.at` are ES2022 — not in the ES2020
// lib types this project compiles against, hence the `as any` reads.
if (!(Array.prototype as unknown as { at?: unknown }).at) {
  Object.defineProperty(Array.prototype, 'at', {
    value: at,
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

if (!(String.prototype as unknown as { at?: unknown }).at) {
  Object.defineProperty(String.prototype, 'at', {
    value: at,
    writable: true,
    configurable: true,
    enumerable: false,
  });
}
