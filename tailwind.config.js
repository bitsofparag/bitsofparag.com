const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./page-src/**/*.{html,js}', './site-assets/**/*.js'],
  theme: {
    fontFamily: {
      display: ['Inter var', ...defaultTheme.fontFamily.sans],
      heading: ['Inter var', ...defaultTheme.fontFamily.sans],
      text: ['Inter var', ...defaultTheme.fontFamily.sans],
      blog: ['Newsreader', ...defaultTheme.fontFamily.serif],
    },
    fontSize: {
      display: '4rem',
      h1: '2.6rem',
      h2: '2rem',
      h3: '1.3rem',
      h4: '1.1rem',
      'button-text': '2.2rem',
      body: '0.94rem',
      body2: '1.05rem',
      'body-large': '1.325rem',
      'body-blog': '1.2rem',
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
      body: '1.5rem',
      body2: '1.85rem',
      'body-large': '2rem',
      'body-blog': '1.75rem',
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
