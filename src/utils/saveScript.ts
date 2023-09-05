import { scriptToFileName } from "./scriptToFileName";

type saveScriptInput = {
  title: string;
  contentRef: React.RefObject<HTMLDivElement>;
  iconImage?: string;
};
// You might want to define this outside your React component to avoid re-initializing it.
let lastSavedTimestamp: number = 0;

export const saveScript = ({
  title,
  contentRef,
  iconImage,
}: saveScriptInput) => {
  if (
    title &&
    contentRef.current &&
    contentRef.current.innerHTML &&
    contentRef.current.innerHTML.length > 10
  ) {
    const currentContent = contentRef.current.innerHTML;
    const currentTime = Date.now();

    // Your condition for deciding when to version (this is just an example)
    const shouldVersion = currentTime - lastSavedTimestamp > 30000; // 30 seconds

    const payload = {
      content: currentContent,
      timestamp: currentTime,
      iconImage,
    };

    const existingScriptsJSON = localStorage.getItem(
      `script_${scriptToFileName(title)}`
    );
    const existingScripts = existingScriptsJSON
      ? JSON.parse(existingScriptsJSON)
      : [];

    if (shouldVersion) {
      // Save as a new version.
      console.log("Saving new version");
      existingScripts.push(payload);
    } else {
      // Overwrite the last version.
      existingScripts[existingScripts.length - 1] = payload;
    }

    localStorage.setItem(
      `script_${scriptToFileName(title)}`,
      JSON.stringify(existingScripts)
    );
    lastSavedTimestamp = currentTime;
  }
};
