import type { FontLocator } from "./template.d.js";

export interface Font {
  readonly binary: Uint8Array;
  getBaselineShiftAtSize(size: number): number;
  getLineHeightAtSize(size: number): number;
  getTextWidthAtSize(text: string, size: number): number;
}

export interface FontRegistry {
  readonly list: readonly Font[];
  getFont(query: FontLocator): Font;
}
