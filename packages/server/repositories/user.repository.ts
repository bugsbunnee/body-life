import { email } from 'zod';
import type { Pagination } from '../infrastructure/lib/entities';
import type { IUser } from '../infrastructure/lib/schema';
import prisma from '../prisma/client';

export const userRepository = {
   async createUser(user: IUser) {
      return prisma.user.create({
         data: {
            firstName: user.firstName,
            lastName: user.lastName,
            birthDay: user.birthDay,
            email: user.email,
            address: user.address,
            phoneNumber: user.phoneNumber,
         },
      });
   },

   async getUsers(pagination: Pagination) {
      const userQuery = prisma.user.findMany({
         take: pagination.pageSize,
         skip: pagination.offset,
         orderBy: { createdAt: 'desc' },
      });

      const [users, total] = await Promise.all([userQuery, prisma.user.count()]);

      return {
         data: users,
         pagination: {
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
            totalCount: total,
            totalPages: Math.ceil(total / pagination.pageSize),
         },
      };
   },

   async getAllUsers() {
      return prisma.user.findMany({
         orderBy: { createdAt: 'desc' },
      });
   },

   async getOneUser(user: IUser) {
      return prisma.user.findFirst({
         where: {
            OR: [{ email: user.email }, { phoneNumber: user.phoneNumber }],
         },
      });
   },
};
