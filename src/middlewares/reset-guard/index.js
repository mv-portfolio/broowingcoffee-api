const Log = require('../../utility/Log');
const Token = require('../../utility/Token');

const {SECRET_KEY2} = process.env;

module.exports = (req, res, next) => {
  const resetAuthToken = req.get('reset-auth-token');
  const {tokenUsed} = req.app.locals;

  try {
    if (tokenUsed.isTokenUsed(resetAuthToken)) {
      throw new Error('Reset Authentication already used');
    }
    const {email} = Token.verify(resetAuthToken, SECRET_KEY2);
    if (email) {
      Log.show(`/GET/reset-guard SUCESS`);
      res.locals.email = email;
      res.locals.token = resetAuthToken;
      next();
      return;
    }
    throw new Error('Reset Authentication is invalid');
  } catch (err) {
    Log.show(`/GET/reset-guard FAILED: ${err.message}`);
    res.status(400).json({status: false, err: err.message});
  }
};
