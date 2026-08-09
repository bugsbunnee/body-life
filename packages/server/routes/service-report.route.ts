import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import protectedRoute from '../middleware/protected';
import validate from '../middleware/validate';

import { dateRangeSchema } from '../infrastructure/database/validators/base.validator';
import { serviceReportController } from '../controllers/service-report.controller';
import { ServiceReportSchema } from '../infrastructure/database/validators/service-report.validator';
import { DEFAULT_ROLES, HIGH_RANKING_ROLES } from '../utils/constants';

const router = express.Router();

router.get('/overview', [auth, protectedRoute(DEFAULT_ROLES), validate(dateRangeSchema, 'query')], serviceReportController.getServiceReportOverview);
router.get('/', [auth, protectedRoute(HIGH_RANKING_ROLES), paginate, validate(dateRangeSchema, 'query')], serviceReportController.getServiceReportByDateRange);
router.post('/', [auth, protectedRoute(HIGH_RANKING_ROLES), validate(ServiceReportSchema, 'body')], serviceReportController.createServiceReport);

export default router;
