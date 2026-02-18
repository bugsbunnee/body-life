import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import validate from '../middleware/validate';

import { DepartmentCreateSchema, DepartmentQuerySchema } from '../infrastructure/database/validators/department.validator';
import { departmentController } from '../controllers/department.controller';

const router = express.Router();

router.get('/', [auth, validate(DepartmentQuerySchema, 'query'), paginate], departmentController.getDepartments);
router.post('/', [auth, validate(DepartmentCreateSchema, 'body')], departmentController.createDepartment);

export default router;
