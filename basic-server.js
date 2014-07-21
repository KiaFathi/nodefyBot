//server related dependencies
var keys = require('./keys.js');
var express = require('express');
var app = express();
var port = process.env.port || 8300;



//twitter dependencies
var twitter = require('twitter');
var twit = new twitter({
  consumer_key: keys.consumerKey,
  consumer_secret: keys.consumerSecret,
  access_token_key: keys.accessTokenKey,
  access_token_secret: keys.accessTokenSecret
});



app.get('/*', function(req, res){
  res.send('Hello World');
});

var server = app.listen(port, function(){
  console.log('Basic server is listening on port ' + port);
});

//Lets see if we can get our mentions from our newly established twitter connection
//This get method is a property of the node twitter package
//We are establishing the url to get from, and how many mentions (at most 10) we want
//Right now whatever you get will back will be console logged!
twit.get('/statuses/mentions_timeline.json', { count: 10}, function(data){
 console.log(data);
});