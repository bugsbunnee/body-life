import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { messageRepository } from '../repositories/message.repository';

const validateMessage = async (req: Request, res: Response, next: NextFunction) => {
   const messageId = Number(req.params.id);

   if (isNaN(messageId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid Message ID!' });
      return;
   }

   const message = await messageRepository.getMessage(messageId);

   if (!message) {
      res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid Message!' });
      return;
   }

   req.message = message;

   next();
};

export default validateMessage;
