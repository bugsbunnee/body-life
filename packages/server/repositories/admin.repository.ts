import mongoose from 'mongoose';

import { Admin } from '../infrastructure/database/models/admin.model';
import { Role } from '../infrastructure/database/models/role.model';

import type { IAdminCreate } from '../infrastructure/database/validators/auth.validator';

export const adminRepository = {
   async getActiveAdminByEmail(email: string) {
      return Admin.findOne({ email, isActive: true }).exec();
   },

   async createAdminAccount(admin: IAdminCreate) {
      return Admin.create({
         imageUrl: admin.imageUrl,
         firstName: admin.firstName,
         lastName: admin.lastName,
         email: admin.email,
         designation: admin.designation,
         password: 'something',
         isActive: true,
         roles: admin.roles,
      });
   },

   async getAdminForPasswordReset(token: string) {
      return Admin.findOne({
         passwordResetToken: token,
         passwordResetTokenExpiryDate: { $gt: Date.now() },
      }).exec();
   },

   async validateRoles(roles: mongoose.Types.ObjectId[]) {
      const matchedRoles = await Role.find({ _id: { $in: roles } });

      return {
         success: matchedRoles.length === roles.length,
         matchedRoles,
         baseRoles: roles,
      };
   },
};
