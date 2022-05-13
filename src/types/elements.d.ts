import type { Font } from "./font.d.js";

export interface RectangleElement {
  readonly borderBottomLeftRadius: number;
  readonly borderBottomRightRadius: number;
  readonly borderTopLeftRadius: number;
  readonly borderTopRightRadius: number;
  readonly color: [number, number, number, number];
  readonly type: "rectangle";
  readonly width: number;
  readonly x: number;
}

export interface TextElement {
  readonly color: [number, number, number, number];
  readonly font: Font;
  readonly fontSize: number;
  readonly text: string;
  readonly type: "text";
  readonly x: number;
}

export type Element = RectangleElement | TextElement;
