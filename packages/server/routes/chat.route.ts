import express from 'express';

import validate from '../middleware/validate';
import upload from '../services/upload.service';

import { chatController } from '../controllers/chat.controller';
import { ChatSchema } from '../infrastructure/database/validators/chat.validator';

const router = express.Router();

router.post('/', validate(ChatSchema, 'body'), chatController.sendMessage);
router.post('/transcribe', upload.single('file'), chatController.transcribeAudio);

export default router;
