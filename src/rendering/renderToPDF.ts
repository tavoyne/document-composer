import fontkit from "@pdf-lib/fontkit";
import type { PDFFont } from "pdf-lib";

import type { PlacedElement } from "../types/elements.d.js";
import type { Font, FontRegistry } from "../types/typography.d.js";

export default async function renderToPDF({
  fontRegistry,
  pages,
  paperHeight,
  paperWidth,
}: {
  fontRegistry: FontRegistry;
  pages: PlacedElement[][];
  paperHeight: number;
  paperWidth: number;
}): Promise<Uint8Array> {
  const { PDFDocument, rgb } = await import("pdf-lib");

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const pdfFontMap = new Map<Font, PDFFont>();

  for (const font of fontRegistry.list) {
    const pdfFont = await pdfDoc.embedFont(font.binary);
    pdfFontMap.set(font, pdfFont);
  }

  for (const page of pages) {
    const pdfPage = pdfDoc.addPage([paperWidth, paperHeight]);

    for (const element of page.reverse()) {
      switch (element.type) {
        case "rectangle": {
          pdfPage.drawRectangle({
            color: rgb(
              element.color[0] / 255,
              element.color[1] / 255,
              element.color[2] / 255
            ),
            height: element.height,
            opacity: element.color[3],
            width: element.width,
            x: element.x,
            y: paperHeight - element.height - element.y,
          });
          break;
        }

        case "text": {
          pdfPage.drawText(element.text, {
            color: rgb(
              element.color[0] / 255,
              element.color[1] / 255,
              element.color[2] / 255
            ),
            font: pdfFontMap.get(element.font),
            opacity: element.color[3],
            size: element.fontSize,
            x: element.x,
            y:
              paperHeight -
              element.y -
              element.font.getBaselineShiftAtSize(element.fontSize),
          });
          break;
        }
      }
    }
  }

  return pdfDoc.save();
}
