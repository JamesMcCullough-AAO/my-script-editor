import { create } from "lodash";
import { applySpanStyles, scriptSpacingTypes } from "../styling";
import {
  addLinkSpan,
  openSlashMenu,
} from "../utils/general/createLinkFromSelection";
import { updateCharacterNameStyling } from "../utils/updateCharacterNameStyling";
import { exportScript } from "../utils/scriptManagement/exportScript";
import { characterNote } from "../utils/general/types";
import {
  beginCharacterName,
  endCharacterNameBracket,
  endCharacterNameEnter,
  isCursorAtStartOfRange,
  isInsideCharacterNameSpan,
  isInsideLinkSpan,
  setCursorAtEnd,
} from "../utils/general/keyPressFunctions";

type handleKeyDownProps = {
  contentRef: React.RefObject<HTMLDivElement>;
  setSavedRange: React.Dispatch<React.SetStateAction<Range | undefined>>;
  onSelectOptionModalOpen: () => void;
  title: string;
  notes: string;
  characterNotes: characterNote[];
  scriptSpacing: scriptSpacingTypes;
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
      isCursorAtStartOfRange(range)
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

    beginCharacterName({ range, scriptSpacing });
  }

  if (
    (event.key === "]" || event.key === "(") &&
    isInsideCharacterNameSpan(range)
  ) {
    event.preventDefault();

    endCharacterNameBracket({ range, contentRef, scriptSpacing });
  }

  if (event.key === "Enter" && isInsideCharacterNameSpan(range)) {
    event.preventDefault();

    endCharacterNameEnter({ range, contentRef, scriptSpacing });
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
