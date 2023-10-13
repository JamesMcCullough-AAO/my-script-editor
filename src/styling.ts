import { createScriptSVGIcon } from "./icons/editDocument";
import { designColors } from "./utils/constants";
import { getItem } from "./utils/indexDB";
import { loadScript } from "./utils/loadScript";
import { scriptToFileName } from "./utils/scriptToFileName";

export const applySpanStyles = (span: HTMLSpanElement) => {
  span.style.backgroundColor = "#00805B";
  span.style.borderRadius = "12px";
  span.style.color = "white";
  span.style.padding = "2px 5px";
  span.style.marginLeft = "30px";
  span.style.marginRight = "5px";
  span.style.marginTop = "10px";
  span.classList.add("character-name");
};

export const applyLinkSpanStyles = async (
  span: HTMLSpanElement,
  selectedScript: string,
  range: Range
) => {
  const color = await getScriptIconColor(selectedScript);
  span.style.backgroundColor = designColors.darkblue;
  span.style.borderRadius = "30px";
  span.style.color = "white";
  span.style.border = "1px solid " + color;
  span.style.padding = "6px 10px 6px 10px";
  span.style.marginRight = "5px";
  span.style.marginLeft = "5px";
  span.style.marginTop = "10px";
  span.style.marginBottom = "10px";
  span.style.cursor = "pointer";
  span.style.display = "inline-flex";
  span.style.alignItems = "center";
  span.classList.add("script-link");
  span.dataset.scriptTitle = selectedScript;
  const icon = createScriptSVGIcon(color);
  const iconStyle = icon.style;
  iconStyle.marginRight = "5px";
  span.appendChild(icon);

  const scriptNameTextNode = document.createTextNode(selectedScript);
  span.appendChild(scriptNameTextNode);

  range.deleteContents();
  range.insertNode(span);
  range.setStartAfter(span);
};

const getScriptIconColor = async (scriptName: string) => {
  const id = "script_" + scriptToFileName(scriptName);
  const scriptData = await getItem(id);

  return scriptData?.iconColor || "#00FFB6";
};
