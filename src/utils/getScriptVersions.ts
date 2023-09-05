import { scriptToFileName } from "./scriptToFileName";

type ScriptVersion = {
  content: string;
  timestamp: number;
  iconImage?: string;
};

export const getScriptVersions = (
  scriptTitle: string
): ScriptVersion[] | null => {
  const scriptVersionsJSON = localStorage.getItem(
    `script_${scriptToFileName(scriptTitle)}`
  );
  // Parse, add their index, and sort by timestamp
  if (scriptVersionsJSON) {
    let versions = JSON.parse(scriptVersionsJSON);
    versions = versions.map((version: ScriptVersion, index: number) => {
      return { ...version, index };
    });
    versions.sort((a: ScriptVersion, b: ScriptVersion) => {
      return b.timestamp - a.timestamp;
    });
    return versions;
  }
  return null;
};
