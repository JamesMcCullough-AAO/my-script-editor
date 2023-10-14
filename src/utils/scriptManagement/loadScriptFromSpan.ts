import { loadScript } from "./loadScript";
import { characterNote } from "../general/types";

type loadScriptFromSpanProps = {
  span: HTMLElement;
  title: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setIconImage: React.Dispatch<React.SetStateAction<string>>;
  iconImage?: string;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  iconColor: string;
  setIconColor: React.Dispatch<React.SetStateAction<string>>;
  characterNotes: characterNote[];
  setCharacterNotes: React.Dispatch<React.SetStateAction<characterNote[]>>;
  setScriptLinkHistory: React.Dispatch<React.SetStateAction<string[]>>;
};

export const loadScriptFromSpan = async ({
  span,
  title,
  contentRef,
  setTitle,
  setIconImage,
  iconImage,
  notes,
  setNotes,
  setIsLoading,
  iconColor,
  setIconColor,
  characterNotes,
  setCharacterNotes,
  setScriptLinkHistory,
}: loadScriptFromSpanProps) => {
  const scriptTitle = span.dataset.scriptTitle;
  if (!scriptTitle) return;
  if (scriptTitle === title) return;

  await loadScript({
    loadTitle: scriptTitle,
    title,
    contentRef,
    setTitle,
    setIconImage,
    iconImage,
    versionIndex: -1, // -1 will load the latest version
    notes,
    setNotes,
    setIsLoading,
    iconColor,
    setIconColor,
    characterNotes,
    setCharacterNotes,
    setScriptLinkHistory,
  });
};
