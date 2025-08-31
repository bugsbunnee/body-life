import prisma from '../prisma/client';

export const conversationRepository = {
   async getLastResponseId(conversationId: string) {
      const conversation = await prisma.conversation.findUnique({
         where: {
            conversationId,
         },
      });

      return conversation?.lastResponseId;
   },
   async setLastResponseId(conversationId: string, responseId: string) {
      const data = {
         conversationId,
         lastResponseId: responseId,
      };

      const conversation = await prisma.conversation.upsert({
         where: { conversationId },
         create: data,
         update: data,
      });

      return conversation;
   },
};
