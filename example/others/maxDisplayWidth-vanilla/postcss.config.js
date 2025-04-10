module.exports = {
  plugins: [
    ["hack-mobile-forever", {
      viewportWidth: 750,
      maxDisplayWidth: 520,
      appSelector: "#root",
      border: true,
      side: {
        selector1: ".footer",
      },
    }],
  ],
};