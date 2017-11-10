(function() {
  'use strict';

  //Sets the diameter of the svg
  var diameter = 460;

  //Selects svg from document and sets the diameter
  var svg = d3.select('.bubblechart').append('svg')
    .attr("width", diameter)
    .attr("height", diameter);

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden");

  //Sets the format
  var format = d3.format(",d");

  //Sets own color scheme
  var color = d3.scaleOrdinal(["#C50D2F", "#5C9CCC", "#00a76f", "#0A5191", "#333136", "#ADADAF"]);

  // create a new circle-packing layout
  var pack = d3.pack()
    .size([diameter, diameter])
    .padding(3.5);

  //Gets the data out of the CSV file.
  d3.csv("data/totaalkampioen.csv", function(d) {
    d.value = +d.value;
    if (d.value) return d;
  }, function(error, classes) {

    if (error) throw error;
    var root = d3.hierarchy({
        children: classes
      })
      .sum(function(d) {
        return d.value;
      })
      .each(function(d) {
        if (id = d.data.id) {
          var id, i = id.lastIndexOf(".");
          d.id = id;
          d.package = id.slice(0, i);
          d.class = id.slice(i + 1);
        }
      });

    //Selects all nodes
    var node = svg.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .on("mouseover", function(d) {
        //Tool-tip
        tooltip.transition()
          .duration(100)
          .style("visibility", "visible");
        tooltip.html("Club: " + d.id + "<br/>" + "Eredivisie titles: " + d.value);
      })

      .on("mousemove", function() {
        return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.transition()
          .duration(100)
          .style("visibility", "hidden");
      });

    //Append circle to the root node and adds atrributes
    node.append("circle")
      .attr('class', 'bubble')
      .attr("id", function(d) {
        return d.id;
      })
      .style("fill", function(d) {
        return color(d.package);
      })
      .attr("r", 0);


    //Show bubbles on a certain scroll point
    window.onscroll = scrollBubble;

    function scrollBubble() {
      if (window.pageYOffset > 1000) {
        d3.selectAll(".bubble")
          .transition() //Fade
          .ease(d3.easeElasticOut) // Ease animation
          .attr("r", function(d) {
            return d.r;
          })
          .duration(2000); // Duration of 2 seconds
      } else if (window.pageYOffset < 800) {
        d3.selectAll(".bubble")
          .attr("r", 0);
      }

    }

    node.append("clipPath")
      .attr("id", function(d) {
        return "clip-" + d.id;
      })
      .append("use")
      .attr("xlink:href", function(d) {
        return "#" + d.id;
      });

    //Appends the text labels to the root node
    node.append("text")
      .attr("clip-path", function(d) {
        return "url(#clip-" + d.id + ")";
      })
      .selectAll("tspan")
      .data(function(d) {
        return d.class.split(/(?=[A-Z][^A-Z])/g);
      })
      .enter().append("tspan")
      .attr("class", function(d) {
        return "champion-id" + " " + "champion-id-" + d;
      })
      .attr("x", 0)
      .attr("y", function(d, i, nodes) {
        if (d == "Ajax" || d == "PSV" || d == "Feyenoord") {
          return 30 + (i - nodes.length / 2 - 0.5) * 10;
        } else {
          return 15 + (i - nodes.length / 2 - 0.5) * 10;
        }
      })

      .text(function(d) {
        return d;
      });
    //Show club values
    node.append("text")
      .attr("clip-path", function(d) {
        return "url(#clip-" + d.id + ")";
      })

      .append("tspan")
      .attr("class", function(d) {
        return "champion-value" + " " + "champion-value-" + d.id;
      })
      .attr("x", 0)
      .attr("y", function(d, i, nodes) {
        return 0 + (i - nodes.length / 2 - 0.5);
      })
      .text(function(d) {
        return format(d.value);
      });


  });

  //Based on https://bl.ocks.org/mbostock/4063269

})();
