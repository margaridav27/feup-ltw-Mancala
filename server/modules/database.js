const fs = require('fs');

module.exports.write = function (table, value) {
  fs.readFile(`database/${table}.json`, 'utf8', function readFileCallback(err, data) {
    if (err) console.log('update database', err);
    else {
      let updatable = JSON.parse(data);
      updatable.push(value);
      json = JSON.stringify(updatable);

      fs.writeFile(`database/${table}.json`, json, 'utf8', () => {
        'Write successfully. ';
      });
    }
  });
};

module.exports.read = function (table) {
  const data = fs.readFileSync(`database/${table}.json`);
  return JSON.parse(data);
};

module.exports.get = function (table, key, value) {
  const data = this.read(table);
  return data.find((entry) => entry[key] === value);
};
