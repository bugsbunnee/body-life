import express from 'express';

import { birthdayController } from '../controllers/birthday.controller';

const router = express.Router();

router.get('/', birthdayController.sendDailyBirthdayReminders);

export default router;
