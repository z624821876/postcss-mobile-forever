export default {
  plugins: {
    'autoprefixer': {},
    'postcss-nested': {},
    'hack-mobile-forever': {
      viewportWidth: 375,
      maxDisplayWidth: 600,
      border: true,
      mobileUnit: "rem",
      rootContainingBlockSelectorList: [
        'van-popup',
      ],
    },
  },
}
