import { searchSavedTitles } from "../utils/searchSavedTitles";

type handleOpenMenuInput = {
  title: string;
  setSavedScriptTitles: React.Dispatch<
    React.SetStateAction<
      {
        title: string;
        timestamp: number;
        iconImage?: string;
      }[]
    >
  >;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onMenuOpen: () => void;
};

export const handleOpenMenu = ({
  title,
  setSavedScriptTitles,
  setSearchTerm,
  onMenuOpen,
}: handleOpenMenuInput) => {
  const savedScriptTitles = searchSavedTitles({
    title,
    searchTerm: "",
  });
  setSavedScriptTitles(savedScriptTitles);
  setSearchTerm("");
  onMenuOpen();
};
