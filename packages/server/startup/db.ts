import mongoose from 'mongoose';
import logger from '../services/logger.service';

async function configureDB() {
   try {
      await mongoose.connect(process.env.DB_URL!);
      logger.info(`Connected to DB: ${process.env.DB_URL}`);
   } catch (error) {
      logger.error(error);
   }
}

export default configureDB;
