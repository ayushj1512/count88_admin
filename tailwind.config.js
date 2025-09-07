/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode via class strategy
  theme: {
    extend: {
      colors: {
        // Optional: define custom colors for both light and dark themes
        lightBg: '#f9fafb',
        lightText: '#1f2937',
        darkBg: '#1f2937',
        darkText: '#f9fafb',
        primary: '#3b82f6',
        primaryDark: '#2563eb',
      },
    },
  },
  plugins: [],
};
