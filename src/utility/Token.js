const jwt = require('jsonwebtoken');

module.exports.encode = (payload, secret_key, config, func) => {
  return jwt.sign(payload, secret_key, config, func);
};
module.exports.decode = (token) => {
  return jwt.decode(token, { complete: true });
};
module.exports.verify = (token, secret_key, func) => {
  return jwt.verify(token, secret_key, func);
};
