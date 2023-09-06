import { getItem } from "./indexDB";
import { scriptToFileName } from "./scriptToFileName";

type ScriptVersion = {
  content: string;
  timestamp: number;
  iconImage?: string;
};

export const getScriptVersions = async (
  scriptTitle: string
): Promise<ScriptVersion[] | null> => {
  const id = `script_${scriptToFileName(scriptTitle)}`;
  const savedScripts = (await getItem(id)).existingScripts;

  // Parse, add their index, and sort by timestamp
  if (savedScripts) {
    let versions = savedScripts;
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
