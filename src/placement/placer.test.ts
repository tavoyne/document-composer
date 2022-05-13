import assert from "node:assert/strict";
// @ts-ignore
import test from "node:test";

import { Block } from "../types/blocks.d.js";
import { Font } from "../types/font.d.js";
import placer from "./placer.js";

test("Outputs the proper elements out of a minimal block list.", () => {
  const iterator: IterableIterator<Block> = (function* () {
    yield {
      height: 16,
      label: `0_VIEW_ST`,
      minPresenceAhead: 1,
      spacingBottom: 0,
      spacingTop: 8,
      type: "relative",
    };
    yield {
      element: {
        color: [0, 0, 0, 1],
        font: {} as Font,
        fontSize: 16,
        text: "Lorem ipsum dolor sit amet",
        type: "text",
        x: 32,
      },
      height: 16,
      label: `1_TEXT_L0`,
      minPresenceAhead: 1,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    };
    yield {
      height: 10,
      label: `0_VIEW_SB`,
      minPresenceAhead: 1,
      spacingBottom: 2,
      spacingTop: 0,
      type: "relative",
    };
  })();
  const elements = [
    ...placer({
      iterator,
      paperHeight: 500,
      paperMarginBottom: 50,
      paperMarginTop: 50,
    }),
  ];
  assert.deepStrictEqual(elements, [
    {
      color: [0, 0, 0, 1],
      font: {},
      fontSize: 16,
      height: 16,
      heightAhead: 0,
      heightBehind: 0,
      pageIndex: 0,
      text: "Lorem ipsum dolor sit amet",
      type: "text",
      x: 32,
      y: 74,
    },
  ]);
});
