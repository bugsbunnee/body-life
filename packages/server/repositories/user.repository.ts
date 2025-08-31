import type { IUser } from '../lib/schema';
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
   async getUsers(limit?: number) {
      return prisma.user.findMany({
         take: limit,
         orderBy: { createdAt: 'desc' },
      });
   },
};
