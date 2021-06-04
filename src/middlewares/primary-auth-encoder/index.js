const Log = require('../../utility/Log');
const Token = require('../../utility/Token');
const { SECRET_KEY1 } = process.env;

module.exports = (req, res, next) => {
  const CLIENT_SECRET_KEY = req.get('secret-key');
  try {
    if (CLIENT_SECRET_KEY === SECRET_KEY1) {
      const primary_auth_token = Token.encode({ secret_key: CLIENT_SECRET_KEY }, SECRET_KEY1);
      res.json({ status: true, res: { primary_auth_token: primary_auth_token } }).status(200);
      Log.show(`/POST/primary-authentication-encoder SUCCESS: new Active Application`);
    } else {
      throw new Error('does not met the requirements');
    }
  } catch (err) {
    res.json({ status: false, err: err.message }).status(400);
    Log.show(`/POST/primary-authentication-encoder FAILED: ${err.message}`);
  }
};
