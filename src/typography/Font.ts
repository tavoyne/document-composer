import type { Font as FontkitFont } from "@pdf-lib/fontkit";
import fontkit from "@pdf-lib/fontkit";

import type { FontLocator, FontSource } from "../types/template.d.js";
import type { Font as IFont } from "../types/typography.d.js";

export default class Font implements IFont {
  readonly #fontkitFont: FontkitFont;
  readonly binary: Uint8Array;
  readonly locator: FontLocator;

  constructor(binary: Uint8Array, source: FontSource) {
    this.#fontkitFont = fontkit.create(binary);
    this.binary = binary;
    this.locator = {
      fontFamily: source.fontFamily,
      fontStyle: source.fontStyle,
      fontWeight: source.fontWeight,
    };
  }

  static async create(source: FontSource): Promise<Font> {
    const response = await fetch(source.url);
    const binary = new Uint8Array(await response.arrayBuffer());
    if (
      typeof window !== "undefined" &&
      !Array.from(window.document.fonts).find((fontFace) => {
        return (
          source.fontFamily === fontFace.family &&
          source.fontStyle === fontFace.style &&
          source.fontWeight === parseInt(fontFace.weight, 10)
        );
      })
    ) {
      const fontFace = new FontFace(source.fontFamily, binary, {
        style: source.fontStyle,
        weight: source.fontWeight.toString(),
      });
      window.document.fonts.add(fontFace);
    }
    return new Font(binary, source);
  }

  getBaselineShiftAtSize(size: number): number {
    const scale = size / this.#fontkitFont.unitsPerEm;
    const { ascent, lineGap } = this.#fontkitFont;
    return (ascent + lineGap / 2) * scale;
  }

  getLineHeightAtSize(size: number): number {
    const scale = size / this.#fontkitFont.unitsPerEm;
    const { ascent, descent, lineGap } = this.#fontkitFont;
    return (ascent + Math.abs(descent) + lineGap) * scale;
  }

  getTextWidthAtSize(text: string, size: number): number {
    const advanceWidth = this.#fontkitFont
      .glyphsForString(text)
      .reduce((acc, glyph) => {
        return acc + glyph.advanceWidth;
      }, 0);
    const scale = size / this.#fontkitFont.unitsPerEm;
    return advanceWidth * scale;
  }
}
