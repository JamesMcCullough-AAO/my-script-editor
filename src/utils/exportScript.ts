type exportScriptProps = {
  title: string;
  contentRef: React.RefObject<HTMLDivElement>;
};

export const exportScript = ({ title, contentRef }: exportScriptProps) => {
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
      } else if (element.tagName === "I") {
        // Add italics markup
        scriptText += `[i]${element.textContent}[/i]`;
      } else if (element.tagName === "B") {
        // Add bold markup
        scriptText += `[b]${element.textContent}[/b]`;
      } else if (element.tagName === "U") {
        scriptText += `[u]${element.textContent}[/u]`;
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
  a.download = title + ".txt";
  a.click();
  URL.revokeObjectURL(url);
};