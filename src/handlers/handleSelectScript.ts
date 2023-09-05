import { loadScript } from "../utils/loadScript";

type handleSelectScriptInput = {
  title: string;
  loadTitle: string;
  onMenuClose: () => void;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setIconImage: React.Dispatch<React.SetStateAction<string>>;
  iconImage?: string;
  versionIndex?: number;
};
export const handleSelectScript = ({
  title,
  loadTitle,
  onMenuClose,
  contentRef,
  setTitle,
  setIconImage,
  iconImage,
  versionIndex,
}: handleSelectScriptInput) => {
  loadScript({
    loadTitle,
    title,
    contentRef,
    setTitle,
    setIconImage,
    iconImage,
    versionIndex,
  });
  onMenuClose();
};
