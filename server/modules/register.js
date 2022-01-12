const fs = require('fs');

function register(nickname, password) {
  const user = { nick: nickname, pass: password };
  fs.writeFile('database/database.json', user); 
}

function verify(nickname, pass) {
  const data = fs.readFileSync('database/database.json');
  const info = JSON.parse(data);

  //if nick exists, check pass
  const user = info.users.find(({nick}) => nick === nickname);
  if (user) return pass == user.pass;
  register(nickname);
  return true;
}

module.exports.register = function(request, response) {
  const body = request.query;
  const { nick, pass } = body;

  let responseStatusCode = 200;
  let responseBody = {};

  if (!verify(nick, pass)) {
    responseStatusCode = 400;
    responseBody = { error: "User registered with a different password" };
  } 

  response.writeHead(responseStatusCode);
  response.write(JSON.stringify(responseBody));
  response.end();
}