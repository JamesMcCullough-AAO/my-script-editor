import { baseIconColor } from "../general/constants";
import { getItem } from "../database/indexDB";
import { saveScript } from "./saveScript";
import { scriptToFileName } from "../database/scriptToFileName";
import { characterNote } from "../general/types";
import { v4 } from "uuid";
import { updateCharacterNameStyling } from "../updateCharacterNameStyling";
import { scriptSpacingTypes } from "../../styling";

type loadScriptInput = {
  loadTitle: string;
  title: string;
  scriptUUID: string;
  setScriptUUID: React.Dispatch<React.SetStateAction<string>>;
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
  characterNotes: characterNote[];
  setCharacterNotes: React.Dispatch<React.SetStateAction<characterNote[]>>;
  setScriptLinkHistory: React.Dispatch<React.SetStateAction<string[]>>;
  scriptSpacing: scriptSpacingTypes;
};
export const loadScript = async ({
  loadTitle,
  title,
  scriptUUID,
  setScriptUUID,
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
  characterNotes,
  setCharacterNotes,
  setScriptLinkHistory,
  scriptSpacing,
}: loadScriptInput & { versionIndex?: number }) => {
  setIsLoading(true);
  console.log("loadTitle", loadTitle);
  console.log("title", title);
  setScriptLinkHistory((prev) => {
    // if last is not equal to loadTitle, add it
    if (prev[prev.length - 1] != loadTitle) {
      return [...prev, loadTitle];
    }
    return prev;
  });
  await saveScript({
    title,
    scriptUUID,
    contentRef,
    iconImage,
    notes,
    iconColor,
    characterNotes,
  });

  const id = `script_${scriptToFileName(loadTitle)}`;
  const databaseLoad = await getItem(id);
  const savedScripts = databaseLoad.existingScripts;
  const {
    iconImage: loadIconImage,
    iconColor: loadIconColor,
    scriptUUID: loadScriptUUID,
  } = databaseLoad;

  console.log("savedScripts", savedScripts);

  // if the loadScriptUUID is "" or undefined, generate a new one, otherwise use the one from the database
  if (!loadScriptUUID || loadScriptUUID === "") {
    const newScriptUUID = v4();
    setScriptUUID(newScriptUUID);
  } else {
    setScriptUUID(loadScriptUUID);
  }

  if (savedScripts) {
    const scriptToLoad =
      versionIndex === -1
        ? savedScripts[savedScripts.length - 1]
        : savedScripts[versionIndex];

    console.log("scriptToLoad", scriptToLoad);
    if (scriptToLoad) {
      const { content, notes, characterNotes } = scriptToLoad;

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
        setIconColor(baseIconColor);
      }

      if (notes) {
        setNotes(notes);
      } else {
        setNotes("");
      }

      if (characterNotes) {
        setCharacterNotes(characterNotes);
      } else {
        setCharacterNotes([]);
      }
    }
  }

  setIsLoading(false);
  updateCharacterNameStyling({ contentRef, scriptSpacing });
};
