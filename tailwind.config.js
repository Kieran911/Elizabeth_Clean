/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,liquid}',
    './templates/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
  ],
  theme: {
    extend: {
      height: {
        '94' : '22rem',
      },
    },
  },
  plugins: [],
};
