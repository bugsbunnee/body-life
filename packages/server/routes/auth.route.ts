import express from 'express';

import auth from '../middleware/auth';
import validate from '../middleware/validate';
import pastor from '../middleware/pastor';

import { authController } from '../controllers/auth.controller';
import { AdminAssignSchema, AdminPasswordSchema, AuthSchema } from '../infrastructure/database/validators/auth.validator';

const router = express.Router();

router.post('/admin', [validate(AuthSchema, 'body')], authController.adminLogin);
router.post('/admin/assign', [auth, pastor, validate(AdminAssignSchema, 'body')], authController.asignUserAsAdmin);
router.post('/admin/password', [validate(AdminPasswordSchema, 'body')], authController.resetPassword);

export default router;
