import React from "react";

export enum typeSlashOptions {
  CREATE_SCRIPT_LINK = "Create Script Link",
  CREATE_URL_LINK = "Create URL Link",
  OPEN_MENU = "Open Menu",
  OPEN_NOTES = "Open Notes",
  OPEN_CHARACTER_NOTES = "Open Character Notes",
  TYPE_SLASH = "Type /",
}

type HandleOptionSelectProps = {
  option: string;
  onSelectScriptModalOpen: () => void;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  setSavedRange: (range: Range | undefined) => void;
  savedRange: Range | undefined;
  onExternalLinkModalOpen: () => void;
  onMenuOpen: () => void;
  onNotesModalOpen: () => void;
  setEditCharacterModalOpen: (value: boolean) => void;
};

export const handleOptionSelect = ({
  option,
  onSelectScriptModalOpen,
  contentRef,
  setSavedRange,
  savedRange,
  onExternalLinkModalOpen,
  onMenuOpen,
  onNotesModalOpen,
  setEditCharacterModalOpen,
}: HandleOptionSelectProps) => {
  switch (option) {
    case typeSlashOptions.CREATE_SCRIPT_LINK:
      return onSelectScriptModalOpen();
    case typeSlashOptions.CREATE_URL_LINK:
      return onExternalLinkModalOpen();
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
    case typeSlashOptions.OPEN_MENU:
      return onMenuOpen();
    case typeSlashOptions.OPEN_NOTES:
      return onNotesModalOpen();
    case typeSlashOptions.OPEN_CHARACTER_NOTES:
      return setEditCharacterModalOpen(true);

    default:
      return;
  }
};
