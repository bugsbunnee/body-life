import multer from 'multer';
import path from 'path';

const upload = multer({
   storage: multer.diskStorage({
      destination: 'public/uploads/',
      filename: (req, file, cb) => {
         const ext = path.extname(file.originalname); // get file extension
         cb(null, Date.now() + ext); // rename file with timestamp
      },
   }),
});

export default upload;
