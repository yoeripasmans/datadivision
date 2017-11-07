(function() {
  'use strict';








  // set the dimensions and margins of the graph
  var margin = {
      top: 60,
      right: 20,
      bottom: 70,
      left: 20
    },
    width = 1160 - margin.left - margin.right,
    height = 530 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
  var y = d3.scaleLinear()
    .range([height, 0]);

  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden");

  // append the svg object to the body of the page
  var svg = d3.select(".section").append("svg")
  .attr('class', 'bar-chart')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  var clubColors = [{
      "club": "Ajax",
      "color": "#C50D2F",
    },
    {
      "club": "Feyenoord",
      "color": "#00a76f"
    },
    {
      "club": "PSV",
      "color": "#5C9CCC"
    },
    {
      "club": "AZ",
      "color": "#DEDEDE"
    },
    {
      "club": "Vitesse",
      "color": "#FECF06"
    },
    {
      "club": "FC Twente",
      "color": "#7B8196"
    },
    {
      "club": "SC Heerenveen",
      "color": "#004991"
    },

    {
      "club": "Volendam",
      "color": "#FF641B"
    },
    {
      "club": "DWS",
      "color": "#0A5191"
    },
  ];

  // get the data
  d3.csv("data/topscorers.csv", function(error, data) {

    d3.csv("data/kampioenen.csv", function(error, data2) {
      if (error) throw error;

      // format the data
      data.forEach(function(d) {
        d.Date = d.Seizoen;
        d.Goals = +d.Goals;
      });

      // Scale the range of the data in the domains
      x.domain(data.map(function(d) {
        return d.Date;
      }));
      y.domain([0, d3.max(data, function(d) {
        return d.Goals + 10;
      })]);

      function make_y_gridlines() {
        return d3.axisLeft(y)
          .ticks(10);
      }

      // add the Y gridlines
      svg.append("g")
        .attr("class", "grid")
        .style('opacity', '0.15')
        .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
        );

      var bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar");

      // append the rectangles for the bar chart
      bars.append("rect")
        //Tool tip
        .on("mouseover", function(d) {
          tooltip.transition()
            .duration(100)
            .style("visibility", "visible");
          tooltip.html("Player: " + d.Speler + "<br/>" + "Club: " + d.Club + "<br/>" + "Goals: " + d.Goals + "<br/>" + "Year: " + d.Seizoen);

        })
        .on("mousemove", function() {
          return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })

        .on("mouseout", function(d) {
          tooltip.transition()
            .duration(100)
            .style("visibility", "hidden");
        })
        //Bar colors
        .style("fill", function(d) {
          if (d.Club === "Ajax") {
            return clubColors[0].color;
          } else if (d.Club === "Feyenoord") {
            return "#00a76f";
          } else if (d.Club === "PSV") {
            return "#5C9CCC";
          } else if (d.Club === "FC Twente") {
            return "#7B8196";
          } else if (d.Club === "SC Heerenveen") {
            return "#004991";
          } else if (d.Club === "Vitesse") {
            return "#FECF06";
          } else if (d.Club === "AZ") {
            return "#DEDEDE";
          } else if (d.Club === "Volendam") {
            return "#FF641B";
          } else if (d.Club === "NEC") {
            return "#000";
          } else if (d.Club === "DWS") {
            return "#0A5191";
          } else if (d.Club === "Sparta") {
            return "#F02022";
          }

        })

        .attr("x", function(d) {
          return x(d.Date);
        })
        .attr("y", height)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .transition()
        .duration(1000)
        .delay(function(d, i) {
          return i * 20;
        })
        .attr("y", function(d) {
          return y(d.Goals);
        })
        .attr("height", function(d) {
          return height - y(d.Goals);
        });



      //Create the frequency labels above the bars.
      bars.append("text")
        .text(function(d) {
          return d.Speler + ", " + d.Goals;
        })
        .style('opacity', '0')
        .attr("class", "bar-text")
        .attr("transform", "rotate(-90)")
        .attr("x", function(d) {
          return -y(d.Goals) - (height - 200);
        })
        .attr("y", function(d) {
          return x(d.Date) + x.bandwidth() / 2 + 3;
        })
        .transition()
        .duration(1000)
        .delay(function(d, i) {
          return i * 20;
        })
        .style('opacity', '0.6')
        .attr("x", function(d) {
          return -y(d.Goals) + 7;
        });

      // add the x Axis
      svg.append("g")
        .attr('class', 'axisX')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

      // add the y Axis
      svg.append("g")
        .call(d3.axisLeft(y))

        //Y-axis text
        .append("text")
        .attr("class", "axis-title")
        .attr("y", -20)
        .attr("x", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Goals");

      ///D3 Horizonal Legend based on https://bl.ocks.org/jkeohan/b8a3a9510036e40d3a4e ////////////////////////////////
      var legend = d3.select('.legend-wrapper').selectAll("legend-item")
        .data(clubColors)
        .enter()
        .append("div")
        .attr("class", "legend-item");

      var p = legend.append("p")
        .attr("class", "club-name");

      p.append("span")
        .attr("class", "key-dot")
        .style("background", function(d, i) {
          return d.color;
        });

      p.insert("text").text(function(d, i) {
        return d.club;
      });

      p.on("mouseover", function(d) {
        var selectedClub = d.club;
        //Opacity of the rectangles
        bars.selectAll('rect')
          .style('opacity', function(d) {
            if (d.Club == selectedClub) {
              return 1;
            } else {
              return 0.1;
            }
          });
        bars.selectAll('text')
          .style('opacity', function(d) {
            if (d.Club == selectedClub) {
              return 0.7;
            } else {
              return 0.1;
            }
          });
        //Opacity of the circles
        circles.selectAll('circle')
          .style('opacity', function(d) {
            if (d.Kampioen == selectedClub) {
              return 1;
            } else {
              return 0.1;
            }
          });
      });

      p.on("mouseout", function(d) {
        bars.selectAll('rect')
          .style('opacity', '1');
        bars.selectAll('text')
          .style('opacity', '0.6');
        circles.selectAll('circle')
          .style('opacity', '1');
      });

      var circles = d3.select('svg').append('g')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr("transform", "translate(" + 30 + "," + (height + 100) + ")");

      circles.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'circles')
        .attr('cx', '0')
        .attr('fill', 'none')

        .on("mouseover", function(d) {
          //Tool-tip
          tooltip.transition()
            .duration(100)
            .style("visibility", "visible");
          tooltip.html("Champion: " + d.Kampioen + "<br/>" + "Year: " + d.Seizoen);
          var selectedClub = d.Kampioen;
          //Opacity of the rectangles
          bars.selectAll('rect')
            .style('opacity', function(d) {
              if (d.Club == selectedClub) {
                return 1;
              } else {
                return 0.1;
              }
            });
          bars.selectAll('text')
            .style('opacity', function(d) {
              if (d.Club == selectedClub) {
                return 0.7;
              } else {
                return 0.1;
              }
            });
          //Opacity of the circles
          circles.selectAll('circle')
            .style('opacity', function(d) {
              if (d.Kampioen == selectedClub) {
                return 1;
              } else {
                return 0.1;
              }
            });

        })
        .on("mousemove", function() {
          return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
        })

        .on("mouseout", function(d) {
          tooltip.transition()
            .duration(100)
            .style("visibility", "hidden");
          bars.selectAll('rect')
            .style('opacity', '1');
          bars.selectAll('text')
            .style('opacity', '0.6');
          circles.selectAll('circle')
            .style('opacity', '1');
        })

        .transition()
        .duration(1000)
        .delay(function(d, i) {
          return i * 15;
        })

        .style("fill", function(d) {
          if (d.Kampioen === "Ajax") {
            return "#C50D2F";
          } else if (d.Kampioen === "Feyenoord") {
            return "#00a76f";
          } else if (d.Kampioen === "PSV") {
            return "#5C9CCC";
          } else if (d.Kampioen === "FC Twente") {
            return "#7B8196";
          } else if (d.Kampioen === "SC Heerenveen") {
            return "#004991";
          } else if (d.Kampioen === "Vitesse") {
            return "#FECF06";
          } else if (d.Kampioen === "AZ") {
            return "#DEDEDE";
          } else if (d.Kampioen === "Volendam") {
            return "#FF641B";
          } else if (d.Kampioen === "NEC") {
            return "#000";
          } else if (d.Kampioen === "DWS") {
            return "#0A5191";
          } else if (d.Kampioen === "Sparta") {
            return "#F02022";
          }
        })
        .attr('r', function(d) {
          return 6;
        }) // visit duration
        .attr('cy', 4) // centers circle
        .attr('cx', function(d, i) {
          return x(d.Date) - 1.5;
        });
      //X-axis text
      circles.append("text")
        .attr("class", "axis-title")
        .attr("y", 20)
        .attr("x", width - 16)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-size', '10')
        .attr("fill", "#5D6971")
        .text("Champions");


      d3.select('.fa-sort-amount-desc').on('click', sortOnGoals);

      // Sort trigger
      function sortOnGoals() {

        var x0 = x.domain(data.sort(sort).map(year)).copy();
        var transition = svg.transition();
        //Move the bars
        transition.selectAll('rect')
          .delay(function(d, i) {
            return i * 20;
          })
          .attr('x', function(d) {
            return x0(year(d));
          });

        circles.selectAll('circle')
          .transition()
          .duration(1000)
          .delay(function(d, i) {
            return i * 5;
          })
          .attr('cx', function(d, i) {
            return x0(year(d));
          });

        //Move the labels
        transition.select('.axisX')
          .call(d3.axisBottom(x))
          .selectAll('g')
          .delay(function(d, i) {
            return i * 20;
          });

        transition.selectAll('.bar-text')
          .delay(function(d, i) {
            return i * 20;
          })
          .attr("x", function(d) {
            return -y(d.Goals) + 5;
          })
          .attr("y", function(d) {
            return x(d.Date) + x.bandwidth() / 2 + 4;
          });

        //Returns sorted data on frequency
        function sort(a, b) {
          return d3.ascending(goal(b), goal(a));
        }

      }

      d3.select('.fa-sort-numeric-asc').on('click', sortOnYears);
      // Sort trigger
      function sortOnYears() {

        var x0 = x.domain(data.sort(sort).map(year)).copy();
        var transition = svg.transition();
        //Move the bars
        transition.selectAll('rect')
          .delay(function(d, i) {
            return i * 20;
          })
          .attr('x', function(d) {
            return x0(year(d));
          });
        //Move the circles
        circles.selectAll('circle')
          .transition()
          .duration(1000)
          .delay(function(d, i) {
            return i * 5;
          })
          .attr('cx', function(d, i) {
            return x0(year(d));
          });

        //Move the labels
        transition.select('.axisX')
          .call(d3.axisBottom(x))
          .selectAll('g')
          .delay(function(d, i) {
            return i * 20;
          });

        transition.selectAll('.bar-text')
          .delay(function(d, i) {
            return i * 20;
          })
          .attr("x", function(d) {
            return -y(d.Goals) + 5;
          })
          .attr("y", function(d) {
            return x(d.Date) + x.bandwidth() / 2 + 4;
          });

        //Returns sorted data on goals
        function sort(a, b) {
          return d3.descending(year(b), year(a));
        }

      }

      //Get the goal field for a row
      function goal(d) {
        return d.Goals;
      }
      //Get the year field for a row
      function year(d) {
        return d.Seizoen;
      }

    });

  });

})();
