---
title: Datos Generales
toc: false
---

# Datos generales 🚀

Aquí puedes explorar estadísticas generales de Airbnb en Capital Federal. Utiliza los filtros para profundizar en diferentes aspectos de los alojamientos.

## Filtros

- **Multi-select de barrio**: Selecciona uno o varios barrios.
- **Room Type**: Filtra por tipos de habitación (entera, privada, compartida, hotel).
- **Checkbox**: Solo alojamientos de corto plazo (short-term rentals).
- **Slider de Precio**: Ajusta el rango de precios para visualizar alojamientos dentro de tu presupuesto.

## Resumen de Datos

<div class="grid grid-cols-4 gap-4">
  <div class="card">
    <h2>Buenos Aires 🇦🇷</h2>
    <span class="big">Total de Listados: <b>20,000</b></span>
  </div>
  <div class="card">
    <h2>Ingresos Totales 💸</h2>
    <span class="big">En los últimos X meses: <b>$3,000,000</b></span>
  </div>
  <div class="card">
    <h2>Health Index 📊</h2>
    <span class="big">Tasa de Ocupación: <b>65%</b></span>
  </div>
  <div class="card">
    <h2>Alojamientos Corto Plazo 📆</h2>
    <span class="big">4,500</span>
  </div>
</div>

### Distribución de tipos de habitaciones

Gráfico de barras interactivo que muestra la distribución de tipos de habitación (entera, privada, compartida, hotel). Usa la biblioteca **Plot** para permitir la selección y visualización dinámica.

### Mapa de Calor Interactivo de Capital Federal

Mapa interactivo de **Leaflet** que muestra la densidad de alojamientos por barrio, codificado por color según el número de listados. Permite el filtrado por barrio y rango de precio.

### Ocupación a través del tiempo

Gráfico de área apilada que muestra la ocupación a lo largo del tiempo, segmentado por tipo de habitación. Añade una animación que ilustre la evolución mensual de la tasa de ocupación para destacar tendencias.

### Short-term Rentals

Gráfico circular (pie chart) de **Plot** que muestra la proporción de alojamientos de corto plazo (short-term) frente a los de largo plazo. Los colores codifican las dos categorías para una fácil visualización.

### Distribución de precios por tipo de habitación y barrio

**Boxplot** que muestra la distribución de precios por tipo de habitación y barrio. Ayuda a identificar la mediana, cuartiles y valores atípicos, proporcionando un análisis detallado de la variabilidad de precios.

### Distribución de listings por Host

Histograma interactivo de **Plot** que muestra la cantidad de listings por host, con la opción de resaltar hosts con múltiples propiedades. Este gráfico es ideal para identificar si hay un pequeño grupo de hosts que posee la mayoría de los listados.

### Ingresos por Barrio

**Treemap** que representa los ingresos totales por barrio. Los rectángulos están codificados por el tamaño proporcional a los ingresos generados, permitiendo identificar los barrios más rentables de un vistazo.

### Relación Precio vs. Ocupación

Diagrama de dispersión de **Plot** que muestra la relación entre el precio por noche y la tasa de ocupación, con la opción de filtrar por tipo de habitación y barrio. Los puntos se codifican por color según el tipo de habitación.

### Flujos de Hosts a Tipos de Propiedades

Gráfico de **Sankey** que muestra la relación entre los hosts y los tipos de propiedades que poseen, revelando cómo se distribuyen sus listados y si se especializan en un solo tipo de alojamiento o en varios.

---

**Fuente de Datos:** Inside Airbnb.com [Inside Airbnb](https://insideairbnb.com/get-the-data/)