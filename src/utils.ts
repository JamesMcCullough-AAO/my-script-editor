import { applySpanStyles } from "./styling";

type exportScriptProps = {
  title: string;
  contentRef: React.RefObject<HTMLDivElement>;
};

type formatTimestampProps = {
  timestamp: number;
};
export const formatTimestamp = ({ timestamp }: formatTimestampProps) => {
  const now = Date.now();
  const timeDifferenceInMilliseconds = now - timestamp;
  const timeDifferenceInSeconds = Math.floor(
    timeDifferenceInMilliseconds / 1000
  );
  const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
  const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
  const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

  if (timeDifferenceInMinutes < 2) {
    return "Just now";
  } else if (timeDifferenceInMinutes < 60) {
    return `${timeDifferenceInMinutes} minutes ago`;
  } else if (timeDifferenceInHours < 24) {
    return `${timeDifferenceInHours} hours ago`;
  } else {
    return `${timeDifferenceInDays} days ago`;
  }
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

const removeInvisibleCharacters = (text: string) => {
  // Returns invisible characters from the HTML
  const invisibleCharacters = text.match(/&nbsp;|<br>|<div><br><\/div>/g);
  if (invisibleCharacters) {
    return invisibleCharacters.join("");
  }
  return "";
};

type saveScriptInput = {
  title: string;
  contentRef: React.RefObject<HTMLDivElement>;
};
export const saveScript = ({ title, contentRef }: saveScriptInput) => {
  if (
    title &&
    contentRef.current &&
    contentRef.current.innerHTML &&
    removeInvisibleCharacters(contentRef.current.innerHTML).length > 5
  ) {
    const payload = {
      content: contentRef.current.innerHTML,
      timestamp: Date.now(),
    };
    localStorage.setItem(`script_${title}`, JSON.stringify(payload));
  }
};

type searchSavedTitlesInput = {
  title: string;
  searchTerm: string;
};

export const searchSavedTitles = ({
  title,
  searchTerm,
}: searchSavedTitlesInput) => {
  const savedTitles = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("script_")) {
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      savedTitles.push({
        title: key.substring(7),
        timestamp: data.timestamp,
      });
    }
  }
  // Remove current if it exists
  const index = savedTitles.findIndex((script) => script.title === title);
  if (index !== -1) {
    savedTitles.splice(index, 1);
  }
  // Sort by most recently edited and filter based on search term
  return savedTitles
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(({ title }) => title.toLowerCase().includes(searchTerm));
};

export const getAllSavedScripts = () => {
  const savedScripts = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("script_")) {
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      savedScripts.push({
        title: key.substring(7),
        content: data.content,
        timestamp: data.timestamp,
      });
    }
  }
  // Sort by most recently edited and filter based on search term
  return savedScripts.sort((a, b) => b.timestamp - a.timestamp);
};

type loadScriptInput = {
  loadTitle: string;
  title: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};
export const loadScript = ({
  loadTitle,
  title,
  contentRef,
  setTitle,
}: loadScriptInput) => {
  saveScript({ title, contentRef });
  const savedScriptJSON = localStorage.getItem(`script_${loadTitle}`);
  console.log(savedScriptJSON);
  if (savedScriptJSON) {
    const { content } = JSON.parse(savedScriptJSON);
    console.log(content);
    console.log(contentRef);
    setTitle(loadTitle);
    if (content && contentRef.current) {
      contentRef.current.innerHTML = content;
    } else {
      if (contentRef.current) {
        contentRef.current.innerHTML = "";
      }
    }
  }
};

type newScriptInput = {
  newScriptTitle: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onMenuClose: () => void;
  onNameModalClose: () => void;
};
export const newScript = ({
  newScriptTitle,
  contentRef,
  setTitle,
  onMenuClose,
  onNameModalClose,
}: newScriptInput) => {
  if (newScriptTitle) {
    if (
      getAllSavedScripts().some((script) => script.title === newScriptTitle)
    ) {
      alert("This title already exists!");
      return;
    }
    if (contentRef.current) {
      contentRef.current.innerHTML = "";
    }
    setTitle(newScriptTitle);
    onNameModalClose();
    onMenuClose();
  }
};

type DeleteScriptParams = {
  title: string;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  onDeleteModalClose: () => void;
};

export const deleteScript = ({
  title,
  contentRef,
  setTitle,
  onDeleteModalClose,
}: DeleteScriptParams) => {
  // Remove script from local storage
  localStorage.removeItem(`script_${title}`);

  // Clear the input and title
  if (contentRef.current) {
    contentRef.current.innerHTML = "";
  }
  setTitle("");

  // Close the delete modal
  onDeleteModalClose();
};
