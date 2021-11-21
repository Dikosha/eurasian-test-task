const dotenv = require('dotenv');
const http = require('http');

dotenv.config({ path: `${__dirname}/settings.env` });

const logger = require('./utils/logger');

process.on('uncaughtException', err => {
    logger.error('UNCAUGHT EXCEPTION! Shutting down...');
    logger.error(JSON.stringify(err));
    process.exit(1);
});

const app = require('./app');

const port = process.env.PORT || 3000;
const server = http.createServer(app).listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    logger.error('UNHANDLED REJECTION! Shutting down...');
    logger.error(JSON.stringify(err));
    server.close(() => {
        process.exit(1);
    });
});
