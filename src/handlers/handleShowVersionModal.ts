import { ScriptVersion, getScriptVersions } from "../utils/getScriptVersions";

type handleShowVersionsModalProps = {
  title: string;
  setScriptVersions: React.Dispatch<React.SetStateAction<ScriptVersion[]>>;
  onVersionsModalOpen: () => void;
};

export const handleShowVersionsModal = async ({
  title,
  setScriptVersions,
  onVersionsModalOpen,
}: handleShowVersionsModalProps) => {
  const versions = await getScriptVersions(title);
  if (versions && versions.length !== 0) {
    versions.shift();
    setScriptVersions(versions);
    onVersionsModalOpen();
  } else {
    alert("No versions yet!");
  }
};
