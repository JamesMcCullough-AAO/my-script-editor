import { getAllSavedScripts } from "../utils/getAllSavedScripts";

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
