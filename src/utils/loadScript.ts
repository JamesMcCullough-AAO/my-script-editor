import { getItem } from "./indexDB";
import { saveScript } from "./saveScript";
import { scriptToFileName } from "./scriptToFileName";

type loadScriptInput = {
  loadTitle: string;
  title: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setIconImage: React.Dispatch<React.SetStateAction<string>>;
  iconImage?: string;
  versionIndex?: number;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
}: loadScriptInput & { versionIndex?: number }) => {
  setIsLoading(true);
  console.log("loadTitle", loadTitle);
  saveScript({ title, contentRef, iconImage, notes });

  const id = `script_${scriptToFileName(loadTitle)}`;
  const savedScripts = (await getItem(id)).existingScripts;

  console.log("savedScripts", savedScripts);

  if (savedScripts) {
    const scriptToLoad =
      versionIndex === -1
        ? savedScripts[savedScripts.length - 1]
        : savedScripts[versionIndex];

    console.log("scriptToLoad", scriptToLoad);
    if (scriptToLoad) {
      const { content, iconImage, notes } = scriptToLoad;

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

      if (notes) {
        setNotes(notes);
      } else {
        setNotes("");
      }
    }
  }

  setIsLoading(false);
};
