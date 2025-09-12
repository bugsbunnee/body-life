import { announcementRepository } from '../repositories/announcement.repository';
import { emailService } from './email.service';
import { userRepository } from '../repositories/user.repository';

import NewsletterEmail from '../infrastructure/emails/newsletter';

export const communicationService = {
   async sendOutNewsletter() {
      const announcements = await announcementRepository.getActiveAnnouncements();
      const users = await userRepository.getAllUsers();

      const emailData = users
         .filter((user) => user.email.indexOf('@example.com') === -1)
         .map((user) => ({
            to: user.email,
            subject: 'Weekly Newsletter',
            react: (
               <NewsletterEmail
                  userFirstName={user.firstName}
                  messageUrl="https://www.youtube.com/live/WW-GM_E94ak?si=bP_BNWEkuN6d-5qk"
                  announcements={announcements}
               />
            ),
         }));

      try {
         const response = await emailService.sendBatchEmails(emailData);
         return response;
      } catch (error) {
         console.error(error);
      }
   },
};
