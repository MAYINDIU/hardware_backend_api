const jwt = require('jsonwebtoken');

const generateJWT = (payload, secret, options) => jwt.sign(payload, secret, options);
module.exports = generateJWT;
