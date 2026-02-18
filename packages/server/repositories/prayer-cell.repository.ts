import mongoose from 'mongoose';
import { PrayerCell, type IPrayerCell } from '../infrastructure/database/models/prayer-cell.model';
import type { Pagination } from '../infrastructure/lib/entities';
import type { IPrayerCellQuery } from '../infrastructure/database/validators/prayer-cell.validator';
import moment from 'moment';
import type { IDateRange } from '../infrastructure/database/validators/base.validator';

export const prayerCellRepository = {
   buildPrayerCellFilterQuery(query: IPrayerCellQuery) {
      const filter: mongoose.QueryFilter<IPrayerCell> = {};

      if (query.name) {
         filter.name = { $regex: query.name, $options: 'i' };
      }

      if (query.address) {
         filter.address = { $regex: query.address, $options: 'i' };
      }

      if (query.meetingDay) {
         filter.meetingDay = { $regex: query.meetingDay, $options: 'i' };
      }

      if (query.meetingTime) {
         filter.meetingTime = { $regex: query.meetingTime, $options: 'i' };
      }

      if (query.leader) {
         filter.leader = query.leader;
      }

      return filter;
   },

   async getOnePrayerCell(prayerCellId: mongoose.Types.ObjectId) {
      return PrayerCell.findById(prayerCellId).lean().exec();
   },

   async getPrayerCells(pagination: Pagination, query: IPrayerCellQuery) {
      const filter = this.buildPrayerCellFilterQuery(query);

      const [prayerCells, total] = await Promise.all([
         PrayerCell.find(filter)
            .populate('totalMembership')
            .populate('leader')
            .skip(pagination.offset)
            .limit(pagination.pageSize)
            .sort({ name: 1 })
            .lean({ virtuals: true })
            .exec(),

         PrayerCell.countDocuments(filter),
      ]);

      return {
         data: prayerCells,
         pagination: {
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
            totalCount: total,
            totalPages: Math.ceil(total / pagination.pageSize),
         },
      };
   },

   async createPrayerCell(prayerCell: IPrayerCell) {
      return PrayerCell.create({
         name: prayerCell.name,
         address: prayerCell.address,
         meetingDay: prayerCell.meetingDay,
         meetingTime: prayerCell.meetingTime,
         leader: prayerCell.leader,
      });
   },

   async getPrayerCellInsights(range: IDateRange) {
      const endDate = moment(range.endDate).endOf('day').toDate();
      const totalPrayerCells = await PrayerCell.countDocuments({ createdAt: { $lte: endDate } }).exec();

      return { totalPrayerCells };
   },
};
