import fs from 'fs'
import multer from 'multer'
import path from 'path'

import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const uploadDir = path.resolve(__dirname, '../../../uploads');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
if (req.path === "/addServices") {
    const ext = path.extname(file.originalname)
    cb(null, `${file.originalname}-${uuidv4()}${ext}`)
  } else {
      const ext = path.extname(file.originalname)
      cb(null, `${file.originalname}-${uuidv4()}${ext}`)
  }
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image, PDF, Word, and Excel files are allowed'), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
})








