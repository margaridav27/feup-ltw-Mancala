'use strict';

const PORT = 8000;

const http = require('http');
const url = require('url');

const fs = require('fs'); // to serve as database
const crypto = require('crypto'); // to encrypt the players passwords

const updater = require('./modules/updater.js');
const register = require('./modules/register.js');
const ranking = require('./modules/ranking.js');
const game = require('./modules/game.js');

const server = http.createServer(function (request, response) {
  switch (request.url) {
    case '/register': register.register(); break;
    case '/join': game.join(); break;
    case '/notify': game.notify(); break;
    case '/update': game.update(); break;
    case '/leave': game.leave(); break;
    case '/ranking': ranking.ranking(); break;
    default:
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.end({});
  }
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
