export interface Font {
  getBaselineShiftAtSize(size: number): number;
  getLineHeightAtSize(size: number): number;
  getTextWidthAtSize(text: string, size: number): number;
}

export interface FontLocator {
  readonly fontFamily: string;
  readonly fontStyle: "normal" | "italic";
  readonly fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

export interface FontRegistry {
  getFont(query: FontLocator): Font;
}

export interface FontSource extends FontLocator {
  url: string;
}
