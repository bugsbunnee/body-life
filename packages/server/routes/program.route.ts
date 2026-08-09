import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import protectedRoute from '../middleware/protected';
import upload from '../services/multer.service';
import validate from '../middleware/validate';
import validateObjectId from '../middleware/validateObjectId';

import { programController } from '../controllers/program.controller';
import { ProgramCreateSchema, ProgramQuerySchema } from '../infrastructure/database/validators/program.validator';
import { DEFAULT_ROLES } from '../utils/constants';

const router = express.Router();

router.get('/', [auth, protectedRoute(DEFAULT_ROLES), paginate, validate(ProgramQuerySchema, 'query')], programController.getPrograms);
router.post('/', [auth, protectedRoute(DEFAULT_ROLES), upload.single('file'), validate(ProgramCreateSchema, 'body')], programController.createProgram);
router.post('/:id/reminder', [auth, protectedRoute(DEFAULT_ROLES)], programController.sendReminderForProgram);
router.delete('/:id', [auth, protectedRoute(DEFAULT_ROLES), validateObjectId], programController.deactivateProgram);

export default router;
