import axios from 'axios';
import cloudinary from 'cloudinary';

const FOLDER_NAME = 'body-life';

const config = cloudinary.v2.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
   secure: true,
});

export const generateUploadSignature = () => {
   const timestamp = Date.now();

   const signature = cloudinary.v2.utils.api_sign_request(
      {
         timestamp,
         folder: FOLDER_NAME,
      },
      config.api_secret as string
   );

   return { timestamp, signature };
};

export const uploadFile = async (file: File) => {
   const endpoint: string = `${process.env.CLOUDINARY_API_URL}/${config.cloud_name}/auto/upload`;

   const result = generateUploadSignature();
   const formData = new FormData();

   formData.append('file', file);
   formData.append('api_key', config.api_key as string);
   formData.append('timestamp', result.timestamp.toString());
   formData.append('signature', result.signature);
   formData.append('folder', FOLDER_NAME);

   try {
      const response = await axios.post<cloudinary.UploadApiResponse>(endpoint, formData);
      return { status: true, message: 'Success', data: response.data };
   } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data.message : (<Error>error).message;
      return { status: false, message, data: null };
   }
};

export const uploadStream = (buffer: Buffer) => {
   const options: cloudinary.UploadApiOptions = {
      upload_preset: 'ml_default',
      // upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      folder: FOLDER_NAME,
   };

   return new Promise<cloudinary.UploadApiResponse | undefined>((resolve, reject) => {
      cloudinary.v2.uploader
         .upload_stream(options, function (error, result) {
            if (error) reject(error);
            else resolve(result);
         })
         .end(buffer);
   });
};
