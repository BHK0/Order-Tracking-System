/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    borderRadius: {
      'none': '0',
      'sm': '0.125rem',
      DEFAULT: '4px',
      'md': '0.65rem', 
      'lg': '64px',
      'full': '9999px',
      'large': '16px',
      '2xl': '1rem',
    },
    extend: {
      fontFamily: {
        'avenir-arabic': ['Avenir Arabic', 'sans-serif'],
      },
      transitionTimingFunction: {
        'cubic-bezier': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundColor: {
        '212121': '#212121',
      },
      textColor: {
        '2196f3': '#2196f3',
      },
      borderColor: {
        '1a73e8': '#1a73e8',
      },
    },
  },
  plugins: [],
};
