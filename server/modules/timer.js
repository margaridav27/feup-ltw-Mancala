const timeout = 20000

module.exports.clearTimeout = function (id) {
  if (id !== undefined) clearTimeout(id);
};

module.exports.setTimeout = function (callback) {
  return setTimeout(callback, timeout);
};

module.exports.resetTimeout = function (id, callback) {
  if (id !== undefined) clearTimeout(id);
  return setTimeout(callback, timeout);
};
