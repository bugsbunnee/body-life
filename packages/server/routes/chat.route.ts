import express from 'express';

import validate from '../middleware/validate';
import upload from '../services/upload.service';

import { chatController } from '../controllers/chat.controller';
import { chatSchema } from '../lib/schema';

const router = express.Router();

router.post('/', validate(chatSchema), chatController.sendMessage);
router.post('/transcribe', upload.single('file'), chatController.transcribeAudio);

export default router;
