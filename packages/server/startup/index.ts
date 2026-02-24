import express from 'express';
import configureDB from './db';
import configureRoutes from './routes';

import 'dotenv/config';

function configureApp() {
   const app = express();

   configureRoutes(app);
   configureDB();

   return app;
}

export default configureApp;
