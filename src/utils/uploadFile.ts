import cloudinary from '../config/cloudStorage.js';
import { APP_NAME } from '../config/constants.js';
import fs from 'fs';

const uploadFile = async (filename: string, id: string, foldername: string) => {
  const result = await cloudinary.uploader.upload(filename, {
    public_id: id,
    folder: `${APP_NAME}/${foldername}`,
    overwrite: true,
  });

  fs.unlink(filename, (err) => {
    if (err) throw err;
    console.log('file successfully deleted');
  });
  return result;
};

export default uploadFile;
