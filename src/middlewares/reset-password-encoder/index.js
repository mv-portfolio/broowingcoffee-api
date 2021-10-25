const Log = require('../../utility/Log');
const Token = require('../../utility/Token');
const {toName} = require('../../utility/helper');

const Information = require('../../schemas/users/informations');
const Accounts = require('../../schemas/users/accounts');

const NodeMailer = new (require('../../utility/NodeMailer'))();

const {SERVER, FORGOTPASS_SECRET_KEY} = process.env;

module.exports = async (req, res, next) => {
  const {email} = req.body;
  try {
    const userAcc = await Accounts.findOne({email});
    if (userAcc) {
      const userInfo = await Information.findOne({_id_account: userAcc._id});
      const token = Token.encode({email}, FORGOTPASS_SECRET_KEY, {
        expiresIn: 120,
      });

      await NodeMailer.send({
        to: email,
        subject: 'BROOWING COFFEE | RESET PASSWORD',
        html: NodeMailer.template({
          header: `Good day ${toName(userInfo.firstname)}!`,
          paragraph1: `We notice that you are requesting for password reset, if you wish to performed this action, please click the button bellow.`,
          paragraph2: `If you are not requesting for password reset, you can safety ignore this email.`,
          url: `${SERVER}/reset-password/${token}/`,
          buttonText: 'RESET PASSWORD',
        }),
      });
    }
    Log.show(`/POST/reset-password SUCESS`);
    res.status(200).json({status: true});
  } catch (err) {
    Log.show(`/POST/reset-password FALED: ${err.message}`);
    res.status(400).json({status: false, err: err.message});
  }
};
