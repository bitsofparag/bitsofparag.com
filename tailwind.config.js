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
      hero: '4.8rem',
      display: '4.2rem',
      h1: '3.2rem',
      h2: '2.6rem',
      h3: '2.6rem',
      h4: '2.1rem',
      'button-text': '26px',
      body: '1.6875rem',
      'body-blog': '1.875rem',
      info: '1.125rem',
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
        'primary-color': { /* Same as palette.pflaume */
          500: '#7c5480',
          700: '#4e3455',
          900: '#47284f',
        },
        'primary-color-darkmode': { /* minty green color */
          500: '#b5fcc5',
          700: '#bef7ca',
          900: '#b8efc4',
        },
        palette: {
          grayish: '#dfd5ca',
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
          }
        },
        'content-color': {
          900: '#202e4c',
          700: '#2a3d67',
          500: '#344c82',
        },
        'content-color-darkmode': {
          900: '#f5ffc9',
          700: '#f5ffc9',
          500: '#f5ffc9',
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
