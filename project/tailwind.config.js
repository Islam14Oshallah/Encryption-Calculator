/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'light-bg': '#f0f4f8',
        'light-card': '#ffffff',
        'light-text': '#2d3748', 
        'light-primary': '#3182ce',
        'light-secondary': '#ebf8ff',
        'light-border': '#cbd5e0',
        
        // Keep dark mode colors as they are
      }
    },
  },
  plugins: [],
};
