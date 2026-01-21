import app from './app.js';
import config from './config/env.js';
import logger from './utils/logger.js';
import { connectCoreDb, closeCoreDb } from './services/auth.service.js';
import { closeAllUserConnections } from './services/mongoUserDb.service.js';
import { createUserIndexes } from './models/user.model.js';
import { createChatHistoryIndexes } from './models/chatHistory.model.js';

let server;

const startServer = async () => {
  try {
    const db = await connectCoreDb();

    await createUserIndexes(db);
    logger.info('User indexes created');

    await createChatHistoryIndexes(db);
    logger.info('Chat history indexes created');

    server = app.listen(config.port, () => {
      logger.info(`Server running in ${config.node_env} mode on port ${config.port}`);
      logger.info(`Health check: http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');

      await closeAllUserConnections();
      await closeCoreDb();

      logger.info('All database connections closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
