import { applySpanStyles, scriptSpacingTypes } from "../../styling";
import { updateCharacterNameStyling } from "../updateCharacterNameStyling";

type importScriptProps = {
  contentRef: React.RefObject<HTMLDivElement>;
  text: string;
  scriptSpacing: scriptSpacingTypes;
};

export const importScript = ({
  contentRef,
  text,
  scriptSpacing,
}: importScriptProps) => {
  const contentDiv = contentRef.current;

  if (contentDiv) {
    contentDiv.innerHTML = ""; // Clear existing content

    let lines = text.split("\n");

    lines.forEach((line) => {
      const tabIndex = line.indexOf("\t");

      if (tabIndex !== -1) {
        const character = line.slice(tabIndex + 2, line.indexOf("]"));
        const span = document.createElement("span");
        span.textContent = character + "\u200B";
        applySpanStyles({ span });

        contentDiv.appendChild(span);
        const remainingText = document.createTextNode(
          line.slice(line.indexOf("]") + 2)
        );
        contentDiv.appendChild(remainingText);
      } else {
        const textNode = document.createTextNode(line);
        contentDiv.appendChild(textNode);
      }

      const linebreakNode = document.createElement("br");
      contentDiv.appendChild(linebreakNode);
    });

    updateCharacterNameStyling({ contentRef, scriptSpacing });
  }
};
