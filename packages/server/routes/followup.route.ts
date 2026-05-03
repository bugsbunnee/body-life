import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import protectedRoute from '../middleware/protected';
import validate from '../middleware/validate';
import validateObjectId from '../middleware/validateObjectId';

import { FollowUpQuerySchema, FollowUpUpdateSchema } from '../infrastructure/database/validators/followup.validator';
import { followupController } from '../controllers/followup.controller';
import { dateRangeSchema } from '../infrastructure/database/validators/base.validator';
import { DEFAULT_ROLES, HIGH_RANKING_ROLES } from '../utils/constants';

const router = express.Router();

router.get('/report', [auth, validate(dateRangeSchema, 'query')], followupController.generateFirstTimersReport);
router.put('/:id', [auth, protectedRoute(HIGH_RANKING_ROLES), validateObjectId, validate(FollowUpUpdateSchema, 'body')], followupController.updateFirstTimer);
router.get('/', [auth, protectedRoute(DEFAULT_ROLES), validate(FollowUpQuerySchema, 'query'), paginate], followupController.getFirstTimers);

export default router;
