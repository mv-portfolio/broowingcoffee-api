const Log = require('../../utility/Log');
const Token = require('../../utility/Token');

const {SECRET_KEY2, SECRET_MESSAGE} = process.env;

module.exports = (req, res, next) => {
  try {
    const primary_auth_token = Token.encode(
      {message: SECRET_MESSAGE},
      SECRET_KEY2,
    );
    Log.show(
      `/POST/primary-authentication-encoder SUCCESS: new Active Application`,
    );
    res.status(200).json({
      status: true,
      res: {
        primary_auth_token: primary_auth_token,
      },
    });
  } catch (err) {
    Log.show(`/POST/primary-authentication-encoder FAILED: ${err.message}`);
    res.status(400).json({
      status: false,
      err: err.message,
    });
  }
};
