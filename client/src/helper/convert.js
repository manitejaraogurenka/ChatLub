import Resizer from "react-image-file-resizer";

export async function resizeImage(file) {
  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      500,
      500,
      file.type === "image/jpeg" ? "JPEG" : "PNG",
      80,
      0,
      async (uri) => {
        try {
          resolve(uri);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}
