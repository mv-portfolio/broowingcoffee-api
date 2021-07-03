const Log = require('../../utility/Log');
const Token = require('../../utility/Token');
const Thread = require('../../utility/Thread');
const Accounts = require('../../schemas/users/accounts');
const Informations = require('../../schemas/users/informations');

const SECRET_KEY2 = process.env.SECRET_KEY2;

module.exports = async (req, res, next) => {
  const {username, password} = req.body;
  try {
    if (username && password) {
      const account_id = await Accounts.login(username, password);
      Thread.onFindOne(
        Informations,
        {_id_account: account_id},
        {
          ref1: '_id_account',
          ref2: '_id_config',
        },
      )
        .then(user => {
          const secondary_auth_token = Token.encode(
            {_id: user._id},
            SECRET_KEY2,
            // {
            //   expiresIn: 60 * 30,
            // },
          );
          if (secondary_auth_token) {
            res
              .json({
                status: true,
                res: {
                  user: user,
                  secondary_auth_token: secondary_auth_token,
                },
              })
              .status(200);
            Log.show(
              `/POST/signin-authentication-encoder SUCCESS: ${username} has been login`,
            );
          }
        })
        .catch(err => {
          throw new Error(err);
        });
    } else {
      throw new Error('Username or Password is incorrect');
    }
  } catch (err) {
    res.json({status: false, err: err.message}).status(400);
    Log.show(`/POST/signin-authentication-encoder FAILED: ${err.message}`);
  }
};
