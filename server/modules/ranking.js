const database = require('./database.js');

module.exports.ranking = function (response) {
  const ranking = database.read('ranking');

  response.writeHead(200);
  response.write(JSON.stringify({ ranking: ranking }));
  response.end();
};
