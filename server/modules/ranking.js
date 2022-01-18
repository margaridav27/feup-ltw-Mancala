const database = require('./database.js');
      // let scoreHistoryCell = this.localScores.find((info) => info.player == game.players[i]);

module.exports.ranking = function (data) {
  console.log(data);
  const ranking = database.read('ranking');
  this.addGame(ranking, data);

  let answer = {};
  answer.status = 200;
  answer.body = JSON.stringify({ ranking: ranking });
  return answer;
};

module.exports.addGame = function(ranking, game) {
  console.log(ranking);
  let user = ranking.find((info) => info.nick == game.nick);
  console.log(user);
  if (user) {
    if (user.nick == game.winner) {
      user.victories++;
    }
    user.games++;
    database.overWrite('ranking', ranking);
  }
  else {
    if (ranking.length > 10) console.log("dar handell disto");
  }
  console.log(ranking);
  console.log(user);
  ranking.sort((p1, p2) => (p1.victories < p2.victories ? 1 : -1));
  console.log(ranking);
  console.log("here2");
  database.overWrite('ranking', ranking);
}
