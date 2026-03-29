import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import validate from '../middleware/validate';
import validateObjectId from '../middleware/validateObjectId';

import { RequisitionActionSchema, RequisitionCreateSchema, RequisitionQuerySchema } from '../infrastructure/database/validators/requisition.validator';
import { requisitionsController } from '../controllers/requisition.controller';

const router = express.Router();

router.get('/', [auth, paginate, validate(RequisitionQuerySchema, 'query')], requisitionsController.getRequisitions);
router.post('/', [auth, validate(RequisitionCreateSchema, 'body')], requisitionsController.createRequisition);
router.post('/:id/action', [auth, validateObjectId, validate(RequisitionActionSchema, 'body')], requisitionsController.actionRequisition);

export default router;
