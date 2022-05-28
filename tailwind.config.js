const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./page-src/**/*.{html,js,org}', './site-assets/**/*.js'],
  theme: {
    fontFamily: {
      sans: ['Inter var', 'Inter', ...defaultTheme.fontFamily.sans],
      serif: [
        'Newsreader',
        'Iowan Old Style',
        'Apple Garamond',
        'Baskerville',
        'Droid Serif',
        ...defaultTheme.fontFamily.serif,
      ],
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
        'primary-color': {
          500: '#66a7b7',
          700: '#5d93a0',
          900: '#0081a7',
        },
        palette: {
          grayish: '#dfd5ca',
          nutty: {
            light: '#fed9b7',
            dark: '#d1b79b',
          },
        },
        'content-color': {
          900: '#202e4c',
          700: '#2a3d67',
          500: '#344c82',
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
