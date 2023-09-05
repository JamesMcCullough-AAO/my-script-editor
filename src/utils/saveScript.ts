type saveScriptInput = {
  title: string;
  contentRef: React.RefObject<HTMLDivElement>;
  iconImage?: string;
};
// You might want to define this outside your React component to avoid re-initializing it.
let lastSavedTimestamp: number = 0;
let lastSavedHash: string = "";

// A simple function to create a hash of the content.
const hashContent = (content: string) => content.length.toString();

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
    const currentHash = hashContent(currentContent);
    const currentTime = Date.now();

    // Your condition for deciding when to version (this is just an example)
    const shouldVersion =
      currentHash !== lastSavedHash && currentTime - lastSavedTimestamp > 10000; // 10 seconds

    const payload = {
      content: currentContent,
      timestamp: currentTime,
      iconImage,
    };

    const existingScriptsJSON = localStorage.getItem(`script_${title}`);
    const existingScripts = existingScriptsJSON
      ? JSON.parse(existingScriptsJSON)
      : [];

    if (shouldVersion) {
      // Save as a new version.
      existingScripts.push(payload);
    } else {
      // Overwrite the last version.
      existingScripts[existingScripts.length - 1] = payload;
    }

    localStorage.setItem(`script_${title}`, JSON.stringify(existingScripts));

    lastSavedHash = currentHash;
    lastSavedTimestamp = currentTime;
  }
};
