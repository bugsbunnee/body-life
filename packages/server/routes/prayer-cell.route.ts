import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import protectedRoute from '../middleware/protected';
import validate from '../middleware/validate';

import { PrayerCellCreateSchema, PrayerCellQuerySchema } from '../infrastructure/database/validators/prayer-cell.validator';
import { prayerCellController } from '../controllers/prayer-cell.controller';
import { DEFAULT_ROLES } from '../utils/constants';
import { UserRole } from '../infrastructure/database/entities/enums/user-role.enum';

const router = express.Router();

router.get('/', [auth, protectedRoute(DEFAULT_ROLES), validate(PrayerCellQuerySchema, 'query'), paginate], prayerCellController.getPrayerCells);
router.post('/', [auth, protectedRoute([UserRole.Pastor]), validate(PrayerCellCreateSchema, 'body')], prayerCellController.createPrayerCell);

export default router;
