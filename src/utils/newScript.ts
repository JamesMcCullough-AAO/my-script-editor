import { getAllSavedScripts } from "./getAllSavedScripts";

type newScriptInput = {
  newScriptTitle: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onMenuClose: () => void;
  onNameModalClose: () => void;
};
export const newScript = ({
  newScriptTitle,
  contentRef,
  setTitle,
  onMenuClose,
  onNameModalClose,
}: newScriptInput) => {
  if (newScriptTitle) {
    if (
      getAllSavedScripts().some((script) => script.title === newScriptTitle)
    ) {
      alert("This title already exists!");
      return;
    }
    if (contentRef.current) {
      contentRef.current.innerHTML = "";
    }
    setTitle(newScriptTitle);
    onNameModalClose();
    onMenuClose();
  }
};
