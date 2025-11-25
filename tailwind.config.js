/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          'monospace'
        ],
      },
      colors: {
        primary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
         card: 'white',
        'card-foreground': '#171717',
        muted: '#f5f5f5',
        'muted-foreground': '#737373',
        destructive: '#dc2626',
        input: 'white',
        accent: '#f5f5f5',
        'accent-foreground': '#171717',
        ring: '#3b82f6',
        border: '#e5e5e5',
      },
      borderRadius: {
        apple: '12px',
        appleLg: '18px', // Utilisez camelCase pour les clés
      }
    },
  },
  plugins: [],
}