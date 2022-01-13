'use strict';

const PORT = 9080;

const http = require('http');
const url = require('url');

const fs = require('fs'); // to serve as database
const crypto = require('crypto'); // to encrypt the players passwords

const updater = require('./modules/updater.js');
const register = require('./modules/register.js');
const ranking = require('./modules/ranking.js');
const game = require('./modules/game.js');

const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'        
    },
    sse: {    
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
};

const server = http.createServer(function (request, response) {
  const preq = url.parse(request.url, true);
  const pathname = preq.pathname;

  switch (pathname) {
    case '/register': 
      register.register(preq, response); 
      break;
    case '/join': 
      game.join(); 
      break;
    case '/notify': 
      game.notify(); 
      break;
    case '/update': 
      game.update(); 
      break;
    case '/leave': 
      game.leave(); 
      break;
    case '/ranking': 
      ranking.ranking(response); 
      break;
    // case '/favicon.ico': break;
    default:
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.end({});
      break;
  }
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
