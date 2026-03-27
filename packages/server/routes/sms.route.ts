import express from 'express';

import auth from '../middleware/auth';
import validate from '../middleware/validate';

import { smsController } from '../controllers/sms.controller';
import { SMSSchema } from '../infrastructure/database/validators/sms.validator';

const router = express.Router();

router.post('/', [auth, validate(SMSSchema, 'body')], smsController.sendMessage);
router.post('/webhook/whatsapp', [], smsController.receiveMessage);
router.get('/webhook/whatsapp', [], smsController.verifyMessage);

export default router;
