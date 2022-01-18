const database = require('./database.js');

module.exports.ranking = function () {
  const ranking = database.read('ranking');

  let answer = {};
  answer.status = 200;
  answer.body = JSON.stringify({ ranking: ranking.slice(0, 10) });
  return answer;
};

module.exports.addGame = function (game) {
  let ranking = database.read('ranking');

  let p1 = ranking.find((info) => info.nick == game.p1.nick);
  let p2 = ranking.find((info) => info.nick == game.p2.nick);

  if (p1 === undefined) {
    p1 = { nick: game.p1.nick, victories: 0, games: 0 };
    ranking.push(p1);
  }
  if (p2 === undefined) {
    p2 = { nick: game.p2.nick, victories: 0, games: 0 };
    ranking.push(p2);
  }

  if (game.gameObj.winner === game.p1.nick) p1.victories++;
  if (game.gameObj.winner === game.p2.nick) p2.victories++;
  p1.games++;
  p2.games++;

  ranking.sort((p1, p2) => (p1.victories < p2.victories ? 1 : p1.games < p2.games ? 1 : -1));

  database.overWrite('ranking', ranking);
};
