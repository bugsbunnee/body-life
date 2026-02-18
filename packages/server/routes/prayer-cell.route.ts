import express from 'express';

import auth from '../middleware/auth';
import paginate from '../middleware/paginate';
import validate from '../middleware/validate';

import { PrayerCellCreateSchema, PrayerCellQuerySchema } from '../infrastructure/database/validators/prayer-cell.validator';
import { prayerCellController } from '../controllers/prayer-cell.controller';

const router = express.Router();

router.get('/', [auth, validate(PrayerCellQuerySchema, 'query'), paginate], prayerCellController.getPrayerCells);
router.post('/', [auth, validate(PrayerCellCreateSchema, 'body')], prayerCellController.createPrayerCell);

export default router;
