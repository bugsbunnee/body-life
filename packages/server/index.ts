import express from 'express';
import startup from './startup';
import logger from './services/logger.service';

const app = express();

startup
   .configureApp(app)
   .then(() => startup.configureServer(app))
   .catch((error) => logger.error('Error during server startup:', error));

export default app;
