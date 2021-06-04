const Log = require('../../utility/Log');
const Token = require('../../utility/Token');
const { SECRET_KEY1 } = process.env;

module.exports = (req, res, next) => {
  const CLIENT_PRIMARY_TOKEN = req.get('primary-auth-token');
  try {
    const { secret_key } = Token.verify(CLIENT_PRIMARY_TOKEN, SECRET_KEY1);
    if (secret_key === SECRET_KEY1) {
      Log.show(`/POST/primary-authentication-decoder SUCCESS`);
      next();
    } else throw new Error('does not met the requirements');
  } catch (err) {
    res.json({ status: false, err: err.message }).status(400);
    Log.show(`/POST/primary-authentication-decoder FAILED: ${err.message}`);
  }
};
