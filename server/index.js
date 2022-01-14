'use strict';

const PORT = 9080;

const http = require('http');
const url = require('url');

const register = require('./modules/register.js');
const ranking = require('./modules/ranking.js');
const game = require('./modules/game.js');

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

const server = http.createServer((request, response) => {
  const preq = url.parse(request.url, true);
  const pathname = preq.pathname;

  let answer = {};

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
        answer = game.notify(data);
        break;
      case '/update':
        answer = game.update(data, response);
        break;
      case '/leave':
        answer = game.leave(data);
        break;
      case '/ranking':
        answer = ranking.ranking();
        break;
      case '/favicon.ico':
        break;
      default:
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end({});
        break;
    }
  });

  if (!answer.status) answer.status = 200;
  if (!answer.style) answer.style = 'plain';
  response.writeHead(answer.status, headers[answer.style]);
  if (answer.body) response.write(answer.body);
  if (answer.style === 'plain') response.end();
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
