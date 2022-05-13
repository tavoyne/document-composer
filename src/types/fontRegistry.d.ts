import type { Font } from "./font.d.js";
import type { FontLocator } from "./template.d.js";

export interface FontRegistry {
  getFont(query: FontLocator): Font;
  readonly list: readonly Font[];
}
