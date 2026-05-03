import moment from 'moment';
import _ from 'lodash';

import type { Request, Response } from 'express';
import type { IUser } from '../infrastructure/database/models/user.model';
import type { IFollowUp } from '../infrastructure/database/models/followup.model';

import { StatusCodes } from 'http-status-codes';
import { parseUsersFromFile } from '../infrastructure/lib/utils';

import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';
import { communicationService } from '../services/communication.service';

import { departmentRepository } from '../repositories/department.repository';
import { prayerCellRepository } from '../repositories/prayer-cell.repository';
import { followupRepository } from '../repositories/followup.repository';
import { userRepository } from '../repositories/user.repository';

import { lib } from '../utils/lib';
import { smsService } from '../services/sms.service';
import { userService } from '../services/user.service';

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

            req.body.userRole = UserRole.Worker;
            req.body.department = department._id;
         }

         if (req.body.prayerCell) {
            const prayerCell = await prayerCellRepository.getOnePrayerCell(req.body.prayerCell);

            if (!prayerCell) {
               return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid prayer cell provided.' });
            }

            req.body.prayerCell = prayerCell._id;
         }

         const result = await userService.validateFollowUpPayload(req.body);

         if (!result.success) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: result.message });
         }

         user = await userRepository.createUser(req.body);

         if (result.followUpPayload) {
            const followUpPayload = {
               user: user._id,
               feedback: user.notes,
               assignedTo: result.followUpPayload.assignedTo._id,
               serviceAttended: result.followUpPayload.serviceAttended._id,
               preferredContactMethod: req.body.preferredContactMethod,
               nextActionAt: moment().add(48, 'hours').toDate(),
            };

            await Promise.all([
               followupRepository.createFollowUpEntry(followUpPayload),

               communicationService.sendOutFollowUpAssignmentEmail(result.followUpPayload.assignedTo, user, <IFollowUp>followUpPayload),
               communicationService.sendOutWelcomeEmail(user),

               smsService.sendWelcomeSMS(user),

               smsService.sendFollowUpSMS({
                  userFirstName: result.followUpPayload.assignedTo.firstName,
                  userPhoneNumber: result.followUpPayload.assignedTo.phoneNumber,
                  firstTimerPreferredContactMethod: followUpPayload.preferredContactMethod,
                  firstTimerAssignedAt: new Date(),
                  firstTimerFirstName: user.firstName,
                  firstTimerLastName: user.lastName,
                  firstTimerPhoneNumber: user.phoneNumber,
               }),
            ]);
         }

         res.status(StatusCodes.CREATED).json({ data: user, message: 'User added successfully!' });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create user' });
      }
   },

   async updateUser(req: Request, res: Response) {
      try {
         let userId = lib.parseObjectId(req.params.id!);
         let user = await userRepository.getOneUserById(userId);

         if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'The user with the given id does not exist!' });
         }

         if (req.body.department) {
            const department = await departmentRepository.getOneDepartment(req.body.department);

            if (!department) {
               return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid department provided.' });
            }

            req.body.userRole = UserRole.Worker;
            req.body.department = department._id;
         }

         if (req.body.prayerCell) {
            const prayerCell = await prayerCellRepository.getOnePrayerCell(req.body.prayerCell);

            if (!prayerCell) {
               return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid prayer cell provided.' });
            }

            req.body.prayerCell = prayerCell._id;
         }

         user = await userRepository.updateUser(user._id, req.body);

         res.json({ data: user, message: 'User updated successfully!' });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to update the user',
         });
      }
   },

   async getUsers(req: Request, res: Response) {
      try {
         const query = userRepository.parseUserQueryFromRequest(req);
         const users = await userRepository.getUsers(req.pagination, query);

         res.json({ data: users });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to get users',
         });
      }
   },

   async unsubscribeFromNewsletter(req: Request, res: Response) {
      try {
         const userId = lib.parseObjectId(req.params.id!);
         const user = await userRepository.unsubscribeFromNewsletter(userId, req.body.reason);

         if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'The user with the given ID does not exist!' });
         }

         res.json({ success: true, message: 'Unsubscribed from newsletter successfully!' });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to unsubscribe from newsletter',
         });
      }
   },

   async updateUserRole(req: Request, res: Response) {
      let userId = lib.parseObjectId(req.params.id!);
      let user = await userRepository.getOneUserById(userId);

      if (!user) {
         return res.status(StatusCodes.NOT_FOUND).json({ message: 'The user with the given ID does not exist!' });
      }

      if (user.userRole === req.body.userRole) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'The user already has the specified role.' });
      }

      if (!user.department) {
         if (req.body.userRole === UserRole.Hod) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'The user is a Head of Department but does not belong to a department.' });
         }

         if (req.body.userRole === UserRole.Worker) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'The user is a Worker but does not belong to a department.' });
         }
      }

      if (!user.prayerCell) {
         if (req.body.userRole === UserRole.PrayerCellLeader) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'The user is a Prayer Cell Leader but does not belong to a prayer cell.' });
         }
      }

      user.userRole = req.body.userRole;
      user = await user.save();

      res.json({ success: true, message: 'Role updated successfully!' });
   },
};
