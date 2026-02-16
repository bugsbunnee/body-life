import type { IAdmin } from '../infrastructure/database/models/admin.model';
import type { IMessageWithId } from '../infrastructure/database/models/message.model';
import type { Pagination } from '../infrastructure/lib/entities';

declare global {
   namespace Express {
      interface Request {
         pagination: Pagination;
         message: IMessageWithId;
         admin: IAdmin;
         file: Express.Multer.File;
      }
   }
}
