import _ from 'lodash';

import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { departmentRepository } from '../repositories/department.repository';
import { inventoryRepository } from '../repositories/inventory.repository';
import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';

export const inventoryController = {
   async getInventory(req: Request, res: Response) {
      try {
         const query = inventoryRepository.parseInventoryQueryFromRequest(req);
         const inventory = await inventoryRepository.getInventory(req.pagination, query);

         res.json({ data: inventory });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (<Error>ex).message });
      }
   },

   async createInventory(req: Request, res: Response) {
      try {
         if (req.admin.userRole === UserRole.Hod && req.body.department !== req.admin.department) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'You can only create inventory for your department.' });
         }

         const department = await departmentRepository.getOneDepartment(req.body.department);

         if (!department) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Department not found' });
         }

         const inventory = await inventoryRepository.createInventory(req.body);

         res.status(StatusCodes.CREATED).json({ data: inventory });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: (<Error>ex).message });
      }
   },
};
