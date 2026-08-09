import moment from 'moment';

import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { WeeklyReviewQuerySchema } from '../infrastructure/database/validators/weekly-review.validator';

import { departmentRepository } from '../repositories/department.repository';
import { serviceReportRepository } from '../repositories/service-report.repository';
import { weeklyReviewRepository } from '../repositories/weekly-review.repository';
import { lib } from '../utils/lib';
import { CORE_ROLES } from '../utils/constants';

export const weeklyReviewController = {
   async createWeeklyReview(req: Request, res: Response) {
      try {
         const [department, serviceReport] = await Promise.all([
            departmentRepository.getOneDepartment(req.body.department),
            serviceReportRepository.getOneServiceReportById(req.body.serviceReport),
         ]);

         if (!department) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid department provided.' });
         }

         if (!serviceReport) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid service report provided.' });
         }

         if (!CORE_ROLES.includes(req.admin.userRole) && department._id.toString() !== `${req.admin.department}`) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'You can only submit a weekly report for your own department.' });
         }

         req.body.department = department._id;
         req.body.serviceReport = serviceReport._id;

         console.log(req.body);

         const weeklyReview = await weeklyReviewRepository.createWeeklyReview(req.body, req.admin._id);
         const formattedDate = moment(serviceReport.serviceDate).format('YYYY MM, DD');

         await weeklyReview.sendWeeklyReviewEmail(department.name, formattedDate);

         res.status(StatusCodes.CREATED).json({ data: weeklyReview, message: 'Report added successfully!' });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to save the report',
         });
      }
   },

   async getWeeklyReviews(req: Request, res: Response) {
      try {
         const query = WeeklyReviewQuerySchema.parse(req.query);
         const weeklyReviews = await weeklyReviewRepository.getWeeklyReview(req.pagination, query);

         res.json({ data: weeklyReviews });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to get weekly reviews',
         });
      }
   },

   async addWeeklyReviewFeedback(req: Request, res: Response) {
      try {
         const weeklyReviewId = lib.parseObjectId(req.params.id!);
         const weeklyReview = await weeklyReviewRepository.getOneWeeklyReview(weeklyReviewId);

         if (!weeklyReview) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid weekly report provided.' });
         }

         const updatedWeeklyReview = await weeklyReviewRepository.addFeedback(weeklyReview, req.body, req.admin._id);

         res.status(StatusCodes.CREATED).json({ data: updatedWeeklyReview, message: 'Feedback added successfully!' });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Failed to add feedback',
         });
      }
   },
};
