d3.select('.js-hamburger').on('click', function() {
  d3.select('.js-sidebar').classed('expanded', function(d) {
    return !d3.select(this).classed('expanded')
  })
})

var el     = d3.select('.js-canvas')
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width  = parseFloat(el.style('width')) - margin.left - margin.right,
    height = parseFloat(el.style('height')) - margin.top - margin.bottom

var projection = d3.geo.albersUsa()
  .scale(width + (width / 4))
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection)

var color = d3.scale.linear()
    .range(['#ccc','#22303E'])
    .interpolate(d3.interpolateHcl)

var alpha = d3.scale.linear()
  .range([0.2, 1])

var vis = d3.select('.js-canvas').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.bottom + margin.top)
.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var properties = d3.select('.js-properties').append('div')

d3.json('/us-10m.json', function(us) {
  var land = topojson.feature(us, us.objects.land),
      states = topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }),
      counties = topojson.feature(us, us.objects.counties).features

  var table = el.attr('data-table') || 'x00_counts',
      column = el.attr('data-column') || 'b00002e1'

  function format(row) { row.per_100k = +row.per_100k; return row }
  d3.csv('/csv/' + table + '/' + column + '.csv', format, function(data) {

    counties.forEach(function(c) {
      var fips = c.id,
          county = data.filter(function(d) { return d.id == c.id })

      if(county.length == 1) {
        c.properties = county[0]
        c.properties.name  = county[0].name
      }
    })

    color.domain(d3.extent(data, function(d) { return d.per_100k }))
    alpha.domain(d3.extent(data, function(d) { return d.population }))

    scatter(data, color, alpha)

    vis.append('path')
      .datum(land)
      .attr('class', 'land')
      .attr('d', path)

    vis.append('g')
      .attr('class', 'counties')
    .selectAll('path')
      .data(counties)
    .enter().append('path')
      .style("fill", function fillthis(d) { return color(d.properties.per_100k) })
      .style('fill-opacity', function alphathis(d) { return alpha(d.properties.population) })
      .attr('d', path)
      .on('mouseover', function(d) {
        var str = '<table>',
            keys = Object.keys(d.properties)
        keys.forEach(function(k) {
          str += '<tr><td>' + k + '</td><td>' + d.properties[k] + '</td></tr>'
        })

        str += '</table>'
        properties.html(str)
      })

    vis.append('path')
      .datum(states)
      .attr('class', 'states')
      .attr('d', path)
  })
})

function scatter(data, color, alpha) {

}
