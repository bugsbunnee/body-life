import _ from 'lodash';

import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { DepartmentQuerySchema } from '../infrastructure/database/validators/department.validator';
import { departmentRepository } from '../repositories/department.repository';
import { userRepository } from '../repositories/user.repository';
import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';

export const departmentController = {
   async getDepartments(req: Request, res: Response) {
      try {
         const query = DepartmentQuerySchema.parse(req.query);
         const departments = await departmentRepository.getDepartments(req.pagination, query);

         res.json({ data: departments });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get departments' });
      }
   },

   async createDepartment(req: Request, res: Response) {
      try {
         let hod = await userRepository.getOneUserById(req.body.hod);

         if (!hod) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'HOD not found' });
         }

         const isAlreadyAssigned = [UserRole.Hod, UserRole.Pastor].includes(hod.userRole);

         if (!isAlreadyAssigned) {
            hod.userRole = UserRole.Hod;
            hod = await hod.save();
         }

         const department = await departmentRepository.createDepartment(req.body);

         res.status(StatusCodes.CREATED).json({ data: department });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create department' });
      }
   },
};
