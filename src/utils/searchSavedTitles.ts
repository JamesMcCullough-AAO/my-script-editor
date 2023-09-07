import { getAllItems } from "./indexDB";
import { fileNameToScript } from "./scriptToFileName";

export const searchSavedTitles = async ({
  title,
  searchTerm,
}: {
  title: string;
  searchTerm: string;
}) => {
  const allItems = await getAllItems();
  const savedTitles: Array<{
    title: string;
    timestamp: number;
    iconImage?: string;
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
    .filter(({ title }) =>
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
};
