module.exports = {
  plugins: [
    ["hack-mobile-forever", {
      viewportWidth: 750,
      maxDisplayWidth: 520,
      appSelector: "#root",
      side: {
        selector1: ".footer",
      },
      experimental: {
        minDisplayWidth: 300,
      },
    }],
  ],
};