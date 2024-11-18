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
      scheme: "reds",
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
  neighborhoodCount = new Map(
    Array.from(neighborhoodCount.entries())
        .map(([key, value]) => [key, Math.log(value + 1)]));

const minCount = d3.min(Array.from(neighborhoodCount.values()));
const maxCount = d3.max(Array.from(neighborhoodCount.values()));

```

```js
plotDensityMap(geoNeighborhoods, neighborhoodCount, "Densidad por barrio (escala log)", [minCount, maxCount])
```
```js
const neighborhoodOcuppancy = d3.rollup(filteredData, 
    v => {
        const avgReviewsPerMonth = d3.mean(v, d => d.reviewsPerMonth);
        return avgReviewsPerMonth ? ((avgReviewsPerMonth / 0.50 / 30) * 100).toFixed(2) : 0;
    },
    d => d.neighborhood
);
```

```js
plotDensityMap(geoNeighborhoods, neighborhoodOcuppancy, "Ocupación por barrio (%)", [0,14.20])
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
      domain: [0, d3.quantile(data, 0.98, d => d.price)]  // Removing outliers
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