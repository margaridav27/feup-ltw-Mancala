const timeout = 20000

module.exports.clearTimeout = function (id) {
  console.log('clear timeout');
  if (id !== undefined) clearTimeout(id);
};

module.exports.setTimeout = function (callback) {
  console.log('set timeout');
  return setTimeout(callback, timeout);
};

module.exports.resetTimeout = function (id, callback) {
  console.log('reset clear');
  if (id !== undefined) clearTimeout(id);
  return setTimeout(callback, timeout);
};
