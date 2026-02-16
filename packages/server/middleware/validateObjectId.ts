import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { lib } from '../utils/lib';

const validateObjectId = async (req: Request, res: Response, next: NextFunction) => {
   const isValid = lib.getObjectIdIsValid(req.params.id!);

   if (!isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid ID!' });
   }

   next();
};

export default validateObjectId;
