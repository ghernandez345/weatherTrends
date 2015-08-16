/**
 * application javascript
 */

/* globals $ */
/* globals Visualization */
'use strict';

$(function() {

  var position;
  var visualization = new Visualization(document.querySelector('.visualization-container'));

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
        visualization.renderData(res, 'hourly');
      },
      error: function (jqXHR, status, err) {
        console.error('ERROR:', err);
      }
    });
  };

  // Init date picker with selection handler
  $('.date-picker-container').datepick({
    defaultDate: new Date(),
    selectDefaultDate: true,
    onSelect: function (date) {
      var UnixTime = $.datepick.formatDate('@', date[0]);
      getWeather(position, UnixTime);
    }
  });

  // Get first set of data.
  window.navigator.geolocation.getCurrentPosition(function (pos) {

    position = pos.coords;
    getWeather(position);
  });

});
