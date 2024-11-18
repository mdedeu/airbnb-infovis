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


### Distribución de listings por Host

Histograma interactivo de **Plot** que muestra la cantidad de listings por host, con la opción de resaltar hosts con múltiples propiedades. Este gráfico es ideal para identificar si hay un pequeño grupo de hosts que posee la mayoría de los listados.

### Ingresos por Barrio

**Treemap** que representa los ingresos totales por barrio. Los rectángulos están codificados por el tamaño proporcional a los ingresos generados, permitiendo identificar los barrios más rentables de un vistazo.

### Relación Precio vs.Ocupación

Diagrama de dispersión de **Plot** que muestra la relación entre el precio por noche y la tasa de ocupación, con la opción de filtrar por barrio.

---

**Fuente de Datos:** Inside Airbnb.com [Inside Airbnb](https://insideairbnb.com/get-the-data/)