import { Conversation } from '../infrastructure/database/models/conversation.model';

export const conversationRepository = {
   async getLastResponseId(conversationId: string): Promise<string | null | undefined> {
      const conversation = await Conversation.findOne({ conversationId });
      return conversation?.lastResponseId;
   },

   async setLastResponseId(conversationId: string, responseId: string) {
      return Conversation.findOneAndUpdate(
         { conversationId },
         {
            $set: { lastResponseId: responseId },
            $setOnInsert: { conversationId },
         },
         { new: true, upsert: true, setDefaultsOnInsert: true }
      );
   },
};
