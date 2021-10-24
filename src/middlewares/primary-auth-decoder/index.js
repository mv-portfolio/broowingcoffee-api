const Log = require('../../utility/Log');
const Token = require('../../utility/Token');

const {SECRET_KEY2, SECRET_MESSAGE} = process.env;

module.exports = (req, res, next) => {
  const primaryAuthToken = req.get('primary-auth-token');
  try {
    if (!primaryAuthToken) {
      throw new Error('Primary Authentication is invalid');
    }

    const {message} = Token.verify(primaryAuthToken, SECRET_KEY2);
    if (message === SECRET_MESSAGE) {
      Log.show(`/POST/primary-authentication-decoder SUCCESS`);
      return next();
    }

    throw new Error('does not met the requirements');
  } catch (err) {
    Log.show(`/POST/primary-authentication-decoder FAILED: ${err.message}`);
    res.json({status: false, err: err.message}).status(400);
  }
};
