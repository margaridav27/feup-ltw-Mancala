const updater = require('./updater.js');

const crypto = require('crypto');

function verifyProps(body, props) {
  for (let prop of props) {
    if (!body[prop]) return false;
  }
  return true;
}

module.exports.join = function (data) {
  let answer = {};

  const props = ['group', 'nick', 'password', 'size', 'initial'];

  if (!verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { group, nick, password, size, initial } = data;

    // TODO: eventualmente verificar nick e password

    const gameHash = crypto
      .createHash('md5')
      .update(group)
      .update(size)
      .update(initial)
      .digest('hex');

    answer.status = 200;
    answer.body = JSON.stringify({ game: gameHash });
    return answer;
  }
};

module.exports.leave = function () {};

module.exports.notify = function () {};

module.exports.update = function (request, response) {};
