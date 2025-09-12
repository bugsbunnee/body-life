import express from 'express';

import paginate from '../middleware/paginate';
import validate from '../middleware/validate';

import { userSchema } from '../infrastructure/lib/schema';
import { userController } from '../controllers/user.controller';

const router = express.Router();

router.post('/', validate(userSchema), userController.createUser);
router.get('/', paginate, userController.getUsers);

export default router;
