/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/*.js"],
  theme: {
    extend: {
      fontFamily: {
        gothic: ['Cinzel', 'serif'],
        sans: ['Oswald', 'sans-serif'],
      },
      colors: {
        ton: {
          green: '#2ecc71',
          darkGreen: '#1b4d3e',
          black: '#0a0a0a',
          gray: '#1a1a1a',
        }
      }
    },
  },
  plugins: [],
}
