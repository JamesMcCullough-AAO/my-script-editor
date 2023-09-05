type handleNewScriptInput = {
  setNewScriptTitle: React.Dispatch<React.SetStateAction<string>>;
  onNameModalOpen: () => void;
};

export const handleNewScript = ({
  setNewScriptTitle,
  onNameModalOpen,
}: handleNewScriptInput) => {
  setNewScriptTitle("");
  onNameModalOpen();
};
