import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import upload from '../services/multer.service';
import validate from '../middleware/validate';
import validateObjectId from '../middleware/validateObjectId';

import { programController } from '../controllers/program.controller';
import { ProgramCreateSchema, ProgramQuerySchema } from '../infrastructure/database/validators/program.validator';

const router = express.Router();

router.get('/', [auth, paginate, validate(ProgramQuerySchema, 'query')], programController.getPrograms);
router.post('/', [auth, upload.single('file'), validate(ProgramCreateSchema, 'body')], programController.createProgram);
router.delete('/:id', [auth, validateObjectId], programController.deactivateProgram);

export default router;
