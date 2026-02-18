import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import auth from '../routes/auth.route';
import announcement from '../routes/announcement.route';
import chat from '../routes/chat.route';
import department from '../routes/department.route';
import message from '../routes/message.route';
import birthday from '../routes/birthday.route';
import inventory from '../routes/inventory.route';
import followup from '../routes/followup.route';
import prayerCell from '../routes/prayer-cell.route';
import sms from '../routes/sms.route';
import seed from '../routes/seed.route';
import serviceReport from '../routes/service-report.route';
import user from '../routes/user.route';
import error from '../middleware/error';

function configureRoutes(app: Express) {
   app.use(express.json());
   app.use(express.static('public'));

   app.use(cors());
   app.use(helmet());

   app.use('/api/announcement', announcement);
   app.use('/api/auth', auth);
   app.use('/api/birthday', birthday);
   app.use('/api/chat', chat);
   app.use('/api/department', department);
   app.use('/api/followup', followup);
   app.use('/api/inventory', inventory);
   app.use('/api/message', message);
   app.use('/api/user', user);
   app.use('/api/prayer-cell', prayerCell);
   app.use('/api/seed', seed);
   app.use('/api/service-report', serviceReport);
   app.use('/api/sms', sms);

   app.use(error);
}

export default configureRoutes;
