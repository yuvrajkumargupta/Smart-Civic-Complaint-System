/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4338ca', // indigo-700
                    hover: '#3730a3', // indigo-800
                    light: '#e0e7ff', // indigo-100
                },
                secondary: {
                    DEFAULT: '#10b981', // emerald-500
                    hover: '#059669', // emerald-600
                },
                warning: {
                    DEFAULT: '#fbbf24', // amber-400
                    hover: '#f59e0b', // amber-500
                },
                brand: {
                    indigo: '#4f46e5', // indigo-600
                    blue: '#1d4ed8', // blue-700
                    slate: '#1e293b', // slate-800
                    muted: '#64748b', // slate-500
                    bg: '#f8fafc', // slate-50
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            }
        },
    },
    plugins: [],
}
