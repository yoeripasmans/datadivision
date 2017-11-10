(function() {
  'use strict';

  var width = 500;
  var height = 500;

  var svg = d3.select(".piechart").append("svg")
    .attr("width", 100 + "%")
    .attr("height", height),

    radius = Math.min(width, height) / 2,
    g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var color = d3.scaleOrdinal(["#C50D2F", "#5C9CCC", "#00a76f", "#0A5191", "#DEDEDE", "#FECF06", "#284878"]);

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden");

  var pie = d3.pie()
    .sort(null)
    .value(function(d) {
      return d.topscorers;
    });

  var path = d3.arc()
    .outerRadius(radius - 80)
    .innerRadius(0);

  var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

  d3.csv("data/topscorers-percent.csv", function(d) {
    d.topscorers = +d.topscorers;
    return d;
  }, function(error, data) {
    if (error) throw error;

    var arc = g.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

    arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) {
        return color(d.data.club);
      })

      .on("mouseover", function(d) {
        //Tool-tip
        tooltip.transition()
          .duration(100)
          .style("visibility", "visible");
        tooltip.html("Club: " + d.data.club + "<br/>" + "Percent: " + d.value + "%");
      })

      .on("mousemove", function() {
        return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.transition()
          .duration(100)
          .style("visibility", "hidden");

      });

    arc.append("text")
      .attr("transform", function(d) {
        return "translate(" + label.centroid(d) + ")";
      })
      .attr("dy", "-0.35em")
      .text(function(d) {
        return d.data.club;
      });
  });

})();
// Based on https://bl.ocks.org/mbostock/3887235
