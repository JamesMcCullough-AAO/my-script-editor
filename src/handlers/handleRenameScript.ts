import { set } from "lodash";
import { ifItemExists, renameItem } from "../utils/database/indexDB";
import { saveScript } from "../utils/scriptManagement/saveScript";
import { scriptToFileName } from "../utils/database/scriptToFileName";

type handleRenameScriptInput = {
  newScriptTitle: string;
  oldScriptTitle: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const handleRenameScript = async ({
  newScriptTitle,
  oldScriptTitle,
  setTitle,
}: handleRenameScriptInput): Promise<boolean> => {
  if (newScriptTitle && oldScriptTitle && oldScriptTitle !== newScriptTitle) {
    const oldTitle = scriptToFileName(oldScriptTitle);
    const newTitle = scriptToFileName(newScriptTitle);

    if (await ifItemExists(newTitle)) {
      alert("This title already exists!");
      return false;
    }

    await renameItem(oldTitle, newTitle);

    setTitle(newScriptTitle);
  }
  return true;
};
