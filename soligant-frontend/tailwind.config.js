/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "soligant-primary": "#8B0000", // Đỏ đậm/burgundy
        "soligant-primary-dark": "#660000", // Đỏ đậm hơn cho highlight
        "soligant-primary-light": "#A03030", // Đỏ nhạt hơn cho border
        "soligant-secondary": "#F5E8D0", // Màu be/kem
        "soligant-accent": "#6D4C41", // Nâu đất
      },
      fontFamily: {
        rafgins: ["Rafgins", "sans-serif"],
        "utm-avo": ["UTM-Avo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
