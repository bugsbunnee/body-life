import type { Message } from '../generated/prisma';
import type { Pagination } from '../infrastructure/lib/entities';

declare global {
   namespace Express {
      interface Request {
         pagination: Pagination;
         message: Message;
         file: Express.Multer.File;
      }
   }
}
