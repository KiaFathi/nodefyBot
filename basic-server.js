//server related dependencies
var express = require('express');
var app = express();
var port = process.env.port || 8300;

//I'm storing sensitive data in a git ignored file called keys. On a server, you can store
//this data in your process.env
var keys = require('./keys.js');

//twitter dependencies
var twitter = require('twitter');
var twit = new twitter({
  consumer_key: keys.consumerKey,
  consumer_secret: keys.consumerSecret,
  access_token_key: keys.accessTokenKey,
  access_token_secret: keys.accessTokenSecret
});

//twitter data
//latestMentions will be stored in temporary local memory
var latestMentions = [];
//idStrings needs to be updated with a sort of persistent storage, in this case firebase
var idStrings = {};


app.get('/*', function(req, res){
  res.send('Hello World, this is nodefyBot speaking');
});

var server = app.listen(port, function(){
  console.log('Basic server is listening on port ' + port);
});

//This function takes all of the mentions stored in our latestMentions array and responds to them
//with a simple message. We want to invoke it at the end of our getMentions function, so it is called
//when we have all our new mentions. 
var replyToMentions = function(){
  for(var i = 0; i < latestMentions.length; i++){
    var currentMention = latestMentions[i];
    //responseTweet is the string we will send to twitter to tweet for us
    var responseTweet = 'Hello @';
    responseTweet += currentMention.user;
    responseTweet += '\nI hope you are having a wonderful day! \n-Your Favorite Node Server';

    //twit will now post this responseTweet to twitter. This function takes a string and a callback
    twit.updateStatus(responseTweet, function(){
      console.log(responseTweet);
    });
  }
};

//getMentions gets mentions from twitter, keeps track of which id_strings it has handled and then
//passes newest mentions to the latestMentions array to be handled by our later functions
var getMentions = function(){
  twit.get('/statuses/mentions_timeline.json', {count: 10}, function(data){
    if(data.length){
      for(var i = 0; i < data.length; i++){
        var currentTweet = data[i];
        //This if statement determines whether we have already handled this specific tweet
        if(!idStrings[currentTweet.id_str]){
         idStrings[currentTweet.id_str] = true;
          //the object added to latestMentions array
          var tweetObj = {};
          tweetObj.user =  currentTweet.user.screen_name;
          tweetObj.text = currentTweet.text;
          latestMentions.push(tweetObj);

          //response to new mentions
          replyToMentions();
        }
      }      
    } else{
      //This will occur if there is no data, or twitter responds with an error
      console.log(data);
    }
    //These console logs are mostly just for debugging.
    console.log(idStrings);
    console.log(latestMentions);
  });
};


getMentions();