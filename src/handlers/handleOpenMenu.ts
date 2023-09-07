import { searchSavedTitles } from "../utils/searchSavedTitles";

type handleOpenMenuInput = {
  title: string;
  setSavedScriptTitles: React.Dispatch<
    React.SetStateAction<
      {
        title: string;
        timestamp: number;
        iconImage?: string;
        iconColor: string;
      }[]
    >
  >;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onMenuOpen: () => void;
};

export const handleOpenMenu = async ({
  title,
  setSavedScriptTitles,
  setSearchTerm,
  onMenuOpen,
}: handleOpenMenuInput) => {
  const savedScriptTitles = await searchSavedTitles({
    title,
    searchTerm: "",
  });
  setSavedScriptTitles(savedScriptTitles);
  setSearchTerm("");
  onMenuOpen();
};
