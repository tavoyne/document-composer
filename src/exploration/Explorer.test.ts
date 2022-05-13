import assert from "node:assert/strict";
// @ts-ignore
import test from "node:test";

test("synchronous passing test", () => {
  assert.deepStrictEqual(1, 1);
});
