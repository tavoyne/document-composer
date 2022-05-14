import type { Element } from "./elements.d.js";

export interface AbsoluteBlock {
  readonly element: Element;
  readonly endBlockLabel: string;
  readonly label: string;
  readonly type: "absolute";
}

export interface RelativeBlock {
  readonly element?: Element;
  readonly height: number;
  readonly label: string;
  readonly minPresenceAhead: number;
  readonly spacingBottom: number;
  readonly spacingTop: number;
  readonly type: "relative";
}

export type Block = AbsoluteBlock | RelativeBlock;
