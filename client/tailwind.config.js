/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        palette: {
          sand: '#C1AE7C',
          bubblegum: '#E16F7C',
          peony: '#DD5E98',
          orchid: '#CC4BC2',
          blackberry: '#6C3A5C',
        },
        sand: '#C1AE7C',
        bubblegum: '#E16F7C',
        peony: '#DD5E98',
        orchid: '#CC4BC2',
        blackberry: '#6C3A5C',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        cursive: ['Caveat', 'cursive'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'star-shine': 'starShine 3s ease-in-out infinite',
        'aurora-move': 'auroraMove 8s ease infinite alternate',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'blob-spin': 'blobSpin 14s linear infinite',
        'swirl': 'swirl 10s ease-in-out infinite alternate',
      },
      keyframes: {
        starShine: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.9', filter: 'drop-shadow(0 0 10px rgba(193, 174, 124, 0.9))' },
          '50%': { transform: 'scale(1.35) rotate(180deg)', opacity: '1', filter: 'drop-shadow(0 0 22px rgba(204, 75, 194, 1))' },
        },
        auroraMove: {
          '0%': { backgroundPosition: '0% 30%' },
          '50%': { backgroundPosition: '100% 70%' },
          '100%': { backgroundPosition: '0% 30%' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(221, 94, 152, 0.3)' },
          '50%': { boxShadow: '0 0 45px rgba(204, 75, 194, 0.65)' },
        },
        blobSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.15)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        swirl: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -20px) scale(1.2)' },
          '100%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        }
      },
    },
  },
  plugins: [],
}
