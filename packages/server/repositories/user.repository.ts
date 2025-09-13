import type { Pagination, SearchFilter } from '../infrastructure/lib/entities';
import type { User } from '../generated/prisma';
import type { IUser } from '../infrastructure/lib/schema';

import prisma from '../prisma/client';

export const userRepository = {
   async createUser(user: IUser) {
      return prisma.user.create({
         data: {
            firstName: user.firstName,
            lastName: user.lastName,
            birthDay: user.birthDay,
            gender: user.gender,
            email: user.email,
            maritalStatus: user.maritalStatus,
            address: user.address,
            phoneNumber: user.phoneNumber,
         },
      });
   },

   async getUsers(pagination: Pagination, filters: SearchFilter<User> = {}) {
      const where = filters.field && filters.search ? { [filters.field]: { contains: filters.search } } : undefined;

      const userQuery = prisma.user.findMany({
         where,
         take: pagination.pageSize,
         skip: pagination.offset,
         orderBy: { firstName: 'asc' },
      });

      const [users, total] = await Promise.all([userQuery, prisma.user.count({ where })]);

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

   async bulkCreateUsers(users: User[]) {
      return prisma.user.createMany({
         data: users,
      });
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
