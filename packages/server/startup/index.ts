import express from 'express';
import configureDB from './db';
import configureRoutes from './routes';

function configureApp() {
   const app = express();

   configureRoutes(app);
   configureDB();

   return app;
}

export default configureApp;
