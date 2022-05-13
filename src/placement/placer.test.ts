import assert from "node:assert/strict";
// @ts-ignore
import test from "node:test";

import { Block } from "../types/blocks.d.js";
import { Font } from "../types/font.d.js";
import { BlockTooTallError } from "./errors.js";
import placer from "./placer.js";

test("Outputs the proper elements out of a minimal block list.", () => {
  const iterator: IterableIterator<Block> = (function* () {
    yield {
      height: 20,
      label: `0_VIEW_ST`,
      minPresenceAhead: 1,
      spacingBottom: 0,
      spacingTop: 20,
      type: "relative",
    };
    yield {
      element: {
        color: [0, 0, 0, 1],
        font: {} as Font,
        fontSize: 20,
        text: "Lorem ipsum dolor sit amet.",
        type: "text",
        x: 50,
      },
      height: 20,
      label: `1_TEXT_L0`,
      minPresenceAhead: 1,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    };
    yield {
      height: 20,
      label: `0_VIEW_SB`,
      minPresenceAhead: 1,
      spacingBottom: 20,
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
      fontSize: 20,
      height: 20,
      heightAhead: 0,
      heightBehind: 0,
      pageIndex: 0,
      text: "Lorem ipsum dolor sit amet.",
      type: "text",
      x: 50,
      y: 90,
    },
  ]);
});

test("Breaks page when running into an overflowing block.", () => {
  const iterator: IterableIterator<Block> = (function* () {
    yield {
      height: 390,
      label: "SPACER",
      minPresenceAhead: 0,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    };
    yield {
      element: {
        color: [0, 0, 0, 1],
        font: {} as Font,
        fontSize: 20,
        text: "Lorem ipsum dolor sit amet.",
        type: "text",
        x: 50,
      },
      height: 20,
      label: `0_TEXT_L0`,
      minPresenceAhead: 1,
      spacingBottom: 0,
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
      fontSize: 20,
      height: 20,
      heightAhead: 0,
      heightBehind: 0,
      pageIndex: 1,
      text: "Lorem ipsum dolor sit amet.",
      type: "text",
      x: 50,
      y: 50,
    },
  ]);
});

test("Does not break page when running into an overflowing spacing.", () => {
  const iterator: IterableIterator<Block> = (function* () {
    yield {
      height: 380,
      label: `0_VIEW_ST`,
      minPresenceAhead: 1,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    };
    yield {
      element: {
        color: [0, 0, 0, 1],
        font: {} as Font,
        fontSize: 20,
        text: "Lorem ipsum dolor sit amet.",
        type: "text",
        x: 50,
      },
      height: 20,
      label: `1_TEXT_L0`,
      minPresenceAhead: 1,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    };
    yield {
      height: 0,
      label: `0_VIEW_SB`,
      minPresenceAhead: 1,
      spacingBottom: 20,
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
      fontSize: 20,
      height: 20,
      heightAhead: 0,
      heightBehind: 0,
      pageIndex: 0,
      text: "Lorem ipsum dolor sit amet.",
      type: "text",
      x: 50,
      y: 430,
    },
  ]);
});

test("Throws when encountering a block that is too tall to be placed.", () => {
  const iterator: IterableIterator<Block> = (function* () {
    yield {
      element: {
        color: [0, 0, 0, 1],
        font: {} as Font,
        fontSize: 20,
        text: "Lorem ipsum dolor sit amet.",
        type: "text",
        x: 50,
      },
      height: 420,
      label: `0_TEXT_L0`,
      minPresenceAhead: 1,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    };
  })();
  assert.throws(() => {
    return [
      ...placer({
        iterator,
        paperHeight: 500,
        paperMarginBottom: 50,
        paperMarginTop: 50,
      }),
    ];
  }, BlockTooTallError);
});
