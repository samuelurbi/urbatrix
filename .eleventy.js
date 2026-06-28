module.exports = function (eleventyConfig) {
  // Archivos estáticos: se copian tal cual al output (no se procesan).
  [
    "assets",
    "globals.css",
    "styleguide.css",
    "style.css",
    "illustrations.css",
    "cards.css",
    "script.js",
  ].forEach((path) => eleventyConfig.addPassthroughCopy(path));

  // Generar canonical automáticamente desde el page.url
  eleventyConfig.addFilter("canonicalUrl", (url) => {
    const baseUrl = "https://urbatrix.com";
    return url === "/" ? baseUrl + "/" : baseUrl + url;
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
