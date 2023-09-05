export const getAllSavedScripts = () => {
  const savedScripts = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("script_")) {
      const dataArr = JSON.parse(localStorage.getItem(key) || "[]");
      if (dataArr.length > 0) {
        const mostRecentData = dataArr[dataArr.length - 1];
        savedScripts.push({
          title: key.substring(7),
          content: mostRecentData.content,
          timestamp: mostRecentData.timestamp,
        });
      }
    }
  }
  // Sort by most recently edited
  return savedScripts.sort((a, b) => b.timestamp - a.timestamp);
};
