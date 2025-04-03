/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        'propagentic': {
          teal: {
            light: '#50C2A7',
            DEFAULT: '#1E6F68',
            dark: '#186059',
          },
          neutral: {
            light: '#F9FAF9',
            DEFAULT: '#E6E6E6',
            dark: '#3D3D3D',
          }
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 