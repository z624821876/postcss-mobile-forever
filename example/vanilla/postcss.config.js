module.exports = {
  plugins: [
    ["hack-mobile-forever", {
      viewportWidth: 750,
      appSelector: "#root",
      enableMediaQuery: true,
      demoMode: true,
      side: {
        selector1: ".footer",
      }
    }],
  ],
};