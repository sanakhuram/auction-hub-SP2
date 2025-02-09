/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,js,ts}', '!./node_modules/**/*'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#84A8A4', // ✅ Green
        secondary: '#D56651', // ✅ Orange
        accent: '#968CAC', // ✅ Lilac dark
        background: '#F0E2C7', // ✅ Beige
        light: '#F5F5F2', // ✅ Whitish
        dark: '#000000', // ✅ Black
        muted: '#B2A3D2', // ✅ Lilac
        grayish: '#B7B7B7', // ✅ Grey
        sepia: '#D58F51', // ✅ Light Orange
        olive: '#A9AC81', // ✅ Olive
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
      transitionProperty: {
        transform: 'transform',
        background: 'background',
        opacity: 'opacity',
      },
      scale: {
        110: '1.1',
        120: '1.2',
      },
      borderRadius: {
        xl: '1.5rem',
        '2xl': '2rem',
      },
      boxShadow: {
        soft: '0 4px 6px rgba(0, 0, 0, 0.1)',
        strong: '0 10px 20px rgba(0, 0, 0, 0.3)',
        primary: '0 4px 6px rgba(132, 168, 164, 0.5)', // ✅ Green shadow
        secondary: '0 4px 6px rgba(213, 102, 81, 0.5)', // ✅ Orange shadow
        accent: '0 4px 6px rgba(150, 140, 172, 0.5)', // ✅ Lilac shadow
        dark: '0 4px 6px rgba(0, 0, 0, 0.6)', // ✅ Black shadow for dark mode
        whiteGlow: '0 4px 6px rgba(255, 255, 255, 0.8)', // ✅ White glow shadow
        neonBlue: '0 0 15px rgba(0, 195, 255, 0.8)', // ✅ Neon Blue Glow
        insetDark: 'inset 0 4px 6px rgba(0, 0, 0, 0.6)', // ✅ Inset Dark Shadow
      },
    },
  },
  plugins: [],
};
