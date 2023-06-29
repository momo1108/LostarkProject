/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{tsx,ts}", "./components/**/*.{tsx,ts}"],
  theme: {
    extend: {},
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
