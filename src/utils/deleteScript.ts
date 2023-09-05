import { scriptToFileName } from "./scriptToFileName";

type DeleteScriptParams = {
  title: string;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onDeleteModalClose: () => void;
};

export const deleteScript = ({
  title,
  contentRef,
  setTitle,
  onDeleteModalClose,
}: DeleteScriptParams) => {
  // Remove script from local storage
  localStorage.removeItem(`script_${scriptToFileName(title)}`);

  // Clear the input and title
  if (contentRef.current) {
    contentRef.current.innerHTML = "";
  }
  setTitle("");

  // Close the delete modal
  onDeleteModalClose();
};

export const deleteAllScripts = () => {
  // Remove all scripts from local storage
  const scripts = Object.keys(localStorage).filter((key) =>
    key.includes("script_")
  );
  scripts.forEach((script) => localStorage.removeItem(script));
};
