//server related dependencies
var express = require('express');
var app = express();
var port = process.env.PORT || 8300;
var Firebase = require('firebase');
var ref = new Firebase('https://nodefybot.firebaseio.com/');
var wit = require('./wit.js');
var unirest = require('unirest');
var eventsFn = require('./events.js');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//I'm storing sensitive data in a git ignored file called keys. On a server, you can store
//this data in your process.env
if(!process.env.PORT){
  var keys = require('./API_KEYS_GIT_IGNORE_THIS.js');
}


//twitter dependencies
var twitter = require('twitter');
var twit = new twitter({
  consumer_key: process.env.consumerKey || keys.twitter.consumer_key,
  consumer_secret: process.env.consumerSecret || keys.twitter.consumer_secret,
  access_token_key: process.env.accessTokenKey || keys.twitter.access_token_key,
  access_token_secret: process.env.accessTokenSecret || keys.twitter.access_token_secret
});


//twitter data
//latestMentions will be stored in temporary local memory
var idStrings;
var latestMentions = [];


//idStrings needs to be updated with a sort of persistent storage, in this case firebase
var init = function(){
  if(!idStrings){
    ref.on('value', function(data){
      idStrings = data.val();
      getMentions();
    });
  } else{
    getMentions();
  }
};


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
    var currentMention = latestMentions.pop();
    //responseMsg is the string we will send to twitter to tweet for us
    wit.getWitForMessage(currentMention, function(witResponse) {
      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$', witResponse.intent);
      var responseMsg = '@' + witResponse.message.user + ":";
      if(witResponse.intent === 'Greeting'){
        console.log('A greeting was found!');
        responseMsg += '\nHello!';
        // twit.updateStatus(responseMsg, function(){
          console.log('a response tweet: ');
          console.log(responseMsg);
        // });
      }
      else if(witResponse.intent === 'Farewell'){
        console.log('A farewell was found!');
        responseMsg += '\nGoodbye!';
        // twit.updateStatus(responseMsg, function(){
          console.log('a response tweet: ');
          console.log(responseMsg);
        // });
      }
      else if(witResponse.intent === 'Joke'){
        console.log('A joke was requested!');
        unirest.get('http://tambal.azurewebsites.net/joke/random', function(data){
          responseMsg += '\n' + data.body.joke;
          // twit.updateStatus(responseMsg, function(){
            console.log('a response tweet: ');
            console.log(responseMsg);
          // });
        });
      }
      else if(witResponse.intent === 'rude'){
        console.log('Something rude was said!');
        responseMsg += '\nThat was rude! I\'m a PG robot';
        // twit.updateStatus(responseMsg, function(){
          console.log('a response tweet: ');
          console.log(responseMsg);
        // });
      } else if (witResponse.intent === 'Event'){
        console.log('You have an event request!');
        eventsFn.getEventForResponse(function(result){
          var eventName = result.events[0].name.text;
          var eventURL = result.events[0].url;
          responseMsg += '\nHave you thought about ' + eventName + '?\n' + eventURL;
          // twit.updateStatus(responseMsg, function(){
            console.log(eventName, eventURL);
          // });
        });
      } else {
        console.log('Unhandled intent!!!');
        console.log('Unhandled intent!!!');
        console.log('Unhandled intent!!!');
      }
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
        console.log(currentTweet);
        //This if statement determines whether we have already handled this specific tweet
        if(!idStrings[currentTweet.id_str]){
          idStrings[currentTweet.id_str] = true;
          //the object added to latestMentions array
          var tweetObj = {};
          tweetObj.user =  currentTweet.user.screen_name;
          tweetObj.text = currentTweet.text;
          latestMentions.push(tweetObj);
        }
      }      
      //response to new mentions
      replyToMentions();
      ref.update(idStrings);
    } else{
      //This will occur if there is no data, or twitter responds with an error
      console.log(data);
    }
    //These console logs are mostly just for debugging.
    console.log('Current ID Strings:');
    console.log(idStrings);
    console.log('Latest Mentions:');
    console.log(latestMentions);
  });
};


init();
setInterval(function(){
  init();
}, 85000);
