module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1270px',   // <-- chỉnh ở đây
      '2xl': '1536px',
    },
    extend: {},
  },
  plugins: [],
};