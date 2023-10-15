import { applySpanStyles } from "../../styling";

type importScriptProps = {
  contentRef: React.RefObject<HTMLDivElement>;
  text: string;
};

export const importScript = ({ contentRef, text }: importScriptProps) => {
  const contentDiv = contentRef.current;

  if (contentDiv) {
    contentDiv.innerHTML = ""; // Clear existing content

    let lines = text.split("\n");

    lines.forEach((line) => {
      const tabIndex = line.indexOf("\t");

      if (tabIndex !== -1) {
        const character = line.slice(tabIndex + 2, line.indexOf("]"));
        const span = document.createElement("span");
        span.textContent = character;
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
  }
};
