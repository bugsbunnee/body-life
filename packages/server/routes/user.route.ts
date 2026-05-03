import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import protectedRoute from '../middleware/protected';
import upload from '../services/multer.service';
import validate from '../middleware/validate';
import validateObjectId from '../middleware/validateObjectId';

import { userController } from '../controllers/user.controller';
import { UserCreationSchema, UserQuerySchema, UserRoleSchema, UserUpdateSchema } from '../infrastructure/database/validators/user.validator';
import { NewsletterUnsubscribeSchema } from '../infrastructure/database/validators/communication.validator';
import { HIGH_RANKING_ROLES } from '../utils/constants';
import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';

const router = express.Router();

router.post('/bulk', [auth, protectedRoute(HIGH_RANKING_ROLES), upload.single('file')], userController.bulkCreateUsers);
router.post('/:id/unsubscribe', [validateObjectId, validate(NewsletterUnsubscribeSchema, 'body')], userController.unsubscribeFromNewsletter);
router.put('/:id', [auth, protectedRoute(HIGH_RANKING_ROLES), validateObjectId, validate(UserUpdateSchema, 'body')], userController.updateUser);
router.patch('/:id', [auth, protectedRoute([UserRole.Pastor]), validateObjectId, validate(UserRoleSchema, 'body')], userController.updateUserRole);
router.post('/', [auth, protectedRoute(HIGH_RANKING_ROLES), validate(UserCreationSchema, 'body')], userController.createUser);
router.get('/', [auth, protectedRoute(HIGH_RANKING_ROLES), validate(UserQuerySchema, 'query'), paginate], userController.getUsers);

export default router;
