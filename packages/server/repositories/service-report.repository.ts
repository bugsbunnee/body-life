import moment from 'moment';
import mongoose from 'mongoose';

import type { PipelineStage, QueryFilter } from 'mongoose';
import type { IDateRange } from '../infrastructure/database/validators/base.validator';
import type { ServiceReportOverview } from '../infrastructure/database/entities/interfaces/service-report';
import type { Pagination } from '../infrastructure/lib/entities';

import { ServiceReport, type IServiceReport } from '../infrastructure/database/models/service-report.model';

export const serviceReportRepository = {
   buildReportFilterQuery(range: IDateRange) {
      const filter: QueryFilter<IServiceReport> = {};

      if (range.startDate || range.endDate) {
         filter.serviceDate = {};

         if (range.startDate) {
            filter.serviceDate.$gte = moment(range.startDate).startOf('day').toDate();
         }

         if (range.endDate) {
            filter.serviceDate.$lte = moment(range.endDate).endOf('day').toDate();
         }
      }

      return filter;
   },

   async getServiceReportOverviewByDateRange(range: IDateRange): Promise<ServiceReportOverview> {
      const startDate = moment(range.startDate).startOf('day').toDate();
      const endDate = moment(range.endDate).startOf('day').toDate();

      const [overview] = await ServiceReport.aggregate<ServiceReportOverview>([
         {
            $match: {
               serviceDate: {
                  $gte: startDate,
                  $lte: endDate,
               },
            },
         },

         {
            $project: {
               totalAdults: { $sum: '$counts.adults' },
               totalChildren: { $sum: '$counts.children' },
               firstTimerCount: 1,
               offering: 1,
            },
         },

         {
            $group: {
               _id: null,
               totalAdults: { $sum: '$totalAdults' },
               totalChildren: { $sum: '$totalChildren' },
               firstTimers: { $sum: '$firstTimerCount' },
               offering: { $sum: '$offering' },
            },
         },

         {
            $project: {
               _id: 0,
               totalAdults: 1,
               totalChildren: 1,
               totalAttendance: { $add: ['$totalAdults', '$totalChildren'] },
               firstTimers: 1,
               offering: 1,
            },
         },
      ]);

      if (!overview) {
         return {
            totalAdults: 0,
            totalChildren: 0,
            totalAttendance: 0,
            firstTimers: 0,
            offering: 0,
         };
      }

      return overview;
   },

   async getServiceReportByDateRange(pagination: Pagination, range: IDateRange) {
      const filter = this.buildReportFilterQuery(range);

      const [reports, total] = await Promise.all([
         ServiceReport.find(filter)
            .skip(pagination.offset)
            .limit(pagination.pageSize)
            .populate({ path: 'message', select: '_id title preacher', populate: { path: 'preacher', select: '_id firstName lastName email' } })
            .populate({ path: 'prepPrayers', select: '_id firstName lastName email' })
            .populate({ path: 'worship', select: '_id firstName lastName email' })
            .sort({ serviceDate: -1 })
            .lean({ virtuals: true })
            .exec(),

         ServiceReport.countDocuments(filter),
      ]);

      return {
         data: reports,
         pagination: {
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
            totalCount: total,
            totalPages: Math.ceil(total / pagination.pageSize),
         },
      };
   },

   async getServiceReportAttendanceTrend(range: IDateRange) {
      const startDate = moment(range.startDate).startOf('day').toDate();
      const endDate = moment(range.endDate).startOf('day').toDate();

      return ServiceReport.find({ serviceDate: { $gte: startDate, $lte: endDate } })
         .select('serviceDate totalAttendance')
         .sort({ serviceDate: -1 })
         .lean({ virtuals: true })
         .exec();
   },

   async getOneServiceReportById(serviceReportId: mongoose.Types.ObjectId) {
      return ServiceReport.findById(serviceReportId).lean().exec();
   },

   async createServiceReport(serviceReport: IServiceReport) {
      return ServiceReport.create({
         serviceDate: serviceReport.serviceDate,
         message: serviceReport.message,
         prepPrayers: serviceReport.prepPrayers,
         worship: serviceReport.worship,
         seatArrangementCount: serviceReport.seatArrangementCount,
         firstTimerCount: serviceReport.firstTimerCount,
         offering: serviceReport.offering,
         counts: serviceReport.counts,
      });
   },
};
