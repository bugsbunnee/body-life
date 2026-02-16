import type mongoose from 'mongoose';
import { PrayerCell } from '../infrastructure/database/models/prayer-cell.model';

export const prayerCellRepository = {
   async getOnePrayerCell(prayerCellId: mongoose.Types.ObjectId) {
      return PrayerCell.findById(prayerCellId).lean().exec();
   },
};
