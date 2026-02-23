import moment from 'moment';

import type { Request, Response } from 'express';
import type { Pagination } from '../infrastructure/lib/entities';
import type { IUser } from '../infrastructure/database/models/user.model';
import type { IDateRange } from '../infrastructure/database/validators/base.validator';

import { userRepository } from '../repositories/user.repository';
import { communicationService } from '../services/communication.service';
import { whatsappService } from '../services/whatsapp.service';

export const birthdayController = {
   async sendDailyBirthdayReminders(req: Request, res: Response) {
      const date: IDateRange = { startDate: moment().toDate(), endDate: moment().toDate() };
      const pagination: Pagination = { offset: 0, pageNumber: 1, pageSize: 1_000_000 };
      const users = await userRepository.getUsersWithBirthdayInRange(pagination, date);

      if (users.data.length > 0) {
         let whatsappPromise = users.data.map((user: IUser) => whatsappService.sendHappyBirthdayMessage(user));
         whatsappPromise = whatsappPromise.concat([communicationService.sendOutBirthdayEmail(users.data)]);

         await Promise.all(whatsappPromise);
      }

      res.json({ message: 'Birthday reminders sent successfully!' });
   },
};
