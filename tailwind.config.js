const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    fontFamily: {
      display: ['Inter var', 'sans-serif'],
      heading: ['Inter var', 'sans-serif'],
      text: ['Inter var', 'sans-serif'],
      blog: ['Inter var', 'sans-serif']
    },
    fontSize: {
      'display': '4rem',
      'h1': '2.6rem',
      'h2': '2rem',
      'h3': '1.3rem',
      'h4': '1.1rem',
      'button-text': '2.2rem',
      'body': '0.94rem',
      'body2': '1.05rem',
      'body-large': '1.325rem',
      'info': '0.82rem',
      'small': '0.7rem',
    },
    container: {
      center: false,
      padding: '1.5rem',
    },
    lineHeight: {
      'display': '4.6rem',
      'h1': '3.2rem',
      'h2': '2.6rem',
      'h3': '1.8rem',
      'h4': '1.625rem',
      'button-text': '26px',
      'body': '1.5rem',
      'body2': '1.85rem',
      'body-large': '2rem',
      'info': '1.125rem',
    },
    // extend
    extend: {
      borderRadius: {
        button: 'none',
      },
      colors: {
        'primary': {
          ...colors.teal
        },
        'text': {
          ...colors.gray
        }
      },
    },
  },
  variants: {
    listStyleType: ['responsive', 'hover', 'focus'],
  },
  plugins: [],
};
