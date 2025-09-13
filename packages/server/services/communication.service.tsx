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
import { convertSentenceToTitleCase } from '../infrastructure/lib/utils';

interface MessageTranscriptResponse {
   captions: { start: string; text: string; dur: string }[];
}

export const communicationService = {
   async sendOutNewsletter(message: Message, summary: Summary) {
      const announcements = await announcementRepository.getActiveAnnouncements();
      const users = await userRepository.getAllUsers();

      const emailData = users
         .filter((user) => user.id)
         .map((user) => ({
            to: user.email,
            subject: `Church Rewind! - ${convertSentenceToTitleCase(message.title)}`,
            react: <NewsletterEmail userFirstName={user.firstName} message={message} summary={summary} announcements={announcements} />,
         }));

      const response = await emailService.sendBatchEmails(emailData);
      return response;
   },

   async getMessageTranscript(message: Message) {
      let messageSummary = await messageRepository.getMessageSummary(message.id);

      if (messageSummary) {
         return messageSummary;
      }

      const response = await axios.post<MessageTranscriptResponse>(process.env.AI_API_URL!, {
         langCode: 'en',
         videoUrl: message.videoUrl,
      });

      const transcript = response.data.captions.map((caption) => caption.text).join('\n\n');

      const summary = await llmClient.generateText({
         model: 'gpt-4.1',
         temperature: 0.7,
         maxTokens: 500,
         prompt: summarizePrompt.replace('{{messageTranscript}}', transcript),
      });

      return messageRepository.storeMessageSummary(message.id, transcript, summary.text);
   },
};
