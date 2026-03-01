import type { IMessageWithId } from '../infrastructure/database/models/message.model';
import type { IUser } from '../infrastructure/database/models/user.model';
import type { Pagination } from '../infrastructure/lib/entities';

declare global {
   namespace Express {
      interface Request {
         pagination: Pagination;
         message: IMessageWithId;
         admin: IUser;
         file: Express.Multer.File;
      }
   }
}
