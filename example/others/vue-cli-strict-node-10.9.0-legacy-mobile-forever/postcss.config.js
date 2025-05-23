module.exports = {
  plugins: [
    require("chao-mobile-forever")({
      viewportWidth: 750,
      desktopWidth: 600,
      landscapeWidth: 450,
      border: true,
      rootSelector: ".app-inner-root",
      demoMode: true,
      side: {
        selector1: ".footer",
      }
    }),
  ],
};