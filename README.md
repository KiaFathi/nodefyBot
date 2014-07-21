<img src='http://img2.wikia.nocookie.net/__cb20110722223747/megaman/images/c/ce/Birdbot.jpg'>
nodefyBot
=========

A node server that responds to tweets! To see how it works, tweet @nodefyBot and see it respond (within 1 minute)! Currently it can respond to
greetings, farewells, and joke requests.

##Tutorial
The following is a tutorial for one of my github repositories, <a href='https://github.com/KiaFathi/nodefyBot'>nodefyBot</a>.

This repository is constantly updating, and this blog post will continue to be up to date with those changes.

If you would like to contribute or make suggestions, feel free to leave them in the comments here or as issue notices/pull requests on the github repository, <a href='https://github.com/KiaFathi/nodefyBot'>nodefyBot</a>. 

I'd like to this make an open-source exploration, so any feedback is greatly appreciated!

###What You Need.
* Node
* Express
* Twitter API Keys
* Wit API Key

###Step 1: Basic Setup

Make a directory called nodefyBot.

```
mkdir nodefyBot
cd nodefyBot
```

If you don't already have node installed, install it from <a href='http://nodejs.org/'>their website</a> or brew install node.

NPM is a package manager that comes with Node, and is super useful for getting all your server side dependencies.

We need express for this tutorial, so in your terminal enter the following command:

```js
npm init
npm install --save express
```

I also recommend you use nodemon, which will run your node server and automatically update it when  it changes. This makes debugging a lot faster and easier.

```js
npm install -g nodemon
```

We install nodemon globally so we can use it from any directory later.

These commands will initialize our directory with a package.json and install all the necessary  express files. Express makes writing servers with node very easy and takes out a lot of the minutia of writing bare node. We will use express for this tutorial.

###Step 2: Establish a basic node server

In your nodefyBot root directory make a file called 'basic-server.js'.

```js
//basic-server.js

//We require express to use all of its useful features, and to make writing node a lot easier
var express = require('express');

//This sets up our app as a basic express server.
var app = express();

//Let's set up a port for our server to listen on
var port = 8300;

//Just one basic server response, to make sure our server is working.
app.get('/*', function(req, res){
  res.send('Hello World');
});

//Let's start up our server listening on our port:
var server = app.listen(port, function(){
  console.log('Basic-server is listening on port ' + port);
});
```
From the root of your nodefyBot directory run 'nodemon basic-server.js' in your terminal. You should see a console log of 'listening on PORT 8300' in your terminal.

Additionally, with your nodemon still running in your terminal, go to 'localhost:8300' in your browser and you should see the response message from your server.

Congratulations, you have spun up a basic express server!

###Step 3: Set up your twitter app.

Go to the <a href='https://apps.twitter.com/'>Twitter App Center</a> and create a new app.

* Give your app a name, this is what @mentions will go to.
* Give your app a basic description, whatever you want.
* Give your app a website, I just put down <a href='https://kiafathi.azurewebsites.net'>my personal blog.</a>
* Don't worry about callback for now, not necessary.
* Sign the agreement.

Once you have created your twitter app, go to the permissions tab and enable read/write permisions.


After enabling the correct permissions, go the the API keys tab and keep track of your API keys. You will need them soon.

####SPECIAL NOTE: Do not share your api keys online or git commit them. You don't want someone taking control of your application.

Let's set up our twitter

In your terminal:
```js
npm install --save twitter
```

Once npm is done installing, go to your basic-server.js

```js
//Require your the twitter dependencies
var twitter = require('twitter');

//Now lets set up a twitter account from dev.twitter.com
//Find these in your applications API Keys tab
var twit = new twitter({
  consumer_key: 'Your API Key',
  consumer_secret: 'Your API Secret',
  access_token_key: 'Your Access Token',
  access_token_secret: 'Your Access Token Secret'
});
```

For the next step to work, your application will need to have some mentions directed at it. Go onto a twitter account and tweet some things @'Your applications name', in my case @nodefyBot. With these mentions, we can continue to the next step.

####For more information about the requests node-twitter can make see <a href='https://www.npmjs.org/package/twitter'>the node twitter docs</a>

```js
//basic-server.js

//Lets see if we can get our mentions from our newly established twitter connection
//This get method is a property of the node twitter package
//We are establishing the url to get data from, and how many mentions (at most 10) we want
//Right now whatever you get back will be console logged.
twit.get('/statuses/mentions_timeline.json', { count: 10}, function(data){
 console.log(data);
});
```
#####Special Note: The Twitter API will only let you request data 15 times per 15 minutes, so be careful about trying to request data too often. In the next step of our app, we will limit our get requets to once every minute.

Run nodemon basic-server.js to see what our data looks like!

Our mentions come back as an array, with each individual mention as an object in that array. These  objects have a ton of information, for now let's just worry about the basics. We want to get the username of whoever sent the mention, the text of that mention, and the id string of the mention. The id string is an identifier twitter uses to monitor each tweet, we will use this to make sure our server doesn't respond multiple times to each tweet.

We will store each tweet's username and message as a single object, in an array called latestMentions. Each id string will be stored as a key in an object called idStrings, so so we can quickly look up as to whether those id strings have been handled or not.

```js
//basic-server.js
var latestMentions = [];
var idStrings = {};
```

Let's change the way our get request handles our data.

```js
//basic-server.js
twit.get('/statuses/mentions_timeline.json', {count: 10}, function(data){
  for(var i = 0; i < data.length; i++){
    var currentTweet = data[i];
    //This if statement determines whether we have already handled this specific tweet
    if(!idStrings[currentTweet.id_str]){
     idStrings[currentTweet.id_str] = true;
      var tweetObj = {};
      tweetObj.user =  currentTweet.user.screen_name;
      tweetObj.text = currentTweet.text;
      latestMentions.push(tweetObj);
    }
  }
  console.log(idStrings);
  console.log(latestMentions);
});
```

Additionally, I refactored my twitter get request into a function to better control when and where the request is called. 

To wrap this step up, this is what our basic server.js file looks like at this point:

```js

//server related dependencies
var keys = require('./keys.js');
var express = require('express');
var app = express();
var port = process.env.port || 8300;



//twitter dependencies
var twitter = require('twitter');
var twit = new twitter({
  consumer_key: 'Your API Key',
  consumer_secret: 'Your API Secret',
  access_token_key: 'Your Access Token',
  access_token_secret: 'Your Access Token Secret'
});

//twitter data
var latestMentions = [];
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
          //the object added to latestMentions array
          var tweetObj = {};
          tweetObj.user =  currentTweet.user.screen_name;
          tweetObj.text = currentTweet.text;
          latestMentions.push(tweetObj);
        }
      }      
    } else{
      console.log(data);
    }
    console.log(idStrings);
    console.log(latestMentions);
  });
};

getMentions();

```

###Step 4: Responding to mentions!

Now that we are storing our latest Mentions as an array we can iterate through that array and respond to each mention independently. The twitter module we are using has an update status method that we will use to do this. Let's write a function to take advantage of it:

```js
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
```

Where specifically do we invoke this function? Inside our getMentions function like so:
```js
var getMentions = function(){
  twit.get('/statuses/mentions_timeline.json', {count: 10}, function(data){
    if(data.length){
      for(var i = 0; i < data.length; i++){
        var currentTweet = data[i];
        if(!idStrings[currentTweet.id_str]){
         idStrings[currentTweet.id_str] = true;
          var tweetObj = {};
          tweetObj.user = currentTweet.user.screen_name;
          tweetObj.text = currentTweet.text;
          latestMentions.push(tweetObj);
        }
      }
      //response to new mentions
      replyToMentions();
    } 
    else{
      console.log(data);
    }
  });
};
```

If this works as intended, once you have gotten all your tweets, this function will then go through each of those mentions and respond to them by username with: 
```
Hello @'username' 
I hope you are having a wonderful day!
-Your Favorite Node Server
```

This is awesome, we now have a server that responds to tweets! But, it always responds with the same message, that's boring. In the next step, I'll walk you through how to use the Wit API to have our robot interpret messages and respond appropriately.

_Special note: the current app will respond every time you start it up, consider using a file-system or database as a permanent way to keep track of your id_strings._

###Step 5: A smarter response message.

Basic Implementation: DONE,
Write-Up: COMING SOON!