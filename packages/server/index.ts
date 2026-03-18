import configureApp from './startup';
import logger from './services/logger.service';

const app = configureApp();
const port = process.env.PORT || 19200;

app.listen(port, () => logger.info(`Server is running on port ${port}...`));

export default app;
