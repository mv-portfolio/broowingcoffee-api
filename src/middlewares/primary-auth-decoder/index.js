const Log = require('../../utility/Log');
const Token = require('../../utility/Token');
const {SECRET_KEY2} = process.env;

module.exports = (req, res, next) => {
  const CLIENT_PRIMARY_TOKEN = req.get('primary-auth-token');
  console.log(CLIENT_PRIMARY_TOKEN);
  try {
    const {message} = Token.verify(CLIENT_PRIMARY_TOKEN, SECRET_KEY2);
    if (message === 'welcome-hacker ☺') {
      Log.show(`/POST/primary-authentication-decoder SUCCESS`);
      return next();
    }
    throw new Error('does not met the requirements');
  } catch (err) {
    Log.show(`/POST/primary-authentication-decoder FAILED: ${err.message}`);
    res.json({status: false, err: err.message}).status(400);
  }
};
