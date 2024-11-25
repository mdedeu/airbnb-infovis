---
title: Grupo 3 - Infovis
toc: false
---

<div class="hero">
  <h1>Airbnb CABA</h1>
  <h2>Trabajo Práctico Grupal para la materia 72.74 - Visualización de Información</h2>
</div>

---

## Integrantes del Trabajo Práctico

<div class="team-container">
  <div class="team-member">
    <h3>Marcos Diego Dedeu</h3>
    <p>Ingeniería en Informática</p>
  </div>
  <div class="team-member">
    <h3>Lucía Zapata</h3>
    <p>Licenciatura en Analítica</p>
  </div>
  <div class="team-member">
    <h3>Lucero Arleo</h3>
    <p>Licenciatura en Negocios</p>
  </div>
</div>

---
<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

.team-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 4rem 0;
}

.team-member {
  text-align: center;
  font-family: var(--sans-serif);
}

.team-member img {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  margin-bottom: 1rem;
  border: 2px solid var(--theme-foreground);
  object-fit: cover;
}

.team-member h3 {
  margin: 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--theme-foreground);
}

.team-member p {
  margin: 0;
  font-size: 1rem;
  color: var(--theme-foreground-muted);
}

</style>
