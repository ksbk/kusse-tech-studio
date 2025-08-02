/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Flask templates
    './app/templates/**/*.html',
    // New unified frontend directory
    './frontend/src/**/*.{js,ts,jsx,tsx}',
    // Legacy support (during transition)
    './app/static/src/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  darkMode: 'class', // Enable class-based dark mode
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  // Safelist for dynamic classes
  safelist: [
    'dark',
    'bg-gray-900',
    'text-white',
    'border-gray-600',
    // Add any dynamic classes used in JavaScript
    {
      pattern: /^(bg|text|border)-(primary|gray)-(50|100|200|300|400|500|600|700|800|900)$/,
    },
    {
      pattern: /^(hover|focus):(bg|text|border)-(primary|gray)-(50|100|200|300|400|500|600|700|800|900)$/,
    }
  ]
}