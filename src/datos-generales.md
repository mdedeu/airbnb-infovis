---
title: Datos Generales
toc: false
---

# Datos generales 🚀

Aquí puedes explorar estadísticas generales de Airbnb en Capital Federal. Utiliza los filtros para profundizar en diferentes aspectos de los alojamientos.

## Filtros
```js
let data = await FileAttachment('./data/listings.csv').csv({typed: true});
```

```js
const neighborhoods = await FileAttachment('./data/neighborhoods.csv').csv({ typed: true })
let neighborhoodSelected = view(Inputs.select(["Todos", ...Array.from(new Set(neighborhoods.map(d => d.neighborhood).filter(Boolean)))],
  { label: "Selecciona un barrio" }
))
```
```js
let short_stay = view(Inputs.checkbox(["Solo alojamientos de corto plazo (menos de 15 días)"]));
```
```js
let minSlider = d3.min(data, d => +d.price);
let maxSlider = d3.max(data, d => +d.price);
let minPrice = minSlider;
let maxPrice = maxSlider;

minPrice = view(Inputs.range([minSlider, maxSlider ], {step: 1, format: x => x.toFixed(0), label: "Precio mínimo", value: minSlider}));
maxPrice = view(Inputs.range([minSlider, maxSlider ], {step: 1, format: x => x.toFixed(0), label: "Precio máximo", value: maxSlider}));
```

```js
let filteredData = data;
if(short_stay && short_stay.length > 0){
  filteredData = filteredData.filter(d => d.minimumNights <= 15 )
}
filteredData = filteredData.filter(d => d.price >= minPrice && d.price <= maxPrice)
if(neighborhoodSelected != 'Todos'){
  filteredData  = filteredData.filter(d => d.neighborhood == neighborhoodSelected)
}
const selectedNeighborhood = neighborhoodSelected == 'Todos' ? "Buenos Aires": neighborhoodSelected;
```
## Resumen de Datos

<div class="grid grid-cols-4 gap-4">
  <div class="card">
    <h2>Total de listados en ${selectedNeighborhood} 🇦🇷</h2>
    <span class="big"><b>${filteredData.length}
</b></span>
  </div>
  <div class="card">
    <h2>Dinero gastado en Airbnbs de ${selectedNeighborhood} 💸</h2>
    <span class="big"><b>${d3.sum(filteredData, item => (item.price * item.numberOfReviews)).toLocaleString("en-US", {style: "currency", currency: "USD"})} USD</b></span>
  </div>
  <div class="card">
    <h2>Ocupación de Airbnbs del último año de ${selectedNeighborhood} 📊</h2>
    <span class="big"><b>${(d3.mean(filteredData, d => d.reviewsPerMonth / 0.50 / 30) * 100).toFixed(2)} %</b></span>
  </div>
</div>

```js 
const geoNeighborhoods = await FileAttachment('./data/geo_neighborhoods.json').json()
function plotDensityMap(geoNeighborhoods, data, title, domain) {
  const width = 800;
  const height = 610;
  const projection = d3.geoMercator();
  projection.fitExtent([[0, 0], [width, height]], geoNeighborhoods);
 
  return Plot.plot({
    title: title,
    projection,
    width,
    height,
    color: {
      legend: true,
      scheme: "ylorrd",
      domain: domain
    },
    marks: [
      Plot.geo(geoNeighborhoods, {
        stroke: "black",
        strokeWidth: 1,
        fill: d => data.get(d.properties.neighbourhood) || 0,
        title: d => {
          const stats = data.get(d.properties.neighbourhood);
          const count = stats ? stats : 0;
          return `Barrio: ${d.properties.neighbourhood}\nNúmero de propiedades: ${count}`;
        },
        tip: true
      })
    ]
  });
}
```

```js
 let neighborhoodCount = d3.rollup(filteredData, 
    v => v.length,  
    d => d.neighborhood
  );
let minCount = d3.min(Array.from(neighborhoodCount.values()));
const maxCount = d3.max(Array.from(neighborhoodCount.values()));
if(minCount == maxCount){
  minCount = 0;
}
```

# Mapa de precio
```js
// Import required deck.gl components
import deck from "npm:deck.gl";

const {DeckGL, AmbientLight, GeoJsonLayer, LightingEffect, PointLight, ColumnLayer} = deck;

// Create main container for both map and legend
const mainContainer = document.createElement('div');
mainContainer.style.position = 'relative';

// Create container div for the map
const container = document.createElement('div');
container.style.height = '600px';
container.style.width = '100%';
container.style.position = 'relative';
container.style.borderRadius = '8px';
container.style.overflow = 'hidden';

// Create legend container
const legendContainer = document.createElement('div');
legendContainer.style.position = 'absolute';
legendContainer.style.bottom = '500px';
legendContainer.style.right = '20px';
legendContainer.style.padding = '10px';
legendContainer.style.borderRadius = '4px';
legendContainer.style.zIndex = '1000';
legendContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

// Create gradient bar
const gradientBar = document.createElement('div');
gradientBar.style.width = '200px';
gradientBar.style.height = '20px';
gradientBar.style.background = 'linear-gradient(to right, rgb(0, 255, 0), rgb(255, 255, 0), rgb(255, 0, 0))';
gradientBar.style.marginBottom = '5px';
gradientBar.style.borderRadius = '2px';

// Create labels container
const labelsContainer = document.createElement('div');
labelsContainer.style.display = 'flex';
labelsContainer.style.justifyContent = 'space-between';
labelsContainer.style.fontSize = '12px';


// Add labels
labelsContainer.innerHTML = `
  <span>$${minSlider.toLocaleString()}</span>
  <span>$${Math.floor((minSlider + maxSlider) / 2).toLocaleString()}</span>
  <span>$${maxSlider.toLocaleString()}</span>
`;

// Assemble legend
legendContainer.appendChild(document.createElement('div')).textContent = 'Rango de precio';
legendContainer.appendChild(gradientBar);
legendContainer.appendChild(labelsContainer);

// Create lighting effect for 3D visualization
const effects = [
  new LightingEffect({
    ambientLight: new AmbientLight({
      color: [255, 255, 255],
      intensity: 1.0
    }),
    pointLight: new PointLight({
      color: [255, 255, 255],
      intensity: 2.0,
      position: [-74.05, -34.61, 8000]
    })
  })
];

// Initial view state centered on Buenos Aires
const initialViewState = {
  longitude: -58.3816,
  latitude: -34.6037,
  zoom: 10,
  pitch: 45,
  bearing: 0
};

// Function to normalize price to a reasonable height
const normalizeHeight = (price) => {
  return ((price - minSlider) / (maxSlider - minSlider)) * 1000 + 100;
};

// Create the deck.gl instance
const deckInstance = new DeckGL({
  container,
  initialViewState,
  controller: true,
  effects
});

// Clean up if code re-runs
invalidation.then(() => {
  deckInstance.finalize();
  container.innerHTML = "";
});

// Set up the visualization layers
deckInstance.setProps({
  layers: [
    // Base map layer with Buenos Aires GeoJSON
    new GeoJsonLayer({
      id: 'base-map',
      data: geoNeighborhoods,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 1,
      getLineColor: [255, 255, 255, 100],
      getFillColor: [38, 38, 38]
    }),
    // Listings layer using ColumnLayer for 3D columns
    new ColumnLayer({
      id: 'listings',
      data: filteredData,
      diskResolution: 12,
      radius: 25,
      extruded: true,
      pickable: true,
      elevationScale: 1,
      getPosition: d => [d.longitude, d.latitude],
      getFillColor: d => {
        const priceRatio = (d.price - minSlider) / (maxSlider - minSlider);
        return [
          255 * priceRatio,    // Red component
          255 * (1 - priceRatio), // Green component
          0                    // Blue component
        ];
      },
      getLineColor: [0, 0, 0],
      getElevation: d => normalizeHeight(d.price),
      updateTriggers: {
        getFillColor: [minSlider, maxSlider],
        getElevation: [minSlider, maxSlider]
      },
    })
  ]
});

// Assemble main container
mainContainer.appendChild(container);
mainContainer.appendChild(legendContainer);
```

```js
mainContainer
```

```js
plotDensityMap(geoNeighborhoods, neighborhoodCount, "Densidad de listings por barrio", [minCount, maxCount])
```
# Cálculo de ocupación estimada
```js
import tex from "npm:@observablehq/tex";
```
```tex
\mathbf{\text{Estimación de bookings en los últimos 12 meses} = \frac{\text{<numberOfReviewsLTM>}}{0.55}}
\\[12pt]
\mathbf{\text{Tasa de Ocupación en los últimos 12 meses } = \frac{\text{numberOfBookings}}{365}}
```
```js
const neighborhoodOcuppancy = d3.rollup(filteredData, 
    v => {
        if (v.length >= 2) {
            const avgReviewsPerMonth = d3.mean(v, d => d.reviewsPerMonth);
            return avgReviewsPerMonth ? ((avgReviewsPerMonth / 0.50 / 30) * 100).toFixed(2) : 0;
        } else {
            return 0; // Return null for groups with less than 2 elements
        }
    },
    d => d.neighborhood
);
```

```js
plotDensityMap(geoNeighborhoods, neighborhoodOcuppancy, "Ocupación estimada media por barrio (%)", [0,14.20])
```

```js
function plotPriceVsOccupancy(data) {
  // Calculate occupancy rate for each point
  const points = data.map(d => ({
    price: d.price,
    name: d.name,
    occupancy: (d.reviewsPerMonth / 0.5 / 30) * 100,
    neighborhood: d.neighborhood
  }));

  return Plot.plot({
    width: 800,
    height: 500,
    grid: true,
    title: "Relación Precio vs. Ocupación",
    x: {
      label: "Precio por noche ($)",
      domain: [0, d3.quantile(data, 0.98, d => d.price)]
    },
    y: {
      label: "Tasa de ocupación (%)",
      domain: [0, 90]
    },
    marks: [
      Plot.dot(points, {
        x: "price",
        y: "occupancy",
        fill: "neighborhood",
        opacity: 0.5,
        title: d => `${d.name}, ${d.neighborhood}\nPrecio: $${d.price}\nOcupación: ${d.occupancy.toFixed(1)}%`,
        tip: true
      }),
      Plot.linearRegressionY(points, {
        x: "price",
        y: "occupancy",
        stroke: "red",
        strokeWidth: 2
      }),
    ],
    color: {
      legend: true
    }
  });
}
```

```js
plotPriceVsOccupancy(filteredData)
```



---
**Fuente de Datos:** Inside Airbnb.com [Inside Airbnb](https://insideairbnb.com/get-the-data/)