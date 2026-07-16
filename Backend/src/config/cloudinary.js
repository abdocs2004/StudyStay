import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a buffer (from multer's memoryStorage) to Cloudinary.
 * Returns { url, publicId } using the optimized, auto-format secure URL.
 */
export const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `studystay/${folder}`,
        resource_type: 'image',
        // Automatic format/quality selection keeps files small without
        // visible quality loss (e.g. serves WebP/AVIF to browsers that support it).
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });

/** Deletes an image from Cloudinary by its public_id. Never throws — deletion
 * failures shouldn't block the primary DB operation (e.g. replacing a photo). */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

export default cloudinary;
