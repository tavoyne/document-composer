import assert from "node:assert/strict";
// @ts-ignore
import test from "node:test";

import type { FontRegistry } from "../../types/fontRegistry.d.js";
import type { ViewNode } from "../../types/template.d.js";
import viewUnit from "./view.js";

test("Outputs the proper blocks out of a single node.", () => {
  const rootNode: ViewNode = {
    backgroundColor: [255, 0, 0, 1],
    children: [],
    marginBottom: 2,
    marginLeft: 4,
    marginRight: 6,
    marginTop: 8,
    minPresenceAhead: 1,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 14,
    paddingTop: 16,
    type: "view",
  };
  const blocks = [
    ...viewUnit({
      *explore() {},
      fontRegistry: {} as FontRegistry,
      id: 0,
      maxWidth: 256,
      node: rootNode,
      x: 32,
    }),
  ];
  assert.deepStrictEqual(blocks, [
    {
      element: {
        color: [255, 0, 0, 1],
        type: "rectangle",
        width: 246,
        x: 36,
      },
      endBlockLabel: "0_VIEW_SB",
      label: "0_VIEW_BG",
      type: "absolute",
    },
    {
      height: 16,
      label: `0_VIEW_ST`,
      minPresenceAhead: 1,
      spacingBottom: 0,
      spacingTop: 8,
      type: "relative",
    },
    {
      height: 10,
      label: `0_VIEW_SB`,
      minPresenceAhead: 2,
      spacingBottom: 2,
      spacingTop: 0,
      type: "relative",
    },
  ]);
});
