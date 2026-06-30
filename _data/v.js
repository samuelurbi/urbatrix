// Sello de build para cache-busting de los assets locales (CSS/JS).
// Eleventy lo recalcula en cada (re)build, así el navegador siempre baja la
// versión nueva (?v=...) en lugar de servir una cacheada vieja.
module.exports = () => Date.now();
