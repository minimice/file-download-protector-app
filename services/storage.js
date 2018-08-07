'use strict';

const mongoose = require('mongoose');
const moment = require('moment');

// Connect to cloud database
const username = process.env.DBUSER || "MISSING-USER";
const password = process.env.DBPASSWORD || "MISSING-PASSWORD";
const address = process.env.DBADDRESS || 'MISSING-DATABASE';

const url = 'mongodb://' + username + ':' + password + address;
const Schema = mongoose.Schema;
const userSchema = new Schema({
  ip: String,
  file: String,
  date: Date,
  key: String,
  count: Number
});
const Users = mongoose.model('User', userSchema);

function _getNumberOfDownloadsToday(ip_user, file_user) {
  return new Promise(function(resolve, reject) {
    const now = moment().format("YYYY-MM-DD");
    const key_user = ip_user+""+file_user+""+now;
    console.log("Searching for " + key_user);
    Users.findOne({ key: key_user }, function(err, user) {
      if (!user) {
        console.log("New download for " + key_user);
        resolve(0);
      } else {
        console.log("Download count is " + user.count + " for " + key_user);
        resolve(user.count);
      }
    });
  });
}

function _store(ip_user, file_user) {
  const now = moment().format("YYYY-MM-DD");
  const key_user = ip_user+""+file_user+""+now;
  console.log("Looking up " + key_user);
  Users.findOne({ key: key_user }, function(err, user) {
    if (!user) {
      var user = new Users({ ip: ip_user, file: file_user, date: now, key: key_user, count: 1});
      user.save(function(err) {
        console.log('New user saved');
      });
    } else {
      var nextCount = user.count + 1;
      console.log(nextCount + " time(s) downloaded by " + ip_user);
      user.count = nextCount;
      user.save(function(err) {
        console.log('Saving...');
      });
    }
  });
}

function _connect() {
  return new Promise((resolve, reject) => {
    mongoose.connect(url, function(err) {
      if (err) {
        reject(err);
        console.log(err);
      } else {
        resolve("Connected to mongodb (cloud)");
        console.log("Connected to mongodb (cloud)");
      }
    });
  });  
}

module.exports = {
  connect: _connect,
  store: _store,
  getNumberOfDownloadsToday: _getNumberOfDownloadsToday,
};
