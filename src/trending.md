---
title: Trending
toc: false
---

# Alojamientos y Hosts Trending 🚀

Explora alojamientos y hosts que son populares en Capital Federal. 

```js

// Import and prepare data
let data = await FileAttachment('./data/detailed_reviews_listings.csv').csv({typed: true});

const neighborhoods = await FileAttachment('./data/neighborhoods.csv').csv({ typed: true })

// Create filters with updated field names
let neighborhoodSelected = view(Inputs.select(
  ["Todos", ...Array.from(new Set(data.map(d => d.neighborhood).filter(Boolean)))],
  { 
    label: "Selecciona un barrio",
    value: "Todos" 
  }
));

const geoNeighborhoods = await FileAttachment('./data/geo_neighborhoods.json').json()

let topHostsCount = await view(Inputs.range(
  [10, 1000], 
  {
    step: 5,
    label: "Top hosts por rating",
    value: 10
  }
));

let minReviews = view(Inputs.checkbox(
  ["Solo hosts con más de 5 reseñas"]
));

let superhost = view(Inputs.checkbox(
  ["Solo Superhost"]
));

let minProperties = view(Inputs.range(
  [1, 100], 
  {
    step: 1,
    label: "Cantidad de propiedades mínimas",
    value: 10
  }
));

let maxProperties = view(Inputs.range(
  [1, 250], 
  {
    step: 1,
    label: "Cantidad de propiedades máximas",
    value: 100
  }
));

let listingsByHost = d3.group(data, d => d.hostId)
let hostRatings = d3.rollup(data, v => d3.mean(v, d => d.rating), d=> d.hostId)
```
```js
let topHosts = Array.from(hostRatings.entries())
  .map(([hostId, avgRating]) => {
    let listings = listingsByHost.get(hostId);
    if(neighborhoodSelected != 'Todos'){
      listings = listings.filter(listing => listing.neighborhood == neighborhoodSelected);
    }
    if(listings.length == 0) return null;

    const hostName = listings[0].hostName; // Assuming all listings have the same hostName
    const propertyCount = listings.length;
    const avgResponseRate = d3.mean(listings, d => parseFloat(d.hostResponseRate)) || 0;

    //filters
    const isSuperHost = listings[0].hostIsSuperhost
    if(superhost){
      if (!isSuperHost) return null;
    }
    if(listings.length < minProperties || listings.length > maxProperties) return null;


    const totalReviews = d3.sum(listings, d => d.numberOfReviews);
    if(minReviews){
          if(totalReviews < 5) return null;
    }
    const avgCleanlinessRating = d3.mean(listings, d => d.cleanlinessRating);
    const avgCheckinRating = d3.mean(listings, d => d.checkinRating);
    const avgValueRating = d3.mean(listings, d => d.valueRating);
    const avgCommunicationRating = d3.mean(listings, d => d.communicationRating);
    const avgLocationRating = d3.mean(listings, d => d.locationRating);
    const avgResponseTime = d3.mean(listings, d => d.hostResponseTime);

    return { 
      hostId,
      avgRating,
      hostName,
      propertyCount,
      totalReviews,
      avgResponseRate,
      avgResponseTime,
      isSuperHost,
      rating: {
        avgCleanlinessRating,
        avgCheckinRating,
        avgCommunicationRating,
        avgLocationRating,
        avgValueRating
      }

    };
  }).filter(d => d !== null)
  .sort((a, b) => b.avgRating - a.avgRating).slice(0,topHostsCount);
console.log(topHosts)
```

# Top Hosts ordenados por cantidad de propiedades
```js
Plot.plot({
  marginTop: 20,
  marginRight: 20,
  marginBottom: 50,
  marginLeft: 100,
  height: 40 * topHosts.length, 
  color: {
    scheme: "category10",
  },
  marks: [
    Plot.barX(topHosts, {
      x: "propertyCount",
      y: "hostName",
      fill: "hostName",
      sort: { y: "x", reverse: true }, 
    }),
    Plot.ruleX([0]), 
  ],
  x: {
    label: "Property Count →",
    grid: true, 
  },
  y: {
    label: "Host Name",
    tickSize: 0,
  },
  style: {
    fontFamily: "sans-serif",
    fontSize: 12,
  },
})
```

# Response rate vs rating
```js

```

# Response time vs rating
```js
```

# Ratings del mejor y el peor del top
```js
//prepare the data
  var color = d3.scaleOrdinal().range(["#EDC951", "#CC333F", "#00A0B0"]);
  
  var margin = { top: 100, right: 100, bottom: 100, left: 100 },
    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(
      width,
      window.innerHeight - margin.top - margin.bottom - 20
    );
  var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 0.5,
    levels: 5,
    roundStrokes: true,
    color: color
  };
  let preparedData = [];
  if(topHosts && topHosts.length > 1){
    const topHost = topHosts[0];
    const leastHost = topHosts[topHosts.length - 1];
  preparedData = [topHost, leastHost].map((host) => {
    return Object.entries(host.rating).map(([category, value]) => ({
      axis: category
        .replace("avg", "")
        .replace("Rating", "")
        .trim(),
      value: value / 5,
    }));
  });

  }
 

```
```js
function RadarChart(data, options) {
  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.4,
        y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", dy + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }

  var cfg = {
    w: 600,
    h: 600,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    levels: 3,
    maxValue: 0,
    labelFactor: 1.25,
    wrapWidth: 60,
    opacityArea: 0.35,
    dotRadius: 4,
    opacityCircles: 0.1,
    strokeWidth: 2,
    roundStrokes: false,
    // Bright, high-contrast colors for dark background
    color: d3.scaleOrdinal().range(["#FF4D4D", "#4DFF4D", "#4D4DFF"]),
    // Text styling configuration
    legendFontSize: "16px",
    axisLabelFontSize: "14px",
    tooltipFontSize: "16px",
    legendFontWeight: "bold",
    axisLabelFontWeight: "bold",
    // Colors for dark theme
    textColor: "#FFFFFF",          // White text
    gridColor: "#444444",          // Dark grey grid
    dotColor: "#FFFFFF",           // White dots
    tooltipColor: "#FFFFFF"        // White tooltip
  };

  if ("undefined" !== typeof options) {
    for (var i in options) {
      if ("undefined" !== typeof options[i]) {
        cfg[i] = options[i];
      }
    }
  }

  var maxValue = Math.max(
    cfg.maxValue,
    d3.max(data, function(i) {
      return d3.max(i.map(function(o) { return o.value; }));
    })
  );

  var allAxis = data[0].map(function(i, j) { return i.axis; }),
    total = allAxis.length,
    radius = Math.min(cfg.w / 2, cfg.h / 2),
    Format = function(d) { return (d * 100).toFixed(2) + '%'; },
    angleSlice = (Math.PI * 2) / total;

  var rScale = d3.scaleLinear()
    .range([0, radius])
    .domain([0, maxValue]);

  const height = cfg.h + cfg.margin.top + cfg.margin.bottom;
  const width = cfg.w + cfg.margin.left + cfg.margin.right;

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("class", "radar-chart");

  const g = svg.append("g")
    .attr("transform", `translate(${cfg.w / 2 + cfg.margin.left}, ${cfg.h / 2 + cfg.margin.top})`);

  var filter = g.append("defs").append("filter").attr("id", "glow"),
    feGaussianBlur = filter.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur"),
    feMerge = filter.append("feMerge"),
    feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
    feMergeNode_2 = feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  var axisGrid = g.append("g").attr("class", "axisWrapper");

  // Draw background circles
  axisGrid.selectAll(".levels")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function(d) { return (radius / cfg.levels) * d; })
    .style("fill", cfg.gridColor)
    .style("stroke", cfg.gridColor)
    .style("fill-opacity", cfg.opacityCircles)
    .style("filter", "url(#glow)");

  // Axis labels (percentage values)
  axisGrid.selectAll(".axisLabel")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function(d) { return (-d * radius) / cfg.levels; })
    .attr("dy", "0.4em")
    .style("font-size", cfg.axisLabelFontSize)
    .style("font-weight", cfg.axisLabelFontWeight)
    .attr("fill", cfg.textColor)
    .text(function(d) { return Format(maxValue * d / cfg.levels); });

  var axis = axisGrid.selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");

  // Draw axis lines
  axis.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function(d, i) { return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
    .attr("y2", function(d, i) { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
    .attr("class", "line")
    .style("stroke", cfg.gridColor)
    .style("stroke-width", "2px");

  // Draw axis labels (feature names)
  axis.append("text")
    .attr("class", "legend")
    .style("font-size", cfg.legendFontSize)
    .style("font-weight", cfg.legendFontWeight)
    .style("fill", cfg.textColor)
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function(d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
    .attr("y", function(d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
    .text(function(d) { return d; })
    .call(wrap, cfg.wrapWidth);

  var radarLine = d3.lineRadial()
    .curve(d3.curveLinearClosed)
    .radius(function(d) { return rScale(d.value); })
    .angle(function(d, i) { return i * angleSlice; });

  var blobWrapper = g.selectAll(".radarWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarWrapper");

  // Draw the areas
  blobWrapper.append("path")
    .attr("class", "radarArea")
    .attr("d", function(d) { return radarLine(d); })
    .style("fill", function(d, i) { return cfg.color(i); })
    .style("fill-opacity", cfg.opacityArea)
    .on("mouseover", function() {
      d3.selectAll(".radarArea")
        .transition().duration(200)
        .style("fill-opacity", 0.1);
      d3.select(this)
        .transition().duration(200)
        .style("fill-opacity", 0.7);
    })
    .on("mouseout", function() {
      d3.selectAll(".radarArea")
        .transition().duration(200)
        .style("fill-opacity", cfg.opacityArea);
    });

  // Draw the outlines
  blobWrapper.append("path")
    .attr("class", "radarStroke")
    .attr("d", function(d) { return radarLine(d); })
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", function(d, i) { return cfg.color(i); })
    .style("fill", "none")
    .style("filter", "url(#glow)");

  // Draw the dots
  blobWrapper.selectAll(".radarCircle")
    .data(function(d) { return d; })
    .enter()
    .append("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr("cx", function(d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
    .attr("cy", function(d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
    .style("fill", cfg.dotColor)
    .style("fill-opacity", 0.8);

  var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
    .data(data)
    .enter().append("g")
    .attr("class", "radarCircleWrapper");

  // Append invisible circles for tooltip
  blobCircleWrapper.selectAll(".radarInvisibleCircle")
    .data(function(d) { return d; })
    .enter().append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", cfg.dotRadius * 1.5)
    .attr("cx", function(d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
    .attr("cy", function(d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function(event, d) {
      var newX = parseFloat(d3.select(this).attr("cx")) - 10;
      var newY = parseFloat(d3.select(this).attr("cy")) - 10;
      tooltip
        .attr("x", newX)
        .attr("y", newY)
        .text(Format(d.value))
        .transition().duration(200)
        .style("opacity", 1);
    })
    .on("mouseout", function() {
      tooltip.transition().duration(200)
        .style("opacity", 0);
    });

  // Setup tooltip
  var tooltip = g.append("text")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("font-size", cfg.tooltipFontSize)
    .style("font-weight", "bold")
    .style("fill", cfg.tooltipColor);

  return svg.node();
}

```

```js
preparedData ? RadarChart(preparedData, radarChartOptions): "No data to show"
```
  

**Fuente de Datos:** Inside Airbnb.com [Inside Airbnb](https://insideairbnb.com/get-the-data/)