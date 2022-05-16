type Line = {
  text: string;
  width: number;
};

export default function* getLines(
  getTextWidth: (text: string) => number,
  maxWidth: number,
  text: string
): IterableIterator<Line> {
  const currentLine: Line = { text: "", width: 0 };
  const spaceWidth = getTextWidth(" ");

  for (const match of text.matchAll(/\S+/g)) {
    const word = match[0];
    const wordWidth = getTextWidth(word);

    if (currentLine.text) {
      if (currentLine.width + spaceWidth + wordWidth > maxWidth) {
        yield { ...currentLine };
        currentLine.text = word;
        currentLine.width = wordWidth;
      } else {
        currentLine.text += ` ${word}`;
        currentLine.width += spaceWidth + wordWidth;
      }
    } else {
      if (wordWidth > maxWidth) {
        yield { text: word, width: wordWidth };
      } else {
        currentLine.text = word;
        currentLine.width = wordWidth;
      }
    }
  }

  if (currentLine.text) {
    yield { ...currentLine };
    currentLine.text = "";
    currentLine.width = 0;
  }
}
