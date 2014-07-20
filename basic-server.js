//server related dependencies
var express = require('express');
var app = express();
var port = process.env.port || 8300;



//twitter dependencies
var keys = require('./keys.js');
var twitter = require('twitter');
var twit = new twitter({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token_key: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});



app.get('/*', function(req, res){
  res.send('Hello World');
});

var server = app.listen(port, function(){
  console.log('Basic server is listening on port ' + port);
});