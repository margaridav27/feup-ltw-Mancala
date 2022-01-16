const database = require('./database.js');

module.exports.ranking = function () {
  const ranking = database.read('ranking');

  let answer = {};
  answer.status = 200;
  answer.body = JSON.stringify({ ranking: ranking });
  return answer;
};

module.exports.addGame = function(game) {
  
}
