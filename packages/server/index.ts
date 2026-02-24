import express from 'express';
import configureApp from './startup';

const app = configureApp();
const port = process.env.PORT || 19200;

app.listen(port, () => console.log(`Server is running on port ${port}...`));

export default app;
