import express from 'express';

import { birthdayController } from '../controllers/birthday.controller';

const router = express.Router();

router.post('/', birthdayController.populateBirthdayReminders);

export default router;
