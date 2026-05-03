import type mongoose from 'mongoose';

import type { CountryCode } from 'libphonenumber-js';
import type { IDateRange } from '../infrastructure/database/validators/base.validator';

import { lib } from './lib';
import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';

export const COUNTRY_CODE: CountryCode = 'NG';

export const CACHE_NAMES = {
   GET_NEWSLETTER_LIMIT: (date: string) => `newsletter:date=${date}`,
   GET_DAILY_MESSAGE_LIMIT: (date: string) => `daily-message:date=${date}`,
   GET_ADMIN_PERMISSION: (id: mongoose.Types.ObjectId) => `admin:permission:${id}`,
   GET_SERVICE_OVERVIEW: (range: IDateRange) => `report:overview:${lib.formatDate(range.startDate)}-${lib.formatDate(range.endDate)}`,
};

export const FEATURES = {
   ENABLE_CACHE: false,
};

export const HIGH_RANKING_ROLES = [UserRole.Pastor, UserRole.Admin, UserRole.Hod, UserRole.PrayerCellLeader];
export const DEFAULT_ROLES = [UserRole.Pastor, UserRole.Hod, UserRole.PrayerCellLeader, UserRole.Worker];
export const CORE_ROLES = [UserRole.Pastor, UserRole.Admin];

export const PASSWORD_RESET_TIME_IN_MINUTES = 60;
export const MB_IN_BYTES = 1_048_576;
export const FRONTEND_BASE_URL = 'https://admin.rcnlagosisland.com';
export const CHURCH_DISPLAY_NAME = 'RCNLagos Island Church';
