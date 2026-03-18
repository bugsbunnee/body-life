import mongoose from 'mongoose';

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
import { USER_ROLES, UserRole } from '../entities/enums/user-role.enum';

interface TokenResponse {
   admin: Partial<IUser>;
   token: string;
   tokenExpiresAt: Date;
}

interface IUserMethods {
   generateAuthToken: () => TokenResponse;
   generatePasswordResetToken: () => string;
   sendWelcomeEmail: () => Promise<void>;
   sendPasswordSetupEmail: () => Promise<void>;
}

const userSchema = new mongoose.Schema(
   {
      firstName: { type: String, minlength: 3, required: true },
      lastName: { type: String, minlength: 3, required: true },
      email: { type: String, unique: true, required: true },
      phoneNumber: { type: String, unique: true, required: true },
      address: { type: String, minlength: 3, required: true },
      gender: { type: String, required: true },
      maritalStatus: { type: String, required: true },
      dateOfBirth: { type: Date, required: false },
      department: { type: mongoose.Schema.ObjectId, ref: 'Department', required: false },
      prayerCell: { type: mongoose.Schema.ObjectId, ref: 'PrayerCell', required: false },
      notes: { type: String, required: false },
      isFirstTimer: { type: Boolean, default: false },
      isSubscribedToNewsletter: { type: Boolean, default: true },
      reasonForUnsubscription: { type: String, required: false },

      userRole: { type: String, enum: USER_ROLES, default: UserRole.Member },
      imageUrl: { type: String, required: false },
      isAdmin: { type: Boolean, default: false },
      adminActivatedAt: { type: Date, required: false },
      adminDeactivatedAt: { type: Date, required: false },
      lastLoginAt: { type: Date, required: false },
      password: { type: String, required: false },
      otp: { type: String, required: false },
      otpExpiresAt: { type: Date, required: false },
      passwordResetToken: { type: String, default: null },
      passwordResetTokenExpiryDate: { type: Date, default: null },
   },
   {
      timestamps: true,
   }
);

export type IUser = mongoose.InferSchemaType<typeof userSchema> & {
   _id: mongoose.Types.ObjectId;
};

export type IUserDocument = IUser & Document & IUserMethods;

userSchema.methods.generateAuthToken = function () {
   const admin = _.omit(this.toObject(), ['roles', 'otp', 'otpExpiresAt', 'password']);
   const token = jwt.sign(admin, process.env.JWT_SECRET!, { expiresIn: '1h' });

   return { admin, token, tokenExpiresAt: moment().add(1, 'hour').toDate() };
};

userSchema.methods.generateResetPasswordToken = function () {
   const plainToken = crypto.randomBytes(32).toString('hex');
   const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');

   this.passwordResetToken = hashedToken;
   this.passwordResetTokenExpiryDate = moment().add(PASSWORD_RESET_TIME_IN_MINUTES, 'minutes').toDate();

   return plainToken;
};

userSchema.methods.getPermissions = async function () {
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

userSchema.methods.sendWelcomeEmail = async function () {
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

userSchema.methods.sendPasswordSetupEmail = async function () {
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

export const User = mongoose.model<IUserDocument>('User', userSchema);
