import { applySpanStyles } from "./styling";

type exportScriptProps = {
  contentRef: React.RefObject<HTMLDivElement>;
};

export const exportScript = ({ contentRef }: exportScriptProps) => {
  const contentDiv = contentRef.current;
  let scriptText = "";

  const traverseNode = (node: Node) => {
    if (node.nodeType === 3) {
      // Text node
      scriptText += node.textContent;
    } else if (node.nodeType === 1) {
      // HTML element
      const element = node as HTMLElement;

      if (element.tagName === "SPAN") {
        scriptText += `\t[${element.textContent}] `;
      } else if (element.tagName === "DIV") {
        // Recurse into the div to check its children
        Array.from(element.childNodes).forEach(traverseNode);
        // Add a newline after exiting each div to separate lines
        scriptText += "\n";
      } else if (element.tagName === "BR") {
        // Add a newline when a br tag is encountered
        scriptText += "\n";
      }
    }
  };

  if (contentDiv) {
    Array.from(contentDiv.childNodes).forEach(traverseNode);
  }

  // Trigger a download of the script
  const blob = new Blob([scriptText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "script.txt";
  a.click();
  URL.revokeObjectURL(url);
};

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
        applySpanStyles(span);

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
