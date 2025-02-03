module.exports = {
  content: ['./**/*.{html,js,ts}', '!./node_modules/**/*'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#84A8A4', //green
        secondary: '#D56651', //orange
        accent: '#968CAC', // lilac dark
        background: '#F0E2C7', //beidge
        light: '#F5F5F2', // whitesh
        dark: '#000000', // black
        muted: '#B2A3D2', // lilac
        grayish: '#B7B7B7', // grey
        sepia: '#D58F51', // light orange
        olive: '#A9AC81', //olive
      },
      fontFamily: {
        body: ['Roboto', 'sans-serif'],
        heading: ['Lily Script One', 'cursive'],
        secondary: ['Istok Web', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
