import express from 'express';

import configureCors from './cors';
import configureDB from './db';
import configureRoutes from './routes';

import 'dotenv/config';

function configureApp() {
   const app = express();

   configureDB();
   configureCors(app);
   configureRoutes(app);

   return app;
}

export default configureApp;
