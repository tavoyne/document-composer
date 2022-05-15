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

  const peeks: Block[] = [];
  const scheduled = new Map<string, AbsoluteBlock[]>();
  const underway = new Map<string, [AbsoluteBlock, number][]>();

  let block: Block | null;
  let pageIndex: number;
  let y: number;

  block = iterator.next().value || null;
  pageIndex = 0;
  y = paperMarginTop;

  while (block) {
    switch (block.type) {
      case "absolute": {
        const blocks = scheduled.get(block.startBlockLabel);

        if (blocks) {
          blocks.push(block);
        } else {
          scheduled.set(block.startBlockLabel, [block]);
        }

        break;
      }

      case "relative": {
        let accHeight: number;
        let leftToBeProcess: number;
        let peekIndex: number;

        accHeight = block.height;
        accHeight += block.minPresenceAhead && block.spacingBottom;
        leftToBeProcess = block.minPresenceAhead;
        peekIndex = 0;

        while (leftToBeProcess) {
          let nextBlock: Block;

          if (peeks[peekIndex]) {
            nextBlock = peeks[peekIndex];
            peekIndex += 1;
          } else {
            peekIndex = -1;
            const result = iterator.next();
            if (result.done) {
              break;
            } else {
              nextBlock = result.value;
              peeks.push(nextBlock);
            }
          }

          if (nextBlock.type === "relative") {
            leftToBeProcess = Math.max(
              leftToBeProcess - 1,
              nextBlock.minPresenceAhead
            );
            accHeight += nextBlock.height;
            accHeight += nextBlock.spacingTop;
            accHeight += leftToBeProcess && nextBlock.spacingBottom;
          }
        }

        if (y > paperMarginTop) {
          y += block.spacingTop;
        }

        if (accHeight > bodyHeight) {
          throw new BlockTooTallError();
        } else if (accHeight + y > footlessHeight) {
          for (const endAbsoluteEntries of underway) {
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

        const endAbsoluteDatas = underway.get(block.label);
        if (endAbsoluteDatas) {
          for (const endAbsoluteData of endAbsoluteDatas) {
            yield {
              ...endAbsoluteData[0].element,
              height: y + block.height - endAbsoluteData[1],
              pageIndex,
              y: endAbsoluteData[1],
            };
          }
          underway.delete(block.label);
        }

        const blocks = scheduled.get(block.label);
        if (blocks) {
          for (const block of blocks) {
            const endAbsoluteDatas = underway.get(block.endBlockLabel);
            if (endAbsoluteDatas) {
              endAbsoluteDatas.push([block, y]);
            } else {
              underway.set(block.endBlockLabel, [[block, y]]);
            }
          }
          scheduled.delete(block.label);
        }

        y += block.height + block.spacingBottom;

        break;
      }
    }

    block = peeks.shift() || iterator.next().value || null;
  }
}
