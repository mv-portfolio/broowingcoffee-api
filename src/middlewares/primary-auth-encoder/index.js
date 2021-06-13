const Log = require('../../utility/Log');
const Token = require('../../utility/Token');
const {SECRET_KEY2} = process.env;

module.exports = (req, res, next) => {
  try {
    const primary_auth_token = Token.encode({message: 'welcome-hacker ☺'}, SECRET_KEY2);
    res
      .json({
        status: true,
        res: {
          primary_auth_token: primary_auth_token,
        },
      })
      .status(200);
    Log.show(`/POST/primary-authentication-encoder SUCCESS: new Active Application`);
  } catch (err) {
    res
      .json({
        status: false,
        err: err.message,
      })
      .status(400);
    Log.show(`/POST/primary-authentication-encoder FAILED: ${err.message}`);
  }
};
