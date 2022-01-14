const mancala = require('./mancala.js');

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
  let index = 0;
  for (const entry of queue) {
    if (entry.group == group && entry.size == size && entry.initial == initial)
      return { match: entry, index };
    index++;
  }
  return { match: undefined, index: -1 };
}
function findInGames(hash) {
  let index = 0;
  for (const game of games) {
    if (game.hash === hash) return { game, index };
    index++;
  }
  return { game: undefined, index: -1 };
}
function findInQueue(hash) {
  let index = 0;
  for (const entry of queue) {
    if (entry.hash === hash) return { entry, index };
    index++;
  }
  return { game: undefined, index: -1 };
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

  if (!verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { group, nick, password, size, initial } = data;

    const hash = crypto.createHash('md5').update(group).update(size).update(initial).digest('hex');

    const { match, matchIndex } = findMatch(group, size, initial);
    if (match) {
      removeFromQueue(matchIndex);
      addToGames({
        p1: { nick: match.nick, response: undefined },
        p2: { nick, response: undefined },
        hash,
        size,
        initial,
      });

      answer.status = 200;
      answer.body = JSON.stringify({ game: match.hash });
    } else {
      addToQueue({ group, nick, size, initial, hash });

      answer.status = 200;
      answer.body = JSON.stringify({ game: hash });
    }

    return answer;
  }
};

module.exports.leave = function (data) {
  let answer = {};

  const props = ['nick', 'password', 'game'];

  if (!verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { nick, password, game } = data;

    answer.status = 200;
    answer.body = JSON.stringify({});

    const { activeGame, gameIndex } = findInGames(game);
    if (activeGame) {
      if (activeGame.p1.nick === nick || activeGame.p2.nick === nick) {
        // mandar update com winner
        removeFromGames(gameIndex);
      } else {
        answer.status = 400;
        answer.body = JSON.stringify({ error: 'Player not associated with given game reference.' });
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
  }

  return answer;
};

module.exports.notify = function (data) {
  let answer = {};

  const props = ['nick', 'password', 'game', 'move'];

  if (!verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { nick, password, game, move } = data;

    const activeGame = findInGames(game).game;
    if (activeGame) {
      if (nick === activeGame.p1.nick || nick === activeGame.p2.nick) {
        const response = mancala.performMove(move, nick);
        answer.status = response.error ? 401 : 200;
        answer.body = JSON.stringify({ board: response });

        // propagar update
        // if response.winner => remover de games
      }
    } else {
      answer.status = 401;
      const inQueue = findInQueue(game).game !== undefined;
      if (inQueue) answer.body = JSON.stringify({ error: 'The game has not started yet.' });
      else answer.body = JSON.stringify({ error: 'Invalid game reference.' });
    }

    answer.status = 200;
    answer.body = JSON.stringify({});
  }

  return answer;
};

module.exports.update = function (data) {
  let answer = {};

  const props = ['game', 'nick'];

  if (!verifyProps(data, props)) {
    answer.status = 400;
    answer.body = JSON.stringify({ error: 'Invalid request body.' });
  } else {
    const { nick, game } = data;

    const { activeGame, gameIndex } = findInGames(game);
    if (activeGame) {
      // verificar response de ambos
      // se ambas as responses estão set => começar o jogo e propagar update para ambos
      // se apenas uma response está set, pending
    }
  }
};
