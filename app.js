const express = require('express');
const app = express();
const logger = require('morgan');
const db = require("./models");
const globalErrorHandler = require('./controllers/errorController');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Content-Security-Policy', "default-src * 'unsafe-inline' localhost");
    next();
});

app.use(logger('combined'));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

db.sequelize.sync().then(() => {
  console.log("Drop and re-sync db.");
});

const mainRouter = require('./routers/mainRouter');
app.use('/main', mainRouter);

const fileRouter = require('./routers/fileRouter');
app.use('/uploadFiles', fileRouter);

app.use(globalErrorHandler);

module.exports = app;
