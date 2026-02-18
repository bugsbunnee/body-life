import type mongoose from 'mongoose';
import type { Pagination } from '../infrastructure/lib/entities';
import type { IDepartmentQuery } from '../infrastructure/database/validators/department.validator';

import { Department, type IDepartment } from '../infrastructure/database/models/department.model';

export const departmentRepository = {
   buildDepartmentFilterQuery(query: IDepartmentQuery) {
      const filter: mongoose.QueryFilter<IDepartment> = {};

      if (query.name) {
         filter.name = { $regex: query.name, $options: 'i' };
      }

      return filter;
   },

   async getOneDepartment(departmentId: mongoose.Types.ObjectId) {
      return Department.findById(departmentId).lean().exec();
   },

   async getDepartments(pagination: Pagination, query: IDepartmentQuery) {
      const filter = this.buildDepartmentFilterQuery(query);

      const [departments, total] = await Promise.all([
         Department.find(filter)
            .populate('totalMembership')
            .populate({ path: 'hod', select: '_id firstName lastName email' })
            .skip(pagination.offset)
            .limit(pagination.pageSize)
            .sort({ name: 1 })
            .lean({ virtuals: true })
            .exec(),

         Department.countDocuments(filter),
      ]);

      return {
         data: departments,
         pagination: {
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
            totalCount: total,
            totalPages: Math.ceil(total / pagination.pageSize),
         },
      };
   },

   async createDepartment(department: IDepartment) {
      return Department.create({
         name: department.name,
         hod: department.hod,
      });
   },
};
