/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme palette
        dark: {
          900: '#0a0a0f',
          800: '#0e0e16',
          700: '#12121a',
          600: '#1a1a2e',
          500: '#22223a',
          400: '#2a2a45',
        },
        // Primary gradient colors
        primary: {
          400: '#818cf8',
          500: '#667eea',
          600: '#5a67d8',
          700: '#4c51bf',
        },
        accent: {
          400: '#f5a3d0',
          500: '#f093fb',
          600: '#e879f9',
          700: '#d946ef',
        },
        success: '#00d4aa',
        warning: '#ffbe0b',
        danger: '#ff006e',
        // Text
        text: {
          primary: '#f0f0f5',
          secondary: '#8888a0',
          muted: '#55556a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #1a1a2e 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(102, 126, 234, 0.3)',
        'glow-accent': '0 0 20px rgba(240, 147, 251, 0.3)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.2)',
        'hover': '0 12px 40px rgba(102, 126, 234, 0.15)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
