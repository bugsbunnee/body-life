import express from 'express';

import configureCors from './cors';
import configureDB from './db';
import configureRoutes from './routes';

import 'dotenv/config';

function configureApp() {
   const app = express();

   configureCors(app);
   configureRoutes(app);
   configureDB();

   return app;
}

export default configureApp;
