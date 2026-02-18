import _ from 'lodash';
import type { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { PrayerCellQuerySchema } from '../infrastructure/database/validators/prayer-cell.validator';

import { prayerCellRepository } from '../repositories/prayer-cell.repository';
import { userRepository } from '../repositories/user.repository';

export const prayerCellController = {
   async getPrayerCells(req: Request, res: Response) {
      try {
         const query = PrayerCellQuerySchema.parse(req.query);
         const prayerCells = await prayerCellRepository.getPrayerCells(req.pagination, query);

         res.json({ data: prayerCells });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to get prayer cells' });
      }
   },

   async createPrayerCell(req: Request, res: Response) {
      try {
         const leader = await userRepository.getOneUserById(req.body.leader);

         if (!leader) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Leader not found' });
         }

         const prayerCell = await prayerCellRepository.createPrayerCell(req.body);

         res.status(StatusCodes.CREATED).json({ data: prayerCell });
      } catch (ex) {
         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create prayer cell' });
      }
   },
};
