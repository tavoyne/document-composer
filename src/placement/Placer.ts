import type { Block } from "../types/blocks.js";
import type { Element } from "../types/elements.js";
import type { Placement } from "../types/placement.js";

export default function* placer(
  iterator: IterableIterator<Block>
): IterableIterator<Element & Placement> {
  const lookUps: Block[] = [];
  const marginBottom = 50;
  const marginTop = 50;
  const pageHeight = 400;
  const paperHeight = 500;

  let result = iterator.next();

  let pageIndex = 0;
  let y = marginTop;

  while (!result.done || lookUps.length) {
    const block = (lookUps.shift() || result.value!) as Block;

    switch (block.type) {
      case "absolute": {
        break;
      }
      case "relative": {
        let groupHeight =
          block.height + (block.minPresenceAhead && block.spacingBottom);
        let lookUpIndex = 0;
        let minPresenceAhead = block.minPresenceAhead;

        while (minPresenceAhead) {
          let comingBlock: Block | undefined = lookUps[lookUpIndex];
          lookUpIndex += 1;
          if (!comingBlock) {
            comingBlock = iterator.next().value;
            if (comingBlock) {
              if (!lookUps.includes(comingBlock)) {
                lookUps.push(comingBlock);
              }
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

        if (groupHeight > pageHeight) {
          throw new BlockTooTallError();
        } else if (
          groupHeight + block.spacingTop + y >
          paperHeight - marginBottom
        ) {
          pageIndex += 1;
          y = marginTop;
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

    if (!lookUps.length) {
      result = iterator.next();
    }
  }
}

class BlockTooTallError extends Error {
  constructor() {
    super("Block cannot be placed because it's too tall.");
  }
}
