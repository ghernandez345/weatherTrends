'use strict';

/* globals d3 */

var Visualization = function (element) {
  this.element = element;
  this.margin = [20, 20, 30, 20];
  this.width = 960 - this.margin[1] - this.margin[3];
  this.height = 500 - this.margin[0] - this.margin[2];
  this.x = undefined;
  this.y = undefined;
  this.DURATION = 1500;
  this.DELAY = 1500;

  this.color = d3.scale.category10();

  this.svg = d3.select(this.element).append('svg')
  .attr('width', this.width + this.margin[1] + this.margin[3])
  .attr('height', this.height + this.margin[0] + this.margin[2])
  .append('g')
  .attr('transform', 'translate(' + this.margin[3] + ',' + this.margin[0] + ')');

  // A line generator, for the dark stroke.
  this.line = d3.svg.line()
    .interpolate('basis')
    .x(function(d) { return d.time; })
    .y(function(d) { return d.temperature; });

    // A area generator, for the dark stroke.
  this.area = d3.svg.area()
    .interpolate('basis')
    .x(function(d) { return d.time; })
    .y1(function(d) { return d.temperature; });
};

Visualization.prototype.renderData = function (data, type) {
  var parse;

  switch (type) {
    case 'hourly':
      parse = d3.time.format('%I:%M').parse;
      data = data.hourly.data;
      break;
    case 'daily':
      parse = d3.time.format('%I:%M').parse;
      data = data.daily.data;
      break;
    default:
      data = data.hourly.data;
  }

  // Parse dates and numbers. We assume values are sorted by date.
  // Also compute the maximum price per symbol, needed for the y-domain.
  data.forEach(function(d) {
    d.hourlyTime = parse(d.time);
    d.maxTemp = d3.max(d.values, function(d) { return d.temperature; });
  });

  // Sort by maximum price, descending.
  data.sort(function(a, b) { return b.maxPrice - a.maxPrice; });

  var g = svg.selectAll('g')
      .data(symbols)
    .enter().append('g')
      .attr('class', 'symbol');

  this.drawLines(data);
};

Visualization.prototype.drawLines = function (data) {
  var self = this;

  this.x = d3.time.scale().range([0, this.width - 60]);
  this.y = d3.scale.linear().range([this.height / 4 - 20, 0]);

  // Compute the minimum and maximum date across symbols.
  this.x.domain([
    d3.min(data, function(d) { return d.time; }),
    // d3.max(data, function(d) { return d.values[d.values.length - 1].date; })
    d3.max(data, function(d) { return d.time; })
  ]);

  var g = this.svg.selectAll('.symbol')
      .attr('transform', function(d, i) { return 'translate(0,' + (i * self.height / 4 + 10) + ')'; });

  g.each(function(d) {
    var e = d3.select(this);

    e.append('path')
        .attr('class', 'line');

    e.append('circle')
        .attr('r', 5)
        .style('fill', function(d) { return self.color(d.key); })
        .style('stroke', '#000')
        .style('stroke-width', '2px');

    e.append('text')
        .attr('x', 12)
        .attr('dy', '.31em')
        .text(d.key);
  });

  function draw(k) {
    g.each(function(d) {
      var e = d3.select(this);
      y.domain([0, d.maxPrice]);

      e.select('path')
          .attr('d', function(d) { return line(d.values.slice(0, k + 1)); });

      e.selectAll('circle, text')
          .data(function(d) { return [d.values[k], d.values[k]]; })
          .attr('transform', function(d) { return 'translate(' + x(d.date) + ',' + y(d.price) + ')'; });
    });
  }

  var k = 1, n = symbols[0].values.length;
  d3.timer(function() {
    draw(k);
    if ((k += 2) >= n - 1) {
      draw(n - 1);
      setTimeout(horizons, 500);
      return true;
    }
  });
};

Visualization.prototype.renderHourly = function (data) {

};

Visualization.prototype.renderDaily = function (data) {

};
