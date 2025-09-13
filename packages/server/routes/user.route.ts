import express from 'express';

import paginate from '../middleware/paginate';
import upload from '../services/upload.service';
import validate from '../middleware/validate';

import { userSchema } from '../infrastructure/lib/schema';
import { userController } from '../controllers/user.controller';

const router = express.Router();

router.post('/bulk', upload.single('file'), userController.bulkCreateUsers);
router.post('/', validate(userSchema), userController.createUser);
router.get('/', paginate, userController.getUsers);

export default router;
