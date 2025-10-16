const jwt = require('jsonwebtoken');
const verifyJWT = (token, secret) => jwt.verify(token, secret);

module.exports = verifyJWT;
