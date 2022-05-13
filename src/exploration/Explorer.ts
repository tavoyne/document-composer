import type { Block } from "../types/blocks.d.js";
import type { FontRegistry } from "../types/font.d.js";
import type { Node } from "../types/nodes.d.js";
import textUnit from "./units/text.js";
import viewUnit from "./units/view.js";

interface ExploreContext {
  maxWidth: number;
  node: Node;
  x: number;
}

export interface UnitContext<T extends Node = Node> {
  explore: (context: ExploreContext) => UnitReturnType;
  fontRegistry: FontRegistry;
  id: number;
  maxWidth: number;
  node: T;
  x: number;
}

export type UnitReturnType = IterableIterator<Block>;

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
    if (node.type === "view") {
      return viewUnit({ node, ...partialContext });
    } else {
      return textUnit({ node, ...partialContext });
    }
  }
}
