type ScriptVersion = {
  content: string;
  timestamp: number;
  iconImage?: string;
};

export const getScriptVersions = (
  scriptTitle: string
): ScriptVersion[] | null => {
  const scriptVersionsJSON = localStorage.getItem(`script_${scriptTitle}`);
  if (scriptVersionsJSON) {
    let versions = JSON.parse(scriptVersionsJSON);
    versions.sort((a: ScriptVersion, b: ScriptVersion) => {
      return b.timestamp - a.timestamp;
    });
    return versions;
  }
  return null;
};
