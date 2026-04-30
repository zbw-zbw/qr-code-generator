/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#667eea',
          violet: '#764ba2',
          green: '#11998e',
          mint: '#38ef7d',
          pink: '#ec4899',
          lavender: '#a855f7',
        }
      }
    },
  },
  plugins: [],
} 
