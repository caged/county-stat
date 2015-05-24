d3.select('.js-hamburger').on('click', function() {
  d3.select('.js-sidebar').classed('expanded', function(d) {
    return !d3.select(this).classed('expanded')
  })
})

var el     = d3.select('.js-canvas')
    margin = { top: 20, right: 0, bottom: 0, left: 0 },
    width  = parseFloat(el.style('width')) - margin.left - margin.right,
    height = parseFloat(el.style('height')) - margin.top - margin.bottom

var projection = d3.geo.albersUsa()
  .scale(width)
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection)

var color = d3.scale.linear()
    .range(["#2B3034", "#F5EA96"])
    .interpolate(d3.interpolateHcl)

var vis = d3.select('.js-canvas').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.bottom + margin.top)
.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.json('/us-10m.json', function(us) {
  var land = topojson.feature(us, us.objects.land),
      states = topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }),
      mesh = topojson.mesh(us, us.objects.counties, function(a, b) { return a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0); }),
      counties = topojson.feature(us, us.objects.counties).features

  var table = el.attr('data-table') || 'x00_counts',
      column = el.attr('data-column') || 'b00002e1'

  function format(row) { row.value = +row.value; return row }
  d3.csv('/csv/' + table + '/' + column + '.csv', format, function(data) {

    counties.forEach(function(c) {
      var fips = c.id,
          county = data.filter(function(d) { return d.id == c.id })

      if(county.length == 1) {
        c.properties.value = county[0].value
        c.properties.name  = county[0].name
      }
    })

    color.domain(d3.extent(data, function(d) { return d.value }))

    vis.append('path')
      .datum(land)
      .attr('class', 'land')
      .attr('d', path)

    vis.append('g')
      .attr('class', 'counties')
    .selectAll('path')
      .data(counties)
    .enter().append('path')
      .style("fill", function(d) { return color(d.properties.value) })
      .attr('d', path)
      .on('click', function(d) { console.log(d.properties); })


    vis.append('path')
      .datum(mesh)
      .attr('class', 'county-mesh')
      .attr('d', path)

    vis.append('path')
      .datum(states)
      .attr('class', 'states')
      .attr('d', path)
  })
})
