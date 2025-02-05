module.exports = {
  content: ['./**/*.{html,js,ts}', '!./node_modules/**/*'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#84A8A4', // green
        secondary: '#D56651', // orange
        accent: '#968CAC', // lilac dark
        background: '#F0E2C7', // beige
        light: '#F5F5F2', // whitish
        dark: '#000000', // black
        muted: '#B2A3D2', // lilac
        grayish: '#B7B7B7', // grey
        sepia: '#D58F51', // light orange
        olive: '#A9AC81', // olive
      },
      fontFamily: {
        body: ['Roboto', 'sans-serif'],
        heading: ['Lily Script One', 'cursive'],
        secondary: ['Istok Web', 'sans-serif'],
      },
      backgroundImage: {
        'btn-gradient': 'linear-gradient(90deg, #A9AC81 0%, #D56651 100%)', 
        'btn-alt-gradient':
          'linear-gradient(90deg, #84A8A4 0%, #F0E2C7 50.5%, #344240 100%)', 
      },
    },
  },
  plugins: [],
};
