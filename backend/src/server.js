import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const server = http.createServer(app);

const port = env.port;

server.listen(port, () => {
  logger.info(`API server listening on port ${port}`);
});

const shutdownSignals = ['SIGINT', 'SIGTERM'];

shutdownSignals.forEach((signal) => {
  process.on(signal, () => {
    logger.info(`${signal} received. Shutting down gracefully.`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
    setTimeout(() => {
      logger.error('Forcing shutdown.');
      process.exit(1);
    }, 10000).unref();
  });
});
