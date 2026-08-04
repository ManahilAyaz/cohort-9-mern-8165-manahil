const pinoHttp = require('pino-http');
const logger = require('../config/logger');

// logs every incoming request + outgoing response (method, url, status, response time)
// customProps lets us throw the logged-in user id in there when we have one, which
// is handy when tracing down "who did this" in production
const requestLogger = pinoHttp({
  logger,
  customProps: (req) => ({
    userId: req.user ? req.user.id : undefined,
  }),
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});

module.exports = requestLogger;
