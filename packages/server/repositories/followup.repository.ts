import moment from 'moment';

import type { IDateRange } from '../infrastructure/database/validators/base.validator';

import { FollowUpStatus } from '../infrastructure/database/entities/enums/follow-up-status.enum';
import { FollowUp, type IFollowUp } from '../infrastructure/database/models/followup.model';

export const followupRepository = {
   async createFollowUpEntry(followUp: Partial<IFollowUp>) {
      return FollowUp.create({
         user: followUp.user,
         assignedTo: followUp.assignedTo,
         serviceAttended: followUp.serviceAttended,
         feedback: followUp.feedback,
         preferredContactMethod: followUp.preferredContactMethod,
         wantsToJoinDepartment: false,
         status: FollowUpStatus.Pending,
         nextActionAt: moment().add(48, 'hours').toDate(),
         attempts: [],
      });
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
