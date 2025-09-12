import express from 'express';
import validate from '../middleware/validate';

import { announcementSchema } from '../infrastructure/lib/schema';
import { announcementController } from '../controllers/announcement.controller';

const router = express.Router();

router.get('/', announcementController.getActiveAnnouncements);
router.post('/', validate(announcementSchema), announcementController.createAnnouncement);
router.delete('/:id', announcementController.deactivateAnnouncement);

export default router;
