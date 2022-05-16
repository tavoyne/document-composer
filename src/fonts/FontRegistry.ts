import type { FontRegistry as IFontRegistry } from "../types/fontRegistry.js";
import type { FontLocator, FontSource } from "../types/template.js";
import Font from "./Font.js";

export default class FontRegistry implements IFontRegistry {
  readonly list: readonly Font[];

  constructor(fonts: readonly Font[]) {
    this.list = fonts;
  }

  static async create(sources: readonly FontSource[]): Promise<FontRegistry> {
    return new FontRegistry(
      (await Promise.all(
        sources.map((source) => {
          return Font.create(source);
        })
      )) as readonly Font[]
    );
  }

  getFont(query: FontLocator): Font {
    const font = this.list.find((font) => {
      return (
        font.locator.fontFamily === query.fontFamily &&
        font.locator.fontStyle === query.fontStyle &&
        font.locator.fontWeight === query.fontWeight
      );
    });
    if (!font) throw new FontNotRegisteredError(query);
    return font;
  }
}

class FontNotRegisteredError extends Error {
  constructor(locator: FontLocator) {
    super(
      [
        `Font of family \`${locator.fontFamily}\`, weight \``,
        `${locator.fontWeight}\` and style \`${locator.fontStyle}\` wasn't reg`,
        "istered.",
      ].join("")
    );
  }
}
