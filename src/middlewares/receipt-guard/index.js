const Log = require('../../utility/Log');
const Token = require('../../utility/Token');

const {RECEIPT_SECRET_KEY} = process.env;

module.exports = (req, res, next) => {
  const receiptAuthToken = req.get('receipt-auth-token');
  try {
    const payload = Token.verify(receiptAuthToken, RECEIPT_SECRET_KEY);
    if (payload) {
      res.locals.payload = payload.transaction;
      next();
    }
  } catch (err) {
    Log.show(`/GET/receipt-guard FAILED`);
    res.status(400).json({status: false, err: err.message});
  }
};
