/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
        Roboto: ["Roboto", "sans-serif"],
        Garamond: ["EB Garamond", "serif"],
        Bodoni: ["Bodoni Moda", "serif"],
        Caveat: ["Caveat", "cursive"],
        Dancing_Script: ["Dancing Script", "cursive"],
      },
      container: {
        center: true,
      },
      colors: {
        primary: "#24CEED",
        primaryLight: "#3eddfa",
      },
      screens: {
        xsm: "0px",
      },
    },
  },
  plugins: [],
};
