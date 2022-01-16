const database = require('./database.js');

const crypto = require('crypto');

module.exports.verifyProps = function (body, props) {
  for (const prop of props) {
    if (body[prop] === undefined) return false;
  }
  return true;
};

module.exports.verifyUserExists = function (nickname) {
  return database.get('users', 'nick', nickname) !== undefined;
};

module.exports.verifyCredentials = function (nickname, password) {
  const user = database.get('users', 'nick', nickname);
  if (user) {
    const encrypytedPass = crypto.createHash('md5').update(password).digest('hex');
    return encrypytedPass === user.password;
  }
  return false;
};
