/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      "green-500": "#2F4541",
      "green-300": "#5A7671",
      white: "#FFFFFF",
      // Also the game's accent, hardcoded in lib/game/index.js — canvas cannot read
      // Tailwind's theme, so the two have to be kept in step by hand.
      accent: "#FFDD00",
    },
    fontFamily: {
      mono: ["JetBrains Mono", "monospace"],
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '.5rem',
      '3': '.75rem',
      '4': '1rem',
      '6': '1.75rem',
      '8': '2rem',
    },
    boxShadow: {
      'switch': '0 0 8px 0 rgba(255, 221, 0, 0.4)',
    }
  },
  plugins: [],
};
