type handleNewScriptInput = {
  onNameModalOpen: () => void;
};

export const handleNewScript = ({ onNameModalOpen }: handleNewScriptInput) => {
  onNameModalOpen();
};
