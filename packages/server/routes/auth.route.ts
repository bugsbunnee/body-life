import express from 'express';
import validate from '../middleware/validate';

import { authController } from '../controllers/auth.controller';
import { AdminCreateSchema, AdminPasswordSchema, AuthSchema } from '../infrastructure/database/validators/auth.validator';

const router = express.Router();

router.post('/admin', [validate(AuthSchema, 'body')], authController.adminLogin);
router.post('/admin/create', [validate(AdminCreateSchema, 'body')], authController.createAdmin);
router.post('/admin/password', [validate(AdminPasswordSchema, 'body')], authController.resetPassword);

export default router;
