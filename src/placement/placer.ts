import type { Block } from "../types/blocks.js";
import type { Element } from "../types/elements.js";
import type { Placement } from "../types/placement.js";

import { BlockTooTallError } from "./errors.js";

export default function* placer({
  iterator,
  paperHeight,
  paperMarginBottom,
  paperMarginTop,
}: {
  iterator: IterableIterator<Block>;
  paperHeight: number;
  paperMarginBottom: number;
  paperMarginTop: number;
}): IterableIterator<Element & Placement> {
  const peeks: Block[] = [];
  const absolute = new Map<string, [Block, number][]>();

  let pageIndex = 0;
  let result = iterator.next();
  let y = paperMarginTop;

  while (!result.done || peeks.length) {
    const block = peeks.shift() || (result.value as Block);
    switch (block.type) {
      case "absolute": {
        const array = absolute.get(block.endBlockLabel);
        if (array) {
          array.push([block, y]);
        } else {
          absolute.set(block.endBlockLabel, [[block, y]]);
        }
        break;
      }
      case "relative": {
        let groupHeight =
          block.height + (block.minPresenceAhead && block.spacingBottom);
        let lookUpIndex = 0;
        let minPresenceAhead = block.minPresenceAhead;

        while (minPresenceAhead) {
          let comingBlock: Block | undefined = peeks[lookUpIndex];
          lookUpIndex += 1;
          if (!comingBlock) {
            comingBlock = iterator.next().value;
            if (comingBlock) {
              peeks.push(comingBlock);
            }
          }
          if (comingBlock) {
            if (comingBlock.type === "relative") {
              minPresenceAhead = Math.max(
                minPresenceAhead - 1,
                block.minPresenceAhead
              );
              groupHeight +=
                comingBlock.height +
                block.spacingTop +
                (minPresenceAhead && block.spacingBottom);
            }
          } else {
            minPresenceAhead = 0;
          }
        }
        if (groupHeight > paperHeight - paperMarginBottom - paperMarginTop) {
          throw new BlockTooTallError();
        } else if (
          groupHeight + block.spacingTop + y >
          paperHeight - paperMarginBottom
        ) {
          pageIndex += 1;
          y = paperMarginTop;
        } else {
          y += block.spacingTop;
        }
        if (block.element) {
          yield {
            ...block.element,
            height: block.height,
            heightAhead: 0,
            heightBehind: 0,
            pageIndex,
            y,
          };
        }
        y += block.height + block.spacingBottom;
        break;
      }
    }

    if (!peeks.length) {
      result = iterator.next();
    }
  }
}
