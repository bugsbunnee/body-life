import express from 'express';
import validate from '../middleware/validate';

import { smsController } from '../controllers/sms.controller';
import { SMSSchema } from '../infrastructure/database/validators/sms.validator';

const router = express.Router();
router.post('/', validate(SMSSchema, 'body'), smsController.sendMessage);

export default router;
