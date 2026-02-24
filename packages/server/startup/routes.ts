import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { FRONTEND_BASE_URL } from '../utils/constants';

import auth from '../routes/auth.route';
import chat from '../routes/chat.route';
import communication from '../routes/communication.route';
import department from '../routes/department.route';
import message from '../routes/message.route';
import birthday from '../routes/birthday.route';
import inventory from '../routes/inventory.route';
import followup from '../routes/followup.route';
import program from '../routes/program.route';
import prayerCell from '../routes/prayer-cell.route';
import sms from '../routes/sms.route';
import seed from '../routes/seed.route';
import serviceReport from '../routes/service-report.route';
import weeklyReview from '../routes/weekly-review.route';
import user from '../routes/user.route';
import error from '../middleware/error';

const corsOptions = {
   origin: FRONTEND_BASE_URL,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   credentials: true,
};

function configureRoutes(app: Express) {
   app.use(helmet());

   app.use(cors(corsOptions));
   app.options('*', cors(corsOptions));

   app.use(express.json());
   app.use(express.static('public'));

   app.use('/api/auth', auth);
   app.use('/api/birthday', birthday);
   app.use('/api/chat', chat);
   app.use('/api/communication', communication);
   app.use('/api/department', department);
   app.use('/api/followup', followup);
   app.use('/api/inventory', inventory);
   app.use('/api/message', message);
   app.use('/api/program', program);
   app.use('/api/user', user);
   app.use('/api/weekly-review', weeklyReview);
   app.use('/api/prayer-cell', prayerCell);
   app.use('/api/seed', seed);
   app.use('/api/service-report', serviceReport);
   app.use('/api/sms', sms);

   app.use(error);
}

export default configureRoutes;
