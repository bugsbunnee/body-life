import moment from 'moment';
import _ from 'lodash';

import type mongoose from 'mongoose';

import type { Request } from 'express';
import type { QueryFilter } from 'mongoose';
import type { Pagination } from '../infrastructure/lib/entities';

import { RequisitionQuerySchema, type IRequisitionCreate, type IRequisitionQuery } from '../infrastructure/database/validators/requisition.validator';
import { Requisition, type IRequisition } from '../infrastructure/database/models/requisition.model';
import { RequisitionStatus } from '../infrastructure/database/entities/enums/requisition-status.enum';
import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';

export const requisitionRepository = {
   buildFilterQuery(query: IRequisitionQuery) {
      const filter: QueryFilter<IRequisition> = {};

      if (query.search) {
         filter.description = { $regex: query.search, $options: 'i' };
      }

      if (query.status) {
         filter.status = query.status;
      }

      if (query.amountStart || query.amountEnd) {
         filter.amount = {};

         if (query.amountStart) {
            filter.amount.$gte = Number(query.amountStart);
         }

         if (query.amountEnd) {
            filter.amount.$lte = Number(query.amountEnd);
         }
      }

      if (query.startDate || query.endDate) {
         filter.createdAt = {};

         if (query.startDate) {
            filter.createdAt.$gte = moment(query.startDate).startOf('day').toDate();
         }

         if (query.amountEnd) {
            filter.createdAt.$lte = moment(query.endDate).startOf('day').toDate();
         }
      }

      if (query.department) {
         filter.department = query.department;
      }

      return filter;
   },

   checkRequisitionIsActioned(requisition: IRequisition) {
      return [RequisitionStatus.Approved, RequisitionStatus.Disbursed, RequisitionStatus.Rejected].includes(requisition.status);
   },

   parseRequisitionQueryFromRequest(req: Request) {
      const query = RequisitionQuerySchema.parse(req.query);

      if (req.admin.userRole !== UserRole.Pastor) {
         if (!req.admin.department) {
            throw new Error('Admin department is required to filter requisitions.');
         }

         query.department = req.admin.department;
      }

      return query;
   },

   async createRequisition(requisition: IRequisitionCreate) {
      return Requisition.create({
         description: requisition.description,
         requester: _.get(requisition, 'requester'),
         amount: requisition.amount,
         department: requisition.department,
      });
   },

   async getOneRequisition(requisitionId: mongoose.Types.ObjectId) {
      return Requisition.findById(requisitionId)
         .populate({ path: 'department', select: '_id name' })
         .populate({ path: 'actioner', select: '_id email firstName lastName' })
         .populate({ path: 'requester', select: '_id email firstName lastName' })
         .exec();
   },

   async getRequisitions(pagination: Pagination, query: IRequisitionQuery) {
      const filter = this.buildFilterQuery(query);

      const [requisitions, total] = await Promise.all([
         Requisition.find(filter)
            .skip(pagination.offset)
            .limit(pagination.pageSize)
            .populate({ path: 'department', select: '_id name' })
            .populate({ path: 'actioner', select: '_id email firstName lastName' })
            .populate({ path: 'requester', select: '_id email firstName lastName' })
            .sort({ createdAt: -1 })
            .lean()
            .exec(),

         Requisition.countDocuments(filter),
      ]);

      return {
         data: requisitions,
         pagination: {
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
            totalCount: total,
            totalPages: Math.ceil(total / pagination.pageSize),
         },
      };
   },
};
