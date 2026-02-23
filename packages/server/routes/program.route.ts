import express from 'express';
import paginate from '../middleware/paginate';
import upload from '../services/multer.service';
import validate from '../middleware/validate';

import { programController } from '../controllers/program.controller';
import { ProgramCreateSchema, ProgramQuerySchema } from '../infrastructure/database/validators/program.validator';

const router = express.Router();

router.get('/', [paginate, validate(ProgramQuerySchema, 'query')], programController.getPrograms);
router.post('/', upload.single('file'), validate(ProgramCreateSchema, 'body'), programController.createProgram);
router.delete('/:id', programController.deactivateProgram);

export default router;
