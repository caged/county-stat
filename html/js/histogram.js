'use strict';

cstat.dispatch.on('statchange.histogram', function(data, metric) {
  let el     = d3.select('.js-histogram').html(''),
      margin = { top: 40, right: 20, bottom: 20, left: 20 },
      width  = parseFloat(el.style('width')) - margin.left - margin.right,
      height = parseFloat(el.style('height')) - margin.top - margin.bottom,
      values = data.map(function(d) { return d.per_100k })

  let vis = el.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.bottom + margin.top)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  let x = d3.scale.linear()
    .domain(d3.extent(values))
    .range([0, width])

  let bindata = d3.layout.histogram()
    .bins(x.ticks(10))(values)

  let y = d3.scale.linear()
    .domain([0, d3.max(bindata, function(d) { return d.y })])
    .range([height, 0])

  let xax = d3.svg.axis()
    .scale(x)
    .tickFormat(d3.format((',s')))

  vis.append('text')
    .attr('class', 'title')
    .attr('x', width / 2)
    .attr('y', -20)
    .text('Per 100k County Distribution')

  let bar = vis.selectAll('.bar')
    .data(bindata)
  .enter().append('g')
    .attr('class', 'bar')
    .attr('transform', function(d) { return 'translate(' + x(d.x) + ',' + y(d.y) + ')' })

  bar.append('rect')
    .attr('x', 1)
    .attr('width', x(bindata[0].dx) - 1)
    .attr('height', function(d) { return height - y(d.y) })

  bar.append('text')
    .attr('class', 'count')
    .attr('y', '-5px')
    .attr('x', x(bindata[0].dx) / 2)
    .text(function(d) { return d3.format(',.0f')(d.y) })

  vis.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xax)

})
