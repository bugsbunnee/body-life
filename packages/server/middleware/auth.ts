import { StatusCodes } from 'http-status-codes';

import type { NextFunction, Request, Response } from 'express';
import type { IUser } from '../infrastructure/database/models/user.model';

import jwt from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction) => {
   const token = req.header('x-auth-token');

   if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
   }

   try {
      req.admin = jwt.verify(token, process.env.JWT_SECRET!) as IUser;
   } catch (error) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid or expired token!' });
   }

   next();
};

export default auth;
