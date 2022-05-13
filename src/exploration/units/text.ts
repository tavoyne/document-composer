import type { RelativeBlock } from "../../types/blocks.d.js";
import type { TextNode } from "../../types/template.d.js";
import getLines from "../../utils/getLines.js";
import type { UnitContext, UnitReturnType } from "../types.d.js";

export default function* textUnit({
  fontRegistry,
  id,
  maxWidth,
  node,
  x,
}: UnitContext<TextNode>): UnitReturnType {
  const font = fontRegistry.getFont(node);
  const lineHeight = font.getLineHeightAtSize(node.fontSize);

  function getTextWidth(text: string) {
    return font.getTextWidthAtSize(text, node.fontSize);
  }

  let block: RelativeBlock | undefined;
  let lineId = 0;

  for (const line of getLines(getTextWidth, maxWidth, node.text)) {
    if (block) {
      yield { ...block };
    }
    block = {
      element: {
        color: node.color,
        font,
        fontSize: node.fontSize,
        text: line.text,
        type: "text",
        x,
      },
      height: lineHeight,
      label: `${id}_${node.type.toUpperCase()}_L${lineId}`,
      minPresenceAhead: 0,
      spacingBottom: 0,
      spacingTop: 0,
      type: "relative",
    };
    lineId += 1;
  }

  if (block) {
    yield {
      ...block,
      minPresenceAhead: 1 + node.minPresenceAhead,
    };
  }
}
