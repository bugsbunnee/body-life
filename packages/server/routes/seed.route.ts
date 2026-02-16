import express from 'express';
import { seedController } from '../controllers/seed.controller';

const router = express.Router();
router.post('/', seedController.seed);

export default router;
