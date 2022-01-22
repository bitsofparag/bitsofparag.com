module.exports = {
  plugins: [
    require('postcss-import')({}),
    //require('postcss-url')({ url: 'copy', useHash: true }),
    require('tailwindcss'),
    require('autoprefixer'),
    require('@fullhuman/postcss-purgecss')({
      content: ['./**/*.html'],
    }),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
