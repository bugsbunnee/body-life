import cors from 'cors';

import { type Express } from 'express';
import { FRONTEND_BASE_URL } from '../utils/constants';

function configureCors(app: Express) {
   const corsOptions = {
      origin: [FRONTEND_BASE_URL, 'https://body-life-client.vercel.app', 'http://localhost:5173'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['X-Auth-Token', 'Content-Type', 'Authorization'],
   };

   app.use(cors(corsOptions));
}

export default configureCors;
