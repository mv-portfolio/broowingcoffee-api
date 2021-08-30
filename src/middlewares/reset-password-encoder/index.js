const nodemailer = require('nodemailer');

const mailerConfig = require('./mailer-config');
const message = require('./message');

const Log = require('../../utility/Log');
const Token = require('../../utility/Token');

const {SECRET_KEY1} = process.env;

module.exports = async (req, res, next) => {
  const {email} = req.body;
  try {
    const token = Token.encode({email}, SECRET_KEY1, {expiresIn: 60});
    const transporter = nodemailer.createTransport(mailerConfig);
    const info = await transporter.sendMail(
      message(email, 'RESET PASSWORD', token),
    );
    Log.show(`/POST/reset-password SUCESS`);
    res.status(200).json({status: true, res: info});
  } catch (err) {
    Log.show(`/POST/reset-password FALED: ${err.message}`);
    res.status(400).json({status: false, err: err.message});
  }
};
