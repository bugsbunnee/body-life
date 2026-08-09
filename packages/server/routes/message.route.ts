import express from 'express';

import { rateLimit } from 'express-rate-limit';
import { messageController } from '../controllers/message.controller';
import { MessageCreationSchema, MessageUpdateSchema } from '../infrastructure/database/validators/message.validator';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import protectedRoute from '../middleware/protected';
import validate from '../middleware/validate';
import validateMessage from '../middleware/validateMessage';
import validateObjectId from '../middleware/validateObjectId';

import { DEFAULT_ROLES } from '../utils/constants';

const router = express.Router();

router.post(
   '/:id/summarize',
   [auth, protectedRoute(DEFAULT_ROLES), validateObjectId, rateLimit({ limit: 10, windowMs: 15 * 60 * 1000 }), validateMessage],
   messageController.summarizeMessage
);
router.put(
   '/:id/summary-cleanup',
   [auth, protectedRoute(DEFAULT_ROLES), validateObjectId, validate(MessageUpdateSchema, 'body'), validateMessage],
   messageController.updateMessageSummary
);

router.get('/', [auth, protectedRoute(DEFAULT_ROLES), paginate], messageController.getMessages);
router.post('/', [auth, protectedRoute(DEFAULT_ROLES), validate(MessageCreationSchema, 'body')], messageController.createMessage);

export default router;
