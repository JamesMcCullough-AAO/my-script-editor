import { set } from "lodash";
import { ifItemExists, renameItem } from "../utils/database/indexDB";
import { saveScript } from "../utils/scriptManagement/saveScript";
import { scriptToFileName } from "../utils/database/scriptToFileName";

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
    const oldTitle = "script_" + scriptToFileName(oldScriptTitle);
    const newTitle = "script_" + scriptToFileName(newScriptTitle);

    if (await ifItemExists(newTitle)) {
      alert("This title already exists!");
      return;
    }

    await renameItem(oldTitle, newTitle);

    setTitle(newScriptTitle);
  }
  setOldScriptTitle("");
  setNewScriptTitle("");
  onRenameModalClose();
};
