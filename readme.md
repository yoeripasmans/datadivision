# Project ID1 - Interactive Eredivisie data visualization dashboard

For this individual project I've made a interactive data visualization dashboard of different datasets of the dutch football league Eredivisie.

![][cover]

## Background

First I've chosen a dataset from 'fivethirtyeight'. This data consist all of the Terrorism Fatalities in Europe between 1970 and 2014.
This was a clean dataset because I couldn't find a dirty one right away and didn't want to waste a lot of time. Instead I focused more on creating a nice interactive data visualization. I've made a map were you get an overview of all the total terrorism fatalities in Europe by country. If you click on a country you can see the fatalities by year in a line graph.

**Steps**

## Changes

### index.html

- Linked Javascript and CSS files.
- Added heading
- Added container

### index.css

- Added basic styles to the body and heading
- Added styles to `svg`'s

### index.js
- Imported data
- Added map of Europe
- Added tooltip for map
- Added legend for map
- Added line graph

## Data

The data I chose consist all of the Goals scorers in the Eredivisie between 1960 and 2017 and originates from [fivethirtyeight](https://github.com/fivethirtyeight/data/blob/master/terrorism/eu_terrorism_fatalities_by_country.csv). This was a clean dataset because I couldn't find a dirty one right away and didn't want to waste a lot of time. However I've edited and cleaned the dataset by myself so it works together with the used graphs.

By downloading this dataset, I got a `csv` file where all of the topscorers separated in columns. Like this:

year | Belgium | France | Denmark | Germany | Italy | ..
--- | --- | --- | --- | --- | --- | ---
1970 | 0 | 2 | 43 | 54 | 6 | ..
1971 | 0 | 3 | 0 | 46 | 0 | ..
1972 | 0 | 5 | 6 | 5 | 0 | ..


- `year` -- Year of research
- `country` -- The country
- `value` -- Amount of fatalities

## Features
- [d3.csv](https://github.com/d3/d3-request/blob/master/README.md#csv)
- [d3.json](https://github.com/d3/d3-request/blob/master/README.md#json)
- [d3.transition](https://github.com/d3/d3-transition/blob/master/README.md#transition)
- [d3.select](https://github.com/d3/d3-selection/blob/master/README.md#select)
- [d3.selectAll](https://github.com/d3/d3-selection/blob/master/README.md#selectAll)
- [_selection_.append](https://github.com/d3/d3-selection/blob/master/README.md#selection_append)
- [_selection_.attr](https://github.com/d3/d3-selection/blob/master/README.md#selection_attr)
- [_selection_.enter](https://github.com/d3/d3-selection/blob/master/README.md#selection_enter)
- [_node_.sum](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_sum)
- [_node_.each](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_each)
- [d3.scaleThreshold](https://github.com/d3/d3-scale/blob/master/README.md#scaleThreshold)
- [d3.geoMercator](https://github.com/d3/d3-geo/blob/master/README.md#geoMercator)
- [d3.geoPath](https://github.com/d3/d3-geo/blob/master/README.md#geoPath
- [*selection*.filter](https://github.com/d3/d3-selection/blob/master/README.md#selection_filter)
- [d3.style](https://github.com/d3/d3-selection/blob/master/README.md#style)
- [d3.scaleTime](https://github.com/d3/d3-scale/blob/master/README.md#scaleTime)
- [d3.bisect](https://github.com/d3/d3-array/blob/master/README.md#bisect)
- [d3.scaleLinear](https://github.com/d3/d3-scale/blob/master/README.md#scaleLinear)
- [d3.extent](https://github.com/d3/d3-array/blob/master/README.md#extent)

## License

[MIT](https://opensource.org/licenses/MIT) © Yoeri Pasmans

[cover]: preview.png
