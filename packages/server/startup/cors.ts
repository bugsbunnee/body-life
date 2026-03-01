import cors from 'cors';

import { type Express } from 'express';
import { FRONTEND_BASE_URL } from '../utils/constants';

function configureCors(app: Express) {
   const corsOptions = {
      origin: FRONTEND_BASE_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
   };

   app.use(cors(corsOptions));
   app.options('*', cors(corsOptions));
}

export default configureCors;
