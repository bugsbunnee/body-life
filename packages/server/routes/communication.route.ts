import express from 'express';

import auth from '../middleware/auth';
import validate from '../middleware/validate';
import communicationController from '../controllers/communication.controller';

import { NewsletterSchema } from '../infrastructure/database/validators/communication.validator';

const router = express.Router();

router.post('/newsletter', [auth, validate(NewsletterSchema, 'body')], communicationController.sendNewsletter);

export default router;
