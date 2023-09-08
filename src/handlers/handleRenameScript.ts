import { ifItemExists } from "../utils/indexDB";
import { scriptToFileName } from "../utils/scriptToFileName";

type handleRenameScriptInput = {
  newScriptTitle: string;
  oldScriptTitle: string;
  setOldScriptTitle: React.Dispatch<React.SetStateAction<string>>;
  setNewScriptTitle: React.Dispatch<React.SetStateAction<string>>;
  onRenameModalClose: () => void;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const handleRenameScript = async ({
  newScriptTitle,
  oldScriptTitle,
  setOldScriptTitle,
  setNewScriptTitle,
  onRenameModalClose,
  setTitle,
}: handleRenameScriptInput) => {
  if (newScriptTitle && oldScriptTitle && oldScriptTitle !== newScriptTitle) {
    if (await ifItemExists(newScriptTitle)) {
      alert("This title already exists!");
      return;
    }
    const scriptJSON = localStorage.getItem(
      `script_${scriptToFileName(oldScriptTitle)}`
    );
    localStorage.removeItem(`script_${scriptToFileName(oldScriptTitle)}`);
    localStorage.setItem(
      `script_${scriptToFileName(newScriptTitle)}`,
      scriptJSON || ""
    );
    setTitle(newScriptTitle);
  }
  setOldScriptTitle("");
  setNewScriptTitle("");
  onRenameModalClose();
};
