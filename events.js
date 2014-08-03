var request = require('request');
var keys = require('./API_KEYS_GIT_IGNORE_THIS.js');
var bodyParser = require('body-parser');
var Q = require('q');


var events = {
  getEventForResponse: function(callback) {
    var url = 'https://www.eventbriteapi.com/v3/events/search/?popular=on&sort_by=date&venue.city=San+Francisco&venue.region=CA&token=' + keys.eventbrite.token;

    return request(url, function(response, body) {
        var result = JSON.parse(body.body);
        // console.log(JSON.parse(result));
        callback(result);
      });
  }
};

module.exports = events;