import express from 'express';

import paginate from '../middleware/paginate';
import validate from '../middleware/validate';

import { dateRangeSchema } from '../infrastructure/database/validators/base.validator';
import { serviceReportController } from '../controllers/service-report.controller';
import { ServiceReportSchema } from '../infrastructure/database/validators/service-report.validator';

const router = express.Router();

router.get('/overview', [validate(dateRangeSchema, 'query')], serviceReportController.getServiceReportOverview);
router.get('/', [paginate, validate(dateRangeSchema, 'query')], serviceReportController.getServiceReportByDateRange);
router.post('/', [paginate, validate(ServiceReportSchema, 'body')], serviceReportController.createServiceReport);

export default router;
