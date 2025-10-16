const bcrypt = require("bcryptjs");
const config = require("../config/db.js");

exports.passwordHash = async (password) =>
  await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

exports.passwordVerify = async (givenPassword, savedPassword) => {
  return await bcrypt.compare(givenPassword, savedPassword);
};
