// A function to convert a script to a safe file name

export const scriptToFileName = (scriptTitle: string): string => {
  return scriptTitle.replace(/[^a-z0-9\[\](){}'-]/gi, "_");
};

export const fileNameToScript = (fileName: string): string => {
  return fileName.replace(/_/g, " ");
};
