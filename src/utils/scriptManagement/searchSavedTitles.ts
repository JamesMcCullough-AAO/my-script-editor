import { getAllItems } from "../database/indexDB";
import { fileNameToScript } from "../database/scriptToFileName";

export const searchSavedTitles = async ({
  title,
  searchTerm,
  selectedTags,
}: {
  title: string;
  searchTerm: string;
  selectedTags: string[];
}) => {
  const allItems = await getAllItems();
  const savedTitles: Array<{
    title: string;
    timestamp: number;
    iconImage?: string;
    iconColor: string;
    scriptTags?: string[];
  }> = [];

  allItems.forEach((item) => {
    if (item.id && item.id.startsWith("script_")) {
      const dataArr = item.existingScripts || [];
      if (dataArr.length > 0) {
        const mostRecentData = dataArr[dataArr.length - 1];
        savedTitles.push({
          title: fileNameToScript(item.id.substring(7)),
          timestamp: mostRecentData.timestamp,
          iconImage: item.iconImage,
          iconColor: item.iconColor,
          scriptTags: item.scriptTags,
        });
      }
    }
  });

  // Remove current if it exists
  const index = savedTitles.findIndex((script) => script.title === title);
  if (index !== -1) {
    savedTitles.splice(index, 1);
  }

  console.log(savedTitles);
  // Sort by most recently edited and filter based on search term
  return savedTitles
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter(
      ({ title, scriptTags }) =>
        title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedTags.length === 0 ||
          // must contain all selected tags
          selectedTags.every((tag) => scriptTags?.includes(tag)))
    );
};
