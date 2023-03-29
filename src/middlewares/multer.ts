import multer from 'multer';
import { SERVER_TMP_DIRECTORY } from '../config/constants';

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `/${SERVER_TMP_DIRECTORY}`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

export default upload;
