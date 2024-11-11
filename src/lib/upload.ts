import multer from 'multer';

// Set up the storage configuration (optional, can be omitted for default storage)
const storage = multer.memoryStorage();

// Create a file filter to accept only jpg, jpeg, and png
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only .jpg, .jpeg, and .png files
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and JPEG are allowed!')); // Reject the file
  }
};

// Set up multer with the storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Limit the file size (e.g., 10MB)
});

export default upload;
