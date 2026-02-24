import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import validate from '../middleware/validate';

import { WeeklyReviewCreateSchema, WeeklyReviewQuerySchema } from '../infrastructure/database/validators/weekly-review.validator';
import { weeklyReviewController } from '../controllers/weekly-review.controller';

const router = express.Router();

router.get('/', [auth, paginate, validate(WeeklyReviewQuerySchema, 'query')], weeklyReviewController.getWeeklyReviews);
router.post('/', [auth, validate(WeeklyReviewCreateSchema, 'body')], weeklyReviewController.createWeeklyReview);

export default router;
