'use strict';

cstat.dispatch.on('geodata', function(err, us) {
  let el     = d3.select('.js-canvas'),
      margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width  = parseFloat(el.style('width')) - margin.left - margin.right,
      height = parseFloat(el.style('height')) - margin.top - margin.bottom

  let projection = d3.geo.albersUsa()
    .scale(width + (width / 4))
    .translate([width / 2, height / 2]);

  let path = d3.geo.path()
    .projection(projection)

  let vis = d3.select('.js-canvas').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.bottom + margin.top)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  let land = topojson.feature(us, us.objects.land),
      states = topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }),
      counties = topojson.feature(us, us.objects.counties).features

  vis.append('path')
    .datum(land)
    .attr('class', 'land')
    .attr('d', path)

  vis.append('g')
    .attr('class', 'counties')
  .selectAll('path')
    .data(counties)
  .enter().append('path')
    .attr('d', path)
})
