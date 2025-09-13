import moment from 'moment';
import prisma from '../prisma/client';

import type { Pagination, SearchFilter } from '../infrastructure/lib/entities';
import type { Message, Summary } from '../generated/prisma';

export const messageRepository = {
   async createMessage(message: Message) {
      return prisma.message.create({
         data: {
            title: message.title,
            preacher: message.preacher,
            videoUrl: message.videoUrl,
            date: message.date,
         },
      });
   },

   async getMessage(messageId: number) {
      return prisma.message.findFirst({
         where: { id: messageId },
      });
   },

   async getMessages(pagination: Pagination, filters: SearchFilter<Message> = {}) {
      const where = filters.field && filters.search ? { [filters.field]: { contains: filters.search } } : undefined;

      const messageQuery = prisma.message.findMany({
         where,
         include: {
            summary: {
               where: {
                  expiresAt: { gt: new Date() },
               },
               select: {
                  content: true,
                  transcript: true,
                  generatedAt: true,
                  expiresAt: true,
               },
            },
         },
         take: pagination.pageSize,
         skip: pagination.offset,
         orderBy: { date: 'desc' },
      });

      const [messages, total] = await Promise.all([messageQuery, prisma.message.count({ where })]);

      return {
         data: messages,
         pagination: {
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
            totalCount: total,
            totalPages: Math.ceil(total / pagination.pageSize),
         },
      };
   },

   async storeMessageSummary(messageId: number, transcript: string, summary: string) {
      const data = {
         content: summary,
         expiresAt: moment().add(7, 'days').toDate(),
         generatedAt: new Date(),
         transcript,
         messageId,
      };

      return prisma.summary.upsert({
         where: { messageId },
         create: data,
         update: data,
      });
   },

   async getMessageSummary(messageId: number): Promise<Summary | null> {
      const summary = await prisma.summary.findFirst({
         where: {
            AND: [{ messageId }, { expiresAt: { gt: new Date() } }],
         },
      });

      return summary;
   },
};
