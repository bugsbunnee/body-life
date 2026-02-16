import moment from 'moment';
import mongoose, { type QueryFilter } from 'mongoose';
import { Message, type IMessage } from '../infrastructure/database/models/message.model';

import type { Pagination } from '../infrastructure/lib/entities';
import type { IMessageQuery } from '../infrastructure/database/validators/message.validator';

export const messageRepository = {
   buildMessageFilterQuery(query: IMessageQuery) {
      const filter: QueryFilter<IMessage> = {};

      if (query.title) {
         filter.title = { $regex: query.title, $options: 'i' };
      }

      if (query.date) {
         const startDate = moment(query.date).startOf('day').toDate();
         const endDate = moment(query.date).endOf('day').toDate();

         filter.date = { $gte: startDate, $lte: endDate };
      }

      if (query.videoUrl) {
         filter.videoUrl = { $regex: query.videoUrl, $options: 'i' };
      }

      if (query.preacher) {
         filter.preacher = query.preacher;
      }

      return filter;
   },

   async createMessage(message: IMessage) {
      return Message.create({
         title: message.title,
         preacher: message.preacher,
         videoUrl: message.videoUrl,
         date: message.date,
      });
   },

   async getMessage(messageId: mongoose.Types.ObjectId) {
      return Message.findById(messageId).exec();
   },

   async getMessages(pagination: Pagination, filters: IMessageQuery) {
      const filter = this.buildMessageFilterQuery(filters);

      const [messages, total] = await Promise.all([
         Message.find(filter).skip(pagination.offset).limit(pagination.pageSize).populate('preacher').sort({ date: -1 }).lean().exec(),
         Message.countDocuments(filter),
      ]);

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

   async storeMessageSummary(messageId: mongoose.Types.ObjectId, transcript: string, summary: string) {
      return Message.findByIdAndUpdate(
         messageId,
         {
            $set: {
               summary: {
                  content: summary,
                  transcript: transcript,
                  expiresAt: moment().add(7, 'days').toDate(),
                  generatedAt: new Date(),
               },
            },
         },
         { new: true }
      );
   },
};
