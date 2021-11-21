const CONST = require('../utils/constants');
const utils = require('../utils');
const db = require("../models");
const util = require("util");
const path = require("path");
const multer = require("multer");

exports.doPost = utils.catchAsync(async(req, res, next) => {
  let result = {
    status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
    msg: CONST.HTTPSTATUSES.ERRORS.BadRequest.name
  };

  result = await upload(res, req, next)

  res.status(200).json(result);
});

upload = async(res, req, next) => {
  let result = {
    status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
    msg: CONST.HTTPSTATUSES.ERRORS.BadRequest.name
  };

  const checkSession = await utils.checkSession(req.params.session_uuid)
  if(!checkSession){
    result.msg = 'Сессия не валидна'
    return result;
  }

  const uploadFiles = multer({ storage: storage }).array("multi-files", 10);
  const uploadFilesMiddleware = util.promisify(uploadFiles);

  try {
    await uploadFilesMiddleware(req, res);

    if (req.files.length <= 0) {
      result.msg = 'Выберите как минимум 1 файл';
      return result;
    }

    req.files.forEach(file => {
      db.files.create({
        path: file.path,
        userId: checkSession,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      })
    })

    result = {
      status: CONST.HTTPSTATUSES.SUCCESS.OK.code,
      msg: CONST.HTTPSTATUSES.SUCCESS.OK.name
    };

    return result
  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      result.msg = 'Слишком много файлов';
      return result;
    }
    result.msg = 'Ошибка при добавлении: ' + error;
    return result;
  }
}

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`./public/files`));
  },
  filename: (req, file, callback) => {

    // const match = ["image/png", "image/jpeg"];

    // if (match.indexOf(file.mimetype) === -1) {
    //   var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
    //   return callback(message, null);
    // }

    var filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  }
});
