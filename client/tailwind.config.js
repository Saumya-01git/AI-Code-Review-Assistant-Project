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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'star-shine': 'starShine 3s ease-in-out infinite',
        'aurora-move': 'auroraMove 12s ease infinite alternate',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        starShine: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.85', filter: 'drop-shadow(0 0 8px rgba(221, 94, 152, 0.8))' },
          '50%': { transform: 'scale(1.25) rotate(180deg)', opacity: '1', filter: 'drop-shadow(0 0 18px rgba(204, 75, 194, 1))' },
        },
        auroraMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(221, 94, 152, 0.25)' },
          '50%': { boxShadow: '0 0 30px rgba(204, 75, 194, 0.55)' },
        }
      }
    },
  },
  plugins: [],
}
