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
  const bodyHeight = paperHeight - paperMarginBottom - paperMarginTop;
  const footlessHeight = paperHeight - paperMarginBottom;

  const peeks: Block[] = [];
  const absoluteMap = new Map<string, [Block, number][]>();

  let pageIndex = 0;
  let result = iterator.next();
  let y = paperMarginTop;

  while (!result.done || peeks.length) {
    const block = peeks.shift() || (result.value as Block);
    switch (block.type) {
      case "absolute": {
        const array = absoluteMap.get(block.endBlockLabel);
        if (array) {
          array.push([block, y]);
        } else {
          absoluteMap.set(block.endBlockLabel, [[block, y]]);
        }
        break;
      }
      case "relative": {
        let { minPresenceAhead } = block;
        let groupHeight =
          block.height + (minPresenceAhead && block.spacingBottom);
        let peekIndex = peeks.length ? 0 : null;

        while (minPresenceAhead) {
          let comingBlock: Block | undefined;

          if (typeof peekIndex === "number") {
            comingBlock = peeks[peekIndex];
            peekIndex = peeks.length - 1 - peekIndex || null;
          } else {
            const { value } = iterator.next();
            comingBlock = value && peeks.push(value);
          }

          if (!comingBlock) {
            minPresenceAhead = 0;
          } else if (comingBlock.type === "relative") {
            minPresenceAhead = Math.max(
              minPresenceAhead - 1,
              comingBlock.minPresenceAhead
            );
            groupHeight +=
              comingBlock.height +
              block.spacingTop +
              (minPresenceAhead && block.spacingBottom);
          }
        }

        if (y !== paperMarginTop) {
          y += block.spacingTop;
        }

        if (groupHeight > bodyHeight) {
          throw new BlockTooTallError();
        } else if (groupHeight + y > footlessHeight) {
          // THIS IS PAGE BREAK
          // PRINT ALL ABSOLUTES BEFORE COMING BLOCK
          // UNLESS THEY HAVE LOOKAHEAD... HOW DO WE DO? STORE THEM IN A PENDING ARRAY.
          // KEEP TRACK OF THE LOOKAHEAD AMOUNT.
          // KEEP LOOPING TILL LOOKAHEAD IS NOT REACHED.
          // ONCE IT IS, EMPTY PENDING ARRAY.
          pageIndex += 1;
          y = paperMarginTop;
        }
        // WAS THIS THE ENDING BLOCK OF SOME ABSOLUTE(S) ?
        // PRINT IT (THEM) HERE!
        // HEIGHT_AHEAD WILL BE 0;
        // SHOULD RETREIVE THE HEIGHT_BEHIND SOMEHOW.
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
