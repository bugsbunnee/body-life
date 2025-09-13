import type { Request, Response } from 'express';
import _ from 'lodash';

import { StatusCodes } from 'http-status-codes';
import { userRepository } from '../repositories/user.repository';
import { parseUsersFromFile } from '../infrastructure/lib/utils';

import type { SearchFilter } from '../infrastructure/lib/entities';
import type { User } from '../generated/prisma';

export const userController = {
   async bulkCreateUsers(req: Request, res: Response) {
      if (!req.file) {
         res.status(StatusCodes.BAD_REQUEST).json({ error: 'Excel file missing!' });
         return;
      }

      const users = await parseUsersFromFile(req.file);
      const response = await userRepository.bulkCreateUsers(users as User[]);

      res.json(response);
   },

   async createUser(req: Request, res: Response) {
      try {
         let user = await userRepository.getOneUser(req.body);

         if (user) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: 'A user with the given phone number or email already exists!' });
            return;
         }

         user = await userRepository.createUser(req.body);

         res.status(StatusCodes.CREATED).json({ data: user, message: 'User added successfully!' });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed to create user',
         });
      }
   },

   async getUsers(req: Request, res: Response) {
      try {
         const filters = _.pick(req.query, ['search', 'field']);
         const users = await userRepository.getUsers(req.pagination, filters as SearchFilter<User>);

         res.json({ data: users });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed to get users',
         });
      }
   },
};
