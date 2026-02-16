import _ from 'lodash';

import type { Request, Response } from 'express';
import type { IUser } from '../infrastructure/database/models/user.model';

import { StatusCodes } from 'http-status-codes';
import { userRepository } from '../repositories/user.repository';
import { parseUsersFromFile } from '../infrastructure/lib/utils';

import { UserQuerySchema } from '../infrastructure/database/validators/user.validator';
import { departmentRepository } from '../repositories/department.repository';
import { prayerCellRepository } from '../repositories/prayer-cell.repository';
import { communicationService } from '../services/communication.service';
import { followupRepository } from '../repositories/followup.repository';
import { serviceReportRepository } from '../repositories/service-report.repository';

export const userController = {
   async bulkCreateUsers(req: Request, res: Response) {
      if (!req.file) {
         res.status(StatusCodes.BAD_REQUEST).json({ message: 'Excel file missing!' });
         return;
      }

      const users = await parseUsersFromFile(req.file);
      const response = await userRepository.bulkCreateUsers(users as IUser[]);

      res.json(response);
   },

   async createUser(req: Request, res: Response) {
      try {
         let user = await userRepository.getOneUser(req.body);

         if (user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'A user with the given phone number or email already exists!' });
         }

         if (req.body.department) {
            const department = await departmentRepository.getOneDepartment(req.body.department);

            if (!department) {
               return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid department provided.' });
            }

            req.body.department = department._id;
         }

         if (req.body.prayerCell) {
            const prayerCell = await prayerCellRepository.getOnePrayerCell(req.body.prayerCell);

            if (!prayerCell) {
               return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid prayer cell provided.' });
            }

            req.body.prayerCell = prayerCell._id;
         }

         user = await userRepository.createUser(req.body);

         if (user.isFirstTimer) {
            const [assignedTo, serviceReport] = await Promise.all([
               userRepository.getOneUserById(req.body.assignTo),
               serviceReportRepository.getOneServiceReportById(req.body.serviceAttended),
            ]);

            if (!assignedTo) {
               return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid follow up contact provided.' });
            }

            if (!serviceReport) {
               return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid service report provided.' });
            }

            await Promise.all([
               followupRepository.createFollowUpEntry({
                  user: user._id,
                  assignedTo: assignedTo._id,
                  serviceAttended: serviceReport._id,
                  feedback: user.notes,
                  preferredContactMethod: req.body.preferredContactMethod,
               }),

               communicationService.sendOutWelcomeEmail(user),
            ]);
         }

         res.status(StatusCodes.CREATED).json({ data: user, message: 'User added successfully!' });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to create user',
         });
      }
   },

   async getUsers(req: Request, res: Response) {
      try {
         const query = UserQuerySchema.parse(req.query);
         const users = await userRepository.getUsers(req.pagination, query);

         res.json({ data: users });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to get users',
         });
      }
   },
};
