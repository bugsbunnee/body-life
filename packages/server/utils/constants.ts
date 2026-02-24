import type { CountryCode } from 'libphonenumber-js';
import type mongoose from 'mongoose';
import type { IDateRange } from '../infrastructure/database/validators/base.validator';

import { lib } from './lib';

export const COUNTRY_CODE: CountryCode = 'NG';

export const CACHE_NAMES = {
   GET_ADMIN_PERMISSION: (id: mongoose.Types.ObjectId) => `admin:permission:${id}`,
   GET_SERVICE_OVERVIEW: (range: IDateRange) => `report:overview:${lib.formatDate(range.startDate)}-${lib.formatDate(range.endDate)}`,
};

export const PASSWORD_RESET_TIME_IN_MINUTES = 60;
export const FRONTEND_BASE_URL = 'https://body-life-client.vercel.app';
export const MB_IN_BYTES = 1_048_576;
export const CHURCH_DISPLAY_NAME = 'RCNLagos Island Church';

export const FEATURES = {
   ENABLE_CACHE: false,
};
