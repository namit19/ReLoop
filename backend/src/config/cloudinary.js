import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('☁️ Cloudinary configured successfully.');
} else {
  // Ensure local uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  console.log('📁 Cloudinary credentials not detected; using local storage (/uploads) for images.');
}

/**
 * Uploads a file buffer to Cloudinary or falls back to local uploads directory.
 * @param {Buffer} buffer - File buffer
 * @param {string} originalname - Original file name for extension
 * @param {string} folder - Target folder
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImageBuffer = async (buffer, originalname = 'image.jpg', folder = 'reloop_products') => {
  if (isCloudinaryConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  } else {
    // Local storage fallback
    const ext = path.extname(originalname) || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    await fs.promises.writeFile(filePath, buffer);

    return {
      url: `/uploads/${filename}`,
      publicId: `local_${filename}`,
    };
  }
};

/**
 * Deletes an image from Cloudinary or local disk
 * @param {string} publicId
 */
export const deleteImage = async (publicId) => {
  if (!publicId) return;

  try {
    if (publicId.startsWith('local_')) {
      const filename = publicId.replace('local_', '');
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } else if (isCloudinaryConfigured) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (err) {
    console.error(`Failed to delete image with publicId: ${publicId}`, err.message);
  }
};

export default cloudinary;
