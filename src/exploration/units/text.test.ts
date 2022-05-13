import { FontRegistry } from "../../types/font.d.js";

const fontRegistry: FontRegistry = {
  list: [
    {
      getLineHeightAtSize(size: number) {
        return size;
      },
      getTextWidthAtSize(text: string, size: number) {
        return (text.length * size) / 16;
      },
      getBaselineShiftAtSize() {
        return 0;
      },
    },
  ],
  getFont() {
    return this.list[0];
  },
};
