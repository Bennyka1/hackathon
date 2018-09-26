var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../msg-buddy-bot.zip');
var kuduApi = 'https://msg-buddy-bot.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$msg-buddy-bot';
var password = 'SA55JAvwBxn9ePpw8qKovQNcP1a0qFrtFpGZgbGvRvKiRve8PLQxBmGiL6vx';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('msg-buddy-bot publish');
  } else {
    console.error('failed to publish msg-buddy-bot', err);
  }
});