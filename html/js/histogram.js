cstat.dispatch.on('statchange.histogram', function(data, table, column, desc) {
  d3.select('.js-description').text(desc)
})
