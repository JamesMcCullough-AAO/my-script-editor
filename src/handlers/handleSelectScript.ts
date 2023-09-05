import { loadScript } from "../utils";

type handleSelectScriptInput = {
  title: string;
  loadTitle: string;
  onMenuClose: () => void;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setIconImage: React.Dispatch<React.SetStateAction<string>>;
  iconImage?: string;
};
export const handleSelectScript = ({
  title,
  loadTitle,
  onMenuClose,
  contentRef,
  setTitle,
  setIconImage,
  iconImage,
}: handleSelectScriptInput) => {
  loadScript({
    loadTitle,
    title,
    contentRef,
    setTitle,
    setIconImage,
    iconImage,
  });
  onMenuClose();
};
