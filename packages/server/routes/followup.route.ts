import express from 'express';

import paginate from '../middleware/paginate';
import validate from '../middleware/validate';
import validateObjectId from '../middleware/validateObjectId';

import { FollowUpQuerySchema, FollowUpUpdateSchema } from '../infrastructure/database/validators/followup.validator';
import { followupController } from '../controllers/followup.controller';

const router = express.Router();

router.get('/', [validate(FollowUpQuerySchema, 'query'), paginate], followupController.getFirstTimers);
router.put('/:id', [validateObjectId, validate(FollowUpUpdateSchema, 'body')], followupController.updateFirstTimer);

export default router;
