'use strict';
var request = require('request');
var bodyParser = require('body-parser');
var Q = require('q');

var keys; 

if(!process.env.PORT){
  keys = require('./API_KEYS_GIT_IGNORE_THIS.js');
}

var eventbriteToken = process.env.eventbriteToken || keys.eventbrite.token;

var events = {
  getEventForResponse: function(location, callback) {
    if (!location){
      var url = 'https://www.eventbriteapi.com/v3/events/search/?popular=on&sort_by=date&venue.city=San+Francisco&venue.region=CA&token=' + eventbriteToken;
    } else {
      console.log('LOCATION:', location)
      var cityState = location.split(', ');
      var city = cityState[0];
      var state = cityState[1];
      if (city.indexOf(' ') !== -1){
        city = city.split(' ').join('+');
      }
      console.log('CITY:', city);
      console.log('STATE:', state);
      var url = 'https://www.eventbriteapi.com/v3/events/search/?popular=on&sort_by=date&venue.city=' + city + '&venue.region=' + state + '&token=' + eventbriteToken;
    }

    return request(url, function(response, body) {
        var result = JSON.parse(body.body);
        // console.log(JSON.parse(result));
        callback(result);
      });
  }
};

module.exports = events;