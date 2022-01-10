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
  const preq = url.parse(request.url, true);
  const pathname = preq.pathname;

  switch (request.url) {
    case '/register':
      register.register();
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
      ranking.ranking();
      break;
    default:
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.end({});
  }
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

// const PORT = 9078;

// const WebSocketServer = require('websocket').server;
// const http = require('http');

// const httpServer = http.createServer(() => {}).listen(PORT);
// const webSocketServer = new WebSocketServer({ httpServer });

// webSocketServer.on('message', (req) => {
//   const connection = req.accept(null, req.origin);

//   connection.on('open', () => remember(connection));

//   connection.on('close', () => forget(connection));

//   connection.on('request', (msg) => {
//     if (msg.type === 'utf8') process(JSON.parse(msg.utf8Data), connection);
//     else console.log('Unsupported message type: ' + req.type);
//   });
// });

// let connections = [];
// let users = {}; // users table
// let games = {}; // games table

// function process(msg) {
//   switch (msg.method) {
//     case 'register':
//       break;
//     case 'join':
//       break;
//     case 'leave':
//       break;
//     case 'notify':
//       break;
//     case 'ranking':
//       break;
//     case 'update':
//       break;
//   }
// }

// function remember(connection) {
//   connections.push(connection);
// }

// function forget(connection) {
//   let pos = connections.findIndex((conn) => conn === connection);
//   if (pos > -1) connections.splice(pos, 1);
// }

// function broadcast(data) {
//   let json = JSON.stringify(data);
//   for (let connection of connections) connection.sendUTF(json);
// }
