const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const palette = {
  crimson: {
    dark: '#8c0000',
    light: '#c62828',
  },
  amber: {
    900: '#e48000',
    400: '#f9a825',
  },
  charcoal: {
    dark: '#2e2e2e',
    light: '#4a4a4a',
  },
  grayish: '#dfd5ca',
  mustard: {
    dark: '#DAA520',
    light: '#CFB53B',
  },
  teal: {
    dark: '#008B8B',
    light: '#00CED1',
  },
  nutty: {
    light: '#dbd7d7',
    dark: '#bbb7b7',
  },
  pflaume: {
    light: '#7c5480',
    dark: '#4e3455',
    darker: '#47284f',
  },
  mint: {
    light: '#b5fcc5',
    dark: '#bef7ca',
    darker: '#b8efc4',
  },
  blue: {
    light: '#202e4c',
    dark: '#2a3d67',
    darker: '#344c82',
  },
  yellowGreen: {
    light: '#f5ffc9',
    dark: '#e4f5c9',
    darker: '#d3efc9',
  },
  white: '#fff',
  cream: '#f7f6e1',
};

module.exports = {
  content: ['./page-src/**/*.{html,js,org}', './site-assets/**/*.js'],
  theme: {
    fontFamily: {
      sans: ['Inter var', 'Inter', ...defaultTheme.fontFamily.sans],
      serif: ['Newsreader', ...defaultTheme.fontFamily.serif],
    },
    fontSize: {
      hero: '4rem',
      display: '3.6rem',
      h1: '2.4rem',
      h2: '1.8rem',
      h3: '1.8rem',
      h4: '1.5rem',
      'button-text': '2.2rem',
      body: '1rem',
      'body-blog': '1.125rem',
      info: '0.82rem',
      small: '0.7rem',
      logo: '4.6rem',
      'logo-small': '1.95rem',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        md: '4rem',
        lg: '6rem',
        xl: '6rem',
        '2xl': '6rem',
      },
    },
    lineHeight: {
      hero: '5.8rem',
      display: '5.4rem',
      h1: '4.2rem',
      h2: '3.6rem',
      h3: '3.6rem',
      h4: '3.3rem',
      'button-text': '26px',
      body: '1.825rem',
      'body-blog': '2rem',
      info: '1.5rem',
      none: 1,
    },
    // extend
    extend: {
      listStyleType: {
        square: 'square',
      },
      borderRadius: {
        button: 'none',
        half: '50%',
      },
      colors: {
        ...palette,
        'primary-color': {
          400: palette.pflaume.light,
          700: palette.pflaume.dark,
          900: palette.pflaume.darker,
        },
        'primary-color-darkmode': {
          400: palette.mint.light,
          700: palette.mint.dark,
          900: palette.mint.darker,
        },
        'content-color': {
          400: palette.pflaume.light,
          700: palette.pflaume.dark,
          900: palette.pflaume.darker,
        },
        'content-color-darkmode': {
          400: palette.white,
          700: palette.white,
          900: palette.white,
        },
        'link-color': {
          700: palette.teal.light,
          900: palette.teal.dark,
        },
        'link-color-darkmode': {
          700: palette.mustard.light,
          900: palette.mustard.dark,
        },
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
      },
    },
  },
  variants: {
    listStyleType: ['responsive', 'hover', 'focus'],
  },
  plugins: [],
};
