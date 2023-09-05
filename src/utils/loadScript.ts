import { saveScript } from "./saveScript";

type loadScriptInput = {
  loadTitle: string;
  title: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setIconImage: React.Dispatch<React.SetStateAction<string>>;
  iconImage?: string;
  versionIndex?: number;
};
export const loadScript = ({
  loadTitle,
  title,
  contentRef,
  setTitle,
  setIconImage,
  iconImage,
  versionIndex = -1, // -1 will load the latest version
}: loadScriptInput & { versionIndex?: number }) => {
  saveScript({ title, contentRef, iconImage });

  const savedScriptsJSON = localStorage.getItem(`script_${loadTitle}`);
  if (savedScriptsJSON) {
    const savedScripts = JSON.parse(savedScriptsJSON);
    const scriptToLoad =
      versionIndex === -1
        ? savedScripts[savedScripts.length - 1]
        : savedScripts[versionIndex];

    if (scriptToLoad) {
      const { content, iconImage } = scriptToLoad;

      setTitle(loadTitle);
      if (content && contentRef.current) {
        contentRef.current.innerHTML = content;
      } else {
        if (contentRef.current) {
          contentRef.current.innerHTML = "";
        }
      }

      if (iconImage) {
        setIconImage(iconImage);
      } else {
        setIconImage("");
      }
    }
  }
};
