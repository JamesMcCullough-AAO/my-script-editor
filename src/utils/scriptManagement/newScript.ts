import { baseIconColor } from "../general/constants";
import { ifItemExists } from "../database/indexDB";
import { v4 } from "uuid";

type newScriptInput = {
  newScriptTitle: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onMenuClose: () => void;
  onNameModalClose: () => void;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  setIconImage?: React.Dispatch<React.SetStateAction<string>>;
  setIconColor?: React.Dispatch<React.SetStateAction<string>>;
  setScriptUUID: React.Dispatch<React.SetStateAction<string>>;
};
export const newScript = async ({
  newScriptTitle,
  contentRef,
  setTitle,
  onMenuClose,
  onNameModalClose,
  setNotes,
  setIconImage,
  setIconColor,
  setScriptUUID,
}: newScriptInput) => {
  if (newScriptTitle) {
    if (await ifItemExists(newScriptTitle)) {
      alert("This title already exists!");
      return;
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
    onNameModalClose();
    onMenuClose();
  }
};
