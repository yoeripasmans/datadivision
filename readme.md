# Individual Project ID - Interactive Eredivisie data visualization

For this individual project I've made an interactive data visualization dashboard of different datasets of the dutch football league Eredivisie. This data visualization combines assignment A & B.

![][cover]

## Background

I've started with thinking about a concept with Football data. I thought it was interesting to see if there was a relation between the topscorer and the league champion. For this I stared to sketching different graphs which combining all of the data. After that I've started developing and found different datasets from 'Eredivisie stats'. This data consist all of the Eredivisie topscorers per year.  When I visualized the topscorers, I want to combine it with an another dataset. I found another one which consist all of the champions of the Eredivisie per year. Together with all of the data I've made a dashboard with different graphs showing stats and relations of the chosen data. With one main graph showing the relation between topscorers, most assist and league champions.

## Functionality

With the main graph the user gets interactive insights of the who the topscorer of a certain year was, which team the league won and who the most assist had. The user can sort the data and click on buttons to load in different data. Also when the user hovers on the legend or circles, all other clubs than the club where the user hovers on are hiding, so it is easier to see who the topscorer and champion of a certain year were. Lastly when the champion and topscorer of a certain year are from the same club, a white border appears on the circle, too get a clear overview of relation between them. There are also two other graphs showing the total league titles of the club in a bubble chart and a graph showing the percentage of topscorers per club in a pie chart.  

## Technical aspects

**Developing Steps**

1. Downloaded the Eredivisie topscorers dataset from ['voetbal.com'](http://www.voetbal.com/topscoorders/ned-eredivisie/)

2. Started a new project by adding the `HTML`, `CSS` and `JS` files and linking them together.

3. Made a barchart working with topscorer data by copying code from this example [Simple bar graph in v4](https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4)

4. Added labels on top of the bars with the name of the topscorer and the amount of goals

```javascript
bars.append("text")
  .text(function(d) {
    return d.Speler + ", " + d.Goals;
  })
  .attr("class", "bar-text")
  .attr("transform", "rotate(-90)")
  .attr("x", function(d) {
    return -y(d.Goals) - (height - 200);
  })
  .attr("y", function(d) {
    return x(d.Date) + x.bandwidth() / 2 + 3;
  })
```

1. Added gridlines on the y axis

  ```javascript
  function make_y_gridlines() {
  return d3.axisLeft(y)
   .ticks(10);
  }
  svg.append("g")
  .attr("class", "grid")
  .style('opacity', '0.15')
  .call(make_y_gridlines()
   .tickSize(-width)
   .tickFormat("")
  );
  ```

2. Added colors from the topscorers club to the svg in a json file. In this object the clubs and colors are formatted like this:

```javascript
[{
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
```

Then added a fill to the bars in the svg by comparing the club color data to the topscorers data in a for loop.

```javascript
.style("fill", function(d) {
  for (var i = 0; i < clubColors.length; i++) {
    if (d.champion === clubColors[i].club) {
      return clubColors[i].color;
    }
  }
})
```

5. Downloaded the Eredivisie champions dataset from ['voetbal.com'](http://www.voetbal.com/winnaar/ned-eredivisie/)

5. Made another svg with circles under the x-axis of the bar chart displaying the Eredivisie champion of that season.

```javascript
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
  .attr('r', function(d) {
    return 6;
  })
  .attr('cy', 4)
  .attr('cx', function(d, i) {
    return x(d.Date) - 1.5;
  });
```

7. Downloaded the Eredivisie most assist dataset from ['voetbal.com']((http://www.voetbal.com/assists/ned-eredivisie-2017-2018/))

6. Made 2 separate functions to call the different data which consist topscorers and most assist per year. The topscorer data gets called on init, the assist data when the user clicks on the update button. Therefore I used another dataset to load in the most assist data in the assistData function.

```javascript
function topscorerData() {
  d3.csv("data/topscorers.csv", function(error, data) {
```

and

```javascript
function assistData(data) {
  d3.csv("data/assist.csv", function(error, data) {
```

7. Made a sort function to sort the bars on amount of goals or assist per player. Used almost the same function for sorting to original position of the data.

```javascript
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
    //Move frequency labels
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
}
```

8. Made the legend working based on https://bl.ocks.org/jkeohan/b8a3a9510036e40d3a4e

```javascript
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
```

9. Added a hover effect on the bars, circles and text when the user hovers over the legend or circles. Hiding all other clubs than the club where the user hovers on.

```javascript
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
```

10. Added a transition when the user scrolls down to the graph. Then the topscorerData gets loaded and the animation starts
```javascript
var scrolled;

function scroll() {
  if (window.pageYOffset > 350 && !scrolled) {
    scrolled = true;
    return topscorerData();
  }
}
window.addEventListener("scroll", scroll);
```

10. Added a transition when the user scrolls down to the graph. Then the topscorerData gets loaded and the animation starts
```javascript
var scrolled;

function scroll() {
  if (window.pageYOffset > 350 && !scrolled) {
    scrolled = true;
    return topscorerData();
  }
}
window.addEventListener("scroll", scroll);
```

11. Made a bubble chart working with my own data based on this example.  [Mike Bostock's Bubble Chart]https://bl.ocks.org/mbostock/4063269

12. Added a tooltip

```javascript
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
```

14. Added my own color scheme
```javascript
var color = d3.scaleOrdinal(["#C50D2F", "#5C9CCC", "#00a76f", "#0A5191", "#DEDEDE", "#FECF06", "#284878"]);
```

13. Added a value to the labels in the bubbles.

```javascript
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
```

14. Made a pie chart working with my own data based on this example: [Mike Bostock's Piechart](https://bl.ocks.org/mbostock/3887235)

12. Added a tooltip

```javascript
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
```

14. Added my own color scheme
```javascript
var color = d3.scaleOrdinal(["#C50D2F", "#5C9CCC", "#00a76f", "#0A5191", "#DEDEDE", "#FECF06", "#284878"]);
```

## Changes

### index.html

- Linked `Javascript` and `CSS` files.
- Added icons from `font-awesome`
- Added headings
- Added containers for the `svg`'s'
- Added video hero with scroll button

### index.css

- Added css reset
- Added styles to the body and headings
- Added layout styles to containers
- Added styles to `svg`'s

### index.js

- Imported data
- Added main interactive bar chart with multiple data
- Added tooltip for graphs
- Added legend for graph
- Added pie chart
- Added bubble chart

## Data

The data I chose consist all of the Goals scorers and Champions in the Eredivisie between 1960 and 2017 and originates from ['voetbal.com'](http://www.voetbal.com/topscoorders/ned-eredivisie/). These datasets I used were clean. This because I couldn't find a dirty one right away and didn't want to waste a lot of time. However I've edited and cleaned the dataset by myself so it works together with my used graphs.

By downloading the topscorers dataset, I got a `csv` file where all of the topscorers separated in columns per year. Like this:

Seizoen | Speler | Club | Goals |
---- | ------- | ------ | ------- |
1970 | Henk Groot       | Ajax      | 43      
1972 | Henk Groot       | Ajax      | 35       

- `Jaar` -- Season
- `Speler` -- The topscorer
- `Club` -- The name of the club where the topscorer played for.
- `Goals` -- Amount of goals

Then I've downloaded another dataset which consist all of the Eredivisie champions. ['voetbal.com'](http://www.voetbal.com/winnaar/ned-eredivisie/)

Seizoen | Club
---- | -------
1970 | Ajax
1971 | PSV

- `Seizoen` -- Season
- `Club` -- The name of the club who won the league

Lastly I've downloaded the dataset which consist the player with the most assist of that season
['voetbal.com'](http://www.voetbal.com/assists/ned-eredivisie-2017-2018/)

Seizoen | Speler | Club | Asiist |
---- | ------- | ------ | ------- |
1970 | Henk Groot       | Ajax      | 43      
1972 | Henk Groot       | Ajax      | 35       

- `Jaar` -- Season
- `Speler` -- The player with the most assist
- `Club` -- The name of the club where the player with the most assist played for.
- `Assist` -- Amount of assist

## Features

- [d3.csv](https://github.com/d3/d3-request/blob/master/README.md#csv)
- [d3.transition](https://github.com/d3/d3-transition/blob/master/README.md#transition)
- [d3.select](https://github.com/d3/d3-selection/blob/master/README.md#select)
- [d3.selectAll](https://github.com/d3/d3-selection/blob/master/README.md#selectAll)
- [_selection_.append](https://github.com/d3/d3-selection/blob/master/README.md#selection_append)
- [_selection_.attr](https://github.com/d3/d3-selection/blob/master/README.md#selection_attr)
- [_selection_.enter](https://github.com/d3/d3-selection/blob/master/README.md#selection_enter)
- [_node_.sum](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_sum)
- [_node_.each](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_each)
- [_selection_.filter](https://github.com/d3/d3-selection/blob/master/README.md#selection_filter)
- [d3.style](https://github.com/d3/d3-selection/blob/master/README.md#style)

## License

[MIT](https://opensource.org/licenses/MIT) © Yoeri Pasmans

[cover]: preview.png
