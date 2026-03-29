import express from 'express';

import configureCors from './cors';
import configureRoutes from './routes';
import configureDB from './db';

import 'dotenv/config';

function configureApp() {
   const app = express();

   configureDB();
   configureCors(app);
   configureRoutes(app);

   return app;
}

export default configureApp;
