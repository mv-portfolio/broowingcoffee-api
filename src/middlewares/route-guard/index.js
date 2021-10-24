const Log = require('../../utility/Log');
const {SECRET_KEY1} = process.env;

module.exports = (req, res, next) => {
  const {secret_key1} = req.params;
  try {
    if (secret_key1 === SECRET_KEY1) {
      Log.show(`/GET/route-guard SUCESS`);
      next();
      return;
    }
    throw new Error('Route Authentication is invalid');
  } catch (err) {
    Log.show(`/GET/route-guard FAILED: ${err.message}`);
    res.status(403).json({status: false, err: err.message});
  }
};
