import moment from 'moment';
import mongoose from 'mongoose';

import type { QueryFilter } from 'mongoose';
import type { Pagination } from '../infrastructure/lib/entities';
import type { IDateRange } from '../infrastructure/database/validators/base.validator';
import type { Request } from 'express';

import { UserQuerySchema, type IUserQuery, type IUserUpdate } from '../infrastructure/database/validators/user.validator';
import { User, type IUser } from '../infrastructure/database/models/user.model';
import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';

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

      if (query.userRole) {
         filter.userRole = query.userRole;
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
      const start = moment(range.startDate).startOf('day').set('year', moment().year());
      const end = moment(range.endDate).endOf('day').set('year', moment().year());

      let monthDayList: { month: number; day: number }[] = [];
      let current = start.clone();

      while (current.isSameOrBefore(end, 'minute')) {
         monthDayList.push({ month: current.month() + 1, day: current.date() }); // month() is 0-based
         current.add(1, 'day');
      }

      return monthDayList;
   },

   parseUserQueryFromRequest(req: Request) {
      const query = UserQuerySchema.parse(req.query);

      if (req.admin.userRole !== UserRole.Pastor) {
         if (req.admin.userRole === UserRole.Hod && req.admin.department) {
            query.department = req.admin.department!;
         }

         if (req.admin.userRole === UserRole.PrayerCellLeader && req.admin.prayerCell) {
            query.prayerCell = req.admin.prayerCell!;
         }
      }

      return query;
   },

   async bulkCreateUsers(users: IUser[]) {
      let usersToCreate = users;

      const existingUsers = await User.find({
         $or: [{ email: { $in: users.map((user) => user.email) } }, { phoneNumber: { $in: users.map((user) => user.phoneNumber) } }],
      });

      if (existingUsers.length > 0) {
         const emails = new Set(existingUsers.map((existing) => existing.email));
         const phoneNumbers = new Set(existingUsers.map((existing) => existing.phoneNumber));

         usersToCreate = users.filter((user) => !emails.has(user.email) && !phoneNumbers.has(user.phoneNumber));
      }

      return User.insertMany(usersToCreate);
   },

   async createUser(user: IUser) {
      return User.create({
         firstName: user.firstName,
         lastName: user.lastName,
         userRole: user.userRole ?? UserRole.Member,
         dateOfBirth: user.dateOfBirth,
         notes: user.notes,
         department: user.department,
         prayerCell: user.prayerCell,
         isFirstTimer: user.isFirstTimer,
         gender: user.gender,
         email: user.email,
         maritalStatus: user.maritalStatus,
         address: user.address,
         phoneNumber: user.phoneNumber,
         isSubscribedToNewsletter: true,
      });
   },

   async updateUser(userId: mongoose.Types.ObjectId, user: IUserUpdate) {
      return User.findByIdAndUpdate(userId, {
         $set: {
            firstName: user.firstName,
            lastName: user.lastName,
            userRole: user.userRole ?? UserRole.Member,
            dateOfBirth: user.dateOfBirth,
            notes: user.notes,
            department: user.department,
            prayerCell: user.prayerCell,
            gender: user.gender,
            email: user.email,
            maritalStatus: user.maritalStatus,
            address: user.address,
            phoneNumber: user.phoneNumber,
         },
      }).exec();
   },

   async getUsers(pagination: Pagination, query: IUserQuery) {
      const filter = this.buildMessageFilterQuery(query);

      const [users, total] = await Promise.all([
         User.find(filter)
            .skip(pagination.offset)
            .limit(pagination.pageSize)
            .populate({ path: 'department', select: '_id name' })
            .populate({ path: 'prayerCell', select: '_id name' })
            .sort({ dateJoined: -1, firstName: 1, lastName: 1 })
            .lean()
            .exec(),

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
         { $sort: { month: -1, day: -1 } },
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

   async updateUserRole(userId: mongoose.Types.ObjectId, userRole: UserRole) {
      return User.findByIdAndUpdate(userId, { $set: { userRole } }).exec();
   },
};
