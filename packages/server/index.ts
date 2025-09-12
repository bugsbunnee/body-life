import express from 'express';
import dotenv from 'dotenv';

import announcement from './routes/announcement.route';
import chat from './routes/chat.route';
import communication from './routes/communication.route';
import sms from './routes/sms.route';
import user from './routes/user.route';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/announcement', announcement);
app.use('/api/chat', chat);
app.use('/api/communication', communication);
app.use('/api/user', user);
app.use('/api/sms', sms);

const port = process.env.PORT || 19200;
app.listen(port, () => console.log(`Server is running on port ${port}...`));
