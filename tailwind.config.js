const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./page-src/**/*.{html,js,org}', './site-assets/**/*.js'],
  theme: {
    fontFamily: {
      sans: ['Inter var', 'Inter', ...defaultTheme.fontFamily.sans],
      serif: ['Newsreader', ...defaultTheme.fontFamily.serif],
    },
    fontSize: {
      hero: '5rem',
      display: '3.6rem',
      h1: '2.4rem',
      h2: '1.8rem',
      h3: '1.4rem',
      h4: '1.1rem',
      'button-text': '2.2rem',
      body: '1rem',
      'body-large': '1.325rem',
      'body-blog': '1.125rem',
      info: '0.82rem',
      small: '0.7rem',
    },
    container: {
      center: false,
      padding: '1.5rem',
    },
    lineHeight: {
      display: '4.6rem',
      h1: '3.2rem',
      h2: '2.6rem',
      h3: '1.8rem',
      h4: '1.625rem',
      'button-text': '26px',
      body: '1.7rem',
      'body-large': '2rem',
      'body-blog': '1.8rem',
      info: '1.125rem',
    },
    // extend
    extend: {
      listStyleType: {
        square: 'square',
      },
      borderRadius: {
        button: 'none',
      },
      colors: {
        'primary-color': {
          ...colors.teal,
        },
        'content-color': {
          ...colors.gray,
        },
      },
    },
  },
  variants: {
    listStyleType: ['responsive', 'hover', 'focus'],
  },
  plugins: [],
};
