'use strict';

cstat.dispatch.on('geodata', function(err, us) {
  cstat.dispatch.on('statchange.rerender', rerender)

  let el     = d3.select('.js-canvas'),
      margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width  = parseFloat(el.style('width')) - margin.left - margin.right,
      height = parseFloat(el.style('height')) - margin.top - margin.bottom

  let projection = d3.geo.albersUsa()
    .scale(width + (width / 4))
    .translate([width / 2, height / 2]);

  let path = d3.geo.path()
    .projection(projection)

  let color = d3.scale.linear()
      // .range(['#AD5C6A', '#EFEE69']) // Orange-Red
      // .range(['#765B7B', '#64CCE8']) // Ice Blue-Purple
      .range(['#24573E', '#A6C45E']) // Green
      // .range(['#fff', '#A6C45E'])
      .interpolate(d3.interpolateHcl)

  let alpha = d3.scale.linear()
    .range([0.8, 1])

  let vis = el.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.bottom + margin.top)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  let land = topojson.feature(us, us.objects.land),
      states = topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }),
      counties = topojson.feature(us, us.objects.counties).features,
      countymesh = topojson.mesh(us, us.objects.counties, function(a, b) { return a.id !== b.id; })

  vis.append('path')
    .datum(land)
    .attr('class', 'land')
    .attr('d', path)

  let countypaths = vis.append('g')
    .attr('class', 'counties')
  .selectAll('path')
    .data(counties)
  .enter().append('path')
    .attr('d', path)

  vis.append('path')
    .datum(countymesh)
    .attr('class', 'county-mesh')
    .attr('d', path)

  vis.append('path')
    .datum(states)
    .attr('class', 'states')
    .attr('d', path)


  function rerender(data, metric) {
    let table = metric.table,
        column = metric.column
        
    color.domain(d3.extent(data, function(d) { return +d.per_100k   }))
    alpha.domain(d3.extent(data, function(d) { return +d.population }))

    var cdata = d3.nest()
      .key(function(d) { return +d.id })
      .rollup(function(d) { return d[0] })
      .map(data)

    countypaths
      .filter(function(d) { return d })
      .datum(function(d) { return cdata[+d.id] })
      .style('fill', function(d) { return d && color(+d.per_100k) })
      // .style('fill-opacity', function(d) { return d && alpha(+d.population) })
      .on('mouseover', function(d) { cstat.dispatch.geohover(this, d, data) })
  }
})
