//Sets the diameter of the svg
var diameter = 660;

//Selects svg from document and sets the diameter
var svg = d3.select('.section2').append('svg')
  .attr("width", diameter)
  .attr("height", diameter);

//Sets the format
var format = d3.format(",d");

//Sets own color scheme
var color = d3.scaleOrdinal(["#DB5542", "#5CCBC1", "9DE0DA", "#F1BBB3", "#333136", "#ADADAF"]);

// create a new circle-packing layout
var bubble = d3.pack()
  .size([diameter, diameter])
  .padding(3.5);

//Gets the data out of the CSV file.
d3.csv("data/kampioenen.csv", function(error, data) {
if (error) throw error;
  data = d3.nest()
  .key(function(d) { return d.Club; })
  .rollup(function(v) { return v.length; })
  .entries(data);

  console.log(data);

  // format the data
  data.forEach(function(d) {
    data.id = d.key;
    data.value = +d.value;
  });

  var root = d3.hierarchy(classes(data))
     .sum(function(d) { console.log(d);return d.value; })
     .sort(function(a, b) { return b.value - a.value; });

     bubble(root);
      var node = svg.selectAll(".node")
          .data(root.children)
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      node.append("title")
          .text(function(d) { return d.data.className + ": " + format(d.value); });

      node.append("circle")
          .attr("r", function(d) { return d.r; })
          .style("fill", function(d) {
            return color(d.data.packageName);
          });

      node.append("text")
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .text(function(d) { return d.data.className.substring(0, d.r / 3); });
    // d.value = +d.value;
    // if (d.value) return d;
    // }, function(error, classes) {
    // console.log(classes);
    // if (error) throw error;
    // var root = d3.hierarchy({
    //     children: classes
    //   })
    //   .sum(function(d) {
    //     return d.value;
    //   })
    //   .each(function(d) {
    //     if (id = d.data.id) {
    //       var id, i = id.lastIndexOf(".");
    //       d.id = id;
    //       d.package = id.slice(0, i);
    //       d.class = id.slice(i + 1);
    //     }
    //   });

});

function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

d3.select(self.frameElement).style("height", diameter + "px");
