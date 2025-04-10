module.exports = {
  plugins: [
    ["hack-mobile-forever", {
      viewportWidth: 750,
      desktopWidth: 600,
      landscapeWidth: 450,
      border: true,
      disableMobile: true,
      rootClass: "root-class",
    }],
    ["postcss-px-to-viewport", {
      viewportWidth: 750,
      viewportUnit: "vw",
      mediaQuery: false,
    }],
  ],
};