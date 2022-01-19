const mancala = require('./mancala.js');
const verifier = require('./verifier.js');
const timer = require('./timer.js');
const ranking = require('./ranking.js');

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
    console.log('erroooooooor111111111111 400');
  } else {
    const { group, nick, password, size, initial } = data;

    if (verifier.verifyCredentials(nick, password)) {
      console.log('inside if after verify');
      const { match, matchIndex } = findMatch(group, size, initial);
      if (match) {
        timer.clearTimeout(match.timeoutId);

        removeFromQueue(matchIndex);
        console.log('removed the player from the queue', match.nick);

        addToGames({
          p1: { nick: match.nick, response: match.response },
          p2: { nick, response: undefined },
          hash: match.hash,
          size,
          initial,
        });
        console.log('new game added between', match.nick, 'and', nick);

        answer.status = 200;
        answer.body = JSON.stringify({ game: match.hash });
      } else {
        const hash = crypto
          .createHash('md5')
          .update(JSON.stringify({ time: Date.now().toString(), group, size, initial }))
          .digest('hex');

        addToQueue({ group, nick, size, initial, hash, response: undefined });
        console.log('added a player to the queue', nick);

        answer.status = 200;
        answer.body = JSON.stringify({ game: hash });
      }
    } else {
      answer.status = 400;
      answer.body = JSON.stringify({ error: 'Invalid credentials.' });
      console.log('erroooooooor 400');
    }
  }
  
  console.log('returning');

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
        if (activeGame.p1 !== undefined && activeGame.p2 !== undefined) {
          // none of the players left the game yet
          if (activeGame.p1.nick === nick || activeGame.p2.nick === nick) {
            answer.update = {
              status: 200,
              style: 'sse',
              es1: activeGame.p1.response,
              es2: activeGame.p2.response,
              end: true,
              body: JSON.stringify({
                winner: activeGame.p1.nick === nick ? activeGame.p2.nick : activeGame.p1.nick,
              }),
            };
          }

          // at least one of the players left the game
          if (activeGame.p1.nick === nick) activeGame.p1 = undefined;
          else if (activeGame.p2.nick === nick) activeGame.p2 = undefined;
        } else {
          // both players left the game => remove it from active games
          if (activeGame.p1 === undefined && activeGame.p2 === undefined)
            removeFromGames(gameIndex);
        }
      } else {
        const { playerInQueue, playerIndex } = findInQueue(game);
        if (playerInQueue) removeFromQueue(playerIndex);
        else {
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

module.exports.notify = function (data, callback) {
  let answer = {};

  const props = ['game', 'nick', 'password', 'move'];

  if (!verifier.verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { nick, password, game, move } = data;

    if (verifier.verifyCredentials(nick, password)) {
      const { activeGame, gameIndex } = findInGames(game);
      if (activeGame) {
        if (nick === activeGame.p1.nick || nick === activeGame.p2.nick) {
          const response = mancala.performMove(move, nick, activeGame.gameObj);

          if (activeGame.p1.response && activeGame.p2.response) {
            if (response.error) {
              answer.status = 401;
              answer.body = JSON.stringify(response);
            } else {
              activeGame.gameObj = response;

              answer.status = 200;
              answer.body = JSON.stringify({});
              answer.update = {
                status: 200,
                style: 'sse',
                es1: activeGame.p1.response,
                es2: activeGame.p2.response,
                body: JSON.stringify(activeGame.gameObj),
              };

              activeGame.timeoutId = timer.resetTimeout(activeGame.timeoutId, () => {
                removeFromGames(gameIndex);
                callback(undefined, activeGame);
              });
            }
          }

          if (response.winner) {
            removeFromGames(activeGame);
            ranking.addGame(activeGame);
          }
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

module.exports.update = function (data, response, callback) {
  let answer = {};

  const props = ['nick', 'game'];

  if (!verifier.verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { nick, game } = data;

    let { activeGame, gameIndex } = findInGames(game);
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

        activeGame.timeoutId = timer.setTimeout(() => {
          removeFromGames(gameIndex);
          callback(undefined, activeGame);
        });

        answer.status = 200;
        answer.style = 'sse';
        answer.es1 = activeGame.p1.response;
        answer.es2 = activeGame.p2.response;
        answer.body = JSON.stringify(activeGame.gameObj);
      }
    } else {
      let { playerInQueue, playerIndex } = findInQueue(game);

      if (playerInQueue) {
        playerInQueue.response = response;

        answer.status = 200;
        answer.style = 'sse';

        playerInQueue.timeoutId = timer.setTimeout(() => {
          removeFromQueue(playerIndex);
          callback(playerInQueue, undefined);
        });
      } else {
        answer.status = 400;
        answer.body = JSON.stringify({ error: 'Invalid game reference.' });
      }
    }
  }

  return answer;
};
