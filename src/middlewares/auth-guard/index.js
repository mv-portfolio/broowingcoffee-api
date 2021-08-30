const Log = require('../../utility/Log');
const Token = require('../../utility/Token');
const {SECRET_KEY2} = process.env;

module.exports = (req, res, next) => {
  const secondary_auth_token = req.get('secondary-auth-token');
  try {
    const {_id} = Token.verify(secondary_auth_token, SECRET_KEY2);
    if (_id) {
      return next();
    }
    throw new Error('Sorry, you are unauthorized user.');
  } catch (err) {
    Log.show(`/POST/auth-guard FAILED: ${err.message}`);
    res.status(401).json({
      status: false,
      err: err.message,
    });
  }
};
