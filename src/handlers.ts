import {
  convertHtmlToPrompt,
  convertTextToHtml,
  generateText,
} from "./apiCall";
import { applySpanStyles } from "./styling";

type handleGenerateTextProps = {
  contentRef: React.RefObject<HTMLDivElement>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
};

export const handleGenerateText = async ({
  contentRef,
  setIsGenerating,
}: handleGenerateTextProps) => {
  setIsGenerating(true);
  const prompt = convertHtmlToPrompt({ contentRef });
  console.log("Prompt: " + prompt);
  const generatedText = await generateText({ inputPrompt: prompt });
  console.log("Generated Text: " + generatedText);
  const html = convertTextToHtml({ generatedText });
  console.log("HTML: " + html);

  const contentDiv = contentRef.current;
  if (contentDiv) {
    contentDiv.innerHTML += html;
  }
  setIsGenerating(false);
};

type handleKeyDownProps = {
  contentRef: React.RefObject<HTMLDivElement>;
  isCharacterName: boolean;
  setIsCharacterName: React.Dispatch<React.SetStateAction<boolean>>;
  isLineDescription: boolean;
  setIsLineDescription: React.Dispatch<React.SetStateAction<boolean>>;
};

export const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  {
    contentRef,
    isCharacterName,
    setIsCharacterName,
    isLineDescription,
    setIsLineDescription,
  }: handleKeyDownProps
) => {
  const contentDiv = contentRef.current;
  if (!contentDiv) return;

  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);

  if (event.key === "[" || event.key === "Tab") {
    event.preventDefault();

    setIsCharacterName(true);

    const span = document.createElement("span");
    applySpanStyles(span);
    range?.insertNode(span);
    range?.setStart(span, 0); // Place the cursor inside the span for typing the character name
  }

  if (event.key === "]" && isCharacterName) {
    event.preventDefault();

    setIsCharacterName(false);
    setIsLineDescription(true);

    const span = range?.commonAncestorContainer?.parentNode;
    if (span && span.nextSibling) {
      range?.setStartBefore(span.nextSibling); // Move cursor outside the span
    } else if (span && span.parentNode) {
      range?.setStartAfter(span); // If no next sibling exists, place cursor at the end
    }
    // add a space and open brack after the span
    const spaceNode = document.createTextNode(" (");
    range?.insertNode(spaceNode);
    range?.setStartAfter(spaceNode);
  }

  if (event.key === "Enter" && isCharacterName) {
    event.preventDefault();

    setIsCharacterName(false);
    setIsLineDescription(false);

    const span = range?.commonAncestorContainer?.parentNode;
    if (span && span.nextSibling) {
      range?.setStartBefore(span.nextSibling); // Move cursor outside the span
    } else if (span && span.parentNode) {
      range?.setStartAfter(span); // If no next sibling exists, place cursor at the end
    }
    // add a space and open brack after the span
    const linebreakNode = document.createElement("br");
    range?.insertNode(linebreakNode);
    range?.setStartAfter(linebreakNode);
  }

  if (event.key === ")" && isLineDescription) {
    event.preventDefault();

    setIsLineDescription(false);
    // Move the cursor after the closing bracket
    const spaceNode = document.createTextNode(")");
    range?.insertNode(spaceNode);
    range?.setStartAfter(spaceNode);
    const linebreakNode = document.createElement("br");
    range?.insertNode(linebreakNode);
    range?.setStartAfter(linebreakNode);
  }
};
