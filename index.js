'use strict';

const PORT = 8978;

const http = require('http');
const url = require('url');

const ss = require('./server/modules/static.js');
const register = require('./server/modules/register.js');
const ranking = require('./server/modules/ranking.js');
const game = require('./server/modules/game.js');

const headers = {
  plain: {
    'Content-Type': 'application/javascript',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  },
  sse: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    Connection: 'keep-alive',
  },
};

function update(update, first, last) {
  if (update.es !== undefined) {
    console.log('player on queue left the game?',last);
    if (first) update.es.writeHead(200, headers['sse']);
    if (update.body !== undefined) update.es.write('data:' + update.body + '\n\n');
    if (last) update.es.end();
  }

  if (update.es1 !== undefined) {
    console.log('player 1 left the game?', last);
    if (first) update.es1.writeHead(200, headers['sse']);
    if (update.body !== undefined) update.es1.write('data:' + update.body + '\n\n');
    if (last) update.es1.end();
  }

  if (update.es2 !== undefined) {
    console.log('player 2 left the game?', last);
    if (first) update.es2.writeHead(200, headers['sse']);
    if (update.body !== undefined) update.es2.write('data:' + update.body + '\n\n');
    if (last) update.es2.end();
  }
}

function respond(answer, response) {
  if (answer.status === undefined) answer.status = 200;
  if (answer.style === undefined) answer.style = 'plain';

  switch (answer.style) {
    case 'plain':
      response.writeHead(answer.status, headers[answer.style]);
      if (answer.body) response.write(answer.body);
      response.end();
      break;
    case 'sse':
      update(answer, true, false);
      break;
  }

  if (answer.update !== undefined) console.log('UPDATE', answer.update.body, answer.update.last);
  if (answer.update !== undefined) update(answer.update, 
                                          answer.update.first,
                                          answer.update.last);
}

function timeoutCallback(player, game) {
  // timeout was reached and the player was still in queue
  if (player !== undefined) {
    const message = JSON.stringify({ winner: player.nick });
    player.response.writeHead(200, headers['sse']);
    player.response.write('data:' + message + '\n\n');
  }

  // timeout was reached and the game was already occuring
  if (game !== undefined) {
    const message = JSON.stringify({ winner: game.winner });
    game.p1.response.write('data:' + message + '\n\n');
    game.p2.response.write('data:' + message + '\n\n');
  }
}

const server = http.createServer((request, response) => {
  const preq = url.parse(request.url, true);
  const pathname = preq.pathname;

  let answer = {};

  switch (request.method) {
    case 'POST':
      let data = '';
      request.on('data', (chunk) => (data += chunk));
      request.on('end', () => {
        if (data !== '') data = JSON.parse(data);

        switch (pathname) {
          case '/register':
            answer = register.register(data);
            break;
          case '/join':
            answer = game.join(data);
            break;
          case '/notify':
            answer = game.notify(data, timeoutCallback);
            break;
          case '/leave':
            answer = game.leave(data);
            break;
          case '/ranking':
            answer = ranking.ranking(data);
            break;
          default:
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end({});
            break;
        }

        respond(answer, response);
      });
      break;
    case 'GET':
      if (pathname === '/update') {
        answer = game.update(preq.query, response, timeoutCallback);
        respond(answer);
      } else ss.processRequest(request, response);
      break;
    default:
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end({});
      break;
  }
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
