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
  const underway = new Map<string, { block: AbsoluteBlock; y: number }[]>();

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

        if (accHeight > bodyHeight) {
          throw new BlockTooTallError();
        }

        if (y > paperMarginTop) {
          y += block.spacingTop;
        }

        if (accHeight + y > footlessHeight) {
          for (const [, underwayItems] of underway) {
            for (const underwayItem of underwayItems) {
              yield {
                ...underwayItem.block.element,
                height: footlessHeight - underwayItem.y,
                pageIndex,
                y: underwayItem.y,
              };
              underwayItem.y = paperMarginTop;
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

        const underwayItems = underway.get(block.label);

        if (underwayItems) {
          for (const underwayItem of underwayItems) {
            yield {
              ...underwayItem.block.element,
              height: y + block.height - underwayItem.y,
              pageIndex,
              y: underwayItem.y,
            };
          }

          underway.delete(block.label);
        }

        const scheduledBlocks = scheduled.get(block.label);

        if (scheduledBlocks) {
          for (const scheduledBlock of scheduledBlocks) {
            const underwayItems = underway.get(scheduledBlock.endBlockLabel);
            if (underwayItems) {
              underwayItems.push({ block: scheduledBlock, y });
            } else {
              underway.set(scheduledBlock.endBlockLabel, [
                { block: scheduledBlock, y },
              ]);
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
