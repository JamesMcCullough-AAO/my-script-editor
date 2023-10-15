import { on } from "events";
import {
  applyExternalLinkSpanStyles,
  applyScriptLinkSpanStyles,
} from "../../styling";
import { getAllSavedScripts } from "../scriptManagement/getAllSavedScripts";
import { set } from "lodash";
import { url } from "inspector";

type openSlashMenuProps = {
  range: Range;
  setSavedRange: React.Dispatch<React.SetStateAction<Range | undefined>>;
  onSelectOptionModalOpen: () => void;
};

export const openSlashMenu = async ({
  range,
  setSavedRange,
  onSelectOptionModalOpen,
}: openSlashMenuProps) => {
  setSavedRange(range);
  onSelectOptionModalOpen();
};

export const addLinkSpan = (selectedScript: string, range: Range) => {
  const linkSpan = document.createElement("span");
  range.deleteContents();
  range.insertNode(linkSpan);
  range.setStartAfter(linkSpan);
  applyScriptLinkSpanStyles(linkSpan, selectedScript);
};

export const addExternalLinkSpan = (
  url: string,
  name: string,
  range: Range
) => {
  const linkSpan = document.createElement("span");
  applyExternalLinkSpanStyles(linkSpan, url, name, range);
};
