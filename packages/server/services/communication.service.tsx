import _ from 'lodash';
import axios from 'axios';
import NewsletterEmail from '../infrastructure/emails/newsletter';

// @ts-ignore
import summarizePrompt from '../llm/prompts/summarize-message.txt';

import type { Message, Summary } from '../generated/prisma';
import { announcementRepository } from '../repositories/announcement.repository';
import { messageRepository } from '../repositories/message.repository';

import { userRepository } from '../repositories/user.repository';
import { emailService } from './email.service';
import { llmClient } from '../llm/client';
import { lib } from '../utils/lib';

interface MessageTranscriptResponse {
   captions: { start: string; text: string; dur: string }[];
}

export const communicationService = {
   async generateMessageTranscript(message: Message) {
      const response = await axios.post<MessageTranscriptResponse>(process.env.AI_API_URL!, {
         langCode: 'en',
         videoUrl: message.videoUrl,
      });

      const transcript = response.data.captions.map((caption) => caption.text).join('\n\n');

      return transcript;
   },

   async sendOutNewsletter(message: Message, summary: Summary) {
      const announcements = await announcementRepository.getActiveAnnouncements();
      const users = await userRepository.getAllUsers();

      const emailData = users
         .filter((user) => user.email)
         .map((user) => ({
            to: user.email,
            subject: `Church Rewind!`,
            react: <NewsletterEmail summary={summary} announcements={announcements} />,
         }));

      const response = await emailService.sendBatchEmails(emailData);

      return response;
   },

   async generateMessageSummary(message: Message) {
      let messageSummary = await messageRepository.getMessageSummary(message.id);

      if (messageSummary) {
         const isSummaryExpired = lib.checkDateIsExpired(messageSummary.expiresAt);

         if (!isSummaryExpired) {
            return messageSummary;
         }
      }

      let transcript = messageSummary ? messageSummary.transcript : await this.generateMessageTranscript(message);

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

      return messageRepository.storeMessageSummary(message.id, transcript, summary.text);
   },
};
