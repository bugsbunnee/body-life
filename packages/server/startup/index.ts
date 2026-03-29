import type { Express } from 'express';

import configureCors from './cors';
import configureRoutes from './routes';
import configureDB from './db';
import logger from '../services/logger.service';

import 'dotenv/config';

async function configureApp(app: Express) {
   await configureDB();

   configureCors(app);
   configureRoutes(app);
}

async function configureServer(app: Express) {
   const port = process.env.PORT || 19200;
   app.listen(port, () => logger.info(`Server is running on port ${port}...`));
}

export default { configureApp, configureServer };
