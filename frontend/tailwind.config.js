module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  important: "#root",
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "blue-dark": "#FEF1E5",
        "blue-light": "#f4efeb",
      },
      borderRadius: {
        "4xl": "100px",
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [],
};
