import Compressor from "compressorjs";

export const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6, // Compression quality
      maxWidth: 500, // Maximum width
      maxHeight: 500, // Maximum height
      success(result: File) {
        resolve(result);
      },
      error(err: Error) {
        reject(err);
      },
    });
  });
};
