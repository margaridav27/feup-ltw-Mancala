const database = require('./database.js');
const verifier = require('./verifier.js');

const crypto = require('crypto');

function registerUser(nickname, password) {
  const encrypytedPass = crypto.createHash('md5').update(password).digest('hex');
  const user = { nick: nickname, password: encrypytedPass };
  database.write('users', user);
}

module.exports.register = function (data) {
  let answer = {};

  const props = ['nick', 'password'];

  if (!verifier.verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { nick, password } = data;

    answer.status = 200;
    answer.body = JSON.stringify({});

    if (!verifier.verifyUserExists(nick)) registerUser(nick, password);
    else if (!verifier.verifyCredentials(nick, password)) {
      answer.status = 401;
      answer.body = JSON.stringify({ error: 'User registered with a different password' });
    }
  }

  return answer;
};
