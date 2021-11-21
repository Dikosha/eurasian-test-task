const winston = require('winston');

const { timestamp } = winston.format;

const logger = winston.createLogger({
  format: winston.format.combine(timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({
        filename: process.env.LOGFILE || 'logfile.log'
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
        filename: process.env.LOGFILE || 'logfile.log'
    })
  ]
});

module.exports = logger;
