import assert from "node:assert/strict";
// @ts-ignore
import test from "node:test";

import type { FontRegistry } from "../../types/fontRegistry.d.js";
import type { TextNode } from "../../types/template.d.js";
import textUnit from "./text.js";

const fontRegistry: FontRegistry = {
  list: [
    {
      getLineHeightAtSize(size: number) {
        return size;
      },
      getTextWidthAtSize(text: string, size: number) {
        return (text.length * size) / 16;
      },
      getBaselineShiftAtSize(size: number) {
        return 0.75 * size;
      },
    },
  ],
  getFont() {
    return this.list[0];
  },
};

test("Outputs the proper blocks out of a single node with short text.", () => {
  const rootNode: TextNode = {
    color: [0, 0, 0, 1],
    fontFamily: "Inter",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 400,
    minPresenceAhead: 0,
    text: "Lorem ipsum dolor sit amet",
    textAlign: "left",
    type: "text",
  };
  const blocks = [
    ...textUnit({
      *explore() {},
      fontRegistry,
      id: 0,
      maxWidth: 256,
      node: rootNode,
      x: 32,
    }),
  ];
  assert.deepStrictEqual(blocks, [
    {
      element: {
        color: [0, 0, 0, 1],
        font: fontRegistry.list[0],
        fontSize: 16,
        text: "Lorem ipsum dolor sit amet",
        type: "text",
        x: 32,
      },
      height: 16,
      label: "0_TEXT_L0",
      minPresenceAhead: 0,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    },
  ]);
});

test("Outputs the proper blocks out of a single node with large text.", () => {
  const rootNode: TextNode = {
    color: [0, 0, 0, 1],
    fontFamily: "Inter",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: 400,
    minPresenceAhead: 0,
    text: [
      "Les représentants du peuple français, constitués en Assemblée nationale",
      ", considérant que l'ignorance, l'oubli ou le mépris des droits de l'hom",
      "me sont les seules causes des malheurs publics et de la corruption des ",
      "gouvernements, ont résolu d'exposer, dans une déclaration solennelle, l",
      "es droits naturels, inaliénables et sacrés de l'homme, afin que cette d",
      "éclaration, constamment présente à tous les membres du corps social, le",
      "ur rappelle sans cesse leurs droits et leurs devoirs ; afin que les act",
      "es du pouvoir législatif et ceux du pouvoir exécutif, pouvant être à ch",
      "aque instant comparés avec le but de toute institution politique, en so",
      "ient plus respectés ; afin que les réclamations des citoyens, fondées d",
      "ésormais sur des principes simples et incontestables, tournent toujours",
      " au maintien de la Constitution et au bonheur de tous.",
    ].join(""),
    textAlign: "left",
    type: "text",
  };
  const blocks = [
    ...textUnit({
      *explore() {},
      fontRegistry,
      id: 0,
      maxWidth: 256,
      node: rootNode,
      x: 32,
    }),
  ];
  assert.deepStrictEqual(blocks, [
    {
      element: {
        color: [0, 0, 0, 1],
        font: fontRegistry.list[0],
        fontSize: 16,
        text: [
          "Les représentants du peuple français, constitués en Assemblée natio",
          "nale, considérant que l'ignorance, l'oubli ou le mépris des droits ",
          "de l'homme sont les seules causes des malheurs publics et de la cor",
          "ruption des gouvernements, ont résolu d'exposer, dans",
        ].join(""),
        type: "text",
        x: 32,
      },
      height: 16,
      label: "0_TEXT_L0",
      minPresenceAhead: 0,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    },
    {
      element: {
        color: [0, 0, 0, 1],
        font: fontRegistry.list[0],
        fontSize: 16,
        text: [
          "une déclaration solennelle, les droits naturels, inaliénables et sa",
          "crés de l'homme, afin que cette déclaration, constamment présente à",
          " tous les membres du corps social, leur rappelle sans cesse leurs d",
          "roits et leurs devoirs ; afin que les actes du pouvoir",
        ].join(""),
        type: "text",
        x: 32,
      },
      height: 16,
      label: "0_TEXT_L1",
      minPresenceAhead: 0,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    },
    {
      element: {
        color: [0, 0, 0, 1],
        font: fontRegistry.list[0],
        fontSize: 16,
        text: [
          "législatif et ceux du pouvoir exécutif, pouvant être à chaque insta",
          "nt comparés avec le but de toute institution politique, en soient p",
          "lus respectés ; afin que les réclamations des citoyens, fondées dés",
          "ormais sur des principes simples et incontestables,",
        ].join(""),
        type: "text",
        x: 32,
      },
      height: 16,
      label: "0_TEXT_L2",
      minPresenceAhead: 0,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    },
    {
      element: {
        color: [0, 0, 0, 1],
        font: fontRegistry.list[0],
        fontSize: 16,
        text: [
          "tournent toujours au maintien de la Constitution et au bonheur de t",
          "ous.",
        ].join(""),
        type: "text",
        x: 32,
      },
      height: 16,
      label: "0_TEXT_L3",
      minPresenceAhead: 0,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    },
  ]);
});
