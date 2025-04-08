/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Apply the new Propagentic brand palette
        'propagentic': {
          'teal': '#0D9488',
          'teal-light': '#14B8A6',
          'teal-dark': '#0F766E',
          'neutral-lightest': '#FFFFFF',
          'neutral-light': '#F3F4F6',  // Light Gray for backgrounds
          'neutral': '#E5E7EB',        // Borders, dividers
          'neutral-medium': '#9CA3AF', // Secondary text, icons
          'neutral-dark': '#4B5563',   // Sub-headings, tertiary text (Dark Mode Section BG)
          'slate': '#6B7280',        // Body text
          'slate-dark': '#1F2937',   // Primary headings, strong text (Dark Mode BG)
          'accent': '#7C3AED',        // Purple
          'accent-light': '#A78BFA',
          'success': '#10B981',       // Green
          'warning': '#F59E0B',       // Amber
          'error': '#EF4444',         // Red
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        display: [
          'Poppins',
          'Inter',
          'ui-sans-serif',
          'system-ui'
        ]
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(13, 148, 136, 0.1), 0 2px 4px -1px rgba(13, 148, 136, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(13, 148, 136, 0.1), 0 4px 6px -2px rgba(13, 148, 136, 0.05)',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
} 