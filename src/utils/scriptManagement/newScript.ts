import { baseIconColor } from "../general/constants";
import { ifItemExists } from "../database/indexDB";
import { v4 } from "uuid";
import { scriptToFileName } from "../database/scriptToFileName";

type newScriptInput = {
  newScriptTitle: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  setIconImage?: React.Dispatch<React.SetStateAction<string>>;
  setIconColor?: React.Dispatch<React.SetStateAction<string>>;
  setScriptUUID: React.Dispatch<React.SetStateAction<string>>;
};
export const newScript = async ({
  newScriptTitle,
  contentRef,
  setTitle,
  setNotes,
  setIconImage,
  setIconColor,
  setScriptUUID,
}: newScriptInput): Promise<boolean> => {
  if (newScriptTitle) {
    if (await ifItemExists(scriptToFileName(newScriptTitle))) {
      alert("This title already exists!");
      return false;
    }
    if (contentRef.current) {
      contentRef.current.innerHTML = "";
    }
    setTitle(newScriptTitle);
    setNotes("");
    setScriptUUID(v4());
    if (setIconImage) {
      setIconImage("");
    }
    if (setIconColor) {
      setIconColor(baseIconColor);
    }
    return true;
  }
  return false;
};
