import moment from 'moment';
import mongoose from 'mongoose';

import type { QueryFilter } from 'mongoose';
import type { IUserQuery } from '../infrastructure/database/validators/user.validator';
import type { Pagination } from '../infrastructure/lib/entities';
import type { IDateRange } from '../infrastructure/database/validators/base.validator';

import { User, type IUser } from '../infrastructure/database/models/user.model';

export const userRepository = {
   buildMessageFilterQuery(query: IUserQuery) {
      const filter: QueryFilter<IUser> = {};

      if (query.search) {
         filter.$or = [
            { firstName: { $regex: query.search, $options: 'i' } },
            { lastName: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } },
            { address: { $regex: query.search, $options: 'i' } },
         ];
      }

      if (query.phoneNumber) {
         filter.phoneNumber = { $regex: query.phoneNumber, $options: 'i' };
      }

      if (query.gender) {
         filter.gender = query.gender;
      }

      if (query.maritalStatus) {
         filter.maritalStatus = query.maritalStatus;
      }

      if (query.workforce) {
         const isWorkforce = query.workforce.toLowerCase() === 'yes';
         filter.department = isWorkforce ? { $exists: true, $ne: null } : { $in: [null, undefined as any] };
      }

      if (query.dateOfBirthStart || query.dateOfBirthEnd) {
         filter.dateOfBirth = {};

         if (query.dateOfBirthStart) {
            filter.dateOfBirth.$gte = moment(query.dateOfBirthStart).startOf('day').toDate();
         }

         if (query.dateOfBirthEnd) {
            filter.dateOfBirth.$lte = moment(query.dateOfBirthEnd).endOf('day').toDate();
         }
      }

      if (query.department) {
         filter.department = query.department;
      }

      if (query.prayerCell) {
         filter.prayerCell = query.prayerCell;
      }

      return filter;
   },

   buildBirthdayFilterFromDateRange(range: IDateRange) {
      const start = moment(range.startDate);
      const end = moment(range.endDate);

      let monthDayList: { month: number; day: number }[] = [];
      let current = start.clone();

      while (current.isSameOrBefore(end, 'day')) {
         monthDayList.push({ month: current.month() + 1, day: current.date() }); // month() is 0-based
         current.add(1, 'day');
      }

      return monthDayList;
   },

   async bulkCreateUsers(users: IUser[]) {
      return User.insertMany(users);
   },

   async createUser(user: IUser) {
      return User.create({
         firstName: user.firstName,
         lastName: user.lastName,
         dateOfBirth: user.dateOfBirth,
         notes: user.notes,
         isFirstTimer: user.isFirstTimer,
         gender: user.gender,
         email: user.email,
         maritalStatus: user.maritalStatus,
         address: user.address,
         phoneNumber: user.phoneNumber,
         isSubscribedToNewsletter: true,
      });
   },

   async getUsers(pagination: Pagination, query: IUserQuery) {
      const filter = this.buildMessageFilterQuery(query);

      const [users, total] = await Promise.all([
         User.find(filter).skip(pagination.offset).limit(pagination.pageSize).sort({ dateJoined: -1, firstName: 1, lastName: 1 }).lean().exec(),

         User.countDocuments(filter),
      ]);

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

   async getUsersWithBirthdayInRange(pagination: Pagination, range: IDateRange) {
      const result = await User.aggregate([
         {
            $project: {
               _id: 1,
               firstName: 1,
               lastName: 1,
               email: 1,
               phoneNumber: 1,
               gender: 1,
               dateOfBirth: 1,
               month: { $month: '$dateOfBirth' },
               day: { $dayOfMonth: '$dateOfBirth' },
            },
         },
         {
            $match: {
               $or: this.buildBirthdayFilterFromDateRange(range),
            },
         },
         { $sort: { dateOfBirth: -1 } },
         {
            $facet: {
               paginatedResults: [{ $skip: pagination.offset }, { $limit: pagination.pageSize }],
               totalCount: [{ $count: 'count' }],
            },
         },
      ]);

      const data = result[0]?.paginatedResults || [];
      const totalCount = result[0]?.totalCount[0]?.count || 0;

      return {
         data,
         pagination: {
            pageSize: pagination.pageSize,
            pageNumber: pagination.pageNumber,
            totalCount,
            totalPages: Math.ceil(totalCount / pagination.pageSize),
         },
      };
   },

   async getUserInsights(range: IDateRange) {
      const endDate = moment(range.endDate).endOf('day').toDate();

      const [totalUsers, totalWorkforce, totalNonWorkforce] = await Promise.all([
         User.countDocuments({ createdAt: { $lte: endDate } }).exec(),
         User.countDocuments({ createdAt: { $lte: endDate }, department: { $exists: true, $ne: null } }).exec(),
         User.countDocuments({ createdAt: { $lte: endDate }, $or: [{ department: null }, { department: { $exists: false } }] }).exec(),
      ]);

      return {
         totalUsers,
         totalNonWorkforce,
         totalWorkforce,
      };
   },

   async getUsersForNewsletter() {
      return User.find({ isSubscribedToNewsletter: true }).sort({ createdAt: 1 });
   },

   async getOneUser({ email, phoneNumber }: Pick<IUser, 'email' | 'phoneNumber'>) {
      return User.findOne({ $or: [{ email }, { phoneNumber }] }).exec();
   },

   async getOneUserById(userId: mongoose.Types.ObjectId) {
      return User.findById(userId).exec();
   },

   async unsubscribeFromNewsletter(userId: mongoose.Types.ObjectId, reasonForUnsubscription: string) {
      return User.findByIdAndUpdate(userId, {
         $set: {
            isSubscribedToNewsletter: false,
            reasonForUnsubscription,
         },
      });
   },
};
