#!/usr/bin/env node

const filename = 'jukugo.txt';
const fs = require('fs');
const lineReader = require('readline').createInterface({
  input: fs.createReadStream(filename)
});

const table = 'edict_jukugo';

let prev_utf = '';

console.log(`
DROP TABLE IF EXISTS ${table};
CREATE TABLE ${table} (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  kanji varchar(2) NOT NULL,
  length TINYINT NOT NULL,
  jukugo varchar(10) NOT NULL,
  KEY kanji (kanji),
  KEY length (length)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

function uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

let count = 0;

lineReader.on('line', line => {
  let jukugo = line;
  let chars = line.split('');
  let kanjis = uniq(chars);
  kanjis.map( kanji => {
    console.log(`INSERT INTO ${table} (kanji, length, jukugo) VALUES ('${kanji}', ${jukugo.length}, '${jukugo}');`);
  });
});
