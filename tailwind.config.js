/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Fixed the glob pattern
  theme: {
    extend: {
      backgroundImage: {
        "matrix-pattern":
          "url('https://i.pinimg.com/originals/c5/9a/d2/c59ad2bd4ad2fbacd04017debc679ddb.gif')", // Fixed syntax for URL
      },
    },
  },
  plugins: [],
};
