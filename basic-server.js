var express = require('express');
var app = express();
var PORT = process.env.PORT || 8300;


app.get('/*', function(req, res){
  res.send('Hello World');
});

var server = app.listen(PORT, function(){
  console.log('listening on PORT ' + PORT);
});