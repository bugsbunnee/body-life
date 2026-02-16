import express from 'express';

import paginate from '../middleware/paginate';
import upload from '../services/upload.service';
import validate from '../middleware/validate';

import { userController } from '../controllers/user.controller';
import { UserCreationSchema, UserQuerySchema } from '../infrastructure/database/validators/user.validator';

const router = express.Router();

router.post('/bulk', [upload.single('file')], userController.bulkCreateUsers);
router.post('/', [validate(UserCreationSchema, 'body')], userController.createUser);
router.get('/', [validate(UserQuerySchema, 'query'), paginate], userController.getUsers);

export default router;
