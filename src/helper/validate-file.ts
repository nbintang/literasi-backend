import multer from "multer";
import { PayloadError } from "./error-response";
import path from "path";

// Set up the storage configuration (optional, can be omitted for default storage)
const storage = multer.memoryStorage();

// Create a file filter to accept only jpg, jpeg, and png
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  // Accept only .jpg, .jpeg, and .png files
  if (mimetype && extname) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new PayloadError("Invalid file type. Only JPG, PNG, and JPEG are allowed!")
    ); // Reject the file
  }
};

// Set up multer with the storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // Optional: Limit the file size (e.g., 1MB)
});

 const validateSingleFile = upload.single("image")
 export default validateSingleFile;

