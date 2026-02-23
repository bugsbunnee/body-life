import express from 'express';

import validate from '../middleware/validate';
import communicationController from '../controllers/communication.controller';

import { NewsletterSchema } from '../infrastructure/database/validators/communication.validator';

const router = express.Router();

router.post('/newsletter', [validate(NewsletterSchema, 'body')], communicationController.sendNewsletter);

export default router;
