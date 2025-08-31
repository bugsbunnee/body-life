import express from 'express';
import dotenv from 'dotenv';

import chat from './routes/chat.route';
import user from './routes/user.route';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/user', user);
app.use('/api/chat', chat);

const port = process.env.PORT || 19200;
app.listen(port, () => console.log(`Server is running on port ${port}...`));
