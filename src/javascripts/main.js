/**
 * application javascript
 */

/* globals $ */
'use strict';

$(function() {
  var element = document.querySelector('#application');

  // init date picker
  $('.date-picker-container').datepick();
  return;

  // get weather.
  var getWeather = function (position) {

    var queryParams = $.param({
      lat: position.coords.latitude,
      long: position.coords.longitude,
    });

    $.ajax({
      url: 'weather?' + queryParams,
      type: 'GET',
      success: function (res) {
        console.log('RESPONSE:', res);
      },
      error: function (jqXHR, status, err) {
        console.error('ERROR:', err);
      }
    });
  };

  // window.navigator.geolocation.getCurrentPosition(getWeather);
  window.navigator.geolocation.getCurrentPosition(getWeather);

});
