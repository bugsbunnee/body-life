import { StatusCodes } from 'http-status-codes';

import type { RequestHandler } from 'express';
import type { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';

const protectedRoute = (permittedRoles: UserRole[]): RequestHandler => {
   return (req, res, next) => {
      if (!req.admin || !permittedRoles.includes(req.admin.userRole)) {
         return res.status(StatusCodes.FORBIDDEN).json({ message: 'You are not allowed to access this resource.' });
      }

      return next();
   };
};

export default protectedRoute;
