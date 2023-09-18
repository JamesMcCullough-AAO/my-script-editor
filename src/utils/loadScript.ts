import { getItem } from "./indexDB";
import { saveScript } from "./saveScript";
import { scriptToFileName } from "./scriptToFileName";

type loadScriptInput = {
  loadTitle: string;
  title: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setIconImage: React.Dispatch<React.SetStateAction<string>>;
  versionIndex?: number;
  iconImage?: string;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  iconColor: string;
  setIconColor: React.Dispatch<React.SetStateAction<string>>;
};
export const loadScript = async ({
  loadTitle,
  title,
  contentRef,
  setTitle,
  setIconImage,
  iconImage,
  versionIndex = -1, // -1 will load the latest version
  notes,
  setNotes,
  setIsLoading,
  iconColor,
  setIconColor,
}: loadScriptInput & { versionIndex?: number }) => {
  setIsLoading(true);
  console.log("loadTitle", loadTitle);
  saveScript({ title, contentRef, iconImage, notes, iconColor });

  const id = `script_${scriptToFileName(loadTitle)}`;
  const databaseLoad = await getItem(id);
  const savedScripts = databaseLoad.existingScripts;
  const { iconImage: loadIconImage, iconColor: loadIconColor } = databaseLoad;

  console.log("savedScripts", savedScripts);

  if (savedScripts) {
    const scriptToLoad =
      versionIndex === -1
        ? savedScripts[savedScripts.length - 1]
        : savedScripts[versionIndex];

    console.log("scriptToLoad", scriptToLoad);
    if (scriptToLoad) {
      const { content, notes } = scriptToLoad;

      setTitle(loadTitle);
      if (content && contentRef.current) {
        contentRef.current.innerHTML = content;
      } else {
        if (contentRef.current) {
          contentRef.current.innerHTML = "";
        }
      }

      if (loadIconImage) {
        setIconImage(loadIconImage);
      } else {
        setIconImage("");
      }

      if (loadIconColor) {
        setIconColor(loadIconColor);
      } else {
        setIconColor("#00FFB6");
      }

      if (notes) {
        setNotes(notes);
      } else {
        setNotes("");
      }
    }
  }

  setIsLoading(false);
};
