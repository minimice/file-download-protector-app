'use strict';
var http = require('https');
var fs = require('fs');

function _download(url, dest) {
  return new Promise((resolve, reject) => {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(resolve('Download ok'));  // close() is async, call cb after close completes.
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (reject) reject(err.message);
    });
  });
};

module.exports = {
  download: _download
};