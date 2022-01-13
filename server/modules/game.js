const updater = require('./updater.js');

const crypto = require('crypto');

let queue = [];
let games = [];

function verifyProps(body, props) {
  for (let prop of props) {
    if (!body[prop]) return false;
  }
  return true;
}

function findMatch(group, size, initial) {
  let match = { match: undefined, position: -1 };
  let index = 0;
  for (const entry of queue) {
    if (entry.group == group && entry.size == size && entry.initial == initial)
      return { match: entry, position: index };
    index++;
  }
  return match;
}

function addToQueue(player) {
  queue.push(player);
}

function removeFromQueue(playerPosition) {
  queue.splice(playerPosition, 1);
}

function addToGames(game) {
  games.push(game);
}

module.exports.join = function (data, response) {
  let answer = {};

  const props = ['group', 'nick', 'password', 'size', 'initial'];

  if (!verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { group, nick, password, size, initial } = data;

    const hash = crypto.createHash('md5').update(group).update(size).update(initial).digest('hex');

    const { match, position } = findMatch(group, size, initial);
    if (match) {
      removeFromQueue(position);
      addToGames({
        p1: { nick: match.nick, response: match.response },
        p2: { nick, response },
        hash,
        size,
        initial,
      });

      answer.status = 200;
      answer.body = JSON.stringify({ game: match.hash });
    } else {
      addToQueue({ group, nick, size, initial, hash, response });

      answer.status = 200;
      answer.body = JSON.stringify({ game: hash });
    }

    return answer;
  }
};

module.exports.leave = function () {};

module.exports.notify = function () {};

module.exports.update = function (request, response) {};
