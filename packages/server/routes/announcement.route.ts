import express from 'express';
import validate from '../middleware/validate';

import { announcementController } from '../controllers/announcement.controller';
import { AnnouncementSchema } from '../infrastructure/database/validators/announcement.validator';

const router = express.Router();

router.get('/', announcementController.getActiveAnnouncements);
router.post('/', validate(AnnouncementSchema, 'body'), announcementController.createAnnouncement);
router.delete('/:id', announcementController.deactivateAnnouncement);

export default router;
