import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import validate from '../middleware/validate';
import validateObjectId from '../middleware/validateObjectId';

import { FollowUpQuerySchema, FollowUpUpdateSchema } from '../infrastructure/database/validators/followup.validator';
import { followupController } from '../controllers/followup.controller';

const router = express.Router();

router.get('/', [auth, validate(FollowUpQuerySchema, 'query'), paginate], followupController.getFirstTimers);
router.put('/:id', [auth, validateObjectId, validate(FollowUpUpdateSchema, 'body')], followupController.updateFirstTimer);

export default router;
