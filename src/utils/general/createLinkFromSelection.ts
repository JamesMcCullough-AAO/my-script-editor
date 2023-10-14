import { on } from "events";
import { applyLinkSpanStyles } from "../../styling";
import { getAllSavedScripts } from "../scriptManagement/getAllSavedScripts";
import { set } from "lodash";

type createLinkFromSelectionProps = {
  range: Range;
  setSavedRange: React.Dispatch<React.SetStateAction<Range | undefined>>;
  onSelectOptionModalOpen: () => void;
};

export const createLinkFromSelection = async ({
  range,
  setSavedRange,
  onSelectOptionModalOpen,
}: createLinkFromSelectionProps) => {
  setSavedRange(range);
  onSelectOptionModalOpen();
};

export const addLinkSpan = (selectedScript: string, range: Range) => {
  const linkSpan = document.createElement("span");
  applyLinkSpanStyles(linkSpan, selectedScript, range);
};
