'use strict';

(function() {

  let container = d3.select('.js-container'),
      metric = metricFromElement(container)

  // Load map data
  d3.json('/us-10m.json', function load(err, data) {
    cstat.dispatch.geodata(err, data)
    loadMetric(metric)
  })

  // Sidebar expanding
  d3.select('.js-hamburger').on('click', function() {
    d3.select('.js-sidebar').classed('expanded', function(d) {
      return !d3.select(this).classed('expanded')
    })
  })

  d3.select('body').on('keyup', function() {
    // Toggle sidebar
    if(d3.event.keyCode == 83)
      d3.select('.js-sidebar').classed('expanded', function(d) {
        return !d3.select(this).classed('expanded')
      })

    if(d3.event.keyCode == 40) {
      let li = d3.select(d3.select('.selected').node().parentNode),
          next = li.node().nextElementSibling


    }
  })

  // Reload map data when using back and forward buttons
  d3.select(window).on('popstate', function() {
    let state = d3.event.state
    loadMetric(state)
  })

  // Change stats
  d3.selectAll('.js-stat-link').on('click', function() {
    d3.event.preventDefault()

    let el = d3.select(this),
        metric = metricFromElement(el)

    history.pushState(metric, "page 2", '/' + metric.table + '/' + metric.column)

    d3.selectAll('.js-stat-link').classed('selected', false)
    el.classed('selected', true)
    loadMetric(metric)
  })

  function loadMetric(metric) {
    d3.csv('/csv/' + metric.table + '/' + metric.column + '.csv', typeify, function(data) {
      cstat.dispatch.statchange(data, metric)
    })
  }

  function metricFromElement(el) {
    return {
      table: el.attr('data-table'),
      column: el.attr('data-column'),
      desc: el.attr('data-desc') || el.attr('title')
    }
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
