/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#0d0415',
        'accent': '#161518',
        'secondary': '#7F7F7F',
        'offWhite': '#BFBFBF'
      }
    },
  },
  plugins: [],
}