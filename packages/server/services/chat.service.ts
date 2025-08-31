import fs from 'fs';
import path from 'path';

import openAiClient from '../llm/client';
import template from '../llm/prompts/chatbot.txt';

import { conversationRepository } from '../repositories/conversation.repository';

type ChatResponse = {
   id: string;
   message: string;
};

const churchInfo = fs.readFileSync(
   path.join(__dirname, '..', 'llm', 'prompts', 'RCNLagosIslandChurch.md'),
   'utf-8'
);
const instructions = template.replace('{{churchInfo}}', churchInfo);

export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await openAiClient.responses.create({
         model: 'gpt-4o-mini',
         instructions,
         input: prompt,
         temperature: 0.7,
         max_output_tokens: 100,
         previous_response_id:
            await conversationRepository.getLastResponseId(conversationId),
      });

      await conversationRepository.setLastResponseId(
         conversationId,
         response.id
      );

      return {
         id: response.id,
         message: response.output_text,
      };
   },

   async transcribeAudio(file: Express.Multer.File): Promise<string> {
      const response = await openAiClient.audio.transcriptions.create({
         file: fs.createReadStream(file.path),
         model: 'gpt-4o-transcribe',
      });

      return response.text;
   },
};
