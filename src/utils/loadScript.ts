import { saveScript } from "./saveScript";

type loadScriptInput = {
  loadTitle: string;
  title: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setIconImage: React.Dispatch<React.SetStateAction<string>>;
  iconImage?: string;
};
export const loadScript = ({
  loadTitle,
  title,
  contentRef,
  setTitle,
  setIconImage,
  iconImage,
}: loadScriptInput) => {
  saveScript({ title, contentRef, iconImage });
  const savedScriptJSON = localStorage.getItem(`script_${loadTitle}`);
  console.log(savedScriptJSON);
  if (savedScriptJSON) {
    const { content } = JSON.parse(savedScriptJSON);
    console.log(content);
    console.log(contentRef);
    setTitle(loadTitle);
    if (content && contentRef.current) {
      contentRef.current.innerHTML = content;
    } else {
      if (contentRef.current) {
        contentRef.current.innerHTML = "";
      }
    }
    const { iconImage } = JSON.parse(savedScriptJSON);
    if (iconImage) {
      setIconImage(iconImage);
    } else {
      setIconImage("");
    }
  }
};
