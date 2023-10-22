import { logger } from './src/config/logger';
import app from './src/app';
import { CONFIG } from './src/config';
import { AppDataSource } from './src/config/data-source';

const PORT = CONFIG.PORT || 8080;

const startServer = async (PORT: number) => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection established');

    app.listen(PORT || 3000, () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Something Went Wrong ');
  }
};

startServer(PORT as number);
