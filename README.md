nodefyBot
=========

A node server that responds to tweets!


###Guide

##What You Need.
* Node
* Express
* Twitter API Keys
* Wit API Key

##Tutorial
###Step 1

* Basic Setup

Make a directory called nodefyBot.

```
mkdir nodefyBot
cd nodefyBot
```

If you don't already have node installed, install it from their website or brew install node.

NPM is a package manager that comes with Node, and is super useful for getting all your server 
side dependencies.

We need express for this tutorial, so in your terminal enter the following command.

```js
npm init
npm install --save express
```

I also recommend you use nodemon, which will run your node server and automatically update it when 
it changes. This makes debugging a lot faster and easier.

```js
npm install -g nodemon
```

We install nodemon globally so we can use it from any directory later.

These commands will initialize our directory with a package.json and install all the necessary 
express files. Express makes writing servers with node very easy and takes out a lot of the minutia 
of writing bare node. We will use express for this tutorial.

###Step 2
1. Establish a basic node server

In your nodefyBot root directory make a file called 'basic-server.js'.

```js
//basic-server.js

//We require express to use all of its useful features, and to make writing node a lot easier
var express = require('express');

//This sets up our app as a basic express server.
var app = express();

//Let's set up a port for our server to listen on
var port = 8300
