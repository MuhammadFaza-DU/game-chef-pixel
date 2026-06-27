/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palet PRD: bold primaries
        chaos: {
          red: '#FF4757',
          yellow: '#FFD93D',
          blue: '#4D96FF',
          ink: '#1A1A2E',
        },
      },
      fontFamily: {
        comic: ['"Comic Sans MS"', 'Baloo', 'cursive'],
        pixel: ['"PressStart2P"', 'monospace'],
        game: ['"Monogram"', 'monospace'],
      },
    },
  },
  plugins: [],
};
