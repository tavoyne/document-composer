import type { Font } from "./typography.d.js";

export type PlacedElement = Element & Placement;

export interface Placement {
  readonly height: number;
  readonly pageIndex: number;
  readonly y: number;
}

export interface RectangleElement {
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
