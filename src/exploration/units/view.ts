import type { ViewNode } from "../../types/nodes.d.js";
import type { UnitContext, UnitReturnType } from "../types.d.js";

export default function* viewUnit({
  explore,
  id,
  maxWidth,
  node,
  x,
}: UnitContext<ViewNode>): UnitReturnType {
  if (node.backgroundColor[3]) {
    yield {
      element: {
        borderBottomLeftRadius: node.borderBottomLeftRadius,
        borderBottomRightRadius: node.borderBottomRightRadius,
        borderTopLeftRadius: node.borderTopLeftRadius,
        borderTopRightRadius: node.borderTopRightRadius,
        color: node.backgroundColor,
        type: "rectangle",
        width: maxWidth - node.marginLeft - node.marginRight,
        x: x + node.marginLeft,
      },
      endBlockLabel: `${id}_${node.type.toUpperCase()}_SB`,
      label: `${id}_${node.type.toUpperCase()}_BG`,
      lookAhead: Math.max(
        node.borderBottomLeftRadius,
        node.borderBottomRightRadius
      ),
      type: "absolute",
    };
  }
  if (node.marginTop || node.paddingTop) {
    yield {
      height: node.paddingTop,
      label: `${id}_${node.type.toUpperCase()}_ST`,
      minPresenceAhead: 1,
      spacingBottom: 0,
      spacingTop: node.marginTop,
      type: "relative",
    };
  }
  for (const childNode of node.children) {
    for (const block of explore({
      maxWidth:
        maxWidth -
        node.marginLeft -
        node.marginRight -
        node.paddingLeft -
        node.paddingRight,
      node: childNode,
      x: x + node.marginLeft + node.paddingLeft,
    })) {
      yield block;
    }
  }
  if (node.backgroundColor[3] || node.marginBottom || node.paddingBottom) {
    yield {
      height: node.paddingBottom,
      label: `${id}_${node.type.toUpperCase()}_SB`,
      minPresenceAhead: 1 + node.minPresenceAhead,
      spacingBottom: node.marginBottom,
      spacingTop: 0,
      type: "relative",
    };
  }
}
