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

function update(update, first) {
  if (update.es1 !== undefined) {
    if (first) update.es1.writeHead(200, headers['sse']);

    if (update.body !== undefined) 
      update.es1.write('data:' + update.body + '\n\n');

    if (update.end !== undefined)
      update.es1.end();
  }

  if (update.es2 !== undefined) {
    if (first) update.es2.writeHead(200, headers['sse']);

    if (update.body !== undefined) 
      update.es2.write('data:' + update.body + '\n\n');

    if (update.end !== undefined)
      update.es2.end();
  }

  // if (update.es1 !== undefined && update.es2 !== undefined) {
  //   if (first) {
  //     update.es1.writeHead(update.status, headers[update.style]);
  //     update.es2.writeHead(update.status, headers[update.style]);
  //   }
  //   if (update.body !== undefined) {
  //     update.es1.write('data:' + update.body + '\n\n');
  //     update.es2.write('data:' + update.body + '\n\n');
  //   }
  //   if (update.end !== undefined) {
  //     update.es1.end();
  //     update.es2.end();
  //   }
  // }
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
      update(answer, true);
      break;
  }

  if (answer.update !== undefined) update(answer.update, false);
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
