import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import protectedRoute from '../middleware/protected';
import validate from '../middleware/validate';
import validateObjectId from '../middleware/validateObjectId';

import { WeeklyReviewCreateSchema, WeeklyReviewFeedbackSchema, WeeklyReviewQuerySchema } from '../infrastructure/database/validators/weekly-review.validator';
import { weeklyReviewController } from '../controllers/weekly-review.controller';
import { CORE_ROLES, HIGH_RANKING_ROLES } from '../utils/constants';

const router = express.Router();

router.get('/', [auth, protectedRoute(HIGH_RANKING_ROLES), paginate, validate(WeeklyReviewQuerySchema, 'query')], weeklyReviewController.getWeeklyReviews);
router.post('/', [auth, protectedRoute(HIGH_RANKING_ROLES), validate(WeeklyReviewCreateSchema, 'body')], weeklyReviewController.createWeeklyReview);
router.post('/:id/feedback', [auth, protectedRoute(CORE_ROLES), validateObjectId, validate(WeeklyReviewFeedbackSchema, 'body')], weeklyReviewController.addWeeklyReviewFeedback);

export default router;
