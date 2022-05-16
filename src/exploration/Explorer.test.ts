import assert from "node:assert/strict";
import test from "node:test";

test("synchronous passing test", () => {
  assert.deepStrictEqual(1, 1);
});
