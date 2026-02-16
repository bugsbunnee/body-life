import express from 'express';

import { rateLimit } from 'express-rate-limit';
import { messageController } from '../controllers/message.controller';
import { MessageCreationSchema, MessageUpdateSchema } from '../infrastructure/database/validators/message.validator';

import paginate from '../middleware/paginate';
import validate from '../middleware/validate';
import validateMessage from '../middleware/validateMessage';
import validateObjectId from '../middleware/validateObjectId';

const router = express.Router();

router.post('/:id/newsletter', [validateObjectId, validateMessage], messageController.sendNewsletterEmail);
router.post('/:id/summarize', [validateObjectId, rateLimit({ limit: 10, windowMs: 15 * 60 * 1000 }), validateMessage], messageController.summarizeMessage);
router.put('/:id/summary-cleanup', [validateObjectId, validate(MessageUpdateSchema, 'body'), validateMessage], messageController.updateMessageSummary);

router.get('/', [paginate], messageController.getMessages);
router.post('/', [validate(MessageCreationSchema, 'body')], messageController.createMessage);

export default router;
