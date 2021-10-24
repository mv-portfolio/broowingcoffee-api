const nodemailer = require('nodemailer');

const mailerConfig = require('./mailer-config');
const message = require('./message');

const {toName} = require('../../utility/helper');
const Log = require('../../utility/Log');
const Token = require('../../utility/Token');
const template = require('./template');

const Information = require('../../schemas/users/informations');
const Accounts = require('../../schemas/users/accounts');

const {SERVER, SECRET_KEY2} = process.env;

module.exports = async (req, res, next) => {
  const {email} = req.body;
  try {
    const userAcc = await Accounts.findOne({email});
    if (userAcc) {
      const userInfo = await Information.findOne({_id_account: userAcc._id});
      const token = Token.encode({email}, SECRET_KEY2, {expiresIn: 120});
      const transporter = nodemailer.createTransport(mailerConfig);
      await transporter.sendMail(
        message({
          to: email,
          subject: 'BROOWING COFFEE | RESET PASSWORD',
          html: template({
            who: `${toName(userInfo.firstname)}`,
            url: `${SERVER}/reset-password/${token}/`,
          }),
        }),
      );
    }
    Log.show(`/POST/reset-password SUCESS`);
    res.status(200).json({status: true});
  } catch (err) {
    Log.show(`/POST/reset-password FALED: ${err.message}`);
    res.status(400).json({status: false, err: err.message});
  }
};
