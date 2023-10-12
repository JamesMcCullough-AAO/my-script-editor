import { createScriptSVGIcon } from "./icons/editDocument";

export const applySpanStyles = (span: HTMLSpanElement) => {
  span.style.backgroundColor = "#00805B";
  span.style.borderRadius = "12px";
  span.style.color = "white";
  span.style.padding = "2px 5px";
  span.style.marginLeft = "30px";
  span.style.marginRight = "5px";
  span.classList.add("character-name");
};

export const applyLinkSpanStyles = (
  span: HTMLSpanElement,
  selectedScript: string,
  range: Range
) => {
  span.style.backgroundColor = "#505050";
  span.style.borderRadius = "12px";
  span.style.color = "white";
  span.style.padding = "6px 10px";
  span.style.marginRight = "5px";
  span.style.cursor = "pointer";
  span.style.display = "inline-flex";
  span.style.alignItems = "center";
  span.classList.add("script-link");
  span.dataset.scriptTitle = selectedScript;
  const icon = createScriptSVGIcon("#00FFB6");
  span.appendChild(icon);

  const scriptNameTextNode = document.createTextNode(selectedScript);
  span.appendChild(scriptNameTextNode);

  range.deleteContents();
  range.insertNode(span);
  range.setStartAfter(span);
};
