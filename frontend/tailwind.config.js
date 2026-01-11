import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        brand: {
          DEFAULT: '#1e3a8a',
          light: '#3b82f6',
          dark: '#1e293b'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
