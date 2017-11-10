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

  //Append tooltip to the body
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden");

  // append the svg object to the body of the page
  var svg = d3.select(".section").append("svg")
    .attr('class', 'bar-chart')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // append the x Axis
  svg.append("g")
    .attr('class', 'axisX')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // append the y Axis
  svg.append("g")
    .attr('class', 'axisY')
    //Append Y-axis label
    .append("text")
    .attr("class", "axis-title")
    .attr("y", -20)
    .attr("x", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("font-size", 10)
    .attr("fill", "#5D6971");

  //append X-axis label to svg
  svg.append("text")
    .attr("class", "axis-title")
    .attr("y", height + 60)
    .attr("x", width - 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style('font-size', '10')
    .attr("fill", "#5D6971")
    .text("Champions");

  //Append grid to the svg
  svg.append("g")
    .attr("class", "grid")
    .style('opacity', '0.15');

  //Append circles group to svg and sets width, height and margins
  var circles = d3.select('svg').append('g')
    .attr('class', 'circle-group')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr("transform", "translate(" + 30 + "," + (height + 100) + ")");


  // get the club colors data and make it usable in all of the functions
  d3.json("data/clubcolors.json", function(error, clubColors) {

    //D3 Horizonal Legend based on https://bl.ocks.org/jkeohan/b8a3a9510036e40d3a4e
    var legend = d3.select('.legend-wrapper').selectAll("legend-item")
      .data(clubColors)
      .enter()
      .append("div")
      .attr("class", "legend-item");

    var p = legend.append("p")
      .attr("class", "club-name");
    //Append rectangles with color of the clubs
    p.append("span")
      .attr("class", "key-dot")
      .style("background", function(d, i) {
        return d.color;
      });
    //Returns clubnames as text in html
    p.insert("text").text(function(d, i) {
      return d.club;
    });

    //On button click load in topscorer data
    d3.select('.show-topscorer').on('click', topscorerData);

    function topscorerData() {
      // get the topscorers data
      d3.csv("data/topscorers.csv", function(data) {

        d3.select('.bar-title').text('Relation between topscorers and league champions');
        d3.select('.bar-date').text('Eredivisie - 1960 t/m 2017');

        d3.select('.show-topscorer').style('visibility', 'hidden');
        d3.select('.show-topscorer').style('display', 'none');
        d3.select('.show-assist').style('display', 'block');

        var transition = svg.transition();

        // format the data for easy use in the function
        data.forEach(function(d) {
          d.year = d.Seizoen;
          d.value = +d.Goals;
          d.club = d.Club;
          d.player = d.Speler;
          d.champion = d.Kampioen;
        });

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) {
          return d.year;
        }));
        y.domain([0, d3.max(data, function(d) {
          return d.value + 11;
        })]);

        //Set grid to the correct position and add the ticks
        transition.select('.grid')
          .call(gridlines()
            .tickSize(-width)
            .tickFormat("")
          );

        //Make the gridlines
        function gridlines() {
          return d3.axisLeft(y)
            .ticks(10);
        }

        //Move the labels
        transition.select('.axisY')
          .call(d3.axisLeft(y))
          .selectAll('g')

          .delay(function(d, i) {
            return i * 20;
          });

        //Edit y-axis label
        transition.select('.axis-title')
          .text('Goals')
          .delay(function(d, i) {
            return i * 60;
          });

        //Move the labels
        transition.select('.axisX')
          .call(d3.axisBottom(x))
          .selectAll('g')
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", "-.55em")
          .attr("transform", "rotate(-90)")

          .delay(function(d, i) {
            return i * 20;
          });

        //Select all bars and remove them before adding them with the new data
        var bars = svg.selectAll(".bar")
          .remove()
          .exit()
          .data(data)
          .enter()
          .append("g")
          .attr("class", "bar");

        //Append the rectangles for the bar chart
        bars.append("rect")
          .attr('class', 'rect')
          //Position of the bars
          .attr("x", function(d) {
            return x(d.year);
          })
          .attr("y", height)
          .attr("width", x.bandwidth())
          .attr("height", 0)

          //Bar colors
          .style("fill", function(d) {
            for (var i = 0; i < clubColors.length; i++) {
              if (d.club === clubColors[i].club) {
                return clubColors[i].color;
              }
            }
          })

          //Tool tip
          .on("mouseover", function(d) {
            tooltip.transition()
              .duration(100)
              .style("visibility", "visible");
            tooltip.html("Player: " + d.player + "<br/>" + "Club: " + d.club + "<br/>" + "Goals: " + d.value + "<br/>" + "Year: " + d.year);

          })
          .on("mousemove", function() {
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
          })

          .on("mouseout", function(d) {
            tooltip.transition()
              .duration(100)
              .style("visibility", "hidden");
          })
          .transition()
          .duration(1000)
          .delay(function(d, i) {
            return i * 20;
          })
          .attr("y", function(d) {
            return y(d.value);
          })
          .attr("height", function(d) {
            return height - y(d.value);
          });

        //Create the frequency labels above the bars.
        bars.append("text")
          .text(function(d) {
            return d.player + ", " + d.value;
          })
          .style('opacity', '0')
          .attr("class", "bar-text")
          .attr("transform", "rotate(-90)")
          .attr("x", function(d) {
            return -y(d.value) - (height - 200);
          })
          .attr("y", function(d) {
            return x(d.year) + x.bandwidth() / 2 + 3;
          })
          .transition()
          .duration(1000)
          .delay(function(d, i) {
            return i * 20;
          })
          .style('opacity', '0.6')
          .attr("x", function(d) {
            return -y(d.value) + 7;
          });

        //Change the opacity of the selected club trough bars, circles and text on mouseover
        p.on("mouseover", function(d) {
          var selectedClub = d.club;
          //Opacity of the rectangles
          bars.selectAll('rect')
            .style('opacity', function(d) {
              if (d.club == selectedClub) {
                return 1;
              } else {
                return 0.15;
              }
            });
          //Opacity of the text
          bars.selectAll('text')
            .style('opacity', function(d) {
              if (d.club == selectedClub) {
                return 0.7;
              } else {
                return 0.15;
              }
            });
          //Opacity of the circles
          circles.selectAll('circle')
            .style('opacity', function(d) {
              if (d.champion == selectedClub) {
                return 1;
              } else {
                return 0.15;
              }
            });
          //If club is champion and topscorer is from that club edit the circles
          circles.selectAll('circle')
            .attr('stroke', function(d) {
              if (d.champion == selectedClub && d.champion == d.club) {
                return "#fff";
              }
            })
            .attr('stroke-width', function(d) {
              if (d.champion == selectedClub && d.champion == d.club) {
                return 1.5;
              }
            });
        });
        //Reset on the opacity and stroke-width on mouseout
        p.on("mouseout", function(d) {
          bars.selectAll('rect')
            .style('opacity', '1');
          bars.selectAll('text')
            .style('opacity', '0.6');
          circles.selectAll('circle')
            .style('opacity', '1');
          circles.selectAll('circle')
            .attr('stroke-width', '0');
        });
        //Edit cricle group to correct position
        d3.select('.circle-group')
          .attr("transform", "translate(" + 30 + "," + (height + 100) + ")");
        //Remover circles before adding them with the loaded data and append them
        circles.selectAll('.circles')
          .remove()
          .exit()
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
            tooltip.html("Champion: " + d.champion + "<br/>" + "Year: " + d.year);

            var selectedClub = d.champion;
            //Opacity of the rectangles
            bars.selectAll('rect')
              .style('opacity', function(d) {
                if (d.club == selectedClub) {
                  return 1;
                } else {
                  return 0.15;
                }
              });
            //Opacity of the text
            bars.selectAll('text')
              .style('opacity', function(d) {
                if (d.club == selectedClub) {
                  return 0.7;
                } else {
                  return 0.15;
                }
              });
            //Opacity of the circles
            circles.selectAll('circle')
              .style('opacity', function(d) {
                if (d.champion == selectedClub) {
                  return 1;
                } else {
                  return 0.15;
                }
              });
            //If club is champion and topscorer is from that club edit circles
            circles.selectAll('circle')
              .attr('stroke', function(d) {
                if (d.champion == selectedClub && d.champion == d.club) {
                  return "#fff";
                }
              })
              .attr('stroke-width', function(d) {
                if (d.champion == selectedClub && d.champion == d.club) {
                  return 1.5;
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
            circles.selectAll('circle')
              .attr('stroke-width', '0');
          })

          .transition()
          .duration(1000)
          .delay(function(d, i) {
            return i * 15;
          })
          //Compare club color data to data with topscorers club
          .style("fill", function(d) {
            for (var i = 0; i < clubColors.length; i++) {
              if (d.champion === clubColors[i].club) {
                return clubColors[i].color;
              }
            }
          })
          .attr('r', function(d) {
            return 6;
          })
          .attr('cy', 4) // centers circle
          .attr('cx', function(d, i) {
            return x(d.year) - 1.5;
          });

        d3.select('.fa-sort-numeric-asc')
          .classed('fa-sort-numeric-asc-active', true)
          .on('click', function(d) {
            sortOnYears(data);
          });
        d3.select('.fa-sort-amount-desc')
          .classed('fa-sort-amount-desc-active', false)
          .on('click', function(d) {
            sortOnGoals(data);
          });

      });

    }

    //On click load in most assist data
    d3.select('.show-assist').on('click', assistData);

    function assistData(data) {
      d3.csv("data/assist.csv", function(error, data) {


        d3.select('.bar-title').text('Relation between most assist and league champions');
        d3.select('.bar-date').text('Eredivisie - 1996 t/m 2017');
        d3.select('.show-topscorer').style('display', 'block');
        d3.select('.show-topscorer').style('visibility', 'visible');
        d3.select('.show-assist').style('display', 'none');

        // Get the assist data
        var transition = svg.transition();

        data.forEach(function(d) {
          d.year = d.Seizoen;
          d.value = +d.Assist;
          d.club = d.Club;
          d.player = d.Speler;
          d.champion = d.Kampioen;
        });

        // Scale the range of the data again
        x.domain(data.map(function(d) {
          return d.year;
        }));
        y.domain([0, d3.max(data, function(d) {
          return d.value + 10;
        })]);


        //Move the labels
        transition.select('.axisY')
          .call(d3.axisLeft(y))
          .selectAll('g')
          .delay(function(d, i) {
            return i * 20;
          });

        //Move the labels
        transition.select('.axisX')
          .call(d3.axisBottom(x))
          .selectAll('g')
          .selectAll("text")
          .style("text-anchor", "default")
          .attr("dx", "10")
          .attr("dy", "10")
          .delay(function(d, i) {
            return i * 20;
          })
          .attr("transform", "rotate(0)");

        transition.select('.grid')
          .call(gridlines()
            .tickSize(-width)
            .tickFormat("")
          )
          .delay(function(d, i) {
            return i * 20;
          });

        function gridlines() {
          return d3.axisLeft(y)
            .ticks(13);
        }

        transition.select('.axis-title').text('Assist');

        //select all bars on the graph, take them out, and exit the previous data set then enter the new data set.
        var bars = svg.selectAll(".bar")
          .remove()
          .exit()
          .data(data)
          .enter()
          .append("g")
          .attr("class", "bar");

        bars.append("rect")
          .attr('class', 'rect')
          //position of the bars
          .attr("x", function(d) {
            return x(d.year);
          })
          .attr("y", height)
          .attr("width", x.bandwidth())
          .attr("height", 0)

          //Bar colors
          .style("fill", function(d) {
            for (var i = 0; i < clubColors.length; i++) {
              if (d.club === clubColors[i].club) {
                return clubColors[i].color;
              }
            }
          })
          //Tool tip
          .on("mouseover", function(d) {
            tooltip.transition()
              .duration(100)
              .style("visibility", "visible");
            tooltip.html("Player: " + d.player + "<br/>" + "Club: " + d.club + "<br/>" + "Assist: " + d.value + "<br/>" + "Year: " + d.year);

          })
          .on("mousemove", function() {
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
          })

          .on("mouseout", function(d) {
            tooltip.transition()
              .duration(100)
              .style("visibility", "hidden");
          })

          .transition()
          .duration(1000)
          .delay(function(d, i) {
            return i * 20;
          })
          .attr("x", function(d) {
            return x(d.year);
          })
          .attr("y", function(d) {
            return y(d.value);
          })
          .attr("width", x.bandwidth())
          .attr("height", function(d) {
            return height - y(d.value);
          });

        bars.append("text")
          .text(function(d) {
            return d.player + ", " + d.value;
          })
          .style('opacity', '0')
          .attr("class", "bar-text")
          .attr("transform", "rotate(-90)")
          .attr("x", function(d) {
            return -y(d.value) - (height - 200);
          })
          .attr("y", function(d) {
            return x(d.year) + x.bandwidth() / 2 + 3;
          })
          .transition()
          .duration(1000)
          .delay(function(d, i) {
            return i * 20;
          })
          .style('opacity', '0.6')
          .attr("x", function(d) {
            return -y(d.value) + 7;
          });
        p.on("mouseover", function(d) {
          var selectedClub = d.club;
          //Opacity of the rectangles
          bars.selectAll('rect')
            .style('opacity', function(d) {
              if (d.club == selectedClub) {
                return 1;
              } else {
                return 0.15;
              }
            });
          bars.selectAll('text')
            .style('opacity', function(d) {
              if (d.club == selectedClub) {
                return 0.7;
              } else {
                return 0.15;
              }
            });
            //If club is champion and topscorer is from that club edit the circles
            circles.selectAll('circle')
              .attr('stroke', function(d) {
                if (d.champion == selectedClub && d.champion == d.club) {
                  return "#fff";
                }
              })
              .attr('stroke-width', function(d) {
                if (d.champion == selectedClub && d.champion == d.club) {
                  return 1.5;
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
          circles.selectAll('circle')
            .attr('stroke-width', '0');
        });

        d3.select('.circle-group')
          .attr("transform", "translate(" + 37 + "," + (height + 95) + ")");

        circles.selectAll('.circles')
          .remove()
          .exit()
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
            tooltip.html("Champion: " + d.champion + "<br/>" + "Year: " + d.year);
            var selectedClub = d.champion;
            //Opacity of the rectangles
            bars.selectAll('rect')
              .style('opacity', function(d) {
                if (d.club == selectedClub) {
                  return 1;
                } else {
                  return 0.15;
                }
              });
            //Opacity of the text
            bars.selectAll('text')
              .style('opacity', function(d) {
                if (d.club == selectedClub) {
                  return 0.7;
                } else {
                  return 0.15;
                }
              });
            //Opacity of the circles
            circles.selectAll('circle')
              .style('opacity', function(d) {
                if (d.champion == selectedClub) {
                  return 1;
                } else {
                  return 0.15;
                }
              });
            //If club is champion and topscorer is from that club edit circles
            circles.selectAll('circle')
              .attr('stroke', function(d) {
                if (d.champion == selectedClub && d.champion == d.club) {
                  return "#fff";
                }
              })
              .attr('stroke-width', function(d) {
                if (d.champion == selectedClub && d.champion == d.club) {
                  return 1.5;
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
            circles.selectAll('circle')
              .attr('stroke-width', '0');
          })

          .transition()
          .duration(1000)
          .delay(function(d, i) {
            return i * 15;
          })

          .style("fill", function(d) {
            for (var i = 0; i < clubColors.length; i++) {
              if (d.champion === clubColors[i].club) {
                return clubColors[i].color;
              }
            }
          })
          .attr('r', function(d) {
            return 7;
          }) // visit duration
          .attr('cy', 4) // centers circle
          .attr('cx', function(d, i) {
            return x(d.year) + 5;
          });
        d3.select('.fa-sort-numeric-asc')
          .classed('fa-sort-numeric-asc-active', true)
          .on('click', function(d) {
            sortOnYears(data);
          });
        d3.select('.fa-sort-amount-desc')
          .classed('fa-sort-amount-desc-active', false)
          .on('click', function(d) {
            sortOnGoals(data);
          });
      });

    }


    // Sort on year function
    function sortOnYears(data) {
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
          return -y(d.value) + 5;
        })
        .attr("y", function(d) {
          return x(d.year) + x.bandwidth() / 2 + 4;
        });

      //Returns sorted data on goals
      function sort(a, b) {
        return d3.descending(year(b), year(a));
      }
      d3.select('.fa-sort-numeric-asc')
        .classed('fa-sort-numeric-asc-active', true);

      d3.select('.fa-sort-amount-desc')
        .classed('fa-sort-amount-desc-active', false);

    }

    // Sort trigger
    function sortOnGoals(data) {

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
          return -y(d.value) + 5;
        })
        .attr("y", function(d) {
          return x(d.year) + x.bandwidth() / 2 + 4;
        });

      //Returns sorted data on frequency
      function sort(a, b) {
        return d3.ascending(goal(b), goal(a));
      }
      d3.select('.fa-sort-numeric-asc').classed('fa-sort-numeric-asc-active', false);
      d3.select('.fa-sort-amount-desc').classed('fa-sort-amount-desc-active', true);

    }
    //Get the goal field for a row
    function goal(d) {
      return d.value;
    }
    //Get the year field for a row
    function year(d) {
      return d.year;
    }

    //Load topscorer data on init with scroll position
    var scrolled;

    function scroll() {
      if (window.pageYOffset > 350 && !scrolled) {
        scrolled = true;
        return topscorerData();
      }
    }
    window.addEventListener("scroll", scroll);

  });

})();

//Bar chart based on: https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
