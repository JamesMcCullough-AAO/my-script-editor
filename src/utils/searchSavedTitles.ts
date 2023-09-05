import { fileNameToScript } from "./scriptToFileName";

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
      const dataArr = JSON.parse(localStorage.getItem(key) || "[]");
      if (dataArr.length > 0) {
        const mostRecentData = dataArr[dataArr.length - 1];
        savedTitles.push({
          title: fileNameToScript(key.substring(7)),
          timestamp: mostRecentData.timestamp,
          iconImage: mostRecentData.iconImage,
        });
      }
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
    .filter(({ title }) =>
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
};
