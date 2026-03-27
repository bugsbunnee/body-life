import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import pastor from '../middleware/pastor';
import upload from '../services/multer.service';
import validate from '../middleware/validate';
import validateObjectId from '../middleware/validateObjectId';

import { userController } from '../controllers/user.controller';
import { UserCreationSchema, UserQuerySchema, UserRoleSchema, UserUpdateSchema } from '../infrastructure/database/validators/user.validator';
import { NewsletterUnsubscribeSchema } from '../infrastructure/database/validators/communication.validator';

const router = express.Router();

router.post('/bulk', [upload.single('file')], userController.bulkCreateUsers);
router.post('/:id/unsubscribe', [validateObjectId, validate(NewsletterUnsubscribeSchema, 'body')], userController.unsubscribeFromNewsletter);
router.put('/:id', [validate(UserUpdateSchema, 'body'), auth, pastor], userController.updateUser);
router.patch('/:id', [validateObjectId, validate(UserRoleSchema, 'body'), auth, pastor], userController.updateUserRole);
router.post('/', [validate(UserCreationSchema, 'body')], userController.createUser);
router.get('/', [validate(UserQuerySchema, 'query'), paginate], userController.getUsers);

export default router;
