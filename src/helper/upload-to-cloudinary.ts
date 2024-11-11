import { cloudinary } from "../lib/cld";

async function uploadToCloudinary(imageBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "bookstore" }, (error, result) => {
        if (error || !result) {
          return reject(error);
        }
        resolve(result.secure_url);
      })
      .end(imageBuffer);
  });
}

export { uploadToCloudinary };
