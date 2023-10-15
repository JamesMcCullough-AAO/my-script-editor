import { applyInfoNoteSpanStyles } from "../../styling";

export const createInfoNoteSpan = (range: Range) => {
  const infoSpan = document.createElement("span");
  range.deleteContents();
  range.insertNode(infoSpan);
  range.setStartAfter(infoSpan);
  applyInfoNoteSpanStyles(infoSpan);
};
