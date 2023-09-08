import { deleteAllItems, deleteItem } from "./indexDB";
import { scriptToFileName } from "./scriptToFileName";

type DeleteScriptParams = {
  title: string;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onDeleteModalClose: () => void;
};

export const deleteScript = async ({
  title,
  contentRef,
  setTitle,
  onDeleteModalClose,
}: DeleteScriptParams) => {
  // Remove script from local storage
  await deleteItem(`script_${scriptToFileName(title)}`);

  // Clear the input and title
  if (contentRef.current) {
    contentRef.current.innerHTML = "";
  }
  setTitle("");

  // Close the delete modal
  onDeleteModalClose();
};

export const deleteAllScripts = async () => {
  // Remove all scripts from local storage
  await deleteAllItems();
};
