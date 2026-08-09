import express from 'express';

import { smsController } from '../controllers/sms.controller';
import { SMSSchema } from '../infrastructure/database/validators/sms.validator';

import auth from '../middleware/auth';
import protectedRoute from '../middleware/protected';
import validate from '../middleware/validate';

import { CORE_ROLES } from '../utils/constants';

const router = express.Router();

router.post('/', [auth, protectedRoute(CORE_ROLES), validate(SMSSchema, 'body')], smsController.sendMessage);
router.post('/webhook/whatsapp', [], smsController.receiveMessage);
router.get('/webhook/whatsapp', [], smsController.verifyMessage);

export default router;
