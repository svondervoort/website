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
      'primary': '#DCA7A7',
      'black': '#111214',
      'grey': '#888889',
      'white': '#FFFFFF',
    },
    fontFamily: {
      'display': ['Major Mono Display', 'monospace'],
      'mono': ['JetBrains Mono', 'monospace'],
    },
  },
  plugins: [],
};
