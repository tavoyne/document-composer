export interface Font {
  getBaselineShiftAtSize(size: number): number;
  getLineHeightAtSize(size: number): number;
  getTextWidthAtSize(text: string, size: number): number;
}
