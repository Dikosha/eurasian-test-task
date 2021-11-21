const CONST = require('../utils/constants');
const utils = require('../utils');
const db = require("../models");
const md5 = require('js-md5');

exports.doGet = utils.catchAsync(async(req, res, next) => {
  res.status(CONST.HTTPSTATUSES.ERRORS.MethodNotAllowed.code).send({
    status: CONST.HTTPSTATUSES.ERRORS.MethodNotAllowed.code,
    msg: CONST.HTTPSTATUSES.ERRORS.MethodNotAllowed.name
  });
});

exports.doPost = utils.catchAsync(async(req, res, next) => {
  let result = {
    status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
    msg: CONST.HTTPSTATUSES.ERRORS.BadRequest.name
  };
  switch (req.params.name) {
    case 'users':
      result = await users(req, res, next);
      break;
    case 'authorization':
      result = await authorization(req, res, next);
      break;
    case 'files':
      result = await files(req, res, next);
      break;
    default:
      result.status = CONST.HTTPSTATUSES.ERRORS.BadRequest.code;
      result.msg = CONST.HTTPSTATUSES.ERRORS.BadRequest.name + " - type not allowed";
  }
  if(req.params.name != 'files' && req.body.action != 'downloadBySession'){
    res.status(200).json(result);
  }
});


const users = async (req, res, next) => {
  let result = {
    status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
    msg: CONST.HTTPSTATUSES.ERRORS.BadRequest.name
  };

  switch (req.body.action) {
    case 'add':
      result = await users_add(req);
      break;
    default:
      result.status = CONST.HTTPSTATUSES.ERRORS.BadRequest.code;
      result.msg = CONST.HTTPSTATUSES.ERRORS.BadRequest.name + " - action not allowed";
  }
    return result;
}

const authorization = async (req, res, next) => {
  let result = {
    status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
    msg: CONST.HTTPSTATUSES.ERRORS.BadRequest.name
  };

  switch (req.body.action) {
    case 'signin':
      result = await authorization_signin(req);
      break;
    default:
      result.status = CONST.HTTPSTATUSES.ERRORS.BadRequest.code;
      result.msg = CONST.HTTPSTATUSES.ERRORS.BadRequest.name + " - action not allowed";
  }
    return result;
}

const files = async (req, res, next) => {
  let result = {
    status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
    msg: CONST.HTTPSTATUSES.ERRORS.BadRequest.name
  };

  switch (req.body.action) {
    case 'getBySession':
      result = await files_getBySession(req);
      break;
    case 'downloadBySession':
      result = await files_downloadBySession(req, res);
      break;
    default:
      result.status = CONST.HTTPSTATUSES.ERRORS.BadRequest.code;
      result.msg = CONST.HTTPSTATUSES.ERRORS.BadRequest.name + " - action not allowed";
  }
    return result;
}


// *************************** services
const users_add = async (req) => {
  let result = {
    status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
    msg: CONST.HTTPSTATUSES.ERRORS.BadRequest.name
  };
  const { body } = req;

  db.users.create({
    name: body.name,
    login: body.login,
    hashedPassword: md5(body.password)
  })
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      result = {
        status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
        msg: CONST.HTTPSTATUSES.ERRORS.BadRequest.name + ` - ${err.message}`
      };

      return result;
    });

  result = {
    status: CONST.HTTPSTATUSES.SUCCESS.OK.code,
    msg: CONST.HTTPSTATUSES.SUCCESS.OK.name
  };
  return result;
}

const authorization_signin = async (req) => {
  let result = {
    status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
    msg: CONST.HTTPSTATUSES.ERRORS.BadRequest.name
  };
  const { body } = req;

  const user = await db.users.findOne({
    where: {
      login: body.login
    }
  })
  console.log(user.dataValues);
  if(user.dataValues == undefined){
    result = {
      status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
      msg: 'Не существует пользователя'
    };
    return result;
  }
  let user_session;
  if(user.dataValues.hashedPassword == md5(body.password)){
    await db.sessions.destroy({
      where: {
        userId: user.dataValues.id
      }
    })

    const session = await db.sessions.create({
      userId: user.dataValues.id
    })
    user_session = session.dataValues.uuid;
  }else{
    result = {
      status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
      msg: 'Не верный пароль'
    };
  }


  result = {
    status: CONST.HTTPSTATUSES.SUCCESS.OK.code,
    msg: CONST.HTTPSTATUSES.SUCCESS.OK.name,
    data: {
      session: user_session
    }
  }

  return result;
}

const files_getBySession = async (req) => {
  let result = {
    status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
    msg: CONST.HTTPSTATUSES.ERRORS.BadRequest.name
  };
  const { body } = req;

  const checkSession = await utils.checkSession(body.session_uuid)
  if(!checkSession){
    result.msg = 'Сессия не валидна'
    return result;
  }

  const files = await db.files.findAll({
    where:{
      userId: checkSession
    }
  });
  console.log(files);

  result = {
    status: CONST.HTTPSTATUSES.SUCCESS.OK.code,
    msg: CONST.HTTPSTATUSES.SUCCESS.OK.name,
    data: {
      files
    }
  };
  return result;
}

const files_downloadBySession = async (req, res) => {
  let result = {
    status: CONST.HTTPSTATUSES.ERRORS.BadRequest.code,
    msg: CONST.HTTPSTATUSES.ERRORS.BadRequest.name
  };
  const { body } = req;

  const checkSession = await utils.checkSession(body.session_uuid)
  if(!checkSession){
    result.msg = 'Сессия не валидна'
    res.status(200).json(result);
  }

  const files = await db.files.findOne({
    where:{
      id: body.file_id,
      userId: checkSession
    }
  });

  if(files && files.dataValues){
    res.download('./' + files.path, files.filename);
  }else{
    result.msg = 'Нет файлов'
    res.status(200).json(result);
  }

}
