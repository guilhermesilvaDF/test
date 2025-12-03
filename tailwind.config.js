/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                'dark-bg': '#0d1117',
                'dark-card': '#161b22',
                'dark-border': '#30363d',
                'dark-text': '#c9d1d9',
                'dark-text-muted': '#8b949e',
                'accent-blue': '#58a6ff',
                'accent-green': '#238636',
                'accent-green-hover': '#2dba4e',
            },
        },
    },
    plugins: [],
}
