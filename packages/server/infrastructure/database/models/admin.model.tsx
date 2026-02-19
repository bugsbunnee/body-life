import { Document, Schema, model, type InferSchemaType } from 'mongoose';

import _ from 'lodash';
import crypto from 'crypto';
import moment from 'moment';
import jwt from 'jsonwebtoken';

import RecentLoginEmail from '../../emails/recent-login';
import SetupPasswordEmail from '../../emails/reset-password';
import logger from '../../../services/logger.service';
import redisService from '../../../services/redis.service';

import { CACHE_NAMES, FRONTEND_BASE_URL, PASSWORD_RESET_TIME_IN_MINUTES } from '../../../utils/constants';
import { lib } from '../../../utils/lib';
import { emailService } from '../../../services/email.service';

interface TokenResponse {
   admin: Partial<IAdmin>;
   token: string;
   tokenExpiresAt: Date;
}

interface IAdminMethods {
   generateAuthToken: () => TokenResponse;
   generatePasswordResetToken: () => string;
   sendWelcomeEmail: () => Promise<void>;
   sendPasswordSetupEmail: () => Promise<void>;
}

const adminSchema = new Schema(
   {
      imageUrl: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      designation: { type: String, required: true },
      password: { type: String, required: true },
      otp: { type: String, required: false },
      otpExpiresAt: { type: Date, required: false },
      passwordResetToken: { type: String, default: null },
      passwordResetTokenExpiryDate: { type: Date, default: null },
      isActive: { type: Boolean, default: true },
      deactivatedAt: { type: Date, required: false },
      lastLoginAt: { type: Date, required: false },
      roles: [{ type: Schema.ObjectId, ref: 'Role' }],
   },
   { timestamps: true }
);

export type IAdmin = InferSchemaType<typeof adminSchema>;

export type IAdminDocument = IAdmin & Document & IAdminMethods;

adminSchema.methods.generateAuthToken = function () {
   const admin = _.omit(this.toObject(), ['roles', 'otp', 'otpExpiresAt', 'password']);
   const token = jwt.sign(admin, process.env.JWT_SECRET!, { expiresIn: '1h' });

   return { admin, token, tokenExpiresAt: moment().add(1, 'hour').toDate() };
};

adminSchema.methods.generateResetPasswordToken = function () {
   const plainToken = crypto.randomBytes(32).toString('hex');
   const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');

   this.passwordResetToken = hashedToken;
   this.passwordResetTokenExpiryDate = moment().add(PASSWORD_RESET_TIME_IN_MINUTES, 'minutes').toDate();

   return plainToken;
};

adminSchema.methods.getPermissions = async function () {
   const cacheKey = CACHE_NAMES.GET_ADMIN_PERMISSION(this._id);
   const permissions = await redisService.retrieveItem(cacheKey);

   if (permissions) {
      return permissions;
   }

   const actionNames = await this.populate({
      path: 'roles',
      populate: { path: 'actions', select: 'name' },
   });
};

adminSchema.methods.sendWelcomeEmail = async function () {
   this.lastLoginAt = moment().toDate();

   const admin = await this.save();

   try {
      await emailService.sendSingleEmail({
         to: this.email,
         subject: `Recent Login`,
         react: <RecentLoginEmail userFirstName={this.firstName} loginDate={lib.formatDate(admin.lastLoginAt)} />,
      });
   } catch (error) {
      logger.error('Failed to send welcome email', error);
   }
};

adminSchema.methods.sendPasswordSetupEmail = async function () {
   const token = this.generateResetPasswordToken();
   const url = `${FRONTEND_BASE_URL}/reset-password?token=${token}`;

   try {
      await emailService.sendSingleEmail({
         to: this.email,
         subject: `Setup your password`,
         react: <SetupPasswordEmail userFirstName={this.firstName} verificationUrl={url} expiryTimeInMinutes={PASSWORD_RESET_TIME_IN_MINUTES} />,
      });
   } catch (error) {
      this.passwordResetToken = null;
      this.passwordResetTokenExpiryDate = null;

      logger.error('Failed to send password setup email...', error);
   }

   await this.save();
};

export const Admin = model<IAdminDocument>('Admin', adminSchema);
