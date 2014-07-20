var express = require('express');
var app = express();
var port = process.env.port || 8300;


app.get('/*', function(req, res){
  res.send('Hello World');
});

var server = app.listen(port, function(){
  console.log('Basic server is listening on port ' + port);
});