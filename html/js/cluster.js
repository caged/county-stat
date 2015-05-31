'use strict';

(function() {
  let cluster = cstat.cluster = {}

  cluster.quantiles = function(data, bins) {
    return d3.scale.quantile()
      .range(d3.range(bins + 1))
      .domain(d3.extent(data))
      .quantiles()
  }

  cluster.jenks = function(data, bins) {
    data = data.sort(function(a, b) { return a - b })
    return ss.jenks(data, (bins - 1) || 9)
  }

  cluster.headtail = function(data) {
    data = data.sort(function(a, b) { return a - b })
    let min = d3.min(data),
        mean = d3.mean(data),
        bins = [min]

    while(data.length > 0) {
      data = data.filter(function(d) { return d > mean })
      if(data.length > 0) {
        mean = d3.mean(data)
        bins.push(mean)
      }
    }

    return bins
  }
})()
