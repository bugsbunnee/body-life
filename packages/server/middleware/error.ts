import type { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

import logger from '../services/logger.service';

function error(error: Error, req: Request, res: Response, next: NextFunction) {
   logger.error(error);

   return res.status(HttpStatusCode.InternalServerError).json({ message: error.message });
}

export default error;
