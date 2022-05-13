import type { FontRegistry } from "../types/font.d.js";
import type { ExploreContext, UnitReturnType } from "./types.js";
import textUnit from "./units/text.js";
import viewUnit from "./units/view.js";

export default class Explorer {
  #fontRegistry: FontRegistry;
  #nextId: number;

  constructor(fontRegistry: FontRegistry) {
    this.#fontRegistry = fontRegistry;
    this.#nextId = 0;
  }

  explore({ maxWidth, node, x }: ExploreContext): UnitReturnType {
    const id = this.#nextId;
    this.#nextId += 1;
    const partialContext = {
      explore: this.explore.bind(this),
      fontRegistry: this.#fontRegistry,
      id,
      maxWidth,
      x,
    };
    switch (node.type) {
      case "text":
        return textUnit({ ...partialContext, node });
      case "view":
        return viewUnit({ ...partialContext, node });
    }
  }
}
