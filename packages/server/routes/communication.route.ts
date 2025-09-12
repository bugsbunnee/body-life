import express from 'express';
import { communicationController } from '../controllers/communication.controller';

const router = express.Router();

router.post('/newsletter', communicationController.sendNewsletterEmail);

export default router;
