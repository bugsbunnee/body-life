import fs from 'fs';
import path from 'path';

// @ts-ignore
import template from '../llm/prompts/chatbot.txt';

import { llmClient } from '../llm/client';
import { conversationRepository } from '../repositories/conversation.repository';

type ChatResponse = {
   id: string;
   message: string;
};

const churchInfo = fs.readFileSync(path.join(__dirname, '..', 'llm', 'prompts', 'RCNLagosIslandChurch.md'), 'utf-8');
const instructions = template.replace('{{churchInfo}}', churchInfo);

export const chatService = {
   async sendMessage(prompt: string, conversationId: string): Promise<ChatResponse> {
      const lastResponseId = await conversationRepository.getLastResponseId(conversationId);

      const response = await llmClient.generateText({
         model: 'gpt-4o-mini',
         instructions,
         prompt,
         temperature: 0.2,
         maxTokens: 200,
         previousResponseId: lastResponseId ?? undefined,
      });

      await conversationRepository.setLastResponseId(conversationId, response.id);

      return {
         id: response.id,
         message: response.text,
      };
   },

   async transcribeAudio(file: Express.Multer.File): Promise<string> {
      return llmClient.transcribe(file.path);
   },
};
