import type { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';

const pastor = (req: Request, res: Response, next: NextFunction) => {
   if (req.admin.userRole !== UserRole.Pastor) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You do not have the permission to update this resource.' });
   }

   next();
};

export default pastor;
