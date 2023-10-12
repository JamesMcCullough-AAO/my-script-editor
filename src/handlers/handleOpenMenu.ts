type handleOpenMenuInput = {
  onMenuOpen: () => void;
};

export const handleOpenMenu = async ({ onMenuOpen }: handleOpenMenuInput) => {
  onMenuOpen();
};
