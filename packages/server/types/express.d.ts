import type { Pagination } from '../infrastructure/lib/entities';

declare global {
   namespace Express {
      interface Request {
         pagination: Pagination;
      }
   }
}
