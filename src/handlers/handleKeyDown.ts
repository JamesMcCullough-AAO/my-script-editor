import { create } from "lodash";
import { applySpanStyles, scriptSpacingTypes } from "../styling";
import {
  addLinkSpan,
  openSlashMenu,
} from "../utils/general/createLinkFromSelection";
import { updateCharacterNameStyling } from "../utils/updateCharacterNameStyling";
import { exportScript } from "../utils/scriptManagement/exportScript";
import { characterNote } from "../utils/general/types";

type handleKeyDownProps = {
  contentRef: React.RefObject<HTMLDivElement>;
  setSavedRange: React.Dispatch<React.SetStateAction<Range | undefined>>;
  onSelectOptionModalOpen: () => void;
  title: string;
  notes: string;
  characterNotes: characterNote[];
  scriptSpacing: scriptSpacingTypes;
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

const isInsideCharacterNameSpan = (range: Range) => {
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

const isInsideLinkSpan = (range: Range) => {
  let node = range.commonAncestorContainer;
  while (node != null && !(node instanceof HTMLDivElement)) {
    if (
      node instanceof HTMLElement &&
      (node.classList.contains("script-link") ||
        node.classList.contains("url-link"))
    ) {
      return true;
    }
    if (node.parentNode) node = node.parentNode;
  }
  return false;
};

export const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  {
    contentRef,
    setSavedRange,
    onSelectOptionModalOpen,
    title,
    notes,
    characterNotes,
    scriptSpacing,
  }: handleKeyDownProps
) => {
  const contentDiv = contentRef.current;
  if (!contentDiv) return;

  const selection = window.getSelection();
  if (!selection) return;

  const range = selection?.getRangeAt(0);

  // if inside a link span, don't allow typing, except backspace which deletes the span
  if (isInsideLinkSpan(range)) {
    // arrow keys are allowed
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown"
    )
      return;

    event.preventDefault();
    if (event.key === "Backspace") {
      const span = range?.commonAncestorContainer?.parentNode;
      if (span) {
        range?.setStartBefore(span); // Move cursor outside the span
        // remove the span
        const spanObj = span as HTMLSpanElement;
        spanObj.remove();
      }
    }
    return;
  }

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
    // s to save
    if (event.key === "s") {
      event.preventDefault();
      exportScript({
        title,
        contentRef,
        notes,
        characterNotes,
      });
    }
  }

  if (event.key === "[" || event.key === "Tab") {
    event.preventDefault();

    if (isInsideCharacterNameSpan(range)) return;

    const span = document.createElement("span");
    applySpanStyles({ span });
    range?.insertNode(span);
    range?.setStart(span, 0); // Place the cursor inside the span for typing the character name
  }

  if (
    (event.key === "]" || event.key === "(") &&
    isInsideCharacterNameSpan(range)
  ) {
    event.preventDefault();

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
  }

  if (event.key === "Enter" && isInsideCharacterNameSpan(range)) {
    event.preventDefault();

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
  }

  if (event.key === "Enter" && isInsideLinkSpan(range)) {
    event.preventDefault();

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

  if (event.key === "/") {
    event.preventDefault();
    openSlashMenu({ range, setSavedRange, onSelectOptionModalOpen });
  }

  if (
    selection?.anchorNode &&
    contentDiv !== selection?.anchorNode &&
    !contentDiv.contains(selection?.anchorNode)
  ) {
    setCursorAtEnd(contentDiv);
  }
};
