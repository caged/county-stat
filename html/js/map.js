'use strict';

let props = { cluster: 'headtail' }

cstat.dispatch.on('geodata', function(err, us) {
  cstat.dispatch.on('statchange.rerender', rerender)

  let el     = d3.select('.js-canvas'),
      margin = { top: 0, right: 0, bottom: 0, left: 0 },
      width  = parseFloat(el.style('width')) - margin.left - margin.right,
      height = parseFloat(el.style('height')) - margin.top - margin.bottom,
      legendWidth = Math.max(width / 2, 700)

  let projection = d3.geo.albersUsa()
    .scale(width + (width / 4))
    .translate([width / 2, height / 2]);

  let path = d3.geo.path()
    .projection(projection)

  let color = d3.scale.threshold()

  let x = d3.scale.linear()
    .range([0, legendWidth])

  let x2 = d3.scale.ordinal()
    .rangeRoundBands([0, legendWidth])

  let xax = d3.svg.axis()
    .tickPadding(10)
    .tickFormat(d3.format('.3s'))
    .scale(x2)

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

  let legend = vis.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + ((width - x.range()[1]) / 2) + ',' + 40 + ')')

  legend.append('text')
    .attr('class', 'legend-title')
    .attr('y', -10)
    .attr('x', legendWidth / 2)
    .text('Per 100k people')

  function rerender(data, metric) {
    let table = metric.table,
        column = metric.column,
        values = data.map(function(d) { return d.per_100k })

    let cdata = d3.nest()
      .key(function(d) { return +d.id })
      .rollup(function(d) { return d[0] })
      .map(data)

    cstat.dispatch.on('propchange.draw', function(p) {
      props = p
      draw()
    })

    function draw() {
      let cluster = props.cluster,
          domain = cstat.cluster[cluster](values, 10)

      // Increase the last value by one so it fits in the threshold
      // domain
      domain[domain.length - 1] += 1

      x.domain([0, d3.max(domain)])
      x2.domain(domain)
      xax.tickValues(domain)

      color
        .domain(domain)
        .range(colors(domain.length))

      countypaths
        .filter(function(d) { return d })
        .datum(function(d) { return cdata[+d.id] })
        .style('fill', function(d) { return d && color(d.per_100k) })
        .on('mouseover', function(d) { cstat.dispatch.geohover(this, d, data) })

      legend.selectAll('rect')
        .data(legendData(color, x2))
      .enter().append('rect')
        .attr('x', function(d) { return d.x })
        .attr('height', 10)
        .attr('width', x2.rangeBand())
        .style('fill', function(d) { return d.color })

      legend.call(xax)
    }

    draw()
  }
})

// Given a set of colors, generate a linear scale of
// HCL colors
function colors(count) {
  var colors = [],
      hcl = d3.scale.linear()
        .domain([0, count - 1])
        // .range(['#24573E', '#A6C45E'])
        .range(['#24573E', '#A6C45E'])
        .interpolate(d3.interpolateHcl)

  for (var i = 0; i < count; i++)
    colors.push(hcl(i))

  return colors
}

function legendData(color, x) {
  let domain = color.domain()

  return color.range().map(function(d, i) {
    return { x: x(domain[i]), color: d }
  })
}
