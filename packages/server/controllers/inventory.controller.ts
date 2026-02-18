import _ from 'lodash';

import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { departmentRepository } from '../repositories/department.repository';
import { InventoryQuerySchema } from '../infrastructure/database/validators/inventory.validator';
import { inventoryRepository } from '../repositories/inventory.repository';

export const inventoryController = {
   async getInventory(req: Request, res: Response) {
      try {
         const query = InventoryQuerySchema.parse(req.query);
         const inventory = await inventoryRepository.getInventory(req.pagination, query);

         res.json({ data: inventory });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get inventory' });
      }
   },

   async createInventory(req: Request, res: Response) {
      try {
         const department = await departmentRepository.getOneDepartment(req.body.department);

         if (!department) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Department not found' });
         }

         const inventory = await inventoryRepository.createInventory(req.body);

         res.status(StatusCodes.CREATED).json({ data: inventory });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create inventory' });
      }
   },
};
