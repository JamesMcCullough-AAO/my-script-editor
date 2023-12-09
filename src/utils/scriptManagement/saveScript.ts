import { getItem, setItem } from "../database/indexDB";
import { scriptToFileName } from "../database/scriptToFileName";
import { characterNote } from "../general/types";

type saveScriptInput = {
  title: string;
  scriptUUID: string;
  contentRef: React.RefObject<HTMLDivElement>;
  iconImage?: string;
  notes?: string;
  iconColor: string;
  characterNotes: characterNote[];
  scriptTags: string[];
};
// You might want to define this outside your React component to avoid re-initializing it.
let lastSavedTimestamp: number = 0;

export const saveScript = async ({
  title,
  scriptUUID,
  contentRef,
  iconImage,
  notes,
  iconColor,
  characterNotes,
  scriptTags,
}: saveScriptInput) => {
  if (
    title &&
    contentRef.current &&
    contentRef.current.innerHTML &&
    contentRef.current.innerText.length > 10
  ) {
    const currentContent = contentRef.current.innerHTML;
    const currentTime = Date.now();

    // Your condition for deciding when to version (this is just an example)
    const shouldVersion = currentTime - lastSavedTimestamp > 60000; // 1 minute

    const payload = {
      content: currentContent,
      timestamp: currentTime,
      notes,
      characterNotes,
    };

    const existingScripts = (await getItem(scriptToFileName(title)))
      ?.existingScripts;

    if (!existingScripts) {
      await setItem(scriptToFileName(title), {
        existingScripts: [payload],
        scriptUUID,
        iconImage,
        iconColor,
        scriptTags,
      });
      return;
    }

    if (shouldVersion) {
      // Save as a new version.
      console.log("Saving new version");
      existingScripts.push(payload);

      // Limit to 10 versions.
      if (existingScripts.length > 10) {
        existingScripts.shift();
      }
    } else {
      // Overwrite the last version.
      existingScripts[existingScripts.length - 1] = payload;
    }

    const id = scriptToFileName(title);

    await setItem(id, {
      existingScripts,
      iconImage,
      iconColor,
      scriptUUID,
      scriptTags,
    });
    lastSavedTimestamp = currentTime;
  }
};
