/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'primary': '#0fa76a',
      'secondary': '#252a05',
    },
    extend: {
      fontFamily: {
        'sans': ['Fira Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#0fa76a',
            a: {
              color: '#0fa76a',
              '&:hover': {
                color: '#0fa76a',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
