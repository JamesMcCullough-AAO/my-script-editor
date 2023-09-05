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
