import type { Request, Response } from 'express';
import { seedRepository } from '../repositories/seed.repository';

export const seedController = {
   async seed(req: Request, res: Response) {
      await seedRepository.seed();

      res.json({ success: true, message: 'Data seeded successfully!' });
   },
};
