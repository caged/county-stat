'use strict';

(function() {

  let container = d3.select('.js-container'),
      table  = container.attr('data-table'),
      column = container.attr('data-column'),
      desc   = container.attr('data-desc')

  // Load map data
  d3.json('/us-10m.json', function load(err, data) {
    cstat.dispatch.geodata(err, data)
    loadMetricsForTableAndColumn(table, column, desc)
  })

  // Sidebar expanding
  d3.select('.js-hamburger').on('click', function() {
    d3.select('.js-sidebar').classed('expanded', function(d) {
      return !d3.select(this).classed('expanded')
    })
  })

  // Reload map data when using back and forward buttons
  d3.select(window).on('popstate', function() {
    let state = d3.event.state,
        table = state.table,
        column = state.column,
        desc   = state.desc

    loadMetricsForTableAndColumn(table, column, desc)
  })

  // Change stats
  d3.selectAll('.js-stat-link').on('click', function() {
    d3.event.preventDefault()

    let el = d3.select(this),
        table = el.attr('data-table'),
        column = el.attr('data-column'),
        desc   = el.attr('title')

    let state = { table: table, column: column, desc: desc }
    history.pushState(state, "page 2", '/' + table + '/' + column)

    d3.selectAll('.js-stat-link').classed('selected', false)
    el.classed('selected', true)
    loadMetricsForTableAndColumn(table, column, desc)
  })

  function loadMetricsForTableAndColumn(table, column, desc) {
    d3.csv('/csv/' + table + '/' + column + '.csv', typeify, function(data) {
      cstat.dispatch.statchange(data, table, column, desc)
    })
  }

  function typeify(row) {
    var keys = Object.keys(row)
    keys.forEach(function(k) {
      var val = row[k]
      if(!isNaN(val)) row[k] = +val
    })

    return row
  }
})()
