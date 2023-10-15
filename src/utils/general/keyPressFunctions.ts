import { applySpanStyles, scriptSpacingTypes } from "../../styling";
import { updateCharacterNameStyling } from "../updateCharacterNameStyling";

export const setCursorAtEnd = (contentEditableElement: HTMLElement) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(contentEditableElement);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
};
export const isCursorAtStartOfRange = (range: Range) => range.startOffset === 0;

export const isInsideCharacterNameSpan = (range: Range | undefined) => {
  if (!range) return false;

  let node = range.commonAncestorContainer;
  while (node != null && !(node instanceof HTMLDivElement)) {
    if (
      node instanceof HTMLElement &&
      node.classList.contains("character-name")
    ) {
      return true;
    }
    if (node.parentNode) node = node.parentNode;
  }
  return false;
};

export const isInsideLinkSpan = (range: Range) => {
  let node = range.commonAncestorContainer;
  while (node != null && !(node instanceof HTMLDivElement)) {
    if (
      node instanceof HTMLElement &&
      (node.classList.contains("script-link") ||
        node.classList.contains("url-link") ||
        node.classList.contains("info-note"))
    ) {
      return true;
    }
    if (node.parentNode) node = node.parentNode;
  }
  return false;
};

export const beginCharacterName = (range: Range) => {
  if (isInsideCharacterNameSpan(range)) return;

  const span = document.createElement("span");
  applySpanStyles({ span });
  range?.insertNode(span);
  range?.setStart(span, 0);
};

export const endCharacterNameBracket = ({
  range,
  contentRef,
  scriptSpacing,
}: {
  range: Range;
  contentRef: React.RefObject<HTMLDivElement>;
  scriptSpacing: scriptSpacingTypes;
}) => {
  if (!isInsideCharacterNameSpan(range)) return;

  const span = range?.commonAncestorContainer?.parentNode;
  if (span && span.nextSibling) {
    range?.setStartBefore(span.nextSibling); // Move cursor outside the span
  } else if (span && span.parentNode) {
    range?.setStartAfter(span); // If no next sibling exists, place cursor at the end
  }
  // add a space and open brack after the span
  const spaceNode = document.createTextNode(" (");
  range?.insertNode(spaceNode);
  range?.setStartAfter(spaceNode);

  updateCharacterNameStyling({ contentRef, scriptSpacing });
};

export const endCharacterNameEnter = ({
  range,
  contentRef,
  scriptSpacing,
}: {
  range: Range;
  contentRef: React.RefObject<HTMLDivElement>;
  scriptSpacing: scriptSpacingTypes;
}) => {
  if (!isInsideCharacterNameSpan(range)) return;

  const contentDiv = contentRef.current;
  if (!contentDiv) return;

  const span = range?.commonAncestorContainer?.parentNode;
  if (span && span.nextSibling) {
    range?.setStartBefore(span.nextSibling); // Move cursor outside the span
  } else if (span && span.parentNode) {
    range?.setStartAfter(span); // If no next sibling exists, place cursor at the end
  }

  // Check the document is the contentDiv or a child of it
  if (
    contentDiv === range?.commonAncestorContainer ||
    contentDiv.contains(range?.commonAncestorContainer)
  ) {
    // add a space and open brack after the span
    const linebreakNode = document.createElement("br");
    range?.insertNode(linebreakNode);
    range?.setStartAfter(linebreakNode);
  }

  updateCharacterNameStyling({ contentRef, scriptSpacing });
};
