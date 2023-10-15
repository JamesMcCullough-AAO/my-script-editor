import { createScriptSVGIcon } from "./icons/editDocument";
import { designColors } from "./utils/general/constants";
import { getItem } from "./utils/database/indexDB";
import { loadScript } from "./utils/scriptManagement/loadScript";
import { scriptToFileName } from "./utils/database/scriptToFileName";
import { createLinkSVGIcon } from "./icons/linkIcon";

export enum scriptSpacingTypes {
  COMPACT = "compact",
  SPACED = "spaced",
}

type applySpanStylesProps = {
  span: HTMLSpanElement;
  scriptSpacing?: scriptSpacingTypes;
};

export const applySpanStyles = ({
  span,
  scriptSpacing = scriptSpacingTypes.SPACED,
}: applySpanStylesProps) => {
  span.style.backgroundColor = "#00805B";
  span.style.borderRadius = "16px";
  span.style.color = "white";
  span.classList.add("character-name");
  if (scriptSpacing === scriptSpacingTypes.COMPACT) {
    span.style.paddingLeft = "5px";
    span.style.paddingRight = "5px";
    span.style.marginLeft = "30px";
    span.style.marginRight = "5px";
    span.style.marginTop = "0px";
    span.style.display = "inline-flex";
  } else {
    span.style.paddingLeft = "10px";
    span.style.paddingRight = "10px";
    span.style.marginLeft = "30px";
    span.style.marginRight = "5px";
    span.style.marginTop = "25px";
    span.style.display = "inline-flex";
  }
};

export const applyScriptLinkSpanStyles = async (
  span: HTMLSpanElement,
  selectedScript?: string
) => {
  const targetScript = selectedScript || span.dataset.scriptTitle;

  if (!targetScript || !(await referenceScriptExists(targetScript))) {
    span.remove();
    return;
  }

  const color = await getScriptIconColor(targetScript);
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
  span.dataset.scriptTitle = targetScript;

  // if the span is empty, or if the color is different, or if the text is different, then update the span
  if (span.textContent === "") {
    const icon = createScriptSVGIcon(color);
    const iconStyle = icon.style;
    iconStyle.marginRight = "5px";
    span.appendChild(icon);

    const scriptNameTextNode = document.createTextNode(targetScript);
    span.appendChild(scriptNameTextNode);
  } else {
    // update the icon child by replacing it with a new one in the same position
    const icon = createScriptSVGIcon(color);
    const iconStyle = icon.style;
    iconStyle.marginRight = "5px";
    span.replaceChild(icon, span.childNodes[0]);

    // update the text child by replacing it with a new one in the same position
    const scriptNameTextNode = document.createTextNode(targetScript);
    span.replaceChild(scriptNameTextNode, span.childNodes[1]);
  }
};

const getScriptIconColor = async (scriptName: string) => {
  const id = "script_" + scriptToFileName(scriptName);
  const scriptData = await getItem(id);

  return scriptData?.iconColor || "#00FFB6";
};

const referenceScriptExists = async (scriptName: string) => {
  const id = "script_" + scriptToFileName(scriptName);
  const scriptData = await getItem(id);

  return scriptData !== undefined;
};

export const applyExternalLinkSpanStyles = async (
  span: HTMLSpanElement,
  url: string,
  name: string,
  range: Range
) => {
  const color = "#00FFB6";
  span.style.backgroundColor = designColors.darkblue;
  span.style.borderRadius = "30px";
  span.style.color = "white";
  span.style.border = "1px solid #ccc";
  span.style.padding = "6px 10px 6px 10px";
  span.style.marginRight = "5px";
  span.style.marginLeft = "5px";
  span.style.marginTop = "10px";
  span.style.marginBottom = "10px";
  span.style.cursor = "pointer";
  span.style.display = "inline-flex";
  span.style.alignItems = "center";
  span.classList.add("url-link");
  span.dataset.linkUrl = url;
  const icon = createLinkSVGIcon(color);
  const iconStyle = icon.style;
  iconStyle.marginRight = "5px";
  span.appendChild(icon);

  const scriptNameTextNode = document.createTextNode(name);
  span.appendChild(scriptNameTextNode);

  range.deleteContents();
  range.insertNode(span);
  range.setStartAfter(span);
};
