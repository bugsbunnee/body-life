import _ from 'lodash';
import axios from 'axios';

// @ts-ignore
import summarizePrompt from '../llm/prompts/summarize-message.txt';
import logger from './logger.service';

import HappyBirthdayEmail from '../infrastructure/emails/happy-birthday';
import FollowUpAssignmentEmail from '../infrastructure/emails/follow-up-assignment';
import NewsletterEmail from '../infrastructure/emails/newsletter';
import WelcomeEmail from '../infrastructure/emails/welcome';
import WeeklyReviewEmail from '../infrastructure/emails/weekly-review';

import type { IMessage, IMessageWithId } from '../infrastructure/database/models/message.model';
import type { IUser } from '../infrastructure/database/models/user.model';
import type { IFollowUp } from '../infrastructure/database/models/followup.model';
import type { INewsletter } from '../infrastructure/database/validators/communication.validator';
import type { IWeeklyReview } from '../infrastructure/database/models/weekly-review.model';

import { messageRepository } from '../repositories/message.repository';
import { programRepository } from '../repositories/program.repository';
import { userRepository } from '../repositories/user.repository';

import { emailService } from './email.service';
import { llmClient } from '../llm/client';
import { lib } from '../utils/lib';

interface MessageTranscriptResponse {
   search_parameters: {
      engine: string;
      video_id: string;
      lang: string;
      only_available: string;
   };
   transcripts: {
      text: string;
      start: number;
      duration: number;
   }[];
}

export const communicationService = {
   async generateMessageTranscript(message: IMessage) {
      const response = await axios.get<MessageTranscriptResponse>(process.env.AI_API_URL!, {
         params: {
            only_available: true,
            engine: 'youtube_transcripts',
            lang: 'en',
            video_id: message.videoUrl,
         },
         headers: {
            Authorization: 'Bearer ' + process.env.AI_API_KEY,
         },
      });

      const transcript = response.data.transcripts.map((caption) => caption.text).join('\n\n');

      return transcript;
   },

   async sendOutBirthdayEmail(users: IUser[]) {
      try {
         const batch = users.map((user) => ({
            to: user.email,
            subject: `Happy Birthday, ${user.firstName}!`,
            react: <HappyBirthdayEmail userFirstName={user.firstName} />,
         }));

         logger.info(`Sending birthday emails to ${batch.length} users`);

         await emailService.sendBatchEmails(batch);
      } catch (error) {
         logger.error('Failed to send birthday email...', error);
      }
   },

   async sendOutWelcomeEmail(user: IUser) {
      try {
         await emailService.sendSingleEmail({
            to: user.email,
            subject: `Welcome to RCNLagos Island Church`,
            react: <WelcomeEmail programs={[]} userId={user._id.toString()} userFirstName={user.firstName} />,
         });
      } catch (error) {
         logger.error('Failed to send welcome email...', error);
      }
   },

   async sendOutFollowUpAssignmentEmail(contact: IUser, firstTimer: IUser, followUp: IFollowUp) {
      try {
         await emailService.sendSingleEmail({
            to: contact.email,
            subject: `First Timer Assigned for Follow Up`,
            react: <FollowUpAssignmentEmail firstTimer={firstTimer} followUp={followUp} userFirstName={contact.firstName} />,
         });
      } catch (error) {
         logger.error('Failed to send follow up assignment email...', error);
      }
   },

   async sendOutNewsletter(newsletter: INewsletter) {
      const users = await userRepository.getUsersForNewsletter();

      if (users.length === 0) {
         return { success: false, message: 'No users subscribed to newsletter...' };
      }

      const programs = await programRepository.getUpcomingPrograms();

      const emailData = users
         .filter((user) => user.email)
         .map((user) => ({
            to: user.email,
            subject: newsletter.messageHeader,
            react: (
               <NewsletterEmail
                  userId={user._id.toString()}
                  userFirstName={user.firstName}
                  messageBody={newsletter.messageBody}
                  messageHeader={newsletter.messageHeader}
                  programs={programs}
               />
            ),
         }));

      const response = await emailService.sendBatchEmails(emailData);

      return { success: true, message: `Newsletter sent out to ${users.length} members successfully!`, data: response };
   },

   async sendOutWeeklyReview(weeklyReview: IWeeklyReview, departmentName: string, serviceDate: string) {
      const response = await emailService.sendSingleEmail({
         to: ['chukwuma.marcel00@gmail.com'],
         subject: 'Weely Report Submission by ',
         react: <WeeklyReviewEmail weeklyReview={weeklyReview} departmentName={departmentName} formattedServiceDate={serviceDate} />,
      });

      return { success: true, message: `Email sent out to recipients successfully!`, data: response };
   },

   async generateMessageSummary(message: IMessageWithId) {
      if (message.summary) {
         const isSummaryExpired = lib.checkDateIsExpired(message.summary.expiresAt);

         if (!isSummaryExpired) {
            return message.summary;
         }
      }

      const transcript = message.summary ? message.summary.transcript : await this.generateMessageTranscript(message);

      const summary = await llmClient.generateText({
         model: 'gpt-4.1',
         temperature: 0.7,
         maxTokens: 1000,
         prompt: summarizePrompt
            .replace('{{messageTranscript}}', transcript)
            .replace('{{messageTitle}}', message.title)
            .replace('{{preacherName}}', message.preacher)
            .replace('{{youtubeUrl}}', message.videoUrl)
            .replace('{{datePreached}}', lib.formatDate(message.date)),
      });

      return messageRepository.storeMessageSummary(message._id, transcript, summary.text);
   },
};
