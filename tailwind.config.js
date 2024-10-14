/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
      customPurple: '#9395D3',
      customPurpleLight:'#D6D7EF',
      customPurpleDark:'#7477CB'
    },},
  },
  plugins: [],
}