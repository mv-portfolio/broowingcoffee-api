const Log = require('../../utility/Log');
const {SECRET_KEY1} = process.env;

module.exports = (req, res, next) => {
  const {secret_key1} = req.params;
  try {
    if (secret_key1 === SECRET_KEY1) {
      Log.show(`/POST/route-guard SUCESS`);
      return next();
    }
    throw new Error('Sorry, This is Protected Route');
  } catch (err) {
    Log.show(`/POST/route-guard FAILED: ${err.message}`);
    res
      .json({
        status: false,
        err: err.message,
      })
      .status(400);
  }
};
