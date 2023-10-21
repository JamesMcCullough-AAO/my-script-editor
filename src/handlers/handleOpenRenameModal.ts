type handleOpenRenameModalInput = {
  onMenuClose: () => void;
  onRenameModalOpen: () => void;
};

export const handleOpenRenameModal = ({
  onMenuClose,
  onRenameModalOpen,
}: handleOpenRenameModalInput) => {
  onMenuClose();
  onRenameModalOpen();
};
