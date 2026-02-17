import moment from 'moment';
import mongoose from 'mongoose';

import { FollowUpStatus } from '../infrastructure/database/entities/enums/follow-up-status.enum';
import { FollowUp, type IFollowUp } from '../infrastructure/database/models/followup.model';

import type { QueryFilter } from 'mongoose';
import type { IDateRange } from '../infrastructure/database/validators/base.validator';
import type { Pagination } from '../infrastructure/lib/entities';
import type { IFollowUpQuery, IFollowUpUpdate } from '../infrastructure/database/validators/followup.validator';

export const followupRepository = {
   buildMessageFilterQuery(query: IFollowUpQuery) {
      const filter: QueryFilter<IFollowUp> = {};

      if (query.user) {
         filter.user = query.user;
      }

      if (query.assignedTo) {
         filter.assignedTo = query.assignedTo;
      }

      if (query.serviceAttended) {
         filter.serviceAttended = query.serviceAttended;
      }

      if (query.status) {
         filter.status = query.status;
      }

      if (query.preferredContactMethod) {
         filter.preferredContactMethod = query.preferredContactMethod;
      }

      if (query.wantsToJoinDepartment !== undefined) {
         filter.wantsToJoinDepartment = query.wantsToJoinDepartment;
      }

      if (query.dateJoinedStart || query.dateJoinedEnd) {
         filter.createdAt = {};

         if (query.dateJoinedStart) {
            filter.createdAt.$gte = moment(query.dateJoinedStart).startOf('day').toDate();
         }

         if (query.dateJoinedEnd) {
            filter.createdAt.$lte = moment(query.dateJoinedEnd).endOf('day').toDate();
         }
      }

      return filter;
   },

   async createFollowUpEntry(followUp: Partial<IFollowUp>) {
      return FollowUp.create({
         user: followUp.user,
         assignedTo: followUp.assignedTo,
         serviceAttended: followUp.serviceAttended,
         feedback: followUp.feedback,
         preferredContactMethod: followUp.preferredContactMethod,
         wantsToJoinDepartment: false,
         status: FollowUpStatus.Assigned,
         nextActionAt: followUp.nextActionAt,
         attempts: [],
      });
   },

   async getFirstTimers(pagination: Pagination, query: IFollowUpQuery) {
      const filter = this.buildMessageFilterQuery(query);

      const [firstTimers, total] = await Promise.all([
         FollowUp.find(filter)
            .skip(pagination.offset)
            .populate({ path: 'user', select: '_id firstName lastName phoneNumber' })
            .populate({ path: 'attempts', populate: { path: 'contactedBy', select: '_id firstName lastName phoneNumber' } })
            .populate({ path: 'serviceAttended', select: '_id serviceDate' })
            .populate({ path: 'assignedTo', select: '_id firstName lastName phoneNumber' })
            .limit(pagination.pageSize)
            .sort({ createdAt: -1 })
            .lean()
            .exec(),

         FollowUp.countDocuments(filter),
      ]);

      return {
         data: firstTimers,
         pagination: {
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
            totalCount: total,
            totalPages: Math.ceil(total / pagination.pageSize),
         },
      };
   },

   async updateFirstTimer(followUpId: mongoose.Types.ObjectId, followUp: IFollowUpUpdate) {
      return FollowUp.findByIdAndUpdate(
         followUpId,
         {
            $set: {
               feedback: followUp.response,
               wantsToJoinDepartment: followUp.wantsToJoinDepartment,
               status: followUp.status,
               closedAt: followUp.status === FollowUpStatus.Integrated ? new Date() : undefined,
            },
            $push: {
               attempts: {
                  contactedBy: followUp.contactedBy,
                  contactedAt: followUp.contactedAt,
                  channel: followUp.channel,
                  successful: followUp.successful,
                  response: followUp.response,
               },
            },
         },
         { new: true }
      );
   },

   async getFirstTimersInsight(range: IDateRange) {
      const startDate = moment(range.startDate).startOf('day').toDate();
      const endDate = moment(range.endDate).startOf('day').toDate();

      const [totalFirstTimers, uncontactedFirstTimers, overdueFollowUp, contactsMade] = await Promise.all([
         FollowUp.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } }).exec(),

         FollowUp.countDocuments({ createdAt: { $gte: startDate, $lte: endDate }, attempts: { $size: 0 } }).exec(),

         FollowUp.countDocuments({ createdAt: { $gte: startDate, $lte: endDate }, nextActionAt: { $lt: new Date() }, status: { $ne: FollowUpStatus.Integrated } }).exec(),

         FollowUp.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate },
            attempts: { $elemMatch: { successful: true, contactedAt: { $gte: startDate, $lte: endDate } } },
         }).exec(),
      ]);

      return {
         totalFirstTimers,
         uncontactedFirstTimers,
         overdueFollowUp,
         contactsMade,
      };
   },

   async getUncontactedFirstTimers(range: IDateRange, limit: number) {
      const startDate = moment(range.startDate).startOf('day').toDate();
      const endDate = moment(range.endDate).startOf('day').toDate();

      return FollowUp.aggregate([
         {
            $match: { attempts: { $size: 0 } },
         },
         {
            $lookup: {
               from: 'servicereports',
               localField: 'serviceAttended',
               foreignField: '_id',
               as: 'service',
            },
         },
         { $unwind: '$service' },
         {
            $match: { 'service.serviceDate': { $gte: startDate, $lte: endDate } },
         },
         {
            $lookup: {
               from: 'users',
               localField: 'user',
               foreignField: '_id',
               as: 'user',
            },
         },
         { $unwind: '$user' },
         {
            $project: {
               _id: 1,
               feedback: 1,
               status: 1,
               preferredContactMethod: 1,
               'user._id': 1,
               'user.firstName': 1,
               'user.lastName': 1,
               'user.phoneNumber': 1,
               'service._id': 1,
               'service.serviceDate': 1,
            },
         },
         { $sort: { 'service.serviceDate': -1 } },
         { $limit: limit },
      ]);
   },
};
