import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import validate from '../middleware/validate';
import validateObjectId from '../middleware/validateObjectId';

import { FollowUpQuerySchema, FollowUpUpdateSchema } from '../infrastructure/database/validators/followup.validator';
import { followupController } from '../controllers/followup.controller';
import { dateRangeSchema } from '../infrastructure/database/validators/base.validator';

const router = express.Router();

router.get('/report', [auth, validate(dateRangeSchema, 'query')], followupController.generateFirstTimersReport);
router.put('/:id', [auth, validateObjectId, validate(FollowUpUpdateSchema, 'body')], followupController.updateFirstTimer);
router.get('/', [auth, validate(FollowUpQuerySchema, 'query'), paginate], followupController.getFirstTimers);

export default router;
