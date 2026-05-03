import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import protectedRoute from '../middleware/protected';
import validate from '../middleware/validate';
import validateObjectId from '../middleware/validateObjectId';

import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';
import { RequisitionActionSchema, RequisitionCreateSchema, RequisitionQuerySchema } from '../infrastructure/database/validators/requisition.validator';
import { requisitionsController } from '../controllers/requisition.controller';
import { CORE_ROLES, HIGH_RANKING_ROLES } from '../utils/constants';

const router = express.Router();

router.get('/', [auth, protectedRoute(CORE_ROLES), paginate, validate(RequisitionQuerySchema, 'query')], requisitionsController.getRequisitions);
router.post('/', [auth, protectedRoute(CORE_ROLES), validate(RequisitionCreateSchema, 'body')], requisitionsController.createRequisition);
router.post('/:id/action', [auth, protectedRoute([UserRole.Pastor]), validateObjectId, validate(RequisitionActionSchema, 'body')], requisitionsController.actionRequisition);

export default router;
