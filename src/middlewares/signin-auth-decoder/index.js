require('dotenv').config();
const Log = require('../../utility/Log');
const Token = require('../../utility/Token');
const Thread = require('../../utility/Thread');
const Accounts = require('../../schemas/users/accounts');
const Informations = require('../../schemas/users/informations');

const SECRET_KEY2 = process.env.SECRET_KEY2;

module.exports = async (req, res, next) => {
  const secondary_auth_token = req.get('secondary-auth-token');
  try {
    const { _id } = Token.verify(secondary_auth_token, SECRET_KEY2);
    Thread.onFindOne(
      Informations,
      { _id: _id },
      {
        ref1: '_id_account',
        ref2: '_id_config',
      }
    )
      .then((user) => {
        res
          .json({
            status: true,
            res: {
              user: user,
            },
          })
          .status(200);
        Log.show(`/POST/signin-authentication-decoder SUCCESS`);
      })
      .catch((err) => {
        throw new Error(err);
      });
  } catch (err) {
    res.json({ status: false, err: err.message }).status(400);
    Log.show(`/POST/signin-authentication-decoder FAILED: ${err.message}`);
  }
};
