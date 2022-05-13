import type { Block } from "../types/blocks.d.js";
import type { Element } from "../types/elements.d.js";
import type { Template } from "../types/template.d.js";

export default function* placer(
  blocks: Block,
  template: Template
): IterableIterator<Element> {}
