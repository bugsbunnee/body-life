import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { serviceReportRepository } from '../repositories/service-report.repository';
import { lib } from '../utils/lib';
import { CACHE_NAMES } from '../utils/constants';
import { dateRangeSchema } from '../infrastructure/database/validators/base.validator';

import { messageRepository } from '../repositories/message.repository';
import { userRepository } from '../repositories/user.repository';

import redisService from '../services/redis.service';
import { followupRepository } from '../repositories/followup.repository';

export const serviceReportController = {
   async getServiceReportOverview(req: Request, res: Response) {
      const currentDateRange = dateRangeSchema.parse(req.query);
      const previousDateRange = lib.getPreviousDateRange(currentDateRange);

      const cacheKey = CACHE_NAMES.GET_SERVICE_OVERVIEW(currentDateRange);
      const dashboard = await redisService.retrieveItem(cacheKey);

      if (dashboard) {
         return res.json(dashboard);
      }

      const [attendanceTrend, userBirthdays, currentUserInsights, previousUserInsights, uncontactedFirstTimers, currentFirstTimersInsight, previousFirstTimerInsights] =
         await Promise.all([
            serviceReportRepository.getServiceReportAttendanceTrend(currentDateRange),
            userRepository.getUsersWithBirthdayInRange({ pageNumber: 1, pageSize: 10, offset: 0 }, currentDateRange),

            userRepository.getUserInsights(currentDateRange),
            userRepository.getUserInsights(previousDateRange),

            followupRepository.getUncontactedFirstTimers(currentDateRange, 5),
            followupRepository.getFirstTimersInsight(currentDateRange),
            followupRepository.getFirstTimersInsight(previousDateRange),
         ]);

      const response = {
         attendanceTrend,
         userBirthdays,
         uncontactedFirstTimers,
         userInsights: lib.computeDifference(currentUserInsights, previousUserInsights),
         firstTimerInsights: lib.computeDifference(currentFirstTimersInsight, previousFirstTimerInsights),
         metadata: {
            currentStartDate: currentDateRange.startDate,
            currentEndDate: currentDateRange.endDate,
            durationLabel: previousDateRange.durationLabel,
            differenceInDays: previousDateRange.differenceInDays,
            previousStartDate: previousDateRange.startDate,
            previousEndDate: previousDateRange.endDate,
         },
      };

      await redisService.storeItem(cacheKey, response, 120);

      res.json(response);
   },

   async getServiceReportByDateRange(req: Request, res: Response) {
      const query = dateRangeSchema.parse(req.query);
      const result = await serviceReportRepository.getServiceReportByDateRange(req.pagination, query);

      return res.json(result);
   },

   async createServiceReport(req: Request, res: Response) {
      const [message, prepPrayers, worship] = await Promise.all([
         messageRepository.getMessage(req.body.message),
         userRepository.getOneUserById(req.body.prepPrayers),
         userRepository.getOneUserById(req.body.worship),
      ]);

      if (!message) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid Message Provided' });
      }

      if (!prepPrayers) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid User Provided for Prep Prayers' });
      }

      if (!worship) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid User Provided for Worship!' });
      }

      const result = await serviceReportRepository.createServiceReport(req.body);

      res.status(StatusCodes.CREATED).json(result);
   },
};
