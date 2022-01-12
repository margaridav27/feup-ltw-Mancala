const fs = require('fs');

function updateDatabase(value, table) {
    fs.readFile('database/database.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log("heloooo", err);
        } else {

        let updatable = JSON.parse(data)[table]; 
        updatable.push(value);
        json = JSON.stringify(updatable)

        fs.writeFile('database/database.json', json, 'utf8', callback); // write it back 
    }});
}


function readDatabase(table) {
    const data = fs.readFileSync('database/database.json');
    return JSON.parse(data)[table];
}

module.exports.ranking = function(response) {
  const ranking = readDatabase('ranking');
  const responseBody = { ranking: ranking };

  response.writeHead(200);
  response.write(JSON.stringify(responseBody));
  response.end();
}