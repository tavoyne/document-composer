import type { AbsoluteBlock, Block } from "../types/blocks.js";
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

  const absoluteMap = new Map<string, [AbsoluteBlock, number][]>();
  const peeks: Block[] = [];

  let pageIndex = 0;
  let result = iterator.next();
  let y = paperMarginTop;

  while (!result.done || peeks.length) {
    const block = peeks.shift() || (result.value as Block);

    switch (block.type) {
      case "absolute": {
        let comingBlock: Block | undefined = peeks[0];

        if (!comingBlock) {
          comingBlock = iterator.next().value;
          if (comingBlock) {
            peeks.push(comingBlock);
          }
        }

        const blockY =
          y +
          (y === paperMarginTop
            ? 0
            : (comingBlock &&
                comingBlock.type === "relative" &&
                comingBlock.spacingTop) ||
              0);

        const absoluteDatas = absoluteMap.get(block.endBlockLabel);

        if (absoluteDatas) {
          absoluteDatas.push([block, blockY]);
        } else {
          absoluteMap.set(block.endBlockLabel, [[block, blockY]]);
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
            peekIndex = peeks.length > peekIndex + 1 ? peekIndex + 1 : null;
          } else {
            comingBlock = iterator.next().value;
            if (comingBlock) {
              peeks.push(comingBlock);
            }
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
              comingBlock.spacingTop +
              (minPresenceAhead && comingBlock.spacingBottom);
          }
        }

        if (y > paperMarginTop) {
          y += block.spacingTop;
        }

        if (groupHeight > bodyHeight) {
          throw new BlockTooTallError();
        } else if (groupHeight + y > footlessHeight) {
          for (const absoluteEntries of absoluteMap) {
            for (const absoluteData of absoluteEntries[1]) {
              yield {
                ...absoluteData[0].element,
                height: footlessHeight - absoluteData[1],
                pageIndex,
                y: absoluteData[1],
              };
              absoluteData[1] = paperMarginTop;
            }
          }
          pageIndex += 1;
          y = paperMarginTop;
        }

        if (block.element) {
          yield {
            ...block.element,
            height: block.height,
            pageIndex,
            y,
          };
        }

        const absoluteDatas = absoluteMap.get(block.label);

        if (absoluteDatas) {
          for (const absoluteData of absoluteDatas) {
            yield {
              ...absoluteData[0].element,
              height: y + block.height - absoluteData[1],
              pageIndex,
              y: absoluteData[1],
            };
          }
          absoluteMap.delete(block.label);
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
