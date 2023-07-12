/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      green: "#2ECC71",
      green2: "#22c55e",
      green3: "#86efac",
      green4: "#f0fdf4",
      grey: "#C4C4C4",
      grey2: "#e5e5e5",
      gray: "#6B6B6B",
      blue: "#667DF8",
      purple: "#646E9E",
      amber: "#f59e0b",
      red: "#FF5023",
      white: "#ffffff",
      black: "#000000",
      transparent: "transparent",
    },
    extend: {
      borderColor: {
        DEFAULT: "#AFAFAF",
      },
    },
  },
  plugins: [],
};
