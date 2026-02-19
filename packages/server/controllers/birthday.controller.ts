import type { Request, Response } from 'express';
import type { Pagination } from '../infrastructure/lib/entities';

import { userRepository } from '../repositories/user.repository';
import { communicationService } from '../services/communication.service';

export const birthdayController = {
   async sendDailyBirthdayReminders(req: Request, res: Response) {
      const pagination: Pagination = { offset: 0, pageNumber: 1, pageSize: 1_000_000 };
      const users = await userRepository.getUsersWithBirthdayInRange(pagination, { startDate: new Date(), endDate: new Date() });

      if (users.data.length > 0) {
         await communicationService.sendOutBirthdayEmail(users.data);
      }

      res.json({ message: 'Birthday reminders sent successfully!' });
   },
};
