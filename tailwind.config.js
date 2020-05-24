const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    fontFamily: {
      heading: ['Inter', 'sans-serif'],
      text: ['Inter', 'sans-serif'],
      blog: ['Inter', 'sans-serif']
    },
    fontSize: {
      'h1': '4.6rem',
      'h2': '3.6rem',
      'h3': '2.8rem',
      'h4': '2.2rem',
      'button-text': '2.2rem',
      'body': '1rem',
      'body2': '1.125rem',
      'body-large': '1.325rem',
      'info': '0.85rem',
      'small': '0.7rem',
    },
    container: {
      center: false,
      padding: '1.5rem',
    },
    lineHeight: {
      'h1': '2.6rem',
      'h2': '2.2rem',
      'h3': '1.8rem',
      'h4': '1.625rem',
      'button-text': '26px',
      'body': '1.6rem',
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
