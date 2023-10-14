import React from "react";

export enum typeSlashOptions {
  CREATE_SCRIPT_LINK = "Create Script Link",
  TYPE_SLASH = "Type /",
}

type HandleOptionSelectProps = {
  option: string;
  onSelectScriptModalOpen: () => void;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  setSavedRange: (range: Range | undefined) => void;
  savedRange: Range | undefined;
};

export const handleOptionSelect = ({
  option,
  onSelectScriptModalOpen,
  contentRef,
  setSavedRange,
  savedRange,
}: HandleOptionSelectProps) => {
  switch (option) {
    case typeSlashOptions.CREATE_SCRIPT_LINK:
      return onSelectScriptModalOpen();
    case typeSlashOptions.TYPE_SLASH:
      // Type / at saved range
      if (!savedRange) return;
      const contentDiv = contentRef.current;
      if (!contentDiv) return;
      const selection = window.getSelection();
      if (!selection) return;
      selection.removeAllRanges();
      selection.addRange(savedRange);
      const slashSpan = document.createElement("span");
      slashSpan.innerText = "/";
      savedRange.insertNode(slashSpan);
      selection.removeAllRanges();
      setSavedRange(undefined);
      contentDiv.focus();
      return;

    default:
      return;
  }
};
