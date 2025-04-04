// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0f7',
          100: '#cce0ef',
          200: '#99c2df',
          300: '#66a3cf',
          400: '#3385bf',
          500: '#0064a4', // Azul oscuro principal (color predominante del logo)
          600: '#005389',
          700: '#00436e',
          800: '#003252',
          900: '#001a29',
        },
        secondary: {
          50: '#fff8e6',
          100: '#feefc3',
          200: '#fde59f',
          300: '#fcdb7c',
          400: '#fbd159',
          500: '#f9c642', // Mostaza (como en el logo)
          600: '#e5a922',
          700: '#b37d18',
          800: '#805910',
          900: '#4d3506',
        },
        accent: {
          teal: '#1ca3a0', // Color turquesa/cian del logo
        }
      }
    },
  },
  plugins: [],
}