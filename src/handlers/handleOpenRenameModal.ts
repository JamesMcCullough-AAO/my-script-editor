type handleOpenRenameModalInput = {
  scriptTitle: string;
  setOldScriptTitle: React.Dispatch<React.SetStateAction<string>>;
  setNewScriptTitle: React.Dispatch<React.SetStateAction<string>>;
  onMenuClose: () => void;
  onRenameModalOpen: () => void;
};

export const handleOpenRenameModal = ({
  scriptTitle,
  setOldScriptTitle,
  setNewScriptTitle,
  onMenuClose,
  onRenameModalOpen,
}: handleOpenRenameModalInput) => {
  if (!scriptTitle) return;
  setOldScriptTitle(scriptTitle);
  setNewScriptTitle(scriptTitle);
  onMenuClose();
  onRenameModalOpen();
};
