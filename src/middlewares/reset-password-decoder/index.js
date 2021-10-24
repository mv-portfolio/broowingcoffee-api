const bcrypt = require('bcrypt');

const Log = require('../../utility/Log');
const {isPassword} = require('../../utility/checker');

const Accounts = require('../../schemas/users/accounts');

module.exports = async (req, res, next) => {
  try {
    const {email, newPassword} = req.body;
    const resetAuthToken = req.get('reset-auth-token');
    const {tokenUsed} = req.app.locals;

    if (!isPassword(newPassword)) {
      throw new Error(
        'Password must contains 6 characters, uppercase, lowercase letters, and numbers',
      );
    }
    tokenUsed.pushUsedToken(resetAuthToken);

    const salt = await bcrypt.genSalt();
    await Accounts.updateOne(
      {email},
      {password: await bcrypt.hash(newPassword, salt)},
    );
    Log.show(`/POST/reset-password-decoder SUCCESS`);
    res.status(200).json({status: true});
  } catch (err) {
    Log.show(`/POST/reset-password-decoder FAILED`);
    res.status(400).json({status: false, err: err.message});
  }
};
