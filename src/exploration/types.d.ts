import type { Block } from "../types/blocks.js";
import type { FontRegistry } from "../types/font.js";
import type { Node } from "../types/nodes.js";

export interface ExploreContext {
  maxWidth: number;
  node: Node;
  x: number;
}

export interface UnitContext<T extends Node> {
  explore: (context: ExploreContext) => UnitReturnType;
  fontRegistry: FontRegistry;
  id: number;
  maxWidth: number;
  node: T;
  x: number;
}

export type UnitReturnType = IterableIterator<Block>;
