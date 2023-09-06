import { getAllSavedScripts } from "./getAllSavedScripts";

type newScriptInput = {
  newScriptTitle: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onMenuClose: () => void;
  onNameModalClose: () => void;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
};
export const newScript = async ({
  newScriptTitle,
  contentRef,
  setTitle,
  onMenuClose,
  onNameModalClose,
  setNotes,
}: newScriptInput) => {
  if (newScriptTitle) {
    const savedScripts = await getAllSavedScripts();
    if (savedScripts.some((script) => script.title === newScriptTitle)) {
      alert("This title already exists!");
      return;
    }
    if (contentRef.current) {
      contentRef.current.innerHTML = "";
    }
    setTitle(newScriptTitle);
    setNotes("");
    onNameModalClose();
    onMenuClose();
  }
};
