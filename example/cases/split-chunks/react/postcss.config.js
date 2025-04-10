const isProdMode = process.env.NODE_ENV === "production";

module.exports = {
  plugins: {
    "hack-mobile-forever": {
      viewportWidth: 750,
      enableMediaQuery: true,
      desktopWidth: 600,
      landscapeWidth: 450,
      border: true,
      appSelector: ".root-class",
      demoMode: true,
      side: {
        selector1: ".footer",
      },
      experimental: {
        extract: isProdMode,
      },
    },
  },
};