import assert from "node:assert/strict";
// @ts-ignore
import test from "node:test";

import { Block } from "../types/blocks.d.js";
import { Font } from "../types/font.d.js";
import { BlockTooTallError } from "./errors.js";
import placer from "./placer.js";

test("Breaks page when running into an overflowing block.", () => {
  const iterator = (function* (): IterableIterator<Block> {
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
      label: "0_TEXT_L0",
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
      pageIndex: 1,
      text: "Lorem ipsum dolor sit amet.",
      type: "text",
      x: 50,
      y: 50,
    },
  ]);
});

test("Does not break page when running into an overflowing spacing.", () => {
  const iterator = (function* (): IterableIterator<Block> {
    yield {
      height: 380,
      label: "0_VIEW_ST",
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
      label: "1_TEXT_L0",
      minPresenceAhead: 1,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    };
    yield {
      height: 0,
      label: "0_VIEW_SB",
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
      pageIndex: 0,
      text: "Lorem ipsum dolor sit amet.",
      type: "text",
      x: 50,
      y: 430,
    },
  ]);
});

test("Outputs the proper elements out of a minimal block list.", () => {
  const iterator = (function* (): IterableIterator<Block> {
    yield {
      height: 20,
      label: "0_VIEW_ST",
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
      label: "1_TEXT_L0",
      minPresenceAhead: 1,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    };
    yield {
      height: 20,
      label: "0_VIEW_SB",
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
      pageIndex: 0,
      text: "Lorem ipsum dolor sit amet.",
      type: "text",
      x: 50,
      y: 70,
    },
  ]);
});

// test("Outputs the proper elements out of a minimal block list with background.", () => {
//   const iterator = (function* (): IterableIterator<Block> {
//     yield {
//       element: {
//         color: [255, 0, 0, 1],
//         type: "rectangle",
//         width: 250,
//         x: 50,
//       },
//       endBlockLabel: "0_VIEW_SB",
//       label: "0_VIEW_BG",
//       type: "absolute",
//     };
//     yield {
//       height: 20,
//       label: "0_VIEW_ST",
//       minPresenceAhead: 1,
//       spacingBottom: 0,
//       spacingTop: 20,
//       type: "relative",
//     };
//     yield {
//       element: {
//         color: [0, 0, 0, 1],
//         font: {} as Font,
//         fontSize: 20,
//         text: "Lorem ipsum dolor sit amet.",
//         type: "text",
//         x: 50,
//       },
//       height: 20,
//       label: "1_TEXT_L0",
//       minPresenceAhead: 1,
//       spacingBottom: 0,
//       spacingTop: 0,
//       type: "relative",
//     };
//     yield {
//       height: 20,
//       label: "0_VIEW_SB",
//       minPresenceAhead: 1,
//       spacingBottom: 20,
//       spacingTop: 0,
//       type: "relative",
//     };
//   })();
//   const elements = [
//     ...placer({
//       iterator,
//       paperHeight: 500,
//       paperMarginBottom: 50,
//       paperMarginTop: 50,
//     }),
//   ];
//   assert.deepStrictEqual(elements, [
//     {
//       color: [255, 0, 0, 1],
//       height: 60,
//       pageIndex: 0,
//       type: "rectangle",
//       width: 250,
//       x: 50,
//       y: 70,
//     },
//     {
//       color: [0, 0, 0, 1],
//       font: {},
//       fontSize: 20,
//       height: 20,
//       pageIndex: 0,
//       text: "Lorem ipsum dolor sit amet.",
//       type: "text",
//       x: 50,
//       y: 90,
//     },
//   ]);
// });

// test("Outputs the proper elements out of a minimal block list with background spanning multiple pages.", () => {
//   const iterator = (function* (): IterableIterator<Block> {
//     yield {
//       element: {
//         color: [255, 0, 0, 1],
//         type: "rectangle",
//         width: 250,
//         x: 50,
//       },
//       endBlockLabel: "0_VIEW_SB",
//       label: "0_VIEW_BG",
//       type: "absolute",
//     };
//     yield {
//       height: 20,
//       label: "0_VIEW_ST",
//       minPresenceAhead: 1,
//       spacingBottom: 0,
//       spacingTop: 20,
//       type: "relative",
//     };
//     yield {
//       height: 350,
//       label: "SPACER",
//       minPresenceAhead: 0,
//       spacingBottom: 0,
//       spacingTop: 0,
//       type: "relative",
//     };
//     yield {
//       element: {
//         color: [0, 0, 0, 1],
//         font: {} as Font,
//         fontSize: 20,
//         text: "Lorem ipsum dolor sit amet.",
//         type: "text",
//         x: 50,
//       },
//       height: 20,
//       label: "1_TEXT_L0",
//       minPresenceAhead: 1,
//       spacingBottom: 0,
//       spacingTop: 0,
//       type: "relative",
//     };
//     yield {
//       height: 20,
//       label: "0_VIEW_SB",
//       minPresenceAhead: 1,
//       spacingBottom: 20,
//       spacingTop: 0,
//       type: "relative",
//     };
//   })();
//   const elements = [
//     ...placer({
//       iterator,
//       paperHeight: 500,
//       paperMarginBottom: 50,
//       paperMarginTop: 50,
//     }),
//   ];
//   assert.deepStrictEqual(elements, [
//     {
//       color: [255, 0, 0, 1],
//       height: 380,
//       pageIndex: 0,
//       type: "rectangle",
//       width: 250,
//       x: 50,
//       y: 70,
//     },
//     {
//       color: [255, 0, 0, 1],
//       height: 40,
//       pageIndex: 1,
//       type: "rectangle",
//       width: 250,
//       x: 50,
//       y: 50,
//     },
//     {
//       color: [0, 0, 0, 1],
//       font: {},
//       fontSize: 20,
//       height: 20,
//       pageIndex: 1,
//       text: "Lorem ipsum dolor sit amet.",
//       type: "text",
//       x: 50,
//       y: 50,
//     },
//   ]);
// });

test("Throws when encountering a block that is too tall to be placed.", () => {
  const iterator = (function* (): IterableIterator<Block> {
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
      label: "0_TEXT_L0",
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
