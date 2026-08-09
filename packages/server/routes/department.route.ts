import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import protectedRoute from '../middleware/protected';
import validate from '../middleware/validate';

import { DepartmentCreateSchema, DepartmentQuerySchema } from '../infrastructure/database/validators/department.validator';
import { departmentController } from '../controllers/department.controller';
import { HIGH_RANKING_ROLES } from '../utils/constants';
import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';

const router = express.Router();

router.get('/', [auth, protectedRoute(HIGH_RANKING_ROLES), validate(DepartmentQuerySchema, 'query'), paginate], departmentController.getDepartments);
router.post('/', [auth, protectedRoute([UserRole.Pastor]), validate(DepartmentCreateSchema, 'body')], departmentController.createDepartment);

export default router;
