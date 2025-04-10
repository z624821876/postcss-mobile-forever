module.exports = {
  plugins: [
    ["chao-mobile-forever", {
      viewportWidth: 750,
      maxDisplayWidth: 600,
      appSelector: ".root-class",
      appContainingBlock: "manual",
      selectorBlackList: ["#app-containing-block", ".root-class"]
    }],
  ],
};