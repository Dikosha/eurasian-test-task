const AppError = require('./../utils/appError');
const logger = require('./../utils/logger');
const CONST = require('./../utils/constants');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(400, message);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Такое значение уже существует: ${value}. Попробуйте еще раз!`;
  return new AppError(400, message);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(400, message);
};

const sendErrorDev = (err, req, res) => {
  console.log('*** ERR JSON ********************************');
  console.log(err.json);
  console.log('*********************************************');

  const serverTime = new Date();

  return res.status(err.statusCode).json({
    ...err.json,
    ...{
      status: err.status,
      error: err,
      message: err.message,
      //stack: err.stack,
      server_time: serverTime,
      server_timezone: -(serverTime.getTimezoneOffset() / 60)
    }
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || CONST.HTTPSTATUSES.ERRORS.InternalServerError.code;
  err.status = err.status || CONST.HTTPSTATUSES.ERRORS.InternalServerError.name;

  logger.error({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
  let error = { ...err };

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, req, res);
  }
};
