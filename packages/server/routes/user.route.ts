import express from 'express';
import validate from '../middleware/validate';

import { userSchema } from '../lib/schema';
import { userController } from '../controllers/user.controller';

const router = express.Router();

router.post('/', validate(userSchema), userController.createUser);
router.get('/', userController.getUsers);

export default router;
