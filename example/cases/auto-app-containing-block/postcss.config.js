module.exports = {
  plugins: [
    ["chao-mobile-forever", {
      viewportWidth: 750,
      maxDisplayWidth: 600,
      appSelector: "#root",
      appContainingBlock: "auto",
      necessarySelectorWhenAuto: "body",
    }],
  ],
};