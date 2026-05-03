import express from 'express';

import auth from '../middleware/auth';
import validate from '../middleware/validate';
import communicationController from '../controllers/communication.controller';
import protectedRoute from '../middleware/protected';

import { NewsletterSchema } from '../infrastructure/database/validators/communication.validator';
import { HIGH_RANKING_ROLES } from '../utils/constants';

const router = express.Router();

router.post('/newsletter', [auth, protectedRoute(HIGH_RANKING_ROLES), validate(NewsletterSchema, 'body')], communicationController.sendNewsletter);

export default router;
