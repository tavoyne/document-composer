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

  const endAbsoluteMap = new Map<string, [AbsoluteBlock, number][]>();
  const peeks: Block[] = [];
  const startAbsoluteMap = new Map<string, AbsoluteBlock[]>();

  let pageIndex = 0;
  let result = iterator.next();
  let y = paperMarginTop;

  while (!result.done || peeks.length) {
    const block = peeks.shift() || (result.value as Block);

    switch (block.type) {
      case "absolute": {
        const blocks = startAbsoluteMap.get(block.startBlockLabel);

        if (blocks) {
          blocks.push(block);
        } else {
          startAbsoluteMap.set(block.startBlockLabel, [block]);
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
          for (const endAbsoluteEntries of endAbsoluteMap) {
            for (const endAbsoluteData of endAbsoluteEntries[1]) {
              yield {
                ...endAbsoluteData[0].element,
                height: footlessHeight - endAbsoluteData[1],
                pageIndex,
                y: endAbsoluteData[1],
              };
              endAbsoluteData[1] = paperMarginTop;
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

        const endAbsoluteDatas = endAbsoluteMap.get(block.label);
        if (endAbsoluteDatas) {
          for (const endAbsoluteData of endAbsoluteDatas) {
            yield {
              ...endAbsoluteData[0].element,
              height: y + block.height - endAbsoluteData[1],
              pageIndex,
              y: endAbsoluteData[1],
            };
          }
          endAbsoluteMap.delete(block.label);
        }

        const blocks = startAbsoluteMap.get(block.label);
        if (blocks) {
          for (const block of blocks) {
            const endAbsoluteDatas = endAbsoluteMap.get(block.endBlockLabel);
            if (endAbsoluteDatas) {
              endAbsoluteDatas.push([block, y]);
            } else {
              endAbsoluteMap.set(block.endBlockLabel, [[block, y]]);
            }
          }
          startAbsoluteMap.delete(block.label);
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
