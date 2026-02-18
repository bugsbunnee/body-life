import type mongoose from 'mongoose';
import moment from 'moment';

import { Inventory, type IInventory } from '../infrastructure/database/models/inventory.model';

import type { IInventoryQuery } from '../infrastructure/database/validators/inventory.validator';
import type { Pagination } from '../infrastructure/lib/entities';

export const inventoryRepository = {
   buildInventoryFilterQuery(query: IInventoryQuery) {
      const filter: mongoose.QueryFilter<IInventory> = {};

      if (query.search) {
         filter.$or = [{ name: { $regex: query.search, $options: 'i' } }, { description: { $regex: query.search, $options: 'i' } }];
      }

      if (query.minPrice !== undefined || query.maxPrice !== undefined) {
         filter.unitPrice = {};

         if (query.minPrice !== undefined) {
            filter.unitPrice.$gte = query.minPrice;
         }

         if (query.maxPrice !== undefined) {
            filter.unitPrice.$lte = query.maxPrice;
         }
      }

      if (query.department) {
         filter.department = query.department;
      }

      if (query.datePurchasedStart || query.datePurchasedEnd) {
         filter.datePurchased = {};

         if (query.datePurchasedStart) {
            filter.datePurchased.$gte = query.datePurchasedStart;
         }

         if (query.datePurchasedEnd) {
            filter.datePurchased.$lte = query.datePurchasedEnd;
         }
      }

      return filter;
   },

   async aggregateInventoryByDepartment() {
      return Inventory.aggregate([
         {
            $group: {
               _id: '$department',
               totalQuantity: { $sum: '$quantity' },
               totalItems: { $sum: 1 },
               totalAmount: { $sum: { $multiply: ['$quantity', '$unitPrice'] } },
            },
         },
         {
            $lookup: {
               from: 'departments',
               localField: '_id',
               foreignField: '_id',
               as: 'department',
            },
         },
         {
            $unwind: '$department',
         },
         {
            $project: {
               _id: 0,
               departmentId: '$_id',
               departmentName: '$department.name',
               totalQuantity: 1,
               totalItems: 1,
               totalAmount: 1,
            },
         },
      ]);
   },

   async getInventory(pagination: Pagination, query: IInventoryQuery) {
      const filter = this.buildInventoryFilterQuery(query);

      const [aggregated, inventory, total] = await Promise.all([
         this.aggregateInventoryByDepartment(),

         Inventory.find(filter).populate({ path: 'department', select: '_id name' }).skip(pagination.offset).limit(pagination.pageSize).sort({ name: 1 }).lean().exec(),

         Inventory.countDocuments(filter),
      ]);

      return {
         data: inventory,
         aggregated,
         pagination: {
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
            totalCount: total,
            totalPages: Math.ceil(total / pagination.pageSize),
         },
      };
   },

   async createInventory(inventory: IInventory) {
      return Inventory.create({
         name: inventory.name,
         description: inventory.description,
         department: inventory.department,
         quantity: inventory.quantity,
         unitPrice: inventory.unitPrice,
         datePurchased: inventory.datePurchased,
      });
   },
};
