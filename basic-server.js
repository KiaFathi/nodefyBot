var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('Hello World');
  console.log('Hello World!');
});

var PORT = process.env.port || 3000;

var server = app.listen(PORT, function(){
  console.log('listening on port ' + PORT);
});