'use strict';

(function() {

  var el = d3.select('.js-container'),
      table = el.attr('data-table'),
      column = el.attr('data-column')

  // Load map data
  d3.json('/us-10m.json', function load(err, data) {
    cstat.dispatch.geodata(err, data)
    loadMetricsForTableAndColumn(table, column)
  })

  // Sidebar expanding
  d3.select('.js-hamburger').on('click', function() {
    d3.select('.js-sidebar').classed('expanded', function(d) {
      return !d3.select(this).classed('expanded')
    })
  })

  // Change stats
  d3.selectAll('.js-stat-link').on('click', function() {
    d3.event.preventDefault()

    let el = d3.select(this),
        table = el.attr('data-table'),
        column = el.attr('data-column')

    loadMetricsForTableAndColumn(table, column)
  })

  function loadMetricsForTableAndColumn(table, column) {
    d3.csv('/csv/' + table + '/' + column + '.csv', function(data) {
      cstat.dispatch.statchange(data)
    })
  }
})()
