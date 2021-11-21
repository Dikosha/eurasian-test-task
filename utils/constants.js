const CONST = {
  HTTPSTATUSES: {
    ERRORS: {
      BadRequest: {code: 400, name: 'Bad Request'},
      Unauthorized: {code: 401, name: 'Unauthorized'},
      MethodNotAllowed: {code: 405, name: 'Method Not Allowed'},
      InternalServerError: {code: 500, name: 'Internal Server Error'},
      UnknownError: {code: 520, name: 'Unknown Error'}
    },
    SUCCESS: {
      OK: {code: 200, name: 'OK'}
    }
  }
};
module.exports = Object.freeze(CONST);
