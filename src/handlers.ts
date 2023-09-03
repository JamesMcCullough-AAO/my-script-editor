import { useEffect } from "react";
import {
  convertHtmlToPrompt,
  convertTextToHtml,
  generateText,
} from "./apiCall";
import { applySpanStyles } from "./styling";
import { getAllSavedScripts, loadScript, searchSavedTitles } from "./utils";

type handleGenerateTextProps = {
  contentRef: React.RefObject<HTMLDivElement>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
};

export const handleGenerateText = async ({
  contentRef,
  setIsGenerating,
}: handleGenerateTextProps) => {
  setIsGenerating(true);
  const prompt = convertHtmlToPrompt({ contentRef });
  console.log("Prompt: " + prompt);
  const generatedText = await generateText({ inputPrompt: prompt });
  console.log("Generated Text: " + generatedText);
  const html = convertTextToHtml({ generatedText });
  console.log("HTML: " + html);

  const contentDiv = contentRef.current;
  if (contentDiv) {
    contentDiv.innerHTML += html;
  }
  setIsGenerating(false);
};

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

type handleOpenMenuInput = {
  title: string;
  setSavedScriptTitles: React.Dispatch<
    React.SetStateAction<
      {
        title: string;
        timestamp: number;
      }[]
    >
  >;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onMenuOpen: () => void;
};

export const handleOpenMenu = ({
  title,
  setSavedScriptTitles,
  setSearchTerm,
  onMenuOpen,
}: handleOpenMenuInput) => {
  const savedScriptTitles = searchSavedTitles({
    title,
    searchTerm: "",
  });
  setSavedScriptTitles(savedScriptTitles);
  setSearchTerm("");
  onMenuOpen();
};

type handleSelectScriptInput = {
  title: string;
  loadTitle: string;
  onMenuClose: () => void;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};
export const handleSelectScript = ({
  title,
  loadTitle,
  onMenuClose,
  contentRef,
  setTitle,
}: handleSelectScriptInput) => {
  loadScript({ loadTitle, title, contentRef, setTitle });
  onMenuClose();
};

type handleOpenRenameModalInput = {
  scriptTitle: string;
  setOldScriptTitle: React.Dispatch<React.SetStateAction<string>>;
  setNewScriptTitle: React.Dispatch<React.SetStateAction<string>>;
  onMenuClose: () => void;
  onRenameModalOpen: () => void;
};

export const handleOpenRenameModal = ({
  scriptTitle,
  setOldScriptTitle,
  setNewScriptTitle,
  onMenuClose,
  onRenameModalOpen,
}: handleOpenRenameModalInput) => {
  if (!scriptTitle) return;
  setOldScriptTitle(scriptTitle);
  setNewScriptTitle(scriptTitle);
  onMenuClose();
  onRenameModalOpen();
};

type handleRenameScriptInput = {
  newScriptTitle: string;
  oldScriptTitle: string;
  setOldScriptTitle: React.Dispatch<React.SetStateAction<string>>;
  setNewScriptTitle: React.Dispatch<React.SetStateAction<string>>;
  onRenameModalClose: () => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const handleRenameScript = ({
  newScriptTitle,
  oldScriptTitle,
  setOldScriptTitle,
  setNewScriptTitle,
  onRenameModalClose,
  setTitle,
}: handleRenameScriptInput) => {
  if (newScriptTitle && oldScriptTitle && oldScriptTitle !== newScriptTitle) {
    if (
      getAllSavedScripts().some((script) => script.title === newScriptTitle)
    ) {
      alert("This title already exists!");
      return;
    }
    const scriptJSON = localStorage.getItem(`script_${oldScriptTitle}`);
    localStorage.removeItem(`script_${oldScriptTitle}`);
    localStorage.setItem(`script_${newScriptTitle}`, scriptJSON || "");
    setTitle(newScriptTitle);
  }
  setOldScriptTitle("");
  setNewScriptTitle("");
  onRenameModalClose();
};
