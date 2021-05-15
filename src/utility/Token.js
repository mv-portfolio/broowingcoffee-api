require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports.encode = (payload, secret_key, config, func) => jwt.sign(payload, secret_key, config, func);
module.exports.decode = (token) => jwt.decode(token, { complete: true });
module.exports.verify = (token, secret_key, func) => jwt.verify(token, secret_key, func);