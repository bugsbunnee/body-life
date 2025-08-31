import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userRepository } from '../repositories/user.repository';

export const userController = {
   async createUser(req: Request, res: Response) {
      try {
         const user = await userRepository.createUser(req.body);
         res.status(StatusCodes.CREATED).json({ data: user });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed to create user',
         });
      }
   },
   async getUsers(req: Request, res: Response) {
      try {
         const users = await userRepository.getUsers();
         res.json({ data: users });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed to get users',
         });
      }
   },
};
