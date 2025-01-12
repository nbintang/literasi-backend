import { cloudinary } from "../lib/cld";

export default async function manageCloudinaryImages({
  buffer,
  folder = "book-covers",
  public_id,
}: {
  buffer: Buffer;
  folder?: string;
  public_id?: string;
}): Promise<{ secure_url: string; public_id: string }> {
  if (public_id) {
    try {
      await checkAndDestroyImage(public_id);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return await uploadImgToCloudinary({ buffer, folder, public_id });
}

async function checkAndDestroyImage(public_id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.api.resource(public_id, (error, result) => {
      if (error || !result) {
        return reject(error);
      }
      cloudinary.uploader.destroy(public_id, (destroyError) => {
        if (destroyError) {
          return reject(destroyError);
        }
        console.log("Image destroyed successfully.");
        resolve();
      });
    });
  });
}

async function uploadImgToCloudinary({
  buffer,
  folder,
  public_id,
}: {
  buffer: Buffer;
  folder?: string;
  public_id?: string;
}): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          public_id,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      )
      .end(buffer);
  });
}
