import z from 'zod';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const validate = (schema: z.ZodObject) => {
   return (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req.body);

      if (!result.success) {
         res.status(StatusCodes.BAD_REQUEST).json(z.formatError(result.error));
         return;
      }

      next();
   };
};

export default validate;
