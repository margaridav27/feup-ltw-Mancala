let responses = [];

module.exports.remember = function (response) {
  responses.push(response);
};

module.exports.forget = function (response) {
  let pos = responses.findIndex((res) => res === response);
  if (pos > -1) responses.splice(pos, 1);
};

module.exports.update = function (message) {
  for (let response of responses) {
    response.write('data: ' + message + '\n\n');
  }
};
