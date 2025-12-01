import express from 'express';

import paginate from '../middleware/paginate';
import validate from '../middleware/validate';
import validateMessage from '../middleware/validateMessage';

import { rateLimit } from 'express-rate-limit';
import { messageController } from '../controllers/message.controller';
import { messageSchema, updateMessageSchema } from '../infrastructure/lib/schema';

const router = express.Router();

router.post('/:id/newsletter', [validateMessage], messageController.sendNewsletterEmail);
router.post('/:id/summarize', [rateLimit({ limit: 10, windowMs: 15 * 60 * 1000 }), validateMessage], messageController.summarizeMessage);
router.put('/:id/summary-cleanup', [validate(updateMessageSchema), validateMessage], messageController.updateMessageSummary);

router.get('/', [paginate], messageController.getMessages);
router.post('/', [validate(messageSchema)], messageController.createMessage);

export default router;
