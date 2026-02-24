import express from 'express';

import { rateLimit } from 'express-rate-limit';
import { messageController } from '../controllers/message.controller';
import { MessageCreationSchema, MessageUpdateSchema } from '../infrastructure/database/validators/message.validator';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import validate from '../middleware/validate';
import validateMessage from '../middleware/validateMessage';
import validateObjectId from '../middleware/validateObjectId';

const router = express.Router();

router.post('/:id/summarize', [auth, validateObjectId, rateLimit({ limit: 10, windowMs: 15 * 60 * 1000 }), validateMessage], messageController.summarizeMessage);
router.put('/:id/summary-cleanup', [auth, validateObjectId, validate(MessageUpdateSchema, 'body'), validateMessage], messageController.updateMessageSummary);

router.get('/', [auth, paginate], messageController.getMessages);
router.post('/', [auth, validate(MessageCreationSchema, 'body')], messageController.createMessage);

export default router;
