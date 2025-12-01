import type { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import { googleService } from '../services/google.service';

export const birthdayController = {
   async populateBirthdayReminders(req: Request, res: Response) {
      const user = await userRepository.getOneUser({
         email: 'marcel.chukwuma00@gmail.com',
         phoneNumber: '08142317489',
      });

      if (user) {
         const response = await googleService.scheduleBirthdayForUser(user);
         res.json({ response, message: 'Birthdays populated successfully!' });

         return;
      }

      res.json({ message: 'Birthdays populated successfully!' });
   },
};
