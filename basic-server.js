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

//twitter data
var latestTweets = [];
var idStrings = {};


app.get('/*', function(req, res){
  res.send('Hello World');
});

var server = app.listen(port, function(){
  console.log('Basic server is listening on port ' + port);
});

var getMentions = function(){
  twit.get('/statuses/mentions_timeline.json', {count: 10}, function(data){
    if(data.length){
      for(var i = 0; i < data.length; i++){
        var currentTweet = data[i];
        //This if statement determines whether we have already handled this specific tweet
        if(!idStrings[currentTweet.id_str]){
         idStrings[currentTweet.id_str] = true;
          //the object added to latestTweets array
          var tweetObj = {};
          tweetObj.user =  currentTweet.user.screen_name;
          tweetObj.text = currentTweet.text;
          latestTweets.push(tweetObj);
        }
      }      
    } else{
      console.log(data);
    }
    console.log(idStrings);
    console.log(latestTweets);
  });
};

getMentions();