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

  // Navigate to demographic subject
  d3.select('.js-demographics').on('change', function() {
    let input = d3.event.target,
        val = input.options[input.selectedIndex].value

    d3.select('#' + val).node().scrollIntoView()
  })

  // Map property changes
  d3.select('.js-map-properties input, .js-map-properties select').on('change', function() {
    let input = d3.event.target,
        form = d3.event.target,
        obj = {}

    while(form.tagName != 'FORM') {
      form = form.parentNode
    }

    if(input.tagName == 'SELECT') {
      obj[input.name] = input.options[input.selectedIndex].value
    }

    cstat.dispatch.propchange(obj)
  })

  // Keyboard shortcuts
  // s - toggle sidebar
  // up/down arrow - navigate sidebar
  d3.select('body').on('keyup', function() {
    let key = d3.event.keyCode
    // Toggle sidebar
    if(key == 83)
      d3.select('.js-sidebar').classed('expanded', function(d) {
        return !d3.select(this).classed('expanded')
      })

    if(key == 40 || key == 38) {
      let li     = d3.select(d3.select('.selected').node().parentNode),
          method = key == 40 ? 'nextElementSibling' : 'previousElementSibling',
          nextel = d3.select(li.node()[method]).select('a'),
          metric = metricFromElement(nextel)

      history.pushState(metric, null, '/' + metric.table + '/' + metric.column)
      loadMetric(metric)

      d3.selectAll('.js-stat-link').classed('selected', false)
      nextel.classed('selected', true)
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

    history.pushState(metric, null, '/' + metric.table + '/' + metric.column)

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
