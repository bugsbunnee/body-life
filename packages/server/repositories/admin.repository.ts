import mongoose from 'mongoose';

import { Role } from '../infrastructure/database/models/role.model';
import { User } from '../infrastructure/database/models/user.model';
import { FRONTEND_BASE_URL } from '../utils/constants';
import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';

export const adminRepository = {
   async getActiveAdminByEmail(email: string) {
      return User.findOne({ email, isAdmin: true }).exec();
   },

   async assignUserAsAdmin(userId: mongoose.Types.ObjectId) {
      return User.findByIdAndUpdate(userId, {
         $set: {
            isAdmin: true,
            adminActivatedAt: new Date(),
            imageUrl: FRONTEND_BASE_URL + '/images/admin.png',
         },
      }).exec();
   },

   async getFirstTimerReportAdmins() {
      return User.find({ userRole: { $in: [UserRole.Pastor, UserRole.Admin] } }).exec();
   },

   async getAdminForPasswordReset(token: string) {
      return User.findOne({
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
