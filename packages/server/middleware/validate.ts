import z from 'zod';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

type Target = 'query' | 'body' | 'params';

const validate = (schema: z.ZodObject, target: Target) => {
   return (req: Request, res: Response, next: NextFunction) => {
      const result = schema.safeParse(req[target]);

      if (!result.success) {
         const message = result.error.issues.map((issue) => `${issue.path}:${issue.message}`).join(', ');
         res.status(StatusCodes.BAD_REQUEST).json({ message });

         return;
      }

      if (target === 'body') {
         req[target] = result.data;
      }

      next();
   };
};

export default validate;
