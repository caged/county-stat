cstat.dispatch.on('statchange.description', function(data, metric) {
  d3.select('.js-description').text(metric.desc)
})

// Render top list of geographics for the selected metric
cstat.dispatch.on('statchange.top-list', function(data, metric) {
  var el = d3.select('.js-top-list')

  var topdata = data
    .filter(function(d) { return d.population >= 5000 })
    .sort(function(a, b) { return d3.descending(a.per_100k, b.per_100k)})
    .slice(0, 10)

  el.select('.top-list').remove()

  var table = el.append('table')
    .attr('class', 'top-list property-list')

  var header = table.append('tr')
  header.selectAll('th')
    .data(['rank', 'name', 'per_100k', 'value', 'population', 'state'])
  .enter().append('th')
    .text(String)

  var rows = table.selectAll('.top-item')
    .data(topdata)
  .enter().append('tr')
    .attr('class', 'top-item')

  rows.selectAll('td')
    .data(function(d, i) { return [ i + 1, d.name, d.per_100k, d.value, d.population, d.statefp ] })
  .enter().append('td')
    .text(String)
})

// Render properties of selected geography
cstat.dispatch.on('geohover', function(geom, datum, data) {
  var el = d3.select('.js-inspector'),
      properties = d3.entries(datum)

  el.select('.properties').remove()

  el.append('table')
    .attr('class', 'properties property-list')
  .selectAll('tr')
    .data(properties)
  .enter().append('tr')
    .html(function(d) {
      return '<th>' + d.key + '</th><td>' + d.value + '</td>'
    })
})

function inspect(parent, data) {

}
