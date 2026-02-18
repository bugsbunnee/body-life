import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import validate from '../middleware/validate';

import { dateRangeSchema } from '../infrastructure/database/validators/base.validator';
import { serviceReportController } from '../controllers/service-report.controller';
import { ServiceReportSchema } from '../infrastructure/database/validators/service-report.validator';

const router = express.Router();

router.get('/overview', [auth, validate(dateRangeSchema, 'query')], serviceReportController.getServiceReportOverview);
router.get('/', [auth, paginate, validate(dateRangeSchema, 'query')], serviceReportController.getServiceReportByDateRange);
router.post('/', [auth, paginate, validate(ServiceReportSchema, 'body')], serviceReportController.createServiceReport);

export default router;
