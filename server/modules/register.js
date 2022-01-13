const database = require('./database.js');

const crypto = require('crypto');

function verifyProps(body, props) {
  for (let prop of props) {
    if (!body[prop]) return false;
  }
  return true;
}

function registerUser(nickname, password) {
  const user = { nick: nickname, pass: password };
  database.write('users', user);
}

function verifyCredentials(nickname, password) {
  const user = database.get('users', 'nick', nickname);
  if (user) return password == user.password;
  registerUser(nickname, password);
  return true;
}

module.exports.register = function (data) {
  let answer = {};

  const props = ['nick', 'password'];

  if (!verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { nick, password } = data;

    answer.status = 200;
    answer.body = JSON.stringify({});

    const encrypytedPass = crypto.createHash('md5').update(password).digest('hex');
    if (!verifyCredentials(nick, encrypytedPass)) {
      answer.status = 401;
      answer.body = JSON.stringify({ error: 'User registered with a different password' });
    }
  }
  return answer;
};
