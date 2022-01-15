const mancala = require('./mancala.js');
const verifier = require('./verifier.js');

const crypto = require('crypto');

let queue = [];
let games = [];

function findMatch(group, size, initial) {
  let index = 0;
  for (const entry of queue) {
    if (entry.group == group && entry.size == size && entry.initial == initial)
      return { match: entry, matchIndex: index };
    index++;
  }
  return { match: undefined, matchIndex: -1 };
}
function findInGames(hash) {
  let index = 0;
  for (const game of games) {
    if (game.hash === hash) return { activeGame: game, gameIndex: index };
    index++;
  }
  return { activeGame: undefined, gameIndex: -1 };
}
function findInQueue(hash) {
  let index = 0;
  for (const entry of queue) {
    if (entry.hash === hash) return { playerInQueue: entry, playerIndex: index };
    index++;
  }
  return { playerInQueue: undefined, playerIndex: -1 };
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
function removeFromGames(gamePosition) {
  games.splice(gamePosition, 1);
}

module.exports.join = function (data) {
  let answer = {};

  const props = ['group', 'nick', 'password', 'size', 'initial'];

  if (!verifier.verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { group, nick, password, size, initial } = data;

    if (verifier.verifyCredentials(nick, password)) {
      const hash = crypto
        .createHash('md5')
        .update(group)
        .update(size)
        .update(initial)
        .digest('hex');

      const { match, matchIndex } = findMatch(group, size, initial);
      if (match) {
        removeFromQueue(matchIndex);
        addToGames({
          p1: { nick: match.nick, response: match.response },
          p2: { nick, response: undefined },
          hash,
          size,
          initial,
        });

        answer.status = 200;
        answer.body = JSON.stringify({ game: match.hash });
      } else {
        addToQueue({ group, nick, size, initial, hash, response: undefined });

        answer.status = 200;
        answer.body = JSON.stringify({ game: hash });
      }
    } else {
      answer.status = 400;
      answer.body = JSON.stringify({ error: 'Invalid credentials.' });
    }
  }

  return answer;
};

module.exports.leave = function (data) {
  let answer = {};

  const props = ['nick', 'password', 'game'];

  if (!verifier.verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { nick, password, game } = data;

    if (verifier.verifyCredentials(nick, password)) {
      answer.status = 200;
      answer.body = JSON.stringify({});

      const { activeGame, gameIndex } = findInGames(game);
      if (activeGame) {
        if (activeGame.p1.nick === nick || activeGame.p2.nick === nick) {
          // mandar update com winner
          removeFromGames(gameIndex);
        } else {
          answer.status = 400;
          answer.body = JSON.stringify({
            error: 'Player not associated with given game reference.',
          });
        }
      } else {
        const { playerInQueue, playerIndex } = findInQueue(game);
        if (playerInQueue) {
          removeFromQueue(playerIndex);
        } else {
          answer.status = 400;
          answer.body = JSON.stringify({ error: 'Invalid game reference.' });
        }
      }
    } else {
      answer.status = 400;
      answer.body = JSON.stringify({ error: 'Invalid credentials.' });
    }
  }

  return answer;
};

module.exports.notify = function (data) {
  let answer = {};

  const props = ['nick', 'password', 'game', 'move'];

  if (!verifier.verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { nick, password, game, move } = data;

    if (verifier.verifyCredentials(nick, password)) {
      const activeGame = findInGames(game).activeGame;
      if (activeGame) {
        if (nick === activeGame.p1.nick || nick === activeGame.p2.nick) {
          const response = mancala.performMove(move, nick, activeGame.gameObj);

          if (activeGame.p1.response && activeGame.p2.response) {
            activeGame.gameObj = response;
            //propagateUpdate(activeGame.p1.response, activeGame.p2.response, response);
          }

          answer.status = response.error ? 401 : 200;
          answer.body = JSON.stringify(response);

          // if response.winner => remover de games
        }
      } else {
        answer.status = 401;
        const inQueue = findInQueue(game).game !== undefined;
        if (inQueue) answer.body = JSON.stringify({ error: 'The game has not started yet.' });
        else answer.body = JSON.stringify({ error: 'Invalid game reference.' });
      }
    } else {
      answer.status = 400;
      answer.body = JSON.stringify({ error: 'Invalid credentials.' });
    }
  }

  return answer;
};

module.exports.update = function (data, response) {
  let answer = {};

  const props = ['game', 'nick'];

  if (!verifier.verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { nick, game } = data;

    let { activeGame, _ } = findInGames(game);
    if (activeGame) {
      if (nick === activeGame.p1.nick && activeGame.p1.response === undefined)
        activeGame.p1.response = response;
      if (nick === activeGame.p2.nick && activeGame.p2.response === undefined)
        activeGame.p2.response = response;

      if (activeGame.p1.response && activeGame.p2.response) {
        activeGame.gameObj = mancala.initGame(
          activeGame.size,
          activeGame.initial,
          activeGame.p1.nick,
          activeGame.p2.nick
        );

        answer.status = 200;
        answer.style = 'sse';
        answer.es1 = activeGame.p1.response;
        answer.es2 = activeGame.p2.response;
        answer.body = JSON.stringify(activeGame.gameObj);
      }
    } else {
      let { playerInQueue, _ } = findInQueue(game);
      if (playerInQueue) {
        playerInQueue.response = response;
        answer.status = 200;
        answer.style = 'sse';
      } else {
        answer.status = 400;
        answer.body = JSON.stringify({ error: 'Invalid game reference.' });
      }
    }
  }

  return answer;
};
