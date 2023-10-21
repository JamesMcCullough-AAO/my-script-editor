import { deleteAllItems, deleteItem } from "../database/indexDB";
import { scriptToFileName } from "../database/scriptToFileName";

type DeleteScriptParams = {
  title: string;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const deleteScript = async ({
  title,
  contentRef,
  setTitle,
}: DeleteScriptParams) => {
  // Remove script from local storage
  await deleteItem(scriptToFileName(title));

  // Clear the input and title
  if (contentRef.current) {
    contentRef.current.innerHTML = "";
  }
  setTitle("");
};

export const deleteAllScripts = async () => {
  // Remove all scripts from local storage
  await deleteAllItems();
};
