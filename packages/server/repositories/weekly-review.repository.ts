import mongoose from 'mongoose';
import moment from 'moment';

import type { Pagination } from '../infrastructure/lib/entities';
import type { IWeeklyReviewCreate, IWeeklyReviewQuery } from '../infrastructure/database/validators/weekly-review.validator';

import { WeeklyReview, type IWeeklyReview } from '../infrastructure/database/models/weekly-review.model';

export const weeklyReviewRepository = {
   buildWeeklyFilterQuery(query: IWeeklyReviewQuery): mongoose.QueryFilter<IWeeklyReview> {
      const filter: mongoose.QueryFilter<IWeeklyReview> = {};

      if (query.service) {
         filter.serviceReport = query.service;
      }

      if (query.department) {
         filter.department = query.department;
      }

      if (query.startDate || query.endDate) {
         filter['serviceReport.serviceDate'] = {};

         if (query.startDate) {
            filter['serviceReport.serviceDate'].$gte = moment(query.startDate).startOf('day').toDate();
         }

         if (query.endDate) {
            filter['serviceReport.serviceDate'].$lte = moment(query.endDate).endOf('day').toDate();
         }
      }

      return filter;
   },

   async aggregateWeeklyReviewByServiceDate(pagination: Pagination, filter: mongoose.QueryFilter<IWeeklyReview>) {
      return WeeklyReview.aggregate<IWeeklyReview>([
         {
            $lookup: {
               from: 'servicereports',
               localField: 'serviceReport',
               foreignField: '_id',
               as: 'serviceReport',
            },
         },
         { $unwind: '$serviceReport' },
         {
            $match: filter,
         },
         {
            $lookup: {
               from: 'departments',
               localField: 'department',
               foreignField: '_id',
               as: 'department',
            },
         },
         { $unwind: '$department' },
         {
            $lookup: {
               from: 'admins',
               localField: 'submittedBy',
               foreignField: '_id',
               as: 'submittedBy',
            },
         },
         { $unwind: '$submittedBy' },
         {
            $sort: {
               'serviceReport.serviceDate': -1,
            },
         },
         { $skip: pagination.offset },
         { $limit: pagination.pageSize },
         {
            $project: {
               _id: 1,
               department: {
                  _id: '$department._id',
                  name: '$department.name',
               },
               submittedBy: {
                  _id: '$submittedBy._id',
                  firstName: '$submittedBy.firstName',
                  lastName: '$submittedBy.lastName',
               },
               fields: 1,
               feedback: 1,
               feedbackDueForActionAt: 1,
               submittedAt: 1,
               serviceDate: '$serviceReport.serviceDate',
            },
         },
      ]);
   },

   async aggregateWeeklyReviewCount(filter: mongoose.QueryFilter<IWeeklyReview>) {
      const [total] = await WeeklyReview.aggregate<{ total: number }>([
         { $lookup: { from: 'servicereports', localField: 'serviceReport', foreignField: '_id', as: 'serviceReport' } },
         { $unwind: '$serviceReport' },
         { $match: filter },
         { $count: 'total' },
      ]);

      return total ? total.total : 0;
   },

   async getWeeklyReview(pagination: Pagination, query: IWeeklyReviewQuery) {
      const filter = this.buildWeeklyFilterQuery(query);

      const [weeklyReviews, total] = await Promise.all([this.aggregateWeeklyReviewByServiceDate(pagination, filter), this.aggregateWeeklyReviewCount(filter)]);

      return {
         data: weeklyReviews,
         pagination: {
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
            totalCount: total,
            totalPages: Math.ceil(total / pagination.pageSize),
         },
      };
   },

   async createWeeklyReview(weeklyReview: IWeeklyReviewCreate, userId: mongoose.Types.ObjectId) {
      return WeeklyReview.create({
         serviceReport: weeklyReview.serviceReport,
         department: weeklyReview.department,
         fields: weeklyReview.fields,
         submittedAt: moment().toDate(),
         submittedBy: userId,
      });
   },
};
