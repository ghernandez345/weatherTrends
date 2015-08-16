/**
 * application server file
 */

'use strict';

var express = require('express');
var Forecast = require('forecast.io');

var app = express();
var PORT = process.env.PORT || 1337;
var FORECAST_API_KEY = 'ec236c2c628170bf97df49647523fa55';
var forecastOptions = {
  APIKey: FORECAST_API_KEY,
  timeout: 5000
};
var forecast = new Forecast(forecastOptions);

// app middleware
app.use(express.static(__dirname));

// app routes

// root route.
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// get weather.
app.get('/weather', function (req, res) {

  // Forecast.io request handler.
  function handleRequest(err, response, data) {
    if (err) {
      console.log('FORCAST ERROR:', err);
      res.status(500).send(err);
     }
    res.send(data);
  }

  // Change request if we are given a time param.
  if (req.query.time) {
    console.log('getting at time!');
    forecast.getAtTime(req.query.lat, req.query.long, req.query.time, handleRequest);
  } else {
    console.log('getting!');
    forecast.get(req.query.lat, req.query.long, handleRequest);
  }
});

// start listening on PORT.
app.listen(PORT, function () {
  console.log('Listening on port', PORT);
});
