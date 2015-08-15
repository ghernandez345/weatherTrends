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
  timeout: 1000
};
var forecast = new Forecast(forecastOptions);

// app middleware
app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/weather', function (req, res) {

  forecast.get(req.query.lat, req.query.long, function (err, response, data) {
    if (err) {
      console.log('FORCAST ERROR:', err);
      res.status(500).send(err);
     }
    res.send(data);
  });
});


app.listen(PORT, function () {
  console.log('Listening on port', PORT);
});
