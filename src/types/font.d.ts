export interface Font {
  readonly binary: Uint8Array;
  getBaselineShiftAtSize(size: number): number;
  getLineHeightAtSize(size: number): number;
  getTextWidthAtSize(text: string, size: number): number;
}
