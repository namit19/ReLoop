import multer from 'multer';

// Memory storage for immediate processing or direct upload stream
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and AVIF images are allowed.'), false);
  }
};

export const uploadMultiple = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per image
    files: 8, // Max 8 images
  },
  fileFilter,
}).array('images', 8);

export const uploadSingle = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
}).single('avatar');
