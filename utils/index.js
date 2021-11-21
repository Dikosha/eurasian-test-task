const db = require("../models");

module.exports.catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports.checkSession = async(session_uuid) => {
  try{
    const session = await db.sessions.findOne({
      where: {
        uuid: session_uuid
      }
    })
    if(session.dataValues) return session.dataValues.userId;
  }catch(e){
    return false
  }

  return false;
};
