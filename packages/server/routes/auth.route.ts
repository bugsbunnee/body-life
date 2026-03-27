import express from 'express';

import auth from '../middleware/auth';
import validate from '../middleware/validate';
import pastor from '../middleware/pastor';

import { authController } from '../controllers/auth.controller';
import { AdminAssignSchema, AdminForgotPasswordSchema, AdminResetPasswordSchema, AuthSchema } from '../infrastructure/database/validators/auth.validator';

const router = express.Router();

router.post('/admin', [validate(AuthSchema, 'body')], authController.adminLogin);
router.post('/admin/assign', [auth, pastor, validate(AdminAssignSchema, 'body')], authController.asignUserAsAdmin);
router.post('/admin/reset-password', [validate(AdminResetPasswordSchema, 'body')], authController.resetPassword);
router.post('/admin/forgot-password', [validate(AdminForgotPasswordSchema, 'body')], authController.forgotPassword);

export default router;
