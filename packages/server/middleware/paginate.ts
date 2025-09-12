import type { NextFunction, Request, Response } from 'express';

const paginate = (req: Request, res: Response, next: NextFunction) => {
   const pageNumber = parseInt(req.query.pageNumber as string) || 1;
   const pageSize = parseInt(req.query.pageSize as string) || 10;

   req.pagination = {
      pageNumber,
      pageSize,
      offset: (pageNumber - 1) * pageSize,
   };

   next();
};

export default paginate;
