import { getAllItems } from "./indexDB";
import { fileNameToScript } from "./scriptToFileName";

export const getAllSavedScripts = async () => {
  const allItems = await getAllItems();
  const savedScripts: Array<{
    title: string;
    content: string;
    timestamp: number;
  }> = [];

  allItems.forEach((item) => {
    if (item.id && item.id.startsWith("script_")) {
      const dataArr = item.existingScripts || [];
      if (dataArr.length > 0) {
        const mostRecentData = dataArr[dataArr.length - 1];
        savedScripts.push({
          title: fileNameToScript(item.id.substring(7)),
          content: mostRecentData.content,
          timestamp: mostRecentData.timestamp,
        });
      }
    }
  });

  // Sort by most recently edited
  return savedScripts.sort((a, b) => b.timestamp - a.timestamp);
};
