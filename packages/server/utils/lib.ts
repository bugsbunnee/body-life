import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import moment from 'moment';
import parsePhoneNumberFromString from 'libphonenumber-js';

import { COUNTRY_CODE } from './constants';

import type { IUser } from '../infrastructure/database/models/user.model';
import type { ReportAnalysis } from '../infrastructure/database/entities/interfaces/report-analysis';
import type { IDateRange } from '../infrastructure/database/validators/base.validator';
import axios from 'axios';

export const lib = {
   cleanPhoneNumber(phoneNumber: string) {
      return phoneNumber.replace(/\+|\s+/g, '');
   },

   computeDifference(current: Record<string, number>, previous: Record<string, number>) {
      const updatedRecord: Record<string, ReportAnalysis> = {};

      for (const key in current) {
         const currentValue = current[key] ?? 0;
         const previousValue = previous[key] ?? 0;

         const difference = previousValue === 0 ? (currentValue > 0 ? 100 : 0) : ((currentValue - previousValue) / currentValue) * 100;
         const trend = currentValue > previousValue ? 'increment' : currentValue < previousValue ? 'decrement' : 'same';

         updatedRecord[key] = {
            current: currentValue,
            difference: difference.toFixed(2) + '%',
            trend,
         };
      }

      return updatedRecord;
   },

   formatDate(date: string | Date | number, format: string = 'DD MMM, YYYY') {
      return moment(date).format(format);
   },

   getBirthdayForUser(user: IUser) {
      const today = moment();
      const birthDate = moment(user.dateOfBirth).set('year', today.year());

      if (birthDate.isAfter(today)) {
         return birthDate.set('year', today.year() + 1);
      }

      return birthDate;
   },

   getDurationLabel(durationInDays: number) {
      if (durationInDays < 0) return '0 days';

      const dayMappings = [
         { unitInDays: 365, label: 'year' },
         { unitInDays: 30, label: 'month' },
         { unitInDays: 7, label: 'week' },
         { unitInDays: 1, label: 'day' },
      ];

      for (const day of dayMappings) {
         if (durationInDays >= day.unitInDays) {
            const count = Math.floor(durationInDays / day.unitInDays);
            return `${count} ${day.label}${count > 1 ? 's' : ''}`;
         }
      }

      return `${durationInDays} day${durationInDays > 1 ? 's' : ''}`;
   },

   getPreviousDateRange(range: IDateRange) {
      const differenceInDays = moment(range.endDate).diff(moment(range.startDate), 'day');
      const startDate = moment(range.startDate).subtract(differenceInDays, 'day').startOf('day').toDate();
      const endDate = moment(range.endDate).subtract(differenceInDays, 'day').startOf('day').toDate();

      return { differenceInDays, durationLabel: this.getDurationLabel(differenceInDays) + ' ago', startDate, endDate };
   },

   checkDateIsExpired(date: Date) {
      return moment().diff(moment(date), 'hour') < 1;
   },

   getObjectIdIsValid(objectId: string) {
      return mongoose.Types.ObjectId.isValid(objectId);
   },

   getErrorMessage(error: unknown) {
      if (axios.isAxiosError(error)) {
         return error.response?.data;
      }

      return (<Error>error).message;
   },

   async hashPassword(password: string) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      return hash;
   },

   parseObjectId(objectId: string) {
      return new mongoose.Types.ObjectId(objectId);
   },

   parsePhoneNumber(phoneNumber: string) {
      const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, COUNTRY_CODE);

      if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
         return '';
      }

      return this.cleanPhoneNumber(parsedPhoneNumber.number);
   },
};
