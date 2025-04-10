export default {
  plugins: {
    'autoprefixer': {},
    'postcss-nested': {},
    'chao-mobile-forever': {
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
