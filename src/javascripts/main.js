/**
 * application javascript
 */

/* globals $ */
'use strict';

$(function() {

  var position;

  // get weather helper.
  var getWeather = function (position, time) {

    // These are default params.
    var paramOptions = {
      lat: position.latitude,
      long: position.longitude
    };

    // Add time param if passed in.
    if (time) {
      paramOptions.time = time;
    }

    var queryParams = $.param(paramOptions);

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

  // Init date picker with selection handler
  $('.date-picker-container').datepick({
    onSelect: function (date) {
      var UnixTime = Math.floor(date[0].getTime() / 1000);
      getWeather(position, UnixTime);
    }
  });

  // Get first set of data.
  window.navigator.geolocation.getCurrentPosition(function (pos) {
    position = pos.coords;
    getWeather(position);
  });

  return;

});
