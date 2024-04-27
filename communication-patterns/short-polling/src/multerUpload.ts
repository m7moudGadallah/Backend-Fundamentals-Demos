import multer from 'multer';
import * as path from 'path';
import { randomUUID } from 'crypto';

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const newFilename = `${randomUUID()}${extension}`; // Generate new filename with UUID and original extension
    cb(null, newFilename);
  },
});

export const imageMulterUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Check if the file is an image
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      // Accept the file
      cb(null, true);
    } else {
      // Reject the file
      cb(new Error('File type not supported'));
    }
  },
}).single('image');
