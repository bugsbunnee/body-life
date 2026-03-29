import moment from 'moment';

import type { Request, Response } from 'express';
import type { Pagination } from '../infrastructure/lib/entities';
import type { IDateRange } from '../infrastructure/database/validators/base.validator';

import { userRepository } from '../repositories/user.repository';
import { communicationService } from '../services/communication.service';
import { smsService } from '../services/sms.service';

export const birthdayController = {
   async sendDailyBirthdayReminders(req: Request, res: Response) {
      const date: IDateRange = { startDate: moment().startOf('day').toDate(), endDate: moment().endOf('day').toDate() };
      const pagination: Pagination = { offset: 0, pageNumber: 1, pageSize: 1_000_000 };
      const users = await userRepository.getUsersWithBirthdayInRange(pagination, date);

      if (users.data.length > 0) {
         const [smsResponse, emailResponse] = await Promise.all([smsService.sendBulkHappyBirthdaySMS(users.data), communicationService.sendOutBirthdayEmail(users.data)]);
      }

      res.json({ message: 'Birthday reminders sent successfully!' });
   },
};
