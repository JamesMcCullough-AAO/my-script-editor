import { applySpanStyles } from "../styling";

type handleKeyDownProps = {
  contentRef: React.RefObject<HTMLDivElement>;
  isCharacterName: boolean;
  setIsCharacterName: React.Dispatch<React.SetStateAction<boolean>>;
  isLineDescription: boolean;
  setIsLineDescription: React.Dispatch<React.SetStateAction<boolean>>;
};
const setCursorAtEnd = (contentEditableElement: HTMLElement) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(contentEditableElement);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
};
const isCursorAtStart = (range: Range) => range.startOffset === 0;

export const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  {
    contentRef,
    isCharacterName,
    setIsCharacterName,
    isLineDescription,
    setIsLineDescription,
  }: handleKeyDownProps
) => {
  const contentDiv = contentRef.current;
  if (!contentDiv) return;

  const selection = window.getSelection();
  if (!selection) return;

  const range = selection?.getRangeAt(0);

  // Handling backspace at the beginning of a span
  if (event.key === "Backspace") {
    const parent = range.commonAncestorContainer.parentNode;
    if (
      parent &&
      parent instanceof HTMLElement &&
      parent.nodeName === "SPAN" &&
      isCursorAtStart(range)
    ) {
      const previousSibling = parent.previousSibling;
      parent.remove();
      if (previousSibling) {
        range.setStartAfter(previousSibling);
      } else {
        // Set cursor at the beginning of the contentDiv.
        range.setStart(contentDiv, 0);
      }
      range.collapse(true);
      event.preventDefault();
    }
  }

  if (event.metaKey || event.ctrlKey) {
    if (event.key === "b") {
      document.execCommand("bold");
      event.preventDefault();
    }
    if (event.key === "i") {
      document.execCommand("italic");
      event.preventDefault();
    }
    if (event.key === "u") {
      document.execCommand("underline");
      event.preventDefault();
    }
  }

  if (event.key === "[" || event.key === "Tab") {
    event.preventDefault();

    if (isCharacterName) return;

    setIsCharacterName(true);

    const span = document.createElement("span");
    applySpanStyles(span);
    range?.insertNode(span);
    range?.setStart(span, 0); // Place the cursor inside the span for typing the character name
  }

  if (event.key === "]" && isCharacterName) {
    event.preventDefault();

    setIsCharacterName(false);
    setIsLineDescription(true);

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
  }

  if (event.key === "Enter" && isCharacterName) {
    event.preventDefault();

    setIsCharacterName(false);
    setIsLineDescription(false);

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
  }

  if (event.key === ")" && isLineDescription) {
    event.preventDefault();

    setIsLineDescription(false);
    // Move the cursor after the closing bracket
    const spaceNode = document.createTextNode(")");
    range?.insertNode(spaceNode);
    range?.setStartAfter(spaceNode);
    const linebreakNode = document.createElement("br");
    range?.insertNode(linebreakNode);
    range?.setStartAfter(linebreakNode);
  }

  if (
    selection?.anchorNode &&
    contentDiv !== selection?.anchorNode &&
    !contentDiv.contains(selection?.anchorNode)
  ) {
    setCursorAtEnd(contentDiv);
  }
};
