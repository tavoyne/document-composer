import type { Block } from "../types/blocks.d.js";
import type { FontRegistry } from "../types/fontRegistry.d.js";
import type { Node } from "../types/template.d.js";

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
