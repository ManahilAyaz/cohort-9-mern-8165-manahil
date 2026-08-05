require('dotenv').config();
const app = require('./app');
const logger = require('./config/logger');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    logger.info('Database connection established');

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // app.listen's callback only fires on success - a bind failure like
    // EADDRINUSE (port already taken) shows up as an 'error' event on the
    // server instead, on a later tick that our try/catch above can't see
    server.on('error', (err) => {
      logger.error({ err }, 'Server failed to start');
      process.exit(1);
    });
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();

// catch anything that slips through async code without a proper handler
process.on('unhandledRejection', (err) => {
  logger.error({ err }, 'Unhandled promise rejection, shutting down');
  process.exit(1);
});