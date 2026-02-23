import moment from 'moment';
import mongoose from 'mongoose';

import type { IProgramCreate, IProgramQuery } from '../infrastructure/database/validators/program.validator';
import type { Pagination } from '../infrastructure/lib/entities';

import { Program, type IProgram } from '../infrastructure/database/models/program.model';

export const programRepository = {
   buildProgramQuery(query: IProgramQuery) {
      const filter: mongoose.QueryFilter<IProgram> = {};

      if (query.search) {
         filter.$or = [
            { title: { $regex: query.search, $options: 'i' } },
            { description: { $regex: query.search, $options: 'i' } },
            { address: { $regex: query.search, $options: 'i' } },
         ];
      }

      if (query.startDate || query.endDate) {
         filter.scheduledFor = {};

         if (query.startDate) {
            filter.scheduledFor.$gte = moment(query.startDate).startOf('day').toDate();
         }

         if (query.endDate) {
            filter.scheduledFor.$lte = moment(query.endDate).endOf('day').toDate();
         }
      }

      return filter;
   },

   async createProgram(program: IProgramCreate & { imageUrl: string }) {
      return Program.create({
         title: program.title,
         address: program.address,
         description: program.description,
         imageUrl: program.imageUrl,
         scheduledFor: moment(program.scheduledFor).toDate(),
         isActive: true,
      });
   },

   async getPrograms(pagination: Pagination, query: IProgramQuery) {
      const filter = this.buildProgramQuery(query);

      const [programs, total] = await Promise.all([
         Program.find(filter).skip(pagination.offset).limit(pagination.pageSize).sort({ scheduledFor: -1 }).lean({ virtuals: true }).exec(),

         Program.countDocuments(filter),
      ]);

      return {
         data: programs,
         pagination: {
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
            totalCount: total,
            totalPages: Math.ceil(total / pagination.pageSize),
         },
      };
   },

   async getUpcomingPrograms() {
      return Program.find({ isActive: true, scheduledFor: { $gte: new Date() } })
         .sort({ scheduledFor: -1 })
         .limit(3)
         .exec();
   },

   async deactivateProgram(id: mongoose.Types.ObjectId) {
      return Program.findByIdAndUpdate(id, { $set: { isActive: false } }).exec();
   },
};
