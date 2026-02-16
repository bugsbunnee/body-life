import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { messageRepository } from '../repositories/message.repository';
import { lib } from '../utils/lib';

const validateMessage = async (req: Request, res: Response, next: NextFunction) => {
   const messageId = lib.parseObjectId(req.params.id!);
   const message = await messageRepository.getMessage(messageId);

   if (!message) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid Message!' });
   }

   req.message = message;

   next();
};

export default validateMessage;
