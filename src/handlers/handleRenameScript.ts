import { ifItemExists } from "../utils/indexDB";
import { saveScript } from "../utils/saveScript";
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
    // TODO: Rename the script.
  }
  setOldScriptTitle("");
  setNewScriptTitle("");
  onRenameModalClose();
};
