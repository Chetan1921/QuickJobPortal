// @ts-ignore: no declaration file for multer
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');
export default upload;
