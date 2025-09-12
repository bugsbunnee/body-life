import express from 'express';
import validate from '../middleware/validate';

import { textSchema } from '../infrastructure/lib/schema';
import { smsController } from '../controllers/sms.controller';

const router = express.Router();
router.post('/', validate(textSchema), smsController.sendMessage);

export default router;
