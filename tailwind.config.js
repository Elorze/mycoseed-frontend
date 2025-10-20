/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          foreground: '#ffffff'
        },
        accent: {
          DEFAULT: '#14b8a6',
          foreground: '#ffffff'
        },
        background: '#0a0b0d',
        foreground: '#ffffff',
        card: {
          DEFAULT: '#18181b',
          foreground: '#ffffff'
        },
        border: '#27272a',
        muted: {
          DEFAULT: '#3f3f46',
          foreground: '#a1a1aa'
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff'
        },
        success: {
          DEFAULT: '#10b981',
          foreground: '#ffffff'
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#ffffff'
        },
        info: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff'
        }
      }
    }
  },
  plugins: []
}
