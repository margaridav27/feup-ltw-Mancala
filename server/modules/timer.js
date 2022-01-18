module.exports.clearTimeout = function (id) {
  if (id !== undefined) clearTimeout(id);
};

module.exports.setTimeout = function (callback) {
  return setTimeout(callback, 60000);
};

module.exports.resetTimeout = function (id, callback) {
  if (id !== undefined) this.clearTimeout(id);
  return setTimeout(callback, 60000);
};
