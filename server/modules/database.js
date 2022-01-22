const fs = require('fs');

module.exports.write = function (table, value) {
  fs.readFile(`./server/database/${table}.json`, 'utf8', () => {
    let updatable = JSON.parse(data);
    updatable.push(value);
    json = JSON.stringify(updatable);
    fs.writeFile(`./server/database/${table}.json`, json, 'utf8', () => {});
  });
};

module.exports.overWrite = function (table, value) {
  fs.readFile(`./server/database/${table}.json`, 'utf8', () => {
    json = JSON.stringify(value);
    fs.writeFile(`./server/database/${table}.json`, json, 'utf8', () => {});
  });
};

module.exports.read = function (table) {
  const data = fs.readFileSync(`./server/database/${table}.json`);
  return JSON.parse(data);
};

module.exports.get = function (table, key, value) {
  const data = this.read(table);
  return data.find((entry) => entry[key] === value);
};
