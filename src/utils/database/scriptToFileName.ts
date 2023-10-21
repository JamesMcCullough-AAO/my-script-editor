// A function to convert a script to a safe file name

import { fileNameString } from "./indexDB";

export const scriptToFileName = (scriptTitle: string): fileNameString => {
  return `script_${scriptTitle.replace(
    /[^a-z0-9\[\](){}'-:;]/gi,
    "_"
  )}` as fileNameString;
};

export const fileNameToScript = (fileName: string): string => {
  return fileName.replace(/_/g, " ");
};
