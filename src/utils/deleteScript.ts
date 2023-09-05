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
  localStorage.removeItem(`script_${title}`);

  // Clear the input and title
  if (contentRef.current) {
    contentRef.current.innerHTML = "";
  }
  setTitle("");

  // Close the delete modal
  onDeleteModalClose();
};
