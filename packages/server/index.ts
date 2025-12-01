import express from 'express';
import dotenv from 'dotenv';

import announcement from './routes/announcement.route';
import chat from './routes/chat.route';
import message from './routes/message.route';
import birthday from './routes/birthday.route';
import sms from './routes/sms.route';
import user from './routes/user.route';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/api/announcement', announcement);
app.use('/api/birthday', birthday);
app.use('/api/chat', chat);
app.use('/api/message', message);
app.use('/api/user', user);
app.use('/api/sms', sms);

const port = process.env.PORT || 19200;
app.listen(port, () => console.log(`Server is running on port ${port}...`));
